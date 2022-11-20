import axios from 'axios';
import parser from '../parsers/parser';
import extractFeedsAndPosts from '../parsers/extractFeedsAndPosts';

const route = (url) => {
  const resultUrl = new URL('https://allorigins.hexlet.app/raw');
  resultUrl.searchParams.set('disableCache', true);
  resultUrl.searchParams.set('url', url);
  return resultUrl.toString();
};

export default (state, path, e, status = 'update') => {
  const initState = state;
  axios.get(route(path)).then((response) => {
    const doc = parser(response.data);
    if (!initState.data.urls.includes(path)) {
      initState.data.urls.push(path);
      initState.rssForm.status = 'valid';
      initState.rssForm.buttonDisabled = false;
      e.target.reset();
    }
    initState.data.errors = {};
    extractFeedsAndPosts(doc, state, path);
  }).catch((error) => {
    if (status !== 'update') {
      initState.data.errors = error;
      initState.rssForm.status = 'invalid';
      initState.rssForm.buttonDisabled = false;
    }
    // console.error('Возникла ошибка при обновлении RSS потока. Проверьте наличие интернета');
  });
};
