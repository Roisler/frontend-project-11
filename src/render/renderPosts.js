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
        if (post.viewed === false) {
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
        button.textContent = i18next.t('view');

        li.append(link, button);
        postsList.prepend(li);
      });
      renderCards(state, item, postsList);
    };
    render(i18next);
  });
};
