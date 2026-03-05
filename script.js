let sanskritDatabase = {};

// ==================================================
// 1. वर्ण संयोजन सहायक (Halant + Vowel Joiner)
// ==================================================
function joinSanskrit(text) {
    const vowelMap = { '्अ': '', '्आ': 'ा', '्इ': 'ि', '्ई': 'ी', '्उ': 'ु', '्ऊ': 'ू', '्ऋ': 'ृ', '्ए': 'े', '्ऐ': 'ै', '्ओ': 'ो', '्औ': 'ौ' };
    for (let [key, val] of Object.entries(vowelMap)) { text = text.split(key).join(val); }
    return text;
}

// ==================================================
// 2. गुण और वृद्धि लॉजिक (सार्वधातुकार्धधातुकयोः / अचो ञ्णिति)
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

    // अलोऽन्त्यात् पूर्व उपधा (व्यंजन से पूर्व 'अ' को 'आ')
    if (d.endsWith('्') && !d.match(/[ािीुूृेैोौ][क-ह]्$/) && !d.match(/[क-ह]्[क-ह]्$/)) {
        return d.replace(/([क-ह])([क-ह]्)$/, '$1ा$2'); 
    }
    
    if (d.endsWith('्')) {
        return d.replace(/ि([क-ह]्)$/, 'ै$1')
                .replace(/ु([क-ह]्)$/, 'ौ$1')
                .replace(/ृ([क-ह]्)$/, 'ार्$1');
    }
    return d; 
}

// ==================================================
// 3. 🕉️ पाणिनीय सन्धि इंजन (Paninian Sandhi Engine) 🕉️
// ==================================================
function applySandhi(word1, word2) {
    if (!word1) return word2;
    if (!word2) return word1;

    let w1 = word1.slice(0, -1); 
    let lastChar = word1.slice(-1); 
    let firstChar = word2.charAt(0); 
    let w2 = word2.slice(1); 

    let isVowel = ['अ','आ','इ','ई','उ','ऊ','ऋ','ए','ऐ','ओ','औ'].includes(firstChar);
    let isConsonantWithImplicitA = "कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह".includes(lastChar);

    // 1. अकः सवर्णे दीर्घः / आद् गुणः / वृद्धिरेचि (मात्रा रहित पूर्ण वर्णों के लिए)
    if (isConsonantWithImplicitA) {
        if (firstChar === 'अ' || firstChar === 'आ') return w1 + lastChar + 'ा' + w2; 
        if (firstChar === 'इ' || firstChar === 'ई') return w1 + lastChar + 'े' + w2; 
        if (firstChar === 'उ' || firstChar === 'ऊ') return w1 + lastChar + 'ो' + w2; 
        if (firstChar === 'ऋ') return w1 + lastChar + 'र्' + w2; 
        if (firstChar === 'ए' || firstChar === 'ऐ') return w1 + lastChar + 'ै' + w2;
        if (firstChar === 'ओ' || firstChar === 'औ') return w1 + lastChar + 'ौ' + w2;
    }

    // 2. इको यणचि (मात्रा के साथ)
    if ((lastChar === 'ि' || lastChar === 'ी') && isVowel) return w1 + '्' + 'य्' + firstChar + w2;
    if ((lastChar === 'ु' || lastChar === 'ू') && isVowel) return w1 + '्' + 'व्' + firstChar + w2;
    if ((lastChar === 'ृ' || lastChar === 'ॄ') && isVowel) return w1 + '्' + 'र्' + firstChar + w2;

    // 3. एचोऽयवायावः (मात्रा के साथ)
    if (lastChar === 'े' && isVowel) return w1 + 'य्' + firstChar + w2; 
    if (lastChar === 'ै' && isVowel) return w1 + 'ा' + 'य्' + firstChar + w2;
    if (lastChar === 'ो' && isVowel) return w1 + 'व्' + firstChar + w2;
    if (lastChar === 'ौ' && isVowel) return w1 + 'ा' + 'व्' + firstChar + w2;

    // 4. मोऽनुस्वारः (म् + व्यंजन = ं)
    if (lastChar === 'म्' && !isVowel) {
        return w1 + 'ं' + firstChar + w2;
    }

    // 5. व्यंजन सन्धियाँ (श् + त = ष्ट, च् + त = क्त आदि)
    if (lastChar === 'श्' && firstChar === 'त') return w1 + 'ष्ट' + w2; // दृष्ट
    if (lastChar === 'च्' && firstChar === 'त') return w1 + 'क्त' + w2; // पक्त
    if (lastChar === 'ज्' && firstChar === 'त') return w1 + 'क्त' + w2; // भुक्त

    return word1 + word2;
}

// ==================================================
// 4. डेटाबेस लोडिंग और UI सेटअप
// ==================================================
async function loadDatabase() {
    try {
        const timestamp = new Date().getTime();
        const response = await fetch(`database.json?v=${timestamp}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        sanskritDatabase = await response.json();
        initializeUI();
    } catch (error) { 
        alert("डेटा लोड नहीं हो सका। कृपया JSON फ़ाइल की जाँच करें।"); 
    }
}

function initializeUI() {
    // Upasarga, Dhatu, Pratyaya Dropdowns Populate
    let upaList = document.getElementById("upaList");
    if (upaList && sanskritDatabase.upasargas) {
        sanskritDatabase.upasargas.forEach(u => { if(u.id !== "") upaList.insertAdjacentHTML('beforeend', `<option value="${u.id}">${u.label}</option>`); });
    }
    let dhatuList = document.getElementById("dhatuList");
    if (dhatuList && sanskritDatabase.dhatus) {
        for (let key in sanskritDatabase.dhatus) { dhatuList.insertAdjacentHTML('beforeend', `<option value="${key}">${sanskritDatabase.dhatus[key].label}</option>`); }
    }
    let pratList = document.getElementById("pratList");
    if (pratList && sanskritDatabase.pratyayas) {
        for (let key in sanskritDatabase.pratyayas) { pratList.insertAdjacentHTML('beforeend', `<option value="${key}">${sanskritDatabase.pratyayas[key].label}</option>`); }
    }

    // Load Sutras dynamically
    let dropdownContainer = document.getElementById("sutraDropdown");
    if (dropdownContainer) {
        const padaConfig = [
            { key: 'samjnaSutras', color: '#10b981' }, { key: 'pada_1_2', color: '#3b82f6' }, { key: 'pada_1_3', color: '#ec4899' }, { key: 'pada_1_4', color: '#eab308' },
            { key: 'pada_2_1', color: '#b91c1c' }, { key: 'pada_2_2', color: '#f97316' }, { key: 'pada_2_3', color: '#d946ef' }, { key: 'pada_2_4', color: '#06b6d4' },
            { key: 'pada_3_1', color: '#8b5cf6' }, { key: 'pada_3_2', color: '#14b8a6' }, { key: 'pada_3_3', color: '#6366f1' }, { key: 'pada_3_4', color: '#dc2626' },
            { key: 'pada_4_1', color: '#f472b6' }, { key: 'pada_4_2', color: '#9333ea' }, { key: 'pada_4_3', color: '#e11d48' }, { key: 'pada_4_4', color: '#10b981' },
            { key: 'pada_5_1', color: '#4f46e5' }, { key: 'pada_5_2', color: '#ea580c' }, { key: 'pada_5_3', color: '#14b8a6' }, { key: 'pada_5_4', color: '#0ea5e9' },
            { key: 'pada_6_1', color: '#78350f' }, { key: 'pada_6_2', color: '#475569' }, { key: 'pada_6_3', color: '#3b82f6' }, { key: 'pada_6_4', color: '#f59e0b' },
            { key: 'pada_7_1', color: '#8b5cf6' }, { key: 'pada_7_2', color: '#db2777' }, { key: 'pada_7_3', color: '#0284c7' }, { key: 'pada_7_4', color: '#84cc16' },
            { key: 'pada_8_1', color: '#dc2626' }, { key: 'pada_8_2', color: '#f97316' }, { key: 'pada_8_3', color: '#eab308' }, { key: 'pada_8_4', color: '#ec4899' }
        ];
        padaConfig.forEach(config => {
            if (sanskritDatabase[config.key]) {
                sanskritDatabase[config.key].forEach(s => {
                    dropdownContainer.insertAdjacentHTML('beforeend', `<div class="sutra-item" style="border-left: 3px solid ${config.color};"><div class="sutra-header sanskrit-text" onclick="toggleAccordion(event, this)">[${s.id}] ${s.name} <i class="fa-solid fa-chevron-down"></i></div><div class="sutra-desc sanskrit-text"><br>${s.desc}<br><br></div></div>`);
                });
            }
        });
    }
}
window.onload = loadDatabase;

// ==================================================
// 🛠️ 5. DYNAMIC PANINIAN ENGINE (UPGRADED PRATYAYA LOGIC) 🛠️
// ==================================================
function generateKridanta() {
    let upa = document.getElementById("upasarga").value.trim();
    let dhatuStr = document.getElementById("dhatu").value.trim();
    let rawPratStr = document.getElementById("pratyaya").value.trim();

    if(!dhatuStr || !rawPratStr) { alert("कृपया कम से कम एक धातु और प्रत्यय टाइप करें!"); return; }

    let steps = [];
    let baseForm = "";
    let finalForm = "";

    steps.push(`<b>शुरुआत:</b> ${upa ? upa + ' + ' : ''}${dhatuStr} + ${rawPratStr}`);

    // प्रत्यय का मानकीकरण (Normalization - हलन्त की अशुद्धि दूर करने हेतु)
    const pratyayaMap = {
        "घञ": "घञ्", "घञ्": "घञ्", "घन": "घञ्", "घन्": "घञ्",
        "ण्यत": "ण्यत्", "ण्यत्": "ण्यत्", "न्यत": "ण्यत्", "न्यत्": "ण्यत्",
        "ण्वुल": "ण्वुल्", "ण्वुल्": "ण्वुल्", "क्त": "क्त", "त": "क्त",
        "क्त्वा": "क्त्वा", "ल्यप": "ल्यप्", "ल्यप्": "ल्यप्",
        "तृच": "तृच्", "तृच्": "तृच्", "ल्युट": "ल्युट्", "ल्युट्": "ल्युट्",
        "अनीयर्": "अनीयर्", "अनीयर": "अनीयर्"
    };
    
    let pratStr = pratyayaMap[rawPratStr.replace(/\s+/g, '')] || rawPratStr;

    // उपसर्ग के कारण क्त्वा का ल्यप्
    if (pratStr === "क्त्वा" && upa !== "") {
        steps.push(`उपसर्ग होने के कारण 'समासेऽनञ्पूर्वे क्त्वो ल्यप्' (7.1.37) से 'क्त्वा' को 'ल्यप्' आदेश हुआ।`);
        pratStr = "ल्यप्";
    }

    let dhatuData = sanskritDatabase.dhatus ? sanskritDatabase.dhatus[dhatuStr] : null;
    if (!dhatuData) {
        steps.push(`<i>(नोट: धातु कस्टम है, सिस्टम 'अलोऽन्त्यात् पूर्व उपधा' से काम कर रहा है)</i>`);
        dhatuData = { isSet: true, guna: autoGuna(dhatuStr), vriddhi: autoVriddhi(dhatuStr) };
    }

    // प्रत्यय का स्वभाव निर्धारित करना
    let type = "akit"; 
    let realPratyaya = pratStr;

    if (pratStr === "घञ्" || pratStr === "ण्यत्" || pratStr === "ण्वुल्") type = "nnit";
    else if (pratStr === "क्त" || pratStr === "क्त्वा" || pratStr === "ल्यप्" || pratStr === "क्तिन्") type = "kit";

    if (pratStr === "घञ्") realPratyaya = "अ";
    if (pratStr === "ण्यत्" || pratStr === "ल्यप्" || pratStr === "यत्") realPratyaya = "य";
    if (pratStr === "ण्वुल्") realPratyaya = "अक";
    if (pratStr === "क्त") realPratyaya = "त";
    if (pratStr === "क्त्वा") realPratyaya = "त्वा";
    if (pratStr === "तृच्") realPratyaya = "तृ";
    if (pratStr === "ल्युट्") realPratyaya = "अन";

    steps.push(`<b>इत्-लोप:</b> प्रत्यय का इत्संज्ञक भाग हटा, शेष बचा: <b>${realPratyaya}</b>`);

    let activePratyaya = realPratyaya;
    let activeDhatu = dhatuStr;

    // गुण/वृद्धि लॉजिक
    if (type === "kit") {
        steps.push(`<b>गुण/वृद्धि निषेध:</b> प्रत्यय कित्/ङित् है, अतः 'क्ङिति च (1.1.5)' से गुण/वृद्धि निषिद्ध।`);
        activeDhatu = dhatuStr; 
    } else if (type === "nnit") {
        activeDhatu = dhatuData.vriddhi;
        steps.push(`<b>वृद्धि:</b> प्रत्यय ञित्/णित् होने से 'अचो ञ्णिति/अत उपधायाः' से वृद्धि -> <b>${activeDhatu}</b>`);
        
        // कुत्व विधान (चजोः कु घिण्ण्यतोः 7.3.52)
        if (activeDhatu.endsWith('च्') || activeDhatu.endsWith('ज्')) {
            activeDhatu = activeDhatu.replace(/च्$/, 'क्').replace(/ज्$/, 'ग्');
            steps.push(`<b>कुत्व:</b> 'चजोः कु घिण्ण्यतोः (7.3.52)' सूत्र से 'च्/ज्' के स्थान पर 'क्/ग्' हुआ -> <b>${activeDhatu}</b>`);
        }
    } else {
        activeDhatu = dhatuData.guna;
        steps.push(`<b>गुण:</b> 'सार्वधातुकार्धधातुकयोः (7.3.84)' से धातु को गुण हुआ -> <b>${activeDhatu}</b>`);
    }

    // ल्यप् में तुक् आगम
    if (pratStr === "ल्यप्") {
        let shortVowels = ["अ", "इ", "उ", "ऋ", "ि", "ु", "ृ"]; 
        if (shortVowels.includes(activeDhatu.slice(-1))) {
            activePratyaya = "त्य";
            steps.push(`<b>तुक् आगम:</b> धातु ह्रस्वान्त है, अतः 'ह्रस्वस्य पिति कृति तुक्' से 'तुक् (त्)' का आगम हुआ।`);
        }
    }

    // अनुनासिक लोप (गम्, हन् + क्त)
    if ((dhatuStr === "गम्" || dhatuStr === "हन्" || dhatuStr === "रम्") && type === "kit") {
        activeDhatu = activeDhatu.slice(0, -1);
        steps.push(`<b>अनुनासिक लोप:</b> कित् प्रत्यय परे 'गम्/हन्' आदि के म्/न् का लोप हुआ -> <b>${activeDhatu}</b>`);
    }

    // इट् आगम (आर्धधातुकस्येड् वलादेः)
    let isValadi = !['अ','आ','इ','ई','उ','ऊ','ए','ऐ','ओ','औ', 'य'].includes(activePratyaya.charAt(0));
    let itAgama = false;
    if (type !== "kit" && pratStr !== "ल्यप्" && pratStr !== "घञ्" && pratStr !== "ण्यत्" && pratStr !== "ण्वुल्") {
        if (dhatuData.isSet && isValadi) {
            itAgama = true;
            steps.push(`<b>इट्-आगम:</b> धातु सेट् और प्रत्यय वलादि है, अतः 'इट् (इ)' का आगम हुआ।`);
        }
    }

    // जोड़ना (Internal Sandhi)
    if (itAgama) {
        baseForm = applySandhi(activeDhatu, "इ" + activePratyaya);
    } else {
        baseForm = applySandhi(activeDhatu, activePratyaya);
    }

    // अनुस्वार/परसवर्ण (म् + त -> न्त)
    if (baseForm.includes("म्त") || baseForm.includes("म्त्व")) {
        baseForm = baseForm.replace("म्त", "न्त").replace("म्त्व", "न्त्व");
        steps.push(`<b>परसवर्ण:</b> 'अनुस्वारस्य ययि परसवर्णः' से 'म्' को 'न्' हुआ।`);
    }

    let joinedForm = joinSanskrit(baseForm);
    if(baseForm !== joinedForm) {
        steps.push(`<b>वर्ण संयोजन:</b> हलन्त और स्वर मिलकर पूर्ण पद बने -> <b>${joinedForm}</b>`);
        baseForm = joinedForm;
    }

    // सुप् विभक्ति (प्रातिपदिक कार्य)
    if(pratStr === "घञ्" || pratStr === "क्त" || pratStr === "ण्वुल्" || pratStr === "तृच्") {
        if (pratStr === "तृच्") {
            baseForm = baseForm.replace(/ृ$/, 'ा'); // कर्ता, हर्ता
            steps.push(`<b>सुप्-विभक्ति:</b> ऋदन्त 'तृच्' को प्रथमा एकवचन में 'आ' (दीर्घ) हुआ -> <b>${baseForm}</b>`);
        } else {
            baseForm = baseForm + "ः";
            steps.push(`<b>सुप्-विभक्ति:</b> पुँल्लिङ्ग प्रथमा एकवचन 'सु' का विसर्ग (ः) हुआ -> <b>${baseForm}</b>`);
        }
    } else if (pratStr === "ल्युट्" || pratStr === "ण्यत्" || pratStr === "अनीयर्") {
        baseForm = baseForm + "म्";
        steps.push(`<b>सुप्-विभक्ति:</b> नपुंसकलिङ्ग में 'सु' को 'अम्' हुआ -> <b>${baseForm}</b>`);
    }

    // उपसर्ग योग (External Sandhi)
    if (upa !== "") {
        let uBase = upa === "आङ्" ? "आ" : upa;
        steps.push(`<b>उपसर्ग योग:</b> '${uBase}' का '${baseForm}' के साथ योग।`);

        finalForm = applySandhi(uBase, baseForm);
        
        if(finalForm !== uBase + baseForm) {
            steps.push(`<b>सन्धि:</b> पाणिनीय सन्धि नियमों (इको यणचि/आद् गुणः/मोऽनुस्वारः आदि) से शब्द बना -> <b>${finalForm}</b>`);
        }
    } else {
        finalForm = baseForm;
    }

    steps.push(`<b>सिद्ध रूप:</b> <span style="color:#ec4899; font-size:1.2em;">${finalForm}</span>`);

    document.getElementById("finalOutput").innerText = finalForm;
    let stepsHtml = steps.map((s, index) => `<li class="step-item"><div style="background:#3b82f6; color:white; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-weight:bold; font-size:14px;">${index+1}</div> <div>${s}</div></li>`).join("");
    document.getElementById("prakriyaSteps").innerHTML = stepsHtml;

    document.getElementById("resultSection").classList.add("active");
    document.getElementById("prakriyaBox").classList.remove("show");
    setTimeout(() => { document.getElementById("resultSection").scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 100);
}

// ==================================================
// 6. UI Interactions & Search Engine
// ==================================================
function togglePrakriya() { document.getElementById("prakriyaBox").classList.toggle("show"); }
function toggleMobileMenu() {
    const nav = document.getElementById("nav-menu");
    const icon = document.getElementById("menu-icon");
    nav.classList.toggle("active");
    if(nav.classList.contains("active")) { icon.classList.replace("fa-bars", "fa-xmark"); document.body.style.overflow = "hidden"; } 
    else { icon.classList.replace("fa-xmark", "fa-bars"); document.body.style.overflow = "auto"; }
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
function openSearchModal() { document.getElementById("searchModal").style.display = "block"; document.getElementById("searchInput").focus(); }
function closeSearchModal() { document.getElementById("searchModal").style.display = "none"; document.getElementById("searchInput").value = ""; document.getElementById("searchResults").innerHTML = ""; }
window.addEventListener('click', function(event) { if (event.target == document.getElementById("searchModal")) closeSearchModal(); });

function getSutraDetails(sutraId) {
    const allArrays = ['samjnaSutras', 'pada_1_2', 'pada_1_3', 'pada_1_4', 'pada_2_1', 'pada_2_2', 'pada_2_3', 'pada_2_4', 'pada_3_1', 'pada_3_2', 'pada_3_3', 'pada_3_4', 'pada_4_1', 'pada_4_2', 'pada_4_3', 'pada_4_4', 'pada_5_1', 'pada_5_2', 'pada_5_3', 'pada_5_4', 'pada_6_1', 'pada_6_2', 'pada_6_3', 'pada_6_4', 'pada_7_1', 'pada_7_2', 'pada_7_3', 'pada_7_4', 'pada_8_1', 'pada_8_2', 'pada_8_3', 'pada_8_4'];
    for (let arrayName of allArrays) {
        if (sanskritDatabase[arrayName]) {
            let foundSutra = sanskritDatabase[arrayName].find(s => s.id === sutraId);
            if (foundSutra) return foundSutra;
        }
    }
    return { name: "अज्ञात सूत्र", desc: "विवरण उपलब्ध नहीं" };
}

function performSearch() {
    let query = document.getElementById("searchInput").value.trim();
    let resultsDiv = document.getElementById("searchResults");
    if (query.length === 0) { resultsDiv.innerHTML = ""; return; }
    if (!sanskritDatabase.examples) { resultsDiv.innerHTML = `<p style="color:red; text-align:center;">डेटाबेस लोड हो रहा है...</p>`; return; }

    let matchedExamples = sanskritDatabase.examples.filter(item => item.ex.includes(query) || item.sutra.includes(query));
    if (matchedExamples.length === 0) { resultsDiv.innerHTML = `<p style="color:red; text-align:center; margin-top:20px;">कोई परिणाम नहीं मिला।</p>`; return; }

    let htmlOutput = "";
    matchedExamples.forEach(match => {
        let sutraInfo = getSutraDetails(match.sutra);
        let regex = new RegExp(query, 'gi');
        let highlightedEx = match.ex.replace(regex, `<span style="background-color:yellow; color:black; border-radius:2px; padding:0 2px;">$&</span>`);
        htmlOutput += `<div class="result-card"><div class="ex-text sanskrit-text">${highlightedEx}</div><div class="su-text sanskrit-text"><b>सूत्र:</b> [${match.sutra}] ${sutraInfo.name}</div><div class="desc-text sanskrit-text">${sutraInfo.desc}</div></div>`;
    });
    resultsDiv.innerHTML = htmlOutput;
}
