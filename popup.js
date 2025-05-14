document.addEventListener('DOMContentLoaded', function() {
    const toImdbButton = document.getElementById('toImdb');
    const toLetterboxdButton = document.getElementById('toLetterboxd');
    const messageElement = document.getElementById('message');
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentTab = tabs[0];
        const currentUrl = currentTab.url;
        
        chrome.scripting.executeScript({
            target: {tabId: currentTab.id},
            function: () => document.title
        }, (results) => {
            if (!results || !results[0] || !results[0].result) {
                messageElement.textContent = "Couldn't extract title from current page";
                return;
            }
            
            const pageTitle = results[0].result;
            
            let movieTitle = pageTitle;
            
            if (currentUrl.includes('imdb.com')) {
                movieTitle = pageTitle.replace(/(.*)\(.*(\d{4})\).*/, "$1$2");
                console.log("Movie title extracted from IMDb:", movieTitle);
                messageElement.textContent = "Current site: IMDb";
            } else if (currentUrl.includes('letterboxd.com')) {
                movieTitle = pageTitle.replace(/(.*)\(.*(\d{4})\).*/, '$1$2');
                console.log("Movie title extracted from letterboxd:", movieTitle);
                messageElement.textContent = "Current site: Letterboxd";
            } else {
                messageElement.textContent = "Not on IMDb or Letterboxd";
            }
            
            toImdbButton.addEventListener('click', function() {
                const imdbSearchUrl = `https://www.imdb.com/find/?q=${encodeURIComponent(movieTitle)}`;
                chrome.tabs.create({ url: imdbSearchUrl });
            });
            
            toLetterboxdButton.addEventListener('click', function() {
                const letterboxdSearchUrl = `https://letterboxd.com/search/films/${encodeURIComponent(movieTitle)}/`;
                chrome.tabs.create({ url: letterboxdSearchUrl });
            });
        });
    });
});