import React, { useContext, useState, useEffect } from 'react';
import { isSessionExpired, clearSession } from '../helpers/session';
import { useAuth0 } from '@auth0/auth0-react';
import Logo from './Logo';
import { GrSearch } from 'react-icons/gr';
import { FaRegCircleUser } from 'react-icons/fa6';
import { FaShoppingCart } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';

const Header = () => {
  const user = useSelector((state) => state?.user?.user);
  const { logout } = useAuth0();
  const navigate = useNavigate();
  // Auto-logout if session expired
  useEffect(() => {
    if (user?._id && isSessionExpired()) {
      clearSession();
      logout({ returnTo: window.location.origin });
      navigate('/');
    }
  }, [user, logout, navigate]);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const context = useContext(Context);
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.get('q') || '';
  const [search, setSearch] = useState(searchQuery);

  // Keep search input in sync with URL
  React.useEffect(() => {
    const urlSearch = new URLSearchParams(searchInput?.search);
    setSearch(urlSearch.get('q') || '');
  }, [searchInput.search]);

  // Close menu on logout
  React.useEffect(() => {
    if (!user?._id) setMenuDisplay(false);
  }, [user]);

  // Accept accessToken as optional param
  const handleLogout = async (accessToken = null) => {
    // Always clear session (JWT, Auth0, Google)
    clearSession();
    // Also clear JWT session for all login types
    if (typeof window !== 'undefined') {
      // Defensive: try both helpers if available
      try {
        const { clearJwtSession } = require('../helpers/jwtSession');
        clearJwtSession();
      } catch (e) {
        if (window.localStorage) {
          window.localStorage.removeItem('jwt_token');
          window.localStorage.removeItem('jwt_expiry');
        }
      }
    }
    dispatch(setUserDetails(null));

    // Google credential logic removed; only backend JWT is used for session/API

    // Otherwise, call backend logout (for Auth0/JWT)
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: 'include',
      headers,
    });

    const data = await fetchData.json();

    if (data.success) {
      toast.success(data.message);
      navigate('/');
    }

    if (data.error) {
      toast.error(data.message);
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);

    if (value) {
      navigate(`/search?q=${value}`);
    } else {
      navigate('/search');
    }
  };
  return (
    <header className="fixed z-40 w-full h-16 bg-white shadow-md">
      <div className="container flex items-center justify-between h-full px-4 mx-auto ">
        <div className="">
          <Link to={'/'}>
            <Logo w={90} h={50} />
          </Link>
        </div>

        <div className="items-center justify-between hidden w-full max-w-sm pl-2 border rounded-full lg:flex focus-within:shadow">
          <input
            type="text"
            placeholder="search product here..."
            className="w-full outline-none"
            onChange={handleSearch}
            value={search}
          />
          <div className="text-xl min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white">
            <GrSearch />
          </div>
        </div>

        <div className="flex items-center gap-7">
          <div
            className="relative flex justify-center"
            style={{ border: '2px solid red', background: 'rgba(255,0,0,0.05)' }}
          >
            {user?._id && (
              <div
                className="relative flex justify-center text-3xl cursor-pointer"
                onClick={() => setMenuDisplay((preve) => !preve)}
              >
                {user?.profilePic ? (
                  <img src={user?.profilePic} className="w-10 h-10 rounded-full" alt={user?.name} />
                ) : (
                  <FaRegCircleUser />
                )}
              </div>
            )}

            {menuDisplay && (
              <div className="absolute left-0 right-0 z-50 p-2 bg-white rounded shadow-lg top-14 h-fit min-w-[150px]">
                <nav>
                  {user?.role === ROLE.ADMIN && (
                    <Link
                      to={'/admin-panel/all-products'}
                      className="block p-2 whitespace-nowrap hover:bg-slate-100"
                      onClick={() => setMenuDisplay((preve) => !preve)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  {/* Add more submenu items here if needed */}
                </nav>
              </div>
            )}
          </div>

          {user?._id && (
            <Link to={'/cart'} className="relative text-2xl">
              <span>
                <FaShoppingCart />
              </span>

              <div className="absolute flex items-center justify-center w-5 h-5 p-1 text-white bg-red-600 rounded-full -top-2 -right-3">
                <p className="text-sm">{context?.cartProductCount}</p>
              </div>
            </Link>
          )}

          <div>
            {user?._id ? (
              <button onClick={handleLogout} className="px-3 py-1 text-white bg-red-600 rounded-full hover:bg-red-700">
                Logout
              </button>
            ) : (
              <Link to={'/login'} className="px-3 py-1 text-white bg-red-600 rounded-full hover:bg-red-700">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
