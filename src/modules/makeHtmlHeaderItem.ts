import ejs from 'ejs';
import {AnchorInfo} from 'markdown-it-anchor';

export const makeHtmlHeaderItem = (
  template: string,
  anchors: AnchorInfo[],
  pageId: string
) => {
  return ejs.render(template, {anchors, pageId});
};
