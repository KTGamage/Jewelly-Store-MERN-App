// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import axios from 'axios';

// const statusColors = {
//   pending: 'bg-yellow-100 text-yellow-800',
//   processing: 'bg-blue-100 text-blue-800',
//   shipped: 'bg-purple-100 text-purple-800',
//   delivered: 'bg-green-100 text-green-800',
//   cancelled: 'bg-red-100 text-red-800'
// };

// function OrderHistory() {
//   const { user } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get('/api/orders/my-orders', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         setOrders(response.data);
//       } catch (error) {
//         console.error('Error fetching orders:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user) {
//       fetchOrders();
//     }
//   }, [user]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-6xl mx-auto">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">Order History</h1>
//           <p className="text-gray-600">Track your jewelry orders</p>
//         </div>

//         {orders.length === 0 ? (
//           <div className="text-center bg-white rounded-2xl p-12 shadow-sm">
//             <div className="text-6xl mb-6">📦</div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
//             <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
//             <a 
//               href="/products"
//               className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
//             >
//               Start Shopping
//             </a>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {orders.map(order => (
//               <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="p-6 border-b border-gray-200">
//                   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-900">
//                         Order #{order._id}
//                       </h3>
//                       <p className="text-gray-600 text-sm">
//                         Placed on {new Date(order.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                     <div className="mt-2 sm:mt-0">
//                       <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.orderStatus]}`}>
//                         {order.orderStatus}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="p-6">
//                   <div className="space-y-4">
//                     {order.items.map((item, index) => (
//                       <div key={index} className="flex items-center space-x-4">
//                         <img 
//                           src={item.product?.images?.[0]?.url} 
//                           alt={item.product?.name}
//                           className="w-16 h-16 object-cover rounded-lg"
//                         />
//                         <div className="flex-1">
//                           <h4 className="font-medium text-gray-900">{item.product?.name}</h4>
//                           <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-semibold text-gray-900">
//                             ${(item.price * item.quantity).toFixed(2)}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="mt-6 pt-6 border-t border-gray-200">
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <p className="text-sm text-gray-600">Total Amount</p>
//                         <p className="text-2xl font-bold text-gray-900">${order.totalAmount}</p>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-sm text-gray-600">Payment Status</p>
//                         <p className={`font-semibold ${
//                           order.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'
//                         }`}>
//                           {order.paymentStatus}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default OrderHistory;


import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
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

function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/orders/my-orders', {
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
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const getOrderTotalItems = (order) => {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-16">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Orders</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order History</h1>
          <p className="text-gray-600">Track your jewelry orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center bg-white rounded-2xl p-12 shadow-sm">
            <div className="text-6xl mb-6">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <Link 
              to="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 inline-block"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.orderStatus]}`}>
                        <span className="mr-1">{statusIcons[order.orderStatus]}</span>
                        {order.orderStatus}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${paymentStatusColors[order.paymentStatus]}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <img 
                          src={item.product?.images?.[0]?.url || '/api/placeholder/100/100'} 
                          alt={item.product?.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = '/api/placeholder/100/100';
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.product?.name}</h4>
                          <p className="text-gray-600 text-sm">
                            Qty: {item.quantity} • ${item.price?.toFixed(2)} each
                          </p>
                          {item.product?.category && (
                            <p className="text-gray-500 text-xs mt-1">{item.product.category}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ${((item.price || 0) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-2xl font-bold text-gray-900">${order.totalAmount?.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Items</p>
                        <p className="font-semibold text-gray-900">{getOrderTotalItems(order)} items</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;