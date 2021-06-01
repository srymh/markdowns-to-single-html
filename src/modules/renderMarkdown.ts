import {readFileSync} from 'fs';
import {render} from './render';

export type Page = {
  show: string;
  pageId: string;
  content: string;
  markdownFilePath: string;
};

export type HeaderItem = {
  pageId: string;
  anchors: Array<{
    slug: string;
    title: string;
  }>;
};

export const renderMarkdowns = (
  markdownFiles: string[],
  allowHtml: boolean
) => {
  const pages: Page[] = [];
  const headerItems: HeaderItem[] = [];

  for (let i = 0; i < markdownFiles.length; i++) {
    const markdownText = readFileSync(markdownFiles[i], 'utf8');
    const pageId = 'page' + (i + 1).toString();
    const top = i === 0;

    const {html, anchors} = render(markdownText, {
      markdownFilePath: markdownFiles[i],
      pageId,
      allowHtml,
    });

    pages.push({
      pageId,
      content: html,
      show: top ? ' show' : '',
      markdownFilePath: markdownFiles[i],
    });

    headerItems.push({
      pageId,
      anchors,
    });
  }

  return {pages, headerItems};
};
