import React, { useState, useEffect } from "react";
import LandingPage1 from "../assets/images/baner6.webp"
import LandingPage2 from "../assets/images/baner1.jpg"
import LandingPage3 from "../assets/images/baner2.jpg"
import LandingPage4 from "../assets/images/baner3.jpeg"
import "../styles/LandingPage.css";

const images = [LandingPage1,LandingPage2,LandingPage3,LandingPage4];

const LandingPage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 2000);
      return () => clearInterval(interval);
    }, []);
  
    return (
      <div className="slider-container">
        <div className="slider" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {images.map((img, index) => (
            <img key={index} src={img} alt={`Slide ${index + 1}`} className="slide" />
          ))}
        </div>
        <div className="radio-buttons">
          {images.map((_, index) => (
            <input
              key={index}
              type="radio"
              checked={currentIndex === index}
              readOnly
            />
          ))}
        </div>
      </div>
    );
  };
  
  export default LandingPage;
  