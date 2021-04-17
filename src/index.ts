import MarkdownIt from 'markdown-it';
import {replaceAssetsToBase64} from './modules/replaceAssetsToBase64';
const mdit = new MarkdownIt();
mdit.use(replaceAssetsToBase64, {
  mimeTypes: [
    {
      ext: '.png',
      mime: 'image/png',
    },
  ],
});

/**
 * @param markdowns Markdown文字列
 */
export const markdownsToSingleHtml = (markdowns: string[]) => {
  return markdowns.map((md) => mdit.render(md)).join('');
};
