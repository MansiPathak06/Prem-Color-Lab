// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import { Stage, Layer, Image as KonvaImage, Rect, Group, Shape } from "react-konva";
// import { useRouter } from "next/navigation";

// // Silence TensorFlow.js warnings
// if (typeof window !== 'undefined') {
//   const originalWarn = console.warn;
//   console.warn = (...args) => {
//     const message = args[0]?.toString() || '';
//     if (
//       message.includes('onnxruntime') ||
//       message.includes('VerifyEachNodeIsAssignedToAnEp') ||
//       message.includes('execution providers') ||
//       message.includes('session_state')
//     ) {
//       return;
//     }
//     originalWarn.apply(console, args);
//   };
// }

// const FRAME_SHAPES = [
//   { id: 'rounded-rect', name: 'Rounded', radius: 20 },
//   { id: 'extra-rounded', name: 'Extra Round', radius: 50 },
//   { id: 'square', name: 'Square', radius: 0 },
//   { id: 'circle', name: 'Circle', radius: 9999 },
//   { id: 'diamond', name: 'Diamond', radius: 0, rotation: 45 },
//   { id: 'star', name: 'Star', radius: 0, points: 5 },
//   { id: 'hexagon', name: 'Hexagon', radius: 0, sides: 6 },
//   { id: 'octagon', name: 'Octagon', radius: 0, sides: 8 },
//   { id: 'heart', name: 'Heart', radius: 0 },
// ];

// const FRAME_COLORS = [
//   { id: 'black', name: 'Black', color: '#000000' },
//   { id: 'white', name: 'White', color: '#FFFFFF' },
//   { id: 'wood', name: 'Wood', color: '#8B4513' },
//   { id: 'silver', name: 'Silver', color: '#C0C0C0' },
// ];

// export default function ClearAcrylicEditor() {
//   const router = useRouter();
//   const [photoSrc, setPhotoSrc] = useState(null);
//   const [bgRemovedImg, setBgRemovedImg] = useState(null);
//   const [photoImg, setPhotoImg] = useState(null);
//   const [frameShape, setFrameShape] = useState('rounded-rect');
//   const [frameColor, setFrameColor] = useState('#000000');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [processingProgress, setProcessingProgress] = useState(0);
//   const [photoScale, setPhotoScale] = useState(1);
//   const [selectPhotoImage, setSelectPhotoImage] = useState(null);

//   const [photoPos, setPhotoPos] = useState({ x: 0, y: 0 });
//   const fileInputRef = useRef(null);
//   const stageRef = useRef(null);

//   const CANVAS_WIDTH = 500;
//   const CANVAS_HEIGHT = 500;

//   useEffect(() => {
//   if (typeof window === "undefined") return;

//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");

//   canvas.width = 220;
//   canvas.height = 70;

//   ctx.fillStyle = "#dc2626";
//   ctx.fillRect(0, 0, 220, 70);

//   ctx.font = "bold 22px sans-serif";
//   ctx.fillStyle = "#ffffff";
//   ctx.textAlign = "center";
//   ctx.textBaseline = "middle";
//   ctx.fillText("SELECT PHOTO", 110, 35);

//   const img = new Image();
//   img.src = canvas.toDataURL();

//   setSelectPhotoImage(img);
// }, []);


//   // Auto background removal when photo is uploaded
//   useEffect(() => {
//     if (!photoSrc) return;

//     let isMounted = true;

//     async function removeBg() {
//       if (!isMounted) return;

//       setIsProcessing(true);
//       setProcessingProgress(0);

//       try {
//         const { removeBackground } = await import("rembg-webgpu");

//         if (!isMounted) return;

//         console.log('Starting background removal...');

//         const result = await removeBackground(photoSrc, {
//           model: 'u2net',
//           device: 'auto',
//           progress: (stage, current, total) => {
//             const percent = Math.round((current / total) * 100);
//             setProcessingProgress(percent);
//             console.log(`${stage}: ${percent}%`);
//           }
//         });

//         if (!isMounted) return;

//         const img = new window.Image();
//         img.crossOrigin = "anonymous";
//         img.src = result.blobUrl;

//         img.onload = () => {
//           if (!isMounted) return;

//           setBgRemovedImg(img);
//           setPhotoImg(img);

//           // Center and fit the cutout
//           const scale = Math.min(
//             (CANVAS_WIDTH * 0.7) / img.width,
//             (CANVAS_HEIGHT * 0.7) / img.height
//           );
//           setPhotoScale(scale);

//           const displayWidth = img.width * scale;
//           const displayHeight = img.height * scale;
//           const offsetX = (CANVAS_WIDTH - displayWidth) / 2;
//           const offsetY = (CANVAS_HEIGHT - displayHeight) / 2;
//           setPhotoPos({ x: offsetX, y: offsetY });

//           setIsProcessing(false);
//           setProcessingProgress(100);
//           console.log('Background removal complete!');
//         };

//         img.onerror = () => {
//           if (!isMounted) return;
//           console.error('Failed to load processed image');
//           setIsProcessing(false);
//           alert('Failed to process the image. Please try again.');
//         };

//       } catch (error) {
//         if (!isMounted) return;

//         console.error('Background removal failed:', error);
//         setIsProcessing(false);

//         if (error.message?.includes('WebGPU')) {
//           alert('Your browser does not support WebGPU. Please use Chrome 113+, Edge 113+, or Safari 18+');
//         } else {
//           alert('Failed to remove background. Please try a different image or ensure you have a modern browser.');
//         }
//       }
//     }

//     removeBg();

//     return () => {
//       isMounted = false;
//     };
//   }, [photoSrc]);

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       setPhotoSrc(event.target.result);
//       setBgRemovedImg(null);
//       setPhotoImg(null);
//     };
//     reader.readAsDataURL(file);
//   };

//   const resetPhotoFit = () => {
//     if (!photoImg) return;

//     const scale = Math.min(
//       (CANVAS_WIDTH * 0.7) / photoImg.width,
//       (CANVAS_HEIGHT * 0.7) / photoImg.height
//     );
//     setPhotoScale(scale);

//     const displayWidth = photoImg.width * scale;
//     const displayHeight = photoImg.height * scale;
//     const offsetX = (CANVAS_WIDTH - displayWidth) / 2;
//     const offsetY = (CANVAS_HEIGHT - displayHeight) / 2;
//     setPhotoPos({ x: offsetX, y: offsetY });
//   };

//   const renderFrameShape = (frameX, frameY, frameW, frameH, shape, frameThickness) => {
//     const centerX = frameX + frameW / 2;
//     const centerY = frameY + frameH / 2;

//     switch (shape.id) {
//       case 'circle':
//         const radius = Math.max(frameW, frameH) / 2;
//         return (
//           <Shape
//             sceneFunc={(context, shape) => {
//               context.beginPath();
//               context.arc(centerX, centerY, radius, 0, Math.PI * 2);
//               context.fillStrokeShape(shape);
//             }}
//             stroke={frameColor}
//             strokeWidth={frameThickness}
//             shadowColor="rgba(0,0,0,0.3)"
//             shadowBlur={20}
//             shadowOffsetY={8}
//           />
//         );

//       case 'diamond':
//         return (
//           <Shape
//             sceneFunc={(context, shape) => {
//               context.beginPath();
//               context.moveTo(centerX, frameY);
//               context.lineTo(frameX + frameW, centerY);
//               context.lineTo(centerX, frameY + frameH);
//               context.lineTo(frameX, centerY);
//               context.closePath();
//               context.fillStrokeShape(shape);
//             }}
//             stroke={frameColor}
//             strokeWidth={frameThickness}
//             shadowColor="rgba(0,0,0,0.3)"
//             shadowBlur={20}
//             shadowOffsetY={8}
//           />
//         );

//       case 'star':
//         const outerRadius = Math.min(frameW, frameH) / 2;
//         const innerRadius = outerRadius * 0.5;
//         const points = 5;
//         return (
//           <Shape
//             sceneFunc={(context, shape) => {
//               context.beginPath();
//               for (let i = 0; i < points * 2; i++) {
//                 const radius = i % 2 === 0 ? outerRadius : innerRadius;
//                 const angle = (i * Math.PI) / points - Math.PI / 2;
//                 const x = centerX + Math.cos(angle) * radius;
//                 const y = centerY + Math.sin(angle) * radius;
//                 if (i === 0) context.moveTo(x, y);
//                 else context.lineTo(x, y);
//               }
//               context.closePath();
//               context.fillStrokeShape(shape);
//             }}
//             stroke={frameColor}
//             strokeWidth={frameThickness}
//             shadowColor="rgba(0,0,0,0.3)"
//             shadowBlur={20}
//             shadowOffsetY={8}
//           />
//         );

//       case 'hexagon':
//       case 'octagon':
//         const sides = shape.sides;
//         const polyRadius = Math.min(frameW, frameH) / 2;
//         return (
//           <Shape
//             sceneFunc={(context, shape) => {
//               context.beginPath();
//               for (let i = 0; i < sides; i++) {
//                 const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
//                 const x = centerX + Math.cos(angle) * polyRadius;
//                 const y = centerY + Math.sin(angle) * polyRadius;
//                 if (i === 0) context.moveTo(x, y);
//                 else context.lineTo(x, y);
//               }
//               context.closePath();
//               context.fillStrokeShape(shape);
//             }}
//             stroke={frameColor}
//             strokeWidth={frameThickness}
//             shadowColor="rgba(0,0,0,0.3)"
//             shadowBlur={20}
//             shadowOffsetY={8}
//           />
//         );

//       case 'heart':
//         const heartWidth = frameW;
//         const heartHeight = frameH;
//         return (
//           <Shape
//             sceneFunc={(context, shape) => {
//               const topCurveHeight = heartHeight * 0.3;
//               context.beginPath();
//               context.moveTo(centerX, frameY + heartHeight * 0.3);
              
//               // Left side of heart
//               context.bezierCurveTo(
//                 centerX, frameY,
//                 frameX, frameY,
//                 frameX, frameY + topCurveHeight
//               );
//               context.bezierCurveTo(
//                 frameX, frameY + (heartHeight + topCurveHeight) / 2,
//                 centerX, frameY + (heartHeight + topCurveHeight) / 1.5,
//                 centerX, frameY + heartHeight
//               );
              
//               // Right side of heart
//               context.bezierCurveTo(
//                 centerX, frameY + (heartHeight + topCurveHeight) / 1.5,
//                 frameX + frameW, frameY + (heartHeight + topCurveHeight) / 2,
//                 frameX + frameW, frameY + topCurveHeight
//               );
//               context.bezierCurveTo(
//                 frameX + frameW, frameY,
//                 centerX, frameY,
//                 centerX, frameY + heartHeight * 0.3
//               );
              
//               context.closePath();
//               context.fillStrokeShape(shape);
//             }}
//             stroke={frameColor}
//             strokeWidth={frameThickness}
//             shadowColor="rgba(0,0,0,0.3)"
//             shadowBlur={20}
//             shadowOffsetY={8}
//           />
//         );

//       default:
//         // Rectangle with corner radius
//         return (
//           <Rect
//             x={frameX}
//             y={frameY}
//             width={frameW}
//             height={frameH}
//             stroke={frameColor}
//             strokeWidth={frameThickness}
//             cornerRadius={shape.radius}
//             shadowColor="rgba(0,0,0,0.3)"
//             shadowBlur={20}
//             shadowOffsetY={8}
//           />
//         );
//     }
//   };

//   const renderPreview = () => {
//     if (!bgRemovedImg) return null;

//     const shape = FRAME_SHAPES.find(s => s.id === frameShape);
//     const frameThickness = 15;

//     // Calculate the actual size of the cutout
//     const cutoutWidth = bgRemovedImg.width * photoScale;
//     const cutoutHeight = bgRemovedImg.height * photoScale;

//     // Frame should wrap around the cutout
//     const frameW = cutoutWidth + frameThickness * 2;
//     const frameH = cutoutHeight + frameThickness * 2;
    
//     // Center the frame around the cutout position
//     const frameX = photoPos.x - frameThickness;
//     const frameY = photoPos.y - frameThickness;

//     // Create clipping mask based on frame shape
//     const getClipFunc = () => {
//       const centerX = frameX + frameW / 2;
//       const centerY = frameY + frameH / 2;

//       switch (shape.id) {
//         case 'circle':
//           const radius = Math.max(frameW, frameH) / 2;
//           return (ctx) => {
//             ctx.beginPath();
//             ctx.arc(centerX, centerY, radius - frameThickness / 2, 0, Math.PI * 2);
//             ctx.closePath();
//           };

//         case 'diamond':
//           return (ctx) => {
//             ctx.beginPath();
//             ctx.moveTo(centerX, frameY + frameThickness / 2);
//             ctx.lineTo(frameX + frameW - frameThickness / 2, centerY);
//             ctx.lineTo(centerX, frameY + frameH - frameThickness / 2);
//             ctx.lineTo(frameX + frameThickness / 2, centerY);
//             ctx.closePath();
//           };

//         case 'star':
//           const outerRadius = Math.min(frameW, frameH) / 2 - frameThickness / 2;
//           const innerRadius = outerRadius * 0.5;
//           const points = 5;
//           return (ctx) => {
//             ctx.beginPath();
//             for (let i = 0; i < points * 2; i++) {
//               const radius = i % 2 === 0 ? outerRadius : innerRadius;
//               const angle = (i * Math.PI) / points - Math.PI / 2;
//               const x = centerX + Math.cos(angle) * radius;
//               const y = centerY + Math.sin(angle) * radius;
//               if (i === 0) ctx.moveTo(x, y);
//               else ctx.lineTo(x, y);
//             }
//             ctx.closePath();
//           };

//         case 'hexagon':
//         case 'octagon':
//           const sides = shape.sides;
//           const polyRadius = Math.min(frameW, frameH) / 2 - frameThickness / 2;
//           return (ctx) => {
//             ctx.beginPath();
//             for (let i = 0; i < sides; i++) {
//               const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
//               const x = centerX + Math.cos(angle) * polyRadius;
//               const y = centerY + Math.sin(angle) * polyRadius;
//               if (i === 0) ctx.moveTo(x, y);
//               else ctx.lineTo(x, y);
//             }
//             ctx.closePath();
//           };

//         case 'heart':
//           const heartWidth = frameW - frameThickness;
//           const heartHeight = frameH - frameThickness;
//           const hX = frameX + frameThickness / 2;
//           const hY = frameY + frameThickness / 2;
//           const hCenterX = hX + heartWidth / 2;
//           return (ctx) => {
//             const topCurveHeight = heartHeight * 0.3;
//             ctx.beginPath();
//             ctx.moveTo(hCenterX, hY + heartHeight * 0.3);
            
//             ctx.bezierCurveTo(hCenterX, hY, hX, hY, hX, hY + topCurveHeight);
//             ctx.bezierCurveTo(
//               hX, hY + (heartHeight + topCurveHeight) / 2,
//               hCenterX, hY + (heartHeight + topCurveHeight) / 1.5,
//               hCenterX, hY + heartHeight
//             );
            
//             ctx.bezierCurveTo(
//               hCenterX, hY + (heartHeight + topCurveHeight) / 1.5,
//               hX + heartWidth, hY + (heartHeight + topCurveHeight) / 2,
//               hX + heartWidth, hY + topCurveHeight
//             );
//             ctx.bezierCurveTo(hX + heartWidth, hY, hCenterX, hY, hCenterX, hY + heartHeight * 0.3);
            
//             ctx.closePath();
//           };

//         default:
//           // Rectangle with corner radius
//           const cornerRadius = shape.radius;
//           return (ctx) => {
//             const x = frameX + frameThickness / 2;
//             const y = frameY + frameThickness / 2;
//             const w = frameW - frameThickness;
//             const h = frameH - frameThickness;
//             const r = Math.min(cornerRadius, w / 2, h / 2);

//             ctx.beginPath();
//             ctx.moveTo(x + r, y);
//             ctx.lineTo(x + w - r, y);
//             ctx.quadraticCurveTo(x + w, y, x + w, y + r);
//             ctx.lineTo(x + w, y + h - r);
//             ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
//             ctx.lineTo(x + r, y + h);
//             ctx.quadraticCurveTo(x, y + h, x, y + h - r);
//             ctx.lineTo(x, y + r);
//             ctx.quadraticCurveTo(x, y, x + r, y);
//             ctx.closePath();
//           };
//       }
//     };

//     return (
//       <Group>
//         {/* Cutout image (draggable) with clipping */}
//         <Group clipFunc={getClipFunc()}>
//           {/* <KonvaImage
//             image={bgRemovedImg}
//             x={photoPos.x}
//             y={photoPos.y}
//             width={cutoutWidth}
//             height={cutoutHeight}
//             draggable
//             onDragMove={(e) => {
//               const node = e.target;
//               setPhotoPos({ x: node.x(), y: node.y() });
//             }}
//           /> */}
//           {selectPhotoImage && (
//   <KonvaImage
//     image={selectPhotoImage}
//     x={CANVAS_WIDTH / 2 - 110}
//     y={CANVAS_HEIGHT / 2 - 35}
//     width={220}
//     height={70}
//   />
// )}

//         </Group>

//         {/* Frame border around cutout */}
//         {renderFrameShape(frameX, frameY, frameW, frameH, shape, frameThickness)}
//       </Group>
//     );
//   };

//   const handleSaveAndNext = () => {
//     if (!bgRemovedImg) return;

//     const designData = {
//       imageUri: bgRemovedImg.src,
//       frameShapeId: frameShape,
//       frameColor: frameColor,
//       matColor: '#ffffff',
//       photoScale: photoScale,
//       photoPos: photoPos,
//       productType: 'acrylic-cutout',
//       hasCutout: true,
//       widthCm: 30,
//       heightCm: 20,
//       thicknessMm: 20,
//       timestamp: new Date().toISOString()
//     };

//     window.frameDesignData = designData;
//     localStorage.setItem('frameDesignData', JSON.stringify(designData));
//     router.push('/p');
//   };

//   const handleDownload = () => {
//     if (!stageRef.current || !bgRemovedImg) return;

//     const uri = stageRef.current.toDataURL({
//       pixelRatio: 3,
//       mimeType: 'image/png'
//     });

//     const link = document.createElement("a");
//     link.download = `clear-acrylic-cutout.png`;
//     link.href = uri;
//     link.click();
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 py-20">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-medium text-center text-gray-900 mb-6">
//           Clear Acrylic Photo Editor
//         </h1>

//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* LEFT: Preview */}
//           <div className="flex-1 flex items-center justify-center">
//             <div className="bg-white rounded-md shadow-md p-6 relative">
//               {isProcessing && (
//                 <div className="absolute inset-0 bg-white/95 flex items-center justify-center z-50 rounded-md">
//                   <div className="text-center">
//                     <div className="relative w-20 h-20 mx-auto mb-4">
//                       <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
//                       <div 
//                         className="absolute inset-0 border-4 border-red-600 rounded-full border-t-transparent animate-spin"
//                       ></div>
//                     </div>
//                     <p className="text-gray-900 font-semibold text-lg mb-2">Removing Background...</p>
//                     <div className="w-64 bg-gray-200 rounded-full h-3 mb-2">
//                       <div 
//                         className="bg-red-600 h-3 rounded-full transition-all duration-300"
//                         style={{ width: `${processingProgress}%` }}
//                       ></div>
//                     </div>
//                     <p className="text-gray-600 text-sm">{processingProgress}% complete</p>
//                   </div>
//                 </div>
//               )}

//               <div
//                 style={{
//                   background: 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%, transparent 75%, #e5e7eb 75%, #e5e7eb), linear-gradient(45deg, #e5e7eb 25%, transparent 25%, transparent 75%, #e5e7eb 75%, #e5e7eb)',
//                   backgroundSize: '20px 20px',
//                   backgroundPosition: '0 0, 10px 10px',
//                   borderRadius: '8px',
//                   padding: '10px'
//                 }}
//               >
//                 <Stage ref={stageRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
//                   <Layer>
//                     <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="transparent" />
//                     {renderPreview()}
                    
//                     {!photoSrc && !isProcessing && (
//                       <>
//                         <Rect
//                           x={CANVAS_WIDTH / 2 - 110}
//                           y={CANVAS_HEIGHT / 2 - 35}
//                           width={220}
//                           height={70}
//                           fill="#dc2626"
//                           cornerRadius={12}
//                         />
//                         <KonvaImage
//                           image={(() => {
//                             const canvas = document.createElement('canvas');
//                             const ctx = canvas.getContext('2d');
//                             canvas.width = 220;
//                             canvas.height = 70;
//                             ctx.font = "bold 22px sans-serif";
//                             ctx.fillStyle = "#ffffff";
//                             ctx.textAlign = "center";
//                             ctx.textBaseline = "middle";
//                             ctx.fillText("SELECT PHOTO", 110, 35);
//                             const img = new Image();
//                             img.src = canvas.toDataURL();
//                             return img;
//                           })()}
//                           x={CANVAS_WIDTH / 2 - 110}
//                           y={CANVAS_HEIGHT / 2 - 35}
//                           width={220}
//                           height={70}
//                         />
//                       </>
//                     )}
//                   </Layer>
//                 </Stage>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT: Controls */}
//           <div className="lg:w-80 bg-white rounded-md shadow-md p-6 space-y-6">
//             <div>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className="hidden"
//               />
//               <button
//                 onClick={() => fileInputRef.current?.click()}
//                 className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
//                 disabled={isProcessing}
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//                 {photoSrc ? "Change Photo" : "Select Photo"}
//               </button>
//               <p className="text-xs text-gray-500 mt-2 text-center">
//                 Background will be automatically removed
//               </p>
//             </div>

//             {bgRemovedImg && !isProcessing && (
//               <>
//                 <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
//                   <p className="text-sm text-green-800 font-medium text-center">
//                     ✅ Background Removed Successfully!
//                   </p>
//                 </div>

//                 <div>
//                   <label className="block text-md font-medium text-black mb-2">Frame Shape</label>
//                   <select
//                     value={frameShape}
//                     onChange={(e) => setFrameShape(e.target.value)}
//                     className="w-full border-2 border-gray-300 text-black rounded-lg px-4 py-2.5 text-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400 transition-colors"
//                   >
//                     {FRAME_SHAPES.map((shape) => (
//                       <option key={shape.id} value={shape.id}>
//                         {shape.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-md text-black font-medium mb-2">Frame Color</label>
//                   <div className="flex gap-2 flex-wrap">
//                     {FRAME_COLORS.map((c) => (
//                       <button
//                         key={c.id}
//                         onClick={() => setFrameColor(c.color)}
//                         className={`w-9 h-9 rounded border-2 transition-all ${
//                           frameColor === c.color ? "border-blue-500 scale-110" : "border-gray-300"
//                         }`}
//                         style={{ backgroundColor: c.color }}
//                         title={c.name}
//                       />
//                     ))}
//                     <input
//                       type="color"
//                       value={frameColor}
//                       onChange={(e) => setFrameColor(e.target.value)}
//                       className="w-9 h-9 rounded border-2 border-gray-300 cursor-pointer"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-3 pt-3 border-t">
//                   <div>
//                     <label className="block text-sm font-semibold mb-1">
//                       Photo Zoom: {photoScale.toFixed(2)}x
//                     </label>
//                     <input
//                       type="range"
//                       min="0.5"
//                       max="3"
//                       step="0.1"
//                       value={photoScale}
//                       onChange={(e) => setPhotoScale(Number(e.target.value))}
//                       className="w-full accent-red-600 h-2"
//                     />
//                   </div>

//                   <button
//                     onClick={resetPhotoFit}
//                     className="w-full border border-gray-300 hover:bg-gray-50 py-2 rounded-md text-sm font-medium transition-colors"
//                   >
//                     Reset Position & Fit
//                   </button>
//                 </div>
//               </>
//             )}

//             <div className="space-y-3 pt-3 border-t">
//               <button
//                 onClick={handleDownload}
//                 disabled={!bgRemovedImg || isProcessing}
//                 className={`w-full font-semibold py-3 px-4 rounded-md text-base transition-colors flex items-center justify-center gap-2 ${
//                   bgRemovedImg && !isProcessing
//                     ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
//                     : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 }`}
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                 </svg>
//                 Download to Device
//               </button>

//               <button
//                 onClick={handleSaveAndNext}
//                 disabled={!bgRemovedImg || isProcessing}
//                 className={`w-full font-semibold py-3 px-4 rounded-md text-lg transition-colors ${
//                   bgRemovedImg && !isProcessing
//                     ? "bg-red-600 hover:bg-red-700 text-white shadow-lg"
//                     : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 }`}
//               >
//                 Save & Select Size →
//               </button>
//             </div>

//             {bgRemovedImg && !isProcessing && (
//               <p className="text-xs text-gray-500 text-center pt-2">
//                 💡 Drag the cutout to reposition. Frame adjusts automatically!
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { Suspense } from "react";
import ClearAcrylicEditorClient from "./ClearAcrylicEditorClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading editor…</div>}>
      <ClearAcrylicEditorClient />
    </Suspense>
  );
}
