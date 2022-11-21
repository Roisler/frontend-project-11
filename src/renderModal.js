export default (modal, post) => {
  const modalTitle = modal.querySelector('.modal-title');
  modalTitle.textContent = post.title;

  const modalBody = modal.querySelector('.modal-body');
  modalBody.textContent = post.description;

  const buttonFull = modal.querySelector('.full-article');
  buttonFull.setAttribute('href', post.link);
};
