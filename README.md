# 複数のMarkdownを１つのHTMLに変換する変換器

## 機能

- [ ] 出力されるHTMLに関して
  - [x] １つのHTMLファイルで完結させる。必須事項。
  - [x] ページ内の語彙を検索できる。
  - [x] 目次を自動生成し表示させる。
  - [x] 目次クリックで該当位置へジャンプできる。
  - [ ] 表示している記事に該当する目次の見た目をそれとわかるように変える。
  - [ ] 画像の原寸表示をしたい。
  - [ ] 印刷時には目次を消す。
  - [x] ページ切り替えに対応させる。
  - [ ] 印刷時にページ分けされたページを一括で印刷できる。
  - [ ] 表を画像化するかどうか選択できるようにする。
- [x] 入力するMarkdownに関して
  - [x] 拡張表記を必要としないこと。必須事項。
  - [x] 複数のMarkdownを結合し、1つのHTMLを出力できる。ページ切り替えに対応する。

## 使用方法

```
npm install https://github.com/srymh/markdowns-to-single-html
```

``` ts
import fs from 'fs';
import {markdownsToSingleHtml} from 'markdownsToSingleHtml';

const htmlFilePath = './sample.html';
const markdownFilePaths = [
  './sample1.md',
  './sample2.md',
  './sample3.md',
];

fs.writeFileSync(
  htmlFilePath,
  markdownsToSingleHtml(markdownFilePaths, {
    title: 'Sample',
    allowHtml: true,
  }),
  'utf8'
);
```
