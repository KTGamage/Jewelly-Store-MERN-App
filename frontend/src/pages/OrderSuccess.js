// import React from 'react';
// import { useLocation, Link } from 'react-router-dom';

// function OrderSuccess() {
//   const location = useLocation();
//   const orderId = location.state?.orderId;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4">
//       <div className="max-w-md w-full">
//         <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50 text-center">
//           <div className="text-8xl mb-6">🎉</div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
//           <p className="text-gray-600 mb-6">
//             Thank you for your order. Your jewelry pieces are being prepared for shipment.
//           </p>
          
//           {orderId && (
//             <div className="bg-gray-50 rounded-xl p-4 mb-6">
//               <p className="text-sm text-gray-600">Order ID</p>
//               <p className="font-mono font-bold text-gray-900">{orderId}</p>
//             </div>
//           )}

//           <div className="space-y-4">
//             <Link 
//               to="/order-history"
//               className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
//             >
//               View Order History
//             </Link>
//             <Link 
//               to="/products"
//               className="block w-full bg-gray-100 text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
//             >
//               Continue Shopping
//             </Link>
//           </div>

//           <div className="mt-8 pt-6 border-t border-gray-200">
//             <div className="flex justify-center space-x-6 text-sm text-gray-500">
//               <div className="flex items-center">
//                 <span className="mr-2">📧</span>
//                 Confirmation Sent
//               </div>
//               <div className="flex items-center">
//                 <span className="mr-2">🚚</span>
//                 Free Shipping
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default OrderSuccess;






import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId;
  const order = location.state?.order;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 mt-16">
      <div className="max-w-2xl w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50 text-center">
          <div className="text-8xl mb-6">🎉</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6 text-lg">
            Thank you for your order. Your jewelry pieces are being prepared for shipment.
          </p>
          
          {orderId && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Order Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono font-bold text-gray-900">{orderId}</span>
                </div>
                {order && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold text-green-600">${order.totalAmount?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items:</span>
                      <span className="font-semibold text-gray-900">{order.items?.length} items</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-semibold text-blue-600 capitalize">{order.orderStatus}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="space-y-4 mb-8">
            <Link 
              to="/order-history"
              className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-lg"
            >
              View Order History
            </Link>
            <Link 
              to="/products"
              className="block w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 text-lg"
            >
              Continue Shopping
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <span className="mr-2">📧</span>
                Confirmation Sent
              </div>
              <div className="flex items-center">
                <span className="mr-2">🚚</span>
                Free Shipping
              </div>
              <div className="flex items-center">
                <span className="mr-2">⏱️</span>
                Processing
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-blue-800 text-sm">
              You will receive an email confirmation shortly. For any questions, contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;