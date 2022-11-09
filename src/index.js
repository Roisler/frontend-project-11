import * as bootstrap from 'bootstrap'
import * as _ from 'lodash';
import onChange from 'on-change';
import * as yup from 'yup';
import axios from 'axios';
import { renderCards, renderErrors } from './view';
import './scss/styles.scss';

const app = () => {
  const state = {
    rssForm: {
      status: 'valid',
      buttonDisabled: false,
    },
    data: {
      currentUrl: '',
      posts: [],
      feeds: [],
      errors: {},
    },
  };

  const watchedState = onChange(state, (path, value, previousValue) => {
    renderErrors(state.data.errors);
    if (path === 'data.posts') {
      if (_.isEmpty(previousValue)) {
        renderCards(state, 'posts');
      }
    }
    if (path === 'data.feeds') {
      if (_.isEmpty(previousValue)) {
        renderCards(state, 'feeds');
      }
    }
  });

  const schema = yup.object().shape({
    currentUrl: yup.string()
      .notOneOf([yup.ref('posts')], 'Уже существует')
      .url('Ссылка должна быть валидным URL')
      .required('Обязательное поле!'),
    posts: yup.array(),
    feeds: yup.array(),
  });

  const input = document.querySelector('#url-input');
  input.addEventListener('input', (e) => {
    const currentValue = e.target.value;
    watchedState.data.currentUrl = currentValue;
  });

  const form = document.querySelector('.rss-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentValue = watchedState.data.currentUrl;
    schema.validate(watchedState.data)
      .then(() => {
        watchedState.data.errors = {};
        watchedState.data.feeds.push(currentValue);
        watchedState.data.posts.push(currentValue);
        e.target.reset();
      })
      .catch((err) => {
        watchedState.data.errors = err;
      });
    /* axios.get('https://www.vedomosti.ru/rss/articles')
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      }); */
    input.focus();
  });
};

app();
