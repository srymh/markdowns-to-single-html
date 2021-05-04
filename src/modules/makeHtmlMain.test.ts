import {readFileSync} from 'fs';
import {render} from './render';
import {makeHtmlPage} from './makeHtmlPage';
import {makeHtmlMain} from './makeHtmlMain';

describe('makeHtmlMain', () => {
  test('sample.md and sample2.md', () => {
    const markdownFilePaths = ['./test/sample.md', './test/sample2.md'];
    const markdowns = markdownFilePaths.map((filePath) =>
      readFileSync(filePath, 'utf8')
    );
    const htmls = markdowns.map(
      (markdown, i) =>
        render(markdown, {
          markdownFilePath: markdownFilePaths[i],
          pageId: 'page' + (i + 1),
        }).html
    );
    const htmlPages = htmls.map((html, i) =>
      makeHtmlPage(html, 'page' + (i + 1), i === 0)
    );
    const htmlMain = makeHtmlMain(htmlPages);
    expect(htmlMain).toBe(
      '<main class="page-owner"><section class="page show" id="page1"><h1 id="page1.hello">hello</h1>\n</section><section class="page" id="page2"><h1 id="page2.neko">neko</h1>\n</section></main>'
    );
  });

  test('simple', () => {
    const htmlPages = ['<div>simple</div>', '<div>lorem</div>'];
    const htmlMain = makeHtmlMain(htmlPages);
    expect(htmlMain).toBe(
      '<main class="page-owner"><div>simple</div><div>lorem</div></main>'
    );
  });
});
