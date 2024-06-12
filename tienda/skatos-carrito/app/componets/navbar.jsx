import React from 'react'
import '../css/navbar.css'

const navbar = () => {
  return (
    <section className='Titulo__Skatos'>
        <a className='titulo__principal'>SKATOS</a>
        <article>
          <a className='T__cate'> Tienda</a>
          <a href="" className='T__cate'>Hombre</a>
          <a href="" className='T__cate'>Mujer</a>
          <a href="" className='T__cate'>Accesorios</a>
          <a href="" className='T__cate'>Skate</a>
        </article>
      </section>
  )
}

export default navbar