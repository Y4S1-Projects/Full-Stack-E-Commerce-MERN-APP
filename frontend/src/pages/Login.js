import React, { useContext, useState } from 'react';
import loginIcons from '../assest/signin.gif';
import { FaEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import Context from '../context';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);

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
      navigate('/');
      fetchUserDetails();
      fetchUserAddToCart();
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
            <Link to={'/sign-up'} className="text-red-600  hover:text-red-700 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
