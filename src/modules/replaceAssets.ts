import {JSDOM} from 'jsdom';
import mimeTypes from 'mime-types';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import url from 'url';

const getMimeType = (src: string) => {
  const mimeType = mimeTypes.lookup(src);

  if (typeof mimeType === 'boolean') {
    return '';
  } else {
    return mimeType;
  }
};

/**
 * htmlのsrcが指すパスのファイルをbase64に変換してsrcのパスと置き換える。
 *
 * 置き換えられる条件
 *
 * - srcのパスに拡張子があること。
 *
 * 対応するsrc
 *
 * - 相対パス対応 ... markdownFilePathとの相対パス
 *   - src="./path/to/file.xxx"
 * - 絶対パス対応
 *   - src="D:/path/to/file.xxx"
 *   - src="D:\\path\\to\\file.xxx"
 * - URL
 *   - src="http://path/to/file.xxx"
 *   - src="https://path/to/file.xxx"
 * - UNCパス対応(絶対パス扱い)
 *   - src="\\\\192.168.254.254\\path\\to\\file.xxx"
 * - fileスキーム
 *   - src="file:///D:/path/to/file.xxx"
 *   - src="file:///D:\\path\\to\\file.xxx"
 * - base64
 *   - src="data:..."
 *
 * @param html
 * @param markdownFilePath 相対パスまたは絶対パス
 * @returns
 */
export const replaceAssets = async (html: string, markdownFilePath: string) => {
  const absoluteMarkdownFilePath = path.isAbsolute(markdownFilePath)
    ? markdownFilePath
    : path.resolve(markdownFilePath);
  const topChildId = 'replaceAssets-temp';
  const fragment = JSDOM.fragment(`<div id="${topChildId}">${html}</div>`);

  // src 属性を持っているすべての要素を列挙
  const elementsHaveSrcAttr = Array.from(fragment.querySelectorAll('[src]'));

  for (const el of elementsHaveSrcAttr) {
    // @ts-ignore
    const src = el.src;
    let srcUrl: url.URL | undefined;

    try {
      srcUrl = new url.URL(src);
    } catch (error) {
      // noop
    }

    if (srcUrl && srcUrl.protocol === 'data:') {
      // noop すでにbase64になっていると思われる。
    } else if (
      srcUrl &&
      (srcUrl.protocol === 'http:' || srcUrl.protocol === 'https:')
    ) {
      const res = await axios.get(srcUrl.href, {responseType: 'arraybuffer'});
      const mime = getMimeType(srcUrl.pathname);
      const base64 = Buffer.from(res.data, 'binary').toString('base64');

      // @ts-ignore
      el.src = `data:${mime};base64,${base64}`;
    } else {
      let src_ = '';

      if (srcUrl && srcUrl.protocol === 'file:') {
        // 先頭のスラッシュを削除する。
        // /d:/path/to/file.xxx -> d:/path/to/file.xxx
        src_ = srcUrl.pathname.slice(1);
      } else {
        src_ = src;
      }

      let assetFilePath;
      if (path.isAbsolute(src_)) {
        assetFilePath = src_;
      } else {
        assetFilePath = path.join(path.dirname(absoluteMarkdownFilePath), src_);
      }

      let base64 = '';
      try {
        base64 = fs.readFileSync(assetFilePath, 'base64');
      } catch (error) {
        console.error(error);
      }

      const mime = getMimeType(src_);
      // @ts-ignore
      el.src = `data:${mime};base64,${base64}`;
    }
  }

  const replaced = fragment.getElementById(topChildId);
  if (replaced) {
    return replaced.innerHTML;
  } else {
    return '';
  }
};
