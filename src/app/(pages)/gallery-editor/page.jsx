"use client";
import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Rect, Group, Text } from "react-konva";
import { useRouter } from "next/navigation";

// Gallery layout configurations with many more shapes
const GALLERY_LAYOUTS = {
  LAYOUT_2_HORIZONTAL: {
    id: 'layout-2-h',
    name: '2 Photos - Horizontal',
    count: 2,
    positions: (width, height) => [
      { x: width * 0.05, y: height * 0.25, w: width * 0.42, h: height * 0.5, radius: 15 },
      { x: width * 0.53, y: height * 0.25, w: width * 0.42, h: height * 0.5, radius: 15 },
    ]
  },
  LAYOUT_2_VERTICAL: {
    id: 'layout-2-v',
    name: '2 Photos - Vertical',
    count: 2,
    positions: (width, height) => [
      { x: width * 0.25, y: height * 0.05, w: width * 0.5, h: height * 0.42, radius: 15 },
      { x: width * 0.25, y: height * 0.53, w: width * 0.5, h: height * 0.42, radius: 15 },
    ]
  },
  LAYOUT_3_CIRCLES: {
    id: 'layout-3-circles',
    name: '3 Photos - Circles',
    count: 3,
    positions: (width, height) => [
      { x: width * 0.125, y: height * 0.15, w: width * 0.3, h: height * 0.3, isCircle: true },
      { x: width * 0.125, y: height * 0.55, w: width * 0.3, h: height * 0.3, isCircle: true },
      { x: width * 0.575, y: height * 0.35, w: width * 0.3, h: height * 0.3, isCircle: true },
    ]
  },
  LAYOUT_3_HEXAGONS: {
    id: 'layout-3-hex',
    name: '3 Photos - Hexagons',
    count: 3,
    positions: (width, height) => [
      { x: width * 0.125, y: height * 0.125, w: width * 0.3, h: height * 0.3, shape: 'hexagon' },
      { x: width * 0.575, y: height * 0.125, w: width * 0.3, h: height * 0.3, shape: 'hexagon' },
      { x: width * 0.35, y: height * 0.55, w: width * 0.3, h: height * 0.3, shape: 'hexagon' },
    ]
  },
  LAYOUT_3_PENTAGON: {
    id: 'layout-3-pent',
    name: '3 Photos - Pentagons',
    count: 3,
    positions: (width, height) => [
      { x: width * 0.1, y: height * 0.1, w: width * 0.35, h: height * 0.35, shape: 'pentagon' },
      { x: width * 0.55, y: height * 0.1, w: width * 0.35, h: height * 0.35, shape: 'pentagon' },
      { x: width * 0.325, y: height * 0.55, w: width * 0.35, h: height * 0.35, shape: 'pentagon' },
    ]
  },
  LAYOUT_3_DIAMONDS: {
    id: 'layout-3-diamonds',
    name: '3 Photos - Diamonds',
    count: 3,
    positions: (width, height) => [
      { x: width * 0.35, y: height * 0.05, w: width * 0.3, h: height * 0.3, shape: 'diamond' },
      { x: width * 0.1, y: height * 0.55, w: width * 0.3, h: height * 0.3, shape: 'diamond' },
      { x: width * 0.6, y: height * 0.55, w: width * 0.3, h: height * 0.3, shape: 'diamond' },
    ]
  },
  LAYOUT_3_STARS: {
    id: 'layout-3-stars',
    name: '3 Photos - Stars',
    count: 3,
    positions: (width, height) => [
      { x: width * 0.35, y: height * 0.1, w: width * 0.3, h: height * 0.3, shape: 'star' },
      { x: width * 0.125, y: height * 0.55, w: width * 0.3, h: height * 0.3, shape: 'star' },
      { x: width * 0.575, y: height * 0.55, w: width * 0.3, h: height * 0.3, shape: 'star' },
    ]
  },
  LAYOUT_4_MIXED_SHAPES: {
    id: 'layout-4-mixed',
    name: '4 Photos - Mixed Shapes',
    count: 4,
    positions: (width, height) => [
      { x: width * 0.1, y: height * 0.1, w: width * 0.32, h: height * 0.32, isCircle: true },
      { x: width * 0.58, y: height * 0.1, w: width * 0.32, h: height * 0.32, shape: 'hexagon' },
      { x: width * 0.1, y: height * 0.58, w: width * 0.32, h: height * 0.32, shape: 'pentagon' },
      { x: width * 0.58, y: height * 0.58, w: width * 0.32, h: height * 0.32, radius: 15 },
    ]
  },
  LAYOUT_4_CIRCLES: {
    id: 'layout-4-circles',
    name: '4 Photos - Circles',
    count: 4,
    positions: (width, height) => [
      { x: width * 0.1, y: height * 0.1, w: width * 0.32, h: height * 0.32, isCircle: true },
      { x: width * 0.58, y: height * 0.1, w: width * 0.32, h: height * 0.32, isCircle: true },
      { x: width * 0.1, y: height * 0.58, w: width * 0.32, h: height * 0.32, isCircle: true },
      { x: width * 0.58, y: height * 0.58, w: width * 0.32, h: height * 0.32, isCircle: true },
    ]
  },
  LAYOUT_4_HEXAGONS: {
    id: 'layout-4-hex',
    name: '4 Photos - Hexagons',
    count: 4,
    positions: (width, height) => [
      { x: width * 0.1, y: height * 0.1, w: width * 0.32, h: height * 0.32, shape: 'hexagon' },
      { x: width * 0.58, y: height * 0.1, w: width * 0.32, h: height * 0.32, shape: 'hexagon' },
      { x: width * 0.1, y: height * 0.58, w: width * 0.32, h: height * 0.32, shape: 'hexagon' },
      { x: width * 0.58, y: height * 0.58, w: width * 0.32, h: height * 0.32, shape: 'hexagon' },
    ]
  },
  LAYOUT_4_PENTAGONS: {
    id: 'layout-4-pent',
    name: '4 Photos - Pentagons',
    count: 4,
    positions: (width, height) => [
      { x: width * 0.1, y: height * 0.1, w: width * 0.32, h: height * 0.32, shape: 'pentagon' },
      { x: width * 0.58, y: height * 0.1, w: width * 0.32, h: height * 0.32, shape: 'pentagon' },
      { x: width * 0.1, y: height * 0.58, w: width * 0.32, h: height * 0.32, shape: 'pentagon' },
      { x: width * 0.58, y: height * 0.58, w: width * 0.32, h: height * 0.32, shape: 'pentagon' },
    ]
  },
};

// Shape drawing functions
const drawShapeClip = (ctx, pos) => {
  const { x, y, w, h, shape, radius, isCircle } = pos;
  
  if (isCircle) {
    const centerX = x + w / 2;
    const centerY = y + h / 2;
    const rad = Math.min(w, h) / 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, rad, 0, Math.PI * 2);
    ctx.closePath();
    return;
  }
  
  if (shape === 'hexagon') {
    const centerX = x + w / 2;
    const centerY = y + h / 2;
    const size = Math.min(w, h) / 2;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const px = centerX + size * Math.cos(angle);
      const py = centerY + size * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    return;
  }
  
  if (shape === 'pentagon') {
    const centerX = x + w / 2;
    const centerY = y + h / 2;
    const size = Math.min(w, h) / 2;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
      const px = centerX + size * Math.cos(angle);
      const py = centerY + size * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    return;
  }
  
  if (shape === 'diamond') {
    const centerX = x + w / 2;
    const centerY = y + h / 2;
    ctx.beginPath();
    ctx.moveTo(centerX, y);
    ctx.lineTo(x + w, centerY);
    ctx.lineTo(centerX, y + h);
    ctx.lineTo(x, centerY);
    ctx.closePath();
    return;
  }
  
  if (shape === 'star') {
    const centerX = x + w / 2;
    const centerY = y + h / 2;
    const outerRadius = Math.min(w, h) / 2;
    const innerRadius = outerRadius * 0.5;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 / 10) * i - Math.PI / 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const px = centerX + radius * Math.cos(angle);
      const py = centerY + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    return;
  }
  
  // Default rounded rectangle
  const r = radius || 0;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

export default function GalleryEditor() {
  const router = useRouter();
  const [selectedLayout, setSelectedLayout] = useState(GALLERY_LAYOUTS.LAYOUT_3_CIRCLES);
  const [photos, setPhotos] = useState([]);
  const [loadedImages, setLoadedImages] = useState([]);
  const fileInputRef = useRef(null);
  const stageRef = useRef(null);

  const CANVAS_WIDTH = 450;
  const CANVAS_HEIGHT = 450;

  // Load images whenever photos change
  useEffect(() => {
    if (photos.length === 0) {
      setLoadedImages([]);
      return;
    }

    const loadImages = async () => {
      const promises = photos.map((photoSrc) => {
        return new Promise((resolve) => {
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          img.src = photoSrc;
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
        });
      });

      const images = await Promise.all(promises);
      setLoadedImages(images.filter(img => img !== null));
    };

    loadImages();
  }, [photos]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      return;
    }

    const filesArray = Array.from(files);
    const maxPhotos = selectedLayout.count;
    
    if (filesArray.length > maxPhotos) {
      alert(`This layout supports only ${maxPhotos} photos. First ${maxPhotos} photos will be used.`);
    }

    const filesToProcess = filesArray.slice(0, maxPhotos);

    const processFiles = async () => {
      const results = [];
      
      for (const file of filesToProcess) {
        try {
          const result = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          results.push(result);
        } catch (error) {
          console.error('Error reading file:', error);
        }
      }
      
      setPhotos(results);
    };

    processFiles();
  };

  const handleLayoutChange = (layout) => {
    setSelectedLayout(layout);
    if (photos.length > layout.count) {
      setPhotos(photos.slice(0, layout.count));
    }
  };

  const renderGallery = () => {
    if (loadedImages.length === 0) return null;

    const positions = selectedLayout.positions(CANVAS_WIDTH, CANVAS_HEIGHT);

    return positions.map((pos, index) => {
      const img = loadedImages[index];
      if (!img) {
        return (
          <Group key={index}>
            <Group clipFunc={(ctx) => drawShapeClip(ctx, pos)}>
              <Rect
                x={pos.x}
                y={pos.y}
                width={pos.w}
                height={pos.h}
                fill="#e5e7eb"
              />
            </Group>
            <Text
              x={pos.x}
              y={pos.y + pos.h / 2 - 10}
              width={pos.w}
              text={`Photo ${index + 1}`}
              fontSize={14}
              fill="#9ca3af"
              align="center"
            />
          </Group>
        );
      }

      const imgAspect = img.width / img.height;
      const frameAspect = pos.w / pos.h;

      let scale;
      if (imgAspect > frameAspect) {
        scale = pos.h / img.height;
      } else {
        scale = pos.w / img.width;
      }

      const displayWidth = img.width * scale;
      const displayHeight = img.height * scale;
      const offsetX = pos.x + (pos.w - displayWidth) / 2;
      const offsetY = pos.y + (pos.h - displayHeight) / 2;

      return (
        <Group key={index}>
          <Group clipFunc={(ctx) => drawShapeClip(ctx, pos)}>
            <KonvaImage
              image={img}
              x={offsetX}
              y={offsetY}
              width={displayWidth}
              height={displayHeight}
            />
          </Group>
        </Group>
      );
    });
  };

  const handleDownload = () => {
    if (!stageRef.current || loadedImages.length === 0) return;

    const uri = stageRef.current.toDataURL({
      pixelRatio: 3,
      mimeType: 'image/png'
    });

    const link = document.createElement("a");
    link.download = `mini-gallery-${selectedLayout.name.toLowerCase().replace(/\s/g, '-')}.png`;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveAndNext = () => {
    if (!stageRef.current || loadedImages.length === 0) return;

    // Generate high-quality preview image
    const previewUri = stageRef.current.toDataURL({
      pixelRatio: 2,
      mimeType: 'image/png'
    });

    const designData = {
      photos: photos,
      layoutId: selectedLayout.id,
      layoutName: selectedLayout.name,
      photoCount: photos.length,
      productType: 'mini-gallery',
      imageUri: previewUri,
      previewImage: previewUri,
      timestamp: new Date().toISOString()
    };

    // Save to window and localStorage for persistence
    window.frameDesignData = designData;
    localStorage.setItem('frameDesignData', JSON.stringify(designData));
    
    console.log('Gallery design saved with preview:', {
      layoutName: designData.layoutName,
      photoCount: designData.photoCount,
      hasPreview: !!designData.imageUri
    });
    
    // Use Next.js router for navigation
    router.push('/p');
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-medium text-center text-gray-900 mb-6">
          Mini Photo Gallery Editor
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Preview - More Compact */}
          <div className="lg:w-[480px] flex-shrink-0">
            <div className="bg-white rounded-md shadow-md p-4">
              <Stage ref={stageRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
                <Layer>
                  <Rect
                    x={0}
                    y={0}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    fill="#ffffff"
                  />

                  {renderGallery()}

                  {loadedImages.length === 0 && (
                    <>
                      <Rect
                        x={CANVAS_WIDTH / 2 - 120}
                        y={CANVAS_HEIGHT / 2 - 45}
                        width={240}
                        height={90}
                        fill="#dc2626"
                        cornerRadius={12}
                      />
                      <Text
                        x={CANVAS_WIDTH / 2 - 120}
                        y={CANVAS_HEIGHT / 2 - 18}
                        width={240}
                        text={`SELECT ${selectedLayout.count} PHOTOS`}
                        fontSize={20}
                        fontStyle="bold"
                        fill="#ffffff"
                        align="center"
                      />
                      <Text
                        x={CANVAS_WIDTH / 2 - 120}
                        y={CANVAS_HEIGHT / 2 + 8}
                        width={240}
                        text="(Multiple at once)"
                        fontSize={13}
                        fill="#ffffff"
                        align="center"
                      />
                    </>
                  )}
                </Layer>
              </Stage>
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1 bg-white rounded-md shadow-md p-6 space-y-6">
            {/* Layout Selection */}
            <div>
              <label className="block text-md font-medium text-black mb-2">Gallery Layout</label>
              <select
                value={selectedLayout.id}
                onChange={(e) => {
                  const layout = Object.values(GALLERY_LAYOUTS).find(l => l.id === e.target.value);
                  handleLayoutChange(layout);
                }}
                className="w-full border-2 border-gray-300 text-black rounded-lg px-4 py-2.5 text-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {Object.values(GALLERY_LAYOUTS).map((layout) => (
                  <option key={layout.id} value={layout.id}>
                    {layout.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">
                📌 This layout needs <strong>{selectedLayout.count} photos</strong>
              </p>
            </div>

            {/* Photo Upload */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                key={selectedLayout.id}
              />
              <button
                onClick={handleButtonClick}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {photos.length > 0 ? `Change Photos (${photos.length}/${selectedLayout.count})` : `Select ${selectedLayout.count} Photos`}
              </button>
              
              {/* Important instruction */}
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800 font-medium">
                  💡 <strong>How to select multiple photos:</strong>
                </p>
                <ul className="text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside">
                  <li>Hold <kbd className="px-1 bg-white border rounded">Ctrl</kbd> (Windows) or <kbd className="px-1 bg-white border rounded">Cmd</kbd> (Mac)</li>
                  <li>Click {selectedLayout.count} photos one by one</li>
                  <li>Or use <kbd className="px-1 bg-white border rounded">Shift</kbd> to select a range</li>
                </ul>
              </div>

              {/* Photo selection status */}
              <div className="mt-3 space-y-2">
                {photos.length > 0 ? (
                  <div className="text-sm text-green-600 font-medium text-center p-2 bg-green-50 rounded">
                    ✓ {photos.length} of {selectedLayout.count} photo(s) selected
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 text-center">
                    📸 Click button above to select {selectedLayout.count} photos
                  </div>
                )}
                
                {/* Progress indicator */}
                {photos.length > 0 && photos.length < selectedLayout.count && (
                  <div className="text-xs text-orange-600 text-center p-2 bg-orange-50 rounded">
                    ⚠️ Need {selectedLayout.count - photos.length} more photo(s) - please add more!
                  </div>
                )}
              </div>
              
              {/* Thumbnail preview */}
              {photos.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-green-400 shadow-sm">
                      <img 
                        src={photo} 
                        alt={`Photo ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                  {/* Show placeholders for remaining slots */}
                  {Array.from({ length: selectedLayout.count - photos.length }).map((_, index) => (
                    <div key={`empty-${index}`} className="relative aspect-square rounded-lg overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                      <span className="text-gray-400 text-2xl">+</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-3 border-t">
              <button
                onClick={handleDownload}
                disabled={loadedImages.length === 0}
                className={
                  "w-full font-semibold py-3 px-4 rounded-md text-base transition-colors flex items-center justify-center gap-2 " +
                  (loadedImages.length > 0
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
                disabled={loadedImages.length === 0}
                className={
                  "w-full font-semibold py-3 px-4 rounded-md text-lg transition-colors " +
                  (loadedImages.length > 0
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed")
                }
              >
                Save & Select Size →
              </button>
            </div>

            {loadedImages.length > 0 && (
              <p className="text-xs text-gray-500 text-center pt-2">
                💡 Your gallery is ready! Continue to select size and add to cart.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}