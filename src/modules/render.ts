import MarkdownIt from 'markdown-it';
import mdAnchor, {AnchorInfo} from 'markdown-it-anchor';
import {replaceAssetsToBase64} from './replaceAssetsToBase64';

export type RenderOptions = {
  markdownFilePath?: string;
  pageId?: string;
  allowHtml?: boolean;
};

export const render = (markdown: string, options?: RenderOptions) => {
  const defaultOptions: RenderOptions = {
    markdownFilePath: undefined,
    pageId: undefined,
    allowHtml: false,
  };
  const opts = {...defaultOptions, ...options};
  const {markdownFilePath, pageId, allowHtml} = opts;

  const anchors: AnchorInfo[] = [];
  const md = new MarkdownIt({html: allowHtml});
  md.use(mdAnchor, {
    slugify: (str) => {
      return (
        pageId +
        '.' +
        encodeURIComponent(
          String(str).trim().toLowerCase().replace(/\s+/g, '-')
        )
      );
    },
    callback: (_token, anchor_info) => {
      anchors.push(anchor_info);
    },
  }).use(replaceAssetsToBase64, {
    markdownFilePath,
    mimeTypes: [
      {
        ext: '.png',
        mime: 'image/png',
      },
      {
        ext: '.svg',
        mime: 'image/svg+xml',
      },
    ],
  });
  return {
    html: md.render(markdown),
    anchors: [...anchors],
  };
};
