const { default: SummaryApi } = require('../common');

// Accept accessToken as optional param
const fetchCategoryWiseProduct = async (category, accessToken = null) => {
  const headers = {
    'content-type': 'application/json',
  };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  const response = await fetch(SummaryApi.categoryWiseProduct.url, {
    method: SummaryApi.categoryWiseProduct.method,
    headers,
    body: JSON.stringify({
      category: category,
    }),
  });

  const dataResponse = await response.json();
  return dataResponse;
};

export default fetchCategoryWiseProduct;
