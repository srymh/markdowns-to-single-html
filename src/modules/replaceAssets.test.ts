import {replaceAssets} from './replaceAssets';
import http from 'http';
import fs from 'fs';

const base64_cow_png =
  'iVBORw0KGgoAAAANSUhEUgAAAMMAAACJCAIAAAAe3hv3AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAVXSURBVHhe7ZJRstwwCARz/0u/KCvH5bK9NoIGKZXpv13DMKD59SMEgZIkGJQkwaAkCQYlSTAoSYJBSRIMSpJgUJIEg5IkGJQkwaAkCQYlSTAoSYJBSRIMSpJgUJIEg5IkGJQkwaAkCQYlSTAoSYJBSRIMSpJgUJIEg5IkGJQkwaAkCQYlSTAoSYJBSRIMSpJgUJIEg5IkGJQkwaAkCQYlSTAoSYJBSRIMSpJgUJIEg5IkGJQkwaAkCYb5SfplY6sWqzLthbaAmCMyVCzqmfA2kUxEehG6gc72l/hQfY74A8x6wk94Nq4/88jWpyh1SR3l83yrOO9mOttfKEmyOEUu8UOX3XfI+VCxEVwwiQqXSbcoOLFvROsCvYFSqSz6GBayTxzUp+wpSX9IvUKeeFNGxLtOY/vtIthexj/50tmwzv9EKSA41BsZFCRr8MSVgiQ5b7I+5aEu3wiErMETV4qQaruJO/SHWhz6Rz4GnQophwvuM4sa26NThurjK7gV+NvVvAdOpe2kcLTKIeUrkXb+fMFlplDv2T5xqNJefEukHb5gcJNZTLFtHGr31irtxbdE2skLBteYxSzbxrn2sl5prL/ibuyEmk8ErUxhrmfLdKPDvcy9UfAUoeYTQSv1TDdsMWA0uZe5lwpeI9R8ImilnumGLQaMJvcy91LBa4SajwR91LOI4VcbRp97mXuv4EFCzUeCPupZxPCrDYvPY41vr/g1ov2duI9i1jH86sRi9VjjWy1+kGh/J+6jmHUMvzoZLfCtFj9ItL8RN1HMUoZfzYwW+LaL3yTa34ibKGYpw69mRgsc2yEHISQIH2Us5dZi5rXmVOBYELkJIUH4KGMptxYzrzWnAseCyE2iEoiJSpYybDHzXHP96lgQuUlUAjFRyVKGLWaea65fHQsiN4lKICbKWM2txc9zze3X0TWRs0QlEBNlLOXWaOa57Pbr0JrUTaIqlI8alnJrNPNcdvt1aE3qJlEVykcNS7k1mnko+/ZpaE3qJlEVykcN67i1O3mo9H06Qd0kqkL5qGEdt8hL+z6doG4CqFBWCljHavylnxXi+qMAKpSVAtaxGn/pZ4W4/iiACmWlhhXcDnn4VvwqYpkCXgMQAt0UMN3tqIFv9a86lkHgNRgh0FA2062OGvhW/6pjGQRegxPiPGUz0apj9G2LRYeqMcIJcZ6ymWjVMfq2xajzWgaeAhNqgLaymWLVN/S2yyj1WgbeARNqgLaymWLVN/S2yyj1XMYegdRqsObyqPfpnnhtHJJ6KGaPQGo1WHOpVFqNzLr2Dqk9FLMXILU6rL9UaqzGp5wUhgS/FeO7w3Id3GUSBT6RESeRIc1vxfjusFwHd5lHqlVK/Kjj0LxtwReH5XZwo3kkWQVlj1IO2WtLxsq84k6G3SRwq6zgUc2hfG3B923wikcyHCfRrFJu8a2Pgj7xUxfusMErHmmOM0znEXebtO8u69M/dWWYTFn7RNJxM4hYbb15m3Zlt/6pMcNn1uYnmvUM9zugeLfa2H4bGK130PUjU/beJKu5+5/I2KFpdrbfHBZZSw1CnxKZtfcmGa64wpG2Rmf77WVTyTnKkW3Mh+2vv1z/yePWwBBdobH9pqm7xYltrb9s/xoYrQfpo3e2f0tAJiIi35jzJFf6kha2hv8MZHdE5Bv/6cP8c+QlgEJJEgxKkmBQkgSDkiQYlCTBoCQJBiVJMChJgkFJEgxKkmBQkgSDkiQYlCTBoCQJBiVJMChJgkFJEgxKkmBQkgSDkiQYlCTBoCQJBiVJMChJgkFJEgxKkmBQkgSDkiQYlCTBoCQJBiVJMChJguDn5zelW2dmEwE9MgAAAABJRU5ErkJggg==';

describe('replaceAssets.ts', () => {
  test('simple', async () => {
    // ????????????
    // const html = '<img src="\\\\fileserver\\path\\to\\image.png">';
    // const html =
    //   '<img src="file:///D:\\path\\to\\test\\cow.png">';
    // const html =
    //   '<img src="D:\\path\\to\\test\\cow.png">';
    const html = '<img src="./test/cow.png">';
    const markdownFilePath = `./dummy.md`;
    const replaced = await replaceAssets(html, markdownFilePath);

    const expectedHtml = `<img src="data:image/png;base64,${base64_cow_png}">`;
    expect(replaced).toBe(expectedHtml);
  });

  test('http', async () => {
    const server = http
      .createServer((_req, res) => {
        // ?????????URL??????????????????????????? cow.png ????????????
        const rs = fs.createReadStream('./test/cow.png');
        rs.on('open', () => {
          res.writeHead(200, {'Content-type': 'image/png'});
          rs.pipe(res);
        });
      })
      .listen(5001);

    const html = '<img src="http://localhost:5001/cow.png">';

    const markdownFilePath = `./dummy.md`;
    const replaced = await replaceAssets(html, markdownFilePath);

    server.close();

    const expectedHtml = `<img src="data:image/png;base64,${base64_cow_png}">`;
    expect(replaced).toBe(expectedHtml);
  });
});
