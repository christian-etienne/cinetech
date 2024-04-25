document.addEventListener('DOMContentLoaded', async function() {
    let currentSeriesPage = 1;
    const itemsPerPage = 4; 

    const searchInput = document.getElementById('search-input');
        const searchResultsList = document.getElementById('search-results-list');
        const searchResultsContainer = document.getElementById('search-results');
        const searchButton = document.getElementById('search-button');
    
    async function fetchPage(category, page) {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTVjMzIyNTJlZWMzOGIzZTgyNDEwNTI5ZjE2NmE4NyIsInN1YiI6IjY2MjYyOTA1YjlhMGJkMDBjZGQ0MzFlMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2Qpy9FgtaQ7Px6SwG910GW8KC7_eiQYMPj8vhp0laPQ'
            }
        };


        
        
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

        function renderSearchResults(results) {
            searchResultsList.innerHTML = '';
        
            results.forEach(result => {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item');
                listItem.textContent = result.title;
                listItem.dataset.id = result.id;
                let lastHoveredItem = null;
                listItem.addEventListener('mouseover', function() {
                    this.style.cursor = 'pointer';
                    if (lastHoveredItem !== null) {
                        lastHoveredItem.style.backgroundColor = '';
                        lastHoveredItem.style.color = '';
                    }
                    this.style.backgroundColor = '#007bff';
                    this.style.color = 'white';
                    lastHoveredItem = this;
                });

                listItem.addEventListener('mouseout', function () {
                    this.style.backgroundColor = '';
                    this.style.color = '';
                    lastHoveredItem = null;
                });
        
                listItem.addEventListener('click', function () {
                    const selectedItemId = this.dataset.id;
                    window.location.href = `../assets/pages/detail.html?id=${selectedItemId}`;
        
                    const listItems = searchResultsList.getElementsByClassName('list-group-item');
                    for (let i = 0; i < listItems.length; i++) {
                        listItems[i].style.backgroundColor = '';
                        listItems[i].style.color = '';
                    }
                    
                });
                listItem.style.pointerEvents = 'auto';
                searchResultsList.appendChild(listItem);
            });
            if (results.length === 0) {
                const noResultsItem = document.createElement('li');
                noResultsItem.classList.add('list-group-item', 'text-muted', 'small');
                noResultsItem.textContent = 'pas des resultats';
                searchResultsList.appendChild(noResultsItem);  
        }
        searchResultsContainer.style.display = results.length ? 'block' : 'none';
            searchResultsContainer.style.zIndex = results.length ? 9999 : -1;
            searchResultsContainer.style.height = '300px';
            searchResultsContainer.style.width = '400px';
            searchResultsContainer.style.overflowY = 'auto';
            searchResultsContainer.style.position = 'absolute'; // Set the container to absolute positioning
            searchResultsContainer.style.left = '0'; // Align the container to the left edge of its parent container
            searchResultsContainer.style.top = '15%';
    }
        
        searchInput.addEventListener('input', async function(event) {
            const query = event.target.value.trim();
        
            if (query.length === 0) {
                searchResultsList.innerHTML = '';
                searchResultsContainer.style.display = 'none';
                return;
            }
        
            const results = await fetchSearchResults(query);
            renderSearchResults(results);
            searchResultsContainer.style.zIndex = 9999;
        });
        
        searchResultsList.addEventListener('click', function(event) {
            const clickedItem = event.target;
            if (clickedItem.tagName.toLowerCase() === 'li') {
                const selectedItemId = clickedItem.dataset.id; // Get the stored ID
                window.location.href = `../assets/pages/detail.html?id=${selectedItemId}`; // Navigate to the details page
            }
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

        const favoris = document.createElement('img');
        favoris.classList.add('heart');
        favoris.src = ' images/heart.jpg ';
        favoris.style.height = '25px';
        favoris.style.width = '25px';
        favoris.style.position = 'absolute';
        favoris.style.left = '240px';



        cardBody.appendChild(title);
        card.appendChild(image);
        card.appendChild(cardBody);
        cardBody.appendChild(rating);
        cardBody.appendChild(favoris)

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

    await fetchPage('comedy', currentSeriesPage); 
    await fetchPage('action_adventure', currentSeriesPage); 
    await fetchPage('crime', currentSeriesPage); 
    await fetchPage('family', currentSeriesPage); 
});
            