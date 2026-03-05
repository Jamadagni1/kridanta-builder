let sanskritDatabase = {};

// ==================================================
// 1. पाणिनीय प्रत्यय डेटाबेस (100+ Pratyayas Engine)
// ==================================================
const pratyayaDB = {
    "अ": { real: "अ", type: "akit", lopa: "कोई नहीं" },
    "अङ्": { real: "अ", type: "ngit", lopa: "ङ् (हलन्त्यम्)" },
    "अच्": { real: "अ", type: "chit", lopa: "च् (हलन्त्यम्)" },
    "अण्": { real: "अ", type: "nnit", lopa: "ण् (हलन्त्यम्) -> वृद्धि" },
    "अतृन्": { real: "अत्", type: "nit", lopa: "न् (हलन्त्यम्), ऋ" },
    "अथुच्": { real: "अथु", type: "chit", lopa: "च् (हलन्त्यम्)" },
    "अध्यै": { real: "अध्यै", type: "akit", lopa: "कोई नहीं", gender: "avyaya" },
    "अध्यैन्": { real: "अध्यै", type: "nit", lopa: "न् (हलन्त्यम्)", gender: "avyaya" },
    "अनि": { real: "अनि", type: "akit", lopa: "कोई नहीं" },
    "अनीयर्": { real: "अनीय", type: "akit", lopa: "र् (हलन्त्यम्)", gender: "n" },
    "अप्": { real: "अ", type: "pit", lopa: "प् (हलन्त्यम्)" },
    "असे": { real: "असे", type: "akit", lopa: "कोई नहीं", gender: "avyaya" },
    "असेन्": { real: "असे", type: "nit", lopa: "न् (हलन्त्यम्)", gender: "avyaya" },
    "आरु": { real: "आरु", type: "akit", lopa: "कोई नहीं" },
    "आलुच्": { real: "आलु", type: "chit", lopa: "च् (हलन्त्यम्)" },
    "इञ्": { real: "इ", type: "nnit", lopa: "ञ् (हलन्त्यम्) -> वृद्धि" },
    "इत्र": { real: "इत्र", type: "akit", lopa: "कोई नहीं" },
    "इनि": { real: "इन्", type: "akit", lopa: "इ (उपदेशेऽज०)" },
    "इनुण्": { real: "इनु", type: "nnit", lopa: "ण् (हलन्त्यम्) -> वृद्धि" },
    "इन्": { real: "इन्", type: "akit", lopa: "कोई नहीं" },
    "इष्णुच्": { real: "इष्णु", type: "chit", lopa: "च् (हलन्त्यम्)" },
    "उ": { real: "उ", type: "akit", lopa: "कोई नहीं" },
    "उकञ्": { real: "उक", type: "nnit", lopa: "ञ् (हलन्त्यम्) -> वृद्धि" },
    "ऊक": { real: "ऊक", type: "akit", lopa: "कोई नहीं" },
    "एश्": { real: "ए", type: "shit", lopa: "श् (लशक्व०)" },
    "क": { real: "अ", type: "kit", lopa: "क् (लशक्व०) -> गुण निषेध" },
    "कञ्": { real: "अ", type: "kit", lopa: "क्, ञ् -> गुण निषेध" },
    "कध्यै": { real: "अध्यै", type: "kit", lopa: "क्", gender: "avyaya" },
    "कध्यैन्": { real: "अध्यै", type: "kit", lopa: "क्, न्", gender: "avyaya" },
    "कप्": { real: "अ", type: "kit", lopa: "क्, प्" },
    "कमुल्": { real: "अम्", type: "kit", lopa: "क्, ल्", gender: "avyaya" },
    "कसुन्": { real: "अस्", type: "kit", lopa: "क्, उ, न्", gender: "avyaya" },
    "कसेन्": { real: "असे", type: "kit", lopa: "क्, न्", gender: "avyaya" },
    "कानच्": { real: "आन", type: "kit", lopa: "क्, च्" },
    "कि": { real: "इ", type: "kit", lopa: "क् -> गुण निषेध" },
    "किन्": { real: "इ", type: "kit", lopa: "क्, न्" },
    "कुरच्": { real: "उर", type: "kit", lopa: "क्, च्" },
    "केन्": { real: "ए", type: "kit", lopa: "क्, न्", gender: "avyaya" },
    "केन्य": { real: "एन्य", type: "kit", lopa: "क्" },
    "केलिमर्": { real: "एलिम", type: "kit", lopa: "क्, र्" },
    "क्त": { real: "त", type: "kit", lopa: "क् (लशक्व०) -> गुण निषेध", gender: "m" },
    "क्तवतु": { real: "तवत्", type: "kit", lopa: "क्, उ", gender: "m" },
    "क्तिच्": { real: "ति", type: "kit", lopa: "क्, च्" },
    "क्तिन्": { real: "ति", type: "kit", lopa: "क्, न्", gender: "f" },
    "क्त्रि": { real: "त्रि", type: "kit", lopa: "क्" },
    "क्त्वा": { real: "त्वा", type: "kit", lopa: "क्", gender: "avyaya" },
    "क्नु": { real: "नु", type: "kit", lopa: "क्" },
    "क्मरच्": { real: "मर", type: "kit", lopa: "क्, च्" },
    "क्यप्": { real: "य", type: "kit", lopa: "क्, प्" },
    "क्रु": { real: "रु", type: "kit", lopa: "क्" },
    "क्लुकन्": { real: "लुक", type: "kit", lopa: "क्, न्" },
    "क्वनिप्": { real: "वन्", type: "kit", lopa: "क्, इ, प्" },
    "क्वरप्": { real: "वर", type: "kit", lopa: "क्, प्" },
    "क्वसु": { real: "वस्", type: "kit", lopa: "क्, उ" },
    "क्विन्": { real: "व्", type: "kit", lopa: "क्, इ, न् -> सर्वापहार लोप" },
    "क्विप्": { real: "व्", type: "kit", lopa: "क्, इ, प् -> सर्वापहार लोप", gender: "avyaya" },
    "क्से": { real: "से", type: "kit", lopa: "क्", gender: "avyaya" },
    "खच्": { real: "अ", type: "khit", lopa: "ख्, च् -> मुम् आगम" },
    "खमुञ्": { real: "अम्", type: "khit", lopa: "ख्, उ, ञ्", gender: "avyaya" },
    "खल्": { real: "अ", type: "khit", lopa: "ख्, ल्" },
    "खश्": { real: "अ", type: "khit", lopa: "ख्, श् -> मुम् आगम" },
    "खिष्णुच्": { real: "इष्णु", type: "khit", lopa: "ख्, च्" },
    "खुकञ्": { real: "उक", type: "khit", lopa: "ख्, ञ्" },
    "ख्युन्": { real: "अन", type: "khit", lopa: "ख्, न् (यु -> अन)" },
    "ग्स्नु": { real: "स्नु", type: "git", lopa: "ग् -> गुण निषेध" },
    "घ": { real: "अ", type: "ghit", lopa: "घ् -> कुत्व (च्/ज् को क्/ग्)", kutva: true },
    "घञ्": { real: "अ", type: "nnit", lopa: "घ्, ञ् -> वृद्धि + कुत्व", kutva: true, gender: "m" },
    "घिनुण्": { real: "इन्", type: "nnit", lopa: "घ्, उ, ण् -> वृद्धि + कुत्व", kutva: true },
    "घुरच्": { real: "उर", type: "ghit", lopa: "घ्, च् -> कुत्व", kutva: true },
    "ङ्वनिप्": { real: "वन्", type: "ngit", lopa: "ङ्, इ, प् -> गुण निषेध" },
    "चानश्": { real: "आन", type: "shit", lopa: "च्, श्" },
    "ञ्युट्": { real: "अन", type: "nnit", lopa: "ञ्, ट् (यु -> अन) -> वृद्धि" },
    "ट": { real: "अ", type: "tit", lopa: "ट्" },
    "टक्": { real: "अ", type: "kit", lopa: "ट्, क् -> गुण निषेध" },
    "ड": { real: "अ", type: "dit", lopa: "ड् -> टि-लोप" },
    "डु": { real: "उ", type: "dit", lopa: "ड् -> टि-लोप" },
    "ण": { real: "अ", type: "nnit", lopa: "ण् -> वृद्धि" },
    "णच्": { real: "अ", type: "nnit", lopa: "ण्, च् -> वृद्धि" },
    "णमुल्": { real: "अम्", type: "nnit", lopa: "ण्, उ, ल् -> वृद्धि", gender: "avyaya" },
    "णिनि": { real: "इन्", type: "nnit", lopa: "ण्, इ -> वृद्धि" },
    "ण्यत्": { real: "य", type: "nnit", lopa: "ण्, त् -> वृद्धि + कुत्व", kutva: true, gender: "n" },
    "ण्युट्": { real: "अन", type: "nnit", lopa: "ण्, ट् (यु -> अन) -> वृद्धि" },
    "ण्वि": { real: "व्", type: "nnit", lopa: "ण्, इ -> वृद्धि" },
    "ण्विन्": { real: "व्", type: "nnit", lopa: "ण्, इ, न् -> वृद्धि" },
    "ण्वुच्": { real: "अक", type: "nnit", lopa: "ण्, च् (वु -> अक) -> वृद्धि" },
    "ण्वुल्": { real: "अक", type: "nnit", lopa: "ण्, ल् (वु -> अक) -> वृद्धि", gender: "m" },
    "तवै": { real: "तवै", type: "akit", lopa: "कोई नहीं", gender: "avyaya" },
    "तवेङ्": { real: "तवे", type: "ngit", lopa: "ङ्", gender: "avyaya" },
    "तवेन्": { real: "तवे", type: "nit", lopa: "न्", gender: "avyaya" },
    "तव्य": { real: "तव्य", type: "akit", lopa: "कोई नहीं", gender: "n" },
    "तव्यत्": { real: "तव्य", type: "tit", lopa: "त् -> स्वरित", gender: "n" },
    "तुमुन्": { real: "तुम्", type: "nit", lopa: "उ, न्", gender: "avyaya" },
    "तृच्": { real: "तृ", type: "chit", lopa: "च्", gender: "m_tri" },
    "तृन्": { real: "तृ", type: "nit", lopa: "न्", gender: "m_tri" },
    "तोसुन्": { real: "तोस्", type: "nit", lopa: "उ, न्", gender: "avyaya" },
    "त्वन्": { real: "त्व", type: "nit", lopa: "न्" },
    "थकन्": { real: "इक", type: "nit", lopa: "त्/थ् -> इक, न्" },
    "नङ्": { real: "अ", type: "ngit", lopa: "न्, ङ्" },
    "नजिङ्": { real: "अजि", type: "ngit", lopa: "न्, ङ्" },
    "नन्": { real: "अ", type: "nit", lopa: "न्, न्" },
    "मनिन्": { real: "मन्", type: "nit", lopa: "इ, न्" },
    "यत्": { real: "य", type: "tit", lopa: "त् -> गुण", gender: "n" },
    "युच्": { real: "अन", type: "chit", lopa: "च् (यु -> अन)", gender: "f" },
    "र": { real: "र", type: "akit", lopa: "कोई नहीं" },
    "रु": { real: "रु", type: "akit", lopa: "कोई नहीं" },
    "ल्यप्": { real: "य", type: "kit", lopa: "ल्, प् -> गुण निषेध + तुक्", gender: "avyaya" },
    "ल्यु": { real: "अन", type: "lit", lopa: "ल् (यु -> अन)", gender: "n" },
    "ल्युट्": { real: "अन", type: "lit", lopa: "ल्, ट् (यु -> अन)", gender: "n" },
    "वनिप्": { real: "वन्", type: "pit", lopa: "इ, प्" },
    "वरच्": { real: "वर", type: "chit", lopa: "च्" },
    "विच्": { real: "व्", type "chit", lopa: "इ, च्" },
    "विट्": { real: "व्", type: "tit", lopa: "इ, ट्" },
    "वुञ्": { real: "अक", type: "nnit", lopa: "ञ् (वु -> अक)" },
    "वुन्": { real: "अक", type: "nit", lopa: "न् (वु -> अक)" },
    "श": { real: "अ", type: "shit", lopa: "श् -> सार्वधातुक" },
    "शतृ": { real: "अत्", type: "shit", lopa: "श्, ऋ", gender: "m_at" },
    "शध्यै": { real: "अध्यै", type: "shit", lopa: "श्", gender: "avyaya" },
    "शध्यैन्": { real: "अध्यै", type: "shit", lopa: "श्, न्", gender: "avyaya" },
    "शानच्": { real: "आन", type: "shit", lopa: "श्, च्" },
    "शानन्": { real: "आन", type: "shit", lopa: "श्, न्" },
    "षाकन्": { real: "आक", type: "shit", lopa: "ष्, न्" },
    "ष्ट्रन्": { real: "त्र", type "nit", lopa: "ष्, न्" },
    "ष्वुन्": { real: "अक", type: "nit", lopa: "ष्, न् (वु -> अक)" },
    "से": { real: "से", type: "akit", lopa: "कोई नहीं", gender: "avyaya" },
    "सेन्": { real: "से", type: "nit", lopa: "न्", gender: "avyaya" },
    "डर": { real: "अर", type: "dit", lopa: "ड् -> टि-लोप" },
    "इकवक": { real: "इकवक", type: "akit", lopa: "कोई नहीं" },
    "य": { real: "य", type: "akit", lopa: "कोई नहीं" }
};

// ==================================================
// 2. वर्ण संयोजन और सन्धि (Halant + Vowel Joiner & Sandhi)
// ==================================================
function joinSanskrit(text) {
    const vowelMap = { '्अ': '', '्आ': 'ा', '्इ': 'ि', '्ई': 'ी', '्उ': 'ु', '्ऊ': 'ू', '्ऋ': 'ृ', '्ए': 'े', '्ऐ': 'ै', '्ओ': 'ो', '्औ': 'ौ' };
    for (let [key, val] of Object.entries(vowelMap)) { text = text.split(key).join(val); }
    return text;
}

function autoGuna(d) {
    if (d.endsWith('ि') || d.endsWith('ी')) return d.slice(0, -1) + 'े';
    if (d.endsWith('ु') || d.endsWith('ू')) return d.slice(0, -1) + 'ो';
    if (d.endsWith('ृ')) return d.slice(0, -1) + 'र्'; 
    if (d.endsWith('्')) {
        return d.replace(/ि([क-ह]्)$/, 'े$1').replace(/ु([क-ह]्)$/, 'ो$1').replace(/ृ([क-ह]्)$/, 'र्$1');
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
        return d.replace(/ि([क-ह]्)$/, 'ै$1').replace(/ु([क-ह]्)$/, 'ौ$1').replace(/ृ([क-ह]्)$/, 'ार्$1');
    }
    return d; 
}

function applySandhi(word1, word2) {
    if (!word1) return word2;
    if (!word2) return word1;

    let w1 = word1.slice(0, -1); 
    let lastChar = word1.slice(-1); 
    let firstChar = word2.charAt(0); 
    let w2 = word2.slice(1); 

    let isVowel = ['अ','आ','इ','ई','उ','ऊ','ऋ','ए','ऐ','ओ','औ'].includes(firstChar);
    let isConsonantWithImplicitA = "कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह".includes(lastChar);

    if (isConsonantWithImplicitA) {
        if (firstChar === 'अ' || firstChar === 'आ') return w1 + lastChar + 'ा' + w2; 
        if (firstChar === 'इ' || firstChar === 'ई') return w1 + lastChar + 'े' + w2; 
        if (firstChar === 'उ' || firstChar === 'ऊ') return w1 + lastChar + 'ो' + w2; 
        if (firstChar === 'ऋ') return w1 + lastChar + 'र्' + w2; 
        if (firstChar === 'ए' || firstChar === 'ऐ') return w1 + lastChar + 'ै' + w2;
        if (firstChar === 'ओ' || firstChar === 'औ') return w1 + lastChar + 'ौ' + w2;
    }

    if ((lastChar === 'ि' || lastChar === 'ी') && isVowel) return w1 + '्' + 'य्' + firstChar + w2;
    if ((lastChar === 'ु' || lastChar === 'ू') && isVowel) return w1 + '्' + 'व्' + firstChar + w2;
    if ((lastChar === 'ृ' || lastChar === 'ॄ') && isVowel) return w1 + '्' + 'र्' + firstChar + w2;

    if (lastChar === 'े' && isVowel) return w1 + 'य्' + firstChar + w2; 
    if (lastChar === 'ै' && isVowel) return w1 + 'ा' + 'य्' + firstChar + w2;
    if (lastChar === 'ो' && isVowel) return w1 + 'व्' + firstChar + w2;
    if (lastChar === 'ौ' && isVowel) return w1 + 'ा' + 'व्' + firstChar + w2;

    if (lastChar === 'म्' && !isVowel) return w1 + 'ं' + firstChar + w2;

    if (lastChar === 'श्' && firstChar === 'त') return w1 + 'ष्ट' + w2; 
    if (lastChar === 'च्' && firstChar === 'त') return w1 + 'क्त' + w2; 
    if (lastChar === 'ज्' && firstChar === 'त') return w1 + 'क्त' + w2; 

    return word1 + word2;
}

// ==================================================
// 3. डेटाबेस लोडिंग और UI सेटअप
// ==================================================
async function loadDatabase() {
    try {
        const timestamp = new Date().getTime();
        const response = await fetch(`database.json?v=${timestamp}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        sanskritDatabase = await response.json();
        initializeUI();
    } catch (error) { alert("डेटा लोड नहीं हो सका। कृपया JSON फ़ाइल की जाँच करें।"); }
}

function initializeUI() {
    let upaList = document.getElementById("upaList");
    if (upaList && sanskritDatabase.upasargas) {
        sanskritDatabase.upasargas.forEach(u => { if(u.id !== "") upaList.insertAdjacentHTML('beforeend', `<option value="${u.id}">${u.label}</option>`); });
    }
    let dhatuList = document.getElementById("dhatuList");
    if (dhatuList && sanskritDatabase.dhatus) {
        for (let key in sanskritDatabase.dhatus) { dhatuList.insertAdjacentHTML('beforeend', `<option value="${key}">${sanskritDatabase.dhatus[key].label}</option>`); }
    }
    let pratList = document.getElementById("pratList");
    if (pratList) {
        for (let key in pratyayaDB) { pratList.insertAdjacentHTML('beforeend', `<option value="${key}">${key} (${pratyayaDB[key].real})</option>`); }
    }

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
// 🛠️ 4. DYNAMIC PANINIAN ENGINE (ALL PRATYAYAS) 🛠️
// ==================================================
function generateKridanta() {
    let upa = document.getElementById("upasarga").value.trim();
    let dhatuStr = document.getElementById("dhatu").value.trim();
    let rawPratStr = document.getElementById("pratyaya").value.trim().replace(/\s+/g, '');

    if(!dhatuStr || !rawPratStr) { alert("कृपया कम से कम एक धातु और प्रत्यय टाइप करें!"); return; }

    let steps = [];
    let baseForm = "";
    let finalForm = "";

    steps.push(`<b>शुरुआत:</b> ${upa ? upa + ' + ' : ''}${dhatuStr} + ${rawPratStr}`);

    let pratStr = rawPratStr;
    if (pratStr === "क्त्वा" && upa !== "") {
        steps.push(`उपसर्ग होने के कारण 'समासेऽनञ्पूर्वे क्त्वो ल्यप्' (7.1.37) से 'क्त्वा' को 'ल्यप्' आदेश हुआ।`);
        pratStr = "ल्यप्";
    }

    let dhatuData = sanskritDatabase.dhatus ? sanskritDatabase.dhatus[dhatuStr] : null;
    let activeDhatu = dhatuStr; // Default

    if (!dhatuData) {
        steps.push(`<i>(नोट: धातु कस्टम है, सिस्टम 'अलोऽन्त्यात् पूर्व उपधा' से काम कर रहा है)</i>`);
        dhatuData = { isSet: true, guna: autoGuna(dhatuStr), vriddhi: autoVriddhi(dhatuStr), clean: dhatuStr };
    } else {
        activeDhatu = dhatuData.clean;
        if(dhatuData.anubandha && dhatuData.anubandha !== "none") {
            steps.push(`<b>इत्-संज्ञा व लोप:</b> 'आदिर्ञिटुडवः/हलन्त्यम्' आदि से <b>${dhatuData.anubandha}</b> का लोप हुआ। शेष धातु: <b>${activeDhatu}</b>`);
        }
    }

    let pratData = pratyayaDB[pratStr];
    if (!pratData) {
        steps.push(`<i>(नोट: प्रत्यय डेटाबेस में नहीं है, सिस्टम सामान्य रूप से जोड़ रहा है)</i>`);
        pratData = { real: pratStr, type: "akit", lopa: "अज्ञात" };
    } else {
        steps.push(`<b>इत्-लोप:</b> ${pratData.lopa}। शेष बचा: <b>${pratData.real}</b>`);
    }

    let activePratyaya = pratData.real;

    // गुण/वृद्धि लॉजिक
    if (pratData.type === "kit" || pratData.type === "ngit" || pratData.type === "git") {
        steps.push(`<b>गुण/वृद्धि निषेध:</b> प्रत्यय कित्/ङित्/गित् है, अतः 'क्ङिति च (1.1.5)' से गुण/वृद्धि निषिद्ध।`);
    } else if (pratData.type === "nnit" || pratData.type === "nit") {
        activeDhatu = dhatuData.vriddhi;
        steps.push(`<b>वृद्धि:</b> प्रत्यय ञित्/णित्/णित् होने से 'अचो ञ्णिति/अत उपधायाः' से धातु को वृद्धि -> <b>${activeDhatu}</b>`);
    } else {
        activeDhatu = dhatuData.guna;
        steps.push(`<b>गुण:</b> 'सार्वधातुकार्धधातुकयोः' से धातु को गुण हुआ -> <b>${activeDhatu}</b>`);
    }

    // कुत्व विधान (चजोः कु घिण्ण्यतोः)
    if (pratData.kutva || pratData.type === "ghit") {
        if (activeDhatu.endsWith('च्') || activeDhatu.endsWith('ज्')) {
            activeDhatu = activeDhatu.replace(/च्$/, 'क्').replace(/ज्$/, 'ग्');
            steps.push(`<b>कुत्व:</b> 'चजोः कु घिण्ण्यतोः' से 'च्/ज्' के स्थान पर 'क्/ग्' हुआ -> <b>${activeDhatu}</b>`);
        }
    }

    // टि-लोप (डित् प्रत्यय)
    if (pratData.type === "dit") {
        activeDhatu = activeDhatu.replace(/[अाइईउऊऋएऐओऔ][क-ह]्?$/, ''); // सरल टि-लोप
        steps.push(`<b>टि-लोप:</b> डित् प्रत्यय परे होने से 'टेः' (6.4.143) से अन्त्य भाग का लोप -> <b>${activeDhatu}</b>`);
    }

    // ल्यप् में तुक् आगम
    if (pratStr === "ल्यप्") {
        let shortVowels = ["अ", "इ", "उ", "ऋ", "ि", "ु", "ृ"]; 
        if (shortVowels.includes(activeDhatu.slice(-1))) {
            activePratyaya = "त्य";
            steps.push(`<b>तुक् आगम:</b> धातु ह्रस्वान्त है, अतः 'ह्रस्वस्य पिति कृति तुक्' से 'त्' जुड़ा।`);
        }
    }

    // अनुनासिक लोप
    if ((activeDhatu.endsWith("म्") || activeDhatu.endsWith("न्")) && pratData.type === "kit") {
        activeDhatu = activeDhatu.slice(0, -1);
        steps.push(`<b>अनुनासिक लोप:</b> कित् प्रत्यय परे 'गम्/हन्' आदि के म्/न् का लोप हुआ -> <b>${activeDhatu}</b>`);
    }

    // इट् आगम
    let isValadi = !['अ','आ','इ','ई','उ','ऊ','ए','ऐ','ओ','औ', 'य'].includes(activePratyaya.charAt(0));
    let itAgama = false;
    if (pratData.type !== "kit" && pratStr !== "ल्यप्" && !pratData.type.includes("nit") && !pratData.type.includes("hit")) {
        if (dhatuData.isSet && isValadi) {
            itAgama = true;
            steps.push(`<b>इट्-आगम:</b> धातु सेट् और प्रत्यय वलादि है, अतः 'इट् (इ)' का आगम हुआ।`);
        }
    }

    // जोड़ना (Internal Sandhi)
    if (itAgama) baseForm = applySandhi(activeDhatu, "इ" + activePratyaya);
    else baseForm = applySandhi(activeDhatu, activePratyaya);

    // म् + त -> न्त (अनुस्वार परसवर्ण)
    if (baseForm.includes("म्त") || baseForm.includes("म्त्व")) {
        baseForm = baseForm.replace("म्त", "न्त").replace("म्त्व", "न्त्व");
        steps.push(`<b>परसवर्ण:</b> 'अनुस्वारस्य ययि परसवर्णः' से 'म्' को 'न्' हुआ।`);
    }

    let joinedForm = joinSanskrit(baseForm);
    if(baseForm !== joinedForm) {
        steps.push(`<b>वर्ण संयोजन:</b> स्वर और व्यंजन मिलकर पूर्ण पद बने -> <b>${joinedForm}</b>`);
        baseForm = joinedForm;
    }

    // सुप् विभक्ति (Gender processing)
    if (pratData.gender === "m") {
        baseForm = baseForm + "ः";
        steps.push(`<b>सुप्-विभक्ति:</b> पुँल्लिङ्ग प्रथमा एकवचन 'सु' का विसर्ग (ः) हुआ -> <b>${baseForm}</b>`);
    } else if (pratData.gender === "n") {
        baseForm = baseForm + "म्";
        steps.push(`<b>सुप्-विभक्ति:</b> नपुंसकलिङ्ग में 'सु' को 'अम्' हुआ -> <b>${baseForm}</b>`);
    } else if (pratData.gender === "f") {
        baseForm = baseForm + "ः"; // Like मतिः, श्रुतिः (for Ktin)
        steps.push(`<b>सुप्-विभक्ति:</b> स्त्रीलिङ्ग प्रथमा एकवचन 'सु' का विसर्ग (ः) हुआ -> <b>${baseForm}</b>`);
    } else if (pratData.gender === "m_tri") {
        baseForm = baseForm.replace(/ृ$/, 'ा'); // कर्ता
        steps.push(`<b>सुप्-विभक्ति:</b> ऋदन्त 'तृच्' को प्रथमा एकवचन में 'आ' हुआ -> <b>${baseForm}</b>`);
    } else if (pratData.gender === "m_at") {
        baseForm = baseForm.replace(/अत्$/, 'अन्'); // पचन्, गच्छन्
        steps.push(`<b>सुप्-विभक्ति:</b> शतृ-अन्त 'अत्' को प्रथमा एकवचन में 'अन्' हुआ -> <b>${baseForm}</b>`);
    }

    // उपसर्ग योग
    if (upa !== "") {
        let uBase = upa === "आङ्" ? "आ" : upa;
        steps.push(`<b>उपसर्ग योग:</b> '${uBase}' का '${baseForm}' के साथ योग।`);
        finalForm = applySandhi(uBase, baseForm);
        if(finalForm !== uBase + baseForm) steps.push(`<b>सन्धि:</b> पाणिनीय सन्धि नियमों से शब्द बना -> <b>${finalForm}</b>`);
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

// UI Interactions
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
    const allArrays = [
        'samjnaSutras', 'pada_1_2', 'pada_1_3', 'pada_1_4', 'pada_2_1', 'pada_2_2', 'pada_2_3', 'pada_2_4', 
        'pada_3_1', 'pada_3_2', 'pada_3_3', 'pada_3_4', 'pada_4_1', 'pada_4_2', 'pada_4_3', 'pada_4_4',
        'pada_5_1', 'pada_5_2', 'pada_5_3', 'pada_5_4', 'pada_6_1', 'pada_6_2', 'pada_6_3', 'pada_6_4',
        'pada_7_1', 'pada_7_2', 'pada_7_3', 'pada_7_4', 'pada_8_1', 'pada_8_2', 'pada_8_3', 'pada_8_4'
    ];
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
