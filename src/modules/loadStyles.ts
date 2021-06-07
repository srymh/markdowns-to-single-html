import {readFileSync} from 'fs';
import path from 'path';

export const loadStyles = (folder: string, fileNames: string[]) => {
  let style = '';
  for (const fileName of fileNames) {
    style +=
      '<style>' +
      readFileSync(path.join(folder, fileName), 'utf8') +
      '</style>';
  }
  return style;
};
