export default (data) => {
  const initParser = new DOMParser();
  const doc = initParser.parseFromString(data, 'application/xml');
  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    throw new Error('errors.parsing_error');
  }
  return doc;
};
