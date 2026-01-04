// 'use client';

// import { Home, ShoppingCart } from 'lucide-react';

// export default function ShoppingPage() {
//   return (
//     <div className="min-h-screen bg-linear-to-br from-orange-50 via-yellow-50 to-white flex items-center justify-center">
//       <div className="text-center">
//         {/* Logo/Banner */}
//         <div className="mb-12">
//           <div className="inline-block p-8 bg-linear-to-r from-orange-500 to-yellow-500 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
//             <ShoppingCart size={80} className="text-white" />
//           </div>
//           <h1 className="text-6xl font-bold mt-8 bg-linear-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
//             Prem Color Lab
//           </h1>
//           <p className="text-xl text-gray-700 mt-4">Your Premium Shopping Destination</p>
//         </div>

//         {/* Home Button */}
//         <button
//           onClick={() => window.location.href = '/'}
//           className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-linear-to-r from-orange-500 to-yellow-500 text-white text-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
//         >
//           <Home size={24} />
//           <span>Go to Home</span>
//         </button>
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { useRouter } from 'next/navigation';

// import { useState } from 'react';
// import { Home } from 'lucide-react';
// import { useCart } from '@/context/cartContext';

// const addressSchema = {
//   email: { type: 'string', required: true },
//   phone: { type: 'string', required: true },
//   firstName: { type: 'string', required: true },
//   lastName: { type: 'string', required: true },
//   address: { type: 'string', required: true },
//   area: { type: 'string', required: true },
//   pincode: { type: 'string', required: true, pattern: '^[0-9]{6}$' },
//   city: { type: 'string', required: true },
//   state: { type: 'string', required: true },
// };

// export default function CheckoutPage() {

//   const router = useRouter();
//   const handleNavigation = () => {
//     router.back();
//   }
//   // cart data from context
//   const { cartItems, getTotalPrice, getTotalItems } = useCart();

//   // address form state
//   const [formData, setFormData] = useState({
//     email: '',
//     phone: '',
//     firstName: '',
//     lastName: '',
//     address: '',
//     area: '',
//     pincode: '',
//     city: '',
//     state: 'Andhra Pradesh',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const indianStates = [
//     'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
//     'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
//     'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
//     'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
//     'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
//   ];

//   const subtotal = getTotalPrice();
//   const totalItems = getTotalItems();

//   const validateForm = () => {
//     for (const [field, schema] of Object.entries(addressSchema)) {
//       const value = formData[field];
//       if (schema.required && !value.trim()) {
//         setError(
//           `${field.replace(/([A-Z])/g, ' $1').toUpperCase()} is required`
//         );
//         return false;
//       }
//       if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
//         setError('PIN code must be 6 digits');
//         return false;
//       }
//     }
//     setError('');
//     return true;
//   };

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//     if (error) setError('');
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     if (cartItems.length === 0) {
//       setError('Your cart is empty.');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const response = await fetch('/api/save-address', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...formData,
//           timestamp: new Date().toISOString(),
//           orderId: `ORD-${Date.now()}`,
//           // you can also send cart / total here if your API expects it
//           cartItems,
//           totalAmount: subtotal,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to save address');
//       }

//       const result = await response.json();
//       console.log('Address saved:', result);
//       alert('Address saved successfully! Proceeding to payment...');
//       // e.g. router.push('/payment');
//     } catch (err) {
//       console.error('Error:', err);
//       setError('Failed to save address. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <button
//             onClick={() => (window.location.href = '/')}
//             className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
//           >
//             <Home size={20} />
//             <span>Back to Home</span>
//           </button>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Login and Coupon Links */}
//         {/* <div className="mb-6 space-y-2">
//           <p className="text-sm text-gray-700">
//             Returning customer?{' '}
//             <button className="text-blue-600 hover:underline">
//               Click here to login
//             </button>
//           </p>
//           <p className="text-sm text-gray-700">
//             Have a coupon?{' '}
//             <button className="text-blue-600 hover:underline">
//               Click here to enter your code
//             </button>
//           </p>
//         </div> */}

//         {error && (
//           <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//             {error}
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Billing & Shipping Form */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               <h2 className="text-2xl font-bold mb-6 text-black">BILLING & SHIPPING</h2>

//               <div className="space-y-4">
//                 {/* Email */}
//                 <div>
//                   <input
//                     type="email"
//                     name="email"
//                     placeholder="Email address"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 {/* Phone */}
//                 <div>
//                   <input
//                     type="tel"
//                     name="phone"
//                     placeholder="Phone Number"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 {/* First and Last Name */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <input
//                     type="text"
//                     name="firstName"
//                     placeholder="First name"
//                     value={formData.firstName}
//                     onChange={handleChange}
//                     className="px-4 py-3 border border-gray-300 rounded focus:outline-none text-black focus:ring-2 focus:ring-orange-500"
//                   />
//                   <input
//                     type="text"
//                     name="lastName"
//                     placeholder="Last name"
//                     value={formData.lastName}
//                     onChange={handleChange}
//                     className="px-4 py-3 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 {/* Address and Area */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <input
//                     type="text"
//                     name="address"
//                     placeholder="Flat, House no., Building, Company, Apartment"
//                     value={formData.address}
//                     onChange={handleChange}
//                     className="px-4 py-3 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                   <input
//                     type="text"
//                     name="area"
//                     placeholder="Area, Street, Sector, Village"
//                     value={formData.area}
//                     onChange={handleChange}
//                     className="px-4 py-3 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 {/* PIN Code */}
//                 <div>
//                   <input
//                     type="text"
//                     name="pincode"
//                     placeholder="PIN code"
//                     value={formData.pincode}
//                     onChange={handleChange}
//                     maxLength={6}
//                     className="w-full px-4 py-3 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 {/* City */}
//                 <div>
//                   <input
//                     type="text"
//                     name="city"
//                     placeholder="Town / City"
//                     value={formData.city}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 {/* State */}
//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1">
//                     State *
//                   </label>
//                   <select
//                     name="state"
//                     value={formData.state}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   >
//                     {indianStates.map((state) => (
//                       <option key={state} value={state}>
//                         {state}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-gray-900 sticky top-4">
//               <h2 className="text-2xl font-bold mb-6 text-black">YOUR ORDER</h2>

//               <div className="space-y-4">
//                 <div className="flex justify-between items-start pb-4 border-b">
//                   <div className="flex-1">
//                     <p className="font-semibold text-black">PRODUCT</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-semibold text-black">SUBTOTAL</p>
//                   </div>
//                 </div>

//                 {/* Product items from cart */}
//                 {cartItems.length === 0 ? (
//                   <p className="text-sm text-gray-500 pb-4 border-b">
//                     Your cart is empty.
//                   </p>
//                 ) : (
//                   // <div className="pb-4 border-b space-y-3">
//                   //   {cartItems.map((item, index) => (
//                   //     <div key={index}>
//                   //       <div className="flex justify-between items-start mb-1">
//                   //         <p className="text-gray-700">
//                   //           {item.title} × {item.quantity}
//                   //         </p>
//                   //         <p className="font-semibold">
//                   //           ₹{(item.price * item.quantity).toLocaleString()}
//                   //         </p>
//                   //       </div>
//                   //       <div className="text-xs text-gray-600 space-y-1">
//                   //         {item.size && (
//                   //           <p>
//                   //             <span className="font-medium">Size:</span>{' '}
//                   //             {item.size}
//                   //           </p>
//                   //         )}
//                   //         {item.frameThickness && (
//                   //           <p>
//                   //             <span className="font-medium">
//                   //               Thickness (mm):
//                   //             </span>{' '}
//                   //             {item.frameThickness}
//                   //           </p>
//                   //         )}
//                   //         {item.frameColor && (
//                   //           <p>
//                   //             <span className="font-medium">Color:</span>{' '}
//                   //             {item.frameColor}
//                   //           </p>
//                   //         )}
//                   //         {item.orientation && (
//                   //           <p>
//                   //             <span className="font-medium">Orientation:</span>{' '}
//                   //             {item.orientation}
//                   //           </p>
//                   //         )}
//                   //       </div>
//                   //     </div>
//                   //   ))}
//                   // </div>

//                   <div className="pb-4 border-b space-y-3">
//                     {cartItems.map((item, index) => (
//                       <div key={index} className="flex gap-3">
//                         {/* Small image */}
//                         <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 shrink-0">
//                           <img
//                             src={
//                               item.uploadedImageUrl
//                                 ? `http://localhost:4000${item.uploadedImageUrl}`
//                                 : item.imageUrl
//                             }
//                             alt={item.title}
//                             className="w-full h-full object-cover"
//                           />
//                         </div>

//                         {/* Text content */}
//                         <div className="flex-1">
//                           <div className="flex justify-between items-start mb-1">
//                             <p className="text-gray-700">
//                               {item.title} × {item.quantity}
//                             </p>
//                             <p className="font-semibold text-black">
//                               ₹{(item.price * item.quantity).toLocaleString()}
//                             </p>
//                           </div>
//                           <div className="text-xs text-gray-600 space-y-1">
//                             {item.size && (
//                               <p>
//                                 <span className="font-medium">Size:</span> {item.size}
//                               </p>
//                             )}
//                             {item.frameThickness && (
//                               <p>
//                                 <span className="font-medium">Thickness (mm):</span>{' '}
//                                 {item.frameThickness}
//                               </p>
//                             )}
//                             {item.frameColor && (
//                               <p>
//                                 <span className="font-medium">Color:</span> {item.frameColor}
//                               </p>
//                             )}
//                             {item.orientation && (
//                               <p>
//                                 <span className="font-medium">Orientation:</span>{' '}
//                                 {item.orientation}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                 )}

//                 {/* Subtotal */}
//                 <div className="flex justify-between pb-4 border-b">
//                   <p className="font-semibold text-black">
//                     Subtotal ({totalItems}{' '}
//                     {totalItems === 1 ? 'item' : 'items'})
//                   </p>
//                   <p className="font-semibold text-black">
//                     ₹{subtotal.toLocaleString()}
//                   </p>
//                 </div>

//                 {/* Shipping */}
//                 <div className="flex justify-between pb-4 border-b">
//                   <p className="font-semibold text-black">Shipping</p>
//                   <p className="text-green-600 font-semibold">
//                     FREE SHIPPING
//                   </p>
//                 </div>

//                 {/* Total */}
//                 <div className="flex justify-between items-center py-4">
//                   <p className="text-xl font-bold text-black">Total</p>
//                   <div className="text-right">
//                     <p className="text-2xl font-bold text-black">
//                       ₹{subtotal.toLocaleString()}
//                     </p>
//                     <p className="text-xs text-gray-600">
//                       (includes 18% tax estimate)
//                     </p>
//                   </div>
//                 </div>

//                 {/* Continue to Payment Button */}
//                 <button
//                   onClick={handleSubmit}
//                   disabled={loading}
//                   className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 rounded transition-colors duration-200 flex items-center justify-center gap-2"
//                 >
//                   {loading ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     'Continue to Payment'
//                   )}
//                 </button>

//                 {/* Back to Cart Link */}
//                 <button className="w-full text-left text-gray-700 cursor-pointer hover:text-gray-900 mt-4" onClick={handleNavigation}>
//                   &lt; Back to Cart
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// 'use client';

// import { useRouter } from 'next/navigation';
// import { useState, useEffect } from 'react';
// import { Home } from 'lucide-react';
// import { useCart } from '@/context/cartContext';

// const addressSchema = {
//   email: { type: 'string', required: true },
//   phone: { type: 'string', required: true },
//   firstName: { type: 'string', required: true },
//   lastName: { type: 'string', required: true },
//   address: { type: 'string', required: true },
//   area: { type: 'string', required: true },
//   pincode: { type: 'string', required: true, pattern: '^[0-9]{6}$' },
//   city: { type: 'string', required: true },
//   state: { type: 'string', required: true },
// };

// export default function CheckoutPage() {
//   const router = useRouter();
//   const { cartItems, getTotalPrice, getTotalItems, clearCart } = useCart();

//   // Form and payment states
//   const [formData, setFormData] = useState({
//     email: '',
//     phone: '',
//     firstName: '',
//     lastName: '',
//     address: '',
//     area: '',
//     pincode: '',
//     city: '',
//     state: 'Andhra Pradesh',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [paymentLoading, setPaymentLoading] = useState(false);
//   const [razorpayInstance, setRazorpayInstance] = useState(null);

//   const indianStates = [
//     'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
//     'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
//     'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
//     'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
//     'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
//   ];

//   const subtotal = getTotalPrice();
//   const totalItems = getTotalItems();

//   // Load Razorpay script
//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//     script.async = true;
//     script.onload = () => {
//       setRazorpayInstance(window.Razorpay);
//     };
//     document.body.appendChild(script);

//     return () => {
//       const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
//       if (existingScript) document.body.removeChild(existingScript);
//     };
//   }, []);

//   const validateForm = () => {
//     for (const [field, schema] of Object.entries(addressSchema)) {
//       const value = formData[field];
//       if (schema.required && !value.trim()) {
//         setError(`${field.replace(/([A-Z])/g, ' $1').toUpperCase()} is required`);
//         return false;
//       }
//       if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
//         setError('PIN code must be 6 digits');
//         return false;
//       }
//     }
//     setError('');
//     return true;
//   };

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//     if (error) setError('');
//   };

//   // Create Razorpay order and open payment modal
//   const handleRazorpayPayment = async () => {
//     if (!validateForm()) return;
//     if (cartItems.length === 0) {
//       setError('Your cart is empty.');
//       return;
//     }

//     setPaymentLoading(true);
//     setError('');

//     try {
//       // Call YOUR Express backend
//       const response = await fetch('http://localhost:4000/api/razorpay/order', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           amount: subtotal * 100, // paise
//           currency: 'INR',
//           receipt: `receipt_${Date.now()}`,
//           cartItems,
//           customerData: formData,
//         }),
//       });

//       if (!response.ok) throw new Error('Failed to create order');

//       const orderData = await response.json();

//       // Razorpay options - SAME AS BEFORE
//       const options = {
//         key: 'rzp_test_YOUR_KEY_HERE', // Your Razorpay key
//         amount: orderData.amount,
//         currency: orderData.currency,
//         name: 'Frame Site',
//         description: `Order #${orderData.receipt}`,
//         order_id: orderData.id,
//         handler: async function (response) {
//           await handlePaymentSuccess(response, orderData);
//         },
//         prefill: {
//           name: `${formData.firstName} ${formData.lastName}`,
//           email: formData.email,
//           contact: formData.phone,
//         },
//         theme: { color: '#10b981' },
//         modal: {
//           ondismiss: () => {
//             setPaymentLoading(false);
//             alert('Payment cancelled.');
//           }
//         }
//       };

//       const rzp = new razorpayInstance(options);
//       rzp.open();

//     } catch (err) {
//       setError('Payment initiation failed. Try again.');
//     } finally {
//       setPaymentLoading(false);
//     }
//   };


//   // Handle successful payment - Save order to DB + Send SMS
//   const handlePaymentSuccess = async (razorpayResponse, razorpayOrder) => {
//     setLoading(true);

//     try {
//       // Verify & save order on YOUR Express backend
//       const response = await fetch('http://localhost:4000/api/orders/verify', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           razorpay_order_id: razorpayResponse.razorpay_order_id,
//           razorpay_payment_id: razorpayResponse.razorpay_payment_id,
//           razorpay_signature: razorpayResponse.razorpay_signature,
//           customer: formData,
//           cartItems,
//           totalAmount: subtotal,
//         }),
//       });

//       if (!response.ok) throw new Error('Payment verification failed');

//       const orderData = await response.json();

//       clearCart();
//       alert(`✅ Order #${orderData.orderId} confirmed! SMS sent to ${formData.phone}`);
//       router.push('/order-success?orderId=' + orderData.orderId);

//     } catch (err) {
//       alert('Payment successful but order save failed. Contact support.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
//           >
//             <Home size={20} />
//             <span>Back to Home</span>
//           </button>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {error && (
//           <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//             {error}
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Billing Form - SAME AS BEFORE */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               <h2 className="text-2xl font-bold mb-6 text-black">BILLING & SHIPPING</h2>
//               {/* All your existing form fields - unchanged */}
//               <div className="space-y-4">
//                 {/* Email, Phone, Name, Address fields - copy from your original */}
//                 <div>
//                   <input type="email" name="email" placeholder="Email address" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" />
//                 </div>
//                 {/* ... rest of form fields exactly as in your code ... */}
//               </div>
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-gray-900 sticky top-4">
//               <h2 className="text-2xl font-bold mb-6 text-black">YOUR ORDER</h2>

//               {/* Cart items display - SAME AS YOUR CODE */}
//               <div className="space-y-4">
//                 {cartItems.length === 0 ? (
//                   <p className="text-sm text-gray-500 pb-4 border-b">Your cart is empty.</p>
//                 ) : (
//                   <div className="pb-4 border-b space-y-3">
//                     {cartItems.map((item, index) => (
//                       <div key={index} className="flex gap-3">
//                         <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 shrink-0">
//                           <img
//                             src={item.uploadedImageUrl ? `http://localhost:4000${item.uploadedImageUrl}` : item.imageUrl}
//                             alt={item.title}
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                         <div className="flex-1">
//                           <div className="flex justify-between items-start mb-1">
//                             <p className="text-gray-700">{item.title} × {item.quantity}</p>
//                             <p className="font-semibold text-black">₹{(item.price * item.quantity).toLocaleString()}</p>
//                           </div>
//                           <div className="text-xs text-gray-600 space-y-1">
//                             {item.size && <p><span className="font-medium">Size:</span> {item.size}</p>}
//                             {item.frameThickness && <p><span className="font-medium">Thickness (mm):</span> {item.frameThickness}</p>}
//                             {item.frameColor && <p><span className="font-medium">Color:</span> {item.frameColor}</p>}
//                             {item.orientation && <p><span className="font-medium">Orientation:</span> {item.orientation}</p>}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 <div className="flex justify-between pb-4 border-b">
//                   <p className="font-semibold text-black">Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</p>
//                   <p className="font-semibold text-black">₹{subtotal.toLocaleString()}</p>
//                 </div>

//                 <div className="flex justify-between pb-4 border-b">
//                   <p className="font-semibold text-black">Shipping</p>
//                   <p className="text-green-600 font-semibold">FREE SHIPPING</p>
//                 </div>

//                 <div className="flex justify-between items-center py-4">
//                   <p className="text-xl font-bold text-black">Total</p>
//                   <div className="text-right">
//                     <p className="text-2xl font-bold text-black">₹{subtotal.toLocaleString()}</p>
//                     <p className="text-xs text-gray-600">(includes 18% tax estimate)</p>
//                   </div>
//                 </div>

//                 {/* Razorpay Payment Button */}
//                 <button
//                   onClick={handleRazorpayPayment}
//                   disabled={loading || paymentLoading || cartItems.length === 0 || !razorpayInstance}
//                   className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 rounded transition-colors duration-200 flex items-center justify-center gap-2"
//                 >
//                   {paymentLoading ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                       Processing Payment...
//                     </>
//                   ) : loading ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                       Saving Order...
//                     </>
//                   ) : (
//                     'Pay with Razorpay'
//                   )}
//                 </button>

//                 <button
//                   className="w-full text-left text-gray-700 cursor-pointer hover:text-gray-900 mt-4"
//                   onClick={() => router.back()}
//                 >
//                   &lt; Back to Cart
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// 'use client';

// import { useRouter } from 'next/navigation';
// import { useState, useEffect } from 'react';
// import { Home } from 'lucide-react';
// import { useCart } from '@/context/cartContext';

// const addressSchema = {
//   email: { type: 'string', required: true },
//   phone: { type: 'string', required: true },
//   firstName: { type: 'string', required: true },
//   lastName: { type: 'string', required: true },
//   address: { type: 'string', required: true },
//   area: { type: 'string', required: true },
//   pincode: { type: 'string', required: true, pattern: '^[0-9]{6}$' },
//   city: { type: 'string', required: true },
//   state: { type: 'string', required: true },
// };

// export default function CheckoutPage() {
//   const router = useRouter();
//   const { cartItems, getTotalPrice, getTotalItems, clearCart } = useCart();

//   const [formData, setFormData] = useState({
//     email: '',
//     phone: '',
//     firstName: '',
//     lastName: '',
//     address: '',
//     area: '',
//     pincode: '',
//     city: '',
//     state: 'Andhra Pradesh',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [paymentLoading, setPaymentLoading] = useState(false);
//   const [razorpayLoaded, setRazorpayLoaded] = useState(false);

//   const indianStates = [
//     'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
//     'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
//     'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
//     'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
//     'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
//   ];

//   const subtotal = getTotalPrice();
//   const totalItems = getTotalItems();

//   useEffect(() => {
//     if (typeof window === 'undefined') return;

//     const script = document.createElement('script');
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//     script.async = true;
//     script.onload = () => setRazorpayLoaded(true);
//     script.onerror = () => {
//       console.error('Failed to load Razorpay script');
//       setRazorpayLoaded(false);
//     };
//     document.body.appendChild(script);

//     return () => {
//       const existingScript = document.querySelector(
//         'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
//       );
//       if (existingScript) document.body.removeChild(existingScript);
//     };
//   }, []);

//   const validateForm = () => {
//     for (const [field, schema] of Object.entries(addressSchema)) {
//       const value = formData[field];
//       if (schema.required && !value.trim()) {
//         setError(field.replace(/([A-Z])/g, ' $1').toUpperCase() + ' is required');
//         return false;
//       }
//       if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
//         setError('PIN code must be 6 digits');
//         return false;
//       }
//     }
//     setError('');
//     return true;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//     if (error) setError('');
//   };

//   const handleRazorpayPayment = async () => {
//     if (!validateForm()) return;
//     if (cartItems.length === 0) {
//       setError('Your cart is empty.');
//       return;
//     }
//     if (
//       !razorpayLoaded ||
//       typeof window === 'undefined' ||
//       !window.Razorpay
//     ) {
//       setError('Payment system is not ready. Please refresh the page.');
//       return;
//     }

//     setPaymentLoading(true);
//     setError('');

//     try {
//       const response = await fetch(
//         'http://localhost:4000/api/orders/razorpay/order',
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             amount: subtotal * 100,
//             currency: 'INR',
//             receipt: `receipt_${Date.now()}`,
//             cartItems,
//             customerData: formData,
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to create order');
//       }

//       const orderData = await response.json();

//       const options = {
//         key: 'rzp_live_RB0sIuyS0KchSG', // replace with your Razorpay key
//         amount: orderData.amount,
//         currency: orderData.currency,
//         name: 'Frame Site',
//         description: `Order #${orderData.receipt}`,
//         order_id: orderData.id,
//         handler: async (resp) => {
//           await handlePaymentSuccess(resp, orderData);
//         },
//         prefill: {
//           name: formData.firstName + ' ' + formData.lastName,
//           email: formData.email,
//           contact: formData.phone,
//         },
//         theme: { color: '#10b981' },
//         modal: {
//           ondismiss: () => {
//             setPaymentLoading(false);
//             alert('Payment cancelled.');
//           },
//         },
//       };

//       const RazorpayConstructor = window.Razorpay;
//       const rzp = new RazorpayConstructor(options);
//       rzp.open();
//     } catch (err) {
//       console.error(err);
//       setError('Payment initiation failed. Try again.');
//     } finally {
//       setPaymentLoading(false);
//     }
//   };

//   const handlePaymentSuccess = async (razorpayResponse, razorpayOrder) => {
//     setLoading(true);

//     try {
//       const response = await fetch(
//         'http://localhost:4000/api/orders/verify',
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             razorpay_order_id: razorpayResponse.razorpay_order_id,
//             razorpay_payment_id: razorpayResponse.razorpay_payment_id,
//             razorpay_signature: razorpayResponse.razorpay_signature,
//             customer: formData,
//             cartItems,
//             totalAmount: subtotal * 100, // paise
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Payment verification failed');
//       }

//       const orderData = await response.json();

//       clearCart();
//       alert(
//         `✅ Order #${orderData.orderId} confirmed! SMS sent to ${formData.phone}`
//       );
//       router.push('/order-success?orderId=' + orderData.orderId);
//     } catch (err) {
//       console.error(err);
//       alert('Payment successful but order save failed. Contact support.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
//           >
//             <Home size={20} />
//             <span>Back to Home</span>
//           </button>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {error && (
//           <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//             {error}
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               <h2 className="text-2xl font-bold mb-6 text-black">
//                 BILLING & SHIPPING
//               </h2>

//               <div className="space-y-4">
//                 <div>
//                   <input
//                     type="email"
//                     name="email"
//                     placeholder="Email address"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 <div>
//                   <input
//                     type="tel"
//                     name="phone"
//                     placeholder="Phone Number"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <input
//                     type="text"
//                     name="firstName"
//                     placeholder="First name"
//                     value={formData.firstName}
//                     onChange={handleChange}
//                     className="px-4 py-3 border border-gray-300 rounded focus:outline-none text-black focus:ring-2 focus:ring-orange-500"
//                   />
//                   <input
//                     type="text"
//                     name="lastName"
//                     placeholder="Last name"
//                     value={formData.lastName}
//                     onChange={handleChange}
//                     className="px-4 py-3 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <input
//                     type="text"
//                     name="address"
//                     placeholder="Flat, House no., Building, Company, Apartment"
//                     value={formData.address}
//                     onChange={handleChange}
//                     className="px-4 py-3 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                   <input
//                     type="text"
//                     name="area"
//                     placeholder="Area, Street, Sector, Village"
//                     value={formData.area}
//                     onChange={handleChange}
//                     className="px-4 py-3 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 <div>
//                   <input
//                     type="text"
//                     name="pincode"
//                     placeholder="PIN code"
//                     value={formData.pincode}
//                     onChange={handleChange}
//                     maxLength={6}
//                     className="w-full px-4 py-3 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 <div>
//                   <input
//                     type="text"
//                     name="city"
//                     placeholder="Town / City"
//                     value={formData.city}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1">
//                     State *
//                   </label>
//                   <select
//                     name="state"
//                     value={formData.state}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   >
//                     {indianStates.map((state) => (
//                       <option key={state} value={state}>
//                         {state}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-gray-900 sticky top-4">
//               <h2 className="text-2xl font-bold mb-6 text-black">YOUR ORDER</h2>

//               <div className="space-y-4">
//                 {cartItems.length === 0 ? (
//                   <p className="text-sm text-gray-500 pb-4 border-b">
//                     Your cart is empty.
//                   </p>
//                 ) : (
//                   <div className="pb-4 border-b space-y-3">
//                     {cartItems.map((item, index) => (
//                       <div key={index} className="flex gap-3">
//                         <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 shrink-0">
//                           <img
//                             src={
//                               item.uploadedImageUrl
//                                 ? `http://localhost:4000${item.uploadedImageUrl}`
//                                 : item.imageUrl
//                             }
//                             alt={item.title}
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                         <div className="flex-1">
//                           <div className="flex justify-between items-start mb-1">
//                             <p className="text-gray-700">
//                               {item.title} × {item.quantity}
//                             </p>
//                             <p className="font-semibold text-black">
//                               ₹{(item.price * item.quantity).toLocaleString()}
//                             </p>
//                           </div>
//                           <div className="text-xs text-gray-600 space-y-1">
//                             {item.size && (
//                               <p>
//                                 <span className="font-medium">Size:</span>{' '}
//                                 {item.size}
//                               </p>
//                             )}
//                             {item.frameThickness && (
//                               <p>
//                                 <span className="font-medium">
//                                   Thickness (mm):
//                                 </span>{' '}
//                                 {item.frameThickness}
//                               </p>
//                             )}
//                             {item.frameColor && (
//                               <p>
//                                 <span className="font-medium">Color:</span>{' '}
//                                 {item.frameColor}
//                               </p>
//                             )}
//                             {item.orientation && (
//                               <p>
//                                 <span className="font-medium">
//                                   Orientation:
//                                 </span>{' '}
//                                 {item.orientation}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 <div className="flex justify-between pb-4 border-b">
//                   <p className="font-semibold text-black">
//                     Subtotal ({totalItems}{' '}
//                     {totalItems === 1 ? 'item' : 'items'})
//                   </p>
//                   <p className="font-semibold text-black">
//                     ₹{subtotal.toLocaleString()}
//                   </p>
//                 </div>

//                 <div className="flex justify-between pb-4 border-b">
//                   <p className="font-semibold text-black">Shipping</p>
//                   <p className="text-green-600 font-semibold">FREE SHIPPING</p>
//                 </div>

//                 <div className="flex justify-between items-center py-4">
//                   <p className="text-xl font-bold text-black">Total</p>
//                   <div className="text-right">
//                     <p className="text-2xl font-bold text-black">
//                       ₹{subtotal.toLocaleString()}
//                     </p>
//                     <p className="text-xs text-gray-600">
//                       (includes 18% tax estimate)
//                     </p>
//                   </div>
//                 </div>

//                 <button
//                   onClick={handleRazorpayPayment}
//                   disabled={
//                     loading ||
//                     paymentLoading ||
//                     cartItems.length === 0 ||
//                     !razorpayLoaded
//                   }
//                   className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 rounded transition-colors duration-200 flex items-center justify-center gap-2"
//                 >
//                   {paymentLoading ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                       Processing Payment...
//                     </>
//                   ) : loading ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                       Saving Order...
//                     </>
//                   ) : (
//                     'Pay with Razorpay'
//                   )}
//                 </button>

//                 <button
//                   className="w-full text-left text-gray-700 cursor-pointer hover:text-gray-900 mt-4"
//                   onClick={() => router.back()}
//                 >
//                   &lt; Back to Cart
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Home } from 'lucide-react';
import { useCart } from '@/context/cartContext';

const addressSchema = {
  email: { type: 'string', required: true },
  phone: { type: 'string', required: true },
  firstName: { type: 'string', required: true },
  lastName: { type: 'string', required: true },
  address: { type: 'string', required: true },
  area: { type: 'string', required: true },
  pincode: { type: 'string', required: true, pattern: '^[0-9]{6}$' },
  city: { type: 'string', required: true },
  state: { type: 'string', required: true },
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getTotalPrice, getTotalItems, clearCart } = useCart();

  // ✅ FIXED: Load custom frames from localStorage
  const [frameCartItems, setFrameCartItems] = useState([]);
  useEffect(() => {
    const frameCart = JSON.parse(localStorage.getItem('frameCart') || '[]');
    setFrameCartItems(frameCart);
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    area: '',
    pincode: '',
    city: '',
    state: 'Andhra Pradesh',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  ];

  // ✅ FIXED: Combined cart items (regular + custom)
  const allCartItems = [...cartItems, ...frameCartItems];
  const subtotal = allCartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);
  const totalItems = allCartItems.length;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      setRazorpayLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );
      if (existingScript) document.body.removeChild(existingScript);
    };
  }, []);

  const validateForm = () => {
    for (const [field, schema] of Object.entries(addressSchema)) {
      const value = formData[field];
      if (schema.required && !value.trim()) {
        setError(field.replace(/([A-Z])/g, ' $1').toUpperCase() + ' is required');
        return false;
      }
      if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
        setError('PIN code must be 6 digits');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  // ✅ FIXED: Get correct image source for all item types
  const getImageSrc = (item) => {
    if (item.imageUri && item.imageUri.startsWith('data:')) return item.imageUri;
    if (item.imageUri) return item.imageUri;
    if (item.uploadedImageUrl) return `http://localhost:4000${item.uploadedImageUrl}`;
    if (item.imageUrl) return item.imageUrl;
    return '/placeholder-frame.jpg';
  };

  // ✅ FIXED: Smart item title and details
  const getItemTitle = (item) => {
    if (item.title) return item.title;
    if (item.frameShape) return `Custom ${item.frameShape} Frame`;
    if (item.frameShapeId) return `Custom ${item.frameShapeId.replace('-', ' ').toUpperCase()} Frame`;
    return 'Custom Photo Frame';
  };

  const handleRazorpayPayment = async () => {
    if (!validateForm()) return;
    if (allCartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    if (!razorpayLoaded || typeof window === 'undefined' || !window.Razorpay) {
      setError('Payment system is not ready. Please refresh the page.');
      return;
    }

    setPaymentLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/orders/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: subtotal * 100,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          cartItems: allCartItems, // ✅ Send ALL items (regular + custom)
          customerData: formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await response.json();

      const options = {
        key: 'rzp_live_RB0sIuyS0KchSG',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Frame Site',
        description: `Order #${orderData.receipt}`,
        order_id: orderData.id,
        handler: async (resp) => {
          await handlePaymentSuccess(resp, orderData);
        },
        prefill: {
          name: formData.firstName + ' ' + formData.lastName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: '#10b981' },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
            alert('Payment cancelled.');
          },
        },
      };

      const RazorpayConstructor = window.Razorpay;
      const rzp = new RazorpayConstructor(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setError('Payment initiation failed. Try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePaymentSuccess = async (razorpayResponse, razorpayOrder) => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/orders/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
          customer: formData,
          cartItems: allCartItems, // ✅ Send ALL items
          totalAmount: subtotal * 100,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      const orderData = await response.json();

      // ✅ FIXED: Clear BOTH carts on success
      clearCart();
      localStorage.removeItem('frameCart');
      setFrameCartItems([]);

      alert(`✅ Order #${orderData.orderId} confirmed! SMS sent to ${formData.phone}`);
      router.push('/order-success?orderId=' + orderData.orderId);
    } catch (err) {
      console.error(err);
      alert('Payment successful but order save failed. Contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            <Home size={20} />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Billing form - UNCHANGED */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6 text-black">BILLING & SHIPPING</h2>
              <div className="space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="px-4 py-3 border border-gray-300 rounded focus:outline-none text-black focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="px-4 py-3 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="address"
                    placeholder="Flat, House no., Building, Company, Apartment"
                    value={formData.address}
                    onChange={handleChange}
                    className="px-4 py-3 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    name="area"
                    placeholder="Area, Street, Sector, Village"
                    value={formData.area}
                    onChange={handleChange}
                    className="px-4 py-3 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <input
                  type="text"
                  name="pincode"
                  placeholder="PIN code"
                  value={formData.pincode}
                  onChange={handleChange}
                  maxLength={6}
                  className="w-full px-4 py-3 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="Town / City"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div>
                  <label className="block text-sm text-gray-700 mb-1">State *</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {indianStates.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-gray-900 sticky top-4">
              <h2 className="text-2xl font-bold mb-6 text-black">YOUR ORDER</h2>

              <div className="space-y-4">
                {allCartItems.length === 0 ? (
                  <p className="text-sm text-gray-500 pb-4 border-b">Your cart is empty.</p>
                ) : (
                  // ✅ FIXED: Display ALL items (regular + custom)
                  <div className="pb-4 border-b space-y-3">
                    {allCartItems.map((item, index) => (
                      <div key={item.id || item.timestamp || index} className="flex gap-3">
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 shrink-0">
                          <img
                            src={getImageSrc(item)}
                            alt={getItemTitle(item)}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = '/placeholder-frame.jpg'; }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-gray-700">
                              {getItemTitle(item)} × {item.quantity || 1}
                            </p>
                            <p className="font-semibold text-black">
                              ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            {/* Regular item details */}
                            {item.size && (
                              <p><span className="font-medium">Size:</span> {item.size}</p>
                            )}
                            {item.frameThickness && (
                              <p><span className="font-medium">Thickness:</span> {item.frameThickness}mm</p>
                            )}
                            {item.frameColor && !item.imageUri && (
                              <p><span className="font-medium">Color:</span> {item.frameColor}</p>
                            )}
                            {item.orientation && !item.imageUri && (
                              <p><span className="font-medium">Orientation:</span> {item.orientation}</p>
                            )}
                            {/* Custom frame details */}
                            {item.finalWidthInch && (
                              <p><span className="font-medium">Size:</span> {item.finalWidthInch}x{item.finalHeightInch}" ({item.orientation})</p>
                            )}
                            {item.widthCm && !item.finalWidthInch && (
                              <p><span className="font-medium">Size:</span> {item.widthCm.toFixed(1)}x{item.heightCm.toFixed(1)}cm</p>
                            )}
                            {(item.thicknessMm || item.selectedThickness) && (
                              <p><span className="font-medium">Thickness:</span> {(item.thicknessMm || item.selectedThickness)}mm</p>
                            )}
                            {item.frameShape && (
                              <p><span className="font-medium">Shape:</span> {item.frameShape}</p>
                            )}
                            {item.frameShapeId && (
                              <p><span className="font-medium">Shape:</span> {item.frameShapeId.replace('-', ' ').toUpperCase()}</p>
                            )}
                            {item.frameColor && item.imageUri && (
                              <p><span className="font-medium">Frame Color:</span> {item.frameColor}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between pb-4 border-b">
                  <p className="font-semibold text-black">
                    Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                  </p>
                  <p className="font-semibold text-black">₹{subtotal.toLocaleString()}</p>
                </div>

                <div className="flex justify-between pb-4 border-b">
                  <p className="font-semibold text-black">Shipping</p>
                  <p className="text-green-600 font-semibold">FREE SHIPPING</p>
                </div>

                <div className="flex justify-between items-center py-4">
                  <p className="text-xl font-bold text-black">Total</p>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-black">₹{subtotal.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">(includes 18% tax estimate)</p>
                  </div>
                </div>

                <button
                  onClick={handleRazorpayPayment}
                  disabled={loading || paymentLoading || allCartItems.length === 0 || !razorpayLoaded}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 rounded transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {paymentLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing Payment...
                    </>
                  ) : loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving Order...
                    </>
                  ) : (
                    'Pay with Razorpay'
                  )}
                </button>

                <button
                  className="w-full text-left text-gray-700 cursor-pointer hover:text-gray-900 mt-4"
                  onClick={() => router.back()}
                >
                  &lt; Back to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
