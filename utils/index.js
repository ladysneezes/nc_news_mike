const timestampToDate = articleData => {
  const copiedArticles = articleData.map(article => {
    let copy = { ...article };
    return copy;
  });
  if (!copiedArticles.length) return copiedArticles;

  const formattedArticles = copiedArticles.map(article => {
    let date = new Date(article.created_at);
    article.created_at = date;
    return article;
  });
  return formattedArticles;
};

const renameKeys = (anArray, oldName, newName) => {
  const updatedKeys = [...anArray];
  if (oldName && newName) {
    updatedKeys.forEach(key => {
      if (key.hasOwnProperty(oldName)) {
        key[newName] = key[oldName];
        delete key[oldName];
      }
    });
  }
  return updatedKeys;
};

const createLookupObj = (refDataArray, key, value) => {
  const lookupObj = {};
  refDataArray.forEach(obj => (lookupObj[obj[key]] = obj[value]));
  return lookupObj;
};

const linkKeys = (arrayOfData, lookup, oldKey, newKey) => {
  const withUpdatedKeys = [...arrayOfData];
  if (withUpdatedKeys.length > 0 && lookup) {
    const arrOfLookupKeys = Object.keys(lookup);
    arrOfLookupKeys.forEach(title => {
      withUpdatedKeys.forEach(comment => {
        if (title === comment[oldKey]) {
          comment[newKey] = lookup[title];
          delete comment[oldKey];
        }
      });
    });
  }
  return withUpdatedKeys;
};

module.exports = { timestampToDate, renameKeys, createLookupObj, linkKeys };
