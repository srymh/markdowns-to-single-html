import {JSDOM} from 'jsdom';
import {renderEJSIndex, RenderEJSIndexData} from './renderEJSIndex';

describe('renderEJSIndex.ts', () => {
  test('simple', () => {
    const data: RenderEJSIndexData = {
      title: 'test',
      body: '<div>body</div>',
      script: '<script>console.log(0);</script>',
      style: '<style>div {color: red;}</style>',
    };

    const template = `
    <div id="title"><%- title %></div>
    <div id="body"><%- body %></div>
    <div id="script"><%- script %></div>
    <div id="style"><%- style %></div>
    `;
    const html = renderEJSIndex(template, data);

    const dom = new JSDOM(html);
    expect(dom.window.document.getElementById('title')?.innerHTML).toBe(
      data.title
    );
    expect(dom.window.document.getElementById('body')?.innerHTML).toBe(
      data.body
    );
    expect(dom.window.document.getElementById('script')?.innerHTML).toBe(
      data.script
    );
    expect(dom.window.document.getElementById('style')?.innerHTML).toBe(
      data.style
    );
  });
});
