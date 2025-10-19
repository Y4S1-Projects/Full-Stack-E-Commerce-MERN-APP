import { GoogleLogin } from '@react-oauth/google';

import React, { useState } from 'react';
import loginIcons from '../assest/signin.gif';
import { FaEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import imageTobase64 from '../helpers/imageTobase64';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    profilePic: '',
  });
  const navigate = useNavigate();

  // Google signup success handler
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
          // Store only backend JWT for session persistence
          if (typeof window !== 'undefined') {
            const { setJwtSession } = require('../helpers/jwtSession');
            setJwtSession(data.data);
          }
          toast.success('Google signup successful!');
          navigate('/');
        } else {
          toast.error(data.error || 'Google signup failed');
        }
      } catch (err) {
        toast.error('Google signup failed: ' + err.message);
      }
    } else {
      toast.error('Google signup failed: No credential');
    }
  };

  const handleGoogleError = () => {
    toast.error('Google signup failed');
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

  const handleUploadPic = async (e) => {
    const file = e.target.files[0];

    const imagePic = await imageTobase64(file);

    setData((preve) => {
      return {
        ...preve,
        profilePic: imagePic,
      };
    });
  };

  // Accept accessToken as optional param
  const handleSubmit = async (e, accessToken = null) => {
    e.preventDefault();

    if (data.password === data.confirmPassword) {
      const headers = {
        'content-type': 'application/json',
      };
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      const dataResponse = await fetch(SummaryApi.signUP.url, {
        method: SummaryApi.signUP.method,
        headers,
        body: JSON.stringify(data),
      });

      const dataApi = await dataResponse.json();

      if (dataApi.success) {
        toast.success(dataApi.message);
        navigate('/login');
      }

      if (dataApi.error) {
        toast.error(dataApi.message);
      }
    } else {
      toast.error('Please check password and confirm password');
    }
  };

  return (
    <section id="signup">
      <div className="container p-4 mx-auto">
        <div className="w-full max-w-sm p-5 mx-auto bg-white">
          <div className="relative w-20 h-20 mx-auto overflow-hidden rounded-full">
            <div>
              <img src={data.profilePic || loginIcons} alt="login icons" />
            </div>
            <form>
              <label>
                <div className="absolute bottom-0 w-full pt-2 pb-4 text-xs text-center cursor-pointer bg-opacity-80 bg-slate-200">
                  Upload Photo
                </div>
                <input type="file" className="hidden" onChange={handleUploadPic} />
              </label>
            </form>
          </div>

          <form className="flex flex-col gap-2 pt-6" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center w-full my-2">
              <span className="mb-2 font-medium text-gray-500">Or sign up with Google</span>
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} width="100%" useOneTap />
            </div>
            <div className="grid">
              <label>Name : </label>
              <div className="p-2 bg-slate-100">
                <input
                  type="text"
                  placeholder="enter your name"
                  name="name"
                  value={data.name}
                  onChange={handleOnChange}
                  required
                  className="w-full h-full bg-transparent outline-none"
                />
              </div>
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
                  required
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
                  required
                  className="w-full h-full bg-transparent outline-none"
                />
                <div className="text-xl cursor-pointer" onClick={() => setShowPassword((preve) => !preve)}>
                  <span>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                </div>
              </div>
            </div>

            <div>
              <label>Confirm Password : </label>
              <div className="flex p-2 bg-slate-100">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="enter confirm password"
                  value={data.confirmPassword}
                  name="confirmPassword"
                  onChange={handleOnChange}
                  required
                  className="w-full h-full bg-transparent outline-none"
                />

                <div className="text-xl cursor-pointer" onClick={() => setShowConfirmPassword((preve) => !preve)}>
                  <span>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</span>
                </div>
              </div>
            </div>

            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6">
              Sign Up
            </button>
          </form>

          <p className="my-5">
            Already have account ?{' '}
            <Link to={'/login'} className="text-red-600 hover:text-red-700 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
