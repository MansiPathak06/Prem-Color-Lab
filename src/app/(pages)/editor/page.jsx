"use client";
import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Rect, Shape, Group, Line, Text } from "react-konva";
import { useRouter, useSearchParams } from "next/navigation";

// Silence TensorFlow.js and ONNX Runtime warnings
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  const originalError = console.error;
  
  console.warn = (...args) => {
    const message = args[0]?.toString() || '';
    if (
      message.includes('onnxruntime') ||
      message.includes('VerifyEachNodeIsAssignedToAnEp') ||
      message.includes('execution providers') ||
      message.includes('session_state') ||
      message.includes('preferred execution providers') ||
      message.includes('Some nodes were not assigned') ||
      message.includes('Rerunning with verbose')
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
  
  console.error = (...args) => {
    const message = args[0]?.toString() || '';
    if (
      message.includes('onnxruntime') ||
      message.includes('VerifyEachNodeIsAssignedToAnEp') ||
      message.includes('execution providers') ||
      message.includes('session_state') ||
      message.includes('preferred execution providers')
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

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

// Clock-specific shapes
const CLOCK_SHAPES = {
  SQUARE_CLOCK: {
    id: 'square-clock',
    name: 'Square Clock',
    cornerRadius: 8,
  },
  ROUNDED_SQUARE_CLOCK: {
    id: 'rounded-square-clock',
    name: 'Rounded Square',
    cornerRadius: 30,
  },
  CIRCLE_CLOCK: {
    id: 'circle-clock',
    name: 'Circle Clock',
    isCircle: true,
  },
  LEAF_CLOCK: {
    id: 'leaf-clock',
    name: 'Leaf Shape',
    isLeaf: true,
  },
  HEXAGON_CLOCK: {
    id: 'hexagon-clock',
    name: 'Hexagon Clock',
    isHexagon: true,
  },
  OCTAGON_CLOCK: {
    id: 'octagon-clock',
    name: 'Octagon Clock',
    isOctagon: true,
  },
  DIAMOND_CLOCK: {
    id: 'diamond-clock',
    name: 'Diamond Clock',
    isDiamond: true,
  },
};

const cmToPx = (cm) => {
  const t = (cm - MIN_CM) / (MAX_CM - MIN_CM);
  return MIN_PX + t * (MAX_PX - MIN_PX);
};

export default function FrameEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productType = searchParams.get('type');
  const isAcrylicCutout = productType === 'acrylic-cutout';
  const isAcrylicClock = productType === 'acrylic-clock';

  const [photoSrc, setPhotoSrc] = useState(null);
  const [photoImg, setPhotoImg] = useState(null);
  const [bgRemovedImg, setBgRemovedImg] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  
  const initialShape = isAcrylicClock ? CLOCK_SHAPES.CIRCLE_CLOCK : FRAME_SHAPES.ROUNDED_RECT;
  const [selectedShape, setSelectedShape] = useState(initialShape);

  const [widthCm, setWidthCm] = useState(30);
  const [heightCm, setHeightCm] = useState(30);
  const [thicknessMm, setThicknessMm] = useState(20);

  const [photoScale, setPhotoScale] = useState(1);
  const [photoPos, setPhotoPos] = useState({ x: 0, y: 0 });

  const [frameColor, setFrameColor] = useState("#000000");
  const [matColor, setMatColor] = useState("#ffffff");

  // NEW: Clock customization colors
  const [clockNumberColor, setClockNumberColor] = useState("#2c3e50");
  const [clockHandColor, setClockHandColor] = useState("#2c3e50");
  const [clockSecondHandColor, setClockSecondHandColor] = useState("#e74c3c");

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

  // Effect for regular photo loading
  useEffect(() => {
    if (!photoSrc || isAcrylicCutout) return;

    const img = new window.Image();
    img.src = photoSrc;
    img.onload = () => {
      setPhotoImg(img);

      const targetWidth = isAcrylicClock ? PREVIEW_WIDTH * 0.9 : (selectedShape.hasDualBorder ? matInnerWidth : innerWidth);
      const targetHeight = isAcrylicClock ? PREVIEW_HEIGHT * 0.9 : (selectedShape.hasDualBorder ? matInnerHeight : innerHeight);

      const imgAspect = img.width / img.height;
      const frameAspect = targetWidth / targetHeight;

      let scale;
      if (imgAspect > frameAspect) {
        scale = targetWidth / img.width;
      } else {
        scale = targetHeight / img.height;
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
    isAcrylicCutout,
    isAcrylicClock,
    selectedShape.id,
    selectedShape.hasDualBorder,
    PREVIEW_WIDTH,
    PREVIEW_HEIGHT,
    framePx,
    matInnerWidth,
    matInnerHeight,
  ]);

  // Effect for background removal
  useEffect(() => {
    if (!photoSrc || !isAcrylicCutout) return;

    let isMounted = true;

    async function removeBg() {
      if (!isMounted) return;

      setIsProcessing(true);
      setProcessingProgress(0);

      try {
        const { removeBackground } = await import("rembg-webgpu");

        if (!isMounted) return;

        console.log('Starting background removal...');

        const result = await removeBackground(photoSrc, {
          model: 'u2net',
          device: 'auto',
          progress: (stage, current, total) => {
            const percent = Math.round((current / total) * 100);
            setProcessingProgress(percent);
            console.log(`${stage}: ${percent}%`);
          }
        });

        if (!isMounted) return;

        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = result.blobUrl;

        img.onload = () => {
          if (!isMounted) return;

          setBgRemovedImg(img);
          setPhotoImg(img);

          const scale = Math.min(
            (PREVIEW_WIDTH * 0.8) / img.width,
            (PREVIEW_HEIGHT * 0.8) / img.height
          );
          setPhotoScale(scale);

          const displayWidth = img.width * scale;
          const displayHeight = img.height * scale;
          const offsetX = (PREVIEW_WIDTH - displayWidth) / 2;
          const offsetY = (PREVIEW_HEIGHT - displayHeight) / 2;
          setPhotoPos({ x: offsetX, y: offsetY });

          setIsProcessing(false);
          setProcessingProgress(100);
          console.log('Background removal complete!');
        };

        img.onerror = () => {
          if (!isMounted) return;
          console.error('Failed to load processed image');
          setIsProcessing(false);
          alert('Failed to process the image. Please try again.');
        };

      } catch (error) {
        if (!isMounted) return;

        console.error('Background removal failed:', error);
        setIsProcessing(false);

        if (error.message?.includes('WebGPU')) {
          alert('Your browser does not support WebGPU. Please use Chrome 113+, Edge 113+, or Safari 18+');
        } else {
          alert('Failed to remove background. Please try a different image or ensure you have a modern browser.');
        }
      }
    }

    removeBg();

    return () => {
      isMounted = false;
    };
  }, [photoSrc, isAcrylicCutout, PREVIEW_WIDTH, PREVIEW_HEIGHT]);

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
    link.download = `${isAcrylicClock ? 'acrylic-clock' : isAcrylicCutout ? 'acrylic-cutout' : 'framed-photo'}-${widthCm}x${heightCm}cm.png`;
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
      imageUri: isAcrylicCutout && bgRemovedImg ? bgRemovedImg.src : photoSrc,
      previewImage: uri,
      frameShape: selectedShape.name,
      frameShapeId: selectedShape.id,
      frameColor: frameColor,
      matColor: matColor,
      widthCm: widthCm,
      heightCm: heightCm,
      thicknessMm: thicknessMm,
      photoScale: photoScale,
      photoPos: photoPos,
      clockNumberColor: clockNumberColor,
      clockHandColor: clockHandColor,
      clockSecondHandColor: clockSecondHandColor,
      productType: isAcrylicClock ? 'acrylic-clock' : isAcrylicCutout ? 'acrylic-cutout' : 'frame',
      timestamp: new Date().toISOString()
    };

    window.frameDesignData = designData;
    
    console.log('Design saved:', designData);

    router.push('/p');
  };

  const resetPhotoFit = () => {
    if (!photoImg) return;

    if (isAcrylicCutout) {
      const scale = Math.min(
        (PREVIEW_WIDTH * 0.8) / photoImg.width,
        (PREVIEW_HEIGHT * 0.8) / photoImg.height
      );
      setPhotoScale(scale);

      const displayWidth = photoImg.width * scale;
      const displayHeight = photoImg.height * scale;
      const offsetX = (PREVIEW_WIDTH - displayWidth) / 2;
      const offsetY = (PREVIEW_HEIGHT - displayHeight) / 2;
      setPhotoPos({ x: offsetX, y: offsetY });
    } else {
      const targetWidth = isAcrylicClock ? PREVIEW_WIDTH * 0.9 : (selectedShape.hasDualBorder ? matInnerWidth : innerWidth);
      const targetHeight = isAcrylicClock ? PREVIEW_HEIGHT * 0.9 : (selectedShape.hasDualBorder ? matInnerHeight : innerHeight);

      const imgAspect = photoImg.width / photoImg.height;
      const frameAspect = targetWidth / targetHeight;

      let scale;
      if (imgAspect > frameAspect) {
        scale = targetWidth / photoImg.width;
      } else {
        scale = targetHeight / photoImg.height;
      }
      setPhotoScale(scale);

      const displayWidth = photoImg.width * scale;
      const displayHeight = photoImg.height * scale;
      const offsetX = (targetWidth - displayWidth) / 2;
      const offsetY = (targetHeight - displayHeight) / 2;
      setPhotoPos({ x: offsetX, y: offsetY });
    }
  };

  const circleClipFunc = (ctx, width, height) => {
    const radius = Math.min(width, height) / 2;
    const centerX = width / 2;
    const centerY = height / 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
    ctx.closePath();
  };

  // Get proper radius for different shapes
  const getShapeRadius = () => {
    const baseSize = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT);
    
    if (selectedShape.isHexagon || selectedShape.isOctagon) {
      return baseSize * 0.35;
    } else if (selectedShape.isDiamond) {
      return baseSize * 0.30;
    } else if (selectedShape.isLeaf) {
      return baseSize * 0.32;
    }
    return baseSize * 0.38;
  };

  // Render clock hands and numbers with customizable colors
  const renderClockOverlay = () => {
    const centerX = PREVIEW_WIDTH / 2;
    const centerY = PREVIEW_HEIGHT / 2;
    const radius = getShapeRadius();

    const numbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const fontSize = radius * 0.18;
    
    return (
      <Group>
        {/* Clock numbers */}
        {numbers.map((num, index) => {
          const angle = (index * 30 - 90) * (Math.PI / 180);
          const numberRadius = radius * 0.75;
          const x = centerX + numberRadius * Math.cos(angle);
          const y = centerY + numberRadius * Math.sin(angle);
          
          return (
            <Text
              key={num}
              x={x}
              y={y}
              text={num.toString()}
              fontSize={fontSize}
              fontFamily="Arial, sans-serif"
              fontStyle="bold"
              fill={clockNumberColor}
              align="center"
              verticalAlign="middle"
              offsetX={fontSize / 2}
              offsetY={fontSize / 2}
            />
          );
        })}

        {/* Hour markers */}
        {Array.from({ length: 12 }).map((_, index) => {
          const angle = (index * 30 - 90) * (Math.PI / 180);
          const markerRadius = radius * 0.90;
          const x = centerX + markerRadius * Math.cos(angle);
          const y = centerY + markerRadius * Math.sin(angle);
          
          return (
            <Shape
              key={`marker-${index}`}
              sceneFunc={(ctx, shape) => {
                ctx.beginPath();
                ctx.arc(x, y, radius * 0.025, 0, Math.PI * 2);
                ctx.fillStrokeShape(shape);
              }}
              fill={clockNumberColor}
              opacity={0.5}
            />
          );
        })}

        {/* Hour hand */}
        <Line
          points={[
            centerX, 
            centerY, 
            centerX + radius * 0.45 * Math.cos((-90 + 60) * Math.PI / 180), 
            centerY + radius * 0.45 * Math.sin((-90 + 60) * Math.PI / 180)
          ]}
          stroke={clockHandColor}
          strokeWidth={radius * 0.045}
          lineCap="round"
        />

        {/* Minute hand */}
        <Line
          points={[
            centerX, 
            centerY, 
            centerX + radius * 0.65 * Math.cos((-90 + 180) * Math.PI / 180), 
            centerY + radius * 0.65 * Math.sin((-90 + 180) * Math.PI / 180)
          ]}
          stroke={clockHandColor}
          strokeWidth={radius * 0.03}
          lineCap="round"
        />

        {/* Second hand */}
        <Line
          points={[
            centerX, 
            centerY, 
            centerX + radius * 0.70 * Math.cos((-90 + 270) * Math.PI / 180), 
            centerY + radius * 0.70 * Math.sin((-90 + 270) * Math.PI / 180)
          ]}
          stroke={clockSecondHandColor}
          strokeWidth={radius * 0.018}
          lineCap="round"
        />

        {/* Center dot */}
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 0.06, 0, Math.PI * 2);
            ctx.fillStrokeShape(shape);
          }}
          fill={clockHandColor}
        />
      </Group>
    );
  };

  // Render clock frame with proper image fitting
  const renderClockFrame = () => {
    if (!photoImg) return null;

    const centerX = PREVIEW_WIDTH / 2;
    const centerY = PREVIEW_HEIGHT / 2;

    // Circle Clock
    if (selectedShape.isCircle) {
      const radius = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT) / 2;
      const photoRadius = radius * 0.95;

      const diameter = photoRadius * 2;
      const scale = Math.max(diameter / photoImg.width, diameter / photoImg.height);
      
      const displayWidth = photoImg.width * scale;
      const displayHeight = photoImg.height * scale;
      const photoX = centerX - displayWidth / 2;
      const photoY = centerY - displayHeight / 2;

      return (
        <Group>
          <Group
            clipFunc={(ctx) => {
              ctx.beginPath();
              ctx.arc(centerX, centerY, photoRadius, 0, Math.PI * 2);
              ctx.closePath();
            }}
          >
            <KonvaImage
              image={photoImg}
              x={photoX}
              y={photoY}
              width={displayWidth}
              height={displayHeight}
            />
          </Group>
          {renderClockOverlay()}
        </Group>
      );
    }

    // Hexagon Clock
    if (selectedShape.isHexagon) {
      const size = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT) * 0.90;
      const radius = size / 2;

      const scale = Math.max(size / photoImg.width, size / photoImg.height);
      const displayWidth = photoImg.width * scale;
      const displayHeight = photoImg.height * scale;
      const photoX = centerX - displayWidth / 2;
      const photoY = centerY - displayHeight / 2;

      return (
        <Group>
          <Group
            clipFunc={(ctx) => {
              ctx.beginPath();
              for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i - Math.PI / 2;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.closePath();
            }}
          >
            <KonvaImage
              image={photoImg}
              x={photoX}
              y={photoY}
              width={displayWidth}
              height={displayHeight}
            />
          </Group>
          {renderClockOverlay()}
        </Group>
      );
    }

    // Octagon Clock
    if (selectedShape.isOctagon) {
      const size = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT) * 0.90;
      const radius = size / 2;

      const scale = Math.max(size / photoImg.width, size / photoImg.height);
      const displayWidth = photoImg.width * scale;
      const displayHeight = photoImg.height * scale;
      const photoX = centerX - displayWidth / 2;
      const photoY = centerY - displayHeight / 2;

      return (
        <Group>
          <Group
            clipFunc={(ctx) => {
              ctx.beginPath();
              for (let i = 0; i < 8; i++) {
                const angle = (Math.PI / 4) * i - Math.PI / 2;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.closePath();
            }}
          >
            <KonvaImage
              image={photoImg}
              x={photoX}
              y={photoY}
              width={displayWidth}
              height={displayHeight}
            />
          </Group>
          {renderClockOverlay()}
        </Group>
      );
    }

    // Diamond Clock
    if (selectedShape.isDiamond) {
      const size = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT) * 0.80;

      const scale = Math.max(size / photoImg.width, size / photoImg.height);
      const displayWidth = photoImg.width * scale;
      const displayHeight = photoImg.height * scale;
      const photoX = centerX - displayWidth / 2;
      const photoY = centerY - displayHeight / 2;

      return (
        <Group>
          <Group
            clipFunc={(ctx) => {
              ctx.beginPath();
              ctx.moveTo(centerX, centerY - size / 2);
              ctx.lineTo(centerX + size / 2, centerY);
              ctx.lineTo(centerX, centerY + size / 2);
              ctx.lineTo(centerX - size / 2, centerY);
              ctx.closePath();
            }}
          >
            <KonvaImage
              image={photoImg}
              x={photoX}
              y={photoY}
              width={displayWidth}
              height={displayHeight}
            />
          </Group>
          {renderClockOverlay()}
        </Group>
      );
    }

    // Leaf shape
    if (selectedShape.isLeaf) {
      const width = PREVIEW_WIDTH * 0.85;
      const height = PREVIEW_HEIGHT * 0.85;
      const startX = (PREVIEW_WIDTH - width) / 2;
      const startY = (PREVIEW_HEIGHT - height) / 2;

      const scale = Math.max(width / photoImg.width, height / photoImg.height);
      const displayWidth = photoImg.width * scale;
      const displayHeight = photoImg.height * scale;
      const photoX = centerX - displayWidth / 2;
      const photoY = centerY - displayHeight / 2;

      return (
        <Group>
          <Group
            clipFunc={(ctx) => {
              ctx.beginPath();
              ctx.moveTo(startX + width / 2, startY);
              ctx.quadraticCurveTo(startX + width, startY + height / 3, startX + width, startY + height / 2);
              ctx.quadraticCurveTo(startX + width, startY + height * 0.7, startX + width / 2, startY + height);
              ctx.quadraticCurveTo(startX, startY + height * 0.7, startX, startY + height / 2);
              ctx.quadraticCurveTo(startX, startY + height / 3, startX + width / 2, startY);
              ctx.closePath();
            }}
          >
            <KonvaImage
              image={photoImg}
              x={photoX}
              y={photoY}
              width={displayWidth}
              height={displayHeight}
            />
          </Group>
          {renderClockOverlay()}
        </Group>
      );
    }

    // Square and Rounded Square
    const width = PREVIEW_WIDTH * 0.90;
    const height = PREVIEW_HEIGHT * 0.90;
    const offsetX = (PREVIEW_WIDTH - width) / 2;
    const offsetY = (PREVIEW_HEIGHT - height) / 2;
    
    const scale = Math.max(width / photoImg.width, height / photoImg.height);
    const displayWidth = photoImg.width * scale;
    const displayHeight = photoImg.height * scale;
    const photoX = centerX - displayWidth / 2;
    const photoY = centerY - displayHeight / 2;

    return (
      <Group>
        <Group
          clipFunc={(ctx) => {
            const r = selectedShape.cornerRadius;

            ctx.beginPath();
            ctx.moveTo(offsetX + r, offsetY);
            ctx.lineTo(offsetX + width - r, offsetY);
            ctx.quadraticCurveTo(offsetX + width, offsetY, offsetX + width, offsetY + r);
            ctx.lineTo(offsetX + width, offsetY + height - r);
            ctx.quadraticCurveTo(offsetX + width, offsetY + height, offsetX + width - r, offsetY + height);
            ctx.lineTo(offsetX + r, offsetY + height);
            ctx.quadraticCurveTo(offsetX, offsetY + height, offsetX, offsetY + height - r);
            ctx.lineTo(offsetX, offsetY + r);
            ctx.quadraticCurveTo(offsetX, offsetY, offsetX + r, offsetY);
            ctx.closePath();
          }}
        >
          <KonvaImage
            image={photoImg}
            x={photoX}
            y={photoY}
            width={displayWidth}
            height={displayHeight}
          />
        </Group>
        {renderClockOverlay()}
      </Group>
    );
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

  const getEditorTitle = () => {
    if (isAcrylicClock) return 'Acrylic Wall Clock Editor';
    if (isAcrylicCutout) return 'Acrylic Cutout Editor';
    return `Acrylic Wall Photo Editor (${widthCm}×${heightCm}cm)`;
  };

  const availableShapes = isAcrylicClock ? CLOCK_SHAPES : FRAME_SHAPES;

  return (
    <div className="min-h-screen bg-gray-100 p-6 py-30">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-medium text-center text-gray-900 mb-6">
          {getEditorTitle()}
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white rounded-md shadow-md p-6 relative">
              {isProcessing && (
                <div className="absolute inset-0 bg-white/95 flex items-center justify-center z-50 rounded-md">
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                      <div 
                        className="absolute inset-0 border-4 border-red-600 rounded-full border-t-transparent animate-spin"
                      ></div>
                    </div>
                    <p className="text-gray-900 font-semibold text-lg mb-2">Removing Background...</p>
                    <div className="w-64 bg-gray-200 rounded-full h-3 mb-2">
                      <div 
                        className="bg-red-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${processingProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-600 text-sm">{processingProgress}% complete</p>
                  </div>
                </div>
              )}

              <Stage
                ref={stageRef}
                width={PREVIEW_WIDTH}
                height={PREVIEW_HEIGHT}
              >
                <Layer>
                  {!photoImg && (
                    <Rect
                      x={0}
                      y={0}
                      width={PREVIEW_WIDTH}
                      height={PREVIEW_HEIGHT}
                      fill="#f3f4f6"
                    />
                  )}

                  {isAcrylicClock ? (
                    renderClockFrame()
                  ) : isAcrylicCutout ? (
                    bgRemovedImg ? (
                      <KonvaImage
                        image={bgRemovedImg}
                        x={photoPos.x}
                        y={photoPos.y}
                        width={bgRemovedImg.width * photoScale}
                        height={bgRemovedImg.height * photoScale}
                        draggable
                        onDragMove={(e) => {
                          const node = e.target;
                          setPhotoPos({ x: node.x(), y: node.y() });
                        }}
                      />
                    ) : null
                  ) : (
                    renderFrame()
                  )}

                  {!photoImg && !isProcessing && (
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
            {!isAcrylicCutout && (
              <div>
                <label className="block text-md font-medium text-black mb-2">
                  {isAcrylicClock ? 'Clock Shape' : 'Frame Shape'}
                </label>
                <select
                  value={selectedShape.id}
                  onChange={(e) => {
                    const shape = Object.values(availableShapes).find(s => s.id === e.target.value);
                    setSelectedShape(shape);
                  }}
                  className="w-full border-2 border-gray-300 text-black rounded-lg px-4 py-2.5 text-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400 transition-colors"
                >
                  {Object.values(availableShapes).map((shape) => (
                    <option key={shape.id} value={shape.id}>
                      {shape.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
                disabled={isProcessing}
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

            {/* CLOCK COLOR CUSTOMIZATION */}
            {isAcrylicClock && (
              <>
                <div>
                  <label className="block text-md text-black font-medium mb-2">Clock Numbers Color</label>
                  <div className="flex gap-2 flex-wrap items-center">
                    {["#2c3e50", "#ffffff", "#000000", "#e74c3c", "#f39c12"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setClockNumberColor(c)}
                        className={
                          "w-9 h-9 rounded border-2 transition-all " +
                          (clockNumberColor === c ? "border-blue-500 scale-110 ring-2 ring-blue-300" : "border-gray-300")
                        }
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    <input
                      type="color"
                      value={clockNumberColor}
                      onChange={(e) => setClockNumberColor(e.target.value)}
                      className="w-9 h-9 rounded border-2 border-gray-300 cursor-pointer"
                      title="Custom color picker"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-md text-black font-medium mb-2">Clock Hands Color</label>
                  <div className="flex gap-2 flex-wrap items-center">
                    {["#2c3e50", "#ffffff", "#000000", "#34495e", "#95a5a6"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setClockHandColor(c)}
                        className={
                          "w-9 h-9 rounded border-2 transition-all " +
                          (clockHandColor === c ? "border-blue-500 scale-110 ring-2 ring-blue-300" : "border-gray-300")
                        }
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    <input
                      type="color"
                      value={clockHandColor}
                      onChange={(e) => setClockHandColor(e.target.value)}
                      className="w-9 h-9 rounded border-2 border-gray-300 cursor-pointer"
                      title="Custom color picker"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-md text-black font-medium mb-2">Second Hand Color</label>
                  <div className="flex gap-2 flex-wrap items-center">
                    {["#e74c3c", "#e67e22", "#f39c12", "#ffffff", "#000000"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setClockSecondHandColor(c)}
                        className={
                          "w-9 h-9 rounded border-2 transition-all " +
                          (clockSecondHandColor === c ? "border-blue-500 scale-110 ring-2 ring-blue-300" : "border-gray-300")
                        }
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    <input
                      type="color"
                      value={clockSecondHandColor}
                      onChange={(e) => setClockSecondHandColor(e.target.value)}
                      className="w-9 h-9 rounded border-2 border-gray-300 cursor-pointer"
                      title="Custom color picker"
                    />
                  </div>
                </div>
              </>
            )}

            {!isAcrylicCutout && !isAcrylicClock && (
              <>
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
              </>
            )}

            {photoImg && !isProcessing && !isAcrylicClock && (
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
                disabled={!photoImg || isProcessing}
                className={
                  "w-full font-semibold py-3 px-4 rounded-md text-base transition-colors flex items-center justify-center gap-2 " +
                  (photoImg && !isProcessing
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
                disabled={!photoImg || isProcessing}
                className={
                  "w-full font-semibold py-3 px-4 rounded-md text-lg transition-colors " +
                  (photoImg && !isProcessing
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed")
                }
              >
                Save & Select Size →
              </button>
            </div>

            {photoImg && !isProcessing && (
              <p className="text-xs text-gray-500 text-center pt-2">
                💡 {isAcrylicClock ? "Customize your clock colors above!" : isAcrylicCutout ? "Background removed! Drag to reposition" : "Download saves to your device"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
