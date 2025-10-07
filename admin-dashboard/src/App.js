import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Users from './pages/Users';


function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

function AppRouter() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} 
      />
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/products" 
        element={isAuthenticated ? <Products /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/orders" 
        element={isAuthenticated ? <Orders /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/users" 
        element={isAuthenticated ? <Users /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
      />
      <Route 
        path="*" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRouter />
      </Router>
    </AuthProvider>
  );
}

export default App;










// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import Sidebar from './components/Sidebar';
// import Dashboard from './pages/Dashboard';
// import Products from './pages/Products';
// import Orders from './pages/Orders';
// import Users from './pages/Users';
// import Login from './pages/Login';

// function LoadingSpinner() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="flex flex-col items-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
//         <p className="text-gray-600">Loading...</p>
//       </div>
//     </div>
//   );
// }

// function AdminLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Mobile sidebar backdrop */}
//       {sidebarOpen && (
//         <div 
//           className="fixed inset-0 flex z-40 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         >
//           <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
//         </div>
//       )}

//       {/* Sidebar */}
//       <div className={`
//         fixed inset-y-0 left-0 flex flex-col z-50 
//         transform transition duration-300 ease-in-out
//         ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//         md:translate-x-0 md:static md:inset-0
//       `}>
//         <Sidebar />
//       </div>

//       {/* Main content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Mobile header */}
//         <header className="md:hidden bg-white shadow-sm z-10">
//           <div className="flex items-center justify-between p-4">
//             <button
//               onClick={() => setSidebarOpen(true)}
//               className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
//             >
//               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//             <h1 className="text-xl font-semibold text-gray-800">Jewellery Admin</h1>
//             <div className="w-6"></div> {/* Spacer for balance */}
//           </div>
//         </header>

//         {/* Page content */}
//         <main className="flex-1 overflow-x-hidden overflow-y-auto">
//           <Routes>
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/products" element={<Products />} />
//             <Route path="/orders" element={<Orders />} />
//             <Route path="/users" element={<Users />} />
//             <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// }

// function AppRouter() {
//   const { currentUser, isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <Routes>
//       <Route 
//         path="/login" 
//         element={!isAuthenticated ? <Login /> : <Navigate to="/admin/dashboard" replace />} 
//       />
//       <Route 
//         path="/admin/*" 
//         element={isAuthenticated ? <AdminLayout /> : <Navigate to="/admin/login" replace />} 
//       />
//       <Route 
//         path="/" 
//         element={<Navigate to={isAuthenticated ? "/admin/dashboard" : "/admin/login"} replace />} 
//       />
//       <Route 
//         path="*" 
//         element={<Navigate to={isAuthenticated ? "/admin/dashboard" : "/admin/login"} replace />} 
//       />
//     </Routes>
//   );
// }

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <AppRouter />
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;