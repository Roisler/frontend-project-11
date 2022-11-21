import _ from 'lodash';

const addPosts = (data, state, feedId) => {
  const newData = _.cloneDeep(data);
  const { posts } = newData;
  posts.forEach((el) => {
    const post = el;
    const currentPost = _.find(state.data.posts, (elem) => elem.link === post.link);
    if (currentPost) {
      return;
    }
    post.id = _.uniqueId('post_');
    post.feedId = feedId;
    state.uiState.push({ id: post.id, viewed: false });
    state.data.posts.push(post);
  });
};

export default (data, state) => {
  const newData = _.cloneDeep(data);
  const { feed } = newData;
  // проверяем, нет ли уже такого feed
  const currentFeed = _.find(state.data.feeds, (el) => el.title === feed.title);
  if (currentFeed) {
    addPosts(data, state, currentFeed.id);
  } else {
    feed.id = state.data.feeds.length + 1;
    state.data.feeds.push(feed);
    addPosts(data, state, feed.id);
  }
};
