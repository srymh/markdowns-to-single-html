import {readFileSync} from 'fs';
import {render} from './render';
import {makeHtmlPage} from './makeHtmlPage';

describe('makeHtmlPage', () => {
  test('sample.md', () => {
    const markdownFilePath = './test/markdowns/sample.md';
    const markdown = readFileSync(markdownFilePath, 'utf8');
    const pageId = 'page1';
    const html = render(markdown, {markdownFilePath, pageId}).html;
    const htmlPage = makeHtmlPage(html, pageId, true);
    expect(htmlPage).toBe(
      '<section class="page show" id="page1"><h1 id="page1.hello">hello</h1>\n</section>'
    );
  });

  test('simple: top page', () => {
    const htmlPage = makeHtmlPage('<div>simple</div>', 'hoge', true);
    expect(htmlPage).toBe(
      '<section class="page show" id="hoge"><div>simple</div></section>'
    );
  });

  test('simple: not top page', () => {
    const htmlPage = makeHtmlPage('<div>simple</div>', 'hoge', false);
    expect(htmlPage).toBe(
      '<section class="page" id="hoge"><div>simple</div></section>'
    );
  });
});
