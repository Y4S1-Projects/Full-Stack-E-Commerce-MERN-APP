import logo from './logo.svg';
import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';

function App() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const dispatch = useDispatch();
  const [cartProductCount, setCartProductCount] = useState(0);

  // Accept accessToken as optional param
  const fetchUserDetails = async (accessToken = null) => {
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    try {
      const dataResponse = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: 'include',
        headers,
      });
      // Check if response is JSON
      const contentType = dataResponse.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const dataApi = await dataResponse.json();
        if (dataApi.success) {
          dispatch(setUserDetails(dataApi.data));
        }
      } else {
        // Not JSON, likely an error page
        // Optionally handle error (e.g. show login prompt)
      }
    } catch (err) {
      // Optionally handle fetch error
    }
  };

  const fetchUserAddToCart = async (accessToken = null) => {
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    try {
      const dataResponse = await fetch(SummaryApi.addToCartProductCount.url, {
        method: SummaryApi.addToCartProductCount.method,
        credentials: 'include',
        headers,
      });
      // Check if response is JSON
      const contentType = dataResponse.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const dataApi = await dataResponse.json();
        setCartProductCount(dataApi?.data?.count);
      } else {
        // Not JSON, likely an error page
        // Optionally handle error (e.g. show login prompt)
      }
    } catch (err) {
      // Optionally handle fetch error
    }
  };

  useEffect(() => {
    const fetchProtectedData = async () => {
      if (isAuthenticated) {
        try {
          const accessToken = await getAccessTokenSilently();
          await fetchUserDetails(accessToken);
          await fetchUserAddToCart(accessToken);
        } catch (err) {
          // Optionally handle token errors
        }
      }
      // If not authenticated, do not call protected endpoints
    };
    fetchProtectedData();
  }, [isAuthenticated, getAccessTokenSilently]);
  return (
    <>
      <Context.Provider
        value={{
          fetchUserDetails, // user detail fetch
          cartProductCount, // current user add to cart product count,
          fetchUserAddToCart,
        }}
      >
        <ToastContainer position="top-center" />

        <Header />
        <main className="min-h-[calc(100vh-120px)] pt-16">
          <Outlet />
        </main>
        <Footer />
      </Context.Provider>
    </>
  );
}

export default App;
