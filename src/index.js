import * as bootstrap from 'bootstrap';
import onChange from 'on-change';
// import schema from './validate';
// import getData from './utils/getData';
import addHandlers from './utils/handlers';
import { renderErrors, renderFeeds, renderPosts } from './view';
import './scss/styles.scss';

const app = () => {
  const initialState = {
    rssForm: {
      status: '',
      buttonDisabled: false,
    },
    data: {
      currentUrl: '',
      urls: [],
      feeds: [],
      posts: [],
      errors: {},
    },
  };

  const state = onChange(initialState, (path, value) => {
    if (path === 'data.posts') {
      renderPosts(initialState);
    }
    if (path === 'rssForm.status') {
      if (value === 'valid') {
        renderErrors(state.data.errors, value);
        renderPosts(initialState);
        renderFeeds(initialState);
      } else {
        renderErrors(state.data.errors, value);
      }
    }
  });

  const input = document.querySelector('#url-input');
  const form = document.querySelector('.rss-form');
  addHandlers(form, input, state);
  /* form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.rssForm.status = 'process';
    const formData = new FormData(form);
    const currentUrl = formData.get('url');
    state.data.currentUrl = currentUrl;
    schema.validate(state.data)
      .then(() => {
        getData(state, currentUrl, e, 'load');
      })
      .catch((err) => {
        state.data.errors = err;
        state.rssForm.status = 'invalid';
      });
    input.focus();
    setInterval(() => {
      state.data.urls.forEach((url) => {
        getData(state, url, e);
      });
    }, 5000);
  }); */
};

app();
