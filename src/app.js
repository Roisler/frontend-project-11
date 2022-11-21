import 'bootstrap';
import onChange from 'on-change';
import { formSubmit, modalClick } from './handlers';
import render from './view';
import { updatePosts } from './getData';
import './styles.scss';

export default () => {
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

  setInterval(() => updatePosts(state), 5000);

  formSubmit(document, state);
  modalClick(document, state);
};
