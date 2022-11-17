import _ from 'lodash';

const extractPosts = (doc, state, feedId) => {
  const channel = doc.querySelector('channel');
  const posts = channel.querySelectorAll('item');
  posts.forEach((post) => {
    const title = post.querySelector('title');
    const description = post.querySelector('description');
    const link = post.querySelector('link');
    const id = _.uniqueId('post_');
    const readyPost = {
      id,
      feedId,
      title: title.textContent,
      description: description.textContent,
      link: link.textContent,
    };
    state.data.posts.push(readyPost);
  });
};

export default (doc, state) => {
  const channel = doc.querySelector('channel');
  const title = channel.querySelector('title');
  const description = channel.querySelector('description');
  const id = state.data.feeds.length + 1;
  const feed = { id, title: title.textContent, description: description.textContent };
  state.data.feeds.push(feed);
  extractPosts(doc, state, id);
};
