import axios from 'axios';
import parser from '../parsers/parser';
import extractFeedsAndPosts from '../parsers/extractFeedsAndPosts';

const route = (url) => {
  const resultUrl = new URL('https://allorigins.hexlet.app/raw');
  resultUrl.searchParams.set('disableCache', true);
  resultUrl.searchParams.set('url', url);
  return resultUrl.toString();
};

export default (state, path, e) => {
  const initState = state;
  axios.get(route(path)).then((response) => {
    const doc = parser(response.data);
    initState.data.urls.push(path);
    initState.data.errors = {};
    initState.rssForm.status = 'valid';
    e.target.reset();
    extractFeedsAndPosts(doc, state);
  }).catch((error) => {
    initState.data.errors = error;
    initState.rssForm.status = 'invalid';
  });
};
