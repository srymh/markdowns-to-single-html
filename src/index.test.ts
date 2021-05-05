import {readFileSync} from 'fs';
import {markdownsToSingleHtml} from './index';

describe('markdownsToSingleHtml', () => {
  test('join two markdown', () => {
    const md1 = './test/markdowns/sample.md';
    const md2 = './test/markdowns/sample2.md';
    const html = markdownsToSingleHtml([md1, md2], {title: 'test'});
    const title = 'test';
    const htmlMain =
      '<main><div class="page-owner"><section class="page show" id="page1"><h1 id="page1.hello">hello</h1>\n</section><section class="page" id="page2"><h1 id="page2.neko">neko</h1>\n</section></div></main>';
    const htmlHeader = `<header class="index">
<form class="search-field">
  <input id="search-text" type="text"/>
  <div class="search-buttons">
    <button id="search-button">検索</button>
    <button id="search-reset-button">リセット</button>
  </div>
</form>
<hr />
<div><ul><li><a href="#page1">page1</a></li><li><a href="#page1.hello">hello</a></li></ul></div><div><ul><li><a href="#page2">page2</a></li><li><a href="#page2.neko">neko</a></li></ul></div>
</header>`;
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
    <title>${title}</title>
  </head>
  <body>${htmlMain}${htmlHeader}${script}${style}</body>
</html>
`;
    expect(html).toBe(htmlToBeExpected);
  });
});
