
// Coût moyen de construction par m² selon finition (FCFA/m²)
const COUT_M2 = {
  "Standard(Materiaux Locaux)":  150000,   
  "Premium(Importation & Domotique)": 280000,
  "Luxe Haut Couture": 480000,             
};

// Multiplicateur selon la configuration architecturale
const COEFF_CONFIG = {
  "Duplex Contemporain":          1.15,
  "Villa Basse Indivituelle":     1.00,
  "Immeuble de Rapport/Résidentiel": 1.25,
};

// Multiplicateur selon le nombre d'étages (chaque étage supplémentaire coûte plus cher)
function coeffEtages(nbEtages) {
  if (nbEtages <= 0) return 1.00;
  if (nbEtages === 1) return 1.20;
  if (nbEtages === 2) return 1.38;
  return 1.38 + (nbEtages - 2) * 0.12; 
}

// Majoration légère selon le nombre de pièces (plomberie, électricité)
function coeffPieces(nbPieces) {
  if (nbPieces <= 4)  return 1.00;
  if (nbPieces <= 7)  return 1.05;
  if (nbPieces <= 10) return 1.10;
  return 1.15;
}

function calculerMateriaux(surfaceTotale, qualite) {

  let cimentTonne, acierKg, sableM3, gravierM3;

  if (qualite === "Standard(Materiaux Locaux)") {
    cimentTonne = 0.14;  
    acierKg     = 18;    
    sableM3     = 0.09;  
    gravierM3   = 0.07;   
  } else if (qualite === "Premium(Importation & Domotique)") {
    cimentTonne = 0.16;
    acierKg     = 22;
    sableM3     = 0.10;
    gravierM3   = 0.08;
  } else { 
    cimentTonne = 0.18;
    acierKg     = 26;
    sableM3     = 0.11;
    gravierM3   = 0.09;
  }

  return {
    ciment:  Math.round(surfaceTotale * cimentTonne),
    acier:   Math.round(surfaceTotale * acierKg),
    sable:   Math.round(surfaceTotale * sableM3),
    gravier: Math.round(surfaceTotale * gravierM3),
  };
}

// --- Formatage des nombres en FCFA ---
function formatFCFA(n) {
  return n.toLocaleString("fr-FR") + " FCFA";
}


//  Fonction principale appelée au clic du bouton
function genererEstimation() {

  // 1. Récupérer les valeurs du formulaire
  const inputs   = document.querySelectorAll("input[type='number']");
  const selects  = document.querySelectorAll("select");

  const surface  = parseFloat(inputs[0].value)  || 0;
  const pieces   = parseInt(inputs[1].value)    || 0;
  const etages   = parseInt(inputs[2].value)    || 0;

  const config   = selects[0].value;
  const qualite  = selects[1].value;

  // 2. Validation basique
  if (surface <= 0) {
    alert("Veuillez saisir une surface au sol valide (m²).");
    return;
  }
  if (pieces <= 0) {
    alert("Veuillez indiquer le nombre de pièces.");
    return;
  }

  // 3. Calcul du coût global
  const surfaceTotale  = surface * (etages + 1);         
  const prixBase       = COUT_M2[qualite] || 150000;
  const cCoeff         = COEFF_CONFIG[config] || 1.00;
  const eCoeff         = coeffEtages(etages);
  const pCoeff         = coeffPieces(pieces);

  const coutGlobal = Math.round(surfaceTotale * prixBase * cCoeff * eCoeff * pCoeff);

  // 4. Calcul des matériaux
  const mat = calculerMateriaux(surfaceTotale, qualite);

  // 5. Mettre à jour l'affichage
  //    Coût global
  const coutEl = document.querySelector("#contenue h3:not(#text)");
  if (coutEl) coutEl.textContent = formatFCFA(coutGlobal);

  //    Matériaux — les spans dans les h3.element
  const spans = document.querySelectorAll("h3.element span");
  if (spans.length >= 4) {
    spans[0].textContent = mat.ciment.toLocaleString("fr-FR");
    spans[1].textContent = mat.acier.toLocaleString("fr-FR");
    spans[2].textContent = mat.sable.toLocaleString("fr-FR");
    spans[3].textContent = mat.gravier.toLocaleString("fr-FR");
  }

  // 6. Animation visuelle (optionnel : met en évidence les résultats)
  const bloc2 = document.getElementById("bloc2");
  if (bloc2) {
    bloc2.style.transition = "box-shadow 0.3s ease";
    bloc2.style.boxShadow  = "0 0 0 3px #f0a500";
    setTimeout(() => { bloc2.style.boxShadow = "none"; }, 800);
  }
}
//  Branchement du bouton au chargement de la page
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.querySelector("button");
  if (btn) {
    btn.addEventListener("click", genererEstimation);
  }
});


///Connexion
//selecionner les input
const formulaire = document.querySelector('form');
const emailInput = document.querySelector('input[type="email"]');
const passwordInput = document.querySelector('input[type="password"]');
//ecouter l evenement
formulaire.addEventListener('submit', function(e) {
    e.preventDefault();
// supprimer les valeur
    emailInput.value = '';
    passwordInput.value = '';
});


