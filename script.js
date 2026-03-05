let sanskritDatabase = {};

// वर्ण संयोजन सहायक फंक्शन (Halant + Vowel Joiner)
function joinSanskrit(text) {
    const vowelMap = { '्अ': '', '्आ': 'ा', '्इ': 'ि', '्ई': 'ी', '्उ': 'ु', '्ऊ': 'ू', '्ऋ': 'ृ', '्ए': 'े', '्ऐ': 'ै', '्ओ': 'ो', '्औ': 'ौ' };
    for (let [key, val] of Object.entries(vowelMap)) { text = text.split(key).join(val); }
    return text;
}

// ==================================================
// ⭐ पाणिनीय प्रथम पाद (संज्ञा) लॉजिक (1.1.3, 1.1.51, 1.1.65) ⭐
// ==================================================

function autoGuna(d) {
    if (d.endsWith('ि') || d.endsWith('ी')) return d.slice(0, -1) + 'े';
    if (d.endsWith('ु') || d.endsWith('ू')) return d.slice(0, -1) + 'ो';
    if (d.endsWith('ृ')) return d.slice(0, -1) + 'र्'; 

    if (d.endsWith('्')) {
        return d.replace(/ि([क-ह]्)$/, 'े$1')
                .replace(/ु([क-ह]्)$/, 'ो$1')
                .replace(/ृ([क-ह]्)$/, 'र्$1');
    }
    return d; 
}

function autoVriddhi(d) {
    if (d.endsWith('ि') || d.endsWith('ी')) return d.slice(0, -1) + 'ै';
    if (d.endsWith('ु') || d.endsWith('ू')) return d.slice(0, -1) + 'ौ';
    if (d.endsWith('ृ')) return d.slice(0, -1) + 'ार्'; 

    if (d.endsWith('्') && !d.match(/[ािीुूृेैोौ][क-ह]्$/) && !d.match(/[क-ह]्[क-ह]्$/)) {
        return d.replace(/([क-ह])([क-ह]्)$/, '$1ा$2'); 
    }
    
    if (d.endsWith('्')) {
        return d.replace(/ि([क-ह]्)$/, 'े$1')
                .replace(/ु([क-ह]्)$/, 'ो$1')
                .replace(/ृ([क-ह]्)$/, 'र्$1');
    }
    return d; 
}

// 1. Fetch JSON Data
async function loadDatabase() {
    try {
        const response = await fetch('database.json');
        if (!response.ok) throw new Error(`HTTP error!`);
        sanskritDatabase = await response.json();
        initializeUI();
    } catch (error) { 
        alert("डेटा लोड नहीं हो सका। कृपया सुनिश्चित करें कि Live Server चल रहा है।"); 
    }
}

// 2. Initialize UI (Datalist & Sutra Update)
function initializeUI() {
    let upaList = document.getElementById("upaList");
    if (upaList && sanskritDatabase.upasargas) {
        sanskritDatabase.upasargas.forEach(u => {
            if(u.id !== "") upaList.insertAdjacentHTML('beforeend', `<option value="${u.id}">${u.label}</option>`);
        });
    }

    let dhatuList = document.getElementById("dhatuList");
    if (dhatuList && sanskritDatabase.dhatus) {
        for (let key in sanskritDatabase.dhatus) {
            dhatuList.insertAdjacentHTML('beforeend', `<option value="${key}">${sanskritDatabase.dhatus[key].label}</option>`);
        }
    }

    let pratList = document.getElementById("pratList");
    if (pratList && sanskritDatabase.pratyayas) {
        for (let key in sanskritDatabase.pratyayas) {
            pratList.insertAdjacentHTML('beforeend', `<option value="${key}">${sanskritDatabase.pratyayas[key].label}</option>`);
        }
    }

    let dropdownContainer = document.getElementById("sutraDropdown");
    if (dropdownContainer) {
        
        // सामान्य सूत्र (पहले से मौजूद)
        if (sanskritDatabase.sutras) {
            sanskritDatabase.sutras.forEach(s => {
                dropdownContainer.insertAdjacentHTML('beforeend', `<div class="sutra-item"><div class="sutra-header sanskrit-text" onclick="toggleAccordion(event, this)">${s.name} <i class="fa-solid fa-chevron-down"></i></div><div class="sutra-desc sanskrit-text"><br>${s.desc}<br><br></div></div>`);
            });
        }
        
        // पाद 1.1: संज्ञा सूत्र (हरे रंग के बॉर्डर के साथ)
        if (sanskritDatabase.samjnaSutras) {
            sanskritDatabase.samjnaSutras.forEach(s => {
                dropdownContainer.insertAdjacentHTML('beforeend', `<div class="sutra-item" style="border-left: 3px solid #10b981;"><div class="sutra-header sanskrit-text" onclick="toggleAccordion(event, this)">[${s.id}] ${s.name} <i class="fa-solid fa-chevron-down"></i></div><div class="sutra-desc sanskrit-text"><br>${s.desc}<br><br></div></div>`);
            });
        }
        
        // पाद 1.2: (नीले रंग के बॉर्डर के साथ)
        if (sanskritDatabase.pada_1_2) {
            sanskritDatabase.pada_1_2.forEach(s => {
                dropdownContainer.insertAdjacentHTML('beforeend', `<div class="sutra-item" style="border-left: 3px solid #3b82f6;"><div class="sutra-header sanskrit-text" onclick="toggleAccordion(event, this)">[${s.id}] ${s.name} <i class="fa-solid fa-chevron-down"></i></div><div class="sutra-desc sanskrit-text"><br>${s.desc}<br><br></div></div>`);
            });
        }

        // पाद 1.3: (गुलाबी रंग के बॉर्डर के साथ) --> यही मिसिंग था!
        if (sanskritDatabase.pada_1_3) {
            sanskritDatabase.pada_1_3.forEach(s => {
                dropdownContainer.insertAdjacentHTML('beforeend', `<div class="sutra-item" style="border-left: 3px solid #ec4899;"><div class="sutra-header sanskrit-text" onclick="toggleAccordion(event, this)">[${s.id}] ${s.name} <i class="fa-solid fa-chevron-down"></i></div><div class="sutra-desc sanskrit-text"><br>${s.desc}<br><br></div></div>`);
            });
        }

    } // End of dropdownContainer block
}

window.onload = loadDatabase;

// ==================================================
// 🛠️ MAIN DYNAMIC PANINIAN ENGINE 🛠️
// ==================================================
function generateKridanta() {
    let upa = document.getElementById("upasarga").value.trim();
    let dhatuStr = document.getElementById("dhatu").value.trim();
    let pratStr = document.getElementById("pratyaya").value.trim();

    if(!dhatuStr || !pratStr) { 
        alert("कृपया कम से कम एक धातु और प्रत्यय टाइप करें!"); 
        return; 
    }

    let steps = [];
    let baseForm = "";
    let finalForm = "";

    steps.push(`<b>शुरुआत:</b> ${upa ? upa + ' + ' : ''}${dhatuStr} + ${pratStr}`);

    if (pratStr === "क्त्वा" && upa !== "") {
        steps.push(`उपसर्ग होने के कारण 'क्त्वा' के स्थान पर 'ल्यप्' आदेश हुआ।`);
        pratStr = "ल्यप्";
    }

    // ⭐ डायनामिक फॉलबैक (अज्ञात धातु/प्रत्यय के लिए)
    let dhatuData = sanskritDatabase.dhatus[dhatuStr];
    if (!dhatuData) {
        steps.push(`<i>(नोट: यह धातु कस्टम है, सिस्टम 'अलोऽन्त्यात् पूर्व उपधा' नियम लगा रहा है)</i>`);
        dhatuData = {
            isSet: true,
            guna: autoGuna(dhatuStr),
            vriddhi: autoVriddhi(dhatuStr)
        };
    }

    let pratData = sanskritDatabase.pratyayas[pratStr];
    if (!pratData) {
        steps.push(`<i>(नोट: यह प्रत्यय कस्टम है, इसे 'अकित्' मानकर प्रोसेस किया जा रहा है)</i>`);
        pratData = {
            real: pratStr,
            type: "akit",
            isValadi: !['अ','आ','इ','ई','उ','ऊ','ए','ऐ','ओ','औ'].includes(pratStr.charAt(0)), 
            lopa: "सामान्य कस्टम प्रत्यय"
        };
    }

    steps.push(`<b>इत्-लोप:</b> ${pratData.lopa} -> शेष बचा: <b>${pratData.real}</b>`);
    let activePratyaya = (pratStr === "ल्यप्") ? "य" : pratData.real;
    let activeDhatu = dhatuStr;

    // इट्-आगम
    let itAgama = false;
    if (pratStr !== "ल्यप्") {
        if (dhatuData.isSet && pratData.isValadi) {
            itAgama = true;
            steps.push(`<b>इट्-आगम:</b> धातु सेट् और प्रत्यय वलादि है, अतः 'इट् (इ)' का आगम हुआ।`);
        } else if (!dhatuData.isSet && pratData.isValadi) {
            steps.push(`धातु अनिट् है, अतः 'इट्' का आगम नहीं हुआ।`);
        }
    }

    // गुण / वृद्धि (क्ङिति च)
    if (pratData.type === "kit") {
        steps.push(`<b>गुण/वृद्धि निषेध:</b> प्रत्यय कित् है, अतः 'क्ङिति च' से गुण/वृद्धि नहीं होगी।`);
        activeDhatu = dhatuStr; 
    } else if (pratData.type === "nnit") {
        activeDhatu = dhatuData.vriddhi;
        steps.push(`<b>वृद्धि:</b> धातु को वृद्धि हुई -> <b>${activeDhatu}</b>`);
    } else if (pratData.type === "akit") {
        activeDhatu = dhatuData.guna;
        steps.push(`<b>गुण:</b> धातु को गुण हुआ -> <b>${activeDhatu}</b>`);
    }

    // तुक् (त्) आगम
    if (pratStr === "ल्यप्") {
        let shortVowels = ["अ", "इ", "उ", "ऋ", "ि", "ु", "ृ"]; 
        if (shortVowels.includes(activeDhatu.slice(-1))) {
            activePratyaya = "त्य";
            steps.push(`<b>तुक् आगम:</b> धातु ह्रस्वान्त है, अतः 'तुक् (त्)' का आगम हुआ।`);
        }
    }

    // विशेष अपवाद
    if (dhatuStr === "गम्" && (pratStr === "क्त" || pratStr === "क्त्वा")) {
        activeDhatu = "ग";
        steps.push(`विशेष नियम: 'गम्' के मकार का लोप हुआ।`);
    }

    // संयोजन
    if (itAgama) {
        baseForm = activeDhatu + "इ" + activePratyaya; 
    } else {
        baseForm = activeDhatu + activePratyaya; 
        if (baseForm.includes("म्त") || baseForm.includes("म्ता") || baseForm.includes("म्त्व")) {
            baseForm = baseForm.replace("म्त", "न्त").replace("म्त्व", "न्त्व");
            steps.push(`अनुस्वार/परसवर्ण सन्धि से 'म्' को 'न्' हुआ।`);
        }
    }

    // वर्ण संयोजन
    let joinedForm = joinSanskrit(baseForm);
    if(baseForm !== joinedForm) {
        steps.push(`<b>वर्ण संयोजन:</b> हलन्त और स्वर मिलकर पूर्ण अक्षर बने -> <b>${joinedForm}</b>`);
        baseForm = joinedForm;
    }

    // उपसर्ग सन्धि
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
