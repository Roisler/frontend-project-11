import i18next from 'i18next';
import ru from '../locales/ru';
import renderCards from './renderCards';

export default (state, item) => {
  i18next.init({
    lng: 'ru',
    resources: {
      ru,
    },
  }).then(() => {
    const render = () => {
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

      renderCards(state, item, feedsList);
    };
    render(i18next);
  });
};
