// sélectionnez le bouton de soumission de votre formulaire
const loginButton = document.querySelector('#login-button');
const loginverifButton = document.querySelector('#btn-login')

// ajoutez un écouteur d'événement pour le clic sur le bouton de soumission
loginverifButton.addEventListener('click', async (event) => {
  event.preventDefault(); // empêchez le formulaire de se soumettre normalement

  // récupérez les valeurs saisies dans les champs email et mot de passe
  const email = document.querySelector('#email-verif').value;
  const password = document.querySelector('#pass-verif').value;

  // récupérez les données utilisateur à partir du fichier JSON
  const response = await fetch('assets/json/fichier.json');
  const users = await response.json();

  // vérifiez si les identifiants de connexion sont valides
  const user = users.find(user => user.email === email && user.motdepasse === password);

  if (user) {
    // les identifiants de connexion sont valides, donc nous affichons une alerte de connexion réussie avec le rôle de l'utilisateur
    alert('Connexion réussie en tant que ' + user.role);

    // nous stockons le nom d'utilisateur dans localStorage
    localStorage.setItem('username', user.username);

    // fermez le modal de connexion
    const modal = bootstrap.Modal.getInstance(document.querySelector('#staticBackdrop1'));
    modal.hide();

    // mettez à jour le DOM pour afficher le nom d'utilisateur à la place du bouton de connexion
    checkLoginStatus();
  } else {
    // les identifiants de connexion ne sont pas valides, donc nous affichons un message d'erreur
    alert('Email ou mot de passe incorrect');
  }
});

// fonction pour vérifier si l'utilisateur est connecté et mettre à jour le DOM en conséquence
function checkLoginStatus() {
  const username = localStorage.getItem('username');

  if (username) {
    // l'utilisateur est connecté, donc nous remplaçons le bouton de connexion par le nom d'utilisateur
    loginButton.innerText = username;
    loginButton.removeAttribute('data-bs-toggle');
    loginButton.removeAttribute('data-bs-target');
  } else {
    // l'utilisateur n'est pas connecté, donc nous affichons le bouton de connexion
    loginButton.innerText = 'Connexion';
    loginButton.setAttribute('data-bs-toggle', 'modal');
    loginButton.setAttribute('data-bs-target', '#staticBackdrop1');
  }
}

// appelez la fonction checkLoginStatus lorsque la page est chargée
window.addEventListener('DOMContentLoaded', checkLoginStatus);
