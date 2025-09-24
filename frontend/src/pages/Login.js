import React, { useContext, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

import loginIcons from '../assest/signin.gif';
import { FaEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import Context from '../context';
import { setJwtSession } from '../helpers/jwtSession';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);

  // Google login success handler
  const handleGoogleSuccess = async (credentialResponse) => {
    if (credentialResponse.credential) {
      try {
        // Send credential to backend for verification/session
        const res = await fetch(SummaryApi.googleLogin.url, {
          method: SummaryApi.googleLogin.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: credentialResponse.credential }),
        });
        const data = await res.json();
        if (data.success && data.data) {
          setJwtSession(data.data); // Store only backend JWT
          await fetchUserDetails(data.data);
          await fetchUserAddToCart(data.data);
          toast.success('Google login successful!');
          navigate('/');
        } else {
          toast.error(data.error || 'Google login failed');
        }
      } catch (err) {
        toast.error('Google login failed: ' + err.message);
      }
    } else {
      toast.error('Google login failed: No credential');
    }
  };

  const handleGoogleError = () => {
    toast.error('Google login failed');
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  // Accept accessToken as optional param
  const handleSubmit = async (e, accessToken = null) => {
    e.preventDefault();

    const headers = {
      'content-type': 'application/json',
    };
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    const dataResponse = await fetch(SummaryApi.signIn.url, {
      method: SummaryApi.signIn.method,
      credentials: 'include',
      headers,
      body: JSON.stringify(data),
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      toast.success(dataApi.message);
      // Use returned JWT token to fetch user details and cart count
      const token = dataApi.data;
      setJwtSession(token); // Store JWT in localStorage for session persistence
      await fetchUserDetails(token);
      await fetchUserAddToCart(token);
      navigate('/');
    }

    if (dataApi.error) {
      toast.error(dataApi.message);
    }
  };

  console.log('data login', data);

  return (
    <section id="login">
      <div className="container p-4 mx-auto">
        <div className="w-full max-w-sm p-5 mx-auto bg-white">
          <div className="w-20 h-20 mx-auto">
            <img src={loginIcons} alt="login icons" />
          </div>

          <form className="flex flex-col gap-2 pt-6" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center w-full my-2">
              <span className="mb-2 font-medium text-gray-500">Or login with Google</span>
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} width="100%" />
            </div>
            <div className="grid">
              <label>Email : </label>
              <div className="p-2 bg-slate-100">
                <input
                  type="email"
                  placeholder="enter email"
                  name="email"
                  value={data.email}
                  onChange={handleOnChange}
                  className="w-full h-full bg-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label>Password : </label>
              <div className="flex p-2 bg-slate-100">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="enter password"
                  value={data.password}
                  name="password"
                  onChange={handleOnChange}
                  className="w-full h-full bg-transparent outline-none"
                />
                <div className="text-xl cursor-pointer" onClick={() => setShowPassword((preve) => !preve)}>
                  <span>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                </div>
              </div>
              <Link to={'/forgot-password'} className="block ml-auto w-fit hover:underline hover:text-red-600">
                Forgot password ?
              </Link>
            </div>

            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6">
              Login
            </button>
          </form>

          <p className="my-5">
            Don't have account ?{' '}
            <Link to={'/sign-up'} className="text-red-600 hover:text-red-700 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
