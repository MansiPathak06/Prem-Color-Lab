'use client';

import { useRouter } from 'next/navigation';
import React from 'react'
import HeadingDesign from '../ui/Headingdesign';

const Hero2 = (props) => {
  const router = useRouter();

  // Extract media sources from props (with defaults)
  const media = {
    video1: props.video1 || '/video2.mp4',
    video2: props.video2 || '/video3.mp4',
    video3: props.video3 || '/video4.mp4',
    mediaType: props.mediaType || 'video', // 'video' or 'image'
  };

  const handleGalleryNavigate = () => {
    router.push('/#Gallery')
  }

const handleAllCategoriesNavigate = () => {
  const productType = props.productType || 'default';
  
  if (productType === 'mini-gallery') {
    router.push('/gallery-editor');
  } else if (productType === 'clear-acrylic') {
    router.push('/clear-acrylic-editor');
  } else if (productType === 'acrylic-clock') {
    router.push('/editor?type=acrylic-clock');
  } else if (productType === 'acrylic-cutout') {
    router.push('/editor?type=acrylic-cutout');
  } else if (productType === 'acrylic-keychain') {
    router.push('/keychain-editor'); // ✅ Add this
  } else {
    router.push(`/editor?type=${productType}`);
  }
}


  return (
    <>
      <section className="relative bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden py-10">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 ">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Side - Text Content */}
            <div className="space-y-8 animate-fade-in-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-indigo-100 hover:shadow-md transition-shadow duration-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span className="text-sm font-medium text-slate-700">Premium Quality Prints</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-linear-to-r from-slate-900 via-indigo-900 to-slate-900 bg-clip-text text-transparent capitalize">
                  {props.title}
                </span>
                <br />
                <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-linear capitalize">
                  {props.subtitle}
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-xl capitalize">
                {props.tagline}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 flex-col">
                <button
                  className="group relative px-6 sm:px-8 cursor-pointer py-3 sm:py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
                  onClick={handleAllCategoriesNavigate}
                >
                  <span className="relative z-10 uppercase text-md">Starts Creating Your Own Custom Frame</span>
                  <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                <button
                  className="group px-6 sm:px-8 py-3  sm:py-4 cursor-pointer bg-white/80 backdrop-blur-sm text-slate-700 font-semibold rounded-full border-2 border-slate-200 hover:border-indigo-300 hover:bg-white transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                  onClick={handleGalleryNavigate}
                >
                  <span>View Gallery</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 sm:gap-8 pt-8 justify-center lg:justify-start">
                <div className="group cursor-pointer flex flex-col justify-center items-center">
                  <div className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    92%
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 mt-1">Optical Clarity</div>
                </div>

                <div className="group cursor-pointer flex flex-col justify-center items-center">
                  <div className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    17x
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 mt-1">Impact Resistant</div>
                </div>

                <div className="group cursor-pointer flex flex-col justify-center items-center">
                  <div className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    UV
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 mt-1">Protected</div>
                </div>
              </div>
            </div>

            {/* Right Side - Responsive Media Grid */}
            <div className="relative h-[500px] sm:h-[600px] lg:h-[650px] animate-fade-in-right">
              {/* Decorative sparkles */}
              <div className="absolute top-10 left-10 text-3xl sm:text-4xl text-yellow-400 animate-pulse animation-delay-1000 z-40">✦</div>
              <div className="absolute bottom-20 right-10 text-2xl sm:text-3xl text-purple-400 animate-pulse animation-delay-3000 z-40">✦</div>

              {/* Top badge */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 bg-linear-to-r from-emerald-500 to-teal-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg font-semibold text-xs sm:text-sm animate-bounce-slow">
                🎨 Premium Acrylic Prints
              </div>

              {/* Mobile Layout - 3 Media in Diagonal Zigzag Pattern */}
              <div className="md:hidden relative h-full flex items-center justify-center">
                {/* Media 1 - Top Left */}
                <div className="absolute top-12 left-8 w-32 h-40 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 border-4 border-white z-10 animate-float">
                  {media.mediaType === 'video' ? (
                    <video
                      width="128"
                      height="160"
                      loop
                      muted
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src={media.video1} type='video/mp4' />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={media.video1} alt="Product 1" className="w-full h-full object-cover" />
                  )}
                </div>

                {/* Media 2 - Center (Overlapping both) */}
                <div className="absolute top-28 left-1/2 -translate-x-1/2 w-40 h-52 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 border-4 border-white z-20 animate-float animation-delay-2000">
                  {media.mediaType === 'video' ? (
                    <video
                      width="160"
                      height="208"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src={media.video2} type='video/mp4' />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={media.video2} alt="Product 2" className="w-full h-full object-cover" />
                  )}
                </div>

                {/* Media 3 - Bottom Right */}
                <div className="absolute top-56 right-8 w-36 h-48 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 border-4 border-white z-30 animate-float animation-delay-4000">
                  {media.mediaType === 'video' ? (
                    <video
                      width="144"
                      height="192"
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src={media.video3} type='video/mp4' />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={media.video3} alt="Product 3" className="w-full h-full object-cover" />
                  )}
                </div>
              </div>

              {/* Tablet Layout - 3 Media in Triangle Pattern */}
              <div className="hidden md:flex lg:hidden relative h-full items-center justify-center">
                {/* Top Left Media */}
                <div className="absolute top-8 left-8 w-48 h-64 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 hover:-rotate-2 transition-all duration-500 border-4 border-white animate-float">
                  {media.mediaType === 'video' ? (
                    <video
                      width="192"
                      height="256"
                      loop
                      muted
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src={media.video1} type='video/mp4' />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={media.video1} alt="Product 1" className="w-full h-full object-cover" />
                  )}
                </div>

                {/* Center Media (Tablet Only) */}
                <div className="w-56 h-72 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 border-4 border-white z-10 animate-float animation-delay-2000">
                  {media.mediaType === 'video' ? (
                    <video
                      width="224"
                      height="288"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src={media.video2} type='video/mp4' />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={media.video2} alt="Product 2" className="w-full h-full object-cover" />
                  )}
                </div>

                {/* Bottom Right Media */}
                <div className="absolute bottom-8 right-8 w-44 h-56 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 hover:rotate-2 transition-all duration-500 border-4 border-white animate-float animation-delay-4000">
                  {media.mediaType === 'video' ? (
                    <video
                      width="176"
                      height="224"
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src={media.video3} type='video/mp4' />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={media.video3} alt="Product 3" className="w-full h-full object-cover" />
                  )}
                </div>
              </div>

              {/* Desktop Layout - 3 Media Scattered (Original) */}
              <div className="hidden lg:block relative h-full">
                {/* Media 1 - Top Right */}
                <div className="absolute top-16 right-8 w-48 h-64 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 hover:rotate-2 transition-all duration-500 border-4 border-white animate-float">
                  {media.mediaType === 'video' ? (
                    <video
                      width="192"
                      height="256"
                      loop
                      muted
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src={media.video1} type='video/mp4' />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={media.video1} alt="Product 1" className="w-full h-full object-cover" />
                  )}
                </div>

                {/* Media 2 - Middle Left */}
                <div className="absolute top-48 left-4 w-56 h-72 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 hover:-rotate-2 transition-all duration-500 border-4 border-white z-10 animate-float animation-delay-2000">
                  {media.mediaType === 'video' ? (
                    <video
                      width="224"
                      height="288"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src={media.video2} type='video/mp4' />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={media.video2} alt="Product 2" className="w-full h-full object-cover" />
                  )}
                </div>

                {/* Media 3 - Bottom Right */}
                <div className="absolute bottom-12 right-20 w-44 h-56 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 hover:rotate-3 transition-all duration-500 border-4 border-white animate-float animation-delay-4000">
                  {media.mediaType === 'video' ? (
                    <video
                      width="176"
                      height="224"
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src={media.video3} type='video/mp4' />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={media.video3} alt="Product 3" className="w-full h-full object-cover" />
                  )}
                </div>

                {/* Floating elements */}
                <div className="absolute top-1/3 right-0 w-16 h-16 bg-linear-to-br from-yellow-400 to-orange-400 rounded-2xl shadow-lg animate-float animation-delay-1000 opacity-80"></div>
                <div className="absolute bottom-1/3 left-0 w-12 h-12 bg-linear-to-br from-pink-400 to-purple-400 rounded-full shadow-lg animate-float animation-delay-3000 opacity-80"></div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes linear {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out;
        }

        .animate-linear {
          background-size: 200% auto;
          animation: linear 3s ease infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      </section>
      <HeadingDesign />
    </>
  )
}

export default Hero2;
