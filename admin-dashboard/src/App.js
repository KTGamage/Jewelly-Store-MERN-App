// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import Sidebar from './components/Sidebar';
// import Login from './pages/Login';
// import Products from './pages/Products';
// import Orders from './pages/Orders';
// import Users from './pages/Users';
// // import 'bootstrap/dist/css/bootstrap.min.css';
// <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"></link>

// function ProtectedRoute({ children }) {
//   const { currentUser } = useAuth();
//   return currentUser ? children : <Navigate to="/admin/login" />;
// }

// function AppContent() {
//   const { currentUser } = useAuth();

//   if (!currentUser) {
//     return (
//       <Router>
//         <Routes>
//           <Route path="/admin/login" element={<Login />} />
//           <Route path="*" element={<Navigate to="/admin/login" />} />
//         </Routes>
//       </Router>
//     );
//   }

//   return (
//     <Router>
//       <div className="d-flex">
//         <Sidebar />
//         <div className="flex-grow-1 p-4">
//           <Routes>
//             <Route path="/admin" element={
//               <ProtectedRoute>
//                 <div>
//                   <h2>Admin Dashboard</h2>
//                   <p>Welcome to the admin panel</p>
//                 </div>
//               </ProtectedRoute>
//             } />
//             <Route path="/admin/products" element={
//               <ProtectedRoute>
//                 <Products />
//               </ProtectedRoute>
//             } />
//             <Route path="/admin/orders" element={
//               <ProtectedRoute>
//                 <Orders />
//               </ProtectedRoute>
//             } />
//             <Route path="/admin/users" element={
//               <ProtectedRoute>
//                 <Users />
//               </ProtectedRoute>
//             } />
//             <Route path="*" element={<Navigate to="/admin" />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }

// function App() {
//   return (
//     <AuthProvider>
//       <AppContent />
//     </AuthProvider>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Users from './pages/Users';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
}

function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="/" element={<Navigate to="/admin/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/*" element={
          isAuthenticated ? <AdminLayout /> : <Navigate to="/admin/login" />
        } />
        <Route path="/" element={<Navigate to="/admin/dashboard" />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;