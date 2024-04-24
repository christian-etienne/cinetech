document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '155c32252eec38b3e82410529f166a87'; // Remplacez par votre clé API TMDb

    const searchInput = document.getElementById('search-input');
    const searchResultsList = document.getElementById('search-results-list');

    searchInput.addEventListener('input', function() {
        const searchQuery = searchInput.value.trim();
        if (searchQuery !== '') {
            searchSuggestions(searchQuery);
        } else {
            clearSearchResults();
        }
    });

    function searchSuggestions(query) {
        fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=fr-FR&query=${query}`)
            .then(response => response.json())
            .then(data => {
                displaySearchSuggestions(data.results);
            })
            .catch(error => {
                console.error('Erreur lors de la recherche de suggestions:', error);
            });
    }

    function displaySearchSuggestions(results) {
        searchResultsList.innerHTML = '';
        for (let i = 0; i < Math.min(results.length, 5); i++) {
            const listItem = document.createElement('li');
            listItem.textContent = results[i].title || results[i].name;
            listItem.dataset.id = results[i].id;
            listItem.addEventListener('click', function() {
                const itemId = results[i].id;
                const itemType = results[i].media_type === 'movie' ? 'movies' : 'series';
                window.location.href = `/assets/pages/detail.html?id=${itemId}&type=${itemType}`;
            });
            searchResultsList.appendChild(listItem);
        }
        searchResultsList.style.display = 'block';
    }

    function clearSearchResults() {
        searchResultsList.innerHTML = '';
        searchResultsList.style.display = 'none';
    }
});
