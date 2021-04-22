function paging() {
  const currentPage = document.querySelector('.page.show');
  if (currentPage) {
    currentPage.classList.remove('show');
  }
  const hash = window.location.hash;
  if (hash) {
    const [h] = hash.split('.');
    const nextPage = document.querySelector(h);
    if (nextPage) {
      nextPage.classList.add('show');
      document.title = h.replace('#', '');
    } else {
      alert('ページがありません。');
    }
  } else {
    window.location.reload();
  }
}
