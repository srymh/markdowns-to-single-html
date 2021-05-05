function paging() {
  var href = window.location.href;
  var hash = window.location.hash;
  if (hash) {
    var currentPage = document.querySelector('.page.show');
    var h = hash.split('.')[0];
    if (currentPage && currentPage.getAttribute('id') === h.replace('#', '')) {
      // noop
    } else {
      currentPage.classList.remove('show');
      var nextPage = document.querySelector(h);
      if (nextPage) {
        nextPage.classList.add('show');
        document.title = h.replace('#', '');
        window.location.href = href;
      } else {
        alert('ページがありません。');
      }
    }
  } else {
    window.location.reload();
  }
}
