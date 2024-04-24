
              
              document.addEventListener('DOMContentLoaded', function() {
                let currentSeriesPage = 1; // Aktualna strona dla seriali
                const itemsPerPage = 8; // Liczba elementów na stronie
            
                function fetchMultiplePages(pagesToFetch) {
                    const requests = [];
                    for (let i = 1; i <= pagesToFetch; i++) {
                        requests.push(fetchPage(i));
                    }
                    return Promise.all(requests);
                }
            
                function fetchPage(page) {
                    const url = `https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=${page}`;
                    return fetch(url, {
                        method: 'GET',
                        headers: {
                            accept: 'application/json',
                            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTVjMzIyNTJlZWMzOGIzZTgyNDEwNTI5ZjE2NmE4NyIsInN1YiI6IjY2MjYyOTA1YjlhMGJkMDBjZGQ0MzFlMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2Qpy9FgtaQ7Px6SwG910GW8KC7_eiQYMPj8vhp0laPQ'
                        }
                    })
                    .then(response => response.json());
                }
            
                function fetchProcessContent(page) {
                    const pagesToFetch = Math.ceil(itemsPerPage / 2);

                    fetchMultiplePages(pagesToFetch)
                        .then(responses => {
                            const allResults = responses.flatMap(response => response.results);
                            processContent(allResults);
                        })
                        .catch(err => console.error(err));
                }
            
                function processContent(data) {
                    const totalItems = data.length; // Zamiast używać total_results, korzystamy z długości złączonej listy wyników
            
                    displayItems(data, 'tv-series-list-popular', currentSeriesPage, itemsPerPage);
                    displayPagination(totalItems, 'series-pagination', currentSeriesPage);
                }
            
                function displayItems(items, containerId, currentPage, itemsPerPage) {
                    const container = document.getElementById(containerId);
                    container.innerHTML = '';
            
                    const startIndex = (currentPage - 1) * itemsPerPage;
                    const endIndex = Math.min(startIndex + itemsPerPage, items.length);
            
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
                        title.textContent = item.title || item.name; // Użyj tytułu filmu lub serialu
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
            
                    const prevButton = createPaginationButton('précedent', currentPage - 1, currentPage === 1);
                    paginationList.appendChild(prevButton);
            
                    for (let i = 1; i <= totalPages; i++) {
                        const pageButton = createPaginationButton(i, i, false);
                        paginationList.appendChild(pageButton);
                    }
            
                    const nextButton = createPaginationButton('suivante', currentPage + 1, currentPage === totalPages);
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
            
                // Wywołanie funkcji pobierającej treść
                fetchProcessContent(currentSeriesPage);
            });
                     