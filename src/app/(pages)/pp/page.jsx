// 'use client';

// import React, { useState, useRef, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { X, Download, RotateCw, Eye } from 'lucide-react';

// function PhotoFrameEditorContent() {
//   const [image, setImage] = useState(null);
//   const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
//   const [imageScale, setImageScale] = useState(1);
//   const [frameThickness, setFrameThickness] = useState(20);
//   const [acrylicThickness, setAcrylicThickness] = useState('8mm');
//   const [selectedSize, setSelectedSize] = useState('48x36');
//   const [hasFrame, setHasFrame] = useState(false);
//   const [isPortrait, setIsPortrait] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
//   const [backgroundColor, setBackgroundColor] = useState('#D1D5DB');
//   const [showSizeComparison, setShowSizeComparison] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const fileInputRef = useRef(null);
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const backgroundColors = [
//     { name: 'Gray', color: '#D1D5DB' },
//     { name: 'Cream', color: '#F5F5DC' },
//     { name: 'Light Blue', color: '#ADD8E6' },
//     { name: 'Beige', color: '#F5E6D3' },
//     { name: 'Mint', color: '#E0F2E9' },
//     { name: 'Peach', color: '#FFE5D9' },
//     { name: 'Lavender', color: '#E6E6FA' },
//     { name: 'White', color: '#FFFFFF' }
//   ];

//   const sizes = [
//     { label: '12x9', width: 200, height: 150 },
//     { label: '16x12', width: 250, height: 188 },
//     { label: '18x12', width: 280, height: 187 },
//     { label: '21x15', width: 320, height: 228 },
//     { label: '30x20', width: 400, height: 267 },
//     { label: '35x23', width: 450, height: 296 },
//     { label: '48x36', width: 550, height: 413 }
//   ];

//   const thicknessOptions = ['3mm', '5mm', '8mm'];

//   useEffect(() => {
//     const loadDesignData = () => {
//       try {
//         const urlSize = searchParams.get('size');
//         const urlThickness = searchParams.get('thickness');
//         const urlOrientation = searchParams.get('orientation');
//         const urlFrame = searchParams.get('frame');
//         const urlFrameThickness = searchParams.get('frameThickness');
//         const urlBgColor = searchParams.get('bgColor');

//         const savedDesign =
//           typeof window !== 'undefined'
//             ? localStorage.getItem('customFrameDesign')
//             : null;

//         let designData = null;

//         if (savedDesign) {
//           designData = JSON.parse(savedDesign);
//         }

//         if (urlSize) setSelectedSize(urlSize);
//         else if (designData && designData.selectedSize) setSelectedSize(designData.selectedSize);

//         if (urlThickness) setAcrylicThickness(urlThickness);
//         else if (designData && designData.acrylicThickness)
//           setAcrylicThickness(designData.acrylicThickness);

//         if (urlOrientation) setIsPortrait(urlOrientation === 'portrait');
//         else if (designData && designData.isPortrait !== undefined)
//           setIsPortrait(designData.isPortrait);

//         if (urlFrame) setHasFrame(urlFrame === 'yes' || urlFrame === 'true');
//         else if (designData && designData.hasFrame !== undefined)
//           setHasFrame(designData.hasFrame);

//         if (urlFrameThickness) setFrameThickness(Number(urlFrameThickness));
//         else if (designData && designData.frameThickness)
//           setFrameThickness(designData.frameThickness);

//         if (urlBgColor) setBackgroundColor(`#${urlBgColor}`);
//         else if (designData && designData.backgroundColor)
//           setBackgroundColor(designData.backgroundColor);

//         if (designData && designData.imageUri) {
//           const img = new Image();
//           img.onload = () => {
//             setImage(img);

//             if (designData.imagePosition) {
//               setImagePosition(designData.imagePosition);
//             }
//             if (designData.imageScale) {
//               setImageScale(designData.imageScale);
//             } else {
//               autoFitImage(img);
//             }

//             setIsLoading(false);
//           };
//           img.onerror = () => {
//             console.error('Failed to load image from localStorage');
//             setIsLoading(false);
//           };
//           img.src = designData.imageUri;
//         } else {
//           setIsLoading(false);
//         }
//       } catch (error) {
//         console.error('Error loading design data:', error);
//         setIsLoading(false);
//       }
//     };

//     loadDesignData();
//   }, [searchParams]);

//   const handleImageUpload = (e) => {
//     const file = e.target.files && e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const img = new Image();
//         img.onload = () => {
//           setImage(img);
//           autoFitImage(img);
//         };
//         img.src = event.target.result;
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const autoFitImage = (img) => {
//     if (!img) return;

//     const currentSize = getCurrentSize();
//     const frameWidth = currentSize.width;
//     const frameHeight = currentSize.height;

//     const imgAspect = img.width / img.height;
//     const frameAspect = frameWidth / frameHeight;

//     let scale;
//     if (imgAspect > frameAspect) {
//       scale = frameWidth / img.width;
//     } else {
//       scale = frameHeight / img.height;
//     }

//     setImageScale(scale);

//     const scaledWidth = img.width * scale;
//     const scaledHeight = img.height * scale;
//     setImagePosition({
//       x: (frameWidth - scaledWidth) / 2,
//       y: (frameHeight - scaledHeight) / 2
//     });
//   };

//   useEffect(() => {
//     if (image && !isLoading) {
//       autoFitImage(image);
//     }
//   }, [selectedSize, isPortrait]);

//   const handleMouseDown = (e) => {
//     if (!image) return;
//     setIsDragging(true);
//     setDragStart({
//       x: e.clientX - imagePosition.x,
//       y: e.clientY - imagePosition.y
//     });
//   };

//   const handleMouseMove = (e) => {
//     if (!isDragging || !image) return;
//     setImagePosition({
//       x: e.clientX - dragStart.x,
//       y: e.clientY - dragStart.y
//     });
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

//   const handleWheel = (e) => {
//     if (!image) return;
//     e.preventDefault();
//     const delta = e.deltaY > 0 ? -0.1 : 0.1;
//     setImageScale((prev) => Math.max(0.1, Math.min(3, prev + delta)));
//   };

//   const toggleOrientation = () => {
//     setIsPortrait(!isPortrait);
//   };

//   const getCurrentSize = () => {
//     const size = sizes.find((s) => s.label === selectedSize);
//     if (!size) return { width: 550, height: 413 };
//     return isPortrait ? { width: size.height, height: size.width } : size;
//   };

//   const getThicknessValue = () => parseInt(acrylicThickness);

//   const adjustBrightness = (color, percent) => {
//     const num = parseInt(color.replace('#', ''), 16);
//     const amt = Math.round(2.55 * percent);
//     const R = (num >> 16) + amt;
//     const G = ((num >> 8) & 0x00ff) + amt;
//     const B = (num & 0x0000ff) + amt;
//     return (
//       '#' +
//       (
//         0x1000000 +
//         (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
//         (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
//         (B < 255 ? (B < 1 ? 0 : B) : 255)
//       )
//         .toString(16)
//         .slice(1)
//     );
//   };

//   const generatePreviewCanvas = (size) => {
//     if (!image) return null;

//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return null;

//     const dimensions = isPortrait ? { width: size.height, height: size.width } : size;
//     const actualFrameThickness = hasFrame ? frameThickness : 0;
//     const canvasWidth = dimensions.width + actualFrameThickness * 2;
//     const canvasHeight = dimensions.height + actualFrameThickness * 2;

//     canvas.width = canvasWidth;
//     canvas.height = canvasHeight;

//     if (hasFrame) {
//       ctx.fillStyle = '#000000';
//       ctx.fillRect(0, 0, canvasWidth, canvasHeight);
//     }

//     ctx.save();
//     ctx.beginPath();
//     ctx.rect(
//       actualFrameThickness,
//       actualFrameThickness,
//       dimensions.width,
//       dimensions.height
//     );
//     ctx.clip();

//     const scaledWidth = image.width * imageScale;
//     const scaledHeight = image.height * imageScale;

//     ctx.drawImage(
//       image,
//       actualFrameThickness + imagePosition.x,
//       actualFrameThickness + imagePosition.y,
//       scaledWidth,
//       scaledHeight
//     );

//     ctx.restore();

//     return canvas.toDataURL('image/png', 1.0);
//   };

//   const handleSave = () => {
//     if (!image) return;
//     const imageUri = generatePreviewCanvas(getCurrentSize());
//     if (!imageUri) return;
//     const link = document.createElement('a');
//     link.download = `framed-photo-${selectedSize}.png`;
//     link.href = imageUri;
//     link.click();
//   };

//   const handleSaveAndNext = () => {
//     if (!image) return;

//     const imageUri = generatePreviewCanvas(getCurrentSize());
//     if (!imageUri) return;

//     const designData = {
//       imageUri: imageUri,
//       selectedSize: selectedSize,
//       acrylicThickness: acrylicThickness,
//       hasFrame: hasFrame,
//       frameThickness: frameThickness,
//       isPortrait: isPortrait,
//       backgroundColor: backgroundColor,
//       imagePosition: imagePosition,
//       imageScale: imageScale,
//       timestamp: new Date().toISOString()
//     };

//     localStorage.setItem('customFrameDesign', JSON.stringify(designData));

//     const params = new URLSearchParams({
//       size: selectedSize,
//       thickness: acrylicThickness,
//       orientation: isPortrait ? 'portrait' : 'landscape',
//       frame: hasFrame ? 'yes' : 'no',
//       frameThickness: frameThickness.toString(),
//       bgColor: backgroundColor.replace('#', '')
//     });

//     router.push(`/select-size?${params.toString()}`);
//   };

//   const currentSize = getCurrentSize();
//   const actualFrameThickness = hasFrame ? frameThickness : 0;
//   const thickness = getThicknessValue();

//   // Calculate border radius based on size
//   const getBorderRadius = (dimensions) => {
//     const avgDimension = (dimensions.width + dimensions.height) / 2;
//     return Math.min(avgDimension * 0.05, 30);
//   };

//   // Container radius matches frame shape
//   const getContainerRadius = (dimensions) => {
//     const baseRadius = getBorderRadius(dimensions);
//     return baseRadius;
//   };

//   // Render frame component
//   const renderFrame = (size, isMain) => {
//     const dimensions = isPortrait ? { width: size.height, height: size.width } : size;
//     const scale = isMain ? 1 : 0.3;
//     const borderRadius = getBorderRadius(dimensions);

//     return (
//       <div
//         style={{
//           width: `${(dimensions.width + actualFrameThickness * 2) * scale}px`,
//           height: `${(dimensions.height + actualFrameThickness * 2) * scale}px`,
//           backgroundColor: hasFrame ? '#000000' : 'transparent',
//           padding: hasFrame ? `${actualFrameThickness * scale}px` : '0',
//           position: 'relative',
//           boxShadow:
//             thickness >= 5
//               ? `0 ${thickness * scale}px ${thickness * 2 * scale}px rgba(0,0,0,0.3)`
//               : '0 2px 8px rgba(0,0,0,0.2)',
//           transform: `translateY(-${(thickness / 2) * scale}px)`,
//           transition: 'all 0.3s ease',
//           margin: isMain ? '0' : 'auto',
//           borderRadius: `${borderRadius * scale}px`
//         }}
//       >
//         <div
//           style={{
//             width: '100%',
//             height: '100%',
//             position: 'relative',
//             overflow: 'hidden',
//             cursor: isMain && image ? (isDragging ? 'grabbing' : 'grab') : 'default',
//             borderRadius: `${borderRadius * 0.7 * scale}px`,
//             backgroundColor: '#E5E7EB'
//           }}
//           onMouseDown={isMain ? handleMouseDown : undefined}
//           onMouseMove={isMain ? handleMouseMove : undefined}
//           onMouseUp={isMain ? handleMouseUp : undefined}
//           onMouseLeave={isMain ? handleMouseUp : undefined}
//           onWheel={isMain ? handleWheel : undefined}
//         >
//           {!image ? (
//             <div className="absolute inset-0 flex items-center justify-center">
//               <button
//                 onClick={() => fileInputRef.current && fileInputRef.current.click()}
//                 className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
//                 style={{
//                   fontSize: isMain ? '16px' : '8px',
//                   padding: isMain ? '12px 24px' : '4px 8px'
//                 }}
//               >
//                 SELECT
//                 <br />
//                 PHOTO
//               </button>
//             </div>
//           ) : (
//             <img
//               src={image.src}
//               alt="Uploaded"
//               style={{
//                 position: 'absolute',
//                 left: `${imagePosition.x * scale}px`,
//                 top: `${imagePosition.y * scale}px`,
//                 width: `${image.width * imageScale * scale}px`,
//                 height: `${image.height * imageScale * scale}px`,
//                 userSelect: 'none',
//                 pointerEvents: 'none'
//               }}
//               draggable={false}
//             />
//           )}
//         </div>
//       </div>
//     );
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 text-lg">Loading your design...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 bg-white border-b">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">OMGS® Editor</h1>
//             <p className="text-sm text-gray-600">Home / Acrylic Wall Photo</p>
//           </div>
//           <button
//             onClick={() => router.push('/')}
//             className="w-10 h-10 flex items-center justify-center border-2 border-red-600 text-red-600 rounded-full hover:bg-red-50"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="flex flex-col lg:flex-row">
//           {/* Left Side - Preview */}
//           <div className="flex-1 p-8 bg-gray-50">
//             {/* Background Color Selector */}
//             <div className="mb-4 bg-white rounded-lg shadow-sm p-4">
//               <h3 className="text-sm font-semibold text-gray-700 mb-3">Wall Color:</h3>
//               <div className="flex flex-wrap gap-2 items-center">
//                 {backgroundColors.map((bg) => (
//                   <button
//                     key={bg.color}
//                     onClick={() => setBackgroundColor(bg.color)}
//                     className={`w-10 h-10 rounded border-2 transition ${
//                       backgroundColor === bg.color
//                         ? 'border-black scale-110'
//                         : 'border-gray-300 hover:border-gray-400'
//                     }`}
//                     style={{ backgroundColor: bg.color }}
//                     title={bg.name}
//                   />
//                 ))}
//                 <div className="flex items-center gap-2 ml-2">
//                   <label className="text-xs text-gray-600">Custom:</label>
//                   <input
//                     type="color"
//                     value={backgroundColor}
//                     onChange={(e) => setBackgroundColor(e.target.value)}
//                     className="w-10 h-10 rounded border-2 border-gray-300 cursor-pointer"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Room Preview */}
//             <div
//               className="rounded-lg p-8 relative transition-colors duration-300"
//               style={{
//                 minHeight: '500px',
//                 backgroundColor: backgroundColor,
//                 backgroundImage: `linear-gradient(to bottom, ${backgroundColor}, ${adjustBrightness(
//                   backgroundColor,
//                   -15
//                 )})`
//               }}
//             >
//               {/* Wall decoration - Bird cage */}
//               <div className="absolute left-8 top-12">
//                 <div className="w-16 h-20 border-2 border-gray-700 rounded-full relative">
//                   <div className="absolute inset-0 flex flex-col justify-around p-2">
//                     <div className="border-t border-gray-700"></div>
//                     <div className="border-t border-gray-700"></div>
//                     <div className="border-t border-gray-700"></div>
//                   </div>
//                   <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-1 h-10 bg-gray-700"></div>
//                 </div>
//               </div>

//               {/* Main Frame Display with matching container */}
//               <div className="flex items-center justify-center" style={{ marginTop: '80px' }}>
//                 <div
//                   className="relative flex flex-col items-center justify-center"
//                   style={{
//                     padding: '32px 40px',
//                     background:
//                       'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(229,231,235,0.95))',
//                     boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
//                     borderRadius: `${getContainerRadius(currentSize)}px`,
//                     transition: 'border-radius 0.3s ease, box-shadow 0.3s ease',
//                     backdropFilter: 'blur(8px)'
//                   }}
//                 >
//                   {renderFrame(currentSize, true)}

//                   {/* Thickness indicator */}
//                   <div className="text-center mt-4 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm inline-block">
//                     Thickness: {acrylicThickness}
//                   </div>
//                 </div>
//               </div>

//               {/* Plant decoration */}
//               <div className="absolute left-8 bottom-8">
//                 <div className="w-16 h-24 bg-gray-600 rounded-sm flex items-end justify-center p-2">
//                   <div className="space-y-1">
//                     <div className="w-2 h-16 bg-green-700 rounded-full"></div>
//                     <div className="w-2 h-12 bg-green-700 rounded-full ml-2"></div>
//                   </div>
//                 </div>
//               </div>

//               {/* Shelf */}
//               <div className="absolute left-8 bottom-0">
//                 <div className="w-32 h-3 bg-gray-700 rounded-t"></div>
//                 <div className="w-32 h-16 bg-gray-600 border-l-4 border-r-4 border-gray-700"></div>
//               </div>
//             </div>

//             {/* Size Comparison Toggle */}
//             {image && (
//               <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
//                 <button
//                   onClick={() => setShowSizeComparison(!showSizeComparison)}
//                   className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-semibold"
//                 >
//                   <Eye size={20} />
//                   {showSizeComparison ? 'Hide Size Comparison' : 'Compare All Sizes'}
//                 </button>
//               </div>
//             )}

//             {/* Size Comparison Grid */}
//             {showSizeComparison && image && (
//               <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
//                 <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//                   <span className="w-1 h-6 bg-red-600 rounded"></span>
//                   Size Comparison Preview
//                 </h3>
//                 <p className="text-sm text-gray-600 mb-6">
//                   Compare how your design looks in different frame sizes
//                 </p>

//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
//                   {sizes.map((size) => (
//                     <div
//                       key={size.label}
//                       className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
//                         selectedSize === size.label
//                           ? 'border-red-600 bg-red-50 shadow-lg'
//                           : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
//                       }`}
//                       onClick={() => setSelectedSize(size.label)}
//                     >
//                       <div className="flex flex-col items-center">
//                         {renderFrame(size, false)}
//                         <div className="mt-3 text-center">
//                           <p className="font-bold text-gray-800">{size.label}</p>
//                           <p className="text-xs text-gray-600">
//                             {size.width}×{size.height}px
//                           </p>
//                           {selectedSize === size.label && (
//                             <span className="inline-block mt-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
//                               Selected
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Editor Controls */}
//             <div className="mt-6 bg-white rounded-lg shadow-sm p-4 flex items-center gap-4 flex-wrap">
//               <button
//                 onClick={() => fileInputRef.current && fileInputRef.current.click()}
//                 className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition text-sm font-medium"
//               >
//                 {image ? 'Change Photo' : 'Upload Photo'}
//               </button>

//               <button
//                 onClick={toggleOrientation}
//                 className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition text-sm"
//               >
//                 <RotateCw size={16} />
//                 {isPortrait ? 'Portrait' : 'Landscape'}
//               </button>

//               <div className="flex items-center gap-2">
//                 <label className="text-sm text-gray-700">Frame:</label>
//                 <button
//                   onClick={() => setHasFrame(true)}
//                   className={`px-3 py-1 rounded-l border text-sm ${
//                     hasFrame
//                       ? 'bg-black text-white border-black'
//                       : 'bg-white text-gray-700 border-gray-300'
//                   }`}
//                 >
//                   Yes
//                 </button>
//                 <button
//                   onClick={() => setHasFrame(false)}
//                   className={`px-3 py-1 rounded-r border text-sm ${
//                     !hasFrame
//                       ? 'bg-black text-white border-black'
//                       : 'bg-white text-gray-700 border-gray-300'
//                   }`}
//                 >
//                   No
//                 </button>
//               </div>

//               {hasFrame && (
//                 <div className="flex items-center gap-2">
//                   <label className="text-sm text-gray-700">Frame Thickness:</label>
//                   <input
//                     type="range"
//                     min="10"
//                     max="50"
//                     value={frameThickness}
//                     onChange={(e) => setFrameThickness(Number(e.target.value))}
//                     className="w-32"
//                   />
//                   <span className="text-sm text-gray-600 w-12">{frameThickness}px</span>
//                 </div>
//               )}

//               {image && (
//                 <div className="flex items-center gap-2">
//                   <label className="text-sm text-gray-700">Zoom:</label>
//                   <input
//                     type="range"
//                     min="0.1"
//                     max="3"
//                     step="0.1"
//                     value={imageScale}
//                     onChange={(e) => setImageScale(Number(e.target.value))}
//                     className="w-32"
//                   />
//                   <span className="text-sm text-gray-600 w-12">{imageScale.toFixed(1)}x</span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right Side - Options */}
//           <div className="w-full lg:w-96 bg-white p-6 border-l">
//             <div className="mb-6">
//               <div className="text-3xl font-bold text-gray-800 mb-2">₹ 24999</div>
//               <div className="text-gray-500 line-through">₹ 30000</div>
//             </div>

//             {/* Size Selection */}
//             <div className="mb-6">
//               <h3 className="text-sm font-semibold text-gray-700 mb-3">
//                 Acrylic Size (Inch):
//               </h3>
//               <div className="flex flex-wrap gap-2">
//                 {sizes.map((size) => (
//                   <button
//                     key={size.label}
//                     onClick={() => setSelectedSize(size.label)}
//                     className={`px-4 py-2 rounded border text-sm font-medium transition ${
//                       selectedSize === size.label
//                         ? 'bg-black text-white border-black'
//                         : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
//                     }`}
//                   >
//                     {size.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Thickness Selection */}
//             <div className="mb-6">
//               <h3 className="text-sm font-semibold text-gray-700 mb-3">
//                 Acrylic Thickness:
//               </h3>
//               <div className="flex gap-2">
//                 {thicknessOptions.map((thicknessOption) => (
//                   <button
//                     key={thicknessOption}
//                     onClick={() => setAcrylicThickness(thicknessOption)}
//                     className={`px-4 py-2 rounded border text-sm font-medium transition ${
//                       acrylicThickness === thicknessOption
//                         ? 'bg-black text-white border-black'
//                         : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
//                     }`}
//                   >
//                     {thicknessOption}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Buy Button */}
//             <button
//               onClick={handleSaveAndNext}
//               disabled={!image}
//               className={`w-full py-3 rounded font-bold text-lg transition mb-4 ${
//                 image
//                   ? 'bg-red-600 text-white hover:bg-red-700'
//                   : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//               }`}
//             >
//               Buy it now
//             </button>

//             {/* Delivery Check */}
//             <div className="mb-4">
//               <label className="text-sm text-gray-700 mb-2 block">
//                 Check Estimated Delivery Date
//               </label>
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   placeholder="Enter Pincode"
//                   className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
//                 />
//                 <button className="px-4 py-2 bg-black text-white rounded text-sm font-medium hover:bg-gray-800 transition">
//                   Check
//                 </button>
//               </div>
//             </div>

//             {/* Save Option */}
//             <button
//               onClick={handleSave}
//               disabled={!image}
//               className={`w-full py-3 rounded font-medium text-sm flex items-center justify-center gap-2 transition ${
//                 image
//                   ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
//                   : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//               }`}
//             >
//               <Download size={18} />
//               Save & Download Design
//             </button>

//             {/* Instructions */}
//             {image && (
//               <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-800">
//                 <strong>Tips:</strong> Drag image to reposition • Scroll to zoom • Toggle
//                 "Frame: Yes/No" to add black border
//               </div>
//             )}
//           </div>
//         </div>

//         <input
//           ref={fileInputRef}
//           type="file"
//           accept="image/*"
//           onChange={handleImageUpload}
//           className="hidden"
//         />
//       </div>
//     </div>
//   );
// }

// export default function PhotoFrameEditor() {
//   return (
//     <React.Suspense
//       fallback={
//         <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
//         </div>
//       }
//     >
//       <PhotoFrameEditorContent />
//     </React.Suspense>
//   );
// }






"use client";
import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Rect, Shape, Group } from "react-konva";
import { useRouter } from "next/navigation";

const MIN_CM = 5;
const MAX_CM = 100;
const MIN_PX = 250;
const MAX_PX = 650;

const FRAME_SHAPES = {

  SQUARE: {
    id: 'square',
    name: 'Square',
    cornerRadius: 0,
    hasDualBorder: false,
  },
  ROUNDED_RECT: {
    id: 'rounded-rect',
    name: 'Rounded Rectangle',
    cornerRadius: 20,
    hasDualBorder: false,
  },
  EXTRA_ROUNDED: {
    id: 'extra-rounded',
    name: 'Extra Rounded',
    cornerRadius: 50,
    hasDualBorder: false,
  },
  CIRCLE: {
    id: 'circle',
    name: 'Circle',
    isCircle: true,
    hasDualBorder: false,
  },
  DUAL_BORDER_SQUARE: {
    id: 'dual-square',
    name: 'Dual Border Square',
    cornerRadius: 0,
    hasDualBorder: true,
    innerBorderGap: 12,
  },
  DUAL_BORDER_ROUNDED: {
    id: 'dual-rounded',
    name: 'Dual Border Rounded',
    cornerRadius: 20,
    hasDualBorder: true,
    innerBorderGap: 12,
  },
  DUAL_BORDER_CIRCLE: {
    id: 'dual-circle',
    name: 'Dual Border Circle',
    isCircle: true,
    hasDualBorder: true,
    innerBorderGap: 12,
  },
};

const cmToPx = (cm) => {
  const t = (cm - MIN_CM) / (MAX_CM - MIN_CM);
  return MIN_PX + t * (MAX_PX - MIN_PX);
};

export default function FrameEditor() {
  const router = useRouter();

  const [photoSrc, setPhotoSrc] = useState(null);
  const [photoImg, setPhotoImg] = useState(null);
  const [selectedShape, setSelectedShape] = useState(FRAME_SHAPES.ROUNDED_RECT);

  const [widthCm, setWidthCm] = useState(20);
  const [heightCm, setHeightCm] = useState(30);
  const [thicknessMm, setThicknessMm] = useState(20);

  const [photoScale, setPhotoScale] = useState(1);
  const [photoPos, setPhotoPos] = useState({ x: 0, y: 0 });

  const [frameColor, setFrameColor] = useState("#000000");
  const [matColor, setMatColor] = useState("#ffffff");

  const stageRef = useRef(null);
  const fileInputRef = useRef(null);

  const PREVIEW_WIDTH = cmToPx(widthCm);
  const PREVIEW_HEIGHT = cmToPx(heightCm);

  const framePx = 8 + (thicknessMm - 10) * (20 / 40);

  const innerWidth = PREVIEW_WIDTH - framePx * 2;
  const innerHeight = PREVIEW_HEIGHT - framePx * 2;

  const dualBorderGap = selectedShape.hasDualBorder ? selectedShape.innerBorderGap : 0;
  const matInnerWidth = innerWidth - dualBorderGap * 2;
  const matInnerHeight = innerHeight - dualBorderGap * 2;

  useEffect(() => {
    if (!photoSrc) return;

    const img = new window.Image();
    img.src = photoSrc;
    img.onload = () => {
      setPhotoImg(img);

      const targetWidth = selectedShape.hasDualBorder ? matInnerWidth : innerWidth;
      const targetHeight = selectedShape.hasDualBorder ? matInnerHeight : innerHeight;

      const imgAspect = img.width / img.height;
      const frameAspect = targetWidth / targetHeight;

      let scale;
      if (imgAspect > frameAspect) {
        scale = targetHeight / img.height;
      } else {
        scale = targetWidth / img.width;
      }
      setPhotoScale(scale);

      const displayWidth = img.width * scale;
      const displayHeight = img.height * scale;
      const offsetX = (targetWidth - displayWidth) / 2;
      const offsetY = (targetHeight - displayHeight) / 2;
      setPhotoPos({ x: offsetX, y: offsetY });
    };
  }, [
    photoSrc,
    selectedShape.id,
    selectedShape.hasDualBorder,
    PREVIEW_WIDTH,
    PREVIEW_HEIGHT,
    framePx,
    matInnerWidth,
    matInnerHeight,
  ]);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!stageRef.current || !photoImg) return;

    const uri = stageRef.current.toDataURL({
      pixelRatio: 3,
      mimeType: 'image/png'
    });

    const link = document.createElement("a");
    link.download = `framed-photo-${selectedShape.id}-${widthCm}x${heightCm}cm.png`;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveAndNext = () => {
    if (!stageRef.current || !photoImg) return;

    const uri = stageRef.current.toDataURL({
      pixelRatio: 3,
      mimeType: 'image/png'
    });

    const designData = {
      imageUri: photoSrc,
      frameShape: selectedShape.name,
      frameShapeId: selectedShape.id,
      frameColor: frameColor,
      matColor: matColor,
      widthCm: widthCm,
      heightCm: heightCm,
      thicknessMm: thicknessMm,
      photoScale: photoScale,
      photoPos: photoPos,
      timestamp: new Date().toISOString()
    };

    // Store in window object for product page to access
    window.frameDesignData = designData;

    // Open the existing product page artifact in a new window
    // In a real app, this would use router.push('/product-page')
    // alert('Design saved! Click OK to view product page. In your actual Next.js app, this will navigate to /product-page');

    // Note: In your Next.js app, replace the alert with:
    router.push('/product-page');
  };

  const resetPhotoFit = () => {
    if (!photoImg) return;

    const targetWidth = selectedShape.hasDualBorder ? matInnerWidth : innerWidth;
    const targetHeight = selectedShape.hasDualBorder ? matInnerHeight : innerHeight;

    const imgAspect = photoImg.width / photoImg.height;
    const frameAspect = targetWidth / targetHeight;

    let scale;
    if (imgAspect > frameAspect) {
      scale = targetHeight / photoImg.height;
    } else {
      scale = targetWidth / photoImg.width;
    }
    setPhotoScale(scale);

    const displayWidth = photoImg.width * scale;
    const displayHeight = photoImg.height * scale;
    const offsetX = (targetWidth - displayWidth) / 2;
    const offsetY = (targetHeight - displayHeight) / 2;
    setPhotoPos({ x: offsetX, y: offsetY });
  };

  const circleClipFunc = (ctx, width, height) => {
    const radius = Math.min(width, height) / 2;
    const centerX = width / 2;
    const centerY = height / 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
    ctx.closePath();
  };

  const renderFrame = () => {
    if (selectedShape.isCircle) {
      const size = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT);
      const offsetX = (PREVIEW_WIDTH - size) / 2;
      const offsetY = (PREVIEW_HEIGHT - size) / 2;

      return (
        <Group>
          <Shape
            x={offsetX}
            y={offsetY}
            sceneFunc={(ctx, shape) => {
              const radius = size / 2;
              ctx.beginPath();
              ctx.arc(radius, radius, radius, 0, Math.PI * 2);
              ctx.fillStrokeShape(shape);
            }}
            fill={frameColor}
            shadowColor="rgba(0,0,0,0.35)"
            shadowBlur={24}
            shadowOffsetY={10}
          />

          <Shape
            x={offsetX + framePx}
            y={offsetY + framePx}
            sceneFunc={(ctx, shape) => {
              const radius = (size - framePx * 2) / 2;
              ctx.beginPath();
              ctx.arc(radius, radius, radius, 0, Math.PI * 2);
              ctx.fillStrokeShape(shape);
            }}
            fill={matColor}
          />

          {selectedShape.hasDualBorder && (
            <Shape
              x={offsetX + framePx + dualBorderGap}
              y={offsetY + framePx + dualBorderGap}
              sceneFunc={(ctx, shape) => {
                const radius = (size - framePx * 2 - dualBorderGap * 2) / 2;
                ctx.beginPath();
                ctx.arc(radius, radius, radius, 0, Math.PI * 2);
                ctx.fillStrokeShape(shape);
              }}
              stroke={frameColor}
              strokeWidth={2}
            />
          )}

          {photoImg ? (
            <Group
              x={offsetX + framePx + (selectedShape.hasDualBorder ? dualBorderGap : 0)}
              y={offsetY + framePx + (selectedShape.hasDualBorder ? dualBorderGap : 0)}
              clipFunc={(ctx) => {
                const targetSize = selectedShape.hasDualBorder
                  ? size - framePx * 2 - dualBorderGap * 2
                  : size - framePx * 2;
                circleClipFunc(ctx, targetSize, targetSize);
              }}
            >
              <KonvaImage
                image={photoImg}
                x={photoPos.x}
                y={photoPos.y}
                width={photoImg.width * photoScale}
                height={photoImg.height * photoScale}
                draggable
                onDragMove={(e) => {
                  const node = e.target;
                  setPhotoPos({ x: node.x(), y: node.y() });
                }}
              />
            </Group>
          ) : (
            <Shape
              x={offsetX + framePx + (selectedShape.hasDualBorder ? dualBorderGap : 0)}
              y={offsetY + framePx + (selectedShape.hasDualBorder ? dualBorderGap : 0)}
              sceneFunc={(ctx, shape) => {
                const targetSize = selectedShape.hasDualBorder
                  ? size - framePx * 2 - dualBorderGap * 2
                  : size - framePx * 2;
                const radius = targetSize / 2;
                ctx.beginPath();
                ctx.arc(radius, radius, radius, 0, Math.PI * 2);
                ctx.fillStrokeShape(shape);
              }}
              fill="#e5e7eb"
            />
          )}
        </Group>
      );
    }

    return (
      <Group>
        <Rect
          x={0}
          y={0}
          width={PREVIEW_WIDTH}
          height={PREVIEW_HEIGHT}
          fill={frameColor}
          cornerRadius={selectedShape.cornerRadius}
          shadowColor="rgba(0,0,0,0.35)"
          shadowBlur={24}
          shadowOffsetY={10}
        />

        <Rect
          x={framePx}
          y={framePx}
          width={innerWidth}
          height={innerHeight}
          fill={matColor}
          cornerRadius={Math.max(0, selectedShape.cornerRadius - framePx / 2)}
        />

        {selectedShape.hasDualBorder && (
          <Rect
            x={framePx + dualBorderGap}
            y={framePx + dualBorderGap}
            width={matInnerWidth}
            height={matInnerHeight}
            stroke={frameColor}
            strokeWidth={2}
            cornerRadius={Math.max(0, selectedShape.cornerRadius - framePx / 2 - dualBorderGap)}
          />
        )}

        {photoImg ? (
          <Group
            x={framePx + (selectedShape.hasDualBorder ? dualBorderGap : 0)}
            y={framePx + (selectedShape.hasDualBorder ? dualBorderGap : 0)}
            clipFunc={(ctx) => {
              const w = selectedShape.hasDualBorder ? matInnerWidth : innerWidth;
              const h = selectedShape.hasDualBorder ? matInnerHeight : innerHeight;
              const r = Math.max(
                0,
                selectedShape.cornerRadius - framePx / 2 - (selectedShape.hasDualBorder ? dualBorderGap : 0)
              );

              ctx.beginPath();
              ctx.moveTo(r, 0);
              ctx.lineTo(w - r, 0);
              ctx.quadraticCurveTo(w, 0, w, r);
              ctx.lineTo(w, h - r);
              ctx.quadraticCurveTo(w, h, w - r, h);
              ctx.lineTo(r, h);
              ctx.quadraticCurveTo(0, h, 0, h - r);
              ctx.lineTo(0, r);
              ctx.quadraticCurveTo(0, 0, r, 0);
              ctx.closePath();
            }}
          >
            <KonvaImage
              image={photoImg}
              x={photoPos.x}
              y={photoPos.y}
              width={photoImg.width * photoScale}
              height={photoImg.height * photoScale}
              draggable
              onDragMove={(e) => {
                const node = e.target;
                setPhotoPos({ x: node.x(), y: node.y() });
              }}
            />
          </Group>
        ) : (
          <Rect
            x={framePx + (selectedShape.hasDualBorder ? dualBorderGap : 0)}
            y={framePx + (selectedShape.hasDualBorder ? dualBorderGap : 0)}
            width={selectedShape.hasDualBorder ? matInnerWidth : innerWidth}
            height={selectedShape.hasDualBorder ? matInnerHeight : innerHeight}
            fill="#e5e7eb"
            cornerRadius={Math.max(
              0,
              selectedShape.cornerRadius - framePx / 2 - (selectedShape.hasDualBorder ? dualBorderGap : 0)
            )}
          />
        )}
      </Group>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 py-30">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-medium text-center text-gray-900 mb-6">
          Acrylic Wall Photo Editor ({widthCm}×{heightCm}cm)
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white rounded-md shadow-md p-6 relative">
              <Stage
                ref={stageRef}
                width={PREVIEW_WIDTH}
                height={PREVIEW_HEIGHT}
              >
                <Layer>
                  <Rect
                    x={0}
                    y={0}
                    width={PREVIEW_WIDTH}
                    height={PREVIEW_HEIGHT}
                    fill="#f9fafb"
                  />
                  {renderFrame()}
                  {!photoImg && (
                    <>
                      <Rect
                        x={PREVIEW_WIDTH / 2 - 110}
                        y={PREVIEW_HEIGHT / 2 - 35}
                        width={220}
                        height={70}
                        fill="#dc2626"
                        cornerRadius={12}
                      />
                      <Shape
                        sceneFunc={(ctx, shape) => {
                          ctx.font = "bold 22px sans-serif";
                          ctx.fillStyle = "#ffffff";
                          ctx.textAlign = "center";
                          ctx.textBaseline = "middle";
                          ctx.fillText("SELECT PHOTO", PREVIEW_WIDTH / 2, PREVIEW_HEIGHT / 2);
                        }}
                      />
                    </>
                  )}
                </Layer>
              </Stage>
            </div>
          </div>

          <div className="lg:w-80 bg-white rounded-md shadow-md p-6 space-y-6">
            <div>
              <label className="block text-md font-medium text-black mb-2">Frame Shape</label>
              <select
                value={selectedShape.id}
                onChange={(e) => {
                  const shape = Object.values(FRAME_SHAPES).find(s => s.id === e.target.value);
                  setSelectedShape(shape);
                }}
                className="w-full border-2 border-gray-300 text-black rounded-lg px-4 py-2.5 text-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400 transition-colors"
              >
                {Object.values(FRAME_SHAPES).map((shape) => (
                  <option key={shape.id} value={shape.id}>
                    {shape.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {photoSrc ? "Change Photo" : "Select Photo"}
              </button>
            </div>

            <div>
              <label className="block text-md text-black font-medium mb-2">Outer Frame Color</label>
              <div className="flex gap-2 flex-wrap">
                {["#000000", "#8B4513", "#ffffff"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setFrameColor(c)}
                    className={
                      "w-9 h-9 rounded border-2 transition-all " +
                      (frameColor === c ? "border-blue-500 scale-110" : "border-gray-300")
                    }
                    style={{ backgroundColor: c }}
                  />
                ))}
                <input
                  type="color"
                  value={frameColor}
                  onChange={(e) => setFrameColor(e.target.value)}
                  className="w-9 h-9 rounded border-2 border-gray-300 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-md text-black font-medium mb-2">Inner Frame Color</label>
              <div className="flex gap-2 flex-wrap">
                {["#ffffff", "#f5f5dc", "#000000"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setMatColor(c)}
                    className={
                      "w-9 h-9 rounded border-2 transition-all " +
                      (matColor === c ? "border-blue-500 scale-110" : "border-gray-300")
                    }
                    style={{ backgroundColor: c }}
                  />
                ))}
                <input
                  type="color"
                  value={matColor}
                  onChange={(e) => setMatColor(e.target.value)}
                  className="w-9 h-9 rounded border-2 border-gray-300 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-md font-medium text-black mb-1">
                Frame Thickness: {thicknessMm}mm
              </label>
              <input
                type="range"
                min="10"
                max="50"
                step="1"
                value={thicknessMm}
                onChange={(e) => setThicknessMm(Number(e.target.value))}
                className="w-full accent-red-600 h-2"
              />
            </div>

            {photoImg && (
              <div className="space-y-3 pt-3 border-t">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Photo Zoom: {photoScale.toFixed(2)}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={photoScale}
                    onChange={(e) => setPhotoScale(Number(e.target.value))}
                    className="w-full accent-red-600 h-2"
                  />
                </div>

                <button
                  onClick={resetPhotoFit}
                  className="w-full border border-gray-300 hover:bg-gray-50 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Reset Position & Fit
                </button>
              </div>
            )}

            <div className="space-y-3 pt-3 border-t">
              <button
                onClick={handleDownload}
                disabled={!photoImg}
                className={
                  "w-full font-semibold py-3 px-4 rounded-md text-base transition-colors flex items-center justify-center gap-2 " +
                  (photoImg
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed")
                }
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download to Device
              </button>

              <button
                onClick={handleSaveAndNext}
                disabled={!photoImg}
                className={
                  "w-full font-semibold py-3 px-4 rounded-md text-lg transition-colors " +
                  (photoImg
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed")
                }
              >
                Save & Select Size →
              </button>
            </div>

            {photoImg && (
              <p className="text-xs text-gray-500 text-center pt-2">
                💡 Download saves to your device. Select Size continues to ordering.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
