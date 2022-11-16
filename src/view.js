import onChange from 'on-change';
import _ from 'lodash';
import i18next from 'i18next';
import ru from './locales/ru';

/* export const renderCards = (state, title) => {
  i18next.init({
    lng: 'ru',
    resources: {
      ru,
    },
  }).then(() => {
    const render = () => {
      let titleClass;
      let headerText;
      if (title === 'feeds') {
        titleClass = '.feeds';
        headerText = i18next.t('cards.feeds');
      } else {
        titleClass = '.posts';
        headerText = i18next.t('cards.posts');
      }
      const elements = document.querySelector(`${titleClass}`);
      const card = document.createElement('div');
      card.classList.add('card', 'border-0');
      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');
      const header = document.createElement('h2');
      header.classList.add('card-title', 'h4');
      header.textContent = headerText;
      cardBody.append(header);
      card.append(cardBody);
      elements.replaceChildren(card);
    };
    render(i18next);
  })
    .then(() => {
      renderFeeds(state);
    });
}; */

export const renderFeeds = (state) => {
  i18next.init({
    lng: 'ru',
    resources: {
      ru,
    },
  }).then(() => {
    const render = () => {
      const { feeds } = state.data;

      const feedsContainer = document.querySelector('.feeds');
      const feedsCard = document.createElement('div');
      feedsCard.classList.add('card', 'border-0');

      const feedsCardBody = document.createElement('div');
      feedsCardBody.classList.add('card-body');

      const feedsHeader = document.createElement('h2');
      feedsHeader.classList.add('card-title', 'h4');
      feedsHeader.textContent = i18next.t('cards.feeds');

      feedsCardBody.append(feedsHeader);
      feedsCard.append(feedsCardBody);
      feedsContainer.replaceChildren(feedsCard);
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
      feedsCard.append(feedsList);
    };
    render(i18next);
  });
};

export const renderPosts = (state) => {
  i18next.init({
    lng: 'ru',
    resources: {
      ru,
    },
  }).then(() => {
    const { posts } = state.data;

    const postsContainer = document.querySelector('.posts');
    const postsCard = document.createElement('div');
    postsCard.classList.add('card', 'border-0');

    const postsCardBody = document.createElement('div');
    postsCardBody.classList.add('card-body');

    const postsHeader = document.createElement('h2');
    postsHeader.classList.add('card-title', 'h4');
    postsHeader.textContent = i18next.t('cards.posts');

    postsCardBody.append(postsHeader);
    postsCard.append(postsCardBody);
    postsContainer.replaceChildren(postsCard);
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
      link.classList.add('fw-bold');
      link.textContent = post.title;

      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.setAttribute('data-bs-target', '#modal');
      button.dataset.id = post.id;
      button.setAttribute('data-bs-toggle', 'modal');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.textContent = i18next.t('view');

      li.append(link, button);
      postsList.prepend(li);
    });
    postsCard.append(postsList);
  });
};

export const renderErrors = (errors, value) => {
  i18next.init({
    lng: 'ru',
    resources: {
      ru,
    },
  }).then(() => {
    const render = () => {
      const feedback = document.querySelector('.feedback');
      const input = document.querySelector('#url-input');
      if (value === 'valid') {
        feedback.textContent = i18next.t('success_load');
        input.classList.remove('is-invalid');
        feedback.classList.remove('text-danger');
        feedback.classList.add('text-success');
      } else if (value === 'process') {
        feedback.textContent = '';
        input.classList.remove('is-invalid');
      } else {
        input.classList.add('is-invalid');
        feedback.classList.add('text-danger');
        feedback.textContent = errors.message === 'Network Error' ? i18next.t('errors.network_error') : i18next.t(errors.message);
      }
    };
    render(i18next);
  });
};
