import axios from 'axios';

document.addEventListener('DOMContentLoaded', function() {
    var newsIds = [];
    var currentIndex = 0;
    var batchSize = 10;

    function loadNews() {
        for (var i = currentIndex; i < currentIndex + batchSize; i++) {
            if (i >= newsIds.length) {
                document.getElementById('load-more').style.display = 'none';
                break;
            }
            var newsId = newsIds[i];
            axios.get(`${process.env.HACKER_NEWS_API}item/${newsId}.json`)
                .then(response => {
                    const news = response.data;
                    var newsContainer = document.createElement('div');
                    newsContainer.classList.add('news-container'); 
    
                    var titleElement = document.createElement('h2');
                    titleElement.classList.add('news-title');
                    titleElement.textContent = news.title;
    
                    var siteElement = document.createElement('p');
                    siteElement.classList.add('news-site');
                   siteElement.textContent = news.url ? new URL(news.url).hostname : "Hacker News"; 

                   var infoElement = document.createElement('p');
                   infoElement.classList.add('news-info');
                   infoElement.innerHTML = `<span>${new Date(news.time * 1000).toLocaleDateString()}</span> - <span>${news.descendants} Comments</span> - <span>${news.by}</span>`;
                   
    
                    newsContainer.appendChild(titleElement);
                    newsContainer.appendChild(siteElement);
                    newsContainer.appendChild(infoElement);
    
                    document.getElementById('news-container').appendChild(newsContainer);
                })
                .catch(error => console.error('Error while fetching news:', error));
        }
        currentIndex += batchSize;
    }
    

    axios.get(`${process.env.HACKER_NEWS_API}newstories.json`)
        .then(response => {
            newsIds = response.data;
            loadNews();
        })
        .catch(error => console.error('Error while fetching news IDs:', error));

    document.getElementById('load-more').addEventListener('click', function() {
        loadNews();
    });

});