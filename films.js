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
      processMoviesByCategory(data, category);
    } catch (error) {
      console.error(error);
    }
  }
  
  function processMoviesByCategory(data, category) {
    const items = data.results || [];
  
    // Affiche les éléments correspondants à la catégorie
    if (category === 28) { // Action
      displayItems(items, 'action', 1, 5);
    } else if (category === 35) { // Comédie
      displayItems(items, 'comedy', 1, 5);
    } else if (category === 10749) { // Romance
      displayItems(items, 'romance', 1, 5);
    } else if (category === 878) { // Science-fiction
      displayItems(items, 'science-fiction', 1, 5);
    } else if (category === 53) { // Thriller
      displayItems(items, 'thriller', 1, 5);
    }
  }
  
  // Fonction pour afficher les éléments (films) par page et par catégorie
  function displayItems(items, containerId, currentPage, itemsPerPage) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; //
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

// Appelle la fonction pour récupérer les films de chaque catégorie
fetchMoviesByCategory(28, 1); // Action
fetchMoviesByCategory(12, 1); // Aventure
fetchMoviesByCategory(16, 1); // Animation
fetchMoviesByCategory(35, 1); // Comédie
fetchMoviesByCategory(80, 1); // Crime
fetchMoviesByCategory(99, 1); // Documentaire
fetchMoviesByCategory(18, 1); // Drame
fetchMoviesByCategory(10751, 1); // Famille
fetchMoviesByCategory(14, 1); // Fantastique
fetchMoviesByCategory(36, 1); // Histoire
fetchMoviesByCategory(27, 1); // Horreur
fetchMoviesByCategory(10402, 1); // Musique
fetchMoviesByCategory(9648, 1); // Mystère
fetchMoviesByCategory(10749, 1); // Romance
fetchMoviesByCategory(878, 1); // Science-fiction
fetchMoviesByCategory(10770, 1); // Télévision
fetchMoviesByCategory(53, 1); // Thriller
fetchMoviesByCategory(10752, 1); // Guerre
fetchMoviesByCategory(37, 1); // Western
  