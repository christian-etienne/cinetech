
    document.addEventListener('DOMContentLoaded', getMovies);

    async function getMovies() {
      const API_KEY = '8c4b867188ee47a1d4e40854b27391ec';
      const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
      const data = await response.json();
      const movies = data.results.slice(0, 4); // Get the first four movies
      
      const moviesList = document.getElementById('moviesList');
      movies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie.title;
        moviesList.appendChild(li);
      });
    }
  