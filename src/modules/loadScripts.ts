import {readFileSync} from 'fs';
import path from 'path';

export const loadScripts = (folder: string, fileNames: string[]) => {
  let script = '';
  for (const fileName of fileNames) {
    script +=
      '<script>' +
      readFileSync(path.join(folder, fileName), 'utf8') +
      '</script>';
  }
  return script;
};
