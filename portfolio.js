(() => {
    const root = document.documentElement;
    const toggle = document.querySelector(".theme-toggle");
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const themeColor = document.querySelector('meta[name="theme-color"]');
    const year = document.querySelector("#current-year");
    const preferenceKey = "shubh-portfolio-theme";
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)");

    function readSavedTheme() {
        try {
            const savedTheme = window.localStorage.getItem(preferenceKey);
            return savedTheme === "light" || savedTheme === "dark" ? savedTheme : null;
        } catch {
            return null;
        }
    }

    function applyTheme(theme) {
        const isDark = theme === "dark";
        root.dataset.theme = theme;
        toggle.setAttribute("aria-pressed", String(isDark));
        toggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
        themeColor.setAttribute("content", isDark ? "#242624" : "#f2f1ed");
    }

    const savedTheme = readSavedTheme();
    applyTheme(savedTheme || (systemPreference.matches ? "dark" : "light"));

    toggle.addEventListener("click", () => {
        const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
        try {
            window.localStorage.setItem(preferenceKey, nextTheme);
        } catch {
            // Theme still works for this visit when storage is unavailable.
        }
    });

    systemPreference.addEventListener("change", (event) => {
        if (!readSavedTheme()) applyTheme(event.matches ? "dark" : "light");
    });

    function setMenuOpen(isOpen) {
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
        navLinks.classList.toggle("is-open", isOpen);
    }

    menuToggle.addEventListener("click", () => {
        setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    navLinks.addEventListener("click", (event) => {
        if (event.target.closest("a")) setMenuOpen(false);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") setMenuOpen(false);
    });

    year.textContent = String(new Date().getFullYear());

    const copyEmailButton = document.querySelector(".copy-email");
    const copyFeedback = document.querySelector(".copy-feedback");

    copyEmailButton.addEventListener("click", async () => {
        const emailAddress = document.querySelector(".contact-email").textContent.trim();
        let copied = false;

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(emailAddress);
                copied = true;
            }
        } catch {
            copied = false;
        }

        if (!copied) {
            try {
                const fallbackField = document.createElement("textarea");
                fallbackField.value = emailAddress;
                fallbackField.setAttribute("readonly", "");
                fallbackField.style.position = "fixed";
                fallbackField.style.opacity = "0";
                document.body.append(fallbackField);
                fallbackField.select();
                copied = document.execCommand("copy");
                fallbackField.remove();
            } catch {
                copied = false;
            }
        }

        copyFeedback.textContent = copied ? "Copied" : "Copy unavailable";
        copyEmailButton.setAttribute("aria-label", copied ? "Email address copied" : "Copy email address");
        window.setTimeout(() => {
            copyFeedback.textContent = "";
            copyEmailButton.setAttribute("aria-label", "Copy email address");
        }, 2000);
    });

    const documentTemplates = {
        resume: {
            filename: "Subh-Resume.html",
            title: "Résumé",
            sections: [
                ["Profile", "Student, coding hobbyist, and science enthusiast. Interested in learning by building, solving problems, and exploring how technology and science connect."],
                ["Education", "A.P.S Prayagraj, Higher Secondary (Science), 2026."],
                ["Selected Projects", "Offline AI Assistant. UI and Backend Developer, It was annoying to train, An Friendly Assistant, and Just a code editor.]"],
                ["Achievements", "Aao kabhi haweli pe, Tab dikhate hain."],
                ["Skills", "Bengali, Blender, and Critical Thinking"],
                ["Contact", "Email: olor3525@gmail.com · GitHub: https://github.com/olorium295 · Location: Why?"]
            ]
        },
        cv: {
            filename: "Shubh-Academic-CV.html",
            title: "Academic Curriculum Vitae",
            sections: [
                ["Academic Profile", "Student with interests in programming, scientific inquiry, and learning through independent projects."],
                ["Education", "A.P.S Prayagraj, Higher Secondary (Science), 2026."],
                ["Research & Science Activities", "Researched on Mutual Inductance an Future of Biofuels how to make them unlimited fuel cheat code."],
                ["Projects & Technical Work", "Developed Many websites and apps, including an offline AI assistant and a code editor"],
                ["Awards & Achievements", "Received the 'Young Scientist' Recognition for academic excellence."],
                ["Technical & Research Skills", "Proficient in Python, JavaScript, and data analysis tools."],
                ["Contact & References", "Email: olor3525@gmail.com · GitHub: https://github.com/olorium295 · References available on request"]
            ]
        }
    };

    function escapeHtml(value) {
        return value.replace(/[&<>"']/g, (character) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);
    }

    document.querySelectorAll("[data-document-download]").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const template = documentTemplates[link.dataset.documentDownload];
            const sections = template.sections.map(([heading, content]) =>
                `<section><h2>${escapeHtml(heading)}</h2><p>${escapeHtml(content)}</p></section>`
            ).join("");
            const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Shubh | ${escapeHtml(template.title)}</title><style>body{max-width:780px;margin:48px auto;padding:0 24px;color:#242724;font:16px/1.6 Arial,sans-serif}header{border-bottom:2px solid #91472e;margin-bottom:28px;padding-bottom:16px}h1{margin:0;font-size:32px}h2{margin:0 0 6px;font-size:16px}p{margin:0;color:#555}section{margin:24px 0}button{padding:10px 14px;border:0;background:#91472e;color:white;font:inherit;cursor:pointer}@media print{body{margin:16mm auto}button{display:none}}</style></head><body><header><h1>Shubh </h1><p>${escapeHtml(template.title)} · Student · Coding hobbyist · Science enthusiast</p></header><button onclick="window.print()">Print / Save as PDF</button>${sections}</body></html>`;
            const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
            const download = document.createElement("a");
            download.href = url;
            download.download = template.filename;
            document.body.append(download);
            download.click();
            download.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        });
    });
})();
