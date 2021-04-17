import MarkdownIt from 'markdown-it';
import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';
import {readFileSync} from 'fs';

type MimeType = {
  ext: string;
  mime: string;
};

type ReplaceAssetsToBase64Options = {
  mimeTypes: MimeType[];
};

function getMimeType(src: string, mimeTypes: MimeType[]) {
  const ext = src.match(/\.[^.]+$/);
  if (ext) {
    const mimeType = mimeTypes.find((mimeType) => mimeType.ext === ext[0]);
    if (mimeType) {
      return mimeType.mime;
    } else {
      return '';
    }
  } else {
    return '';
  }
}

function makeAssetsToBase64Fn(opts: ReplaceAssetsToBase64Options) {
  // type RenderRule = (tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: Renderer) => string;
  return function assetsToBase64(
    tokens: Token[],
    idx: number,
    options: MarkdownIt.Options,
    env: any,
    self: Renderer
  ) {
    const token = tokens[idx];
    if (token.attrs && token.children) {
      // https://github.com/markdown-it/markdown-it/blob/df4607f1d4d4be7fdc32e71c04109aea8cc373fa/lib/renderer.js#L93
      // alt に値をセット。既定動作。
      token.attrs[token.attrIndex('alt')][1] = self.renderInlineAsText(
        token.children,
        options,
        env
      );
      let html = self.renderToken(tokens, idx, options);

      try {
        const src = token.attrs[token.attrIndex('src')][1];
        const base64 = readFileSync(src, 'base64');
        const mime = getMimeType(src, opts.mimeTypes);
        html = html.replace(/src=".*?"/, `src="data:${mime};base64,${base64}"`);
        return html;
      } catch (error) {
        throw new Error('Rendering Error: assetsToBase64');
      }
    } else {
      throw new Error('Rendering Error: assetsToBase64');
    }
  };
}

export function replaceAssetsToBase64(
  md: MarkdownIt,
  options: ReplaceAssetsToBase64Options
) {
  const defaultOptions: ReplaceAssetsToBase64Options = {
    mimeTypes: [],
  };
  const opts: ReplaceAssetsToBase64Options = md.utils.assign(
    {},
    defaultOptions,
    options
  );
  md.renderer.rules.image = makeAssetsToBase64Fn(opts);
}
