'use client';
import Hero2 from '@/components/section/Hero2';
import ProductsByCategory from '@/components/section/Products';
import React, { Fragment } from 'react'

const Acrylin_Cutout = () => {
    return (
        <Fragment>
            <Hero2 
                title="Acrylic Cutout" 
                subtitle="Sharp, glossy precision" 
                tagline="This acrylic cutout delivers vibrant clarity, smooth edges, and a premium glossy finish, creating a bold, modern display that highlights any photo with impressive detail, durability, and style"
                // Pass a prop to identify this is acrylic cutout
                productType="acrylic-cutout"
                video1="https://i.pinimg.com/1200x/19/16/a8/1916a8946ffda595e6b50d4776e39196.jpg"
  video2="https://i.pinimg.com/1200x/69/3f/b5/693fb542500fac4453a84351c155ed88.jpg"
  video3="https://i.pinimg.com/1200x/37/c6/1b/37c61b24fa7783e313ffc37809dbd708.jpg"
  mediaType="image"
            />
            <ProductsByCategory category='Acrylic Cutout' Heading='Acrylic Cutout' />
        </Fragment>
    )
}

export default Acrylin_Cutout;
