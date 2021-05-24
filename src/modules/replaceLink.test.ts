import {replaceLink, MarkdownFilePathAndPageIdPair} from './replaceLink';

describe('replaceLink.ts', () => {
  test('同階層 Windows OS Path', () => {
    const html1 = `<section id="page1"><h1>Top page</h1><a href="./sub.md">sub page</a></section>
    <section id="page2"><h1>Sub page</h1></section>`;
    const html2 = `<section id="page1"><h1>Top page</h1><a href="#page2">sub page</a></section>
    <section id="page2"><h1>Sub page</h1></section>`;

    const pairs: MarkdownFilePathAndPageIdPair[] = [
      {
        markdownFilePath: `G:\\test\\index.md`,
        pageId: 'page1',
      },
      {
        markdownFilePath: `G:\\test\\sub.md`,
        pageId: 'page2',
      },
    ];

    expect(replaceLink(html1, pairs)).toBe(html2);
  });

  test('同階層 Linux OS Path', () => {
    const html1 = `<section id="page1"><h1>Top page</h1><a href="./sub.md">sub page</a></section>
    <section id="page2"><h1>Sub page</h1></section>`;
    const html2 = `<section id="page1"><h1>Top page</h1><a href="#page2">sub page</a></section>
    <section id="page2"><h1>Sub page</h1></section>`;

    const pairs: MarkdownFilePathAndPageIdPair[] = [
      {
        markdownFilePath: `G:/test/index.md`,
        pageId: 'page1',
      },
      {
        markdownFilePath: `G:/test/sub.md`,
        pageId: 'page2',
      },
    ];

    expect(replaceLink(html1, pairs)).toBe(html2);
  });

  test('別階層', () => {
    const html1 = `<section id="page1"><h1>Top page</h1><a href="./pages/sub.md">sub page</a></section>
    <section id="page2"><h1>Sub page</h1></section>`;
    const html2 = `<section id="page1"><h1>Top page</h1><a href="#page2">sub page</a></section>
    <section id="page2"><h1>Sub page</h1></section>`;

    const pairs: MarkdownFilePathAndPageIdPair[] = [
      {
        markdownFilePath: `G:\\test\\index.md`,
        pageId: 'page1',
      },
      {
        markdownFilePath: `G:\\test\\pages\\sub.md`,
        pageId: 'page2',
      },
    ];

    expect(replaceLink(html1, pairs)).toBe(html2);
  });

  test('相対パス', () => {
    const html1 = `<section id="page1"><h1>Top page</h1><a href="./pages/sub.md">sub page</a></section>
    <section id="page2"><h1>Sub page</h1></section>`;
    const html2 = `<section id="page1"><h1>Top page</h1><a href="#page2">sub page</a></section>
    <section id="page2"><h1>Sub page</h1></section>`;

    const pairs: MarkdownFilePathAndPageIdPair[] = [
      {
        markdownFilePath: `.\\test\\index.md`,
        pageId: 'page1',
      },
      {
        markdownFilePath: `.\\test\\pages\\sub.md`,
        pageId: 'page2',
      },
    ];

    expect(replaceLink(html1, pairs)).toBe(html2);
  });
});
