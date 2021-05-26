import {readFileSync} from 'fs';
import {AnchorInfo} from 'markdown-it-anchor';
import {render} from './render';
import {makeHtmlHeaderItem} from './makeHtmlHeaderItem';

describe('makeHtmlHeaderItem', () => {
  test('sample.md', () => {
    const markdownFilePath = './test/markdowns/sample.md';
    const markdown = readFileSync(markdownFilePath, 'utf8');
    const template = {
      headerItem: readFileSync('./template/html/headerItem.ejs', 'utf8'),
    };
    const pageId = 'page' + 1;
    const anchors = render(markdown, {markdownFilePath, pageId}).anchors;
    const htmlHeaderItem = makeHtmlHeaderItem(
      template.headerItem,
      anchors,
      pageId
    );
    expect(htmlHeaderItem).toBe(
      '<div><ul><li><a href="#page1">page1</a></li><li><a href="#page1.hello">hello</a></li></ul></div>'
    );
  });

  test('simple', () => {
    const template = {
      headerItem: readFileSync('./template/html/headerItem.ejs', 'utf8'),
    };
    const anchors: AnchorInfo[] = [{slug: 'hoge.lorem', title: 'Lorem'}];
    const pageId = 'hoge';
    const htmlHeaderItem = makeHtmlHeaderItem(
      template.headerItem,
      anchors,
      pageId
    );
    expect(htmlHeaderItem).toBe(
      '<div><ul><li><a href="#hoge">hoge</a></li><li><a href="#hoge.lorem">Lorem</a></li></ul></div>'
    );
  });

  test('日本語ヘッダー', () => {
    const markdownFilePath = './test/markdowns/headers.md';
    const markdown = readFileSync(markdownFilePath, 'utf8');
    const template = {
      headerItem: readFileSync('./template/html/headerItem.ejs', 'utf8'),
    };
    const pageId = 'page' + 1;
    const anchors = render(markdown, {markdownFilePath, pageId}).anchors;
    const htmlHeaderItem = makeHtmlHeaderItem(
      template.headerItem,
      anchors,
      pageId
    );
    expect(htmlHeaderItem).toBe(
      '<div><ul><li><a href="#page1">page1</a></li><li><a href="#page1.%E3%81%82">あ</a></li><li><a href="#page1.%E3%81%84">い</a></li><li><a href="#page1.%E3%81%86">う</a></li><li><a href="#page1.%E3%81%88%E3%81%8A">えお</a></li></ul></div>'
    );
  });
});
