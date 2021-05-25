import http from 'http';
import {markdownsToSingleHtml} from '../src/index';

const markdownFilePaths = [
  './template-test/markdowns/index.md',
  './template-test/markdowns/sub.md',
];

const html = markdownsToSingleHtml(markdownFilePaths, {
  title: 'hello',
  allowHtml: true,
});

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
