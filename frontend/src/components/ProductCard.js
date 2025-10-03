// import React from 'react';
// import { Link } from 'react-router-dom';

// const ProductCard = ({ product }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
//       <img 
//         src={product.images[0]?.url} 
//         alt={product.name} 
//         className="w-full h-48 object-cover"
//       />
//       <div className="p-4">
//         <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
//         <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
//         <div className="flex justify-between items-center">
//           <span className="text-primary-600 font-bold">${product.price}</span>
//           <Link 
//             to={`/product/${product._id}`}
//             className="btn-primary"
//           >
//             View Details
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default ProductCard;




// import React from 'react';
// import { Link } from 'react-router-dom';

// const ProductCard = ({ product }) => {
//   return (
//     <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
//       <Link to={`/product/${product._id}`}>
//         <div className="relative h-48 overflow-hidden">
//           <img 
//             src={product.images?.[0]?.url || product.image} 
//             alt={product.name}
//             className="w-full h-full object-cover hover:scale-105 transition duration-300"
//           />
//           <div className="absolute top-2 right-2">
//             <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
//               New
//             </span>
//           </div>
//         </div>
//       </Link>
      
//       <div className="p-4">
//         <div className="flex justify-between items-start mb-2">
//           <Link to={`/product/${product._id}`}>
//             <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition duration-200 line-clamp-1">
//               {product.name}
//             </h3>
//           </Link>
//         </div>
        
//         <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
//         <div className="flex items-center justify-between">
//           <div>
//             <span className="text-xl font-bold text-blue-600">${product.price}</span>
//           </div>
          
//           <Link 
//             to={`/product/${product._id}`}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm font-semibold"
//           >
//             View Details
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">⭐</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">⭐</span>);
    }
    return stars;
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (viewMode === 'list') {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-white/50">
        <div className="flex flex-col md:flex-row">
          <Link to={`/product/${product._id}`} className="md:w-80 h-64 md:h-48 relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-100 transition-opacity duration-300 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}>
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-400 border-t-transparent"></div>
              </div>
            </div>
            <img 
              src={product.images?.[0]?.url || product.image} 
              alt={product.name}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            
            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <div className="absolute top-4 left-4">
                <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  -{discountPercentage}%
                </span>
              </div>
            )}
          </Link>
          
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <Link to={`/product/${product._id}`}>
                  <h3 className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors duration-300 line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <button
                  onClick={handleWishlistToggle}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isWishlisted ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <span className="text-xl">{isWishlisted ? '❤️' : '🤍'}</span>
                </button>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
              
              {/* Rating */}
              {product.rating && (
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                  <span className="text-sm text-gray-500 ml-2">({product.reviews} reviews)</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              
              <Link 
                to={`/product/${product._id}`}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 border border-white/50">
      <Link to={`/product/${product._id}`}>
        <div className="relative h-64 overflow-hidden">
          {/* Loading placeholder */}
          <div className={`absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-100 transition-opacity duration-300 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-400 border-t-transparent"></div>
            </div>
          </div>
          
          <img 
            src={product.images?.[0]?.url || product.image} 
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            {discountPercentage > 0 && (
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                -{discountPercentage}%
              </span>
            )}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              New
            </span>
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
              isWishlisted 
                ? 'bg-red-500/20 text-red-500 border border-red-500/50' 
                : 'bg-white/20 text-white hover:bg-red-500/20 hover:text-red-500 border border-white/30 hover:border-red-500/50'
            }`}
          >
            <span className="text-lg">{isWishlisted ? '❤️' : '🤍'}</span>
          </button>
        </div>
      </Link>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <Link to={`/product/${product._id}`}>
            <h3 className="font-bold text-lg text-gray-900 hover:text-purple-600 transition-colors duration-300 line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center mb-4">
            <div className="flex mr-2">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm font-medium text-gray-700">{product.rating}</span>
            <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          <Link 
            to={`/product/${product._id}`}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;