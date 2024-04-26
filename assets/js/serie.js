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
        searchResultsContainer.style.position = 'absolute'; 
        searchResultsContainer.style.left = '0'; 
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
            const selectedItemId = clickedItem.dataset.id;
            window.location.href = `../assets/pages/detail.html?id=${selectedItemId}`;
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
        displayPagination(data.total_results, category, currentSeriesPage);
      }
     
    
    function createFavoriteButton() {
        const favoriteButton = document.createElement('button');
        favoriteButton.classList.add('btn', 'btn-secondary', 'favorite-btn');
        favoriteButton.type = 'button';
        favoriteButton.innerHTML = '<i class="far fa-heart"></i>';
        favoriteButton.addEventListener('click', function () {
            toggleFavorite(this);
        });
    
        return favoriteButton;
    }

    function toggleFavorite(button) {
        console.log('Button clicked:', button);
      
        const icon = button.querySelector('i');
        console.log('Icon found:', icon);
        if (icon.classList.contains('far')) {
          icon.classList.remove('far');
          icon.classList.add('fas');
          icon.style.color = 'red';
      
          const serieId = button.parentElement.parentElement.querySelector('.card-img-top').dataset.id;
          const serieName = button.parentElement.parentElement.querySelector('.card-title').textContent;
          const posterPath = button.parentElement.parentElement.querySelector('.card-img-top').src;
          addToFavorites(serieId, serieName, posterPath);
        } else {
          icon.classList.remove('fas');
          icon.classList.add('far');
          icon.style.color = '';
      
          const serieId = button.parentElement.parentElement.querySelector('.card-img-top').dataset.id;
          removeFromFavorites(serieId);
        }
      }
      
    function addToFavorites(serieId, serieName, posterPath) {
        // Pobranie aktualnej listy ulubionych seriali z localStorage
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
        // Sprawdzenie, czy dany serial już istnieje na liście ulubionych
        const existingFavorite = favorites.find(favorite => favorite.id === serieId);
    
        // Jeśli serial nie istnieje na liście ulubionych, dodaj go
        if (!existingFavorite) {
            favorites.push({
                id: serieId,
                name: serieName,
                poster_path: posterPath
            });
    
            // Zapisanie zaktualizowanej listy ulubionych seriali do localStorage
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    }
    
    
    
    function removeFromFavorites(serieId) {
        // Pobranie aktualnej listy ulubionych seriali z localStorage
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
        // Usunięcie serialu o podanym id z listy ulubionych
        favorites = favorites.filter(serie => serie.id !== serieId);
    
        // Zapisanie zaktualizowanej listy ulubionych seriali do localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    
    function categoryToContainerId(category) {
        switch (category) {
          case 'comedy':
            return 'series-container-comedy';
          case 'action_adventure':
            return 'series-container-action_adventure';
          case 'crime':
            return 'series-container-crime';
          case 'family':
            return 'series-container-family';
          default:
            console.error('Unknown category:', category);
            return null;
        }
      }
    function displaySeries(series, category, page) {
        
        const containerId = categoryToContainerId(category);
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        const startIndex = (currentSeriesPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const seriesToDisplay = series.slice(startIndex, endIndex);
  
        seriesToDisplay.forEach(serie => {
        const col = document.createElement('div');
        col.classList.add('col');

        const card = document.createElement('div');
        card.classList.add('card', 'h-100');

        const image = document.createElement('img');
        image.classList.add('card-img-top');
        image.src = 'https://image.tmdb.org/t/p/w500' + serie.poster_path;
        image.alt = serie.name;
        image.style.height = '400px'
        image.style.cursor = 'pointer'; 
        image.addEventListener('click', function () {
            window.location.href = `../assets/pages/detail.html?id=${serie.id}`;
    });
        card.appendChild(image);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.textContent = serie.name;
        cardBody.appendChild(title);

        const rating = document.createElement('p');
        rating.classList.add('card-text');
        rating.textContent = 'Note: ' + serie.vote_average.toFixed(1);
        rating.style.position = 'absolute';
        rating.style.bottom = '0';
        rating.style.left = '80px';
        cardBody.appendChild(rating);

        const favoriteButton = createFavoriteButton();
        cardBody.appendChild(favoriteButton);
        card.appendChild(cardBody);

        col.appendChild(card);

        container.appendChild(col);

        });
    }    
    function displayPagination(totalItems, category, currentPage) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const paginationContainerId = `series-pagination-${category}`;
        const paginationContainer = document.getElementById(paginationContainerId);
        paginationContainer.innerHTML = '';
      
        const paginationList = document.createElement('ul');
        paginationList.classList.add('pagination');
        const numPagesToShow = Math.min(5, totalPages);
      
        for (let i = 1; i <= numPagesToShow; i++) {
          const pageButton = createPaginationButton(i, category, i, currentPage === i);
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
            