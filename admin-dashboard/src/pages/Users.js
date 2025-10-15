import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://jewelly-store-mern-app-production.up.railway.app';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [actionLoading, setActionLoading] = useState(null);

  const { currentUser, logout, isAuthenticated } = useAuth();

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      
      if (!isAuthenticated) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        params: {
          page: page,
          limit: 10
        }
      });
      
      console.log('Users data received:', response.data);
      
      if (response.data.success) {
        setUsers(response.data.users || []);
        setTotalPages(response.data.totalPages || 1);
        setCurrentPage(response.data.currentPage || 1);
        setTotalUsers(response.data.totalUsers || 0);
      } else {
        throw new Error(response.data.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      
      if (err.response?.status === 401) {
        logout();
        setError('Session expired. Please log in again.');
      } else if (err.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError(err.response?.data?.message || 'Failed to load users. Please try again.');
        
        // Mock data for development
        setUsers([
          {
            _id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'user',
            isActive: true,
            createdAt: new Date(),
            orders: 5
          },
          {
            _id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'admin',
            isActive: true,
            createdAt: new Date(),
            orders: 12
          }
        ]);
        setTotalUsers(2);
        setTotalPages(1);
      }
    } finally {
      setLoading(false);
    }
  };

  const makeApiCall = async (url, method = 'get', data = null) => {
    if (!isAuthenticated) {
      setError('Authentication required. Please log in again.');
      return null;
    }

    try {
      const config = { 
        method, 
        url: `${API_BASE_URL}${url}`,
        data 
      };

      const response = await axios(config);
      return response.data;
    } catch (err) {
      console.error('API call error:', err);
      
      if (err.response?.status === 401) {
        logout();
        setError('Session expired. Please log in again.');
      } else {
        setError(err.response?.data?.message || err.message || 'Request failed');
      }
      return null;
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    setActionLoading(userId);
    const result = await makeApiCall(`/api/admin/users/${userId}/role`, 'put', { role: newRole });
    
    if (result) {
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
    }
    setActionLoading(null);
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    setActionLoading(userId);
    const result = await makeApiCall(`/api/admin/users/${userId}/status`, 'put', { 
      isActive: !currentStatus 
    });
    
    if (result) {
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isActive: !currentStatus } : user
      ));
    }
    setActionLoading(null);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setActionLoading(userId);
    const result = await makeApiCall(`/api/admin/users/${userId}`, 'delete');
    
    if (result) {
      setUsers(users.filter(user => user._id !== userId));
      setTotalUsers(prev => prev - 1);
    }
    setActionLoading(null);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchUsers(nextPage);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchUsers(prevPage);
    }
  };

  const handleRetry = () => {
    setError('');
    fetchUsers();
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  if (loading && users.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 md:ml-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 md:ml-64 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to access user management.</p>
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen overflow-y-auto">
        <div className="p-4 md:p-6">
          {/* Mobile header spacing */}
          <div className="md:hidden h-16"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">{totalUsers} users found</div>
              <button
                onClick={() => fetchUsers()}
                className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
              >
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={handleRetry}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}

          {users.length === 0 && !error ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500">No users found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orders
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(user => (
                      <tr key={user._id} className="hover:bg-gray-50 transition duration-200">
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white text-sm font-bold">
                                {user.name?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="md:hidden text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-4 py-4 text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                            disabled={actionLoading === user._id || user._id === currentUser?._id}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              user.role === 'admin' 
                                ? 'bg-red-100 text-red-800 border-red-200' 
                                : 'bg-green-100 text-green-800 border-green-200'
                            } ${actionLoading === user._id ? 'opacity-50' : ''}`}
                          >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                        </td>
                        <td className="hidden lg:table-cell px-4 py-4 text-sm text-gray-500">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="hidden md:table-cell px-4 py-4 text-sm text-gray-900">
                          {user.orders || 0} orders
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleStatusToggle(user._id, user.isActive)}
                            disabled={actionLoading === user._id || user._id === currentUser?._id}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.isActive 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            } ${actionLoading === user._id ? 'opacity-50' : ''}`}
                          >
                            {user.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            disabled={actionLoading === user._id || (user.orders > 0) || user._id === currentUser?._id}
                            className={`text-red-600 hover:text-red-900 ${
                              (actionLoading === user._id || user.orders > 0 || user._id === currentUser?._id) 
                                ? 'opacity-50 cursor-not-allowed' 
                                : ''
                            }`}
                            title={
                              user._id === currentUser?._id ? "Cannot delete yourself" :
                              user.orders > 0 ? "Cannot delete user with orders" : "Delete user"
                            }
                          >
                            {actionLoading === user._id ? '...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between items-center">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === 1 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Previous
                    </button>
                    <div className="text-sm text-gray-700">
                      Page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </div>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === totalPages 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Users;