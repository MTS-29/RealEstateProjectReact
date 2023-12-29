import React from 'react'
import './Header.css'
const Header = () => {
  return (
    <section className="h-wrapper">
    <div className="flexCenter paddings innerWidth h-container">
      <img src="./logo.png" alt="logo" width={100}  />

      <div className="flexCenter h-menu">
        <a href="#residencies"> Residencies</a>
        <a href="#our-values">Our Values</a>
        <a href="#contact-us">Contact us</a>
        <a href="#get-started">Get Started</a>
        <button className="button">
        <a href="">Contact</a>
        </button>
        
      </div>
    </div>
  </section>
  );
}

export default Header;

// React router dom - 