import Hero2 from '@/components/section/Hero2';
import ProductsByCategory from '@/components/section/Products';
import React from 'react'

const page = () => {
  return (
    <>
      <Hero2 
        title="Clear Acrylic Photo" 
        subtitle="Modern clarity, vivid depth" 
        tagline='Showcase moments on ultra-clear acrylic with rich color, sharp detail, and a sleek glossy finish for homes, and gifts'
        productType="clear-acrylic" // Add this
         video1="https://i.pinimg.com/1200x/19/16/a8/1916a8946ffda595e6b50d4776e39196.jpg"
  video2="https://i.pinimg.com/1200x/69/3f/b5/693fb542500fac4453a84351c155ed88.jpg"
  video3="https://i.pinimg.com/1200x/37/c6/1b/37c61b24fa7783e313ffc37809dbd708.jpg"
  mediaType="image"
       
      />
      <ProductsByCategory category='Clear Acrylic Photo' Heading='Clear Acrylic Photo' />
    </>
  )
} 

export default page;
