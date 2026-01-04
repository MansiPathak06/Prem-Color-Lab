// // app/buynow/[id]/BuyNowClient.jsx
// 'use client';

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams } from 'next/navigation';

// export default function BuyNowClient() {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:4000/api/products/${id}`
//         );
//         setProduct(res.data);
//       } catch (err) {
//         setError('Failed to load product');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) fetchProduct();
//   }, [id]);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;
//   if (!product) return <p>Product not found</p>;

//   return (
//     <div className="buy-now">
//       <h1>Buy Now</h1>

//       <div className="buy-now-product">
//         <img
//           src={product.imageUrl}
//           alt={product.title}
//           style={{ width: 300, height: 300, objectFit: 'cover' }}
//         />
//         <div>
//           <p><strong>ID:</strong> {product._id}</p>
//           <p><strong>Name:</strong> {product.title}</p>
//           <p><strong>Price:</strong> {product.price}</p>
//           <p><strong>Category:</strong> {product.category}</p>
//           <p><strong>Orientation:</strong> {product.orientation}</p>
//         </div>
//       </div>
//     </div>
//   );
// }



// app/buynow/[id]/BuyNowClient.jsx
// 'use client';

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams } from 'next/navigation';
// import {
//   Heart,
//   ShoppingCart,
//   Zap,
//   Truck,
//   Shield,
//   Star,
//   ChevronLeft,
//   ChevronRight,
//   Frame,
//   Ruler,
//   Package,
//   Sparkles,
// } from 'lucide-react';

// export default function BuyNowClient() {
//   const { id } = useParams();

//   const [product, setProduct] = useState(null);
//   const [loadingProduct, setLoadingProduct] = useState(true);
//   const [productError, setProductError] = useState('');

//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [isLiked, setIsLiked] = useState(false);
//   const [selectedSize, setSelectedSize] = useState('8x10');
//   const [selectedColor, setSelectedColor] = useState('Natural Oak');

//   const [frameMaterial, setFrameMaterial] = useState('wood');
//   const [frameThickness, setFrameThickness] = useState(20);
//   const [orientation, setOrientation] = useState('portrait');
//   const [uploadedImageUrl, setUploadedImageUrl] = useState('');
//   const [paymentMethod, setPaymentMethod] = useState('COD');
//   const [placingOrder, setPlacingOrder] = useState(false);
//   const [orderError, setOrderError] = useState('');
//   const [orderSuccess, setOrderSuccess] = useState('');
//   const [uploading, setUploading] = useState(false);

//   const sizes = ['5x7', '8x10', '11x14', '16x20'];
//   const colors = ['Natural Oak', 'Walnut Brown', 'Pure White', 'Matte Black'];

//   const features = [
//     { icon: <Frame className="w-8 h-8" />, title: 'Premium Wood', desc: 'Handcrafted solid wood frame' },
//     { icon: <Sparkles className="w-8 h-8" />, title: 'UV Protection', desc: 'Crystal clear acrylic glass' },
//     { icon: <Ruler className="w-8 h-8" />, title: 'Perfect Fit', desc: 'Pre-cut mat board included' },
//     { icon: <Package className="w-8 h-8" />, title: 'Easy Hanging', desc: 'Hardware & stand included' },
//   ];

//   // Fetch product by id
//   useEffect(() => {
//     if (!id) return;

//     const fetchProduct = async () => {
//       try {
//         setLoadingProduct(true);
//         setProductError('');
//         const token = localStorage.getItem('token'); // only if route is protected
//         const res = await axios.get(
//           `http://localhost:4000/api/products/${id}`,
//           token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
//         );
//         setProduct(res.data);
//       } catch (err) {
//         const msg =
//           err.response?.data?.message ||
//           err.message ||
//           'Failed to load product';
//         setProductError(msg);
//       } finally {
//         setLoadingProduct(false);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   const handleBuyNow = async () => {
//     try {
//       setPlacingOrder(true);
//       setOrderError('');
//       setOrderSuccess('');

//       const token = localStorage.getItem('token');
//       if (!token) {
//         setOrderError('Please log in to place an order.');
//         setPlacingOrder(false);
//         return;
//       }

//       if (!uploadedImageUrl) {
//         setOrderError('Please upload a photo to be framed.');
//         setPlacingOrder(false);
//         return;
//       }

//       if (!product?._id) {
//         setOrderError('Product data not loaded.');
//         setPlacingOrder(false);
//         return;
//       }

//       const item = {
//         productId: product._id,
//         quantity,
//         size: selectedSize,
//         frameColor: selectedColor,
//         frameMaterial,
//         frameThickness,
//         orientation,
//         imageUrl: uploadedImageUrl,
//         price: product.price,
//       };

//       const totalAmount = item.price * item.quantity;

//       const res = await axios.post(
//         'http://localhost:4000/api/orders',
//         {
//           items: [item],
//           totalAmount,
//           paymentMethod,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setOrderSuccess('Order placed successfully!');
//       console.log('Order created:', res.data);
//     } catch (err) {
//       const msg =
//         err.response?.data?.message ||
//         err.message ||
//         'Failed to place order';
//       setOrderError(msg);
//     } finally {
//       setPlacingOrder(false);
//     }
//   };

//   const handleUpload = async (e) => {
//     const file = e.target.files && e.target.files[0];
//     if (!file) return;

//     try {
//       setUploading(true);
//       setOrderError('');
//       const formData = new FormData();
//       formData.append('file', file);

//       const token = localStorage.getItem('token');

//       const res = await axios.post(
//         'http://localhost:4000/api/upload',
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             Authorization: token ? `Bearer ${token}` : '',
//           },
//         }
//       );

//       setUploadedImageUrl(res.data.imageUrl);
//     } catch (err) {
//       const msg =
//         err.response?.data?.message ||
//         err.message ||
//         'Failed to upload image';
//       setOrderError(msg);
//     } finally {
//       setUploading(false);
//     }
//   };

//   if (loadingProduct) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-slate-600">
//         Loading product…
//       </div>
//     );
//   }

//   if (productError || !product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-600">
//         {productError || 'Product not found'}
//       </div>
//     );
//   }

//   const mainImage = product.imageUrl;
//   const images = [mainImage, mainImage, mainImage, mainImage];

//   return (
//     <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-rose-50">
//       {/* Header */}
//       <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
//           <h1 className="text-2xl font-bold bg-linear-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
//             FrameCraft
//           </h1>
//           <nav className="hidden md:flex items-center gap-8">
//             <a href="#" className="text-gray-700 hover:text-amber-600 transition font-medium">Frames</a>
//             <a href="#" className="text-gray-700 hover:text-amber-600 transition font-medium">Gallery</a>
//             <a href="#" className="text-gray-700 hover:text-amber-600 transition font-medium">Custom</a>
//           </nav>
//           <div className="flex items-center gap-4">
//             <button className="p-2 hover:bg-gray-100 rounded-full transition">
//               <Heart className="w-6 h-6 text-gray-700" />
//             </button>
//             <button className="p-2 hover:bg-gray-100 rounded-full transition relative">
//               <ShoppingCart className="w-6 h-6 text-gray-700" />
//               <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
//                 3
//               </span>
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid lg:grid-cols-2 gap-12">
//           {/* Left column - images */}
//           <div className="space-y-4">
//             <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden group p-8">
//               <img
//                 src={images[selectedImage]}
//                 alt={product.title}
//                 className="w-full h-[500px] object-contain transition-transform duration-500 group-hover:scale-105"
//               />

//               <button
//                 onClick={() => setIsLiked(!isLiked)}
//                 className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:scale-110 transition"
//               >
//                 <Heart
//                   className={`w-6 h-6 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-700'}`}
//                 />
//               </button>

//               <div className="absolute top-6 left-6 px-4 py-2 bg-linear-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg">
//                 Handcrafted
//               </div>

//               <button
//                 onClick={() =>
//                   setSelectedImage((selectedImage - 1 + images.length) % images.length)
//                 }
//                 className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition"
//               >
//                 <ChevronLeft className="w-6 h-6" />
//               </button>
//               <button
//                 onClick={() =>
//                   setSelectedImage((selectedImage + 1) % images.length)
//                 }
//                 className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition"
//               >
//                 <ChevronRight className="w-6 h-6" />
//               </button>
//             </div>

//             <div className="grid grid-cols-4 gap-4">
//               {images.map((img, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setSelectedImage(idx)}
//                   className={`relative rounded-xl overflow-hidden border-4 transition ${selectedImage === idx
//                       ? 'border-amber-500 shadow-lg'
//                       : 'border-transparent hover:border-gray-300'
//                     }`}
//                 >
//                   <img src={img} alt={`View ${idx + 1}`} className="w-full h-24 object-cover" />
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Right column - details */}
//           <div className="space-y-6">
//             <div>
//               <div className="flex items-center gap-2 mb-2">
//                 <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
//                   In Stock
//                 </span>
//                 <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
//                   Free Shipping
//                 </span>
//               </div>
//               <h1 className="text-4xl font-bold text-gray-900 mb-2">
//                 {product.title}
//               </h1>
//               <div className="flex items-center gap-2">
//                 <div className="flex items-center">
//                   {[...Array(5)].map((_, i) => (
//                     <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
//                   ))}
//                 </div>
//                 <span className="text-gray-600 font-medium">(487 reviews)</span>
//               </div>
//             </div>

//             <div className="flex items-baseline gap-3">
//               <span className="text-5xl font-bold bg-linear-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
//                 ₹{product.price}
//               </span>
//               <span className="text-2xl text-gray-400 line-through">
//                 ₹{Math.round(product.price * 1.6)}
//               </span>
//               <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-full">
//                 38% OFF
//               </span>
//             </div>

//             <p className="text-gray-600 text-lg leading-relaxed">
//               Elevate your cherished memories with our handcrafted frames, made to fit your exact
//               preferences in size, color, and orientation.
//             </p>

//             {/* Size */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-900 mb-3">
//                 Select Size
//               </label>
//               <div className="grid grid-cols-4 gap-3">
//                 {sizes.map((size) => (
//                   <button
//                     key={size}
//                     onClick={() => setSelectedSize(size)}
//                     className={`py-3 px-4 rounded-xl font-semibold transition ${selectedSize === size
//                         ? 'bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-lg'
//                         : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
//                       }`}
//                   >
//                     {size}"
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Color */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-900 mb-3">
//                 Select Color
//               </label>
//               <div className="grid grid-cols-2 gap-3">
//                 {colors.map((color) => (
//                   <button
//                     key={color}
//                     onClick={() => setSelectedColor(color)}
//                     className={`py-3 px-4 rounded-xl font-medium transition text-left ${selectedColor === color
//                         ? 'bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-lg'
//                         : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
//                       }`}
//                   >
//                     {color}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Material / thickness / orientation */}
//             <div className="grid sm:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-xs font-semibold text-gray-900 mb-1">
//                   Frame Material
//                 </label>
//                 <select
//                   value={frameMaterial}
//                   onChange={(e) => setFrameMaterial(e.target.value)}
//                   className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
//                 >
//                   <option value="wood">Wood</option>
//                   <option value="metal">Metal</option>
//                   <option value="acrylic">Acrylic</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-xs font-semibold text-gray-900 mb-1">
//                   Thickness (mm)
//                 </label>
//                 <input
//                   type="number"
//                   min={5}
//                   max={50}
//                   value={frameThickness}
//                   onChange={(e) => setFrameThickness(Number(e.target.value))}
//                   className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-semibold text-gray-900 mb-1">
//                   Orientation
//                 </label>
//                 <select
//                   value={orientation}
//                   onChange={(e) => setOrientation(e.target.value)}
//                   className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
//                 >
//                   <option value="portrait">Portrait</option>
//                   <option value="landscape">Landscape</option>
//                   <option value="square">Square</option>
//                 </select>
//               </div>
//             </div>

//             {/* Upload */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-900 mb-2">
//                 Upload Photo to Frame
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleUpload}
//                 className="block w-full text-sm text-gray-700
//                            file:mr-4 file:py-2 file:px-4
//                            file:rounded-full file:border-0
//                            file:text-sm file:font-semibold
//                            file:bg-amber-50 file:text-amber-700
//                            hover:file:bg-amber-100"
//               />
//               {uploading && (
//                 <p className="mt-2 text-xs text-gray-500">Uploading image…</p>
//               )}
//               {uploadedImageUrl && !uploading && (
//                 <p className="mt-2 text-xs text-emerald-600">
//                   Image uploaded and ready to frame.
//                 </p>
//               )}
//             </div>

//             {/* Features */}
//             <div className="grid grid-cols-2 gap-4">
//               {features.map((feature, idx) => (
//                 <div
//                   key={idx}
//                   className="p-4 bg-white rounded-2xl shadow-md hover:shadow-xl transition border border-gray-100"
//                 >
//                   <div className="text-amber-600 mb-2">{feature.icon}</div>
//                   <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
//                   <p className="text-sm text-gray-600">{feature.desc}</p>
//                 </div>
//               ))}
//             </div>

//             {/* Delivery */}
//             <div className="flex gap-4 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
//               <Truck className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
//               <div>
//                 <p className="font-semibold text-gray-900">Fast & Free Delivery</p>
//                 <p className="text-sm text-gray-600">
//                   Arrives within 5–7 days • Free standard shipping
//                 </p>
//               </div>
//             </div>

//             {/* Warranty */}
//             <div className="flex gap-4 p-4 bg-linear-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
//               <Shield className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
//               <div>
//                 <p className="font-semibold text-gray-900">Quality Guarantee</p>
//                 <p className="text-sm text-gray-600">
//                   30-day money back guarantee • Lifetime craftsmanship warranty
//                 </p>
//               </div>
//             </div>

//             {/* Quantity */}
//             <div className="flex items-center gap-4">
//               <span className="font-semibold text-gray-900">Quantity:</span>
//               <div className="flex items-center gap-3 bg-white rounded-full shadow-md px-2 border border-gray-200">
//                 <button
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   className="w-10 h-10 rounded-full hover:bg-gray-100 transition font-bold text-xl"
//                 >
//                   −
//                 </button>
//                 <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
//                 <button
//                   onClick={() => setQuantity(quantity + 1)}
//                   className="w-10 h-10 rounded-full hover:bg-gray-100 transition font-bold text-xl"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             {/* Payment */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-900 mb-1">
//                 Payment Method
//               </label>
//               <select
//                 value={paymentMethod}
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//                 className="w-full max-w-xs px-3 py-2 rounded-xl border border-gray-200 text-sm"
//               >
//                 <option value="COD">Cash on Delivery</option>
//                 <option value="UPI">UPI</option>
//                 <option value="CARD">Card</option>
//                 <option value="NETBANKING">Netbanking</option>
//               </select>
//             </div>

//             {orderError && (
//               <p className="text-sm text-red-600">{orderError}</p>
//             )}
//             {orderSuccess && (
//               <p className="text-sm text-emerald-600">{orderSuccess}</p>
//             )}

//             {/* Buttons */}
//             <div className="flex gap-4">
//               <button className="flex-1 py-4 bg-linear-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-2xl hover:shadow-2xl hover:scale-105 transition transform flex items-center justify-center gap-2">
//                 <ShoppingCart className="w-5 h-5" />
//                 Add to Cart
//               </button>
//               <button
//                 onClick={handleBuyNow}
//                 disabled={placingOrder}
//                 className="flex-1 py-4 bg-linear-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-2xl hover:shadow-2xl hover:scale-105 transition transform flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
//               >
//                 <Zap className="w-5 h-5" />
//                 {placingOrder ? 'Placing Order...' : 'Buy Now'}
//               </button>
//             </div>

//             {/* Trust badges */}
//             <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200">
//               <div className="text-center">
//                 <p className="text-2xl font-bold text-gray-900">500+</p>
//                 <p className="text-xs text-gray-600">Happy Customers</p>
//               </div>
//               <div className="w-px h-10 bg-gray-300"></div>
//               <div className="text-center">
//                 <p className="text-2xl font-bold text-gray-900">4.9★</p>
//                 <p className="text-xs text-gray-600">Average Rating</p>
//               </div>
//               <div className="w-px h-10 bg-gray-300"></div>
//               <div className="text-center">
//                 <p className="text-2xl font-bold text-gray-900">100%</p>
//                 <p className="text-xs text-gray-600">Eco-Friendly</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingCart,
  Zap,
  Truck,
  Shield,
  Star,
  ChevronLeft,
  ChevronRight,
  Frame,
  Ruler,
  Package,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/cartContext';
import Link from 'next/link';

export default function BuyNowClient() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, getTotalItems, toggleCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [productError, setProductError] = useState('');

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedSize, setSelectedSize] = useState('8x10');
  const [selectedColor, setSelectedColor] = useState('Natural Oak');

  const [frameMaterial, setFrameMaterial] = useState('wood');
  const [frameThickness, setFrameThickness] = useState('');
  const [orientation, setOrientation] = useState('portrait');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  const sizes = ['5x7', '8x10', '11x14', '16x20'];  
  const colors = ['Natural Oak', 'Walnut Brown', 'Pure White', 'Matte Black'];

  const features = [
    { icon: <Frame className="w-8 h-8" />, title: 'Premium Wood', desc: 'Handcrafted solid wood frame' },
    { icon: <Sparkles className="w-8 h-8" />, title: 'UV Protection', desc: 'Crystal clear acrylic glass' },
    { icon: <Ruler className="w-8 h-8" />, title: 'Perfect Fit', desc: 'Pre-cut mat board included' },
    { icon: <Package className="w-8 h-8" />, title: 'Easy Hanging', desc: 'Hardware & stand included' },
  ];
  const handleAddToCart = () => {
    if (!uploadedImageUrl) {
      setOrderError('Please upload a photo to be framed.');
      return;
    }

    const customization = {
      quantity,
      size: selectedSize,
      frameColor: selectedColor,
      frameMaterial,
      frameThickness,
      orientation,
      uploadedImageUrl,
    };

    addToCart(product, customization);
    setOrderError('');
    setOrderSuccess('Added to cart successfully!');

    setTimeout(() => {
      router.push('/cart');
    }, 800)

    // Clear success message after 3 seconds
    setTimeout(() => setOrderSuccess(''), 3000);
  };

  // Fetch product by id
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        setProductError('');
        const token = localStorage.getItem('token'); // only if route is protected
        const res = await axios.get(
          `http://localhost:4000/api/products/${id}`,
          token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
        );
        setProduct(res.data);
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          'Failed to load product';
        setProductError(msg);
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [id]);

  // const handleBuyNow = async () => {

  const handleBuyNow = () => {
    if (!uploadedImageUrl) {
      setOrderError('Please upload a photo to be framed.');
      return;
    }

    if (!product?._id) {
      setOrderError('Product data not loaded.');
      return;
    }

    // Build a simple object with everything checkout needs
    const checkoutProduct = {
      productId: product._id,
      title: product.title,
      category: product.category || '',
      price: product.price,
      quantity,
      size: selectedSize,
      frameColor: selectedColor,
      frameMaterial,
      frameThickness,
      orientation,
      imageUrl: product.imageUrl,
      uploadedImageUrl, // user-selected image
    };

    // Save to sessionStorage for the checkout page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('checkoutProduct', JSON.stringify(checkoutProduct));
    }

    // Clear any previous errors and go to checkout
    setOrderError('');
    router.push('/checkout');
  };

  //   try {
  //     setPlacingOrder(true);
  //     setOrderError('');
  //     setOrderSuccess('');

  //     const token = localStorage.getItem('token');
  //     if (!token) {
  //       setOrderError('Please log in to place an order.');
  //       setPlacingOrder(false);
  //       return;
  //     }

  //     if (!uploadedImageUrl) {
  //       setOrderError('Please upload a photo to be framed.');
  //       setPlacingOrder(false);
  //       return;
  //     }

  //     if (!product?._id) {
  //       setOrderError('Product data not loaded.');
  //       setPlacingOrder(false);
  //       return;
  //     }

  //     const item = {
  //       productId: product._id,
  //       quantity,
  //       size: selectedSize,
  //       frameColor: selectedColor,
  //       frameMaterial,
  //       frameThickness,
  //       orientation,
  //       imageUrl: uploadedImageUrl,
  //       price: product.price,
  //     };

  //     const totalAmount = item.price * item.quantity;

  //     const res = await axios.post(
  //       'http://localhost:4000/api/orders',
  //       {
  //         items: [item],
  //         totalAmount,
  //         paymentMethod,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     setOrderSuccess('Order placed successfully!');
  //     console.log('Order created:', res.data);
  //   } catch (err) {
  //     const msg =
  //       err.response?.data?.message ||
  //       err.message ||
  //       'Failed to place order';
  //     setOrderError(msg);
  //   } finally {
  //     setPlacingOrder(false);
  //   }
  // };

  const handleUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setOrderError('');
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');

      const res = await axios.post(
        'http://localhost:4000/api/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );

      setUploadedImageUrl(res.data.imageUrl);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to upload image';
      setOrderError(msg);
    } finally {
      setUploading(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading product…
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {productError || 'Product not found'}
      </div>
    );
  }

  const mainImage = product.imageUrl;
  const images = [mainImage, mainImage, mainImage, mainImage];

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-linear-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
            FrameCraft
          </h1>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-700 hover:text-amber-600 transition font-medium">Frames</a>
            <a href="#" className="text-gray-700 hover:text-amber-600 transition font-medium">Gallery</a>
            <a href="#" className="text-gray-700 hover:text-amber-600 transition font-medium">Custom</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <Heart className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={toggleCart}
              className="p-2 hover:bg-gray-100 rounded-full transition relative"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left column - images */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden group p-8">
              <img
                src={images[selectedImage]}
                alt={product.title}
                className="w-full h-[500px] object-contain transition-transform duration-500 group-hover:scale-105"
              />

              <button
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:scale-110 transition"
              >
                <Heart
                  className={`w-6 h-6 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-700'}`}
                />
              </button>

              <div className="absolute top-6 left-6 px-4 py-2 bg-linear-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg">
                Handcrafted
              </div>

              <button
                onClick={() =>
                  setSelectedImage((selectedImage - 1 + images.length) % images.length)
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() =>
                  setSelectedImage((selectedImage + 1) % images.length)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative rounded-xl overflow-hidden border-4 transition ${selectedImage === idx
                    ? 'border-amber-500 shadow-lg'
                    : 'border-transparent hover:border-gray-300'
                    }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-24 object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right column - details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                  In Stock
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                  Free Shipping
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">(487 reviews)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold bg-linear-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                ₹{product.price}
              </span>
              <span className="text-2xl text-gray-400 line-through">
                ₹{Math.round(product.price * 1.6)}
              </span>
              <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-full">
                38% OFF
              </span>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed">
              Elevate your cherished memories with our handcrafted frames, made to fit your exact
              preferences in size, color, and orientation.
            </p>

            {/* Size */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Select Size
              </label>
              <div className="grid grid-cols-4 gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 rounded-xl font-semibold transition ${selectedSize === size
                      ? 'bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                      }`}
                  >
                    {size}"
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Select Color
              </label>
              <div className="grid grid-cols-2 gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`py-3 px-4 rounded-xl font-medium transition text-left ${selectedColor === color
                      ? 'bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                      }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Material / thickness / orientation */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Frame Material
                </label>
                <select
                  value={frameMaterial}
                  onChange={(e) => setFrameMaterial(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-black border-gray-200 text-sm active:ring-2"
                >
                  <option value="wood">Wood</option>
                  <option value="metal">Metal</option>
                  <option value="acrylic">Acrylic</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Frame Thickness (mm)
                </label>
                <input
                  type="number"
                  min={5}
                  max={50}
                  value={frameThickness}
                  onChange={(e) => setFrameThickness(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border text-black border-gray-200 text-sm active:ring-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Orientation
                </label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-black border-gray-200 text-sm active:ring-2 "
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                  <option value="square">Square</option>
                </select>
              </div>
            </div>

            {/* Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Upload Photo to Frame
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="block w-full text-sm text-gray-700
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-full file:border-0
                           file:text-sm file:font-semibold
                           file:bg-amber-50 file:text-amber-700
                           hover:file:bg-amber-100"
              />
              {uploading && (
                <p className="mt-2 text-xs text-gray-500">Uploading image…</p>
              )}
              {uploadedImageUrl && !uploading && (
                <p className="mt-2 text-xs text-emerald-600">
                  Image uploaded and ready to frame.
                </p>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white rounded-2xl shadow-md hover:shadow-xl transition border border-gray-100"
                >
                  <div className="text-amber-600 mb-2">{feature.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Delivery */}
            <div className="flex gap-4 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <Truck className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Fast & Free Delivery</p>
                <p className="text-sm text-gray-600">
                  Arrives within 5–7 days • Free standard shipping
                </p>
              </div>
            </div>

            {/* Warranty */}
            <div className="flex gap-4 p-4 bg-linear-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
              <Shield className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Quality Guarantee</p>
                <p className="text-sm text-gray-600">
                  30-day money back guarantee • Lifetime craftsmanship warranty
                </p>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-900">Quantity:</span>
              <div className="flex items-center gap-3  rounded-full shadow-md px-2 border border-gray-200 bg-black">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 hover:text-black cursor-pointer transition font-bold text-xl"
                >
                  −
                </button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 hover:text-black cursor-pointer transition font-bold text-xl"
                >
                  +
                </button>
              </div>
            </div>

            {/* Payment */}
            {/* <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full max-w-xs px-3 py-2 rounded-xl border border-gray-200 text-sm"
              >
                <option value="COD">Cash on Delivery</option>
                <option value="UPI">UPI</option>
                <option value="CARD">Card</option>
                <option value="NETBANKING">Netbanking</option>
              </select>
            </div> */}

            {orderError && (
              <p className="text-sm text-red-600">{orderError}</p>
            )}
            {orderSuccess && (
              <p className="text-sm text-emerald-600">{orderSuccess}</p>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-linear-to-r cursor-pointer from-amber-500 to-orange-500 text-white font-semibold rounded-2xl hover:shadow-2xl hover:scale-105 transition transform flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>

              {/* <Link href={`/checkout/${product._id}`}> */}
                <button
                  onClick={handleAddToCart}
                  disabled={placingOrder}
                  className="flex-1 py-4 cursor-pointer bg-linear-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-2xl hover:shadow-2xl hover:scale-105 transition transform flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Zap className="w-5 h-5" />
                  {placingOrder ? 'Placing Order...' : 'Buy Now'}
                </button>
              {/* </Link> */}
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">500+</p>
                <p className="text-xs text-gray-600">Happy Customers</p>
              </div>
              <div className="w-px h-10 bg-gray-300"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">4.9★</p>
                <p className="text-xs text-gray-600">Average Rating</p>
              </div>
              <div className="w-px h-10 bg-gray-300"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-xs text-gray-600">Eco-Friendly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
