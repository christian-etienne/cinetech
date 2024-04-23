    // Fonction pour récupérer les films tendances de la semaine
    async function fetchTrendingContent(contentType, page) {
      const options = {
          method: 'GET',
          headers: {
              accept: 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTVjMzIyNTJlZWMzOGIzZTgyNDEwNTI5ZjE2NmE4NyIsInN1YiI6IjY2MjYyOTA1YjlhMGJkMDBjZGQ0MzFlMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2Qpy9FgtaQ7Px6SwG910GW8KC7_eiQYMPj8vhp0laPQ'
          }
      };

      const url = contentType === 'movies' ? 'https://api.themoviedb.org/3/trending/movie/week?language=fr-FR'

      try {
          const response = await fetch(url, options);
          const data = await response.json();
          processTrendingContent(data, contentType);
      } catch (error) {
          console.error(error);
      }
  }