import {render} from './modules/render';
import {makeHtmlPage} from './modules/makeHtmlPage';
import {makeHtmlMain} from './modules/makeHtmlMain';
import {makeHtmlHeaderItem} from './modules/makeHtmlHeaderItem';
import {makeHtmlHeader} from './modules/makeHtmlHeader';
import {readFileSync} from 'fs';
import path from 'path';

export type MarkdownsToSingleHtmlOptions = {
  title?: string;
  javascriptTemplateFolderPath?: string;
  javascriptFileNames?: string[];
  cssTemplateFolderPath?: string;
  cssFileNames?: string[];
  allowHtml?: boolean;
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
  allowHtml: false,
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
  const allowHtml =
    options && options.allowHtml ? options.allowHtml : defaultOptions.allowHtml;

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
        allowHtml,
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
