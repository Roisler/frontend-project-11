import * as yup from 'yup';

yup.setLocale({
  mixed: {
    notOneOf: 'errors.already_exists',
  },
  string: {
    url: 'errors.invalid_url',
    required: 'errors.required_field',
  },
});

export default yup.object().shape({
  currentUrl: yup.string()
    .notOneOf([yup.ref('urls')])
    .url()
    .required(),
  urls: yup.array(),
  feeds: yup.array(),
  posts: yup.array(),
});
