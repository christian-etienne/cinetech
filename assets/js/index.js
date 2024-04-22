document.addEventListener('DOMContentLoaded', function() {
    let currentMoviesPage = 1; // Page actuelle pour les films
    let currentSeriesPage = 1; // Page actuelle pour les séries
    const itemsPerPage = 5; // Nombre d'éléments par page

    // Fonction pour récupérer les films et les séries tendances de la semaine
    function fetchTrendingContent(contentType, page) {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTVjMzIyNTJlZWMzOGIzZTgyNDEwNTI5ZjE2NmE4NyIsInN1YiI6IjY2MjYyOTA1YjlhMGJkMDBjZGQ0MzFlMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2Qpy9FgtaQ7Px6SwG910GW8KC7_eiQYMPj8vhp0laPQ'
            }
        };

        const url = contentType === 'movies' ? 'https://api.themoviedb.org/3/trending/movie/week?language=fr-FR' : 'https://api.themoviedb.org/3/trending/tv/week?language=fr-FR';

        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                // Appelle une fonction pour traiter les données des films ou des séries tendances
                processTrendingContent(data, contentType);
            })
            .catch(err => console.error(err));
    }

    // Fonction pour traiter les données des films ou des séries tendances
    function processTrendingContent(data, contentType) {
        const totalItems = data.total_results; // Nombre total d'éléments (films ou séries)

        // Affiche les éléments correspondants (films ou séries)
        if (contentType === 'movies') {
            displayItems(data.results, 'trending-movies-list', currentMoviesPage, itemsPerPage);
            displayPagination(totalItems, 'movies-pagination', currentMoviesPage);
        } else {
            displayItems(data.results, 'trending-series-list', currentSeriesPage, itemsPerPage);
            displayPagination(totalItems, 'series-pagination', currentSeriesPage);
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

            // Ajoute l'image de l'élément à la carte
            const image = document.createElement('img');
            image.classList.add('card-img-top');
            image.src = 'https://image.tmdb.org/t/p/w500' + item.poster_path; // Utilise l'URL de base des images TMDB
            image.alt = item.title || item.name; // Utilise le titre du film ou de la série
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
    function displayPagination(totalItems, containerId, currentPage) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const paginationContainer = document.getElementById(containerId);

        // Efface le contenu précédent de la pagination
        paginationContainer.innerHTML = '';

        // Crée un groupe de pagination Bootstrap
        const paginationList = document.createElement('ul');
        paginationList.classList.add('pagination');

        // Ajoute un bouton précédent
        const prevButton = createPaginationButton('Précédent', currentPage - 1, currentPage === 1);
        paginationList.appendChild(prevButton);

        // Ajoute un bouton pour chaque page, limité à un maximum de 5 pages
        for (let i = 1; i <= totalPages && i <= 5; i++) {
            const pageButton = createPaginationButton(i, i, false);
            paginationList.appendChild(pageButton);
        }

        // Ajoute un bouton suivant
        const nextButton = createPaginationButton('Suivant', currentPage + 1, currentPage === totalPages);
        paginationList.appendChild(nextButton);

        // Ajoute la liste de pagination au conteneur de pagination
        paginationContainer.appendChild(paginationList);
    }

    // Fonction pour créer un bouton de pagination Bootstrap
    function createPaginationButton(label, page, isDisabled) {
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
            link.addEventListener('click', function() {
                currentPage = page;
                fetchTrendingContent('movies', page);
            });
        }

        listItem.appendChild(link);
        return listItem;
    }

    // Appelle la fonction pour récupérer les films et les séries tendances de la semaine lors du chargement de la page
    fetchTrendingContent('movies', currentMoviesPage);
    fetchTrendingContent('series', currentSeriesPage);
});
