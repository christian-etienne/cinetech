document.addEventListener('DOMContentLoaded', async function() {
    let currentMoviesPage = 1; // Page actuelle pour les films
    let currentSeriesPage = 1; // Page actuelle pour les séries
    const itemsPerPage = 4; // Nombre d'éléments par page

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

    function processTrendingContent(data, contentType) {
      const items = data.results || [];

      if (contentType === 'movies') {
        displayItems(items, 'trending-movies-list', currentMoviesPage, itemsPerPage, contentType);
        displayPagination(data.total_results, 'movies-pagination', 'movies', currentMoviesPage);
      } else {
        displayItems(items, 'trending-series-list', currentSeriesPage, itemsPerPage, contentType);
        displayPagination(data.total_results, 'series-pagination', 'series', currentSeriesPage);
      }
    }

    function displayItems(items, containerId, currentPage, itemsPerPage, contentType) {
      const container = document.getElementById(containerId);
      container.innerHTML = '';

      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      const itemsToDisplay = items.slice(startIndex, endIndex);

      itemsToDisplay.forEach(item => {
        const col = document.createElement('div');
        col.classList.add('col');

        const card = createCard(item, contentType);
        col.appendChild(card);

        container.appendChild(col);
      });
    }

    function createCard(item, contentType) {
      const card = document.createElement('div');
      card.classList.add('card', 'h-100');

      const image = document.createElement('img');
      image.classList.add('card-img-top');
      image.src = 'https://image.tmdb.org/t/p/w500' + item.poster_path;
      image.alt = item.title || item.name;
      image.style.cursor = 'pointer';
      image.addEventListener('click', function() {
        handleItemClick(item.id, contentType);
      });
      card.appendChild(image);

      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');

      const title = document.createElement('h5');
      title.classList.add('card-title');
      title.textContent = item.title || item.name;
      cardBody.appendChild(title);

      if (item.vote_average) {
        const rating = document.createElement('p');
        rating.classList.add('card-text');
        rating.textContent = 'Note : ' + item.vote_average;
        cardBody.appendChild(rating);
      }

      card.appendChild(cardBody);

      return card;
    }

    function handleItemClick(itemId, contentType) {
      window.location.href = `../assets/pages/detail.html?id=${itemId}&type=${contentType}`;
    }

    function displayPagination(totalItems, containerId, contentType, currentPage) {
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const paginationContainer = document.getElementById(containerId);

      paginationContainer.innerHTML = '';

      const paginationList = document.createElement('ul');
      paginationList.classList.add('pagination');

      const numPagesToShow = Math.min(5, totalPages);

      for (let i = 1; i <= numPagesToShow; i++) {
        const pageButton = createPaginationButton(i, i, false, contentType);
        paginationList.appendChild(pageButton);
      }

      paginationContainer.appendChild(paginationList);
    }

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
          event.preventDefault();
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

    await fetchTrendingContent('movies', currentMoviesPage);
    await fetchTrendingContent('series', currentSeriesPage);
  });
