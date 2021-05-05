(function (paging, Searcher) {
  window.addEventListener('hashchange', paging);

  var searchText = document.querySelector('#search-text');
  var searchButton = document.querySelector('#search-button');
  var searchResetButton = document.querySelector('#search-reset-button');
  if (searchText && searchButton && searchResetButton) {
    if (document.evaluate && typeof document.evaluate === 'function') {
      window.searcher = new Searcher();
      searchButton.addEventListener('click', function (e) {
        e.preventDefault();
        window.searcher.search(searchText.value);
      });
      searchResetButton.addEventListener('click', function (e) {
        e.preventDefault();
        window.searcher.reset();
        searchText.value = '';
      });
    } else {
      searchText.setAttribute(
        'placeholder',
        'お使いのブラウザでは検索を利用できません。'
      );
      searchText.style.fontSize = '10px';
      searchText.setAttribute('disabled', 'true');
      searchButton.setAttribute('disabled', 'true');
      searchResetButton.setAttribute('disabled', 'true');
    }
  }
})(paging, Searcher);
