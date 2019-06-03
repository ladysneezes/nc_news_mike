const formatArticles = articleData => {
  const copiedArticles = articleData.map(article => {
    let copy = { ...article };
    return copy;
  });
  if (!copiedArticles.length) return copiedArticles;

  const formattedArticles = copiedArticles.map(article => {
    let date = new Date(article.created_at);
    article.created_at = date.toString();
    return article;
  });
  return formattedArticles;
};

module.exports = formatArticles;
