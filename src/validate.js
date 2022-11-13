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
    .notOneOf([yup.ref('posts')])
    .url()
    .required(),
  posts: yup.array(),
  feeds: yup.array(),
});
