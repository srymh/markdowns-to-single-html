import {JSDOM} from 'jsdom';
import path from 'path';

export type MarkdownFilePathAndPageIdPair = {
  markdownFilePath: string;
  pageId: string;
};

const isTheSamePath = (path1: string, path2: string) =>
  path.normalize(path.resolve(path1)) === path.normalize(path.resolve(path2));

const resolve = (from: string, to: string) =>
  path.resolve(path.dirname(from), to);

export const replaceLink = (
  html: string,
  pairs: MarkdownFilePathAndPageIdPair[]
) => {
  // 扱いやすさのために root として div を加えて fragment を作成する。
  const frag = JSDOM.fragment('<div>' + html + '</div>');

  // 各ページ毎にリンク先を置き換える。
  for (const current of pairs) {
    const pageEl = frag.querySelector('#' + current.pageId);

    if (!pageEl) continue;

    // cssセレクタを 'a' にすると勝手に HTMLAnchorElement[] と推測されるが、
    // 'a[href$=".md"]' にすつと Element[] と推測されてしまう。
    // そのため型が HTMLAnchorElement[] を明示する。
    const anchorElements: HTMLAnchorElement[] = Array.from(
      pageEl.querySelectorAll('a[href$=".md"]')
    );

    for (const a of anchorElements) {
      const p = resolve(current.markdownFilePath, a.href);
      const foundPair = pairs.find((pair) =>
        isTheSamePath(pair.markdownFilePath, p)
      );

      if (foundPair) {
        a.href = '#' + foundPair.pageId;
      }
    }
  }

  if (frag.firstElementChild) {
    // 勝手に加えたdiv以下のhtmlを返す。
    return frag.firstElementChild.innerHTML;
  } else {
    // 何らかの理由で frag.firstElementChild が null のときには html をそのまま返す。
    return html;
  }
};
