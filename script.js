let sanskritDatabase = {};

function joinSanskrit(text) {
    const vowelMap = { '्अ': '', '्आ': 'ा', '्इ': 'ि', '्ई': 'ी', '्उ': 'ु', '्ऊ': 'ू', '्ऋ': 'ृ', '्ए': 'े', '्ऐ': 'ै', '्ओ': 'ो', '्औ': 'ौ' };
    for (let [key, val] of Object.entries(vowelMap)) { text = text.split(key).join(val); }
    return text;
}

async function loadDatabase() {
    try {
        const response = await fetch('database.json');
        if (!response.ok) throw new Error(`HTTP error!`);
        sanskritDatabase = await response.json();
        initializeUI();
    } catch (error) { alert("डेटा लोड नहीं हो सका। कृपया Live Server का उपयोग करें।"); }
}

function initializeUI() {
    let upaSelect = document.getElementById("upasarga");
    sanskritDatabase.upasargas.forEach(u => upaSelect.options.add(new Option(u.label, u.id)));

    let dhatuSelect = document.getElementById("dhatu");
    for (let key in sanskritDatabase.dhatus) dhatuSelect.options.add(new Option(sanskritDatabase.dhatus[key].label, key));

    let pratSelect = document.getElementById("pratyaya");
    for (let key in sanskritDatabase.pratyayas) pratSelect.options.add(new Option(sanskritDatabase.pratyayas[key].label, key));

    let dropdownContainer = document.getElementById("sutraDropdown");
    sanskritDatabase.sutras.forEach(s => {
        let div = document.createElement("div");
        div.className = "sutra-item";
        div.innerHTML = `<div class="sutra-header sanskrit-text" onclick="toggleAccordion(event, this)">${s.name} <i class="fa-solid fa-chevron-down"></i></div><div class="sutra-desc sanskrit-text"><br>${s.desc}<br><br></div>`;
        dropdownContainer.appendChild(div);
    });
}

window.onload = loadDatabase;

// ==================================================
// 🛠️ MAIN PANINIAN RULE ENGINE 🛠️
// ==================================================
function generateKridanta() {
    let upa = document.getElementById("upasarga").value;
    let dhatuStr = document.getElementById("dhatu").value;
    let pratStr = document.getElementById("pratyaya").value;

    let steps = [];
    let baseForm = "";
    let finalForm = "";

    steps.push(`<b>शुरुआत:</b> ${upa ? upa + ' + ' : ''}${dhatuStr} + ${pratStr}`);

    // --------------------------------------------------
    // 👉 ब्लॉक 1: प्रत्यय के विशेष नियम (PRATYAYA EXCEPTIONS) 👈
    // (जैसे क्त्वा का ल्यप् होना)
    // --------------------------------------------------
    if (pratStr === "क्त्वा" && upa !== "") {
        steps.push(`उपसर्ग होने के कारण 'क्त्वा' के स्थान पर 'ल्यप्' आदेश हुआ।`);
        pratStr = "ल्यप्";
    }
    // 👉 और प्रत्यय नियम यहाँ जोड़ें...

    let dhatuData = sanskritDatabase.dhatus[dhatuStr];
    let pratData = sanskritDatabase.pratyayas[pratStr];
    if (!dhatuData || !pratData) return;

    steps.push(`<b>इत्-लोप:</b> ${pratData.lopa} -> शेष बचा: <b>${pratData.real}</b>`);
    let activePratyaya = (pratStr === "ल्यप्") ? "य" : pratData.real;
    let activeDhatu = dhatuStr;

    // इट्-आगम (Set/Anit)
    let itAgama = false;
    if (pratStr !== "ल्यप्") {
        if (dhatuData.isSet && pratData.isValadi) {
            itAgama = true;
            steps.push(`<b>इट्-आगम:</b> धातु सेट् है और प्रत्यय वलादि है, अतः 'इट् (इ)' का आगम हुआ।`);
        } else if (!dhatuData.isSet && pratData.isValadi) {
            steps.push(`धातु अनिट् है, अतः 'इट्' का आगम नहीं हुआ।`);
        }
    }

    // गुण / वृद्धि (Kit, Nnit, Akit)
    if (pratData.type === "kit") {
        steps.push(`<b>गुण/वृद्धि निषेध:</b> प्रत्यय कित् है, अतः गुण/वृद्धि नहीं होगी।`);
        activeDhatu = dhatuStr; 
    } else if (pratData.type === "nnit") {
        activeDhatu = dhatuData.vriddhi;
        steps.push(`<b>वृद्धि:</b> प्रत्यय ञित्/णित् है, अतः धातु को वृद्धि हुई -> <b>${activeDhatu}</b>`);
    } else if (pratData.type === "akit") {
        activeDhatu = dhatuData.guna;
        steps.push(`<b>गुण:</b> धातु को गुण हुआ -> <b>${activeDhatu}</b>`);
    }

    // तुक् (त्) आगम (ल्यप् के लिए)
    if (pratStr === "ल्यप्") {
        let shortVowels = ["अ", "इ", "उ", "ऋ", "ि", "ु", "ृ"]; 
        if (shortVowels.includes(activeDhatu.slice(-1))) {
            activePratyaya = "त्य";
            steps.push(`<b>तुक् आगम:</b> धातु ह्रस्वान्त है, अतः 'तुक् (त्)' का आगम हुआ।`);
        }
    }

    // --------------------------------------------------
    // 👉 ब्लॉक 2: धातु के विशेष नियम (DHATU EXCEPTIONS) 👈
    // (जैसे गम् + क्त = गत, हन् + क्त = हत)
    // --------------------------------------------------
    if (dhatuStr === "गम्" && (pratStr === "क्त" || pratStr === "क्त्वा")) {
        activeDhatu = "ग";
        steps.push(`विशेष नियम: 'अनुदात्तोपदेश...' से मकार का लोप हुआ।`);
    }
    // 👉 नई धातु के अपवाद यहाँ जोड़ें...
    /* उदाहरण:
    if (dhatuStr === "हन्" && pratStr === "क्त") {
        activeDhatu = "ह";
        steps.push(`मकार/नकार का लोप हुआ।`);
    }
    */

    // संयोजन (Joining)
    if (itAgama) {
        baseForm = activeDhatu + "इ" + activePratyaya; 
    } else {
        baseForm = activeDhatu + activePratyaya; 
        
        // --------------------------------------------------
        // 👉 ब्लॉक 3: हलन्त सन्धि के विशेष नियम (SANDHI EXCEPTIONS) 👈
        // (जैसे म्+त = न्त, च्+त = क्त, श्+त = ष्ट)
        // --------------------------------------------------
        if (baseForm.includes("म्त") || baseForm.includes("म्ता") || baseForm.includes("म्त्व")) {
            baseForm = baseForm.replace("म्त", "न्त").replace("म्त्व", "न्त्व");
            steps.push(`अनुस्वार/परसवर्ण सन्धि से 'म्' को 'न्' हुआ।`);
        }
        // 👉 नए सन्धि नियम यहाँ जोड़ें...
        /* उदाहरण:
        if (baseForm.includes("च्त")) {
            baseForm = baseForm.replace("च्त", "क्त"); // पच् + त = पक्त (पक्व)
            steps.push(`चोः कुः सूत्र से च् को क् हुआ।`);
        }
        */
    }

    // वर्ण संयोजन
    let joinedForm = joinSanskrit(baseForm);
    if(baseForm !== joinedForm) {
        steps.push(`<b>वर्ण संयोजन:</b> हलन्त और स्वर मिलकर पूर्ण अक्षर बने -> <b>${joinedForm}</b>`);
        baseForm = joinedForm;
    }

    // --------------------------------------------------
    // 👉 ब्लॉक 4: उपसर्ग सन्धि (UPASARGA SANDHI) 👈
    // --------------------------------------------------
    if (upa !== "") {
        let uBase = upa === "आङ्" ? "आ" : upa;
        steps.push(`उपसर्ग '${uBase}' का '${baseForm}' के साथ योग।`);

        if (uBase === "सम्") {
            finalForm = "सं" + baseForm;
            steps.push(`'मोऽनुस्वारः' से 'म्' का अनुस्वार हुआ।`);
        } else if (uBase === "उत्") {
            finalForm = "उद्" + baseForm;
        } else if (uBase === "वि" && baseForm.startsWith("अ")) {
            finalForm = "व्य" + baseForm.slice(1);
        } else {
            finalForm = uBase + baseForm;
        }
    } else {
        finalForm = baseForm;
    }

    steps.push(`<b>अंतिम शब्द:</b> <span style="color:#ec4899; font-size:1.2em;">${finalForm}</span>`);

    document.getElementById("finalOutput").innerText = finalForm;
    let stepsHtml = steps.map((s, index) => `<li class="step-item"><div style="background:#3b82f6; color:white; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-weight:bold; font-size:14px;">${index+1}</div> <div>${s}</div></li>`).join("");
    document.getElementById("prakriyaSteps").innerHTML = stepsHtml;

    document.getElementById("resultSection").classList.add("active");
    document.getElementById("prakriyaBox").classList.remove("show");
    setTimeout(() => { document.getElementById("resultSection").scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 100);
}

// UI Interactions
function togglePrakriya() { document.getElementById("prakriyaBox").classList.toggle("show"); }
function toggleMobileMenu() {
    const nav = document.getElementById("nav-menu");
    const icon = document.getElementById("menu-icon");
    nav.classList.toggle("active");
    if(nav.classList.contains("active")) {
        icon.classList.replace("fa-bars", "fa-xmark");
        document.body.style.overflow = "hidden";
    } else {
        icon.classList.replace("fa-xmark", "fa-bars");
        document.body.style.overflow = "auto";
    }
}
function closeMobileMenu() { if(window.innerWidth <= 768) toggleMobileMenu(); }
function toggleSutraDropdown(event) { event.stopPropagation(); document.getElementById("sutraDropdown").classList.toggle("show"); }
function toggleAccordion(event, element) { event.stopPropagation(); element.parentElement.classList.toggle("active"); }
window.onclick = function(event) { if (!event.target.closest('.nav-dropdown')) document.querySelectorAll(".dropdown-content.show").forEach(el => el.classList.remove('show')); }
function toggleDark() {
    document.body.classList.toggle("dark");
    document.getElementById("theme-icon").classList.replace(document.body.classList.contains("dark") ? "fa-moon" : "fa-sun", document.body.classList.contains("dark") ? "fa-sun" : "fa-moon");
    closeMobileMenu();
}
