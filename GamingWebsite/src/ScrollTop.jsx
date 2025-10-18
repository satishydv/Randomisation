import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollableDiv = document.getElementById('scroll');
    if (scrollableDiv) {
      scrollableDiv.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [pathname]);

  return null;
};

export default ScrollTop;
