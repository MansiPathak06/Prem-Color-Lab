import Hero2 from '@/components/section/Hero2';
import ProductsByCategory from '@/components/section/Products';
import React, { Fragment } from 'react'

const Acrylic_Wall_Clock = () => {
    return (
        <Fragment>
            <Hero2 
                title="Acrylic Wall Clock" 
                subtitle="Clear, modern timekeeping" 
                tagline="This acrylic wall clock blends modern design with vibrant clarity, featuring a glossy finish, precise movement, and durable construction to elevate any room's décor with style"
                productType="acrylic-clock" // Add this prop
                 video1="https://i.pinimg.com/736x/7b/2c/20/7b2c2069beee16585ba19050cdf8c7e7.jpg"
  video2="https://i.pinimg.com/736x/3b/63/4a/3b634ab6b84fea693a519e98aa4fb7c3.jpg"
  video3="https://i.pinimg.com/1200x/98/92/a3/9892a3ac9fc1a76f9d17abacc4e43e52.jpg"
  mediaType="image"
            />
            <ProductsByCategory category='Acrylic Wall Clock' Heading='Acrylic Wall Clock' />
        </Fragment>
    )
}

export default Acrylic_Wall_Clock;
