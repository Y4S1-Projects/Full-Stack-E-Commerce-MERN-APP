import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SummaryApi from '../common';
import VerticalCard from '../components/VerticalCard';

const SearchProduct = () => {
  const query = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log('query', query.search);

  // Accept accessToken as optional param
  const fetchProduct = async (accessToken = null) => {
    setLoading(true);
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    const response = await fetch(SummaryApi.searchProduct.url + query.search, { headers });
    const dataResponse = await response.json();
    setLoading(false);

    setData(dataResponse.data);
  };

  useEffect(() => {
    fetchProduct();
  }, [query]);

  return (
    <div className="container p-4 mx-auto">
      {loading && <p className="text-lg text-center">Loading ...</p>}

      <p className="my-3 text-lg font-semibold">Search Results : {data.length}</p>

      {data.length === 0 && !loading && <p className="p-4 text-lg text-center bg-white">No Data Found....</p>}

      {data.length !== 0 && !loading && <VerticalCard loading={loading} data={data} />}
    </div>
  );
};

export default SearchProduct;
