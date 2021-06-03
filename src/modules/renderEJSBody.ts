import ejs from 'ejs';
import {Page, HeaderItem} from './renderMarkdowns';
import {replaceAssets} from './replaceAssets';

export type RenderEJSBodyData = {
  pages: Page[];
  headerItems: HeaderItem[];
};

export const renderEJSBody = async (
  template: string,
  data: RenderEJSBodyData
) => {
  for (let i = 0; i < data.pages.length; i++) {
    const page = data.pages[i];
    const replacedHtml = await replaceAssets(
      page.htmlContent,
      page.markdownFilePath
    );
    data.pages[i].htmlContent = replacedHtml;
  }

  return ejs.render(template, data);
};
