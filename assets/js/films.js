let currentMoviesPage = {
    28: 1, // Action
    35: 1, // Comédie
    10749: 1, // Romance
    878: 1, // Science-fiction
    53: 1 // Thriller
};

const itemsPerPage = 4; // nombre d'éléments par page

document.addEventListener('DOMContentLoaded', async function () {
    await fetchMoviesByCategory(28, currentMoviesPage[28]); // Action
    await fetchMoviesByCategory(35, currentMoviesPage[35]); // Comédie
    await fetchMoviesByCategory(10749, currentMoviesPage[10749]); // Romance
    await fetchMoviesByCategory(878, currentMoviesPage[878]); // Science-fiction
    await fetchMoviesByCategory(53, currentMoviesPage[53]); // Thriller
});

async function fetchMoviesByCategory(category, page) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTVjMzIyNTJlZWMzOGIzZTgyNDEwNTI5ZjE2NmE4NyIsInN1YiI6IjY2MjYyOTA1YjlhMGJkMDBjZGQ0MzFlMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2Qpy9FgtaQ7Px6SwG910GW8KC7_eiQYMPj8vhp0laPQ'
        }
    };

    const url = `https://api.themoviedb.org/3/discover/movie?language=fr-FR&with_genres=${category}&page=${page}`;

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        processMoviesByCategory(data, category, page);
    } catch (error) {
        console.error(error);
    }
}

function processMoviesByCategory(data, category, page) {
    const items = data.results || [];

    displayItems(items, category, page);
    displayPagination(data.total_results, category, page);
}

// Fonction pour sauvegarder un film dans les favoris
function saveFavoriteMovie(movie) {
    // Vérifie si des films sont déjà sauvegardés dans les favoris
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Vérifie si le film est déjà dans les favoris
    const exists = favorites.some(favorite => favorite.id === movie.id);

    if (!exists) {
        // Ajoute le film aux favoris
        favorites.push(movie);
        // Met à jour le localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
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

function toggleFavorite(button, item) {
    const icon = button.querySelector('i');

    if (icon.classList.contains('far')) {
        // Le film n'est pas dans la liste des favoris, on l'ajoute
        icon.classList.remove('far');
        icon.classList.add('fas');
        icon.style.color = 'red';

        // Sauvegarde le film dans les favoris
        saveFavoriteMovie(item);
    } else {
        // Le film est dans la liste des favoris, on le supprime
        icon.classList.remove('fas');
        icon.classList.add('far');
        icon.style.color = '';
        // Supprime le film des favoris
        removeFavoriteMovie(item.id);
    }
}

function createFavoriteButton(item) {
    const favoriteButton = document.createElement('button');
    favoriteButton.classList.add('btn', 'btn-secondary', 'favorite-btn');
    favoriteButton.type = 'button';

    // Vérifie si le film est déjà dans les favoris
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isFavorite = favorites.some(favorite => favorite.id === item.id);

    if (isFavorite) {
        // Le film est déjà dans les favoris, change la couleur du bouton en rouge
        favoriteButton.innerHTML = '<i class="fas fa-heart" style="color: red;"></i>';
    } else {
        favoriteButton.innerHTML = '<i class="far fa-heart"></i>';
    }

    favoriteButton.addEventListener('click', function () {
        toggleFavorite(this, item);
    });

    return favoriteButton;
}

function displayItems(items, category, page) {
    const containerId = categoryToContainerId(category);
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    // Calcule l'index de début et de fin des éléments à afficher sur la page actuelle
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Récupère seulement les éléments à afficher sur la page actuelle
    const itemsToDisplay = items.slice(startIndex, endIndex);

    itemsToDisplay.forEach(item => {
        // Crée une colonne Bootstrap pour chaque élément
        const col = document.createElement('div');
        col.classList.add('col');

        // Crée une carte Bootstrap pour chaque élément
        const card = document.createElement('div');
        card.classList.add('card', 'h-100');

        // Crée une image cliquable pour chaque élément
        const image = document.createElement('img');
        image.classList.add('card-img-top');
        image.src = 'https://image.tmdb.org/t/p/w500' + item.poster_path; // Utilise l'URL de base des images TMDB
        image.alt = item.title || item.name; // Utilise le titre du film ou de la série
        image.style.cursor = 'pointer'; // Change le curseur pour indiquer que l'image est cliquable
        image.addEventListener('click', function () {
            // Redirige l'utilisateur vers la page de détails avec l'ID du film ou de la série comme paramètre d'URL
            window.location.href = `../assets/pages/detail.html?id=${item.id}`;
        });
        card.appendChild(image);

        // Crée le corps de la carte
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Ajoute le titre de l'élément à la carte
        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.textContent = item.title || item.name; // Utilise le titre du film ou de la série
        cardBody.appendChild(title);

        // Ajoute la note de l'élément à la carte (uniquement pour les films)
        if (item.vote_average) {
            const rating = document.createElement('p');
            rating.classList.add('card-text');
            rating.textContent = 'Note : ' + item.vote_average;
            cardBody.appendChild(rating);
        }
        // / Ajoute l'attribut 'data-movie-id' à l'image pour stocker l'ID du film
        image.setAttribute('data-movie-id', item.id);

        // Ajoute le bouton favori à la carte
        const favoriteButton = createFavoriteButton(item);
        cardBody.appendChild(favoriteButton);

        card.appendChild(cardBody);

        // Ajoute la carte à la colonne
        col.appendChild(card);

        // Ajoute la colonne à la grille de films ou de séries
        container.appendChild(col);
    });
}

function categoryToContainerId(category) {
    switch (category) {
        case 28:
            return 'action';
        case 35:
            return 'comedy';
        case 10749:
            return 'romance';
        case 878:
            return 'science-fiction';
        case 53:
            return 'thriller';
        default:
            return '';
    }
}

function displayPagination(totalItems, category, currentPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationContainer = document.getElementById(`pagination-${category}`);
    if (!paginationContainer) {
        console.error(`L'élément avec l'ID "pagination-${category}" n'existe pas.`);
        return;
    }

    // Efface le contenu précédent de la pagination
    paginationContainer.innerHTML = '';

    // Crée un groupe de pagination Bootstrap
    const paginationList = document.createElement('ul');
    paginationList.classList.add('pagination');

    // Ajoute un bouton pour chaque page, limité à un maximum de 5 pages
    for (let i = 1; i <= 5 && i <= totalPages; i++) {
        const pageButton = createPaginationButton(i, category, i, currentPage === i);
        paginationList.appendChild(pageButton);
    }

    // Ajoute la liste de pagination au conteneur de pagination
    paginationContainer.appendChild(paginationList);
    
    paginationContainer.style.marginTop = '20px';
    paginationContainer.style.display = 'flex'; // Ajoutez cette ligne
    paginationContainer.style.justifyContent = 'center'; // Modifiez cette ligne
}

function createPaginationButton(label, category, page, isDisabled) {
    const listItem = document.createElement('li');
    listItem.classList.add('page-item');

    const link = document.createElement('a');
    link.classList.add('page-link');
    link.href = '#';
    link.textContent = label;
    if (isDisabled) {
        listItem.classList.add('disabled');
        link.setAttribute('aria-disabled', 'true');
    } else {
        link.addEventListener('click', async function (event) {
            event.preventDefault();
            currentMoviesPage[category] = page;
            await fetchMoviesByCategory(category, page);
        });
    }

    listItem.appendChild(link);
    return listItem;
}
