export default (data) => {
  const initParser = new DOMParser();
  const doc = initParser.parseFromString(data, 'application/xml');
  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    throw new Error('errors.parsing_error');
  }

  const channel = doc.querySelector('channel');
  const feed = {
    title: channel.querySelector('title').textContent,
    description: channel.querySelector('description').textContent,
    link: channel.querySelector('link').textContent,
  };

  const items = channel.querySelectorAll('item');
  const posts = [];
  items.forEach((item) => {
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    const post = {
      title,
      description,
      link,
    };
    posts.push(post);
  });

  const result = {
    feed,
    posts,
  };

  return result;
};
