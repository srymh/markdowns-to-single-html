import ejs from 'ejs';

export const makeHtmlPage = (
  template: string,
  html: string,
  pageId: string,
  top: boolean
) => {
  const show = top ? ' show' : '';
  return ejs.render(template, {show, pageId, html});
};
