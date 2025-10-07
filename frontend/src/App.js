// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Products from './pages/Products';
// import ProductDetail from './pages/ProductDetail';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Cart from './pages/Cart';
// import Chatbot from './components/Chatbot';

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <div className="min-h-screen bg-gray-50">
//           <Navbar />
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/products" element={<Products />} />
//             <Route path="/product/:id" element={<ProductDetail />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/cart" element={<Cart />} />
//           </Routes>
//           <Chatbot />
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;



// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Products from './pages/Products';
// import ProductDetail from './pages/ProductDetail';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Cart from './pages/Cart';
// import Chatbot from './components/Chatbot';
// import OAuthSuccess from './components/OAuthSuccess';

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <div className="min-h-screen bg-white">
//           <Navbar />
//           <main>
//             <Routes>
//               <Route path="/oauth-success" element={<OAuthSuccess />} />
//               <Route path="/" element={<Home />} />
//               <Route path="/products" element={<Products />} />
//               <Route path="/product/:id" element={<ProductDetail />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/register" element={<Register />} />
//               <Route path="/cart" element={<Cart />} />
//             </Routes>
//           </main>
//           <Chatbot />
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;



import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import OrderSuccess from './pages/OrderSuccess';
import OrderHistory from './pages/OrderHistory';
import Chatbot from './components/Chatbot';
import OAuthSuccess from './components/OAuthSuccess';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Navbar />
            <main>
              <Routes>
                <Route path="/oauth-success" element={<OAuthSuccess />} />
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route 
                  path="/order-success" 
                  element={
                    <ProtectedRoute>
                      <OrderSuccess />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/order-history" 
                  element={
                    <ProtectedRoute>
                      <OrderHistory />
                    </ProtectedRoute>
                  } 
                />
                {/* 404 Page */}
                <Route path="*" element={
                  <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                      <p className="text-xl text-gray-600 mb-8">Page not found</p>
                      <a 
                        href="/" 
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                      >
                        Go Home
                      </a>
                    </div>
                  </div>
                } />
              </Routes>
            </main>
            <Chatbot />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;