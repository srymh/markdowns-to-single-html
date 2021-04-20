import MarkdownIt from 'markdown-it';
import mdAnchor, {AnchorInfo} from 'markdown-it-anchor';
import {replaceAssetsToBase64} from './modules/replaceAssetsToBase64';
import {readFileSync} from 'fs';

type RenderOptions = {
  markdownFilePath?: string;
  pageId?: string;
};

export const render = (markdown: string, options?: RenderOptions) => {
  const defaultOptions: RenderOptions = {
    markdownFilePath: undefined,
    pageId: undefined,
  };
  const opts = {...defaultOptions, ...options};
  const {markdownFilePath, pageId} = opts;

  const anchors: AnchorInfo[] = [];
  const md = new MarkdownIt();
  md.use(mdAnchor, {
    slugify: (str) => {
      return (
        pageId +
        '.' +
        encodeURIComponent(
          String(str).trim().toLowerCase().replace(/\s+/g, '-')
        )
      );
    },
    callback: (_token, anchor_info) => {
      anchors.push(anchor_info);
    },
  }).use(replaceAssetsToBase64, {
    markdownFilePath,
    mimeTypes: [
      {
        ext: '.png',
        mime: 'image/png',
      },
      {
        ext: '.svg',
        mime: 'image/svg+xml',
      },
    ],
  });
  return {
    html: md.render(markdown),
    anchors: [...anchors],
  };
};

export const pageTemplate = (html: string, id: number) => {
  const pageId = 'page' + (id + 1).toString();
  const show = id === 0 ? ' show' : '';
  return `<section class="page${show}" id="${pageId}">${html}</section>`;
};

/**
 * @param markdownFiles Markdown文字列
 */
export const markdownsToSingleHtml = (markdownFiles: string[]) => {
  let result = `<main class="page-owner">`;
  let index = `<header class="index">`;

  for (let i = 0; i < markdownFiles.length; i++) {
    const text = readFileSync(markdownFiles[i], 'utf8');
    const pageId = 'page' + (i + 1).toString();
    index += `<div><ul><li><a href="#${pageId}">${pageId}</a></li>`;
    const {html, anchors} = render(text, {
      markdownFilePath: markdownFiles[i],
      pageId: pageId,
    });

    for (const anchor of anchors) {
      index += `<li><a href="#${anchor.slug}">${anchor.title}</a></li>`;
    }

    index += `</ul></div>`;
    result += pageTemplate(html, i);
  }

  result += `</main>`;
  index += `</header>`;
  return result + index;
};
