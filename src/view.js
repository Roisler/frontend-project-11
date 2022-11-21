import renderForm from './renderForm';
import renderPosts from './renderPosts';
import renderFeeds from './renderFeeds';
import renderErrors from './renderErrors';

export default (state, path, value) => {
  switch (path) {
    case 'uiState' || 'data.posts':
      renderPosts(state, 'posts');
      break;
    case 'rssForm.buttonDisabled':
      renderForm(value);
      break;
    case 'rssForm.status':
      if (value === 'valid') {
        renderErrors(state.data.errors, value);
        renderPosts(state, 'posts');
        renderFeeds(state, 'feeds');
      } else {
        renderErrors(state.data.errors, value);
      }
      break;
    default:
      break;
  }
};
