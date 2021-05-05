export const makeHtmlHeader = (htmls: string[]) =>
  `<header class="index">
<form class="search-field">
  <input id="search-text" type="text"/>
  <div class="search-buttons">
    <button id="search-button">検索</button>
    <button id="search-reset-button">リセット</button>
  </div>
</form>
<hr />
${htmls.join('')}
</header>`;