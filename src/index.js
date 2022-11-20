import 'bootstrap';
import onChange from 'on-change';
import { formSubmit, modalClick } from './utils/handlers';
import render from './view';
import './scss/styles.scss';

const app = () => {
  const initialState = {
    rssForm: {
      status: '',
      buttonDisabled: false,
    },
    uiState: [],
    data: {
      currentUrl: '',
      urls: [],
      feeds: [],
      posts: [],
      errors: {},
    },
  };

  const state = onChange(initialState, (path, value) => {
    render(initialState, path, value);
  });

  formSubmit(document, state);
  modalClick(document, state);
};

app();
