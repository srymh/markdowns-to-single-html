export const makeHtmlPage = (html: string, pageId: string, top: boolean) => {
  const show = top ? ' show' : '';
  return `<section class="page${show}" id="${pageId}">${html}</section>`;
};
