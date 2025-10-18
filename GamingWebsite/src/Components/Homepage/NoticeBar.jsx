import React, { useEffect, useRef, useMemo } from "react";
import { RiMegaphoneLine } from "react-icons/ri"; // Using the same icon
import { gsap } from "gsap";

/**
 * A horizontal scrolling marquee-style notice bar, inspired by the BDG Game UI.
 * @param {object} props - The component props.
 * @param {string[]} [props.notices] - Array of notice strings. They will be joined into one line.
 * @param {number} [props.speed=100] - Scroll speed in pixels per second. Slower is a higher number.
 */
const HorizontalNoticeBar = ({
  notices = ["Please Fill In The Correct Bank Card Information. The Platform Will Process Withdrawals Within 1-24 Hours Or More. The Withdrawal Status Is Completed And The Transaction Has Been Approved By The Platform. The Bank Will Complete The Transfer Within 1-7 Working Days, But Delays May Occur, Especially During Holidays. But You Are Guaranteed To Receive Your Funds."],
  speed = 70, // Lower value = faster scroll
}) => {
  const scrollerRef = useRef(null);
  const textRef = useRef(null);

  // 1. Join all notices into a single string for a continuous scroll.
  const fullText = useMemo(() => {
    // Adding a separator for better readability between notices
    return notices.join("      •      ") + "      •      ";
  }, [notices]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const text = textRef.current;
    if (!scroller || !text) return;

    // We need to wait a tick for the DOM to update and get the correct width
    const animation = gsap.to(scroller, {
      x: () => `-${text.offsetWidth}`, // Animate to the left by the width of one text block
      duration: () => text.offsetWidth / speed, // Duration depends on text width and speed
      ease: "none",
      repeat: -1,
    });
    
    // Cleanup function to kill animation on unmount
    return () => {
      animation.kill();
    };
  }, [fullText, speed]);

  return (
    <div className="flex items-center bg-[#2c2c2e] text-white rounded-lg overflow-hidden shadow-lg w-full px-3 py-7 gap-3">
      {/* Icon (Megaphone) */}
      <div className="flex-shrink-0">
<i className="ri-volume-up-fill text-2xl text-[#dbb768]"></i>      </div>

      {/* Scrolling Text Container (The "Mask") */}
      <div className="flex-1 overflow-hidden whitespace-nowrap">
        <div ref={scrollerRef} className="flex">
          {/* We render the text twice side-by-side to create the seamless loop */}
          <span ref={textRef} className="text-gray-300 text-sm font-medium px-2">
            {fullText}
          </span>
          <span className="text-gray-300 text-sm font-medium px-2">
            {fullText}
          </span>
        </div>
      </div>

      {/* Detail Button */}
      <button className="flex-shrink-0 text-sm bg-gradient-to-br from-[#f2dd9b] to-[#dbb768] hover:brightness-110 text-black px-5 py-1 rounded  transition-all shadow-md font-semibold">
       <i class="ri-fire-fill"></i> Detail
      </button>
    </div>
  );
};

export default HorizontalNoticeBar;