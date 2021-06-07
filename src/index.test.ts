import {readFileSync} from 'fs';
import {markdownsToSingleHtml} from './index';
import {JSDOM} from 'jsdom';

describe('markdownsToSingleHtml', () => {
  test('join two markdown', async () => {
    const md1 = './test/markdowns/sample.md';
    const md2 = './test/markdowns/sample2.md';
    const html = await markdownsToSingleHtml([md1, md2], {title: 'test'});
    const domA = new JSDOM(html);

    const script = (() => {
      return (
        '<script>' +
        readFileSync('./template/paging.js', 'utf8') +
        '</script>' +
        '<script>' +
        readFileSync('./template/search.js', 'utf8') +
        '</script>' +
        '<script>' +
        readFileSync('./template/main.js', 'utf8') +
        '</script>'
      );
    })();
    const style = (() => {
      return (
        '<style>' + readFileSync('./template/style.css', 'utf8') + '</style>'
      );
    })();
    const htmlToBeExpected = `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>test</title>
  </head>
  <body>
    <main>
      <div class="page-owner">
        <article class="page show" id="page1">
          <h1 id="page1.hello">hello</h1>
        </article>
        <article class="page" id="page2">
          <h1 id="page2.neko">neko</h1>
        </article>
      </div>
    </main>

    <header class="index">
      <form class="search-field">
        <input id="search-text" type="text"/>
        <div class="search-buttons">
          <button id="search-button">検索</button>
          <button id="search-reset-button">リセット</button>
        </div>
      </form>
      <hr />
      <div>
        <ul>
          <li><a href="#page1">page1</a></li>
          <li><a href="#page1.hello">hello</a></li>
        </ul>
      </div>
      <div>
        <ul>
          <li><a href="#page2">page2</a></li>
          <li><a href="#page2.neko">neko</a></li>
        </ul>
      </div>
    </header>
    ${script}${style}</body>
</html>
`;
    const domB = new JSDOM(htmlToBeExpected);

    expect(
      domA.window.document
        .querySelector('main')
        ?.textContent?.replace(/\n/g, '')
    ).toBe(
      domB.window.document
        .querySelector('main')
        ?.textContent?.replace(/\n/g, '')
    );
  });
});
