"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function CursorBlend() {
  // Create a ref for the target div
  const textDivRef = useRef(null);
  const hoverScale = 12; // Scale factor when hovering
  const [isHovering, setIsHovering] = useState(false); // hover state

  const cursorSize = 30;
  const mouse = {
    x: useMotionValue(0),
    y: useMotionValue(0),
  };

  const smoothOptions = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothMouse = {
    x: useSpring(mouse.x, smoothOptions),
    y: useSpring(mouse.y, smoothOptions),
  };

  // Use useTransform to interpolate scale value based on hover state
  const isHoveringMotion = useMotionValue(isHovering ? 1 : 0);
  const cursorScale = useTransform(isHoveringMotion, [0, 1], [1, hoverScale]);

  const manageMouseMove = (e) => {
    const { clientX, clientY } = e;
    mouse.x.set(clientX - cursorSize / 2);
    mouse.y.set(clientY - cursorSize / 2);

    // Check if the cursor is over the target div
    if (textDivRef.current) {
      const { left, top, right, bottom } =
        textDivRef.current.getBoundingClientRect();
      if (
        clientX > left &&
        clientX < right &&
        clientY > top &&
        clientY < bottom
      ) {
        setIsHovering(true); // Update hover state
        isHoveringMotion.set(true); // Update motion value based on hover state
      } else {
        setIsHovering(false);
        isHoveringMotion.set(false); // Update motion value based on hover state
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", manageMouseMove);
    return () => {
      window.removeEventListener("mousemove", manageMouseMove);
    };
  }, [mouse]);

  const text = "Hiding bad shit from people since 2021.";
  const words = text.split(" ");

  //   const text = "Hiding bad shit from people since 2021.";
  const wordsAndSpaces = text.split(/(\s+)/);

  return (
    <div>
      <motion.div
        animate={{ scale: isHovering ? hoverScale : 1 }}
        // transition={{ duration: 0.2, ease: "easeInOut" }}
        transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
        style={{
          left: smoothMouse.x,
          top: smoothMouse.y,
          width: cursorSize,
          height: cursorSize,
        }}
        className={`fixed z-40 bg-[#c0243b] rounded-full pointer-events-none`}
      ></motion.div>
      <div className="w-screen bg-black h-screen flex justify-center items-center">
        <div
          ref={textDivRef} // Assign the ref to this div
          className="mx-28 text-6xl font-medium text-left leading-tight tracking-wider text-[#b5ab9a] p-4"
        >
          I'm an independent creative web developer.
        </div>

        <div
          className="mx-28 absolute z-50 opacity-0 hover:opacity-100 font-medium text-left leading-tight tracking-wider p-4"
          id="text-to-be-revealed"
          style={{
            // display: "inline-flex",
            // flexWrap: "wrap",
            alignItems: "baseline",
          }}
        >
          {wordsAndSpaces.map((word, wordIndex) => (
              <span key={wordIndex}>
                {word.split("").map((char, charIndex) => (
                  <span
                    className="text-6xl leading-tight tracking-wider"
                    key={charIndex}
                  >
                    {char}
                  </span>
                ))}
                {"\u00A0"}
              </span>
          ))}
        </div>

        {/* 
        <div
          className="mx-28 text-6xl absolute z-50 opacity-0 hover:opacity-100 font-medium text-left leading-tight tracking-wider p-4"
          id="text-to-be-revealed"
        >
          Hiding bad shit from people sind 2021.
        </div> */}
      </div>
    </div>
  );
}
