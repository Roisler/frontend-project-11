import axios from 'axios';
import parser from './parser';
import extractFeedsAndPosts from './extractFeedsAndPosts';

const route = (url) => {
  const resultUrl = new URL('https://allorigins.hexlet.app/get');
  resultUrl.searchParams.set('disableCache', true);
  resultUrl.searchParams.set('url', url);
  return resultUrl;
};

const updatePosts = (state) => {
  const { urls } = state.data;
  urls.forEach((url) => {
    axios.get(route(url)).then((response) => {
      const data = parser(response.data.contents);
      extractFeedsAndPosts(data, state, url);
    });
  });
};

export default (state, path, e, status = 'update') => {
  const initState = state;
  axios.get(route(path)).then((response) => {
    const data = parser(response.data.contents);
    if (!initState.data.urls.includes(path)) {
      initState.data.urls.push(path);
      initState.rssForm.status = 'valid';
      initState.rssForm.buttonDisabled = false;
      e.target.reset();
    }
    initState.data.errors = {};
    extractFeedsAndPosts(data, state);
    setInterval(() => updatePosts(state), 5000);
  }).catch((error) => {
    if (status !== 'update') {
      initState.data.errors = error;
      initState.rssForm.status = 'invalid';
      initState.rssForm.buttonDisabled = false;
    }
    // console.error('Возникла ошибка при обновлении RSS потока. Проверьте наличие интернета');
  });
};
