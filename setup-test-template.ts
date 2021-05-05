import {writeFileSync} from 'fs';
import {markdownsToSingleHtml} from './src/index';

writeFileSync(
  'test-template.html',
  markdownsToSingleHtml(
    [
      './test/test-template.md',
      './test/headers.md',
      './test/sample.md',
      './test/sample2.md',
    ],
    {
      title: 'hello',
    }
  ),
  'utf8'
);
