import _ from 'lodash';

const extractPosts = (doc, state, feedId) => {
  const channel = doc.querySelector('channel');
  const posts = channel.querySelectorAll('item');
  posts.forEach((post) => {
    const title = post.querySelector('title');
    const description = post.querySelector('description');
    const link = post.querySelector('link');
    const ma = state.data.posts.map((pos) => pos.link);
    if (ma.includes(link.textContent)) {
      return;
    }
    const id = _.uniqueId('post_');
    const readyPost = {
      id,
      feedId,
      title: title.textContent,
      description: description.textContent,
      link: link.textContent,
      viewed: false,
    };
    state.data.posts.push(readyPost);
  });
};

export default (doc, state, path) => {
  const channel = doc.querySelector('channel');
  const title = channel.querySelector('title');
  const description = channel.querySelector('description');
  // проверяем, нет ли уже такого feed
  const index = _.findIndex(state.data.feeds, (feed) => feed.link === path);
  if (index !== -1) {
    const { id } = state.data.feeds.filter((feed) => feed.link === path)[0]; // ищем текущий id feed
    extractPosts(doc, state, id);
  } else {
    const id = state.data.feeds.length + 1;
    const feed = {
      id,
      link: path,
      title: title.textContent,
      description: description.textContent,
    };
    state.data.feeds.push(feed);
    extractPosts(doc, state, id);
  }
};
