import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000' || 'https://jewelly-store-mern-app-production.up.railway.app/';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusIcons = {
  pending: '⏳',
  processing: '🔄',
  shipped: '🚚',
  delivered: '✅',
  cancelled: '❌'
};

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800'
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    page: 1,
    limit: 10
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [filters.status, filters.page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Use admin endpoint for orders
      const response = await axios.get(`${API_BASE_URL}/api/admin/orders`, {
        params: {
          status: filters.status !== 'all' ? filters.status : undefined,
          page: filters.page,
          limit: filters.limit
        }
      });

      if (response.data.orders) {
        setOrders(response.data.orders);
      } else {
        throw new Error(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders: ' + (error.response?.data?.message || error.message));
      
      // Mock data for development
      setOrders([
        {
          _id: '1',
          orderNumber: 'ORD-001',
          user: { name: 'John Doe', email: 'john@example.com' },
          items: [
            { product: { name: 'Diamond Ring' }, quantity: 1 },
            { product: { name: 'Gold Chain' }, quantity: 2 }
          ],
          totalAmount: 299.99,
          orderStatus: 'pending',
          paymentStatus: 'completed',
          shippingAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          },
          createdAt: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/orders/${orderId}/status`,
        { orderStatus: newStatus }
      );

      if (response.data.success) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        ));
        alert('Order status updated successfully!');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status: ' + (error.response?.data?.message || error.message));
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getOrderTotalItems = (order) => {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getOrderStatusButtons = (order) => {
    const statusFlow = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: []
    };

    return statusFlow[order.orderStatus] || [];
  };

  const formatAddress = (order) => {
    if (!order.shippingAddress) return 'No address';
    const { city, state } = order.shippingAddress;
    return `${city}, ${state}`;
  };

  const getFullAddress = (order) => {
    if (!order.shippingAddress) return 'No address available';
    const { street, city, state, zipCode, country } = order.shippingAddress;
    return `${street}, ${city}, ${state} ${zipCode}, ${country}`;
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 md:ml-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
            <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
            <div className="flex items-center space-x-4">
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value, page: 1})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="text-sm text-gray-500">{orders.length} orders</div>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50 transition duration-200">
                      <td className="px-4 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getOrderTotalItems(order)} items
                          </div>
                          <div className="md:hidden text-xs text-gray-400">
                            {order.user?.name}
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-4 py-4">
                        <div className="text-sm text-gray-900">{order.user?.name}</div>
                        <div className="text-sm text-gray-500">{order.user?.email}</div>
                      </td>
                      <td className="hidden lg:table-cell px-4 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        ${order.totalAmount?.toFixed(2)}
                      </td>
                      <td className="hidden lg:table-cell px-4 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-sm text-gray-600 hover:text-blue-600 transition duration-200 text-left"
                        >
                          {formatAddress(order)}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus]}`}>
                          <span className="mr-1">{statusIcons[order.orderStatus]}</span>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-4 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${paymentStatusColors[order.paymentStatus]}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium space-x-1">
                        {getOrderStatusButtons(order).map(status => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(order._id, status)}
                            disabled={updatingOrder === order._id}
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              status === 'cancelled' 
                                ? 'text-red-600 hover:text-red-800 hover:bg-red-50' 
                                : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {updatingOrder === order._id ? '...' : status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {orders.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500">There are no orders matching your current filters.</p>
              </div>
            )}
          </div>

          {/* Shipping Address Modal */}
          {selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Shipping Address
                    </h3>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-gray-400 hover:text-gray-600 transition duration-200"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Street</label>
                      <p className="text-gray-900">{selectedOrder.shippingAddress.street}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">City</label>
                        <p className="text-gray-900">{selectedOrder.shippingAddress.city}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">State</label>
                        <p className="text-gray-900">{selectedOrder.shippingAddress.state}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">ZIP Code</label>
                        <p className="text-gray-900">{selectedOrder.shippingAddress.zipCode}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Country</label>
                        <p className="text-gray-900">{selectedOrder.shippingAddress.country}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => setFilters({...filters, page: Math.max(1, filters.page - 1)})}
              disabled={filters.page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {filters.page}
            </span>
            <button
              onClick={() => setFilters({...filters, page: filters.page + 1})}
              disabled={orders.length < filters.limit}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Orders;