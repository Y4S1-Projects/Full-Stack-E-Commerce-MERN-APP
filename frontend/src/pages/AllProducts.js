import React, { useEffect, useState } from 'react';
import UploadProduct from '../components/UploadProduct';
import SummaryApi from '../common';
import AdminProductCard from '../components/AdminProductCard';

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);

  // Accept accessToken as optional param
  const fetchAllProduct = async (accessToken = null) => {
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    const response = await fetch(SummaryApi.allProduct.url, { headers });
    const dataResponse = await response.json();

    console.log('product data', dataResponse);

    setAllProduct(dataResponse?.data || []);
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2 bg-white">
        <h2 className="text-lg font-bold">All Product</h2>
        <button
          className="px-3 py-1 text-red-600 transition-all border-2 border-red-600 rounded-full hover:bg-red-600 hover:text-white "
          onClick={() => setOpenUploadProduct(true)}
        >
          Upload Product
        </button>
      </div>

      {/**all product */}
      <div className="flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll">
        {allProduct.map((product, index) => {
          return <AdminProductCard data={product} key={index + 'allProduct'} fetchdata={fetchAllProduct} />;
        })}
      </div>

      {/**upload prouct component */}
      {openUploadProduct && <UploadProduct onClose={() => setOpenUploadProduct(false)} fetchData={fetchAllProduct} />}
    </div>
  );
};

export default AllProducts;
