import ejs from 'ejs';

export const makeHtmlMain = (template: string, sections: string[]) => {
  return ejs.render(template, {sections});
};
