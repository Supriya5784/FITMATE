import React, { useEffect, useState } from "react";

const SplashScreen = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true); // start fade out
    }, 1000); // show splash for 1s

    return () => clearTimeout(timer);
  }, []);

  const handleAnimationEnd = () => {
    setVisible(false);
    if (onFinish) onFinish();
  };

  if (!visible) return null;

  return (
    <div
      style={{
        ...styles.container,
        animation: fadeOut ? "fadeOut 0.5s ease-in-out forwards" : "none",
      }}
      onAnimationEnd={handleAnimationEnd}
    >
      <style>
        {`
          @keyframes fadeOut {
            0% { opacity: 1; }
            100% { opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    width: "100%",
    backgroundImage: "url('/splash-bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
};

export default SplashScreen;
