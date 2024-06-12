import React from 'react'
import "../css/home.css"
import Carousel from './inicio/carousel.js'
import Navbar from './navbar.jsx'
const home = () => {
  return (
    <div className='container__home'>
      <Navbar/>
      
      <Carousel/>
      
    
    </div>
  )
}

export default home