document.addEventListener('DOMContentLoaded', async function() {
    let currentMoviesPage = 1; // Page actuelle pour les films
    let currentSeriesPage = 1; // Page actuelle pour les séries
    const itemsPerPage = 5; // Nombre d'éléments par page

    // Fonction pour récupérer les films et les séries tendances de la semaine
    async function fetchTrendingContent(contentType, page) {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTVjMzIyNTJlZWMzOGIzZTgyNDEwNTI5ZjE2NmE4NyIsInN1YiI6IjY2MjYyOTA1YjlhMGJkMDBjZGQ0MzFlMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2Qpy9FgtaQ7Px6SwG910GW8KC7_eiQYMPj8vhp0laPQ'
            }
        };

        const url = contentType === 'movies' ? 'https://api.themoviedb.org/3/trending/movie/week?language=fr-FR' : 'https://api.themoviedb.org/3/trending/tv/week?language=fr-FR';

        try {
        const response = await fetch(url, options);
        const data = await response.json();

        // Stocke les données récupérées
        if (contentType === 'movies') {
            trendingMovies = data;
        } else {
            trendingSeries = data;
        }

        processTrendingContent(data, contentType);
    } catch (error) {
        console.error(error);
    }
}

    // Fonction pour traiter les données des films ou des séries tendances
    function processTrendingContent(data, contentType) {
        const items = data.results || []; // Assurez-vous que items est défini

        // Affiche les éléments correspondants (films ou séries)
        if (contentType === 'movies') {
            displayItems(items, 'trending-movies-list', currentMoviesPage, itemsPerPage);
            displayPagination(data.total_results, 'movies-pagination', 'movies', currentMoviesPage);
        } else {
            displayItems(items, 'trending-series-list', currentSeriesPage, itemsPerPage);
            displayPagination(data.total_results, 'series-pagination', 'series', currentSeriesPage);
        }
    }

    // Fonction pour afficher les éléments (films ou séries) par page
function displayItems(items, containerId, currentPage, itemsPerPage) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Efface le contenu précédent

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
        image.addEventListener('click', function() {
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

    // Efface le contenu précédent de la pagination
    paginationContainer.innerHTML = '';

    // Crée un groupe de pagination Bootstrap
    const paginationList = document.createElement('ul');
    paginationList.classList.add('pagination');

    // Détermine le nombre de boutons de pagination à afficher (maximum de 4 pages)
    const numPagesToShow = Math.min(4, totalPages);

    // Ajoute un bouton pour chaque page
    for (let i = 1; i <= numPagesToShow; i++) {
        const pageButton = createPaginationButton(i, i, false, contentType);
        paginationList.appendChild(pageButton);
    }

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
    
        const totalPages = Math.ceil((contentType === 'movies' ? trendingMovies.total_results : trendingSeries.total_results) / itemsPerPage);
    
        if (isDisabled || (label === 'Suivant' && page > totalPages)) {
            listItem.classList.add('disabled');
            link.setAttribute('aria-disabled', 'true');
        } else {
            link.addEventListener('click', async function(event) {
                event.preventDefault(); // Empêche le comportement par défaut du lien
                if (contentType === 'movies') {
                    currentMoviesPage = page;
                } else {
                    currentSeriesPage = page;
                }
                await fetchTrendingContent(contentType, page);
            });
        }
    
        listItem.appendChild(link);
        return listItem;
    }
    // Appelle la fonction pour récupérer les films et les séries tendances de la semaine lors du chargement de la page
    await fetchTrendingContent('movies', currentMoviesPage);
    await fetchTrendingContent('series', currentSeriesPage);
});
