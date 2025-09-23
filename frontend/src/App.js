import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setSessionExpiry, isSessionExpired, clearSession } from './helpers/session';
import { getJwtSession, isJwtSessionExpired, clearJwtSession } from './helpers/jwtSession';
import { useAuth0 } from '@auth0/auth0-react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';

function App() {
  const { getAccessTokenSilently, isAuthenticated, logout } = useAuth0();
  const dispatch = useDispatch();
  const [cartProductCount, setCartProductCount] = useState(0);
  const navigate = useNavigate();

  // Always require accessToken for protected endpoints
  const fetchUserDetails = async (accessToken) => {
    if (!accessToken) return;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    try {
      const dataResponse = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: 'include',
        headers,
      });
      const contentType = dataResponse.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const dataApi = await dataResponse.json();
        if (dataApi.success) {
          dispatch(setUserDetails(dataApi.data));
        }
      }
    } catch (err) {
      // Optionally handle fetch error
    }
  };

  const fetchUserAddToCart = async (accessToken) => {
    if (!accessToken) return;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    try {
      const dataResponse = await fetch(SummaryApi.addToCartProductCount.url, {
        method: SummaryApi.addToCartProductCount.method,
        credentials: 'include',
        headers,
      });
      const contentType = dataResponse.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const dataApi = await dataResponse.json();
        setCartProductCount(dataApi?.data?.count);
      }
    } catch (err) {
      // Optionally handle fetch error
    }
  };

  // Session expiry logic
  useEffect(() => {
    // Auth0 session logic (if using Auth0)
    if (isAuthenticated) {
      setSessionExpiry();
    } else if (isSessionExpired()) {
      clearSession();
      logout({ returnTo: window.location.origin });
      navigate('/');
    }

    // Browser JWT session logic
    const jwt = getJwtSession();
    if (jwt && !isJwtSessionExpired()) {
      // Restore user state from JWT
      fetchUserDetails(jwt);
      fetchUserAddToCart(jwt);
    } else if (isJwtSessionExpired()) {
      clearJwtSession();
      dispatch(setUserDetails(null));
    }

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
    };
    fetchProtectedData();
    // eslint-disable-next-line
  }, [isAuthenticated, getAccessTokenSilently, logout, navigate]);
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
