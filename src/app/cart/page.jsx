// 'use client';

// import { useEffect, useState } from 'react';
// import { Trash2 } from 'lucide-react';
// import { useCart } from '@/context/CartContext';

// export default function CartPage() {
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Load cart from localStorage (guest cart)
//   useEffect(() => {
//     const saved = localStorage.getItem('frame-cart');
//     if (saved) {
//       setCart(JSON.parse(saved));
//     }
//     setLoading(false);
//   }, []);

//   const saveCart = (next) => {
//     setCart(next);
//     localStorage.setItem('frame-cart', JSON.stringify(next));
//   };

//   const updateQty = (productId, qty) => {
//     if (qty < 1) return;
//     saveCart(
//       cart.map((item) =>
//         item.productId === productId ? { ...item, quantity: qty } : item
//       )
//     );
//   };

//   const removeItem = (productId) => {
//     saveCart(cart.filter((item) => item.productId !== productId));
//   };

//   const subtotal = cart.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   if (loading) {
//     return (
//       <main className="max-w-4xl mx-auto px-4 py-16">
//         <p className="text-slate-500">Loading your frames…</p>
//       </main>
//     );
//   }
//   const { cart } = useCart();

//   if (cart.length === 0) {
//     return (
//       <main className="max-w-4xl mx-auto px-4 py-16">
//         <h1 className="text-3xl font-bold mb-4 text-slate-900">Your Frame Cart</h1>
//         <p className="text-slate-500">No frames added yet.</p>
//       </main>
//     );
//   }

//   return (
//     <main className="max-w-4xl mx-auto px-4 py-16">
//       <h1 className="text-3xl font-bold mb-6 text-slate-900">Your Frame Cart</h1>

//       <div className="space-y-4 mb-8">
//         {cart.map((item) => (
//           <div
//             key={item.productId}
//             className="flex gap-4 bg-white rounded-xl shadow-sm p-4 items-center"
//           >
//             {item.imageUrl ? (
//               <img
//                 src={item.imageUrl}
//                 alt={item.title}
//                 className="w-20 h-20 rounded-lg object-cover"
//               />
//             ) : (
//               <div className="w-20 h-20 rounded-lg bg-slate-100" />
//             )}

//             <div className="flex-1">
//               <h2 className="font-semibold text-slate-900">{item.title}</h2>
//               <p className="text-sm text-slate-500">
//                 ₹ {item.price.toLocaleString('en-IN')} per frame
//               </p>
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => updateQty(item.productId, item.quantity - 1)}
//                 className="px-2 py-1 rounded bg-slate-100"
//               >
//                 -
//               </button>
//               <span className="w-8 text-center">{item.quantity}</span>
//               <button
//                 onClick={() => updateQty(item.productId, item.quantity + 1)}
//                 className="px-2 py-1 rounded bg-slate-100"
//               >
//                 +
//               </button>
//             </div>

//             <div className="w-28 text-right font-semibold text-slate-900">
//               ₹ {(item.price * item.quantity).toLocaleString('en-IN')}
//             </div>

//             <button
//               onClick={() => removeItem(item.productId)}
//               className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
//             >
//               <Trash2 className="w-4 h-4" />
//             </button>
//           </div>
//         ))}
//       </div>

//       <div className="flex justify-between items-center border-t pt-4">
//         <p className="text-xl font-bold text-slate-900">
//           Subtotal: ₹ {subtotal.toLocaleString('en-IN')}
//         </p>
//         <button
//           onClick={() => {
//             // later: call backend /api/orders to place frame order
//           }}
//           className="px-6 py-3 rounded-full bg-slate-900 text-white hover:bg-slate-800"
//         >
//           Checkout Frames
//         </button>
//       </div>
//     </main>
//   );
// }



// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useCart } from '@/context/cartContext';
// import {
//   ShoppingCart,
//   Trash2,
//   Plus,
//   Minus,
//   ArrowLeft,
//   CreditCard,
//   Truck,
//   ShieldCheck,
// } from 'lucide-react';
// import axios from 'axios';

// export default function CartPage() {
//   const router = useRouter();
//   const {
//     cartItems,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     getTotalPrice,
//     getTotalItems,
//   } = useCart();

//   const [paymentMethod, setPaymentMethod] = useState('COD');
//   const [placingOrder, setPlacingOrder] = useState(false);
//   const [orderError, setOrderError] = useState('');
//   const [orderSuccess, setOrderSuccess] = useState('');
//   const routerpush = useRouter();
//   const handleCheckout = async () => {
//     // try {
//     //   setPlacingOrder(true);
//     //   setOrderError('');
//     //   setOrderSuccess('');

//     //   const token = localStorage.getItem('token');
//     //   if (!token) {
//     //     setOrderError('Please log in to place an order.');
//     //     router.push('/login');
//     //     return;
//     //   }

//     //   if (cartItems.length === 0) {
//     //     setOrderError('Your cart is empty.');
//     //     return;
//     //   }

//     //   const items = cartItems.map((item) => ({
//     //     productId: item.productId,
//     //     quantity: item.quantity,
//     //     size: item.size,
//     //     frameColor: item.frameColor,
//     //     frameMaterial: item.frameMaterial,
//     //     frameThickness: item.frameThickness,
//     //     orientation: item.orientation,
//     //     imageUrl: item.uploadedImageUrl,
//     //     price: item.price,
//     //   }));

//     //   const res = await axios.post(
//     //     'http://localhost:4000/api/orders',
//     //     {
//     //       items,
//     //       totalAmount: getTotalPrice(),
//     //       paymentMethod,
//     //     },
//     //     {
//     //       headers: { Authorization: `Bearer ${token}` },
//     //     }
//     //   );

//     //   setOrderSuccess('Order placed successfully!');
//     //   // clearCart();

//     //   // Redirect to orders page after 2 seconds
//     //   setTimeout(() => {
//     //     router.push('/checkout');
//     //   }, 2000);
//     // } catch (err) {
//     //   const msg =
//     //     err.response?.data?.message || err.message || 'Failed to place order';
//     //   setOrderError(msg);
//     // } finally {
//     //   setPlacingOrder(false);
//     // }

//     routerpush.push('/checkout')
//   };

//   if (cartItems.length === 0) {
//     return (
//       <div className="bg-linear-to-br from-amber-50 via-orange-50 to-rose-50 py-40">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
//             <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">
//               Your Cart is Empty
//             </h2>
//             <p className="text-gray-600 mb-8">
//               Looks like you haven't added any items to your cart yet.
//             </p>
//             <button
//               onClick={() => router.back()}
//               className="inline-flex items-center cursor-pointer gap-2 px-8 py-4 bg-linear-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-2xl hover:shadow-2xl hover:scale-105 transition transform"
//             >
//               <ArrowLeft className="w-5 h-5" />
//               Continue Shopping
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-rose-50 py-28">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-4xl font-bold text-gray-900 mb-2">
//               Shopping Cart
//             </h1>
//             <p className="text-gray-600">
//               {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
//             </p>
//           </div>
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold transition"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             Continue Shopping
//           </button>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Cart Items */}
//           <div className="lg:col-span-2 space-y-4">
//             {cartItems.map((item, index) => (
//               <div
//                 key={index}
//                 className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
//               >
//                 <div className="flex gap-6">
//                   {/* Product Image */}
//                   <div className="w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-100">
//                     {/* <img
//                       src={item.uploadedImageUrl ? `http://localhost:4000/api/uploads/${item.uploadedImageUrl}`: item.imageUrl}
//                       alt={item.title}
//                       className="w-full h-full object-cover"
//                     /> */}
//                     <img
//                       src={
//                         item.uploadedImageUrl
//                           ? `http://localhost:4000${item.uploadedImageUrl}`  // "/uploads/abc.jpg"
//                           : item.imageUrl
//                       }
//                       alt={item.title}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>

//                   {/* Product Details */}
//                   <div className="flex-1">
//                     <div className="flex justify-between mb-2">
//                       <h3 className="text-xl font-bold text-gray-900">
//                         {item.title}
//                       </h3>
//                       <button
//                         onClick={() => removeFromCart(index)}
//                         className="text-red-500 hover:text-red-700 transition p-2 cursor-pointer hover:bg-red-50 rounded-lg"
//                       >
//                         <Trash2 className="w-5 h-5" />
//                       </button>
//                     </div>

//                     <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
//                       <p>
//                         <span className="font-semibold">Size:</span> {item.size}"
//                       </p>
//                       <p>
//                         <span className="font-semibold">Color:</span>{' '}
//                         {item.frameColor}
//                       </p>
//                       <p>
//                         <span className="font-semibold">Material:</span>{' '}
//                         {item.frameMaterial}
//                       </p>
//                       <p>
//                         <span className="font-semibold">Orientation:</span>{' '}
//                         {item.orientation}
//                       </p>
//                     </div>

//                     <div className="flex items-center justify-between">
//                       {/* Quantity Controls */}
//                       <div className="flex items-center gap-3 bg-black rounded-full px-2 py-1">
//                         <button
//                           onClick={() =>
//                             updateQuantity(index, item.quantity - 1)
//                           }
//                           className="w-8 h-8 rounded-full hover:bg-white hover:text-black cursor-pointer transition font-bold"
//                         >
//                           <Minus className="w-4 h-4 mx-auto" />
//                         </button>
//                         <span className="w-8 text-center font-semibold">
//                           {item.quantity}
//                         </span>
//                         <button
//                           onClick={() =>
//                             updateQuantity(index, item.quantity + 1)
//                           }
//                           className="w-8 h-8 rounded-full hover:bg-white hover:text-black cursor-pointer transition font-bold"
//                         >
//                           <Plus className="w-4 h-4 mx-auto" />
//                         </button>
//                       </div>

//                       {/* Price */}
//                       <div className="text-right">
//                         <p className="text-2xl font-bold bg-linear-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
//                           ₹{(item.price * item.quantity).toLocaleString()}
//                         </p>
//                         <p className="text-sm text-gray-500">
//                           ₹{item.price} each
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}

//             <button
//               onClick={clearCart}
//               className="w-full py-3 text-red-600 hover:text-red-700 font-semibold hover:bg-red-50 rounded-xl transition"
//             >
//               Clear Cart
//             </button>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">
//                 Order Summary
//               </h2>

//               <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
//                 <div className="flex justify-between text-gray-600">
//                   <span>Subtotal ({getTotalItems()} items)</span>
//                   <span className="font-semibold">
//                     ₹{getTotalPrice().toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-gray-600">
//                   <span>Shipping</span>
//                   <span className="font-semibold text-green-600">FREE</span>
//                 </div>
//                 <div className="flex justify-between text-gray-600">
//                   <span>Tax</span>
//                   <span className="font-semibold">Calculated at checkout</span>
//                 </div>
//               </div>

//               <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
//                 <span>Total</span>
//                 <span className="bg-linear-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
//                   ₹{getTotalPrice().toLocaleString()}
//                 </span>
//               </div>

//               {/* Payment Method */}
//               {/* <div className="mb-6">
//                 <label className="block text-sm font-semibold text-gray-900 mb-3">
//                   Payment Method
//                 </label>
//                 <select
//                   value={paymentMethod}
//                   onChange={(e) => setPaymentMethod(e.target.value)}
//                   className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:outline-none transition"
//                 >
//                   <option value="COD">Cash on Delivery</option>
//                   <option value="UPI">UPI</option>
//                   <option value="CARD">Card</option>
//                   <option value="NETBANKING">Netbanking</option>
//                 </select>
//               </div> */}

//               {orderError && (
//                 <p className="text-sm text-red-600 mb-4">{orderError}</p>
//               )}
//               {orderSuccess && (
//                 <p className="text-sm text-green-600 mb-4">{orderSuccess}</p>
//               )}


//               <button
//                 onClick={handleCheckout}
//                 disabled={placingOrder}
//                 className="w-full py-4 bg-linear-to-r from-amber-500 to-orange-500 text-white cursor-pointer font-semibold rounded-2xl hover:shadow-2xl hover:scale-105 transition transform flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mb-4"
//               >
//                 <CreditCard className="w-5 h-5" />
//                 {placingOrder ? 'Processing...' : 'Proceed to Checkout'}
//               </button>

//               {/* Trust Badges */}
//               <div className="space-y-3 pt-6 border-t border-gray-200">
//                 <div className="flex items-center gap-3 text-sm text-gray-600">
//                   <Truck className="w-5 h-5 text-blue-600" />
//                   <span>Free shipping on all orders</span>
//                 </div>
//                 <div className="flex items-center gap-3 text-sm text-gray-600">
//                   <ShieldCheck className="w-5 h-5 text-green-600" />
//                   <span>Secure payment processing</span>
//                 </div>
//                 <div className="flex items-center gap-3 text-sm text-gray-600">
//                   <ShoppingCart className="w-5 h-5 text-amber-600" />
//                   <span>30-day money back guarantee</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useCart } from '@/context/cartContext';
// import {
//   ShoppingCart,
//   Trash2,
//   Plus,
//   Minus,
//   ArrowLeft,
//   CreditCard,
//   Truck,
//   ShieldCheck,
// } from 'lucide-react';

// export default function CartPage() {
//   const router = useRouter();
//   const {
//     cartItems,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     getTotalPrice,
//     getTotalItems,
//   } = useCart();

//   // Load frameCart items from localStorage
//   const [frameCartItems, setFrameCartItems] = useState([]);

//   useEffect(() => {
//     const frameCart = JSON.parse(localStorage.getItem('frameCart') || '[]');
//     setFrameCartItems(frameCart);
//   }, []);

//   const [paymentMethod, setPaymentMethod] = useState('COD');
//   const [placingOrder, setPlacingOrder] = useState(false);
//   const [orderError, setOrderError] = useState('');
//   const [orderSuccess, setOrderSuccess] = useState('');

//   // ✅ FIXED: Clear ALL cart items (regular + custom)
//   const clearAllCart = () => {
//     clearCart(); // Clear regular cart
//     localStorage.removeItem('frameCart'); // Clear custom frames
//     setFrameCartItems([]); // Update state
//   };

//   // Combined cart items
//   const allCartItems = [...cartItems, ...frameCartItems];

//   const handleCheckout = () => {
//     router.push('/checkout');
//   };

//   // ✅ FIXED: Proper image source for ALL image types
//   const getImageSrc = (item) => {
//     // Custom frame from NEW editor (imageUri = data:base64)
//     if (item.imageUri && item.imageUri.startsWith('data:')) {
//       return item.imageUri;
//     }
//     // Custom frame from OLD editor (imageUri = https://)
//     if (item.imageUri) {
//       return item.imageUri;
//     }
//     // Regular cart uploaded image
//     if (item.uploadedImageUrl) {
//       return `http://localhost:4000${item.uploadedImageUrl}`;
//     }
//     // Regular cart imageUrl
//     if (item.imageUrl) {
//       return item.imageUrl;
//     }
//     return '/placeholder-frame.jpg';
//   };

//   // ✅ FIXED: Smart item type detection
//   const isCustomFrame = (item) => {
//     return item.imageUri || item.frameShapeId || item.frameShape;
//   };

//   // ✅ FIXED: Render item details
//   const renderItemDetails = (item, globalIndex) => {
//     if (!isCustomFrame(item)) {
//       // Regular cart item
//       return (
//         <>
//           <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
//             <p><span className="font-semibold">Size:</span> {item.size}"</p>
//             <p><span className="font-semibold">Color:</span> {item.frameColor}</p>
//             <p><span className="font-semibold">Material:</span> {item.frameMaterial}</p>
//             <p><span className="font-semibold">Orientation:</span> {item.orientation}</p>
//           </div>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3 bg-black rounded-full px-2 py-1">
//               <button
//                 onClick={() => updateQuantity(globalIndex, item.quantity - 1)}
//                 className="w-8 h-8 rounded-full hover:bg-white hover:text-black cursor-pointer transition font-bold"
//               >
//                 <Minus className="w-4 h-4 mx-auto" />
//               </button>
//               <span className="w-8 text-center font-semibold">{item.quantity}</span>
//               <button
//                 onClick={() => updateQuantity(globalIndex, item.quantity + 1)}
//                 className="w-8 h-8 rounded-full hover:bg-white hover:text-black cursor-pointer transition font-bold"
//               >
//                 <Plus className="w-4 h-4 mx-auto" />
//               </button>
//             </div>
//             <div className="text-right">
//               <p className="text-2xl font-bold bg-linear-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
//                 ₹{(item.price * item.quantity).toLocaleString()}
//               </p>
//               <p className="text-sm text-gray-500">₹{item.price} each</p>
//             </div>
//           </div>
//         </>
//       );
//     }

//     // Custom frame (NEW or OLD editor)
//     const sizeDisplay = item.finalWidthInch 
//       ? `${item.finalWidthInch}x${item.finalHeightInch}" (${item.orientation})`
//       : `${item.widthCm.toFixed(1)}x${item.heightCm.toFixed(1)}cm`;

//     return (
//       <>
//         <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
//           <p><span className="font-semibold">Size:</span> {sizeDisplay}</p>
//           <p><span className="font-semibold">Thickness:</span> {item.thicknessMm || item.selectedThickness}mm</p>
//           <p><span className="font-semibold">Shape:</span> {item.frameShape || item.frameShapeId?.replace('-', ' ').toUpperCase()}</p>
//           <p><span className="font-semibold">Frame Color:</span> {item.frameColor}</p>
//           <p><span className="font-semibold">Mat Color:</span> {item.matColor}</p>
//         </div>
//         <div className="flex items-center justify-between">
//           <div className="px-4 py-2 bg-black text-white hover:bg-white hover:text-black rounded-full text-sm font-medium">
//             Single Custom Item
//           </div>
//           <div className="text-right">
//             <p className="text-2xl font-bold bg-linear-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
//               ₹{item.price?.toLocaleString()}
//             </p>
//             <p className="text-sm text-gray-500">Custom Frame</p>
//           </div>
//         </div>
//       </>
//     );
//   };

//   // ✅ FIXED: Remove by correct index
//   const handleRemoveItem = (globalIndex) => {
//     if (globalIndex < cartItems.length) {
//       // Regular item
//       removeFromCart(globalIndex);
//     } else {
//       // Custom frame
//       const frameIndex = globalIndex - cartItems.length;
//       const updatedFrameCart = frameCartItems.filter((_, i) => i !== frameIndex);
//       setFrameCartItems(updatedFrameCart);
//       localStorage.setItem('frameCart', JSON.stringify(updatedFrameCart));
//     }
//   };

//   if (allCartItems.length === 0) {
//     return (
//       <div className="bg-linear-to-br from-amber-50 via-orange-50 to-rose-50 py-40">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
//             <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
//             <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
//             <button
//               onClick={() => router.back()}
//               className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-2xl hover:shadow-2xl hover:scale-105 transition transform"
//             >
//               <ArrowLeft className="w-5 h-5" />
//               Continue Shopping
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-rose-50 py-28">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
//             <p className="text-gray-600">
//               {allCartItems.length} {allCartItems.length === 1 ? 'item' : 'items'} in your cart
//             </p>
//           </div>
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold transition"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             Continue Shopping
//           </button>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Cart Items */}
//           <div className="lg:col-span-2 space-y-4">
//             {allCartItems.map((item, globalIndex) => (
//               <div
//                 key={item.id || item.timestamp || globalIndex}
//                 className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
//               >
//                 <div className="flex gap-6">
//                   {/* ✅ FIXED: Perfect image handling */}
//                   <div className="w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-100">
//                     <img
//                       src={getImageSrc(item)}
//                       alt={item.title || item.frameShape || 'Custom Frame'}
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         e.target.src = '/placeholder-frame.jpg';
//                       }}
//                     />
//                   </div>

//                   {/* Product Details */}
//                   <div className="flex-1">
//                     <div className="flex justify-between mb-2">
//                       <h3 className="text-xl font-bold text-gray-900">
//                         {item.title || 
//                          (item.frameShape 
//                            ? `Custom ${item.frameShape} Frame` 
//                            : item.frameShapeId 
//                              ? `Custom ${item.frameShapeId.replace('-', ' ').toUpperCase()} Frame`
//                              : 'Custom Photo Frame')
//                         }
//                       </h3>
//                       <button
//                         onClick={() => handleRemoveItem(globalIndex)}
//                         className="text-red-500 hover:text-red-700 transition p-2 cursor-pointer hover:bg-red-50 rounded-lg"
//                       >
//                         <Trash2 className="w-5 h-5" />
//                       </button>
//                     </div>

//                     {renderItemDetails(item, globalIndex)}
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {/* ✅ FIXED: Clear ALL Cart button */}
//             <button
//               onClick={clearAllCart}
//               className="w-full py-3 text-red-600 hover:text-red-700 font-semibold hover:bg-red-50 rounded-xl transition"
//             >
//               🗑️ Clear All Cart ({allCartItems.length} items)
//             </button>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

//               <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
//                 <div className="flex justify-between text-gray-600">
//                   <span>Subtotal ({allCartItems.length} items)</span>
//                   <span className="font-semibold">
//                     ₹{allCartItems.reduce((total, item) => {
//                       return total + (item.price || 0) * (item.quantity || 1);
//                     }, 0).toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-gray-600">
//                   <span>Shipping</span>
//                   <span className="font-semibold text-green-600">FREE</span>
//                 </div>
//                 <div className="flex justify-between text-gray-600">
//                   <span>Tax</span>
//                   <span className="font-semibold">Calculated at checkout</span>
//                 </div>
//               </div>

//               <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
//                 <span>Total</span>
//                 <span className="bg-linear-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
//                   ₹{allCartItems.reduce((total, item) => {
//                     return total + (item.price || 0) * (item.quantity || 1);
//                   }, 0).toLocaleString()}
//                 </span>
//               </div>

//               <button
//                 onClick={handleCheckout}
//                 disabled={placingOrder}
//                 className="w-full py-4 bg-linear-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-2xl hover:shadow-2xl hover:scale-105 transition transform flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mb-4"
//               >
//                 <CreditCard className="w-5 h-5" />
//                 {placingOrder ? 'Processing...' : 'Proceed to Checkout'}
//               </button>

//               {/* Trust Badges */}
//               <div className="space-y-3 pt-6 border-t border-gray-200">
//                 <div className="flex items-center gap-3 text-sm text-gray-600">
//                   <Truck className="w-5 h-5 text-blue-600" />
//                   <span>Free shipping on all orders</span>
//                 </div>
//                 <div className="flex items-center gap-3 text-sm text-gray-600">
//                   <ShieldCheck className="w-5 h-5 text-green-600" />
//                   <span>Secure payment processing</span>
//                 </div>
//                 <div className="flex items-center gap-3 text-sm text-gray-600">
//                   <ShoppingCart className="w-5 h-5 text-amber-600" />
//                   <span>30-day money back guarantee</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cartContext';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CreditCard,
  Truck,
  ShieldCheck,
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  const [frameCartItems, setFrameCartItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Initialize user and load cart
  useEffect(() => {
    const token = localStorage.getItem('token');
    setCurrentUser(token);
    
    if (token) {
      const frameCart = JSON.parse(localStorage.getItem('frameCart') || '[]');
      setFrameCartItems(frameCart);
    } else {
      // No user logged in - clear everything
      setFrameCartItems([]);
      clearCart();
    }
  }, []);

  // 🔥 CLEAR ALL CART FUNCTION
  const clearAllCart = () => {
    clearCart();
    localStorage.removeItem('frameCart');
    setFrameCartItems([]);
    setCurrentUser(null);
    console.log('🧹 ALL CARTS CLEARED!');
  };

  // 🔥 USER SWITCH DETECTION - Watch for token changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Detect when token changes in localStorage
      if (e.key === 'token' || e.key === null) {
        const newToken = localStorage.getItem('token');
        
        // User switched or logged out
        if (newToken !== currentUser) {
          console.log('🔄 User changed detected, clearing cart');
          clearAllCart();
          
          // Reload page to reset all state
          window.location.reload();
        }
      }
    };

    // Listen to storage events (works across tabs)
    window.addEventListener('storage', handleStorageChange);

    // Poll for token changes (works in same tab)
    const checkInterval = setInterval(() => {
      const newToken = localStorage.getItem('token');
      if (newToken !== currentUser) {
        console.log('🔄 User switch detected via polling');
        clearAllCart();
        window.location.reload();
      }
    }, 500); // Check every 500ms

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(checkInterval);
    };
  }, [currentUser]);

  // 🔥 CLEAR CART ON LOGOUT/CLOSE
  useEffect(() => {
    const handleLogout = () => {
      console.log('🚪 Logout detected');
      clearAllCart();
    };
    
    window.addEventListener('userLogout', handleLogout);

    return () => {
      window.removeEventListener('userLogout', handleLogout);
    };
  }, []);

  const allCartItems = [...cartItems, ...frameCartItems];

  // Rest of your functions (unchanged)
  const handleCheckout = () => router.push('/checkout');

  const getImageSrc = (item) => {
    if (item.imageUri?.startsWith('data:')) return item.imageUri;
    if (item.imageUri) return item.imageUri;
    if (item.uploadedImageUrl) return `http://localhost:4000${item.uploadedImageUrl}`;
    if (item.imageUrl) return item.imageUrl;
    return '/placeholder-frame.jpg';
  };

  const isCustomFrame = (item) => item.imageUri || item.frameShapeId || item.frameShape;

  const renderItemDetails = (item, globalIndex) => {
    if (!isCustomFrame(item)) {
      return (
        <>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
            <p><span className="font-semibold">Size:</span> {item.size}"</p>
            <p><span className="font-semibold">Color:</span> {item.frameColor}</p>
            <p><span className="font-semibold">Material:</span> {item.frameMaterial}</p>
            <p><span className="font-semibold">Orientation:</span> {item.orientation}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 bg-black rounded-full px-2 py-1">
              <button onClick={() => updateQuantity(globalIndex, item.quantity - 1)}
                className="w-8 h-8 rounded-full hover:bg-white hover:text-black cursor-pointer transition font-bold">
                <Minus className="w-4 h-4 mx-auto" />
              </button>
              <span className="w-8 text-center font-semibold">{item.quantity}</span>
              <button onClick={() => updateQuantity(globalIndex, item.quantity + 1)}
                className="w-8 h-8 rounded-full hover:bg-white hover:text-black cursor-pointer transition font-bold">
                <Plus className="w-4 h-4 mx-auto" />
              </button>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold bg-linear-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                ₹{(item.price * item.quantity).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">₹{item.price} each</p>
            </div>
          </div>
        </>
      );
    }

    const sizeDisplay = item.finalWidthInch 
      ? `${item.finalWidthInch}x${item.finalHeightInch}" (${item.orientation})`
      : `${item.widthCm.toFixed(1)}x${item.heightCm.toFixed(1)}cm`;

    return (
      <>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
          <p><span className="font-semibold">Size:</span> {sizeDisplay}</p>
          <p><span className="font-semibold">Thickness:</span> {item.thicknessMm || item.selectedThickness}mm</p>
          <p><span className="font-semibold">Shape:</span> {item.frameShape || item.frameShapeId?.replace('-', ' ').toUpperCase()}</p>
          <p><span className="font-semibold">Frame Color:</span> {item.frameColor}</p>
          <p><span className="font-semibold">Mat Color:</span> {item.matColor}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="px-4 py-2 bg-black text-white hover:bg-white hover:text-black rounded-full text-sm font-medium">
            Single Custom Item
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold bg-linear-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
              ₹{item.price?.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Custom Frame</p>
          </div>
        </div>
      </>
    );
  };

  const handleRemoveItem = (globalIndex) => {
    if (globalIndex < cartItems.length) {
      removeFromCart(globalIndex);
    } else {
      const frameIndex = globalIndex - cartItems.length;
      const updatedFrameCart = frameCartItems.filter((_, i) => i !== frameIndex);
      setFrameCartItems(updatedFrameCart);
      localStorage.setItem('frameCart', JSON.stringify(updatedFrameCart));
    }
  };

  if (allCartItems.length === 0) {
    return (
      <div className="bg-linear-to-br from-amber-50 via-orange-50 to-rose-50 py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <button onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-2xl hover:shadow-2xl hover:scale-105 transition transform">
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-rose-50 py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">
              {allCartItems.length} {allCartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <button onClick={() => router.back()}
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold transition">
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {allCartItems.map((item, globalIndex) => (
              <div key={item.id || item.timestamp || globalIndex}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex gap-6">
                  <div className="w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    <img src={getImageSrc(item)}
                      alt={item.title || item.frameShape || 'Custom Frame'}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/placeholder-frame.jpg'; }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {item.title || 
                         (item.frameShape ? `Custom ${item.frameShape} Frame` :
                          item.frameShapeId ? `Custom ${item.frameShapeId.replace('-', ' ').toUpperCase()} Frame` :
                          'Custom Photo Frame')}
                      </h3>
                      <button onClick={() => handleRemoveItem(globalIndex)}
                        className="text-red-500 hover:text-red-700 transition p-2 cursor-pointer hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    {renderItemDetails(item, globalIndex)}
                  </div>
                </div>
              </div>
            ))}
            <button onClick={clearAllCart}
              className="w-full py-3 text-red-600 hover:text-red-700 font-semibold hover:bg-red-50 rounded-xl transition">
              🗑️ Clear All Cart ({allCartItems.length} items)
            </button>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({allCartItems.length} items)</span>
                  <span className="font-semibold">
                    ₹{allCartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-semibold">Calculated at checkout</span>
                </div>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span className="bg-linear-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                  ₹{allCartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0).toLocaleString()}
                </span>
              </div>
              <button onClick={handleCheckout}
                className="w-full py-4 bg-linear-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-2xl hover:shadow-2xl hover:scale-105 transition transform flex items-center justify-center gap-2 mb-4">
                <CreditCard className="w-5 h-5" />
                Proceed to Checkout
              </button>
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span>Free shipping on all orders</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ShoppingCart className="w-5 h-5 text-amber-600" />
                  <span>30-day money back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}