import {readFileSync} from 'fs';
import {render} from './render';
import {makeHtmlHeaderItem} from './makeHtmlHeaderItem';
import {makeHtmlHeader} from './makeHtmlHeader';

describe('makeHtmlHeader', () => {
  test('sample.md and sample2.md', () => {
    const markdownFilePaths = [
      './test/markdowns/sample.md',
      './test/markdowns/sample2.md',
    ];
    const markdowns = markdownFilePaths.map((filePath) =>
      readFileSync(filePath, 'utf8')
    );
    const anchorsList = markdowns.map(
      (markdown, i) =>
        render(markdown, {
          markdownFilePath: markdownFilePaths[i],
          pageId: 'page' + (i + 1),
        }).anchors
    );
    const htmlHeaderItems = anchorsList.map((anchors, i) =>
      makeHtmlHeaderItem(anchors, 'page' + (i + 1))
    );
    const htmlHeader = makeHtmlHeader(htmlHeaderItems);
    expect(htmlHeader).toBe(
      `<header class="index">
<form class="search-field">
  <input id="search-text" type="text"/>
  <div class="search-buttons">
    <button id="search-button">検索</button>
    <button id="search-reset-button">リセット</button>
  </div>
</form>
<hr />
<div><ul><li><a href="#page1">page1</a></li><li><a href="#page1.hello">hello</a></li></ul></div><div><ul><li><a href="#page2">page2</a></li><li><a href="#page2.neko">neko</a></li></ul></div>
</header>`
    );
  });

  test('simple', () => {
    const htmlHeaderItems = ['<div>lorem</div>', '<div>ipusm</div>'];
    const htmlHeader = makeHtmlHeader(htmlHeaderItems);
    expect(htmlHeader).toBe(
      `<header class="index">
<form class="search-field">
  <input id="search-text" type="text"/>
  <div class="search-buttons">
    <button id="search-button">検索</button>
    <button id="search-reset-button">リセット</button>
  </div>
</form>
<hr />
<div>lorem</div><div>ipusm</div>
</header>`
    );
  });
});
