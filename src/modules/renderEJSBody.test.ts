import {JSDOM} from 'jsdom';
import {renderEJSBody, RenderEJSBodyData} from './renderEJSBody';

describe('renderEJSBody.ts', () => {
  test('simple', async () => {
    const data: RenderEJSBodyData = {
      pages: [
        {
          pageId: 'page1',
          show: 'a',
          htmlContent: '<a href="#">Link to #</a>',
          markdownFilePath: './path/to/basefile.md',
        },
      ],
      headerItems: [
        {
          pageId: 'page1',
          anchors: [{slug: 'page1.%50', title: 'h1 title'}],
        },
      ],
    };

    const template = `
    <div id="page-pagId"><%- pages[0].pageId %></div>
    <div id="page-show"><%- pages[0].show %></div>
    <div id="page-htmlContent"><%- pages[0].htmlContent %></div>
    <div id="headerItem-pageId"><%- headerItems[0].pageId %></div>
    <div id="headerItem-anchor-slug"><%- headerItems[0].anchors[0].slug %></div>
    <div id="headerItem-anchor-title"><%- headerItems[0].anchors[0].title %></div>
    `;
    const html = await renderEJSBody(template, data);

    const dom = new JSDOM(html);
    expect(dom.window.document.getElementById('page-pagId')?.innerHTML).toBe(
      data.pages[0].pageId
    );
    expect(dom.window.document.getElementById('page-show')?.innerHTML).toBe(
      data.pages[0].show
    );
    expect(
      dom.window.document.getElementById('page-htmlContent')?.innerHTML
    ).toBe(data.pages[0].htmlContent);
    expect(
      dom.window.document.getElementById('headerItem-pageId')?.innerHTML
    ).toBe(data.headerItems[0].pageId);
    expect(
      dom.window.document.getElementById('headerItem-anchor-slug')?.innerHTML
    ).toBe(data.headerItems[0].anchors[0].slug);
    expect(
      dom.window.document.getElementById('headerItem-anchor-title')?.innerHTML
    ).toBe(data.headerItems[0].anchors[0].title);
  });
});
