// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import { useCart } from '@/context/cartContext';
// import { CreditCard, Lock, ShoppingCart, Check, Sparkles } from 'lucide-react';
// import CartSidebar from '@/components/cartSidebar';

// export default function CheckoutPage() {
//   const router = useRouter();
//   const { cartItems, getTotalPrice, getTotalItems } = useCart();

//   const [formData, setFormData] = useState({
//     email: '',
//     firstName: '',
//     lastName: '',
//     address: '',
//     city: '',
//     state: '',
//     zip: '',
//     cardNumber: '',
//     cardName: '',
//     expiry: '',
//     cvv: ''
//   });

//   const [focusedField, setFocusedField] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   const subtotal = getTotalPrice();
//   const shipping = 0;
//   const tax = 0;
//   const total = subtotal + shipping + tax;

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const token = localStorage.getItem('token');
//     if (!token) {
//       setErrorMessage('Please log in to place an order.');
//       router.push('/login');
//       return;
//     }

//     setLoading(true);
//     setErrorMessage('');
//     setSuccessMessage('');

//     try {
//       await axios.post(
//         'http://localhost:4000/api/addresses',
//         {
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           email: formData.email,
//           address: formData.address,
//           city: formData.city,
//           state: formData.state,
//           zip: formData.zip,
//           country: 'India',
//           phone: '9999999999', // later: use real phone input
//           label: 'home',
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setSuccessMessage('Address saved successfully! (order creation next)');
//       // later: call your /api/orders endpoint here using cartItems + total
//     } catch (err) {
//       const msg =
//         err.response?.data?.message ||
//         err.message ||
//         'Failed to save address';
//       setErrorMessage(msg);
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
//       {/* Cart sidebar is mounted here so it can open on this page too */}
//       <CartSidebar />

//       {/* Animated Background Elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
//         <div
//           className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
//           style={{ animationDelay: '1s' }}
//         ></div>
//         <div
//           className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
//           style={{ animationDelay: '2s' }}
//         ></div>
//       </div>

//       <div className="max-w-7xl mx-auto relative z-10">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg mb-4">
//             <Sparkles className="w-5 h-5 text-purple-600" />
//             <span className="text-sm font-semibold text-purple-600">
//               Secure Checkout
//             </span>
//           </div>
//           <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
//             Complete Your Order
//           </h1>
//           <p className="text-gray-600 text-lg">
//             You&apos;re just one step away from amazing products
//           </p>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="grid lg:grid-cols-3 gap-8">
//             {/* Left Column - Forms */}
//             <div className="lg:col-span-2 space-y-6">
//               {/* Contact Information */}
//               <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
//                     <span className="text-white font-bold">1</span>
//                   </div>
//                   <h2 className="text-2xl font-bold text-gray-800">
//                     Contact Information
//                   </h2>
//                 </div>
//                 <div className="relative">
//                   <input
//                     type="email"
//                     name="email"
//                     placeholder="your.email@example.com"
//                     className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none"
//                     onChange={handleChange}
//                     onFocus={() => setFocusedField('email')}
//                     onBlur={() => setFocusedField('')}
//                     required
//                   />
//                   {formData.email && (
//                     <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
//                   )}
//                 </div>
//               </div>

//               {/* Shipping Address */}
//               <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
//                     <span className="text-white font-bold">2</span>
//                   </div>
//                   <h2 className="text-2xl font-bold text-gray-800">
//                     Shipping Address
//                   </h2>
//                 </div>
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-2 gap-4">
//                     <input
//                       type="text"
//                       name="firstName"
//                       placeholder="First name"
//                       className="px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none"
//                       onChange={handleChange}
//                       required
//                     />
//                     <input
//                       type="text"
//                       name="lastName"
//                       placeholder="Last name"
//                       className="px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none"
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
//                   <input
//                     type="text"
//                     name="address"
//                     placeholder="Street address"
//                     className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none"
//                     onChange={handleChange}
//                     required
//                   />
//                   <div className="grid grid-cols-6 gap-4">
//                     <input
//                       type="text"
//                       name="city"
//                       placeholder="City"
//                       className="col-span-3 px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none"
//                       onChange={handleChange}
//                       required
//                     />
//                     <input
//                       type="text"
//                       name="state"
//                       placeholder="State"
//                       className="col-span-2 px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none"
//                       onChange={handleChange}
//                       required
//                     />
//                     <input
//                       type="text"
//                       name="zip"
//                       placeholder="ZIP"
//                       className="col-span-1 px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none"
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Payment Information */}
//               <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-600 rounded-xl flex items-center justify-center">
//                     <CreditCard className="w-5 h-5 text-white" />
//                   </div>
//                   <h2 className="text-2xl font-bold text-gray-800">
//                     Payment Details
//                   </h2>
//                 </div>
//                 <div className="space-y-4">
//                   <input
//                     type="text"
//                     name="cardNumber"
//                     placeholder="Card number"
//                     maxLength="19"
//                     className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none"
//                     onChange={handleChange}
//                   />
//                   <input
//                     type="text"
//                     name="cardName"
//                     placeholder="Cardholder name"
//                     className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none"
//                     onChange={handleChange}
//                   />
//                   <div className="grid grid-cols-2 gap-4">
//                     <input
//                       type="text"
//                       name="expiry"
//                       placeholder="MM/YY"
//                       maxLength="5"
//                       className="px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none"
//                       onChange={handleChange}
//                     />
//                     <input
//                       type="text"
//                       name="cvv"
//                       placeholder="CVV"
//                       maxLength="3"
//                       className="px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none"
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Column - Order Summary */}
//             <div className="lg:col-span-1">
//               <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20 sticky top-8">
//                 <div className="flex items-center gap-3 mb-6">
//                   <ShoppingCart className="w-6 h-6 text-purple-600" />
//                   <h2 className="text-2xl font-bold text-gray-800">
//                     Order Summary
//                   </h2>
//                 </div>

//                 {/* Cart Items */}
//                 <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
//                   {cartItems.length === 0 ? (
//                     <p className="text-sm text-gray-500">
//                       Your cart is empty.
//                     </p>
//                   ) : (
//                     cartItems.map((item, index) => (
//                       <div
//                         key={index}
//                         className="flex gap-4 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50"
//                       >
//                         <img
//                           src={item.uploadedImageUrl || item.imageUrl}
//                           alt={item.title}
//                           className="w-16 h-16 rounded-lg object-cover"
//                         />
//                         <div className="flex-1">
//                           <h3 className="font-semibold text-gray-800">
//                             {item.title}
//                           </h3>
//                           <p className="text-gray-500 text-xs">
//                             Qty: {item.quantity}
//                           </p>
//                         </div>
//                         <p className="font-bold text-purple-600 text-sm">
//                           ₹{(item.price * item.quantity).toLocaleString()}
//                         </p>
//                       </div>
//                     ))
//                   )}
//                 </div>

//                 {/* Price Breakdown */}
//                 <div className="border-t-2 border-gray-200 pt-4 space-y-3">
//                   <div className="flex justify-between text-gray-600">
//                     <span>Subtotal ({getTotalItems()} items)</span>
//                     <span className="font-semibold">
//                       ₹{subtotal.toLocaleString()}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-gray-600">
//                     <span>Shipping</span>
//                     <span className="font-semibold">
//                       {shipping === 0 ? 'FREE' : `₹${shipping}`}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-gray-600">
//                     <span>Tax</span>
//                     <span className="font-semibold">
//                       {tax === 0 ? 'Calculated later' : `₹${tax}`}
//                     </span>
//                   </div>
//                   <div className="border-t-2 border-gray-200 pt-3 flex justify-between text-xl font-bold">
//                     <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                       Total
//                     </span>
//                     <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                       ₹{total.toLocaleString()}
//                     </span>
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full mt-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl hover:scale-105 transform disabled:opacity-60 disabled:cursor-not-allowed"
//                 >
//                   <Lock className="w-5 h-5" />
//                   {loading ? 'Saving address...' : 'Place Order'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </form>

//         {/* Trust Badges */}
//         <div className="mt-12 flex justify-center items-center gap-8 text-gray-400 text-sm">
//           <div className="flex items-center gap-2">
//             <Check className="w-4 h-4" />
//             <span>Secure Payment</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Check className="w-4 h-4" />
//             <span>Free Returns</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Check className="w-4 h-4" />
//             <span>Fast Shipping</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';
import { useState } from 'react';
import { Home } from 'lucide-react';

const addressSchema = {
  email: { type: 'string', required: true },
  phone: { type: 'string', required: true },
  firstName: { type: 'string', required: true },
  lastName: { type: 'string', required: true },
  address: { type: 'string', required: true },
  area: { type: 'string', required: true },
  pincode: { type: 'string', required: true, pattern: '^[0-9]{6}$' },
  city: { type: 'string', required: true },
  state: { type: 'string', required: true }
};

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    area: '',
    pincode: '',
    city: '',
    state: 'Andhra Pradesh'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    for (const [field, schema] of Object.entries(addressSchema)) {
      const value = formData[field];
      if (schema.required && !value.trim()) {
        setError(`${field.replace(/([A-Z])/g, ' $1').toUpperCase()} is required`);
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/save-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          orderId: `ORD-${Date.now()}`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save address');
      }

      const result = await response.json();
      console.log('Address saved:', result);
      alert('Address saved successfully! Proceeding to payment...');

      // Optionally redirect to payment page
      // window.location.href = '/payment';

    } catch (err) {
      console.error('Error:', err);
      setError('Failed to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            <Home size={20} />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Login and Coupon Links */}
        {/* <div className="mb-6 space-y-2">
          <p className="text-sm text-gray-700">
            Returning customer? <button className="text-blue-600 hover:underline">Click here to login</button>
          </p>
          <p className="text-sm text-gray-700">
            Have a coupon? <button className="text-blue-600 hover:underline">Click here to enter your code</button>
          </p>
        </div> */}

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Billing & Shipping Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">BILLING & SHIPPING</h2>

              <div className="space-y-4">
                {/* Email */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* First and Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Address and Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="address"
                    placeholder="Flat, House no., Building, Company, Apartment"
                    value={formData.address}
                    onChange={handleChange}
                    className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    name="area"
                    placeholder="Area, Street, Sector, Village"
                    value={formData.area}
                    onChange={handleChange}
                    className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* PIN Code */}
                <div>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="PIN code"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* City */}
                <div>
                  <input
                    type="text"
                    name="city"
                    placeholder="Town / City"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1">State *</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-gray-900 sticky top-4">
              <h2 className="text-2xl font-bold mb-6 text-black">YOUR ORDER</h2>

              <div className="space-y-4">
                <div className="flex justify-between items-start pb-4 border-b">
                  <div className="flex-1">
                    <p className="font-semibold">PRODUCT</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">SUBTOTAL</p>
                  </div>
                </div>

                {/* Product Item */}
                <div className="pb-4 border-b">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-gray-700">Portrait Acrylic Wall Photo × 1</p>
                    <p className="font-semibold">₹699</p>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Size (Inch):</span> 12x9</p>
                    <p><span className="font-medium">Thickness (mm):</span> 3mm</p>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="flex justify-between pb-4 border-b">
                  <p className="font-semibold">Subtotal</p>
                  <p className="font-semibold">₹699</p>
                </div>

                {/* Shipping */}
                <div className="flex justify-between pb-4 border-b">
                  <p className="font-semibold">Shipping</p>
                  <p className="text-green-600 font-semibold">FREE SHIPPING</p>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-4">
                  <p className="text-xl font-bold">Total</p>
                  <div className="text-right">
                    <p className="text-2xl font-bold">₹699</p>
                    <p className="text-xs text-gray-600">(includes ₹107 18% IGST)</p>
                  </div>
                </div>

                {/* Continue to Payment Button */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 rounded transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Continue to Payment'
                  )}
                </button>

                {/* Back to Cart Link */}
                <button className="w-full text-left text-gray-700 hover:text-gray-900 mt-4">
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
