import schema from '../validate';
import getData from './getData';

export default (form, input, state) => {
  const initState = state;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    initState.rssForm.status = 'process';
    const formData = new FormData(form);
    const currentUrl = formData.get('url');
    initState.data.currentUrl = currentUrl;
    schema.validate(state.data)
      .then(() => {
        getData(state, currentUrl, e, 'load');
      })
      .catch((err) => {
        initState.data.errors = err;
        initState.rssForm.status = 'invalid';
      });
    input.focus();
    setInterval(() => {
      state.data.urls.forEach((url) => {
        getData(state, url, e);
      });
    }, 5000);
  });
};
