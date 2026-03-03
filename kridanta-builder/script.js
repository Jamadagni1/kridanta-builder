let sanskritDatabase = {};

// 1. JSON फाइल को लोड करना
async function loadDatabase() {
    try {
        const response = await fetch('database.json');
        sanskritDatabase = await response.json();
        initializeUI();
    } catch (error) {
        console.error("डेटाबेस लोड करने में त्रुटि:", error);
        alert("डेटा लोड नहीं हो सका। कृपया सुनिश्चित करें कि आप Live Server का उपयोग कर रहे हैं।");
    }
}

// 2. UI इनिशियलाइज़ करना
function initializeUI() {
    let upaSelect = document.getElementById("upasarga");
    sanskritDatabase.upasargas.forEach(u => upaSelect.options.add(new Option(u.label, u.id)));

    let dhatuSelect = document.getElementById("dhatu");
    for (let key in sanskritDatabase.dhatus) dhatuSelect.options.add(new Option(sanskritDatabase.dhatus[key].label, key));

    let pratSelect = document.getElementById("pratyaya");
    sanskritDatabase.pratyayas.forEach(p => pratSelect.options.add(new Option(p.label, p.id)));

    let dropdownContainer = document.getElementById("sutraDropdown");
    sanskritDatabase.sutras.forEach(s => {
        let div = document.createElement("div");
        div.className = "sutra-item";
        div.innerHTML = `<div class="sutra-header sanskrit-text" onclick="toggleAccordion(event, this)">${s.name} <i class="fa-solid fa-chevron-down"></i></div><div class="sutra-desc sanskrit-text"><br>${s.desc}<br><br></div>`;
        dropdownContainer.appendChild(div);
    });
}

// पेज लोड होते ही डेटाबेस फेच करें
window.onload = loadDatabase;

// 3. शब्द निर्माण लॉजिक
function generateKridanta() {
    let upa = document.getElementById("upasarga").value;
    let dhatu = document.getElementById("dhatu").value;
    let prat = document.getElementById("pratyaya").value;

    let steps = [];
    let baseForm = "";
    let finalForm = "";

    steps.push(`<b>शुरुआत:</b> ${upa ? upa + ' + ' : ''}${dhatu} + ${prat}`);

    if (prat === "क्त्वा" && upa !== "") {
        steps.push(`<b>जादू (नियम):</b> उपसर्ग होने के कारण 'क्त्वा' बदल कर 'ल्यप्' बन गया!`);
        prat = "ल्यप्";
    }

    let dhatuData = sanskritDatabase.dhatus[dhatu];
    if (dhatuData && dhatuData.rules && dhatuData.rules[prat]) {
        let ruleObj = dhatuData.rules[prat];
        baseForm = ruleObj.form;
        ruleObj.steps.forEach(step => steps.push(step));
    } else {
        baseForm = dhatu + "-" + prat;
        steps.push(`सामान्य संयोजन (General join).`);
    }

    if (upa !== "") {
        let uBase = upa === "आङ्" ? "आ" : upa;
        steps.push(`अब '${uBase}' उपसर्ग को '${baseForm}' के साथ जोड़ेंगे।`);

        if (uBase === "सम्") {
            steps.push(`'म्' बिन्दु (अनुस्वार) बन गया -> सं + ${baseForm}`);
            finalForm = "सं" + baseForm;
        } else if (uBase === "उत्") {
            finalForm = "उद्" + baseForm;
        } else if (uBase === "वि" && baseForm.startsWith("अ")) {
            finalForm = "व्य" + baseForm.slice(1);
        } else if (uBase === "प्र" && baseForm === "कृत्य") {
            finalForm = "प्रकृत्य";
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

// 4. UI इंटरेक्शन्स
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
