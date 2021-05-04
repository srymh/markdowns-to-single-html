(function (paging, Searcher) {
  window.addEventListener('hashchange', paging);
  window.searcher = new Searcher();
})(paging, Searcher);
