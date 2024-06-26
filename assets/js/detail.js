document.addEventListener('DOMContentLoaded', async function() {
    const apiKey = '155c32252eec38b3e82410529f166a87'; // Remplacez par votre clé API TMDb
  
    const itemId = getParameterByName('id');
    const itemType = getParameterByName('type');

    if (itemId && itemType) {
      try {
        let itemResponse;
        let contentType;
        if (itemType === 'movies') {
          itemResponse = await fetch(`https://api.themoviedb.org/3/movie/${itemId}?api_key=${apiKey}&language=fr-FR`);
          contentType = 'movie';
        } else if (itemType === 'series') {
          itemResponse = await fetch(`https://api.themoviedb.org/3/tv/${itemId}?api_key=${apiKey}&language=fr-FR`);
          contentType = 'tv';
        }
  
        const itemData = await itemResponse.json();
        const creditsResponse = await fetch(`https://api.themoviedb.org/3/${contentType}/${itemId}/credits?api_key=${apiKey}`);
        const creditsData = await creditsResponse.json();
        const reviewsResponse = await fetch(`https://api.themoviedb.org/3/${contentType}/${itemId}/reviews?api_key=${apiKey}&language=fr-FR&page=1`);
        const reviewsData = await reviewsResponse.json();
  
        if (creditsResponse.ok && reviewsResponse.ok) {
          itemData.credits = creditsData;
          itemData.reviews = reviewsData;
  
          // Mettez à jour les détails liés aux crédits
          document.getElementById('movie-director').textContent = itemData.credits.crew.length > 0 ? `Réalisateur: ${getDirector(itemData.credits.crew)}` : 'Réalisateur inconnu';
          document.getElementById('movie-actors').textContent = itemData.credits.cast.length > 0 ? `Acteurs: ${getActors(itemData.credits.cast)}` : 'Acteurs inconnus';
  
          // Affichez les commentaires
          displayReviews(itemData.reviews.results);
        } else {
          console.error('Erreur lors de la récupération des crédits ou des commentaires du film ou de la série:', creditsResponse.statusText, reviewsResponse.statusText);
          itemData.credits = { crew: [], cast: [] }; // Provide a default value
          itemData.reviews = { results: [] }; // Provide a default value
        }
  
        const similarItems = await getSimilarItems(itemData.id, itemType);
        updatePageContent(itemData, itemType, similarItems);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du film ou de la série:', error);
      }
    } else {
      console.error('Aucun ID ou type de film ou de série spécifié.');
    }
  
    // Fonction pour récupérer les films ou séries similaires
    async function getSimilarItems(itemId, itemType) {
      let similarResponse;
      let contentType;
      if (itemType === 'movies') {
        similarResponse = await fetch(`https://api.themoviedb.org/3/movie/${itemId}/similar?api_key=${apiKey}&language=fr-FR`);
        contentType = 'movie';
      } else if (itemType === 'series') {
        similarResponse = await fetch(`https://api.themoviedb.org/3/tv/${itemId}/similar?api_key=${apiKey}&language=fr-FR`);
        contentType = 'tv';
      }
  
      const similarData = await similarResponse.json();
      return similarData.results;
    }
  
    // Fonction pour mettre à jour le contenu de la page
    async function updatePageContent(item, type, similarItems = []) {
      // Mettez à jour le titre du film ou de la série
      document.getElementById('movie-title').textContent = type === 'movies' ? item.title : item.name;
  
      // Mettez à jour l'affiche
      const posterPath = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '';
      document.getElementById('movie-poster').src = posterPath;
  
      // Mettez à jour le synopsis
      document.getElementById('movie-synopsis').textContent = item.overview;
  
      // Mettez à jour les détails
      document.getElementById('movie-release-date').textContent = type === 'movies' ? (item.release_date ? `Date de sortie: ${item.release_date}` : 'Date de sortie inconnue') : (item.first_air_date ? `Date de première diffusion: ${item.first_air_date}` : 'Date de première diffusion inconnue');
      document.getElementById('movie-duration').textContent = type === 'movies' ? (item.runtime ? `Durée: ${item.runtime} minutes` : 'Durée inconnue') : (item.episode_run_time ? `Durée des épisodes: ${item.episode_run_time[0]} minutes` : 'Durée des épisodes inconnue');
      document.getElementById('movie-genre').textContent = item.genres.length > 0 ? `Genre: ${getGenres(item.genres)}` : 'Genre inconnu';
      document.getElementById('movie-rating').textContent = item.vote_average ? `Note: ${item.vote_average}/10` : 'Note inconnue';
  
      // Mettez à jour l'élément HTML des films ou séries similaires
      const similarItemsList = document.getElementById('similar-movies');
      similarItemsList.innerHTML = ''; // Videz la liste avant de la remplir avec les nouveaux éléments
  
      if (similarItems.length > 0) {
        similarItems.forEach(similarItem => {
          const listItem = document.createElement('div');
          listItem.className = 'similar-item d-flex flex-column align-items-center'; // Utilisez les classes Bootstrap
      
          const itemImage = document.createElement('img');
          itemImage.src = `https://image.tmdb.org/t/p/w500${similarItem.poster_path}`;
          itemImage.alt = type === 'movies' ? similarItem.title : similarItem.name;
      
          const itemTitle = document.createElement('h3');
          itemTitle.textContent = type === 'movies' ? similarItem.title : similarItem.name;
          itemTitle.className = 'mt-2 w-50 text-center'; // Ajoutez une marge en haut pour l'écart avec l'image

          const itemRating = document.createElement('p');
          itemRating.textContent = similarItem.vote_average ? `Note: ${similarItem.vote_average}/10` : 'Note inconnue';
      
          listItem.appendChild(itemImage);
          listItem.appendChild(itemTitle);
          listItem.appendChild(itemRating);
      
          similarItemsList.appendChild(listItem);
      });
  
        // Initialisez le carrousel
        $(document).ready(function() {
          $('#similar-movies').slick({
            dots: true,
            infinite: false,
            speed: 300,
            slidesToShow: 4,
            slidesToScroll: 4,
            responsive: [
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 3,
                  infinite: true,
                  dots: true
                }
              },
              {
                breakpoint: 600,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2
                }
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1
                }
              }
            ]
          });
        });
      } else {
        similarItemsList.textContent = 'Aucun film ou série similaire trouvé.';
      }
    }
  
    // Fonction pour afficher les commentaires
    function displayReviews(reviews) {
      const reviewsContainer = document.getElementById('movie-reviews');
      reviewsContainer.innerHTML = ''; // Effacez les commentaires précédents
  
      if (reviews.length > 0) {
        reviews.forEach(review => {
          const reviewElement = document.createElement('div');
          reviewElement.classList.add('review');
  
          const authorElement = document.createElement('p');
          authorElement.classList.add('review-author');
          authorElement.textContent = `Auteur: ${review.author}`;
  
          const contentElement = document.createElement('p');
          contentElement.classList.add('review-content');
          contentElement.textContent = review.content;
  
          reviewElement.appendChild(authorElement);
          reviewElement.appendChild(contentElement);
  
          reviewsContainer.appendChild(reviewElement);
        });
      } else {
        const noReviewsElement = document.createElement('p');
        noReviewsElement.textContent = 'Aucun commentaire disponible.';
        reviewsContainer.appendChild(noReviewsElement);
      }
    }
  
    // Fonction pour extraire le réalisateur à partir de l'équipe
    function getDirector(crew) {
      for(let i = 0; i < crew.length; i++) {
        if(crew[i].job === 'Director') {
          return crew[i].name;
        }
      }
      return '';
    }
  
    // Fonction pour extraire les acteurs à partir de la distribution
    function getActors(cast) {
      let actors = '';
      for(let i = 0; i < cast.length && i < 5; i++) {
        actors += cast[i].name + ', ';
      }
      return actors.slice(0, -2); // Supprime la dernière virgule et l'espace
    }
  
    // Fonction pour extraire les genres
    function getGenres(genres) {
      let genreList = '';
      for(let i = 0; i < genres.length; i++) {
        genreList += genres[i].name + ', ';
      }
      return genreList.slice(0, -2); // Supprime la dernière virgule et l'espace
    }
  
    // Fonction pour extraire les paramètres de l'URL
    function getParameterByName(name) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    }
  });
