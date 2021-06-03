import {readFileSync} from 'fs';
import {render} from './render';

describe('render', () => {
  test('日本語h1, h2, ... から生成されるIDがURLエンコードされる', () => {
    const markdownFilePath = './test/markdowns/headers.md';
    const markdown = readFileSync(markdownFilePath, 'utf8');
    const pageId = 'page' + 1;
    const html = render(markdown, {pageId}).html;
    expect(html).toBe(
      '<h1 id="page1.%E3%81%82">あ</h1>\n<h2 id="page1.%E3%81%84">い</h2>\n<h3 id="page1.%E3%81%86">う</h3>\n<h4 id="page1.%E3%81%88%E3%81%8A">えお</h4>\n'
    );
  });

  test('HTMLを含むマークダウン', () => {
    const markdown = `a <div>HTML</div>`;
    const html = render(markdown, {allowHtml: true}).html;
    expect(html).toBe(`<p>a <div>HTML</div></p>\n`);
  });
});
