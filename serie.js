document.addEventListener('DOMContentLoaded', function() {
  let currentSeriesPage = 1; // Page actuelle pour les séries
  const itemsPerPage = 16; // Nombre d'éléments par page

  function fetchProcessContent(page) {
      const options = {
          method: 'GET',
          headers: {
              accept: 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTVjMzIyNTJlZWMzOGIzZTgyNDEwNTI5ZjE2NmE4NyIsInN1YiI6IjY2MjYyOTA1YjlhMGJkMDBjZGQ0MzFlMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2Qpy9FgtaQ7Px6SwG910GW8KC7_eiQYMPj8vhp0laPQ'
          }
      };

      const url = 'https://api.themoviedb.org/3/tv/popular?language=en-US&page=1';
      fetch(url, options)
          .then(response => response.json())
          .then(data => {
              processContent(data);
          })
          .catch(err => console.error(err));
  }

  function processContent(data) {
      const totalItems = data.total_results;

      displayItems(data.results, 'tv-series-list-popular', currentSeriesPage, itemsPerPage);
      displayPagination(totalItems, 'series-pagination', currentSeriesPage);
  }

  function displayItems(items, containerId, currentPage, itemsPerPage) {
      const container = document.getElementById(containerId);
      container.innerHTML = '';

      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      const itemsToDisplay = items.slice(startIndex, endIndex);

      itemsToDisplay.forEach(item => {
          const col = document.createElement('div');
          col.classList.add('col');

          const card = document.createElement('div');
          card.classList.add('card', 'h-100');

          const image = document.createElement('img');
          image.classList.add('card-img-top');
          image.src = 'https://image.tmdb.org/t/p/w500' + item.poster_path;
          image.alt = item.title || item.name;
          card.appendChild(image);

          const cardBody = document.createElement('div');
          cardBody.classList.add('cardBody');

          const title = document.createElement('p');
          title.classList.add('card-title');
          title.textContent = item.title || item.name; // Utilise le titre du film ou de la série
          cardBody.appendChild(title);

          card.appendChild(cardBody);
          col.appendChild(card);
          container.appendChild(col);
      });
  }

  function displayPagination(totalItems, containerId, currentPage) {
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const paginationContainer = document.getElementById(containerId);
      paginationContainer.innerHTML = '';

      const paginationList = document.createElement('ul');
      paginationList.classList.add('pagination');

      const prevButton = createPaginationButton('Précédent', currentPage - 1, currentPage === 1);
      paginationList.appendChild(prevButton);

      for (let i = 1; i <= totalPages && i <= 5; i++) {
          const pageButton = createPaginationButton(i, i, false);
          paginationList.appendChild(pageButton);
      }

      const nextButton = createPaginationButton('Suivant', currentPage + 1, currentPage === totalPages);
      paginationList.appendChild(nextButton);

      paginationContainer.appendChild(paginationList);
  }

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
              currentSeriesPage = page;
              fetchProcessContent(page);
          });
      }

      listItem.appendChild(link);
      return listItem;
  }

  // Appelle la fonction pour récupérer les séries
  fetchProcessContent(currentSeriesPage);
});
