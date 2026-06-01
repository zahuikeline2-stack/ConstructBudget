// On sélectionne le formulaire 
const formulaire = document.querySelector('form');
formulaire.addEventListener('submit', function(event) {
    // Empêche le rechargement de la page 
    event.preventDefault();
    // suppimer tous les champs 
    formulaire.reset();
});

//menu hamburger
 const hamburger = document.getElementById('hamburger');
        const header = document.querySelector('header');

        hamburger.addEventListener('click', () => {
            header.classList.toggle('open');
            hamburger.classList.toggle('active');
        });

        // Fermer le menu au clic sur un lien
        document.querySelectorAll('#menu nav a, .mobile a').forEach(link => {
            link.addEventListener('click', () => {
                header.classList.remove('open');
                hamburger.classList.remove('active');
            });
        });