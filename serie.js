document.addEventListener('DOMContentLoaded', async function() {
    let currentSeriesPage = 1;
    const itemsPerPage = 4; 
    
    async function fetchPage(category, page) {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTVjMzIyNTJlZWMzOGIzZTgyNDEwNTI5ZjE2NmE4NyIsInN1YiI6IjY2MjYyOTA1YjlhMGJkMDBjZGQ0MzFlMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2Qpy9FgtaQ7Px6SwG910GW8KC7_eiQYMPj8vhp0laPQ'
            }
        };

 
            const searchInput = document.getElementById('search-input');
            const searchResultsList = document.getElementById('search-results-list');
            const searchResults = document.getElementById('search-results');
        
            // Funkcja do pobierania wyników wyszukiwania
            async function fetchSearchResults(query) {
                const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=155c32252eec38b3e82410529f166a87&query=${query}`;
                try {
                    const response = await fetch(searchUrl);
                    const data = await response.json();
                    return data.results;
                } catch (error) {
                    console.error('Error fetching search results:', error);
                    return [];
                }
            }
        
            // Funkcja do renderowania wyników wyszukiwania
            function renderSearchResults(results) {
                searchResultsList.innerHTML = ''; // Wyczyść poprzednie wyniki
        
                results.forEach(result => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-group-item');
                    listItem.textContent = result.title;
                    searchResultsList.appendChild(listItem);
                });
        
                if (results.length === 0) {
                    const noResultsItem = document.createElement('li');
                    noResultsItem.classList.add('list-group-item', 'text-muted', 'small');
                    noResultsItem.textContent = 'Brak wyników';
                    searchResultsList.appendChild(noResultsItem);
                }
        
                searchResults.style.display = results.length ? 'block' : 'none'; // Pokaż lub ukryj wyniki
            }
        
            // Obsługa zdarzenia wciśnięcia klawisza w polu wyszukiwania
            searchInput.addEventListener('input', async function(event) {
                const query = event.target.value.trim();
        
                if (query.length === 0) {
                    searchResultsList.innerHTML = ''; // Wyczyść wyniki, jeśli pole wyszukiwania jest puste
                    searchResults.style.display = 'none';
                    return;
                }
        
                const searchResults = await fetchSearchResults(query);
                renderSearchResults(searchResults);
            });
        
            // Obsługa kliknięcia wyniku wyszukiwania
            searchResultsList.addEventListener('click', function(event) {
                const clickedItem = event.target;
                const selectedItemText = clickedItem.textContent;
                searchInput.value = selectedItemText; // Ustaw wartość pola wyszukiwania na kliknięty wynik
                searchResults.style.display = 'none'; // Ukryj wyniki
            });
        
        

        let url = '';
        switch (category) {
          
            case 'comedy':
                url = `https://api.themoviedb.org/3/discover/tv?with_genres=35&page=${page}`;
                break;
            case 'action_adventure':
                url = `https://api.themoviedb.org/3/discover/tv?with_genres=10759&page=${page}`;
                break;
            case 'crime':
                url = `https://api.themoviedb.org/3/discover/tv?with_genres=80&page=${page}`;
                break;
            case 'family':
                url = `https://api.themoviedb.org/3/discover/tv?with_genres=10751&page=${page}`;
                break;
            default:
                console.error('Unknown category');
                return;
        }

        try {
            const response = await fetch(url, options);
            const data = await response.json();

            processTrendingSeries(data, category);
        } catch (error) {
            console.error(error);
        }
    }


    function processTrendingSeries(data, category) {
        const series = data.results || [];

        displaySeries(series, category);
        displayPagination(data.total_results, category);
    }

    function displaySeries(series, category) {
        
        const seriesContainerId = `series-container-${category}`;
        const seriesContainer = document.getElementById(seriesContainerId);
        seriesContainer.innerHTML = '';
  
        const startIndex = (currentSeriesPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const seriesToDisplay = series.slice(startIndex, endIndex);
  
        seriesToDisplay.forEach(serie => {
            const card = createCard(serie);
            seriesContainer.appendChild(card);
        });
    }
    function createCard(serie) {

        const container = document.getElementById('container')
        
        const card = document.createElement('div');
        card.classList.add('card', 'm-2'); 
        card.style.height = '500px';
        const image = document.createElement('img');
        image.classList.add('card-img-top');
        image.classList.add('serie-image'); // Dodajemy klasę 'serie-image' tutaj
        image.src = 'https://image.tmdb.org/t/p/w500' + serie.poster_path;
        image.alt = serie.name;
        image.style.height = '400px';
        image.style.cursor = 'pointer'; 
        image.addEventListener('click', function () {
        window.location.href = `../assets/pages/detail.html?id=${serie.id}`;
        });
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');


        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.textContent = serie.name;

        const rating = document.createElement('p');
        rating.classList.add('card-text');
        rating.textContent = 'Note: ' + serie.vote_average.toFixed(1);
        rating.style.position = 'absolute';
        rating.style.bottom = '0'

        cardBody.appendChild(title);
        card.appendChild(image);
        card.appendChild(cardBody);
        cardBody.appendChild(rating);

        return card;
    }

    function displayPagination(totalItems, category) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const paginationContainerId = `series-pagination-${category}`;
        const paginationContainer = document.getElementById(paginationContainerId);
        paginationContainer.innerHTML = '';
  
        const paginationList = document.createElement('ul');
        paginationList.classList.add('pagination');
  
        const numPagesToShow = Math.min(4, totalPages);
  
        for (let i = 1; i <= numPagesToShow; i++) {
            const pageButton = createPaginationButton(i, category);
            paginationList.appendChild(pageButton);
        }
  
        paginationContainer.appendChild(paginationList);
    }
    

    function createPaginationButton(label, category) {
        const listItem = document.createElement('li');
        listItem.classList.add('page-item');
  
        const link = document.createElement('a');
        link.classList.add('page-link');
        link.href = '#';
        link.textContent = label;
  
        link.addEventListener('click', async function(event) {
            event.preventDefault();
            currentSeriesPage = label;
            await fetchPage(category, currentSeriesPage);
        });
  
        listItem.appendChild(link);
        return listItem;
    }

    await fetchPage('comedy', currentSeriesPage); // Dodane wywołanie dla kategorii komedii
    await fetchPage('action_adventure', currentSeriesPage); // Dodane wywołanie dla kategorii akcji i przygody
    await fetchPage('crime', currentSeriesPage); // Dodane wywołanie dla kategorii kryminał
    await fetchPage('family', currentSeriesPage); // Dodane wywołanie dla kategorii rodziny
});
            