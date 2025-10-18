const { default: SummaryApi } = require('../common');

// Accept accessToken as optional param; for public usage prefer GET with query
const fetchCategoryWiseProduct = async (category, accessToken = null) => {
  const url = `${SummaryApi.categoryWiseProduct.url}?category=${encodeURIComponent(category)}`;
  const headers = { 'content-type': 'application/json' };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  const dataResponse = await response.json();
  return dataResponse;
};

export default fetchCategoryWiseProduct;
