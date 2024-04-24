document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '155c32252eec38b3e82410529f166a87'; // Remplacez par votre clé API TMDb
    const itemId = getParameterByName('id'); // Fonction pour obtenir le paramètre d'URL 'id'

    // Vérifiez si l'ID est disponible fr-FR
    if (itemId) {
        // Appeler une fonction pour récupérer les détails du film ou de la série à partir de l'API TMDb
        fetchItemDetails(itemId, 'tv'); // for a TV show
        fetchItemDetails(itemId, 'movie'); // for a movie
    } else {
        console.error('Aucun ID de film ou de série spécifié.');
    }

    // Fonction pour récupérer les détails du film ou de la série à partir de l'API TMDb
    async function fetchItemDetails(itemId) {
    try {
        const itemResponse = await fetch(`https://api.themoviedb.org/3/movie/${itemId}?api_key=${apiKey}&language=fr-FR`);
        const itemData = await itemResponse.json();

        const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${itemId}/credits?api_key=${apiKey}`);
        const creditsData = await creditsResponse.json();

        if (creditsResponse.ok) {
            itemData.credits = creditsData;
        } else {
            console.error('Erreur lors de la récupération des crédits du film ou de la série:', creditsResponse.statusText);
            itemData.credits = { crew: [], cast: [] }; // Provide a default value
        }

        updatePageContent(itemData);
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du film ou de la série:', error);
    }
}
    // Fonction pour mettre à jour le contenu de la page HTML avec les détails du film ou de la série
    function updatePageContent(item) {
        // Mettez à jour le titre du film ou de la série
        document.getElementById('movie-title').textContent = item.title;

        // Mettez à jour l'affiche
        const posterPath = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '';
        document.getElementById('movie-poster').src = posterPath;
    
        // Mettez à jour le synopsis
        document.getElementById('movie-synopsis').textContent = item.overview;
    
        // Mettez à jour les détails
        document.getElementById('movie-director').textContent = item.credits.crew.length > 0 ? `Réalisateur: ${getDirector(item.credits.crew)}` : 'Réalisateur inconnu';
        document.getElementById('movie-actors').textContent = item.credits.cast.length > 0 ? `Acteurs: ${getActors(item.credits.cast)}` : 'Acteurs inconnus';
        document.getElementById('movie-release-date').textContent = item.release_date ? `Date de sortie: ${item.release_date}` : 'Date de sortie inconnue';
        document.getElementById('movie-duration').textContent = item.runtime ? `Durée: ${item.runtime} minutes` : 'Durée inconnue';
        document.getElementById('movie-genre').textContent = item.genres.length > 0 ? `Genre: ${getGenres(item.genres)}` : 'Genre inconnu';
        document.getElementById('movie-rating').textContent = item.vote_average ? `Note: ${item.vote_average}/10` : 'Note inconnue';
    
        // Mettez à jour l'aperçu
        document.getElementById('movie-overview').textContent = item.overview ? item.overview : 'Aperçu indisponible';
    
        // Mettez à jour les crédits
        const credits = item.credits.crew.length > 0 ? `Réalisateur: ${getDirector(item.credits.crew)}` : 'Réalisateur inconnu';
        document.getElementById('movie-credits').textContent = credits;
    }
    
    function getDirector(crew) {
        for(let i = 0; i < crew.length; i++) {
            if(crew[i].job === 'Director') {
                return crew[i].name;
            }
        }
        return '';
    }
    
    function getActors(cast) {
        let actors = '';
        for(let i = 0; i < cast.length && i < 5; i++) {
            actors += cast[i].name + ', ';
        }
        return actors.slice(0, -2); // supprime la dernière virgule et l'espace
    }
    
    function getGenres(genres) {
        let genreList = '';
        for(let i = 0; i < genres.length; i++) {
            genreList += genres[i].name + ', ';
        }
        return genreList.slice(0, -2); // supprime la dernière virgule et l'espace
    }

    // Fonction pour obtenir le paramètre d'URL 'id'
    function getParameterByName(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }
});
