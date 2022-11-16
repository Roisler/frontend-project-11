import * as bootstrap from 'bootstrap';
import * as _ from 'lodash';
import onChange from 'on-change';
import axios from 'axios';
import schema from './validate';
import { renderErrors, renderFeeds, renderPosts } from './view';
import './scss/styles.scss';

const hexletProxy = 'https://allorigins.hexlet.app/raw?disableCache=true&url=';

const getParse = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const pars = doc.querySelector('parsererror');
  if (pars) {
    throw new Error('errors.parsing_error');
  }
  return doc;
};

const extractPosts = (doc, state, feedId) => {
  const channel = doc.querySelector('channel');
  const posts = channel.querySelectorAll('item');
  posts.forEach((post) => {
    const title = post.querySelector('title');
    const description = post.querySelector('description');
    const link = post.querySelector('link');
    const id = _.uniqueId('post_');
    const readyPost = {
      id,
      feedId,
      title: title.textContent,
      description: description.textContent,
      link: link.textContent,
    };
    state.data.posts.push(readyPost);
  });
};

const extractFeeds = (doc, state) => {
  const channel = doc.querySelector('channel');
  const title = channel.querySelector('title');
  const description = channel.querySelector('description');
  const id = state.data.feeds.length + 1;
  const feed = { id, title: title.textContent, description: description.textContent };
  state.data.feeds.push(feed);
  extractPosts(doc, state, id);
};

const getData = (state, path, e) => {
  const initState = state;
  axios.get(`${hexletProxy}${path}`).then((response) => {
    const doc = getParse(response.data);
    initState.data.urls.push(path);
    initState.data.errors = {};
    initState.rssForm.status = 'valid';
    e.target.reset();
    extractFeeds(doc, state);
  }).catch((error) => {
    initState.data.errors = error;
    initState.rssForm.status = 'invalid';
  });
};

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
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.rssForm.status = 'process';
    const formData = new FormData(form);
    const currentUrl = formData.get('url');
    state.data.currentUrl = currentUrl;
    schema.validate(state.data)
      .then(() => {
        getData(state, currentUrl, e);
      })
        /*let doc;
        axios.get(`${hexletProxy}${currentUrl}`)
          .then((response) => {
            doc = getParse(response.data);
            state.data.errors = {};
            state.rssForm.status = 'valid';
            e.target.reset();
            state.data.urls.push(currentUrl);
            extractFeeds(doc, state);
          }).catch((er) => {
            state.data.errors = er;
            state.rssForm.status = 'invalid';
            console.log(initialState.data.errors);
          });*/
      .catch((err) => {
        state.data.errors = err;
        state.rssForm.status = 'invalid';
      });
    input.focus();
  });
};

app();
