// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useCart } from "../context/CartContext";

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const location = useLocation();
//   const { getCartItemsCount } = useCart();

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     setIsMenuOpen(false);
//   }, [location]);

//   const navLinks = [
//     { path: "/", label: "Home", icon: "🏠" },
//     { path: "/products", label: "Products", icon: "💎" },
//   ];

//   const isActivePath = (path) => {
//     if (path === "/") return location.pathname === "/";
//     return location.pathname.startsWith(path);
//   };

//   return (
//     <nav
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//         isScrolled
//           ? "bg-white/90 backdrop-blur-xl shadow-2xl border-b border-gray-200/50"
//           : "bg-white/80 backdrop-blur-sm shadow-lg"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-20">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-3 group">
//             <div className="relative">
//               <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300">
//                 <span className="text-white font-bold text-xl">💎</span>
//               </div>
//               <div className="absolute -inset-1 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
//             </div>
//             <div className="hidden sm:block">
//               <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
//                 LuxuryJewelry
//               </h1>
//               <p className="text-xs text-gray-500 font-medium">
//                 Crafted Elegance
//               </p>
//             </div>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-1">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
//                   isActivePath(link.path)
//                     ? "text-white bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg"
//                     : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
//                 }`}
//               >
//                 <span className="flex items-center space-x-2">
//                   <span>{link.icon}</span>
//                   <span>{link.label}</span>
//                 </span>
//                 {isActivePath(link.path) && (
//                   <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full"></div>
//                 )}
//               </Link>
//             ))}
//           </div>

//           {/* User Menu / Auth Buttons */}
//           <div className="hidden md:flex items-center space-x-4">
//             {user ? (
//               <div className="flex items-center space-x-4">
//                 {/* Cart Button */}
//                 <Link
//                   to="/cart"
//                   className="relative p-3 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 group"
//                 >
//                   <span className="text-2xl">🛒</span>
//                   <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
//                     {getCartItemsCount()}
//                   </div>
//                   <div className="absolute inset-0 bg-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 </Link>

//                 {/* User Profile Menu */}
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowUserMenu(!showUserMenu)}
//                     className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-300"
//                   >
//                     <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
//                       <span className="text-white font-bold text-sm">
//                         {user.name?.charAt(0)?.toUpperCase() || "U"}
//                       </span>
//                     </div>
//                     <div className="hidden lg:block text-left">
//                       <p className="text-sm font-semibold text-gray-900">
//                         {user.name}
//                       </p>
//                       <p className="text-xs text-gray-500">Premium Member</p>
//                     </div>
//                     <span
//                       className={`text-gray-400 transform transition-transform duration-200 ${
//                         showUserMenu ? "rotate-180" : ""
//                       }`}
//                     >
//                       ⌄
//                     </span>
//                   </button>

//                   {/* Dropdown Menu */}
//                   {showUserMenu && (
//                     <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 py-2 z-50">
//                       <div className="px-4 py-3 border-b border-gray-200/50">
//                         <p className="text-sm font-semibold text-gray-900">
//                           {user.name}
//                         </p>
//                         <p className="text-xs text-gray-500">{user.email}</p>
//                       </div>

//                       <Link
//                         to="/profile"
//                         className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
//                       >
//                         <span className="mr-3">👤</span>
//                         My Profile
//                       </Link>

//                       <Link
//                         to="/orders"
//                         className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
//                       >
//                         <span className="mr-3">📦</span>
//                         Order History
//                       </Link>

//                       <Link
//                         to="/wishlist"
//                         className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
//                       >
//                         <span className="mr-3">❤️</span>
//                         Wishlist
//                       </Link>

//                       <div className="border-t border-gray-200/50 mt-2">
//                         <button
//                           onClick={() => {
//                             logout();
//                             setShowUserMenu(false);
//                           }}
//                           className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
//                         >
//                           <span className="mr-3">🚪</span>
//                           Sign Out
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ) : (
//               <div className="flex items-center space-x-3">
//                 <Link
//                   to="/login"
//                   className="text-gray-700 hover:text-purple-600 font-semibold px-4 py-2 rounded-xl hover:bg-purple-50 transition-all duration-300"
//                 >
//                   Sign In
//                 </Link>
//                 <Link
//                   to="/register"
//                   className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold"
//                 >
//                   Get Started
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden flex items-center space-x-3">
//             {user && (
//               <Link
//                 to="/cart"
//                 className="relative p-3 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 group"
//               >
//                 <span className="text-2xl">🛒</span>
//                 <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
//                   {getCartItemsCount()}
//                 </div>
//                 <div className="absolute inset-0 bg-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               </Link>
//             )}

//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="p-2 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300"
//             >
//               <svg
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 {isMenuOpen ? (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 ) : (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 6h16M4 12h16M4 18h16"
//                   />
//                 )}
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         <div
//           className={`md:hidden transition-all duration-300 overflow-hidden ${
//             isMenuOpen ? "max-h-screen pb-6" : "max-h-0"
//           }`}
//         >
//           <div className="pt-4 space-y-2">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
//                   isActivePath(link.path)
//                     ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
//                     : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
//                 }`}
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 <span>{link.icon}</span>
//                 <span className="font-semibold">{link.label}</span>
//               </Link>
//             ))}

//             <div className="border-t border-gray-200 pt-4 mt-4">
//               {user ? (
//                 <div className="space-y-2">
//                   <div className="flex items-center space-x-3 px-4 py-3">
//                     <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
//                       <span className="text-white font-bold text-xs">
//                         {user.name?.charAt(0)?.toUpperCase() || "U"}
//                       </span>
//                     </div>
//                     <div>
//                       <p className="font-semibold text-gray-900">{user.name}</p>
//                       <p className="text-xs text-gray-500">Premium Member</p>
//                     </div>
//                   </div>

//                   <Link
//                     to="/profile"
//                     className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-colors duration-200"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     <span>👤</span>
//                     <span>My Profile</span>
//                   </Link>

//                   <Link
//                     to="/orders"
//                     className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-colors duration-200"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     <span>📦</span>
//                     <span>Order History</span>
//                   </Link>

//                   <button
//                     onClick={() => {
//                       logout();
//                       setIsMenuOpen(false);
//                     }}
//                     className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
//                   >
//                     <span>🚪</span>
//                     <span>Sign Out</span>
//                   </button>
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   <Link
//                     to="/login"
//                     className="block px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-colors duration-200 font-semibold"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     Sign In
//                   </Link>
//                   <Link
//                     to="/register"
//                     className="block px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-center"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     Get Started
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Click outside to close user menu */}
//       {showUserMenu && (
//         <div
//           className="fixed inset-0 z-40"
//           onClick={() => setShowUserMenu(false)}
//         ></div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;






import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartItemsCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/products", label: "Products", icon: "💎" },
  ];

  const isActivePath = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleOrderHistory = () => {
    navigate("/order-history");
    setShowUserMenu(false);
    setIsMenuOpen(false);
  };

  const handleWishlist = () => {
    navigate("/products?view=wishlist");
    setShowUserMenu(false);
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-xl shadow-2xl border-b border-gray-200/50"
          : "bg-white/80 backdrop-blur-sm shadow-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300">
                <span className="text-white font-bold text-xl">💎</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
                LuxuryJewelry
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Crafted Elegance
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isActivePath(link.path)
                    ? "text-white bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg"
                    : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </span>
                {isActivePath(link.path) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Cart Button */}
                <Link
                  to="/cart"
                  className="relative p-3 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 group"
                >
                  <span className="text-2xl">🛒</span>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {getCartItemsCount()}
                  </div>
                  <div className="absolute inset-0 bg-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>

                {/* User Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-semibold text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">Premium Member</p>
                    </div>
                    <span
                      className={`text-gray-400 transform transition-transform duration-200 ${
                        showUserMenu ? "rotate-180" : ""
                      }`}
                    >
                      ⌄
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200/50">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <span className="mr-3">👤</span>
                        My Profile
                      </Link>

                      <button
                        onClick={handleOrderHistory}
                        className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                      >
                        <span className="mr-3">📦</span>
                        Order History
                      </button>

                      <button
                        onClick={handleWishlist}
                        className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                      >
                        <span className="mr-3">❤️</span>
                        Wishlist
                      </button>

                      <div className="border-t border-gray-200/50 mt-2">
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <span className="mr-3">🚪</span>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-purple-600 font-semibold px-4 py-2 rounded-xl hover:bg-purple-50 transition-all duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {user && (
              <Link
                to="/cart"
                className="relative p-3 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 group"
              >
                <span className="text-2xl">🛒</span>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {getCartItemsCount()}
                </div>
                <div className="absolute inset-0 bg-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? "max-h-screen pb-6" : "max-h-0"
          }`}
        >
          <div className="pt-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActivePath(link.path)
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{link.icon}</span>
                <span className="font-semibold">{link.label}</span>
              </Link>
            ))}

            <div className="border-t border-gray-200 pt-4 mt-4">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 px-4 py-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">Premium Member</p>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>👤</span>
                    <span>My Profile</span>
                  </Link>

                  <button
                    onClick={handleOrderHistory}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-colors duration-200"
                  >
                    <span>📦</span>
                    <span>Order History</span>
                  </button>

                  <button
                    onClick={handleWishlist}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-colors duration-200"
                  >
                    <span>❤️</span>
                    <span>Wishlist</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
                  >
                    <span>🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="block px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-colors duration-200 font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
