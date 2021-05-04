import {AnchorInfo} from 'markdown-it-anchor';

export const makeHtmlHeaderItem = (anchors: AnchorInfo[], pageId: string) => {
  let html = `<div><ul><li><a href="#${pageId}">${pageId}</a></li>`;
  for (const anchor of anchors) {
    html += `<li><a href="#${anchor.slug}">${anchor.title}</a></li>`;
  }
  html += `</ul></div>`;
  return html;
};
