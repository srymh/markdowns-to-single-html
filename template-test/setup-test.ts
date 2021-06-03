import http from 'http';
import {markdownsToSingleHtml} from '../src/index';

const markdownFilePaths = [
  './template-test/markdowns/index.md',
  './template-test/markdowns/sub.md',
];

markdownsToSingleHtml(markdownFilePaths, {
  title: 'hello',
  allowHtml: true,
}).then((html) => {
  require('fs').writeFile('./' + Date.now() + '.html', html, () => {});

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
});
