import ejs from 'ejs';

export type RenderEJSIndexData = {
  title: string;
  body: string;
  script: string;
  style: string;
};

export const renderEJSIndex = (template: string, data: RenderEJSIndexData) =>
  ejs.render(template, data);
