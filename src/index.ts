import {readFileSync} from 'fs';
import path from 'path';
import {loadScripts} from './modules/loadScripts';
import {loadStyles} from './modules/loadStyles';
import {renderEJSBody} from './modules/renderEJSBody';
import {renderEJSIndex} from './modules/renderEJSIndex';
import {renderMarkdowns} from './modules/renderMarkdowns';
import {replaceLink} from './modules/replaceLink';

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
 * @param markdownFiles Markdownファイルパスの配列
 */
export const markdownsToSingleHtml = async (
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

  const htmlTemplateFolderPath = path.resolve(
    path.dirname(__filename),
    path.join('..', 'template', 'html')
  );

  const {pages, headerItems} = renderMarkdowns(markdownFiles, allowHtml);

  const htmlTemplate = {
    index: readFileSync(path.join(htmlTemplateFolderPath, 'index.ejs'), 'utf8'),
    body: readFileSync(path.join(htmlTemplateFolderPath, 'body.ejs'), 'utf8'),
  };

  const body = replaceLink(
    await renderEJSBody(htmlTemplate.body, {
      pages,
      headerItems,
    }),
    pages.map((x) => ({
      markdownFilePath: x.markdownFilePath,
      pageId: x.pageId,
    }))
  );

  const script = loadScripts(javascriptTemplateFolderPath, javascriptFileNames);
  const style = loadStyles(cssTemplateFolderPath, cssFileNames);

  return renderEJSIndex(htmlTemplate.index, {
    title,
    body,
    script,
    style,
  });
};
