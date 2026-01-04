// // app/admin/orders/[id]/page.jsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import axios from 'axios';
// import {
//     ArrowLeft,
//     User,
//     Mail,
//     Image as ImageIcon,
//     Package,
//     Calendar,
//     Clock,
//     CreditCard,
//     CheckCircle2,
//     AlertCircle,
// } from 'lucide-react';
// import Link from 'next/link';

// export default function OrderDetailsPage() {
//     const { id } = useParams(); // order id from URL  

//     const [order, setOrder] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         if (!id) return;

//         const fetchOrder = async () => {
//             try {
//                 setLoading(true);
//                 setError('');
//                 const token = localStorage.getItem('token'); // if protected
//                 const res = await axios.get(
//                     `http://localhost:4000/api/order/${id}`,
//                     token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
//                 );
//                 setOrder(res.data);
//             } catch (err) {
//                 const msg =
//                     err.response?.data?.message ||
//                     err.message ||
//                     'Failed to load order';
//                 setError(msg);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchOrder();
//     }, [id]);

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-[#12002c] text-purple-100">
//                 Loading order…
//             </div>
//         );
//     }

//     if (error || !order) {
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center bg-[#12002c] text-purple-100">
//                 <p className="mb-4 text-red-400">{error || 'Order not found.'}</p>
//                 <Link
//                     href="/dashboard/orders"
//                     className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/80 hover:bg-purple-500 text-sm font-medium"
//                 >
//                     <ArrowLeft className="w-4 h-4" /> Back to Orders
//                 </Link>
//             </div>
//         );
//     }

//     const item = order.items?.[0]; // single item in your example
//     const created = new Date(order.createdAt);
//     const dateStr = created.toLocaleDateString('en-IN', {
//         day: '2-digit',
//         month: 'short',
//         year: 'numeric',
//     });
//     const timeStr = created.toLocaleTimeString('en-IN', {
//         hour: '2-digit',
//         minute: '2-digit',
//     });

//     const statusColor =
//         order.status === 'completed'
//             ? 'bg-green-500/20 text-green-300 border-green-400/60'
//             : order.status === 'cancelled'
//                 ? 'bg-red-500/20 text-red-300 border-red-400/60'
//                 : 'bg-yellow-500/20 text-yellow-300 border-yellow-400/60';

//     const paymentColor =
//         order.paymentStatus === 'paid'
//             ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/60'
//             : 'bg-orange-500/20 text-orange-300 border-orange-400/60';

//     const baseImageUrl = 'http://localhost:4000'; // because imageUrl is "/uploads/..."

//     return (
//         <div className="py-20 bg-linear-to-br from-[#150042] via-[#210057] to-[#2c006b] text-purple-50">
//             <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
//                 {/* Top bar */}
//                 <div className="flex items-center justify-between">
//                     <div>
//                         <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
//                             <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/50">
//                                 <Package className="w-5 h-5 text-purple-100" />
//                             </span>
//                             Order Details
//                         </h1>
//                         <p className="text-sm text-purple-200/80 mt-1">
//                             Detailed view for order <span className="font-semibold">#{order._id}</span>
//                         </p>
//                     </div>
//                     <Link
//                         href="/dashboard/orders"
//                         className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/80 hover:bg-purple-500 text-sm font-medium shadow-lg shadow-purple-900/40"
//                     >
//                         <ArrowLeft className="w-4 h-4" /> All Orders
//                     </Link>
//                 </div>

//                 {/* Stats cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="rounded-2xl bg-linear-to-br from-purple-600/70 to-purple-500/40 border border-purple-300/40 p-4 flex items-center justify-between">
//                         <div>
//                             <p className="text-xs font-semibold tracking-wide text-purple-200/80 mb-1">
//                                 TOTAL AMOUNT
//                             </p>
//                             <p className="text-2xl font-bold text-emerald-300">
//                                 ₹{order.totalAmount}
//                             </p>
//                         </div>
//                         <div className="w-10 h-10 rounded-2xl bg-black/20 flex items-center justify-center">
//                             <CreditCard className="w-5 h-5 text-emerald-300" />
//                         </div>
//                     </div>

//                     <div className="rounded-2xl bg-linear-to-br from-purple-600/70 to-pink-500/40 border border-purple-300/40 p-4 flex items-center justify-between">
//                         <div>
//                             <p className="text-xs font-semibold tracking-wide text-purple-200/80 mb-1">
//                                 PAYMENT STATUS
//                             </p>
//                             <span
//                                 className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-semibold ${paymentColor}`}
//                             >
//                                 {order.paymentStatus === 'paid' ? (
//                                     <CheckCircle2 className="w-3 h-3" />
//                                 ) : (
//                                     <AlertCircle className="w-3 h-3" />
//                                 )}
//                                 {order.paymentStatus}
//                             </span>
//                             <p className="text-[11px] text-purple-200/70 mt-1">
//                                 Method: <span className="uppercase">{order.paymentMethod}</span>
//                             </p>
//                         </div>
//                     </div>

//                     <div className="rounded-2xl bg-linear-to-br from-purple-600/70 to-orange-500/40 border border-purple-300/40 p-4 flex items-center justify-between">
//                         <div>
//                             <p className="text-xs font-semibold tracking-wide text-purple-200/80 mb-1">
//                                 ORDER STATUS
//                             </p>
//                             <span
//                                 className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-semibold ${statusColor}`}
//                             >
//                                 {order.status === 'completed' ? (
//                                     <CheckCircle2 className="w-3 h-3" />
//                                 ) : (
//                                     <AlertCircle className="w-3 h-3" />
//                                 )}
//                                 {order.status}
//                             </span>
//                             <p className="text-[11px] text-purple-200/70 mt-1">
//                                 Created on {dateStr} at {timeStr}
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Main content: left meta + right item */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     {/* Left column */}
//                     <div className="space-y-4 lg:col-span-1">
//                         <div className="rounded-2xl bg-white/5 border border-purple-400/40 p-4 space-y-3">
//                             <h2 className="text-sm font-semibold text-purple-100 flex items-center gap-2">
//                                 <User className="w-4 h-4 text-purple-200" />
//                                 Customer
//                             </h2>
//                             <div className="flex items-center gap-3">
//                                 <div className="w-9 h-9 rounded-full bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-sm font-bold">
//                                     {/* first letter fallback; replace with actual customer name/email if you populate it */}
//                                     {(order.userName || 'M')[0]}
//                                 </div>
//                                 <div className="space-y-0.5">
//                                     <p className="text-sm font-semibold">
//                                         {order.userName || 'Customer'}
//                                     </p>
//                                     <div className="flex items-center gap-1 text-xs text-purple-200/80">
//                                         <Mail className="w-3 h-3" />
//                                         <span>{order.userEmail || 'customer@example.com'}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="rounded-2xl bg-white/5 border border-purple-400/40 p-4 space-y-3">
//                             <h2 className="text-sm font-semibold text-purple-100 flex items-center gap-2">
//                                 <Calendar className="w-4 h-4 text-purple-200" />
//                                 Order Timeline
//                             </h2>
//                             <div className="text-xs text-purple-200/80 space-y-1">
//                                 <p className="flex items-center gap-2">
//                                     <Clock className="w-3 h-3" />
//                                     <span>Placed on {dateStr} at {timeStr}</span>
//                                 </p>
//                                 <p>Status: <span className="font-semibold">{order.status}</span></p>
//                                 <p>Payment: <span className="font-semibold">{order.paymentStatus}</span></p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Right column: item details */}
//                     <div className="lg:col-span-2 rounded-2xl bg-white/5 border border-purple-400/40 p-5">
//                         <div className="flex items-center justify-between mb-4">
//                             <h2 className="text-sm font-semibold text-purple-100 flex items-center gap-2">
//                                 <ImageIcon className="w-4 h-4 text-purple-200" />
//                                 Item Details
//                             </h2>
//                             <span className="text-xs text-purple-200/80">
//                                 Order ID: <span className="font-mono">{order._id}</span>
//                             </span>
//                         </div>

//                         <div className="grid md:grid-cols-2 gap-5">
//                             {/* Image + preview */}
//                             <div className="space-y-3">
//                                 <div className="relative rounded-2xl overflow-hidden bg-black/20 border border-purple-500/40">
//                                     <img
//                                         src={`${baseImageUrl}${item.imageUrl}`}
//                                         alt="Framed photo"
//                                         className="w-full h-64 object-cover"
//                                     />
//                                     <div className="absolute bottom-2 left-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur text-[11px] font-medium flex items-center gap-2">
//                                         <Package className="w-3 h-3 text-emerald-300" />
//                                         <span>{item.size} • {item.orientation}</span>
//                                     </div>
//                                 </div>
//                                 <p className="text-xs text-purple-200/80">
//                                     Image path: <span className="font-mono">{item.imageUrl}</span>
//                                 </p>
//                             </div>

//                             {/* Specs */}
//                             <div className="space-y-3">
//                                 <div className="grid grid-cols-2 gap-3 text-xs text-purple-100">
//                                     <div className="rounded-xl bg-black/20 border border-purple-500/40 p-3">
//                                         <p className="text-purple-300/80 text-[11px]">Size</p>
//                                         <p className="mt-1 font-semibold">{item.size}</p>
//                                     </div>
//                                     <div className="rounded-xl bg-black/20 border border-purple-500/40 p-3">
//                                         <p className="text-purple-300/80 text-[11px]">Color</p>
//                                         <p className="mt-1 font-semibold">{item.frameColor}</p>
//                                     </div>
//                                     <div className="rounded-xl bg-black/20 border border-purple-500/40 p-3">
//                                         <p className="text-purple-300/80 text-[11px]">Material</p>
//                                         <p className="mt-1 font-semibold capitalize">
//                                             {item.frameMaterial}
//                                         </p>
//                                     </div>
//                                     <div className="rounded-xl bg-black/20 border border-purple-500/40 p-3">
//                                         <p className="text-purple-300/80 text-[11px]">Thickness</p>
//                                         <p className="mt-1 font-semibold">{item.frameThickness} mm</p>
//                                     </div>
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-3 text-xs text-purple-100">
//                                     <div className="rounded-xl bg-black/20 border border-purple-500/40 p-3">
//                                         <p className="text-purple-300/80 text-[11px]">Orientation</p>
//                                         <p className="mt-1 font-semibold capitalize">
//                                             {item.orientation}
//                                         </p>
//                                     </div>
//                                     <div className="rounded-xl bg-black/20 border border-purple-500/40 p-3">
//                                         <p className="text-purple-300/80 text-[11px]">Quantity</p>
//                                         <p className="mt-1 font-semibold">x{item.quantity}</p>
//                                     </div>
//                                 </div>

//                                 <div className="mt-4 flex items-center justify-between border-t border-purple-500/40 pt-3">
//                                     <div className="text-xs text-purple-200/80">
//                                         <p>Item price: <span className="font-semibold">₹{item.price}</span></p>
//                                         <p>Total amount: <span className="font-semibold">₹{order.totalAmount}</span></p>
//                                     </div>
//                                     <div className="rounded-full px-4 py-2 bg-purple-600/80 text-xs font-semibold shadow-lg shadow-purple-900/40">
//                                         Pending actions
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


// app/admin/orders/[id]/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import {
    ArrowLeft,
    User,
    Mail,
    Image as ImageIcon,
    Package,
    Calendar,
    Clock,
    CreditCard,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function OrderDetailsPage() {
    const { id } = useParams(); // order id from URL

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // ---------- FETCH ORDER BY ID ----------
    useEffect(() => {
        if (!id) return;

        const fetchOrder = async () => {
            try {
                setLoading(true);
                setError('');
                const token = localStorage.getItem('token'); // if protected
                const res = await axios.get(
                    `http://localhost:4000/api/order/${id}`,
                    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
                );
                setOrder(res.data);
            } catch (err) {
                const msg =
                    err.response?.data?.message ||
                    err.message ||
                    'Failed to load order';
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#12002c] text-purple-100">
                Loading order…
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#12002c] text-purple-100">
                <p className="mb-4 text-red-400">{error || 'Order not found.'}</p>
                <Link
                    href="/dashboard/orders"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/80 hover:bg-purple-500 text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Orders
                </Link>
            </div>
        );
    }

    const item = order.items?.[0]; // single item in your example

    const created = new Date(order.createdAt);
    const dateStr = created.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
    const timeStr = created.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
    });

    const statusColor =
        order.status === 'completed'
            ? 'bg-green-500/20 text-green-300 border-green-400/60'
            : order.status === 'cancelled'
                ? 'bg-red-500/20 text-red-300 border-red-400/60'
                : 'bg-yellow-500/20 text-yellow-300 border-yellow-400/60';

    const paymentColor =
        order.paymentStatus === 'paid'
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/60'
            : 'bg-orange-500/20 text-orange-300 border-orange-400/60';

    // Base URL because imageUrl in DB is like "/uploads/xyz.jpg"
    const baseImageUrl = 'http://localhost:4000';

    // ---------- BUTTON LOGIC: DOWNLOAD IMAGE ----------
    // Logic:
    // 1. Create a hidden <a> element in JS.
    // 2. Set href to the full image URL.
    // 3. Set download attribute so browser saves the file.
    // 4. Trigger click() and then remove the element.
    // const handleDownloadImage = () => {
    //     if (!item?.imageUrl) return;

    //     const link = document.createElement('a');
    //     link.href = `${baseImageUrl}${item.imageUrl}`; // actual image URL
    //     link.download = `order-${order._id}-image.jpg`; // file name for user
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // };

    const handleDownloadImage = async () => {
        if (!item?.imageUrl) return;

        try {
            const res = await fetch(`${baseImageUrl}${item.imageUrl}`);
            const blob = await res.blob();

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `order-${order._id}-image.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to download image', err);
        }
    };


    // ---------- BUTTON LOGIC: DOWNLOAD RECEIPT ----------
    // Here we generate a simple text "receipt" on the client:
    // 1. Build a multi-line string with all important order info.
    // 2. Create a Blob from that string.
    // 3. Create a temporary object URL from the Blob.
    // 4. Use a hidden <a> with that URL + download to save locally.
    // const handleDownloadReceipt = () => {
    //     const lines = [
    //         'Order Receipt',
    //         '---------------------------',
    //         `Order ID: ${order._id}`,
    //         `Date: ${dateStr} ${timeStr}`,
    //         '',
    //         `Status: ${order.status}`,
    //         `Payment Status: ${order.paymentStatus}`,
    //         `Payment Method: ${order.paymentMethod}`,
    //         '',
    //         'Item Details:',
    //         `  Product ID: ${item.product}`,
    //         `  Size: ${item.size}`,
    //         `  Color: ${item.frameColor}`,
    //         `  Material: ${item.frameMaterial}`,
    //         `  Thickness: ${item.frameThickness} mm`,
    //         `  Orientation: ${item.orientation}`,
    //         `  Quantity: ${item.quantity}`,
    //         `  Price (single): ₹${item.price}`,
    //         '',
    //         `Total Amount: ₹${order.totalAmount}`,
    //         '',
    //         'Thank you for your order!',
    //     ];

    //     const receiptText = lines.join('\n');

    //     // Create a Blob representing the receipt file
    //     const blob = new Blob([receiptText], { type: 'text/plain' });
    //     const url = URL.createObjectURL(blob);

    //     // Create temporary <a> to trigger download
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.download = `order-${order._id}-receipt.txt`;
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);

    //     // Free the object URL
    //     URL.revokeObjectURL(url);
    // };

    // const handleDownloadReceipt = () => {
    //     const productId =
    //         typeof item.product === 'string'
    //             ? item.product
    //             : item.product?._id || 'N/A';

    //     const productName =
    //         typeof item.product === 'string'
    //             ? 'Product'
    //             : item.product?.title || 'Product';

    //     const lines = [
    //         '==============================',
    //         '          ORDER RECEIPT       ',
    //         '==============================',
    //         '',
    //         `Order ID     : ${order._id}`,
    //         `Date & Time  : ${dateStr} ${timeStr}`,
    //         '',
    //         `Status       : ${order.status}`,
    //         `Payment Stat.: ${order.paymentStatus}`,
    //         `Payment Mode : ${order.paymentMethod}`,
    //         '',
    //         '-------- ITEM DETAILS --------',
    //         `Product Name : ${productName}`,
    //         `Product ID   : ${productId}`,
    //         `Size         : ${item.size}`,
    //         `Color        : ${item.frameColor}`,
    //         `Material     : ${item.frameMaterial}`,
    //         `Thickness    : ${item.frameThickness} mm`,
    //         `Orientation  : ${item.orientation}`,
    //         `Quantity     : ${item.quantity}`,
    //         `Price (each) : ₹${item.price}`,
    //         '',
    //         `TOTAL AMOUNT : ₹${order.totalAmount}`,
    //         '',
    //         'Thank you for your order!',
    //         '==============================',
    //     ];

    //     const receiptText = lines.join('\n');

    //     const blob = new Blob([receiptText], { type: 'text/plain' });
    //     const url = URL.createObjectURL(blob);

    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.download = `order-${order._id}-receipt.txt`;
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //     URL.revokeObjectURL(url);
    // };
    const handleDownloadReceipt = async () => {
        const element = document.getElementById('receipt');
        if (!element) return;

        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgProps = pdf.getImageProperties(imgData);
        const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
        const imgWidth = imgProps.width * ratio;
        const imgHeight = imgProps.height * ratio;

        pdf.addImage(imgData, 'PNG', (pageWidth - imgWidth) / 2, 10, imgWidth, imgHeight);
        pdf.save(`order-${order._id}-receipt.pdf`);
    };


    return (
        <div className="py-20 bg-linear-to-br from-[#150042] via-[#210057] to-[#2c006b] text-purple-50">
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
                {/* Top bar */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/50">
                                <Package className="w-5 h-5 text-purple-100" />
                            </span>
                            Order Details
                        </h1>
                        <p className="text-sm text-purple-200/80 mt-1">
                            Detailed view for order <span className="font-semibold">#{order._id}</span>
                        </p>
                    </div>
                    <Link
                        href="/dashboard/orders"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/80 hover:bg-purple-500 text-sm font-medium shadow-lg shadow-purple-900/40"
                    >
                        <ArrowLeft className="w-4 h-4" /> All Orders
                    </Link>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-linear-to-br from-purple-600/70 to-purple-500/40 border border-purple-300/40 p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold tracking-wide text-purple-200/80 mb-1">
                                TOTAL AMOUNT
                            </p>
                            <p className="text-2xl font-bold text-emerald-300">
                                ₹{order.totalAmount}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-black/20 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-emerald-300" />
                        </div>
                    </div>

                    <div className="rounded-2xl bg-linear-to-br from-purple-600/70 to-pink-500/40 border border-purple-300/40 p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold tracking-wide text-purple-200/80 mb-1">
                                PAYMENT STATUS
                            </p>
                            <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-semibold ${paymentColor}`}
                            >
                                {order.paymentStatus === 'paid' ? (
                                    <CheckCircle2 className="w-3 h-3" />
                                ) : (
                                    <AlertCircle className="w-3 h-3" />
                                )}
                                {order.paymentStatus}
                            </span>
                            <p className="text-[11px] text-purple-200/70 mt-1">
                                Method: <span className="uppercase">{order.paymentMethod}</span>
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-linear-to-br from-purple-600/70 to-orange-500/40 border border-purple-300/40 p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold tracking-wide text-purple-200/80 mb-1">
                                ORDER STATUS
                            </p>
                            <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-semibold ${statusColor}`}
                            >
                                {order.status === 'completed' ? (
                                    <CheckCircle2 className="w-3 h-3" />
                                ) : (
                                    <AlertCircle className="w-3 h-3" />
                                )}
                                {order.status}
                            </span>
                            <p className="text-[11px] text-purple-200/70 mt-1">
                                Created on {dateStr} at {timeStr}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main content: left meta + right item */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column */}
                    <div className="space-y-4 lg:col-span-1">
                        <div className="rounded-2xl bg-white/5 border border-purple-400/40 p-4 space-y-3">
                            <h2 className="text-sm font-semibold text-purple-100 flex items-center gap-2">
                                <User className="w-4 h-4 text-purple-200" />
                                Customer
                            </h2>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-sm font-bold">
                                    {(order.userName || 'M')[0]}
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-semibold">
                                        {order.userName || 'Customer'}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs text-purple-200/80">
                                        <Mail className="w-3 h-3" />
                                        <span>{order.userEmail || 'customer@example.com'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white/5 border border-purple-400/40 p-4 space-y-3">
                            <h2 className="text-sm font-semibold text-purple-100 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-purple-200" />
                                Order Timeline
                            </h2>
                            <div className="text-xs text-purple-200/80 space-y-1">
                                <p className="flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    <span>Placed on {dateStr} at {timeStr}</span>
                                </p>
                                <p>Status: <span className="font-semibold">{order.status}</span></p>
                                <p>Payment: <span className="font-semibold">{order.paymentStatus}</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Right column: item details */}
                    <div className="lg:col-span-2 rounded-2xl bg-white/5 border border-purple-400/40 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-purple-100 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-purple-200" />
                                Item Details
                            </h2>
                            <span className="text-xs text-purple-200/80">
                                Order ID: <span className="font-mono">{order._id}</span>
                            </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            {/* Image + preview */}
                            <div className="space-y-3">
                                <div className="relative rounded-2xl overflow-hidden bg-black/20 border border-purple-500/40">
                                    <img
                                        src={`${baseImageUrl}${item.imageUrl}`}
                                        alt="Framed photo"
                                        className="w-full h-64 object-cover"
                                    />
                                    <div className="absolute bottom-2 left-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur text-[11px] font-medium flex items-center gap-2">
                                        <Package className="w-3 h-3 text-emerald-300" />
                                        <span>{item.size} • {item.orientation}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-purple-200/80">
                                    Image path: <span className="font-mono">{item.imageUrl}</span>
                                </p>

                                {/* DOWNLOAD BUTTONS AREA */}
                                <div className="flex gap-3 mt-2">
                                    {/* Button 1: download framed image */}
                                    <button
                                        onClick={handleDownloadImage}
                                        className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white"
                                    >
                                        Download Image
                                    </button>

                                    {/* Button 2: download text receipt */}
                                    <button
                                        onClick={handleDownloadReceipt}
                                        className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-xs font-semibold text-white"
                                    >
                                        Download Receipt
                                    </button>
                                </div>
                            </div>

                            {/* Specs */}
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3 text-xs text-purple-100">
                                    <div className="rounded-xl bg-black/20 border border-purple-500/40 p-3">
                                        <p className="text-purple-300/80 text-[11px]">Size</p>
                                        <p className="mt-1 font-semibold">{item.size}</p>
                                    </div>
                                    <div className="rounded-xl bg-black/20 border border-purple-500/40 p-3">
                                        <p className="text-purple-300/80 text-[11px]">Color</p>
                                        <p className="mt-1 font-semibold">{item.frameColor}</p>
                                    </div>
                                    <div className="rounded-xl bg-black/20 border border-purple-500/40 p-3">
                                        <p className="text-purple-300/80 text-[11px]">Material</p>
                                        <p className="mt-1 font-semibold capitalize">
                                            {item.frameMaterial}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-black/20 border border-purple-500/40 p-3">
                                        <p className="text-purple-300/80 text-[11px]">Thickness</p>
                                        <p className="mt-1 font-semibold">{item.frameThickness} mm</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-xs text-purple-100">
                                    <div className="rounded-xl bg-black/20 border border-purple-500/40 p-3">
                                        <p className="text-purple-300/80 text-[11px]">Orientation</p>
                                        <p className="mt-1 font-semibold capitalize">
                                            {item.orientation}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-black/20 border border-purple-500/40 p-3">
                                        <p className="text-purple-300/80 text-[11px]">Quantity</p>
                                        <p className="mt-1 font-semibold">x{item.quantity}</p>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between border-t border-purple-500/40 pt-3">
                                    <div className="text-xs text-purple-200/80">
                                        <p>
                                            Item price:{' '}
                                            <span className="font-semibold">₹{item.price}</span>
                                        </p>
                                        <p>
                                            Total amount:{' '}
                                            <span className="font-semibold">₹{order.totalAmount}</span>
                                        </p>
                                    </div>
                                    <div className="rounded-full px-4 py-2 bg-purple-600/80 text-xs font-semibold shadow-lg shadow-purple-900/40">
                                        Pending actions
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
