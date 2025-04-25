// import React from "react";
import React, { useState, useEffect } from "react";
import "../styles/scrollingTextComponent.css";
// import { FaVolumeUp } from 'react-icons';
import { FaVolumeUp} from 'react-icons/fa';
const messages = [
  " ⚡ Fast payments, easy tasks, unlimited earnings – Join now!✅ 🚀💵",
  "🎯 Your daily earnings start here – Simple tasks, real rewards! 💵✨",
  "📅 New tasks available every day – Don’t miss out on extra earnings!💰✅",
];


const ScrollingTextComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 12000); // हर 3 सेकंड में नया टेक्स्ट आएगा

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="scrolling-container">
      <div className="scrolling-text">
        {messages[currentIndex]}
      </div>
      <div className="volume">
        < FaVolumeUp  className="v-up"/>
      </div>
    </div>
  );
};

export default ScrollingTextComponent;
