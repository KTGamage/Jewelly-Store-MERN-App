// import React, { useState, useEffect } from 'react';

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
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
//         <div className="text-sm text-gray-500">{orders.length} orders found</div>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Order Details
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Customer
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Amount
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {orders.map(order => (
//                 <tr key={order._id} className="hover:bg-gray-50 transition duration-200">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div>
//                       <div className="text-sm font-medium text-gray-900">Order #{order._id}</div>
//                       <div className="text-sm text-gray-500">{order.items} items</div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">{order.user?.name}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(order.createdAt).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     ${order.totalAmount}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
//                       <span className="mr-1">{statusIcons[order.status]}</span>
//                       {order.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                     <button
//                       onClick={() => updateOrderStatus(order._id, 'processing')}
//                       disabled={order.status !== 'pending'}
//                       className="text-blue-600 hover:text-blue-900 disabled:text-gray-400 disabled:cursor-not-allowed"
//                     >
//                       Process
//                     </button>
//                     <button
//                       onClick={() => updateOrderStatus(order._id, 'shipped')}
//                       disabled={order.status !== 'processing'}
//                       className="text-green-600 hover:text-green-900 disabled:text-gray-400 disabled:cursor-not-allowed"
//                     >
//                       Ship
//                     </button>
//                     <button
//                       onClick={() => updateOrderStatus(order._id, 'delivered')}
//                       disabled={order.status !== 'shipped'}
//                       className="text-purple-600 hover:text-purple-900 disabled:text-gray-400 disabled:cursor-not-allowed"
//                     >
//                       Deliver
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Orders;



import React, { useState, useEffect } from 'react';
import axios from 'axios';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    try {
      await axios.put(`/api/orders/${orderId}/status`, 
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      await fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    } finally {
      setUpdatingOrder(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <div className="text-sm text-gray-500">{orders.length} orders found</div>
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50 transition duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Order #{order._id.slice(-8)}</div>
                      <div className="text-sm text-gray-500">{order.items.length} items</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.user?.name}</div>
                    <div className="text-sm text-gray-500">{order.user?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus]}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      disabled={updatingOrder === order._id}
                      className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    {updatingOrder === order._id && (
                      <span className="ml-2 text-blue-600">Updating...</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Orders;