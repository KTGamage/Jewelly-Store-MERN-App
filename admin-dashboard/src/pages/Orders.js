// import React, { useState, useEffect } from 'react';
// import Sidebar from '../components/Sidebar';

// const statusColors = {
//   pending: 'bg-yellow-100 text-yellow-800',
//   processing: 'bg-blue-100 text-blue-800',
//   shipped: 'bg-purple-100 text-purple-800',
//   delivered: 'bg-green-100 text-green-800',
//   cancelled: 'bg-red-100 text-red-800'
// };

// const statusIcons = {
//   pending: '⏳',
//   processing: '🔄',
//   shipped: '🚚',
//   delivered: '✅',
//   cancelled: '❌'
// };

// function Orders() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Mock data - replace with actual API calls
//   useEffect(() => {
//     const mockOrders = [
//       {
//         _id: '1',
//         user: { name: 'John Doe' },
//         createdAt: new Date(),
//         totalAmount: 299.99,
//         status: 'pending',
//         items: 3
//       },
//       {
//         _id: '2',
//         user: { name: 'Sarah Smith' },
//         createdAt: new Date(Date.now() - 86400000),
//         totalAmount: 159.50,
//         status: 'processing',
//         items: 2
//       },
//       {
//         _id: '3',
//         user: { name: 'Mike Johnson' },
//         createdAt: new Date(Date.now() - 172800000),
//         totalAmount: 599.99,
//         status: 'shipped',
//         items: 1
//       },
//       {
//         _id: '4',
//         user: { name: 'Emma Wilson' },
//         createdAt: new Date(Date.now() - 259200000),
//         totalAmount: 199.99,
//         status: 'delivered',
//         items: 4
//       }
//     ];
    
//     setOrders(mockOrders);
//     setLoading(false);
//   }, []);

//   const updateOrderStatus = async (orderId, status) => {
//     // Mock update - replace with actual API call
//     setOrders(orders.map(order => 
//       order._id === orderId ? { ...order, status } : order
//     ));
//   };

//   if (loading) {
//     return (
//       <div className="flex h-screen bg-gray-100">
//         <Sidebar />
//         <div className="flex-1 flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Sidebar />
//       <main className="flex-1 overflow-y-auto">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
//             <div className="text-sm text-gray-500">{orders.length} orders found</div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Order Details
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Customer
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Date
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Amount
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {orders.map(order => (
//                     <tr key={order._id} className="hover:bg-gray-50 transition duration-200">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">Order #{order._id}</div>
//                           <div className="text-sm text-gray-500">{order.items} items</div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{order.user?.name}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {new Date(order.createdAt).toLocaleDateString()}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         ${order.totalAmount}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
//                           <span className="mr-1">{statusIcons[order.status]}</span>
//                           {order.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                         <button
//                           onClick={() => updateOrderStatus(order._id, 'processing')}
//                           disabled={order.status !== 'pending'}
//                           className="text-blue-600 hover:text-blue-900 disabled:text-gray-400 disabled:cursor-not-allowed"
//                         >
//                           Process
//                         </button>
//                         <button
//                           onClick={() => updateOrderStatus(order._id, 'shipped')}
//                           disabled={order.status !== 'processing'}
//                           className="text-green-600 hover:text-green-900 disabled:text-gray-400 disabled:cursor-not-allowed"
//                         >
//                           Ship
//                         </button>
//                         <button
//                           onClick={() => updateOrderStatus(order._id, 'delivered')}
//                           disabled={order.status !== 'shipped'}
//                           className="text-purple-600 hover:text-purple-900 disabled:text-gray-400 disabled:cursor-not-allowed"
//                         >
//                           Deliver
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default Orders;


import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

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
  const [filters, setFilters] = useState({
    status: 'all',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    fetchOrders();
  }, [filters.status, filters.page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/orders?status=${filters.status}&page=${filters.page}&limit=${filters.limit}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to fetch orders: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/orders/${orderId}/status`, 
        { orderStatus: newStatus },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
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
      alert('Failed to update order status: ' + error.message);
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

  if (loading && orders.length === 0) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
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
              <div className="text-sm text-gray-500">{orders.length} orders found</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50 transition duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getOrderTotalItems(order)} items
                          </div>
                          {order.items.slice(0, 2).map((item, index) => (
                            <div key={index} className="text-xs text-gray-400 truncate">
                              {item.product?.name}
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-xs text-gray-400">
                              +{order.items.length - 2} more items
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.user?.name}</div>
                        <div className="text-sm text-gray-500">{order.user?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                        <div className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${order.totalAmount?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus]}`}>
                          <span className="mr-1">{statusIcons[order.orderStatus]}</span>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${paymentStatusColors[order.paymentStatus]}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {getOrderStatusButtons(order).map(status => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(order._id, status)}
                            disabled={updatingOrder === order._id}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              status === 'cancelled' 
                                ? 'text-red-600 hover:text-red-800 hover:bg-red-50' 
                                : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {updatingOrder === order._id ? '...' : status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                        {order.orderStatus === 'delivered' && (
                          <span className="text-green-600 text-xs">Completed</span>
                        )}
                        {order.orderStatus === 'cancelled' && (
                          <span className="text-red-600 text-xs">Cancelled</span>
                        )}
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
