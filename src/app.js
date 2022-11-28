import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
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

const validate = (data) => {
  yup.setLocale({
    mixed: {
      notOneOf: 'errors.already_exists',
    },
    string: {
      url: 'errors.invalid_url',
      required: 'errors.required_field',
    },
  });

  const schema = yup.object().shape({
    currentUrl: yup.string()
      .notOneOf([yup.ref('urls')])
      .url()
      .required(),
    urls: yup.array(),
    feeds: yup.array(),
    posts: yup.array(),
  });
  return schema.validate(data);
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

const extractFeeds = (data, state) => {
  const newData = _.cloneDeep(data);
  const { feed } = newData;
  const currentFeed = _.find(state.data.feeds, (el) => el.title === feed.title);
  if (currentFeed) {
    extractPosts(data, state, currentFeed.id);
  } else {
    feed.id = state.data.feeds.length + 1;
    state.data.feeds.push(feed);
    extractPosts(data, state, feed.id);
  }
};

const updatePosts = (state) => {
  const { urls } = state.data;
  Promise.all(urls.map((url) => axios.get(route(url)).then((response) => {
    const data = parser(response.data.contents);
    extractFeeds(data, state);
  }))).finally(() => setTimeout(() => updatePosts(state), 5000));
};

const getData = (state, path, e) => {
  const initState = state;
  axios.get(route(path)).then((response) => {
    const data = parser(response.data.contents);
    initState.data.urls.push(path);
    extractFeeds(data, state);
    initState.data.errors = {};
    initState.rssForm.status = 'valid';
    initState.rssForm.buttonDisabled = false;
    e.target.reset();
  }).catch((error) => {
    initState.data.errors = error;
    initState.rssForm.status = 'invalid';
    initState.rssForm.buttonDisabled = false;
  });
};

const postClick = (document, state) => {
  const { ui } = state;
  const { posts } = state.data;

  const postsContainer = document.querySelector('.posts');
  postsContainer.addEventListener('click', (e) => {
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

const formSubmit = (document, state) => {
  const input = document.querySelector('#url-input');
  const form = document.querySelector('.rss-form');
  const initState = state;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    initState.rssForm.status = 'process';
    initState.rssForm.buttonDisabled = true;
    const formData = new FormData(form);
    const currentUrl = formData.get('url');
    initState.data.currentUrl = currentUrl;
    validate(state.data)
      .then(() => {
        getData(state, currentUrl, e);
      })
      .catch((err) => {
        initState.data.errors = err;
        initState.rssForm.status = 'invalid';
        initState.rssForm.buttonDisabled = false;
      });
    input.focus();
  });
};

export default () => {
  i18n.init({
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
          currentUrl: '',
          urls: [],
          feeds: [],
          posts: [],
          errors: {},
        },
      };

      const newElements = (item) => {
        const elements = {
          container: document.querySelector(`.${item}`),
          card: document.createElement('div'),
          cardBody: document.createElement('div'),
          header: document.createElement('h2'),
        };
        return elements;
      };

      const i18nInstance = i18n.createInstance();
      i18nInstance.init({
        lng: 'ru',
        resources: {
          ru,
        },
      });

      const state = onChange(initialState, (path, value) => {
        watch(initialState, path, value, newElements, i18nInstance);
      });
      setTimeout(() => updatePosts(state), 5000);
      formSubmit(document, state);
      postClick(document, state);
    };
    app(i18n);
  });
};
