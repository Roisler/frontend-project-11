import 'bootstrap';
import _ from 'lodash';
import axios from 'axios';
import * as yup from 'yup';
import onChange from 'on-change';
import i18n from 'i18next';
import watch from './view';
import ru from './locales/ru';
import parser from './parser';

const route = (url) => {
  const resultUrl = new URL('https://allorigins.hexlet.app/get');
  resultUrl.searchParams.set('disableCache', true);
  resultUrl.searchParams.set('url', url);
  return resultUrl;
};

const validate = (currentUrl, urls) => {
  yup.setLocale({
    mixed: {
      notOneOf: 'errors.already_exists',
    },
    string: {
      url: 'errors.invalid_url',
      required: 'errors.required_field',
    },
  });

  const schema = yup.string()
    .notOneOf(urls)
    .url()
    .required();

  return schema.validate(currentUrl);
};

const extractPosts = (data, state, feedId) => {
  const newData = _.cloneDeep(data);
  const { posts } = newData;
  posts.forEach((el) => {
    const post = el;
    const currentPost = _.find(state.data.posts, (elem) => elem.link === post.link);
    if (currentPost) {
      return;
    }
    post.id = _.uniqueId('post_');
    post.feedId = feedId;
    state.data.posts.push(post);
  });
};

const extractFeeds = (data, url, state) => {
  const newData = _.cloneDeep(data);
  const { feed } = newData;
  const currentFeed = _.find(state.data.feeds, (el) => el.title === feed.title);
  if (currentFeed) {
    extractPosts(data, state, currentFeed.id);
  } else {
    feed.url = url;
    feed.id = state.data.feeds.length + 1;
    state.data.feeds.push(feed);
    extractPosts(data, state, feed.id);
  }
};

const updatePosts = (state) => {
  const { feeds } = state.data;
  return Promise.all(feeds.map((feed) => axios.get(route(feed.url))
    .then((response) => {
      const data = parser(response.data.contents);
      extractFeeds(data, feed.url, state);
    })
    .catch((err) => {
      throw new Error(err);
    })))
    .finally(() => setTimeout(() => updatePosts(state), 5000));
};

const getData = (state, path, e) => {
  const initState = state;
  return axios.get(route(path)).then((response) => {
    const data = parser(response.data.contents);
    extractFeeds(data, path, state);
    initState.data.error = {};
    initState.rssForm.status = 'valid';
    initState.rssForm.buttonDisabled = false;
    e.target.reset();
  });
};

const postClick = (elements, state) => {
  const { ui } = state;
  const { posts } = state.data;

  elements.postsContainer.addEventListener('click', (e) => {
    if (e.target.dataset.id) {
      const { id } = e.target.dataset;
      const selectedPost = _.find(posts, (post) => post.id === id);

      ui.modal = selectedPost.id;

      if (!ui.seenPosts.includes(selectedPost.id)) {
        ui.seenPosts.push(selectedPost.id);
      }
    }
  });
};

const formSubmit = (elements, state) => {
  const initState = state;
  const { input, form } = elements;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    initState.rssForm.status = 'process';
    initState.rssForm.buttonDisabled = true;
    const formData = new FormData(form);
    const currentUrl = formData.get('url');
    const urls = state.data.feeds.map((feed) => feed.url);
    input.focus();
    return validate(currentUrl, urls)
      .then(() => getData(state, currentUrl, e))
      .catch((err) => {
        initState.data.error = err;
        initState.rssForm.status = 'invalid';
        initState.rssForm.buttonDisabled = false;
      });
  });
};

export default () => {
  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'ru',
    resources: {
      ru,
    },
  }).then(() => {
    const app = () => {
      const initialState = {
        rssForm: {
          status: '',
          buttonDisabled: false,
        },
        ui: {
          modal: '',
          seenPosts: [],
        },
        data: {
          feeds: [],
          posts: [],
          error: {},
        },
      };

      const elements = {
        feedsContainer: document.querySelector('.feeds'),
        postsContainer: document.querySelector('.posts'),
        input: document.querySelector('#url-input'),
        form: document.querySelector('.rss-form'),
        feedback: document.querySelector('.feedback'),
        modal: document.querySelector('#modal'),
        modalTitle: document.querySelector('.modal-title'),
        modalBody: document.querySelector('.modal-body'),
        modalButtonFullRead: document.querySelector('.full-article'),
      };

      const state = onChange(initialState, (path, value) => {
        watch(initialState, path, value, elements, i18nInstance);
      });
      setTimeout(() => updatePosts(state), 5000);
      formSubmit(elements, state);
      postClick(elements, state);
    };
    app(i18n);
  });
};
