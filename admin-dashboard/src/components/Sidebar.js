// import React from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useLocation, useNavigate } from 'react-router-dom';

// const menuItems = [
//   { path: '/', label: 'Dashboard', icon: '📊' },
//   { path: '/products', label: 'Products', icon: '💎' },
//   { path: '/orders', label: 'Orders', icon: '📦' },
//   { path: '/users', label: 'Users', icon: '👥' },
// ];

// function Sidebar() {
//   const { logout, currentUser } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const isActive = (path) => {
//     return location.pathname === path;
//   };

//   return (
//     <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen flex flex-col">
//       <div className="p-6">
//         <div className="flex items-center space-x-3">
//           <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
//             <span className="text-xl font-bold">J</span>
//           </div>
//           <div>
//             <h1 className="text-xl font-bold">Jewellery Admin</h1>
//             <p className="text-gray-400 text-sm">Dashboard</p>
//           </div>
//         </div>
//       </div>

//       <nav className="flex-1 px-4 space-y-2">
//         {menuItems.map(item => (
//           <button
//             key={item.path}
//             onClick={() => navigate(item.path)}
//             className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200 ${
//               isActive(item.path)
//                 ? 'bg-blue-600 text-white shadow-lg'
//                 : 'text-gray-300 hover:bg-gray-700 hover:text-white'
//             }`}
//           >
//             <span className="text-lg">{item.icon}</span>
//             <span className="font-medium">{item.label}</span>
//           </button>
//         ))}
//       </nav>

//       <div className="p-4 border-t border-gray-700">
//         <div className="flex items-center space-x-3 p-3">
//           <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
//             <span className="text-sm font-bold">
//               {currentUser?.name?.charAt(0) || 'A'}
//             </span>
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium truncate">{currentUser?.name || 'Admin'}</p>
//             <p className="text-xs text-gray-400 truncate">{currentUser?.email}</p>
//           </div>
//         </div>
        
//         <button
//           onClick={logout}
//           className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition duration-200"
//         >
//           <span className="text-lg">🚪</span>
//           <span className="font-medium">Logout</span>
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Sidebar;


// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useLocation, useNavigate } from 'react-router-dom';

// const menuItems = [
//   { path: '/', label: 'Dashboard', icon: '📊' },
//   { path: '/products', label: 'Products', icon: '💎' },
//   { path: '/orders', label: 'Orders', icon: '📦' },
//   { path: '/users', label: 'Users', icon: '👥' },
// ];

// function Sidebar() {
//   const { logout, currentUser } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const isActive = (path) => {
//     return location.pathname === path;
//   };

//   const handleNavigation = (path) => {
//     navigate(path);
//     setIsMobileMenuOpen(false);
//   };

//   const handleLogout = () => {
//     logout();
//     setIsMobileMenuOpen(false);
//   };

//   return (
//     <>
//       {/* Mobile menu button */}
//       <div className="md:hidden fixed top-4 left-4 z-50">
//         <button
//           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           className="p-2 rounded-md bg-gray-800 text-white shadow-lg"
//         >
//           {isMobileMenuOpen ? (
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           ) : (
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           )}
//         </button>
//       </div>

//       {/* Overlay for mobile */}
//       {isMobileMenuOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
//           onClick={() => setIsMobileMenuOpen(false)}
//         ></div>
//       )}

//       {/* Sidebar */}
//       <div className={`
//         fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col z-50
//         transform transition-transform duration-300 ease-in-out
//         ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
//         md:static md:inset-auto md:z-auto
//       `}>
        
//         {/* Close button for mobile - only show on mobile */}
//         <div className="md:hidden flex justify-end p-4 border-b border-gray-700">
//           <button
//             onClick={() => setIsMobileMenuOpen(false)}
//             className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition duration-200"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <div className="p-6 flex-1 flex flex-col">
//           {/* Logo and Title */}
//           <div className="mb-8">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
//                 <span className="text-xl font-bold">J</span>
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold">Jewellery Admin</h1>
//                 <p className="text-gray-400 text-sm">Dashboard</p>
//               </div>
//             </div>
//           </div>

//           {/* Navigation Menu */}
//           <nav className="flex-1 space-y-2">
//             {menuItems.map(item => (
//               <button
//                 key={item.path}
//                 onClick={() => handleNavigation(item.path)}
//                 className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200 ${
//                   isActive(item.path)
//                     ? 'bg-blue-600 text-white shadow-lg'
//                     : 'text-gray-300 hover:bg-gray-700 hover:text-white'
//                 }`}
//               >
//                 <span className="text-lg">{item.icon}</span>
//                 <span className="font-medium">{item.label}</span>
//               </button>
//             ))}
//           </nav>

//           {/* User Info and Logout */}
//           <div className="border-t border-gray-700 pt-4">
//             <div className="flex items-center space-x-3 p-3">
//               <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
//                 <span className="text-sm font-bold">
//                   {currentUser?.name?.charAt(0) || 'A'}
//                 </span>
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium truncate">{currentUser?.name || 'Admin'}</p>
//                 <p className="text-xs text-gray-400 truncate">{currentUser?.email}</p>
//               </div>
//             </div>
            
//             <button
//               onClick={handleLogout}
//               className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition duration-200"
//             >
//               <span className="text-lg">🚪</span>
//               <span className="font-medium">Logout</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Sidebar;




import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/products', label: 'Products', icon: '💎' },
  { path: '/orders', label: 'Orders', icon: '📦' },
  { path: '/users', label: 'Users', icon: '👥' },
];

function Sidebar() {
  const { logout, currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-gray-800 text-white shadow-lg"
        >
          
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* Close button for mobile - only show on mobile */}
        <div className="md:hidden flex justify-end p-4 border-b border-gray-700">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Logo and Title */}
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold">J</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Jewellery Admin</h1>
                <p className="text-gray-400 text-sm">Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            {menuItems.map(item => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200 ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Info and Logout */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-3 p-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">
                  {currentUser?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{currentUser?.name || 'Admin'}</p>
                <p className="text-xs text-gray-400 truncate">{currentUser?.email}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition duration-200"
            >
              <span className="text-lg">🚪</span>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;