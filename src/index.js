import * as bootstrap from 'bootstrap';
import onChange from 'on-change';
import { formSubmit, modalClick } from './utils/handlers';
import {
  renderErrors,
  renderFeeds,
  renderForm,
  renderPosts,
} from './view';
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
    switch (path) {
      case 'data.posts':
        renderPosts(initialState, 'posts');
        break;
      case 'rssForm.buttonDisabled':
        renderForm(value);
        break;
      case 'rssForm.status':
        if (value === 'valid') {
          renderErrors(state.data.errors, value);
          renderPosts(initialState, 'posts');
          renderFeeds(initialState, 'feeds');
        } else {
          renderErrors(state.data.errors, value);
        }
        break;
      default:
        break;
    }
  });

  formSubmit(document, state);
  modalClick(document, state);
};

app();
