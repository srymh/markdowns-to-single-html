import ejs from 'ejs';

export const makeHtmlHeader = (template: string, headerItems: string[]) => {
  return ejs.render(template, {headerItems});
};
