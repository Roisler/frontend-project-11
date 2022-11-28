import _ from 'lodash';

const getPostUi = (state, id) => {
  const uiPosts = state.ui.seenPosts;
  return uiPosts.includes(id);
};

const renderCards = (item, itemList, newElements, i18nInstance) => {
  const elements = newElements(item);

  elements.card.classList.add('card', 'border-0');
  elements.cardBody.classList.add('card-body');
  elements.header.classList.add('card-title', 'h4');
  elements.header.textContent = i18nInstance.t(`cards.${item}`);
  elements.cardBody.append(elements.header);
  elements.card.append(elements.cardBody);
  elements.container.replaceChildren(elements.card);
  elements.card.append(itemList);
};

const renderPosts = (state, newElements, i18nInstance) => {
  const { posts } = state.data;

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');

  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
    li.classList.add('border-0', 'border-end-0');
    const link = document.createElement('a');
    link.setAttribute('href', post.link);
    link.dataset.id = post.id;
    link.setAttribute('rel', 'noopener noreferrer');
    link.setAttribute('target', '_blank');
    const postView = getPostUi(state, post.id);
    if (postView === false) {
      link.classList.add('fw-bold');
    } else {
      link.classList.add('fw-normal', 'link-secondary');
    }
    link.textContent = post.title;

    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('data-bs-target', '#modal');
    button.dataset.id = post.id;
    button.setAttribute('data-bs-toggle', 'modal');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.textContent = i18nInstance.t('view');

    li.append(link, button);
    postsList.prepend(li);
  });
  renderCards('posts', postsList, newElements, i18nInstance);
};

const renderFeeds = (state, newElements, i18nInstance) => {
  const { feeds } = state.data;

  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'border-0', 'rounded-0');

  feeds.forEach((feed) => {
    const elements = {
      li: document.createElement('li'),
      title: document.createElement('h3'),
      description: document.createElement('p'),
    };
    elements.li.classList.add('list-group-item', 'border-0', 'border-end-0');
    elements.title.classList.add('h6', 'm-0');
    elements.title.textContent = feed.title;
    elements.description.classList.add('m-0', 'small', 'text-black-50');
    elements.description.textContent = feed.description;

    elements.li.append(elements.title, elements.description);
    feedsList.prepend(elements.li);
  });
  renderCards('feeds', feedsList, newElements, i18nInstance);
};

const renderForm = (value) => {
  const form = document.querySelector('form');
  const submit = form.querySelector('[type="submit"]');
  if (value === true) {
    submit.setAttribute('disabled', 'disabled');
  } else {
    submit.disabled = false;
  }
};

const renderErrors = (errors, value, i18nInstance) => {
  const feedback = document.querySelector('.feedback');
  const input = document.querySelector('#url-input');
  if (value === 'valid') {
    feedback.textContent = i18nInstance.t('success_load');
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
  } else if (value === 'process') {
    feedback.textContent = '';
    input.classList.remove('is-invalid');
  } else {
    input.classList.add('is-invalid');
    feedback.classList.add('text-danger');
    feedback.textContent = errors.message === 'Network Error' ? i18nInstance.t('errors.network_error') : i18nInstance.t(errors.message);
  }
};

const renderModal = (state, id) => {
  const { posts } = state.data;
  const currentPost = _.find(posts, (post) => post.id === id);
  const modal = document.querySelector('#modal');
  const modalTitle = modal.querySelector('.modal-title');
  modalTitle.textContent = currentPost.title;

  const modalBody = modal.querySelector('.modal-body');
  modalBody.textContent = currentPost.description;

  const buttonFull = modal.querySelector('.full-article');
  buttonFull.setAttribute('href', currentPost.link);
};

export default (state, path, value, newElements, i18nInstance) => {
  switch (path) {
    case 'ui.seenPosts':
      renderPosts(state, newElements, i18nInstance);
      break;
    case 'data.posts':
      renderPosts(state, newElements, i18nInstance);
      break;
    case 'rssForm.buttonDisabled':
      renderForm(value);
      break;
    case 'ui.modal':
      renderModal(state, value);
      break;
    case 'rssForm.status':
      if (value === 'valid') {
        renderErrors(state.data.errors, value, i18nInstance);
        renderFeeds(state, newElements, i18nInstance);
        renderPosts(state, newElements, i18nInstance);
      } else {
        renderErrors(state.data.errors, value, i18nInstance);
      }
      break;
    default:
      break;
  }
};
