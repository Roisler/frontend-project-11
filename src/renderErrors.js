import i18next from 'i18next';
import ru from './locales/ru';

export default (errors, value) => {
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
