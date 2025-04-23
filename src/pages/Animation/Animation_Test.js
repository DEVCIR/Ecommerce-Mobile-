import React, { useEffect, useState } from "react";
import { runConfetti } from "./Animation";

const Animation_Test = () => {
  const [showText, setShowText] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setShowText(true);
    runConfetti();

    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2000); 

    const hideTimer = setTimeout(() => {
      setShowText(false);
      setFadeOut(false); 
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      {showText && (
        <div
          className={`w-40 h-40 flex items-center justify-center bg-green-600 text-white text-center text-lg font-bold rounded-full z-[99999] transition-all duration-1000 ${
            fadeOut ? "opacity-0 scale-50" : "opacity-100 scale-100"
          }`}
        >
       <p className="text-2xl leading-normal tracking-normal">Target  Achieved</p>
        </div>
      )}
    </div>
  );
};

export default Animation_Test;
















