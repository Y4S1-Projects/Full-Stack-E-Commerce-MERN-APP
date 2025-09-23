import SummaryApi from '../common';
import { toast } from 'react-toastify';

// Always require accessToken
const addToCart = async (e, id, accessToken) => {
  e?.stopPropagation();
  e?.preventDefault();

  if (!accessToken) {
    toast.error('Not authenticated');
    return { error: true, message: 'No access token' };
  }

  const headers = {
    'content-type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
  const response = await fetch(SummaryApi.addToCartProduct.url, {
    method: SummaryApi.addToCartProduct.method,
    credentials: 'include',
    headers,
    body: JSON.stringify({ productId: id }),
  });

  const responseData = await response.json();

  if (responseData.success) {
    toast.success(responseData.message);
  }

  if (responseData.error) {
    toast.error(responseData.message);
  }

  return responseData;
};

export default addToCart;
