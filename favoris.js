document.addEventListener('DOMContentLoaded', async function () {
    await fetchFavoriteMovies(); // Appel de la fonction pour récupérer les films favoris
});

async function fetchFavoriteMovies() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    processFavoriteMovies(favorites); // Appel de la fonction pour traiter les films favoris
}

function processFavoriteMovies(items) {
    // Sélection de la section des films dans le DOM
    const filmSection = document.querySelector('.category_films .container');

    // Vidage de la section des films
    filmSection.innerHTML = '';

    // Création d'une rangée Bootstrap
    const row = document.createElement('div');
    row.classList.add('row');

    // Boucle à travers les films et création des éléments DOM pour chaque film
    items.forEach(item => {
        // Création de la carte Bootstrap pour chaque film
        const card = document.createElement('div');
        card.classList.add('col-lg-3', 'col-md-4', 'col-sm-6', 'mb-4'); // Classes Bootstrap pour définir la largeur et la marge inférieure de la carte
        card.style.display = 'flex'; // Pour afficher les cartes en ligne
        card.style.flexDirection = 'column'; // Alignement vertical des éléments à l'intérieur de la carte

        // Création de l'image pour chaque film
        const image = document.createElement('img');
        image.classList.add('card-img-top');
        image.src = 'https://image.tmdb.org/t/p/w500' + item.poster_path;
        image.alt = item.title || item.name;
        image.style.cursor = 'pointer'; 
        image.addEventListener('click', function () {
            window.location.href = `../assets/pages/detail.html?id=${item.id}`;
        });
        card.appendChild(image);

        // Création du corps de la carte
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Ajout du titre du film à la carte
        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.textContent = item.title || item.name;
        cardBody.appendChild(title);

        // Ajout de la note du film à la carte (uniquement pour les films)
        if (item.vote_average) {
            const rating = document.createElement('p');
            rating.classList.add('card-text');
            rating.textContent = 'Note : ' + item.vote_average;
            cardBody.appendChild(rating);
        }

        // Bouton "Supprimer" pour retirer le film des favoris
        const removeButton = document.createElement('button');
        removeButton.classList.add('btn', 'btn-danger');
        removeButton.textContent = 'Supprimer';
        removeButton.addEventListener('click', function () {
            removeFavoriteMovie(item.id);
            fetchFavoriteMovies(); // Actualiser la liste des films après suppression
        });
        cardBody.appendChild(removeButton);

        card.appendChild(cardBody);

        // Ajout de la carte à la rangée
        row.appendChild(card);
    });

    // Ajout de la rangée à la section des films
    filmSection.appendChild(row);
}

// Fonction pour supprimer un film des favoris
function removeFavoriteMovie(movieId) {
    // Récupère les films favoris depuis le localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Filtre les films pour supprimer celui avec l'ID donné
    favorites = favorites.filter(movie => movie.id !== movieId);

    // Met à jour le localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
}
