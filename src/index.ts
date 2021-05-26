import {render} from './modules/render';
import {makeHtmlPage} from './modules/makeHtmlPage';
import {makeHtmlMain} from './modules/makeHtmlMain';
import {makeHtmlHeaderItem} from './modules/makeHtmlHeaderItem';
import {makeHtmlHeader} from './modules/makeHtmlHeader';
import {readFileSync} from 'fs';
import path from 'path';
import ejs from 'ejs';
import {
  replaceLink,
  MarkdownFilePathAndPageIdPair,
} from './modules/replaceLink';

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

  const htmlTemplateFolderPath = path.resolve(
    path.dirname(__filename),
    path.join('..', 'template', 'html')
  );

  const htmlTemplateHeaderPath = path.join(
    htmlTemplateFolderPath,
    'header.ejs'
  );
  const htmlTemplateHeaderItemPath = path.join(
    htmlTemplateFolderPath,
    'headerItem.ejs'
  );
  const htmlTemplatePagePath = path.join(htmlTemplateFolderPath, 'page.ejs');
  const htmlTemplateMainPath = path.join(htmlTemplateFolderPath, 'main.ejs');

  const {htmlMain, htmlHeader} = ((markdownFiles) => {
    const htmlTemplate = {
      header: readFileSync(htmlTemplateHeaderPath, 'utf8'),
      headerItem: readFileSync(htmlTemplateHeaderItemPath, 'utf8'),
      page: readFileSync(htmlTemplatePagePath, 'utf8'),
      main: readFileSync(htmlTemplateMainPath, 'utf8'),
    };
    const htmlPages: string[] = [];
    const htmlHeaderItems: string[] = [];
    const markdownFilePathAndPageIdPairs: MarkdownFilePathAndPageIdPair[] = [];

    for (let i = 0; i < markdownFiles.length; i++) {
      const markdownText = readFileSync(markdownFiles[i], 'utf8');
      const pageId = 'page' + (i + 1).toString();
      const top = i === 0;
      const {html, anchors} = render(markdownText, {
        markdownFilePath: markdownFiles[i],
        pageId: pageId,
        allowHtml,
      });
      htmlPages.push(makeHtmlPage(htmlTemplate.page, html, pageId, top));
      htmlHeaderItems.push(
        makeHtmlHeaderItem(htmlTemplate.headerItem, anchors, pageId)
      );
      markdownFilePathAndPageIdPairs.push({
        markdownFilePath: markdownFiles[i],
        pageId,
      });
    }

    return {
      htmlMain: replaceLink(
        makeHtmlMain(htmlTemplate.main, htmlPages),
        markdownFilePathAndPageIdPairs
      ),
      htmlHeader: makeHtmlHeader(htmlTemplate.header, htmlHeaderItems),
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

  const htmlTemplateIndexPath = path.join(htmlTemplateFolderPath, 'index.ejs');
  const htmlTemplateIndex = readFileSync(htmlTemplateIndexPath, 'utf8');
  return ejs.render(htmlTemplateIndex, {
    title,
    htmlMain,
    htmlHeader,
    script,
    style,
  });
};
