import onChange from 'on-change';
import _ from 'lodash';

export const renderCards = (state, title) => {
  let titleClass;
  let headerText;
  if (title === 'feeds') {
    titleClass = '.feeds';
    headerText = 'Фиды';
  } else {
    titleClass = '.posts';
    headerText = 'Посты';
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

export const renderErrors = (errors) => {
  const feedback = document.querySelector('.feedback');
  const input = document.querySelector('#url-input');
  if (_.isEmpty(errors)) {
    feedback.textContent = '';
    input.classList.remove('is-invalid');
  } else {
    input.classList.add('is-invalid');
    feedback.textContent = errors.message;
  }
};
