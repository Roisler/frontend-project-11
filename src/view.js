import renderForm from './render/renderForm';
import renderPosts from './render/renderPosts';
import renderFeeds from './render/renderFeeds';
import renderErrors from './render/renderErrors';

export default (state, path, value) => {
  switch (path) {
    case 'data.posts':
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
