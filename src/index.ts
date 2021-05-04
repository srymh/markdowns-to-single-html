import MarkdownIt from 'markdown-it';
import mdAnchor, {AnchorInfo} from 'markdown-it-anchor';
import {replaceAssetsToBase64} from './modules/replaceAssetsToBase64';
import {readFileSync} from 'fs';
import path from 'path';

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

export const makeHtmlPage = (html: string, pageId: string, top: boolean) => {
  const show = top ? ' show' : '';
  return `<section class="page${show}" id="${pageId}">${html}</section>`;
};

export const makeHtmlMain = (htmls: string[]) =>
  `<main class="page-owner">${htmls.join('')}</main>`;

export const makeHtmlHeaderItem = (anchors: AnchorInfo[], pageId: string) => {
  let html = `<div><ul><li><a href="#${pageId}">${pageId}</a></li>`;
  for (const anchor of anchors) {
    html += `<li><a href="#${anchor.slug}">${anchor.title}</a></li>`;
  }
  html += `</ul></div>`;
  return html;
};

export const makeHtmlHeader = (htmls: string[]) =>
  `<header class="index">${htmls.join('')}</header>`;

export type MarkdownsToSingleHtmlOptions = {
  title?: string;
  javascriptTemplateFolderPath?: string;
  javascriptFileNames?: string[];
  cssTemplateFolderPath?: string;
  cssFileNames?: string[];
};

const defaultOptions = {
  title: 'Title',
  javascriptTemplateFolderPath: path.resolve(
    path.dirname(__filename),
    path.join('..', 'template')
  ),
  javascriptFileNames: ['paging.js', 'search.js', 'main.js'],
  cssTemplateFolderPath: path.resolve(
    path.dirname(__filename),
    path.join('..', 'template')
  ),
  cssFileNames: ['style.css'],
};

/**
 * @param markdownFiles Markdown文字列
 */
export const markdownsToSingleHtml = (
  markdownFiles: string[],
  options?: MarkdownsToSingleHtmlOptions
) => {
  const title = options && options.title ? options.title : defaultOptions.title;
  const javascriptTemplateFolderPath =
    options && options.javascriptTemplateFolderPath
      ? options.javascriptTemplateFolderPath
      : defaultOptions.javascriptTemplateFolderPath;
  const javascriptFileNames =
    options && options.javascriptFileNames
      ? [...options.javascriptFileNames]
      : [...defaultOptions.javascriptFileNames];
  const cssTemplateFolderPath =
    options && options.cssTemplateFolderPath
      ? options.cssTemplateFolderPath
      : defaultOptions.cssTemplateFolderPath;
  const cssFileNames =
    options && options.cssFileNames
      ? [...options.cssFileNames]
      : [...defaultOptions.cssFileNames];

  const {htmlMain, htmlHeader} = ((markdownFiles) => {
    const htmlPages: string[] = [];
    const htmlHeaderItems: string[] = [];

    for (let i = 0; i < markdownFiles.length; i++) {
      const text = readFileSync(markdownFiles[i], 'utf8');
      const pageId = 'page' + (i + 1).toString();
      const top = i === 0;
      const {html, anchors} = render(text, {
        markdownFilePath: markdownFiles[i],
        pageId: pageId,
      });
      htmlPages.push(makeHtmlPage(html, pageId, top));
      htmlHeaderItems.push(makeHtmlHeaderItem(anchors, pageId));
    }

    return {
      htmlMain: makeHtmlMain(htmlPages),
      htmlHeader: makeHtmlHeader(htmlHeaderItems),
    };
  })(markdownFiles);

  const script = ((folder, fileNames) => {
    let script = '';
    for (const fileName of fileNames) {
      script +=
        '<script>' +
        readFileSync(path.join(folder, fileName), 'utf8') +
        '</script>';
    }
    return script;
  })(javascriptTemplateFolderPath, javascriptFileNames);

  const style = ((folder, fileNames) => {
    let style = '';
    for (const fileName of fileNames) {
      style +=
        '<style>' +
        readFileSync(path.join(folder, fileName), 'utf8') +
        '</style>';
    }
    return style;
  })(cssTemplateFolderPath, cssFileNames);

  return `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body>${htmlMain}${htmlHeader}${script}${style}</body>
</html>
`;
};
