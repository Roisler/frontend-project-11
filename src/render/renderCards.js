import i18n from 'i18next';
import ru from '../locales/ru';

export default (state, item, itemList) => {
  i18n.init({
    lng: 'ru',
    resources: {
      ru,
    },
  }).then(() => {
    const currentItem = item === 'posts' ? 'posts' : 'feeds';
    const render = () => {
      const elements = {
        container: document.querySelector(`.${currentItem}`),
        card: document.createElement('div'),
        cardBody: document.createElement('div'),
        header: document.createElement('h2'),
        list: document.createElement('ul'),
      };

      elements.card.classList.add('card', 'border-0');
      elements.cardBody.classList.add('card-body');

      elements.header.classList.add('card-title', 'h4');
      elements.header.textContent = i18n.t(`cards.${currentItem}`);
      elements.cardBody.append(elements.header);
      elements.card.append(elements.cardBody);
      elements.container.replaceChildren(elements.card);
      elements.card.append(itemList);
    };
    render(i18n);
  });
};
