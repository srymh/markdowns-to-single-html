import ejs from 'ejs';
import {Page, HeaderItem} from './renderMarkdowns';

export type RenderEJSBodyData = {
  pages: Page[];
  headerItems: HeaderItem[];
};

export const renderEJSBody = (template: string, data: RenderEJSBodyData) =>
  ejs.render(template, data);
