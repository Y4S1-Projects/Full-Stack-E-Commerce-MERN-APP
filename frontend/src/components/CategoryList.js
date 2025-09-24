import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

const CategoryList = () => {
  const [categoryProduct, setCategoryProduct] = useState([]);
  const [loading, setLoading] = useState(false);

  const categoryLoading = new Array(13).fill(null);

  // Only allow text, no HTML
  const sanitizeInput = (input) => DOMPurify.sanitize(input ?? '', { ALLOWED_TAGS: [] });

  // Optional accessToken supported
  const fetchCategoryProduct = async (accessToken = null) => {
    setLoading(true);
    try {
      const headers = {};
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
      const res = await fetch(SummaryApi.categoryProduct.url, { headers });
      const json = await res.json();
      setCategoryProduct(json?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryProduct();
  }, []);

  return (
    <div className="container p-4 mx-auto">
      <div className="flex items-center justify-between gap-4 overflow-scroll scrollbar-none">
        {loading
          ? categoryLoading.map((_, index) => (
              <div
                className="w-16 h-16 overflow-hidden rounded-full md:w-20 md:h-20 bg-slate-200 animate-pulse"
                key={'categoryLoading' + index}
              />
            ))
          : categoryProduct.map((product) => (
              <Link
                to={`/product-category?category=${encodeURIComponent(product?.category || '')}`}
                className="cursor-pointer"
                key={product?.category}
              >
                <div className="flex items-center justify-center w-16 h-16 p-4 overflow-hidden rounded-full md:w-20 md:h-20 bg-slate-200">
                  <img
                    src={product?.productImage?.[0]}
                    alt={sanitizeInput(product?.category)}
                    className="object-scale-down h-full transition-all mix-blend-multiply hover:scale-125"
                  />
                </div>
                <p className="text-sm text-center capitalize md:text-base">
                  {sanitizeInput(product?.category)}
                </p>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default CategoryList;
