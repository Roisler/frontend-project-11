import onChange from 'on-change';
import _ from 'lodash';
import i18next from 'i18next';
import ru from './locales/ru';

export const renderCards = (state, title) => {
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
      const feeds = document.querySelector(`${titleClass}`);
      const card = document.createElement('div');
      card.classList.add('card', 'border-0');
      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');
      const header = document.createElement('h2');
      header.classList.add('card-title', 'h4');
      header.textContent = headerText;
      cardBody.append(header);
      card.append(cardBody);
      feeds.append(card);
    };
    render(i18next);
  });
};

export const renderErrors = (errors) => {
  i18next.init({
    lng: 'ru',
    resources: {
      ru,
    },
  }).then((t) => {
    const render = () => {
      const feedback = document.querySelector('.feedback');
      const input = document.querySelector('#url-input');
      if (_.isEmpty(errors)) {
        feedback.textContent = '';
        input.classList.remove('is-invalid');
      } else {
        input.classList.add('is-invalid');
        feedback.textContent = t(errors.errors);
      }
    };
    render(i18next);
  });
};
