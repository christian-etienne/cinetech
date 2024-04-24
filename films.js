let currentMoviesPage = 1;
const itemsPerPage = 4; // nombre d'éléments par page

document.addEventListener('DOMContentLoaded', async function () {
    await fetchMoviesByCategory(28, 1); // Action
    await fetchMoviesByCategory(35, 1); // Comédie
    await fetchMoviesByCategory(27, 1); // Horreur
    await fetchMoviesByCategory(10749, 1); // Romance
    await fetchMoviesByCategory(878, 1); // Science-fiction
    await fetchMoviesByCategory(53, 1); // Thriller
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

    // Affiche les éléments correspondants à la catégorie
    if (category === 28) { // Action
        displayItems(items, 'action', page, itemsPerPage);
    } else if (category === 35) { // Comédie
        displayItems(items, 'comedy', page, itemsPerPage);
    } else if (category === 10749) { // Romance
        displayItems(items, 'romance', page, itemsPerPage);
    } else if (category === 878) { // Science-fiction
        displayItems(items, 'science-fiction', page, itemsPerPage);
    } else if (category === 53) { // Thriller
        displayItems(items, 'thriller', page, itemsPerPage);

    }

    

    // Affiche la pagination
    displayPagination(data.total_results, `pagination-${category}`, category, page);
}

// Fonction pour afficher les éléments (films) par page et par catégorie
function displayItems(items, containerId, currentPage, itemsPerPage) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    // Calcule l'index de début et de fin des éléments à afficher sur la page actuelle
    const startIndex = (currentPage - 1) * itemsPerPage;
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

        card.appendChild(cardBody);

        // Ajoute la carte à la colonne
        col.appendChild(card);

        // Ajoute la colonne à la grille de films ou de séries
        container.appendChild(col);
    });
}

// Fonction pour afficher la pagination
function displayPagination(totalItems, containerId, contentType, currentPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationContainer = document.getElementById(containerId);
    
 // Vérifiez si paginationContainer existe avant de continuer
     if (!paginationContainer) {
        console.error(`L'élément avec l'ID "${containerId}" n'existe pas.`);
        return;
    }


    // Efface le contenu précédent de la pagination
    paginationContainer.innerHTML = '';

    // Crée un groupe de pagination Bootstrap
    const paginationList = document.createElement('ul');
    paginationList.classList.add('pagination');

    // Ajoute un bouton précédent
    const prevButton = createPaginationButton('Précédent', currentPage - 1, currentPage === 1, contentType);
    paginationList.appendChild(prevButton);

    // Ajoute un bouton pour chaque page, limité à un maximum de 5 pages
    for (let i = 1; i <= 5 && i <= totalPages; i++) {
        const pageButton = createPaginationButton(i, i, currentPage === i, contentType);
        paginationList.appendChild(pageButton);
    }

    // Ajoute un bouton suivant
    const nextButton = createPaginationButton('Suivant', currentPage + 1, currentPage === totalPages, contentType);
    paginationList.appendChild(nextButton);

    // Ajoute la liste de pagination au conteneur de pagination
    paginationContainer.appendChild(paginationList);
}

// Fonction pour créer un bouton de pagination Bootstrap
function createPaginationButton(label, page, isDisabled, contentType) {
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
            event.preventDefault(); // Empêche le comportement par défaut du lien
            currentMoviesPage = page;
            await fetchMoviesByCategory(contentType, page);
        });
    }

    listItem.appendChild(link);
    return listItem;
}

// Appelle la fonction pour récupérer les films de chaque catégorie
fetchMoviesByCategory(28, 1); // Action
fetchMoviesByCategory(35, 1); // Comédie
fetchMoviesByCategory(27, 1); // Horreur
fetchMoviesByCategory(10749, 1); // Romance
fetchMoviesByCategory(878, 1); // Science-fiction
fetchMoviesByCategory(53, 1); // Thriller
