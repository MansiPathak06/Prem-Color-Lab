"use client";
import React, { useState, useEffect } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Rect,
  Shape,
  Group,
  Line,
  Circle,
  Text,
} from "react-konva";
import { useRouter } from "next/navigation";

const FRAME_SHAPES = {
  square: { cornerRadius: 0, hasDualBorder: false, isCircle: false },
  "rounded-rect": { cornerRadius: 20, hasDualBorder: false, isCircle: false },
  "extra-rounded": { cornerRadius: 50, hasDualBorder: false, isCircle: false },
  circle: { cornerRadius: 0, hasDualBorder: false, isCircle: true },
  diamond: {
    cornerRadius: 0,
    hasDualBorder: false,
    isCircle: false,
    isDiamond: true,
  },
  star: {
    cornerRadius: 0,
    hasDualBorder: false,
    isCircle: false,
    isStar: true,
  },
  hexagon: {
    cornerRadius: 0,
    hasDualBorder: false,
    isCircle: false,
    isPolygon: true,
    sides: 6,
  },
  octagon: {
    cornerRadius: 0,
    hasDualBorder: false,
    isCircle: false,
    isPolygon: true,
    sides: 8,
  },
  heart: {
    cornerRadius: 0,
    hasDualBorder: false,
    isCircle: false,
    isHeart: true,
  },
  "dual-square": {
    cornerRadius: 0,
    hasDualBorder: true,
    isCircle: false,
    innerBorderGap: 12,
  },
  "dual-rounded": {
    cornerRadius: 20,
    hasDualBorder: true,
    isCircle: false,
    innerBorderGap: 12,
  },
  "dual-circle": {
    cornerRadius: 0,
    hasDualBorder: true,
    isCircle: true,
    innerBorderGap: 12,
  },
  "square-clock": { cornerRadius: 8, isClock: true },
  "rounded-square-clock": { cornerRadius: 30, isClock: true },
  "circle-clock": { isCircle: true, isClock: true },
  "leaf-clock": { isLeaf: true, isClock: true },
  "hexagon-clock": { isHexagon: true, isClock: true },
  "octagon-clock": { isOctagon: true, isClock: true },
  "diamond-clock": { isDiamond: true, isClock: true },
};

const SIZE_OPTIONS = [
  {
    label: "12x9",
    widthCm: 30.48,
    heightCm: 22.86,
    widthInch: 12,
    heightInch: 9,
  },
  {
    label: "16x12",
    widthCm: 40.64,
    heightCm: 30.48,
    widthInch: 16,
    heightInch: 12,
  },
  {
    label: "18x12",
    widthCm: 45.72,
    heightCm: 30.48,
    widthInch: 18,
    heightInch: 12,
  },
  {
    label: "21x15",
    widthCm: 53.34,
    heightCm: 38.1,
    widthInch: 21,
    heightInch: 15,
  },
  {
    label: "30x20",
    widthCm: 76.2,
    heightCm: 50.8,
    widthInch: 30,
    heightInch: 20,
  },
  {
    label: "35x23",
    widthCm: 88.9,
    heightCm: 58.42,
    widthInch: 35,
    heightInch: 23,
  },
  {
    label: "48x36",
    widthCm: 121.92,
    heightCm: 91.44,
    widthInch: 48,
    heightInch: 36,
  },
];

const THICKNESS_OPTIONS = [
  { label: "3mm", value: 3 },
  { label: "5mm", value: 5 },
  { label: "8mm", value: 8 },
];

const PRICES = {
  "12x9": { 3: 699, 5: 799, 8: 899 },
  "16x12": { 3: 999, 5: 1099, 8: 1199 },
  "18x12": { 3: 1199, 5: 1299, 8: 1399 },
  "21x15": { 3: 1499, 5: 1599, 8: 1699 },
  "30x20": { 3: 2499, 5: 2699, 8: 2899 },
  "35x23": { 3: 2999, 5: 3199, 8: 3399 },
  "48x36": { 3: 3499, 5: 3699, 8: 3999 },
};

export default function FrameProductPage() {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(SIZE_OPTIONS[4]);
  const [selectedThickness, setSelectedThickness] = useState(3);
  const [orientation, setOrientation] = useState("landscape");
  const [designData, setDesignData] = useState(null);
  const [photoImg, setPhotoImg] = useState(null);
  const [mockupImg, setMockupImg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAcrylicCutout, setIsAcrylicCutout] = useState(false);
  const [isAcrylicClock, setIsAcrylicClock] = useState(false);
  const [isGallery, setIsGallery] = useState(false);
  const [isAcrylicKeychain, setIsAcrylicKeychain] = useState(false);

  const saveToCart = () => {
    if (!designData || !photoImg) return;

    const cartItem = {
      id: Date.now().toString(),
      ...designData,
      selectedSize: selectedSize.label,
      selectedThickness,
      orientation,
      price: PRICES[selectedSize.label]?.[selectedThickness],
      timestamp: Date.now(),
      previewWidthCm: selectedSize.widthCm,
      previewHeightCm: selectedSize.heightCm,
      widthInch: selectedSize.widthInch,
      heightInch: selectedSize.heightInch,
      finalWidthCm:
        orientation === "portrait"
          ? selectedSize.heightCm
          : selectedSize.widthCm,
      finalHeightCm:
        orientation === "portrait"
          ? selectedSize.widthCm
          : selectedSize.heightCm,
      finalWidthInch:
        orientation === "portrait"
          ? selectedSize.heightInch
          : selectedSize.widthInch,
      finalHeightInch:
        orientation === "portrait"
          ? selectedSize.widthInch
          : selectedSize.heightInch,
      isAcrylicCutout: isAcrylicCutout,
      isAcrylicClock: isAcrylicClock,
      isGallery: isGallery,
    };

    let cart = JSON.parse(localStorage.getItem("frameCart") || "[]");
    cart.push(cartItem);
    localStorage.setItem("frameCart", JSON.stringify(cart));

    console.log("Added to cart:", cartItem);
    router.push("/cart");
  };

  useEffect(() => {
    let savedData = window.frameDesignData;

    if (!savedData || !savedData.productType) {
      const stored = localStorage.getItem("frameDesignData");
      if (stored) {
        try {
          savedData = JSON.parse(stored);
          console.log("Loaded design data from localStorage");
        } catch (e) {
          console.error("Failed to parse stored design data:", e);
        }
      }
    }

    if (!savedData) {
      savedData = {
        imageUri:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        frameShapeId: "rounded-rect",
        frameColor: "#000000",
        matColor: "#ffffff",
        widthCm: 30,
        heightCm: 20,
        thicknessMm: 20,
        productType: "frame",
      };
    }

    console.log("Loaded design data:", savedData);
    setDesignData(savedData);

    const isCutout = savedData.productType === "acrylic-cutout";
    const isClock = savedData.productType === "acrylic-clock";
    const isGal = savedData.productType === "mini-gallery";
    const isKeychain = savedData.productType === "acrylic-keychain";

    setIsAcrylicCutout(isCutout);
    setIsAcrylicClock(isClock);
    setIsGallery(isGal);
    setIsAcrylicKeychain(isKeychain);

    // Load mockup image - different for keychains
   if (!isGal) {
  const mockup = new window.Image();
  mockup.crossOrigin = "anonymous";

  // ✅ Choose mockup based on product type
  if (isKeychain) {
    // No background for keychains - keep it simple
    setMockupImg(null);
  } else if (isCutout) {
    mockup.src = "https://i.pinimg.com/1200x/3b/c3/86/3bc386018ab0e5631374a2996d79d339.jpg";
    mockup.onload = () => setMockupImg(mockup);
    mockup.onerror = () => {
      console.error("Failed to load mockup image");
      setMockupImg(null);
    };
  } else {
    mockup.src = "/bg-image.png"; // Wall room mockup
    mockup.onload = () => setMockupImg(mockup);
    mockup.onerror = () => {
      console.error("Failed to load mockup image");
      setMockupImg(null);
    };
  }
}


    const imageSource = savedData.imageUri || savedData.previewImage;

    if (imageSource) {
      console.log("Loading image from:", imageSource.substring(0, 50) + "...");
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = imageSource;
      img.onload = () => {
        console.log("Image loaded successfully:", img.width, "x", img.height);
        setPhotoImg(img);
        setLoading(false);
      };
      img.onerror = (err) => {
        console.error("Failed to load image:", err);
        setLoading(false);
      };
    } else {
      console.log("No image source found");
      setLoading(false);
    }
  }, []);

  const cmToPx = (cm, maxCm = 121.92) => {
    const scale = 400 / maxCm;
    return cm * scale;
  };

  const getCurrentDimensions = () => {
    if (orientation === "portrait") {
      return {
        widthCm: selectedSize.heightCm,
        heightCm: selectedSize.widthCm,
        widthInch: selectedSize.heightInch,
        heightInch: selectedSize.widthInch,
      };
    }
    return {
      widthCm: selectedSize.widthCm,
      heightCm: selectedSize.heightCm,
      widthInch: selectedSize.widthInch,
      heightInch: selectedSize.heightInch,
    };
  };

  const currentDimensions = getCurrentDimensions();

  // Get proper radius for different clock shapes
  const getShapeRadius = (PREVIEW_WIDTH, PREVIEW_HEIGHT) => {
    const baseSize = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT);
    const shapeConfig = FRAME_SHAPES[designData?.frameShapeId] || {};

    if (shapeConfig.isHexagon || shapeConfig.isOctagon) {
      return baseSize * 0.35;
    } else if (shapeConfig.isDiamond) {
      return baseSize * 0.3;
    } else if (shapeConfig.isLeaf) {
      return baseSize * 0.32;
    }
    return baseSize * 0.38;
  };


const renderKeychainFrame = () => {
  if (!photoImg) return null;

  const keychainSize = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT) * 0.6;
  const centerX = PREVIEW_WIDTH / 2;
  const centerY = PREVIEW_HEIGHT / 2;
  const shapeId = designData.keychainShape || 'circle';

  // Render metal chain above keychain
  const renderMetalChain = (topY) => {
    const chainLinks = 4;
    const linkHeight = 18;
    const linkWidth = 12;
    const startY = topY - (chainLinks * linkHeight) - 30;

    return (
      <Group>
        {/* Main keyring at top */}
        <Group>
          {/* Ring shadow */}
          <Circle
            x={centerX}
            y={startY}
            radius={22}
            fill="rgba(0,0,0,0.15)"
            offsetY={-3}
          />
          {/* Ring outer */}
          <Circle
            x={centerX}
            y={startY}
            radius={20}
            stroke="#a8a8a8"
            strokeWidth={4}
          />
          {/* Ring inner */}
          <Circle
            x={centerX}
            y={startY}
            radius={16}
            stroke="#606060"
            strokeWidth={2}
          />
          {/* Ring highlight */}
          <Circle
            x={centerX - 8}
            y={startY - 8}
            radius={6}
            fill="rgba(255, 255, 255, 0.4)"
          />
        </Group>

        {/* Chain links */}
        {Array.from({ length: chainLinks }).map((_, i) => {
          const linkY = startY + 20 + (i * linkHeight);
          const rotation = i % 2 === 0 ? 0 : 90;
          
          return (
            <Group key={i} x={centerX} y={linkY} rotation={rotation}>
              {/* Link shadow */}
              <Rect
                x={-linkWidth / 2}
                y={-linkHeight / 2}
                width={linkWidth}
                height={linkHeight}
                cornerRadius={linkWidth / 2}
                fill="rgba(0,0,0,0.1)"
                offsetY={-2}
              />
              {/* Link outer */}
              <Rect
                x={-linkWidth / 2}
                y={-linkHeight / 2}
                width={linkWidth}
                height={linkHeight}
                cornerRadius={linkWidth / 2}
                stroke="#909090"
                strokeWidth={3}
                fill="transparent"
              />
              {/* Link inner detail */}
              <Rect
                x={-linkWidth / 2 + 2}
                y={-linkHeight / 2 + 2}
                width={linkWidth - 4}
                height={linkHeight - 4}
                cornerRadius={(linkWidth - 4) / 2}
                stroke="#606060"
                strokeWidth={1}
                fill="transparent"
              />
              {/* Link highlight */}
              <Rect
                x={-linkWidth / 2}
                y={-linkHeight / 2 + 2}
                width={3}
                height={linkHeight / 3}
                cornerRadius={1.5}
                fill="rgba(255, 255, 255, 0.4)"
              />
            </Group>
          );
        })}
      </Group>
    );
  };

  // Circle keychain
  if (shapeId === 'circle') {
    const radius = keychainSize / 2;
    const scale = Math.max(
      (keychainSize) / photoImg.width,
      (keychainSize) / photoImg.height
    );
    const displayWidth = photoImg.width * scale;
    const displayHeight = photoImg.height * scale;
    const photoX = centerX - displayWidth / 2;
    const photoY = centerY - displayHeight / 2;
    const topHoleY = centerY - radius + 15;

    return (
      <Group>
        {/* Metal chain */}
        {renderMetalChain(topHoleY)}

        {/* Bottom shadow for depth */}
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fillStrokeShape(shape);
          }}
          fill="rgba(0,0,0,0.15)"
          offsetX={-3}
          offsetY={-6}
        />

        {/* Main keychain base */}
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fillStrokeShape(shape);
          }}
          fill="#ffffff"
          stroke="#d0d0d0"
          strokeWidth={2}
        />

        {/* Photo clipped to circle */}
        <Group
          clipFunc={(ctx) => {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
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

        {/* Glossy acrylic overlay */}
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            const gradient = ctx.createLinearGradient(
              centerX - radius, centerY - radius,
              centerX + radius, centerY + radius
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
            ctx.fillStyle = gradient;
            ctx.fill();
          }}
          listening={false}
        />

        {/* Highlight shine */}
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            ctx.ellipse(
              centerX - radius * 0.3,
              centerY - radius * 0.3,
              radius * 0.4,
              radius * 0.6,
              -0.3,
              0,
              Math.PI * 2
            );
            const gradient = ctx.createRadialGradient(
              centerX - radius * 0.3, centerY - radius * 0.3, 0,
              centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.4
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();
          }}
          listening={false}
        />

        {/* Metal ring hole shadow */}
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            ctx.arc(centerX, centerY - radius + 15, 11, 0, Math.PI * 2);
            ctx.fillStrokeShape(shape);
          }}
          fill="rgba(0,0,0,0.2)"
          offsetY={-2}
        />

        {/* Metal ring hole base */}
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            ctx.arc(centerX, centerY - radius + 15, 10, 0, Math.PI * 2);
            ctx.fillStrokeShape(shape);
          }}
          fill="#c0c0c0"
          stroke="#909090"
          strokeWidth={1}
        />

        {/* Metal ring inner hole */}
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            ctx.arc(centerX, centerY - radius + 15, 6, 0, Math.PI * 2);
            ctx.fillStrokeShape(shape);
          }}
          fill="#505050"
          stroke="#707070"
          strokeWidth={0.5}
        />

        {/* Metal ring highlight */}
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            ctx.arc(centerX - 2, centerY - radius + 13, 3, 0, Math.PI * 2);
            ctx.fillStrokeShape(shape);
          }}
          fill="rgba(255, 255, 255, 0.6)"
        />
      </Group>
    );
  }

  // Heart keychain
  if (shapeId === 'heart') {
    const size = keychainSize;
    const scale = Math.max(size / photoImg.width, size / photoImg.height);
    const displayWidth = photoImg.width * scale;
    const displayHeight = photoImg.height * scale;
    const photoX = centerX - displayWidth / 2;
    const photoY = centerY - displayHeight / 2;
    const topHoleY = centerY - size / 2 + size * 0.05;

    return (
      <Group>
        {/* Metal chain */}
        {renderMetalChain(topHoleY)}

        {/* Bottom shadow */}
        <Shape
          sceneFunc={(ctx, shape) => {
            const width = size;
            const height = size;
            const topCurveHeight = height * 0.3;
            const offsetX = centerX - width / 2;
            const offsetY = centerY - height / 2;
            
            ctx.beginPath();
            ctx.moveTo(offsetX + width / 2, offsetY + height);
            ctx.bezierCurveTo(offsetX + width / 2, offsetY + height - height / 4, offsetX, offsetY + height * 0.75, offsetX, offsetY + topCurveHeight);
            ctx.bezierCurveTo(offsetX, offsetY, offsetX + width / 4, offsetY, offsetX + width / 2, offsetY + topCurveHeight);
            ctx.bezierCurveTo(offsetX + width * 0.75, offsetY, offsetX + width, offsetY, offsetX + width, offsetY + topCurveHeight);
            ctx.bezierCurveTo(offsetX + width, offsetY + height * 0.75, offsetX + width / 2, offsetY + height - height / 4, offsetX + width / 2, offsetY + height);
            ctx.closePath();
            ctx.fillStrokeShape(shape);
          }}
          fill="rgba(0,0,0,0.15)"
          offsetX={-3}
          offsetY={-6}
        />

        {/* Main heart base */}
        <Shape
          sceneFunc={(ctx, shape) => {
            const width = size;
            const height = size;
            const topCurveHeight = height * 0.3;
            const offsetX = centerX - width / 2;
            const offsetY = centerY - height / 2;
            
            ctx.beginPath();
            ctx.moveTo(offsetX + width / 2, offsetY + height);
            ctx.bezierCurveTo(offsetX + width / 2, offsetY + height - height / 4, offsetX, offsetY + height * 0.75, offsetX, offsetY + topCurveHeight);
            ctx.bezierCurveTo(offsetX, offsetY, offsetX + width / 4, offsetY, offsetX + width / 2, offsetY + topCurveHeight);
            ctx.bezierCurveTo(offsetX + width * 0.75, offsetY, offsetX + width, offsetY, offsetX + width, offsetY + topCurveHeight);
            ctx.bezierCurveTo(offsetX + width, offsetY + height * 0.75, offsetX + width / 2, offsetY + height - height / 4, offsetX + width / 2, offsetY + height);
            ctx.closePath();
            ctx.fillStrokeShape(shape);
          }}
          fill="#ffffff"
          stroke="#d0d0d0"
          strokeWidth={2}
        />

        {/* Photo layer */}
        <Group
          clipFunc={(ctx) => {
            const width = size;
            const height = size;
            const topCurveHeight = height * 0.3;
            const offsetX = centerX - width / 2;
            const offsetY = centerY - height / 2;
            
            ctx.beginPath();
            ctx.moveTo(offsetX + width / 2, offsetY + height);
            ctx.bezierCurveTo(offsetX + width / 2, offsetY + height - height / 4, offsetX, offsetY + height * 0.75, offsetX, offsetY + topCurveHeight);
            ctx.bezierCurveTo(offsetX, offsetY, offsetX + width / 4, offsetY, offsetX + width / 2, offsetY + topCurveHeight);
            ctx.bezierCurveTo(offsetX + width * 0.75, offsetY, offsetX + width, offsetY, offsetX + width, offsetY + topCurveHeight);
            ctx.bezierCurveTo(offsetX + width, offsetY + height * 0.75, offsetX + width / 2, offsetY + height - height / 4, offsetX + width / 2, offsetY + height);
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

        {/* Glossy overlay */}
        <Shape
          sceneFunc={(ctx, shape) => {
            const width = size;
            const height = size;
            const topCurveHeight = height * 0.3;
            const offsetX = centerX - width / 2;
            const offsetY = centerY - height / 2;
            
            ctx.beginPath();
            ctx.moveTo(offsetX + width / 2, offsetY + height);
            ctx.bezierCurveTo(offsetX + width / 2, offsetY + height - height / 4, offsetX, offsetY + height * 0.75, offsetX, offsetY + topCurveHeight);
            ctx.bezierCurveTo(offsetX, offsetY, offsetX + width / 4, offsetY, offsetX + width / 2, offsetY + topCurveHeight);
            ctx.bezierCurveTo(offsetX + width * 0.75, offsetY, offsetX + width, offsetY, offsetX + width, offsetY + topCurveHeight);
            ctx.bezierCurveTo(offsetX + width, offsetY + height * 0.75, offsetX + width / 2, offsetY + height - height / 4, offsetX + width / 2, offsetY + height);
            ctx.closePath();
            
            const gradient = ctx.createLinearGradient(offsetX, offsetY, offsetX + width, offsetY + height);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
            ctx.fillStyle = gradient;
            ctx.fill();
          }}
          listening={false}
        />

        {/* Shine highlight */}
        <Shape
          sceneFunc={(ctx, shape) => {
            const width = size * 0.3;
            const height = size * 0.6;
            
            ctx.beginPath();
            ctx.ellipse(centerX - size * 0.15, centerY - size * 0.15, width, height, -0.3, 0, Math.PI * 2);
            ctx.closePath();
            
            const gradient = ctx.createRadialGradient(centerX - size * 0.15, centerY - size * 0.15, 0, centerX - size * 0.15, centerY - size * 0.15, width);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();
          }}
          listening={false}
        />

        {/* Metal ring with effects */}
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            ctx.arc(centerX, centerY - size / 2 + size * 0.05, 11, 0, Math.PI * 2);
            ctx.fillStrokeShape(shape);
          }}
          fill="rgba(0,0,0,0.2)"
          offsetY={-2}
        />
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            ctx.arc(centerX, centerY - size / 2 + size * 0.05, 10, 0, Math.PI * 2);
            ctx.fillStrokeShape(shape);
          }}
          fill="#c0c0c0"
          stroke="#909090"
          strokeWidth={1}
        />
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            ctx.arc(centerX, centerY - size / 2 + size * 0.05, 6, 0, Math.PI * 2);
            ctx.fillStrokeShape(shape);
          }}
          fill="#505050"
          stroke="#707070"
          strokeWidth={0.5}
        />
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            ctx.arc(centerX - 2, centerY - size / 2 + size * 0.05 - 2, 3, 0, Math.PI * 2);
            ctx.fillStrokeShape(shape);
          }}
          fill="rgba(255, 255, 255, 0.6)"
        />
      </Group>
    );
  }

  // Square/Rounded Square keychains
  const isRounded = shapeId === 'rounded-square';
  const cornerRadius = isRounded ? 15 : 5;
  const width = keychainSize * 0.9;
  const height = keychainSize * 0.9;
  const x = centerX - width / 2;
  const y = centerY - height / 2;
  const topHoleY = y + 20;

  const scale = Math.max(width / photoImg.width, height / photoImg.height);
  const displayWidth = photoImg.width * scale;
  const displayHeight = photoImg.height * scale;
  const photoX = centerX - displayWidth / 2;
  const photoY = centerY - displayHeight / 2;

  return (
    <Group>
      {/* Metal chain */}
      {renderMetalChain(topHoleY)}

      {/* Shadow */}
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="rgba(0,0,0,0.15)"
        cornerRadius={cornerRadius}
        offsetX={-3}
        offsetY={-6}
      />

      {/* Base */}
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#ffffff"
        stroke="#d0d0d0"
        strokeWidth={2}
        cornerRadius={cornerRadius}
      />

      {/* Photo */}
      <Group
        clipFunc={(ctx) => {
          ctx.beginPath();
          ctx.roundRect(x, y, width, height, cornerRadius);
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

      {/* Glossy overlay */}
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: width, y: height }}
        fillLinearGradientColorStops={[
          0, 'rgba(255, 255, 255, 0.4)',
          0.5, 'rgba(255, 255, 255, 0.1)',
          1, 'rgba(255, 255, 255, 0.05)'
        ]}
        cornerRadius={cornerRadius}
        listening={false}
      />

      {/* Shine */}
      <Shape
        sceneFunc={(ctx, shape) => {
          ctx.beginPath();
          ctx.ellipse(x + width * 0.25, y + height * 0.25, width * 0.25, height * 0.4, -0.3, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            x + width * 0.25, y + height * 0.25, 0,
            x + width * 0.25, y + height * 0.25, width * 0.25
          );
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
          gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = gradient;
          ctx.fill();
        }}
        listening={false}
      />

      {/* Metal ring */}
      <Shape
        sceneFunc={(ctx, shape) => {
          ctx.beginPath();
          ctx.arc(centerX, y + 20, 11, 0, Math.PI * 2);
          ctx.fillStrokeShape(shape);
        }}
        fill="rgba(0,0,0,0.2)"
        offsetY={-2}
      />
      <Shape
        sceneFunc={(ctx, shape) => {
          ctx.beginPath();
          ctx.arc(centerX, y + 20, 10, 0, Math.PI * 2);
          ctx.fillStrokeShape(shape);
        }}
        fill="#c0c0c0"
        stroke="#909090"
        strokeWidth={1}
      />
      <Shape
        sceneFunc={(ctx, shape) => {
          ctx.beginPath();
          ctx.arc(centerX, y + 20, 6, 0, Math.PI * 2);
          ctx.fillStrokeShape(shape);
        }}
        fill="#505050"
        stroke="#707070"
        strokeWidth={0.5}
      />
      <Shape
        sceneFunc={(ctx, shape) => {
          ctx.beginPath();
          ctx.arc(centerX - 2, y + 18, 3, 0, Math.PI * 2);
          ctx.fillStrokeShape(shape);
        }}
        fill="rgba(255, 255, 255, 0.6)"
      />
    </Group>
  );
};

  // Render clock overlay (numbers and hands) - Using colors from designData
  const renderClockOverlay = (PREVIEW_WIDTH, PREVIEW_HEIGHT) => {
    const centerX = PREVIEW_WIDTH / 2;
    const centerY = PREVIEW_HEIGHT / 2;
    const radius = getShapeRadius(PREVIEW_WIDTH, PREVIEW_HEIGHT);

    const numbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const fontSize = radius * 0.18;

    // Use colors from designData if available
    const numberColor = designData?.clockNumberColor || "#2c3e50";
    const handColor = designData?.clockHandColor || "#2c3e50";
    const secondHandColor = designData?.clockSecondHandColor || "#e74c3c";

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
              fill={numberColor}
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
          const markerRadius = radius * 0.9;
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
              fill={numberColor}
              opacity={0.5}
            />
          );
        })}

        {/* Hour hand */}
        <Line
          points={[
            centerX,
            centerY,
            centerX + radius * 0.45 * Math.cos(((-90 + 60) * Math.PI) / 180),
            centerY + radius * 0.45 * Math.sin(((-90 + 60) * Math.PI) / 180),
          ]}
          stroke={handColor}
          strokeWidth={radius * 0.045}
          lineCap="round"
        />

        {/* Minute hand */}
        <Line
          points={[
            centerX,
            centerY,
            centerX + radius * 0.65 * Math.cos(((-90 + 180) * Math.PI) / 180),
            centerY + radius * 0.65 * Math.sin(((-90 + 180) * Math.PI) / 180),
          ]}
          stroke={handColor}
          strokeWidth={radius * 0.03}
          lineCap="round"
        />

        {/* Second hand */}
        <Line
          points={[
            centerX,
            centerY,
            centerX + radius * 0.7 * Math.cos(((-90 + 270) * Math.PI) / 180),
            centerY + radius * 0.7 * Math.sin(((-90 + 270) * Math.PI) / 180),
          ]}
          stroke={secondHandColor}
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
          fill={handColor}
        />
      </Group>
    );
  };

  // Render clock frame with photo and clock overlay
  const renderClockFrame = (PREVIEW_WIDTH, PREVIEW_HEIGHT) => {
    if (!photoImg) return null;

    const centerX = PREVIEW_WIDTH / 2;
    const centerY = PREVIEW_HEIGHT / 2;
    const shapeConfig =
      FRAME_SHAPES[designData?.frameShapeId] || FRAME_SHAPES["circle-clock"];

    // Circle Clock
    if (shapeConfig.isCircle) {
      const radius = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT) / 2;
      const photoRadius = radius * 0.95;

      const diameter = photoRadius * 2;
      const scale = Math.max(
        diameter / photoImg.width,
        diameter / photoImg.height
      );

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
          {renderClockOverlay(PREVIEW_WIDTH, PREVIEW_HEIGHT)}
        </Group>
      );
    }

    // Hexagon Clock
    if (shapeConfig.isHexagon) {
      const size = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT) * 0.9;
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
          {renderClockOverlay(PREVIEW_WIDTH, PREVIEW_HEIGHT)}
        </Group>
      );
    }

    // Octagon Clock
    if (shapeConfig.isOctagon) {
      const size = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT) * 0.9;
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
          {renderClockOverlay(PREVIEW_WIDTH, PREVIEW_HEIGHT)}
        </Group>
      );
    }

    // Diamond Clock
    if (shapeConfig.isDiamond) {
      const size = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT) * 0.8;

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
          {renderClockOverlay(PREVIEW_WIDTH, PREVIEW_HEIGHT)}
        </Group>
      );
    }

    // Leaf shape
    if (shapeConfig.isLeaf) {
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
              ctx.quadraticCurveTo(
                startX + width,
                startY + height / 3,
                startX + width,
                startY + height / 2
              );
              ctx.quadraticCurveTo(
                startX + width,
                startY + height * 0.7,
                startX + width / 2,
                startY + height
              );
              ctx.quadraticCurveTo(
                startX,
                startY + height * 0.7,
                startX,
                startY + height / 2
              );
              ctx.quadraticCurveTo(
                startX,
                startY + height / 3,
                startX + width / 2,
                startY
              );
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
          {renderClockOverlay(PREVIEW_WIDTH, PREVIEW_HEIGHT)}
        </Group>
      );
    }

    // Square and Rounded Square
    const width = PREVIEW_WIDTH * 0.9;
    const height = PREVIEW_HEIGHT * 0.9;
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
            const r = shapeConfig.cornerRadius || 0;

            ctx.beginPath();
            ctx.moveTo(offsetX + r, offsetY);
            ctx.lineTo(offsetX + width - r, offsetY);
            ctx.quadraticCurveTo(
              offsetX + width,
              offsetY,
              offsetX + width,
              offsetY + r
            );
            ctx.lineTo(offsetX + width, offsetY + height - r);
            ctx.quadraticCurveTo(
              offsetX + width,
              offsetY + height,
              offsetX + width - r,
              offsetY + height
            );
            ctx.lineTo(offsetX + r, offsetY + height);
            ctx.quadraticCurveTo(
              offsetX,
              offsetY + height,
              offsetX,
              offsetY + height - r
            );
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
        {renderClockOverlay(PREVIEW_WIDTH, PREVIEW_HEIGHT)}
      </Group>
    );
  };

  const renderCutoutFrame = (PREVIEW_WIDTH, PREVIEW_HEIGHT) => {
    if (!designData || !photoImg) return null;

    const frameThickness = 4 + (selectedThickness - 3) * 1.5;
    const frameColor = designData.frameColor || "#000000";
    const shapeId = designData.frameShapeId || "rounded-rect";
    const shapeConfig = FRAME_SHAPES[shapeId] || FRAME_SHAPES["rounded-rect"];

    const scale =
      Math.min(
        PREVIEW_WIDTH / photoImg.width,
        PREVIEW_HEIGHT / photoImg.height
      ) * 0.7;

    const scaledWidth = photoImg.width * scale;
    const scaledHeight = photoImg.height * scale;
    const offsetX = (PREVIEW_WIDTH - scaledWidth) / 2;
    const offsetY = (PREVIEW_HEIGHT - scaledHeight) / 2;

    const frameW = scaledWidth + frameThickness * 2;
    const frameH = scaledHeight + frameThickness * 2;
    const frameX = offsetX - frameThickness;
    const frameY = offsetY - frameThickness;
    const centerX = frameX + frameW / 2;
    const centerY = frameY + frameH / 2;

    const renderFrameShape = () => {
      if (shapeConfig.isCircle) {
        const radius = Math.max(frameW, frameH) / 2 - frameThickness / 2;
        return (
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
              ctx.strokeShape(shape);
            }}
            stroke={frameColor}
            strokeWidth={frameThickness}
            shadowColor="rgba(0,0,0,0.3)"
            shadowBlur={20}
            shadowOffsetY={8}
          />
        );
      }

      if (shapeConfig.isDiamond) {
        return (
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.moveTo(centerX, frameY + frameThickness / 2);
              ctx.lineTo(frameX + frameW - frameThickness / 2, centerY);
              ctx.lineTo(centerX, frameY + frameH - frameThickness / 2);
              ctx.lineTo(frameX + frameThickness / 2, centerY);
              ctx.closePath();
              ctx.strokeShape(shape);
            }}
            stroke={frameColor}
            strokeWidth={frameThickness}
            shadowColor="rgba(0,0,0,0.3)"
            shadowBlur={20}
            shadowOffsetY={8}
          />
        );
      }

      if (shapeConfig.isStar) {
        const outerRadius = Math.min(frameW, frameH) / 2 - frameThickness / 2;
        const innerRadius = outerRadius * 0.5;
        const points = 5;
        return (
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              for (let i = 0; i < points * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (i * Math.PI) / points - Math.PI / 2;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.closePath();
              ctx.strokeShape(shape);
            }}
            stroke={frameColor}
            strokeWidth={frameThickness}
            shadowColor="rgba(0,0,0,0.3)"
            shadowBlur={20}
            shadowOffsetY={8}
          />
        );
      }

      if (shapeConfig.isPolygon) {
        const sides = shapeConfig.sides;
        const polyRadius = Math.min(frameW, frameH) / 2 - frameThickness / 2;
        return (
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              for (let i = 0; i < sides; i++) {
                const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
                const x = centerX + Math.cos(angle) * polyRadius;
                const y = centerY + Math.sin(angle) * polyRadius;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.closePath();
              ctx.strokeShape(shape);
            }}
            stroke={frameColor}
            strokeWidth={frameThickness}
            shadowColor="rgba(0,0,0,0.3)"
            shadowBlur={20}
            shadowOffsetY={8}
          />
        );
      }

      if (shapeConfig.isHeart) {
        return (
          <Shape
            sceneFunc={(ctx, shape) => {
              const topCurveHeight = frameH * 0.3;
              const inset = frameThickness / 2;
              const hX = frameX + inset;
              const hY = frameY + inset;
              const hW = frameW - frameThickness;
              const hH = frameH - frameThickness;
              const hCenterX = hX + hW / 2;

              ctx.beginPath();
              ctx.moveTo(hCenterX, hY + hH * 0.3);

              ctx.bezierCurveTo(hCenterX, hY, hX, hY, hX, hY + topCurveHeight);
              ctx.bezierCurveTo(
                hX,
                hY + (hH + topCurveHeight) / 2,
                hCenterX,
                hY + (hH + topCurveHeight) / 1.5,
                hCenterX,
                hY + hH
              );

              ctx.bezierCurveTo(
                hCenterX,
                hY + (hH + topCurveHeight) / 1.5,
                hX + hW,
                hY + (hH + topCurveHeight) / 2,
                hX + hW,
                hY + topCurveHeight
              );
              ctx.bezierCurveTo(
                hX + hW,
                hY,
                hCenterX,
                hY,
                hCenterX,
                hY + hH * 0.3
              );

              ctx.closePath();
              ctx.strokeShape(shape);
            }}
            stroke={frameColor}
            strokeWidth={frameThickness}
            shadowColor="rgba(0,0,0,0.3)"
            shadowBlur={20}
            shadowOffsetY={8}
          />
        );
      }

      return (
        <Rect
          x={frameX + frameThickness / 2}
          y={frameY + frameThickness / 2}
          width={frameW - frameThickness}
          height={frameH - frameThickness}
          stroke={frameColor}
          strokeWidth={frameThickness}
          cornerRadius={shapeConfig.cornerRadius}
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={20}
          shadowOffsetY={8}
        />
      );
    };

    const getClipFunc = () => {
      if (shapeConfig.isCircle) {
        const radius = Math.max(frameW, frameH) / 2 - frameThickness / 2;
        return (ctx) => {
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.closePath();
        };
      }

      if (shapeConfig.isDiamond) {
        return (ctx) => {
          ctx.beginPath();
          ctx.moveTo(centerX, frameY + frameThickness / 2);
          ctx.lineTo(frameX + frameW - frameThickness / 2, centerY);
          ctx.lineTo(centerX, frameY + frameH - frameThickness / 2);
          ctx.lineTo(frameX + frameThickness / 2, centerY);
          ctx.closePath();
        };
      }

      if (shapeConfig.isStar) {
        const outerRadius = Math.min(frameW, frameH) / 2 - frameThickness / 2;
        const innerRadius = outerRadius * 0.5;
        const points = 5;
        return (ctx) => {
          ctx.beginPath();
          for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / points - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
        };
      }

      if (shapeConfig.isPolygon) {
        const sides = shapeConfig.sides;
        const polyRadius = Math.min(frameW, frameH) / 2 - frameThickness / 2;
        return (ctx) => {
          ctx.beginPath();
          for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
            const x = centerX + Math.cos(angle) * polyRadius;
            const y = centerY + Math.sin(angle) * polyRadius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
        };
      }

      if (shapeConfig.isHeart) {
        const heartWidth = frameW - frameThickness;
        const heartHeight = frameH - frameThickness;
        const hX = frameX + frameThickness / 2;
        const hY = frameY + frameThickness / 2;
        const hCenterX = hX + heartWidth / 2;
        return (ctx) => {
          const topCurveHeight = heartHeight * 0.3;
          ctx.beginPath();
          ctx.moveTo(hCenterX, hY + heartHeight * 0.3);

          ctx.bezierCurveTo(hCenterX, hY, hX, hY, hX, hY + topCurveHeight);
          ctx.bezierCurveTo(
            hX,
            hY + (heartHeight + topCurveHeight) / 2,
            hCenterX,
            hY + (heartHeight + topCurveHeight) / 1.5,
            hCenterX,
            hY + heartHeight
          );

          ctx.bezierCurveTo(
            hCenterX,
            hY + (heartHeight + topCurveHeight) / 1.5,
            hX + heartWidth,
            hY + (heartHeight + topCurveHeight) / 2,
            hX + heartWidth,
            hY + topCurveHeight
          );
          ctx.bezierCurveTo(
            hX + heartWidth,
            hY,
            hCenterX,
            hY,
            hCenterX,
            hY + heartHeight * 0.3
          );

          ctx.closePath();
        };
      }

      const cornerRadius = shapeConfig.cornerRadius;
      return (ctx) => {
        const x = frameX + frameThickness / 2;
        const y = frameY + frameThickness / 2;
        const w = frameW - frameThickness;
        const h = frameH - frameThickness;
        const r = Math.min(cornerRadius, w / 2, h / 2);

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
    };

    return (
      <Group>
        {renderFrameShape()}
        <Group clipFunc={getClipFunc()}>
          <KonvaImage
            image={photoImg}
            x={offsetX}
            y={offsetY}
            width={scaledWidth}
            height={scaledHeight}
          />
        </Group>
      </Group>
    );
  };

  const renderFrame = () => {
    if (!designData || !photoImg) return null;

    const PREVIEW_WIDTH = cmToPx(currentDimensions.widthCm);
    const PREVIEW_HEIGHT = cmToPx(currentDimensions.heightCm);

    // CLOCK RENDERING
    if (isAcrylicClock) {
      return renderClockFrame(PREVIEW_WIDTH, PREVIEW_HEIGHT);
    }

    if (isAcrylicCutout) {
      return renderCutoutFrame(PREVIEW_WIDTH, PREVIEW_HEIGHT);
    }

    if (isGallery) {
      const scale = Math.min(
        PREVIEW_WIDTH / photoImg.width,
        PREVIEW_HEIGHT / photoImg.height
      );

      const scaledWidth = photoImg.width * scale;
      const scaledHeight = photoImg.height * scale;
      const offsetX = (PREVIEW_WIDTH - scaledWidth) / 2;
      const offsetY = (PREVIEW_HEIGHT - scaledHeight) / 2;

      return (
        <KonvaImage
          image={photoImg}
          x={offsetX}
          y={offsetY}
          width={scaledWidth}
          height={scaledHeight}
        />
      );
    }

    const shapeConfig =
      FRAME_SHAPES[designData.frameShapeId] || FRAME_SHAPES["rounded-rect"];
    const framePx = 8 + (selectedThickness - 3) * 2;

    if (shapeConfig.isCircle) {
      const circleSize = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT);
      const offsetXCircle = (PREVIEW_WIDTH - circleSize) / 2;
      const offsetYCircle = (PREVIEW_HEIGHT - circleSize) / 2;
      const centerX = circleSize / 2;
      const centerY = circleSize / 2;

      const outerRadius = circleSize / 2;
      const matRadius = outerRadius - framePx;
      const dualBorderGap = shapeConfig.hasDualBorder
        ? shapeConfig.innerBorderGap
        : 0;
      const photoRadius = matRadius - dualBorderGap;

      const photoDiameter = photoRadius * 2;
      const scaleX = photoDiameter / photoImg.width;
      const scaleY = photoDiameter / photoImg.height;
      const imageScale = Math.max(scaleX, scaleY);

      const scaledWidth = photoImg.width * imageScale;
      const scaledHeight = photoImg.height * imageScale;
      const photoX = centerX - scaledWidth / 2;
      const photoY = centerY - scaledHeight / 2;

      return (
        <Group x={offsetXCircle} y={offsetYCircle}>
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
              ctx.fillStrokeShape(shape);
            }}
            fill={designData.frameColor}
            shadowColor="rgba(0,0,0,0.35)"
            shadowBlur={24}
            shadowOffsetY={10}
          />
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.arc(centerX, centerY, matRadius, 0, Math.PI * 2);
              ctx.fillStrokeShape(shape);
            }}
            fill={designData.matColor}
          />
          {shapeConfig.hasDualBorder && (
            <Shape
              sceneFunc={(ctx, shape) => {
                ctx.beginPath();
                ctx.arc(centerX, centerY, photoRadius, 0, Math.PI * 2);
                ctx.strokeShape(shape);
              }}
              stroke={designData.frameColor}
              strokeWidth={2}
            />
          )}
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
              width={scaledWidth}
              height={scaledHeight}
            />
          </Group>
        </Group>
      );
    }

    const innerWidth = PREVIEW_WIDTH - framePx * 2;
    const innerHeight = PREVIEW_HEIGHT - framePx * 2;
    const dualBorderGap = shapeConfig.hasDualBorder
      ? shapeConfig.innerBorderGap
      : 0;
    const matInnerWidth = innerWidth - dualBorderGap * 2;
    const matInnerHeight = innerHeight - dualBorderGap * 2;

    const photoAreaWidth = shapeConfig.hasDualBorder
      ? matInnerWidth
      : innerWidth;
    const photoAreaHeight = shapeConfig.hasDualBorder
      ? matInnerHeight
      : innerHeight;

    const scaleX = photoAreaWidth / photoImg.width;
    const scaleY = photoAreaHeight / photoImg.height;
    const imageScale = Math.max(scaleX, scaleY);

    const displayWidth = photoImg.width * imageScale;
    const displayHeight = photoImg.height * imageScale;
    const offsetX = (photoAreaWidth - displayWidth) / 2;
    const offsetY = (photoAreaHeight - displayHeight) / 2;

    return (
      <Group>
        <Rect
          x={0}
          y={0}
          width={PREVIEW_WIDTH}
          height={PREVIEW_HEIGHT}
          fill={designData.frameColor}
          cornerRadius={shapeConfig.cornerRadius}
          shadowColor="rgba(0,0,0,0.35)"
          shadowBlur={24}
          shadowOffsetY={10}
        />
        <Rect
          x={framePx}
          y={framePx}
          width={innerWidth}
          height={innerHeight}
          fill={designData.matColor}
          cornerRadius={Math.max(0, shapeConfig.cornerRadius - framePx / 2)}
        />
        {shapeConfig.hasDualBorder && (
          <Rect
            x={framePx + dualBorderGap}
            y={framePx + dualBorderGap}
            width={matInnerWidth}
            height={matInnerHeight}
            stroke={designData.frameColor}
            strokeWidth={2}
            cornerRadius={Math.max(
              0,
              shapeConfig.cornerRadius - framePx / 2 - dualBorderGap
            )}
          />
        )}
        <Group
          x={framePx + (shapeConfig.hasDualBorder ? dualBorderGap : 0)}
          y={framePx + (shapeConfig.hasDualBorder ? dualBorderGap : 0)}
          clipFunc={(ctx) => {
            const w = photoAreaWidth;
            const h = photoAreaHeight;
            const r = Math.max(
              0,
              shapeConfig.cornerRadius -
                framePx / 2 -
                (shapeConfig.hasDualBorder ? dualBorderGap : 0)
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
            x={offsetX}
            y={offsetY}
            width={displayWidth}
            height={displayHeight}
          />
        </Group>
      </Group>
    );
  };

  const currentPrice = PRICES[selectedSize.label]?.[selectedThickness] || 699;
  const originalPrice = Math.round(currentPrice * 1.8);
  const PREVIEW_WIDTH = cmToPx(currentDimensions.widthCm);
  const PREVIEW_HEIGHT = cmToPx(currentDimensions.heightCm);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your design...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            {isAcrylicKeychain
              ? "Acrylic Keychain"
              : isAcrylicClock
              ? "Acrylic Wall Clock"
              : isGallery
              ? "Mini Photo Gallery"
              : isAcrylicCutout
              ? "Acrylic Cutout Editor"
              : "Frame Editor"}
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Home /{" "}
            {isAcrylicKeychain
              ? "Acrylic Keychain"
              : isAcrylicClock
              ? "Acrylic Clock"
              : isGallery
              ? "Mini Photo Gallery"
              : isAcrylicCutout
              ? "Acrylic Cutout"
              : "Acrylic Wall Photo"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-center">
              <div className="relative">
                {isGallery ? (
                  // GALLERY LAYOUT
                  <div>
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-800">
                        📸 {designData?.photoCount || "Multi"} Photo Gallery
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Layout: {designData?.layoutName || "Custom Layout"}
                      </p>
                    </div>
                    <div
                      className="relative"
                      style={{
                        paddingTop: "40px",
                        paddingLeft: "70px",
                        paddingBottom: "20px",
                      }}
                    >
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-600">
                        {currentDimensions.widthInch} inches (
                        {currentDimensions.widthCm.toFixed(2)} cm)
                      </div>
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm font-medium text-gray-600">
                        {currentDimensions.heightInch} inches (
                        {currentDimensions.heightCm.toFixed(2)} cm)
                      </div>
                      <Stage width={PREVIEW_WIDTH} height={PREVIEW_HEIGHT}>
                        <Layer>
                          <Rect
                            x={0}
                            y={0}
                            width={PREVIEW_WIDTH}
                            height={PREVIEW_HEIGHT}
                            fill="#ffffff"
                          />
                          {renderFrame()}
                        </Layer>
                      </Stage>
                    </div>
                    <div className="mt-4 text-center text-sm font-medium text-gray-600">
                      Thickness: {selectedThickness}mm | LANDSCAPE
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-4">
                      ✨ Your photos will be printed on acrylic in the selected
                      layout
                    </p>
                  </div>
                ) : isAcrylicKeychain && mockupImg ? (
                  // KEYCHAIN WITH WOODEN BACKGROUND
                  <div
                    className="relative"
                    style={{ width: "800px", height: "600px" }}
                  >
                    <img
                      src={mockupImg.src}
                      alt="Keychain mockup"
                      className="w-full h-full object-cover rounded-lg"
                      style={{ filter: "brightness(0.95)" }}
                    />
                    <div
                      className="absolute"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white bg-black bg-opacity-70 px-3 py-1 rounded whitespace-nowrap">
                        Keychain Size: {currentDimensions.widthInch}" (
                        {currentDimensions.widthCm.toFixed(2)} cm)
                      </div>
                      <Stage width={PREVIEW_WIDTH} height={PREVIEW_HEIGHT}>
                        <Layer>{renderKeychainFrame()}</Layer>
                      </Stage>
                      <div className="mt-3 text-center">
                        <span className="text-xs font-medium text-white bg-black bg-opacity-70 px-3 py-1 rounded inline-block">
                          Acrylic Keychain | Shape:{" "}
                          {designData?.keychainShape?.toUpperCase() || "CIRCLE"}
                        </span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 text-xs text-gray-700 bg-white bg-opacity-90 px-3 py-1 rounded shadow">
                      🔑 Lightweight & Durable | Metal Keyring Included
                    </div>
                  </div>
                ) : mockupImg && !isAcrylicCutout ? (
                  // WALL MOCKUP (Regular frames, clocks)
                  <div
                    className="relative"
                    style={{ width: "800px", height: "600px" }}
                  >
                    <img
                      src={mockupImg.src}
                      alt="Room mockup"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div
                      className="absolute"
                      style={{
                        top: "18%",
                        left: "50%",
                        transform: "translate(-50%, 0)",
                      }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white bg-black bg-opacity-70 px-3 py-1 rounded whitespace-nowrap">
                        {currentDimensions.widthInch}" (
                        {currentDimensions.widthCm.toFixed(2)} cm)
                      </div>
                      <div className="absolute -left-20 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs font-medium text-white bg-black bg-opacity-70 px-3 py-1 rounded whitespace-nowrap">
                        {currentDimensions.heightInch}" (
                        {currentDimensions.heightCm.toFixed(2)} cm)
                      </div>
                      <Stage width={PREVIEW_WIDTH} height={PREVIEW_HEIGHT}>
                        <Layer>{renderFrame()}</Layer>
                      </Stage>
                      <div className="mt-3 text-center">
                        <span className="text-xs font-medium text-white bg-black bg-opacity-70 px-3 py-1 rounded inline-block">
                          {isAcrylicClock
                            ? `Clock Size: ${currentDimensions.widthInch}" | Wall Mount`
                            : `Thickness: ${selectedThickness}mm | ${orientation.toUpperCase()}`}
                        </span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 text-xs text-gray-600 bg-white bg-opacity-90 px-3 py-1 rounded">
                      Quick mount:{" "}
                      {isAcrylicClock
                        ? "Wall hook included"
                        : "OMGS Adhesive hooks (Included)"}
                    </div>
                  </div>
                ) : (
                  // FALLBACK - No mockup available
                  <div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-600">
                      {currentDimensions.widthInch} inches (
                      {currentDimensions.widthCm.toFixed(2)} cm)
                    </div>
                    <div className="absolute -left-20 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm font-medium text-gray-600">
                      {currentDimensions.heightInch} inches (
                      {currentDimensions.heightCm.toFixed(2)} cm)
                    </div>
                    <Stage width={PREVIEW_WIDTH} height={PREVIEW_HEIGHT}>
                      <Layer>
                        <Rect
                          x={0}
                          y={0}
                          width={PREVIEW_WIDTH}
                          height={PREVIEW_HEIGHT}
                          fill="#f9fafb"
                        />
                        {isAcrylicKeychain
                          ? renderKeychainFrame()
                          : renderFrame()}
                      </Layer>
                    </Stage>
                    <div className="mt-4 text-center text-sm font-medium text-gray-600">
                      {isAcrylicKeychain ? (
                        <span className="bg-orange-100 text-orange-800 px-5 py-2 rounded-full">
                          🔑 Acrylic Keychain | Shape:{" "}
                          {designData?.keychainShape?.toUpperCase() || "CIRCLE"}
                        </span>
                      ) : isAcrylicClock ? (
                        <span className="bg-blue-100 text-blue-800 px-5 py-2 rounded-full">
                          🕐 Wall Clock with Your Photo | Shape:{" "}
                          {designData?.frameShapeId
                            ?.replace("-clock", "")
                            .replace("-", " ")
                            .toUpperCase() || "CIRCLE"}
                        </span>
                      ) : isAcrylicCutout ? (
                        <span className="bg-green-100 text-green-800 px-5 py-2 rounded-full">
                          ✓ Background Removed | Frame:{" "}
                          {designData?.frameShapeId?.toUpperCase() || "CUSTOM"}
                        </span>
                      ) : (
                        <>
                          Thickness: {selectedThickness}mm |{" "}
                          {orientation.toUpperCase()}
                        </>
                      )}
                    </div>
                    <div className="mt-6 text-center text-sm text-gray-500">
                      <p>
                        Quick mount:{" "}
                        {isAcrylicKeychain
                          ? "Metal keyring included"
                          : isAcrylicClock
                          ? "Wall hook included"
                          : "OMGS Adhesive hooks (Included)"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:w-96 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{currentPrice}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  ₹{originalPrice}
                </span>
              </div>
              {selectedSize.label === "12x9" && selectedThickness === 3 && (
                <p className="text-sm text-red-600 font-medium mt-2">
                  Only 6 Acrylic's left!
                </p>
              )}
            </div>

            {!isAcrylicCutout && !isGallery && !isAcrylicClock && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Orientation:
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => setOrientation("landscape")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex-1 ${
                      orientation === "landscape"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Landscape
                  </button>
                  <button
                    onClick={() => setOrientation("portrait")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex-1 ${
                      orientation === "portrait"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Portrait
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isAcrylicClock
                  ? "Clock Size (Inch):"
                  : isGallery
                  ? "Gallery Size (Inch):"
                  : isAcrylicCutout
                  ? "Cutout Size (Inch):"
                  : "Acrylic Size (Inch):"}
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {SIZE_OPTIONS.map((size) => (
                  <button
                    key={size.label}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedSize.label === size.label
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Acrylic Thickness:
              </h3>
              <div className="flex gap-3">
                {THICKNESS_OPTIONS.map((thickness) => (
                  <button
                    key={thickness.value}
                    onClick={() => setSelectedThickness(thickness.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedThickness === thickness.value
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {thickness.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={saveToCart}
              disabled={!photoImg}
              className={`w-full font-semibold py-4 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 ${
                photoImg
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              ➕ Add to Cart & View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
