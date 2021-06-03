import MarkdownIt from 'markdown-it';
import mdAnchor, {AnchorInfo} from 'markdown-it-anchor';

export type RenderOptions = {
  pageId?: string;
  allowHtml?: boolean;
};

export const render = (markdown: string, options?: RenderOptions) => {
  const defaultOptions: RenderOptions = {
    pageId: undefined,
    allowHtml: false,
  };

  const {pageId, allowHtml} = {...defaultOptions, ...options};

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
  });

  return {
    html: md.render(markdown),
    anchors: [...anchors],
  };
};
