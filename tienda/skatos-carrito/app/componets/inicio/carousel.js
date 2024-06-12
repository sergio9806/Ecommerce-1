import React from 'react';
import "@/app/css/carousel.css";
import {Dos}from "@/public/images/banner1.jpg"
const Carousel = () => {
  return (
    <div className='container__carousel'>
      <img className='imagen1' src={Dos} alt='Banner 1' />
    </div>
  );
};

export default Carousel;