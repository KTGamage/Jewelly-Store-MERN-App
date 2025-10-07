// import React from 'react';
// import { Link, useLocation, useNavigate} from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const Sidebar = () => {
//   const { logout } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };


//   const menuItems = [
//     { path: '/', name: 'Dashboard', icon: '📊' },
//     { path: '/products', name: 'Products', icon: '💎' },
//     { path: '/orders', name: 'Orders', icon: '📦' },
//     { path: '/users', name: 'Users', icon: '👥' },
//   ];

//   return (
//     <div className="w-64 bg-gray-800 text-white">
//       <div className="p-4 text-xl font-bold">Admin Panel</div>
//       <nav className="mt-6">
//         {menuItems.map(item => (
//           <Link
//             key={item.path}
//             to={item.path}
//             className={`flex items-center px-4 py-3 transition-colors duration-200 ${location.pathname === item.path ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
//           >
//             <span className="mr-3">{item.icon}</span>
//             <span>{item.name}</span>
//           </Link>
//         ))}
//       </nav>
//       <div className="absolute bottom-0 w-full p-4">
//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


// import React from 'react';
// import { Nav } from 'react-bootstrap';
// import { LinkContainer } from 'react-router-bootstrap';
// import { useAuth } from '../context/AuthContext';

// function Sidebar() {
//   const { logout } = useAuth();

//   return (
//     <div className="sidebar" style={{ width: '250px', height: '100vh', backgroundColor: '#f8f9fa', padding: '20px' }}>
//       <h4 className="mb-4">Admin Panel</h4>
//       <Nav className="flex-column">
//         <LinkContainer to="/admin">
//           <Nav.Link>Dashboard</Nav.Link>
//         </LinkContainer>
//         <LinkContainer to="/admin/products">
//           <Nav.Link>Products</Nav.Link>
//         </LinkContainer>
//         <LinkContainer to="/admin/orders">
//           <Nav.Link>Orders</Nav.Link>
//         </LinkContainer>
//         <LinkContainer to="/admin/users">
//           <Nav.Link>Users</Nav.Link>
//         </LinkContainer>
//         <Nav.Link onClick={logout}>Logout</Nav.Link>
//       </Nav>
//     </div>
//   );
// }

// export default Sidebar;



import React from 'react';
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

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen flex flex-col">
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

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
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
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition duration-200"
        >
          <span className="text-lg">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;