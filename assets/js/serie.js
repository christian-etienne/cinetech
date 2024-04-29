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
     
    
   

   
      
    function addToFavorites(serie) {
        // Pobranie aktualnej listy ulubionych seriali z localStorage
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
        // Sprawdzenie, czy dany serial już istnieje na liście ulubionych
        const existingFavorite = favorites.some(favorite => favorite.id === serie.id);
    
        // Jeśli serial nie istnieje na liście ulubionych, dodaj go
        if (!existingFavorite) {
            // Ajoute le film aux favoris
            favorites.push(serie);
            // Met à jour le localStorage
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    }
    
    
    
    function removeFromFavoriteserie(serieId) {
        // Pobranie aktualnej listy ulubionych seriali z localStorage
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
        // Usunięcie serialu o podanym id z listy ulubionych
        favorites = favorites.filter(serie => serie.id !== serieId);
    
        // Zapisanie zaktualizowanej listy ulubionych seriali do localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    function toggleFavorite(button, item) {
        console.log('Button clicked:', button);
      
        const icon = button.querySelector('i');
        console.log('Icon found:', icon);
        if (icon.classList.contains('far')) {
          icon.classList.remove('far');
          icon.classList.add('fas');
          icon.style.color = 'red';
          addToFavorites(item);
      
          
        } else {
          icon.classList.remove('fas');
          icon.classList.add('far');
          icon.style.color = '';
      
         
          removeFromFavoriteserie(item.id);
        }
      }

      function createFavoriteButton(item) {
        const favoriteButton = document.createElement('button');
        favoriteButton.classList.add('btn', 'btn-secondary', 'favorite-btn');
        favoriteButton.type = 'button';

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
            if (serie) {
                const col = document.createElement('div');
                col.classList.add('col');
    
                const card = document.createElement('div');
                card.classList.add('card', 'h-100');
    
                const image = document.createElement('img');
                image.classList.add('card-img-top');
                image.src = 'https://image.tmdb.org/t/p/w500' + serie.poster_path;
                image.alt = serie.name;
                image.style.height = '400px';
                image.style.cursor = 'pointer';
                image.addEventListener('click', function () {
                    // Dodajemy parametr "type=series" do adresu URL
                    window.location.href = `http://127.0.0.1:5500/assets/pages/detail.html?id=${serie.id}&type=series`;
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
    
                // Przekazujemy typ zawartości (series) do funkcji createFavoriteButton
                const favoriteButton = createFavoriteButton(serie, 'series');
                cardBody.appendChild(favoriteButton);
                card.appendChild(cardBody);
    
                col.appendChild(card);
                container.appendChild(col);
            }
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
            