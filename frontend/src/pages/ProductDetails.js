import React, { useCallback, useContext, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useNavigate, useParams } from 'react-router-dom';
import SummaryApi from '../common';
import { FaStar, FaStarHalf } from 'react-icons/fa';

import displayINRCurrency from '../helpers/displayCurrency';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import addToCart from '../helpers/addToCart';
import Context from '../context';

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: '',
    brandName: '',
    category: '',
    productImage: [],
    description: '',
    price: '',
    sellingPrice: '',
    _id: '',
  });

  const params = useParams();
  const [loading, setLoading] = useState(true);
  const productImageListLoading = new Array(4).fill(null);
  const [activeImage, setActiveImage] = useState('');

  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({ x: 0, y: 0 });
  const [zoomImage, setZoomImage] = useState(false);

  const { fetchUserAddToCart } = useContext(Context);
  const navigate = useNavigate();

  // Sanitize any user/content text (no HTML allowed)
  const sanitizeText = (text) => DOMPurify.sanitize(text || '', { ALLOWED_TAGS: [] });

  // Optional accessToken header is supported (preserves your earlier intent)
  const fetchProductDetails = async (accessToken = null) => {
    setLoading(true);
    try {
      const headers = { 'content-type': 'application/json' };
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

      const response = await fetch(SummaryApi.productDetails.url, {
        method: SummaryApi.productDetails.method,
        headers,
        body: JSON.stringify({ productId: params?.id }),
      });

      const dataResponse = await response.json();
      const item = dataResponse?.data || {};
      setData(item);
      setActiveImage(item?.productImage?.[0] || '');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const handleMouseEnterProduct = (imageURL) => setActiveImage(imageURL);

  const handleZoomImage = useCallback((e) => {
    setZoomImage(true);
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setZoomImageCoordinate({ x, y });
  }, []);

  const handleLeaveImageZoom = () => setZoomImage(false);

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const handleBuyProduct = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
    navigate('/cart');
  };

  return (
    <div className="container p-4 mx-auto">
      <div className="min-h-[200px] flex flex-col lg:flex-row gap-4">
        {/* Product image & thumbnails */}
        <div className="flex flex-col gap-4 h-96 lg:flex-row-reverse">
          <div className="relative p-2 bg-slate-200 h-[300px] w-[300px] lg:h-96 lg:w-96">
            {activeImage ? (
              <img
                src={activeImage}
                alt="Selected product"
                className="object-scale-down w-full h-full mix-blend-multiply"
                onMouseMove={handleZoomImage}
                onMouseLeave={handleLeaveImageZoom}
              />
            ) : (
              <div className="w-full h-full animate-pulse bg-slate-300" />
            )}

            {/* Zoom panel */}
            {zoomImage && activeImage && (
              <div className="hidden lg:block absolute min-w-[500px] min-h-[400px] overflow-hidden bg-slate-200 p-1 -right-[510px] top-0">
                <div
                  className="w-full h-full min-h-[400px] min-w-[500px] mix-blend-multiply scale-150"
                  style={{
                    backgroundImage: `url(${activeImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`,
                  }}
                />
              </div>
            )}
          </div>

          <div className="h-full">
            {loading ? (
              <div className="flex h-full gap-2 overflow-scroll lg:flex-col scrollbar-none">
                {productImageListLoading.map((_, index) => (
                  <div key={`loadingImage-${index}`} className="w-20 h-20 rounded bg-slate-200 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="flex h-full gap-2 overflow-scroll lg:flex-col scrollbar-none">
                {data?.productImage?.map((imgURL) => (
                  <div key={imgURL} className="w-20 h-20 p-1 rounded bg-slate-200">
                    <img
                      src={imgURL}
                      alt="Product thumbnail"
                      className="object-scale-down w-full h-full cursor-pointer mix-blend-multiply"
                      onMouseEnter={() => handleMouseEnterProduct(imgURL)}
                      onClick={() => handleMouseEnterProduct(imgURL)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product details */}
        {loading ? (
          <div className="grid w-full gap-1">
            <p className="inline-block w-full h-6 rounded-full bg-slate-200 animate-pulse lg:h-8" />
            <h2 className="w-full h-6 text-2xl font-medium lg:text-4xl lg:h-8 bg-slate-200 animate-pulse" />
            <p className="capitalize text-slate-400 bg-slate-200 min-w-[100px] animate-pulse h-6 lg:h-8 w-full" />
            <div className="flex items-center w-full h-6 gap-1 text-red-600 bg-slate-200 lg:h-8 animate-pulse" />
            <div className="flex items-center w-full h-6 gap-2 my-1 text-2xl font-medium lg:text-3xl lg:h-8 animate-pulse">
              <p className="w-full text-red-600 bg-slate-200" />
              <p className="w-full line-through text-slate-400 bg-slate-200" />
            </div>
            <div className="flex items-center w-full gap-3 my-2">
              <button className="w-full h-6 rounded lg:h-8 bg-slate-200 animate-pulse" />
              <button className="w-full h-6 rounded lg:h-8 bg-slate-200 animate-pulse" />
            </div>
            <div className="w-full">
              <p className="w-full h-6 my-1 font-medium rounded text-slate-600 lg:h-8 bg-slate-200 animate-pulse" />
              <p className="w-full h-10 rounded bg-slate-200 animate-pulse lg:h-12" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <p className="inline-block px-2 text-red-600 bg-red-200 rounded-full w-fit">
              {sanitizeText(data?.brandName)}
            </p>
            <h2 className="text-2xl font-medium lg:text-4xl">{sanitizeText(data?.productName)}</h2>
            <p className="capitalize text-slate-400">{sanitizeText(data?.category)}</p>

            <div className="flex items-center gap-1 text-red-600">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStarHalf />
            </div>

            <div className="flex items-center gap-2 my-1 text-2xl font-medium lg:text-3xl">
              <p className="text-red-600">{displayINRCurrency(data?.sellingPrice)}</p>
              <p className="line-through text-slate-400">{displayINRCurrency(data?.price)}</p>
            </div>

            <div className="flex items-center gap-3 my-2">
              <button
                className="border-2 border-red-600 rounded px-3 py-1 min-w-[120px] text-red-600 font-medium hover:bg-red-600 hover:text-white"
                onClick={(e) => handleBuyProduct(e, data?._id)}
              >
                Buy
              </button>
              <button
                className="border-2 border-red-600 rounded px-3 py-1 min-w-[120px] font-medium text-white bg-red-600 hover:text-red-600 hover:bg-white"
                onClick={(e) => handleAddToCart(e, data?._id)}
              >
                Add To Cart
              </button>
            </div>

            <div>
              <p className="my-1 font-medium text-slate-600">Description :</p>
              <p>{sanitizeText(data?.description)}</p>
            </div>
          </div>
        )}
      </div>

      {data?.category && (
        <CategoryWiseProductDisplay category={data.category} heading="Recommended Product" />
      )}
    </div>
  );
};

export default ProductDetails;
