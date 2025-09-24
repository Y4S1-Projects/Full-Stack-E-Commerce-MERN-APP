import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaRegCircleUser } from 'react-icons/fa6';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ROLE from '../common/role';

const AdminPanel = () => {
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== ROLE.ADMIN) {
      navigate('/');
    }
  }, [user]);

  return (
    <div className="min-h-[calc(100vh-120px)] md:flex">
      <aside className="w-full min-h-full bg-white max-w-60 customShadow">
        <div className="flex flex-col items-center justify-center h-32">
          <div className="relative flex justify-center text-5xl cursor-pointer">
            {user?.profilePic ? (
              <img src={user?.profilePic} className="w-20 h-20 rounded-full" alt={user?.name} />
            ) : (
              <FaRegCircleUser />
            )}
          </div>
          <p className="text-lg font-semibold capitalize">{user?.name}</p>
          <p className="text-sm">{user?.role}</p>
        </div>

        {/***navigation */}
        <div>
          <nav className="grid p-4">
            <Link to={'all-users'} className="px-2 py-1 hover:bg-slate-100">
              All Users
            </Link>
            <Link to={'all-products'} className="px-2 py-1 hover:bg-slate-100">
              All product
            </Link>
          </nav>
        </div>
      </aside>

      <main className="w-full h-full p-2">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
