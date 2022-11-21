import _ from 'lodash';
import schema from './validate';
import { getData } from './getData';
import renderModal from './renderModal';

export const formSubmit = (document, state) => {
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
    schema.validate(state.data)
      .then(() => {
        getData(state, currentUrl, e, 'load');
      })
      .catch((err) => {
        initState.data.errors = err;
        initState.rssForm.status = 'invalid';
        initState.rssForm.buttonDisabled = false;
      });
    input.focus();
  });
};

export const modalClick = (document, state) => {
  const { posts } = state.data;

  const modal = document.querySelector('#modal');
  modal.addEventListener('show.bs.modal', (e) => {
    const modalButton = e.relatedTarget;
    const { id } = modalButton.dataset;

    const selectedPost = _.find(posts, (post) => post.id === id);

    renderModal(modal, selectedPost);

    state.uiState.forEach((element) => {
      const post = element;
      if (post.id === id) {
        post.viewed = true;
      }
    });
  });
};
