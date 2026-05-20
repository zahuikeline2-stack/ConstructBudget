/**
 * CONSTRUCTBUDGET - CORE APP ENGINE
 * Logiciel d'ingénierie financière immobilière et d'interaction UI
 */

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initScrollAnimations();
    
    // Initialisation conditionnelle selon la page active
    if (document.getElementById("btnCalculer")) initSimulator();
    if (document.getElementById("contactForm")) initContactForm();
    if (document.getElementById("registerForm")) initRegisterForm();
    if (document.getElementById("searchInput")) initHistoryFilter();
});

/* ==========================================================================
   MODULE 1 : NAVIGATION RESPONSIVE & COMPORTEMENT HEADER
   ========================================================================== */
function initNavigation() {
    const mainHeader = document.getElementById("mainHeader");
    const mobileToggle = document.getElementById("mobileToggle");
    const navMenu = document.getElementById("navMenu");

    // Sticky Navbar au défilement
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add("scrolled");
        } else {
            mainHeader.classList.remove("scrolled");
        }
    });

    // Menu Mobile
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener("click", () => {
            navMenu.classList.toggle("open");
            mobileToggle.classList.toggle("active");
            
            // Animation du bouton hamburger
            const bars = mobileToggle.querySelectorAll(".bar");
            if (mobileToggle.classList.contains("active")) {
                bars[0].style.transform = "rotate(-45deg) translate(-5px, 6px)";
                bars[1].style.opacity = "0";
                bars[2].style.transform = "rotate(45deg) translate(-5px, -6px)";
            } else {
                bars[0].style.transform = "none";
                bars[1].style.opacity = "1";
                bars[2].style.transform = "none";
            }
        });
    }
}

/* ==========================================================================
   MODULE 2 : ANIMATIONS D'APPARITION AU SCROLL
   ========================================================================== */
function initScrollAnimations() {
    const targets = document.querySelectorAll(".animate-on-scroll");
    
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        targets.forEach(target => observer.observe(target));
    } else {
        // Fallback pour les anciens navigateurs
        targets.forEach(target => target.classList.add("visible"));
    }
}

/* ==========================================================================
   MODULE 3 : ALGORITHME DU SIMULATEUR BUDGÉTAIRE INTERACTIF
   ========================================================================== */
function initSimulator() {
    const btnCalculer = document.getElementById("btnCalculer");
    const circle = document.getElementById("circleProgress");
    
    if (!circle) return;
    
    // Configuration de la bague de progression SVG
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;

    function setProgress(percent) {
        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }

    btnCalculer.addEventListener("click", () => {
        // Capture des entrées utilisateurs
        const surface = parseFloat(document.getElementById("surfaceTerrain").value);
        const pieces = parseInt(document.getElementById("nbPieces").value);
        const etages = parseInt(document.getElementById("nbEtages").value);
        const typeMaison = document.getElementById("typeMaison").value;
        const finition = document.getElementById("niveauFinition").value;

        // Validation de cohérence de base
        if (isNaN(surface) || surface <= 0) {
            alert("Veuillez renseigner une surface au sol valide.");
            return;
        }

        // Matrice de calcul des coûts unitaires de base (au m²)
        let coutBaseM2 = 250000; // Tarif de base standard en FCFA
        
        if (typeMaison === "moderne") coutBaseM2 = 380000;
        if (typeMaison === "haut_standing") coutBaseM2 = 550000;

        // Coefficients multiplicateurs de finition
        let coeffFinition = 1.0;
        if (finition === "premium") coeffFinition = 1.35;
        if (finition === "luxe") coeffFinition = 1.75;

        // Prise en compte de la surface cumulée avec les étages
        const surfaceTotaleBatie = surface * (1 + (etages * 0.85));
        
        // Calcul du coût global brut
        let coutGlobal = surfaceTotaleBatie * coutBaseM2 * coeffFinition;
        // Ajustement mineur selon le nombre de pièces
        coutGlobal += pieces * 400000;

        // Affichage fluide et formatage monétaire
        animateValue("coutTotalDisplay", 0, coutGlobal, 1000, " FCFA");

        // Calcul et affichage du quantitatif des matériaux critiques
        const tonnesCiment = Math.ceil(surfaceTotaleBatie * 0.35 * (1 + (etages * 0.1)));
        const kgAcier = Math.ceil(surfaceTotaleBatie * 28 * (1 + (etages * 0.25)));
        const m3Sable = Math.ceil(surfaceTotaleBatie * 0.45);
        const m3Gravier = Math.ceil(surfaceTotaleBatie * 0.6);

        document.getElementById("matCiment").innerText = tonnesCiment;
        document.getElementById("matAcier").innerText = kgAcier.toLocaleString();
        document.getElementById("matSable").innerText = m3Sable;
        document.getElementById("matGravier").innerText = m3Gravier;

        // Répartition financière par phases architecturales
        document.getElementById("p1Val").innerText = (coutGlobal * 0.30).toLocaleString() + " F";
        document.getElementById("p2Val").innerText = (coutGlobal * 0.45).toLocaleString() + " F";
        document.getElementById("p3Val").innerText = (coutGlobal * 0.25).toLocaleString() + " F";

        // Déclenchement de l'animation de la bague de progression (simulant 100% de complétion de l'analyse)
        setProgress(100);
    });
}

// Fonction d'animation de compteur numérique
function animateValue(id, start, end, duration, suffix = "") {
    const obj = document.getElementById(id);
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        obj.innerHTML = currentValue.toLocaleString() + suffix;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

/* ==========================================================================
   MODULE 4 : FILTRAGE ANALYTIQUE DE L'HISTORIQUE DES PROJETS
   ========================================================================== */
function initHistoryFilter() {
    const searchInput = document.getElementById("searchInput");
    const filterSelect = document.getElementById("filterSelect");
    const projectCards = document.querySelectorAll(".project-row-card");

    function filterProjects() {
        const query = searchInput.value.toLowerCase();
        const selectedStanding = filterSelect.value;

        projectCards.forEach(card => {
            const projectName = card.querySelector(".p-name").innerText.toLowerCase();
            const standing = card.getAttribute("data-standing");
            
            const matchSearch = projectName.includes(query);
            const matchStanding = (selectedStanding === "tous" || standing === selectedStanding);

            if (matchSearch && matchStanding) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    }

    if (searchInput && filterSelect) {
        searchInput.addEventListener("input", filterProjects);
        filterSelect.addEventListener("change", filterProjects);
    }
}

/* ==========================================================================
   MODULE 5 : VALIDATION SÉCURISÉE DES FORMULAIRES (CONTACT & INSCRIPTION)
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById("contactForm");
    const feedback = document.getElementById("contactFeedback");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        feedback.style.color = "#34d399";
        feedback.innerText = "Transmission en cours sécurisée via protocole HTTPS...";
        
        setTimeout(() => {
            feedback.innerText = "Votre cahier des charges a été transmis avec succès à nos ingénieurs.";
            form.reset();
        }, 1500);
    });
}

function initRegisterForm() {
    const form = document.getElementById("registerForm");
    const feedback = document.getElementById("registerFeedback");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const pass = document.getElementById("regPassword").value;
        const confirm = document.getElementById("regPasswordConfirm").value;

        if (pass !== confirm) {
            feedback.style.color = "#f87171";
            feedback.innerText = "Erreur : Les mots de passe saisis ne sont pas identiques.";
            return;
        }

        feedback.style.color = "#34d399";
        feedback.innerText = "Création du compte utilisateur premium en cours...";
        
        setTimeout(() => {
            alert("Compte ConstructBudget créé avec succès ! Bienvenue sur la plateforme.");
            window.location.href = "connexion.html";
        }, 1500);
    });
}