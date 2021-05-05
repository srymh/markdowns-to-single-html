import fs from 'fs';
import http from 'http';
import {markdownsToSingleHtml} from '../src/index';

const htmlFilePath = './test/test-template.html';
const markdownFilePaths = [
  './test/markdowns/test-template.md',
  './test/markdowns/test-template2.md',
];

fs.writeFileSync(
  htmlFilePath,
  markdownsToSingleHtml(markdownFilePaths, {
    title: 'hello',
    allowHtml: true,
  }),
  'utf8'
);

const html = fs.readFileSync(htmlFilePath, 'utf8');

try {
  http
    .createServer((_req, res) => {
      res.writeHead(200, {'Content-type': 'text/html'});
      res.end(html);
    })
    .listen(5000);
} catch (error) {
  console.error(error);
}
