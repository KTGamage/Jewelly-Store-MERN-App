// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';

// function ProductDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await axios.get(`/api/products/${id}`);
//         setProduct(response.data);
//       } catch (error) {
//         setError('Product not found');
//         console.error('Error fetching product:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   const addToCart = () => {
//     if (!user) {
//       navigate('/login');
//       return;
//     }
//     // Implement add to cart functionality
//     alert('Added to cart!');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (error || !product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-6xl mb-4">😞</div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
//           <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
//           <button 
//             onClick={() => navigate('/products')}
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
//           >
//             Back to Products
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const images = product.images || [{ url: product.image }];

//   return (
//     <div className="min-h-screen bg-white py-8 px-4">
//       <div className="max-w-7xl mx-auto">
//         <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
//           <button onClick={() => navigate('/')} className="hover:text-gray-900">Home</button>
//           <span>›</span>
//           <button onClick={() => navigate('/products')} className="hover:text-gray-900">Products</button>
//           <span>›</span>
//           <span className="text-gray-900">{product.name}</span>
//         </nav>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           {/* Product Images */}
//           <div>
//             <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
//               <img 
//                 src={images[selectedImage]?.url} 
//                 alt={product.name}
//                 className="w-full h-96 object-cover"
//               />
//             </div>
//             {images.length > 1 && (
//               <div className="grid grid-cols-4 gap-2">
//                 {images.map((img, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setSelectedImage(index)}
//                     className={`bg-gray-100 rounded-lg overflow-hidden ${
//                       selectedImage === index ? 'ring-2 ring-blue-500' : ''
//                     }`}
//                   >
//                     <img 
//                       src={img.url} 
//                       alt={`${product.name} ${index + 1}`}
//                       className="w-full h-20 object-cover"
//                     />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Product Info */}
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
//             <p className="text-2xl font-bold text-blue-600 mb-6">${product.price}</p>
            
//             <div className="prose prose-gray mb-6">
//               <p className="text-gray-600 leading-relaxed">{product.description}</p>
//             </div>

//             <div className="space-y-4 mb-8">
//               <div className="flex items-center space-x-4">
//                 <span className="text-sm text-gray-600">Category:</span>
//                 <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
//                   {product.category}
//                 </span>
//               </div>
              
//               <div className="flex items-center space-x-4">
//                 <span className="text-sm text-gray-600">Availability:</span>
//                 <span className="text-green-600 font-semibold">In Stock</span>
//               </div>
//             </div>

//             {/* Quantity Selector */}
//             <div className="flex items-center space-x-4 mb-6">
//               <span className="text-sm font-medium text-gray-700">Quantity:</span>
//               <div className="flex items-center border border-gray-300 rounded-lg">
//                 <button 
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   className="px-4 py-2 text-gray-600 hover:text-gray-900"
//                 >
//                   -
//                 </button>
//                 <span className="px-4 py-2 border-l border-r border-gray-300">{quantity}</span>
//                 <button 
//                   onClick={() => setQuantity(quantity + 1)}
//                   className="px-4 py-2 text-gray-600 hover:text-gray-900"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4">
//               <button
//                 onClick={addToCart}
//                 className="flex-1 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
//               >
//                 Add to Cart
//               </button>
//               <button className="flex-1 bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition duration-200 font-semibold">
//                 Buy Now
//               </button>
//             </div>

//             {/* Product Features */}
//             <div className="mt-8 space-y-3">
//               <div className="flex items-center">
//                 <span className="text-green-500 mr-2">✓</span>
//                 <span className="text-sm text-gray-600">Free shipping worldwide</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-green-500 mr-2">✓</span>
//                 <span className="text-sm text-gray-600">30-day money-back guarantee</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-green-500 mr-2">✓</span>
//                 <span className="text-sm text-gray-600">Lifetime warranty</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProductDetail;




import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        setError('Product not found');
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product, quantity);
    alert('Added to cart!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const images = product.images || [{ url: product.image }];

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <button onClick={() => navigate('/')} className="hover:text-gray-900">Home</button>
          <span>›</span>
          <button onClick={() => navigate('/products')} className="hover:text-gray-900">Products</button>
          <span>›</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img 
                src={images[selectedImage]?.url} 
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`bg-gray-100 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <img 
                      src={img.url} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-2xl font-bold text-blue-600 mb-6">${product.price}</p>
            
            <div className="prose prose-gray mb-6">
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Category:</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {product.category}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Availability:</span>
                <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>

              {product.material && (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Material:</span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {product.material}
                  </span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-l border-r border-gray-300">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">Max: {product.stock}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {product.stock > 0 ? (
                <>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => {
                      handleAddToCart();
                      navigate('/cart');
                    }}
                    className="flex-1 bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition duration-200 font-semibold"
                  >
                    Buy Now
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className="flex-1 bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}
            </div>

            {/* Product Features */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-sm text-gray-600">Free shipping worldwide</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-sm text-gray-600">30-day money-back guarantee</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-sm text-gray-600">Lifetime warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;