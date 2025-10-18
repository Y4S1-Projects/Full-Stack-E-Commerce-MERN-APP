import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import moment from 'moment';
import { MdModeEdit } from 'react-icons/md';
import ChangeUserRole from '../components/ChangeUserRole';

const AllUsers = () => {
  const [allUser, setAllUsers] = useState([]);
  const [openUpdateRole, setOpenUpdateRole] = useState(false);
  const [updateUserDetails, setUpdateUserDetails] = useState({
    email: '',
    name: '',
    role: '',
    _id: '',
  });

  const sanitizeText = (text) => DOMPurify.sanitize(text ?? '', { ALLOWED_TAGS: [] });

  // Optional accessToken supported
  const fetchAllUsers = async (accessToken = null) => {
    try {
      const headers = {};
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
      const res = await fetch(SummaryApi.allUser.url, {
        method: SummaryApi.allUser.method,
        credentials: 'include',
        headers,
      });
      const json = await res.json();

      if (json?.success) setAllUsers(json.data || []);
      if (json?.error) toast.error(json?.message || 'Failed to fetch users');
    } catch {
      toast.error('Network error while fetching users');
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className="pb-4 bg-white">
      <table className="w-full userTable">
        <thead>
          <tr className="text-white bg-black">
            <th>Sr.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {allUser.map((el, index) => (
            <tr key={el?._id || index}>
              <td>{index + 1}</td>
              <td>{sanitizeText(el?.name)}</td>
              <td>{sanitizeText(el?.email)}</td>
              <td>{sanitizeText(el?.role)}</td>
              <td>{el?.createdAt ? moment(el.createdAt).format('LL') : '-'}</td>
              <td>
                <button
                  className="p-2 bg-green-100 rounded-full cursor-pointer hover:bg-green-500 hover:text-white"
                  onClick={() => {
                    setUpdateUserDetails(el);
                    setOpenUpdateRole(true);
                  }}
                  title="Edit role"
                  aria-label="Edit role"
                >
                  <MdModeEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openUpdateRole && (
        <ChangeUserRole
          onClose={() => setOpenUpdateRole(false)}
          name={updateUserDetails.name}
          email={updateUserDetails.email}
          role={updateUserDetails.role}
          userId={updateUserDetails._id}
          callFunc={fetchAllUsers}
        />
      )}
    </div>
  );
};

export default AllUsers;
