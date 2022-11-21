import i18next from 'i18next';
import ru from './locales/ru';

export default (value) => {
  i18next.init({
    lng: 'ru',
    resources: {
      ru,
    },
  }).then(() => {
    const render = () => {
      const form = document.querySelector('form');
      const submit = form.querySelector('[type="submit"]');
      if (value === true) {
        submit.setAttribute('disabled', 'disabled');
      } else {
        submit.disabled = false;
      }
    };
    render(i18next);
  });
};
