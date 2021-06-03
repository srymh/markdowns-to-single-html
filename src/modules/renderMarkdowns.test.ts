import {JSDOM} from 'jsdom';
import {renderMarkdowns} from './renderMarkdowns';

describe('renderMarkdown.ts', () => {
  test('renderMarkdowns', () => {
    const {pages} = renderMarkdowns(['./test/markdowns/sample.md'], true);

    expect(pages[0].markdownFilePath).toBe('./test/markdowns/sample.md');

    const a = JSDOM.fragment(pages[0].htmlContent);
    const b = JSDOM.fragment('<h1 id="page1.hello">hello</h1>');
    expect(a.getElementById('page1.hello')).not.toBeUndefined();
    expect(a.getElementById('page1.hello')?.innerHTML).toBe(
      b.getElementById('page1.hello')?.innerHTML
    );
  });
});
