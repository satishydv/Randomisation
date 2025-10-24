import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Banner = () => {
  const bannerRef = useRef(null);
  const images = [
    "/newproject/Banner/Banner1.png",
    "/newproject/Banner/Banner-2.png",
    "/newproject/Banner/Banner_3.png",
    "/newproject/Banner/Banner_4.jpeg",
    "/newproject/Banner/Banner_6.png",
  ];

  useEffect(() => {
    const container = bannerRef.current;
    const slides = container.querySelectorAll(".banner-slide");

    gsap.set(slides, { xPercent: (i) => i * 100 });

    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "power2.inOut" } });

    slides.forEach(() => {
      tl.to(slides, {
        xPercent: "-=100",
        duration: 1,
        delay: 5,
      });
    });
  }, []);

  return (
    <div
      ref={bannerRef}
      className="relative p-6 overflow-hidden w-full aspect-[16/9] mt-28  rounded-lg" 
      // 🔹 `aspect-[16/9]` keeps natural image ratio (no fixed height)
    >
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Banner ${i + 1}`}
          className="banner-slide absolute top-0 left-0 w-full h-full object-cover"
          // 🔹 `object-cover` = image fills container without empty space
        />
      ))}
    </div>
  );
};

export default Banner;
