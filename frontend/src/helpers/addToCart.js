import SummaryApi from '../common';
import { toast } from 'react-toastify';

// Support cookie-based auth and optional accessToken
const addToCart = async (e, id, accessToken) => {
  e?.stopPropagation();
  e?.preventDefault();

  const headers = {
    'content-type': 'application/json',
  };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
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
