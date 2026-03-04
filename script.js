let sanskritDatabase = {};

// 1. Fetch JSON Data
async function loadDatabase() {
    try {
        const response = await fetch('database.json');
        if (!response.ok) throw new Error(`HTTP error!`);
        sanskritDatabase = await response.json();
        initializeUI();
    } catch (error) {
        alert("डेटा लोड नहीं हो सका। कृपया Live Server का उपयोग करें।");
    }
}

// 2. Initialize UI
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

// 3. PANINIAN RULE ENGINE
function generateKridanta() {
    let upa = document.getElementById("upasarga").value;
    let dhatuStr = document.getElementById("dhatu").value;
    let pratStr = document.getElementById("pratyaya").value;

    let steps = [];
    let baseForm = "";
    let finalForm = "";

    steps.push(`<b>शुरुआत:</b> ${upa ? upa + ' + ' : ''}${dhatuStr} + ${pratStr}`);

    // ल्यप् आदेश नियम
    if (pratStr === "क्त्वा" && upa !== "") {
        steps.push(`उपसर्ग होने के कारण 'क्त्वा' के स्थान पर 'ल्यप्' आदेश हुआ।`);
        pratStr = "ल्यप्";
    }

    let dhatuData = sanskritDatabase.dhatus[dhatuStr];
    let pratData = sanskritDatabase.pratyayas[pratStr];

    if (!dhatuData || !pratData) return;

    // स्टेप 1: इत्-संज्ञा लोप
    steps.push(`<b>इत्-लोप:</b> ${pratData.lopa} -> शेष बचा: <b>${pratData.real}</b>`);
    let activePratyaya = pratData.real;
    let activeDhatu = dhatuStr;

    // स्टेप 2: इट्-आगम (Set/Anit Logic)
    let itAgama = false;
    if (dhatuData.isSet && pratData.isValadi) {
        itAgama = true;
        steps.push(`<b>इट्-आगम:</b> धातु सेट् है और प्रत्यय वलादि है, अतः 'इट् (इ)' का आगम हुआ।`);
    } else if (!dhatuData.isSet && pratData.isValadi) {
        steps.push(`धातु अनिट् है, अतः 'इट्' का आगम नहीं हुआ।`);
    } else if (!pratData.isValadi) {
        steps.push(`प्रत्यय अजादि (स्वर से शुरू) है, अतः 'इट्' का आगम नहीं हुआ।`);
    }

    // स्टेप 3: गुण / वृद्धि (Kit, Nnit, Akit Logic)
    if (pratData.type === "kit") {
        steps.push(`<b>गुण/वृद्धि निषेध:</b> प्रत्यय कित् है, अतः 'क्ङिति च' सूत्र से गुण/वृद्धि नहीं होगी।`);
        activeDhatu = dhatuStr; 
    } 
    else if (pratData.type === "nnit") {
        activeDhatu = dhatuData.vriddhi;
        steps.push(`<b>वृद्धि:</b> प्रत्यय ञित्/णित् होने से धातु को वृद्धि हुई -> <b>${activeDhatu}</b>`);
    } 
    else if (pratData.type === "akit") {
        activeDhatu = dhatuData.guna;
        steps.push(`<b>गुण:</b> 'सार्वधातुकार्धधातुकयोः' से धातु को गुण हुआ -> <b>${activeDhatu}</b>`);
    }

    // स्टेप 4: संयोजन (Joining)
    // विशेष अपवाद (गम् + क्त = गत)
    if (dhatuStr === "गम्" && (pratStr === "क्त" || pratStr === "क्त्वा")) {
        activeDhatu = "ग";
        steps.push(`विशेष नियम: 'अनुदात्तोपदेश...' से मकार का लोप हुआ।`);
    }

    if (itAgama) {
        // अगर धातु में हलन्त (्) है तो 'इ' मात्रा बनेगी (पठ् + इ = पठि)
        if (activeDhatu.endsWith("्")) {
            baseForm = activeDhatu.slice(0, -1) + "ि" + activePratyaya;
        } else {
            baseForm = activeDhatu + "ि" + activePratyaya; // Exception fallback
        }
    } else {
        // बिना इट् आगम के सीधा जुड़ाव (कर् + तव्य = कर्तव्य)
        baseForm = activeDhatu + activePratyaya;
        
        // हलन्त सन्धि फिक्स (गम् + तव्य = गन्तव्य)
        if (baseForm.includes("म्त") || baseForm.includes("म्ता")) {
            baseForm = baseForm.replace("म्त", "न्त");
            steps.push(`अनुस्वार/परसवर्ण सन्धि से 'म्' को 'न्' हुआ।`);
        }
    }

    // स्टेप 5: उपसर्ग सन्धि
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
function toggleSutraDropdown(event) {
    event.stopPropagation();
    document.getElementById("sutraDropdown").classList.toggle("show");
}
function toggleAccordion(event, element) {
    event.stopPropagation();
    element.parentElement.classList.toggle("active");
}
window.onclick = function(event) {
    if (!event.target.closest('.nav-dropdown')) {
        document.querySelectorAll(".dropdown-content.show").forEach(el => el.classList.remove('show'));
    }
}
function toggleDark() {
    document.body.classList.toggle("dark");
    let icon = document.getElementById("theme-icon");
    icon.classList.replace(document.body.classList.contains("dark") ? "fa-moon" : "fa-sun", document.body.classList.contains("dark") ? "fa-sun" : "fa-moon");
    closeMobileMenu();
}
