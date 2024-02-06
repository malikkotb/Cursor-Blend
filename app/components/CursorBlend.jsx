"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function CursorBlend() {
  // Create a ref for the target div
  const textDivRef = useRef(null);
  const hoverScale = 10; // Scale factor when hovering
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

  // Convert isHovering to a motion value
  const isHoveringMotion = useMotionValue(isHovering ? 1 : 0);
  const cursorScale = useTransform(isHoveringMotion, [0, 1], [1, hoverScale]);

  //   const isHoveringMotion = useSpring(useMotionValue(isHovering ? 1 : 0), {
  //     stiffness: 100, // Lower stiffness for slower animation
  //     damping: 40, // Higher damping for smoother animation
  //     mass: 1, // Adjust mass for effect intensity
  //   });
  //   const cursorScale = useTransform(isHoveringMotion, [0, 1], [1, hoverScale]);

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

  return (
    <div>
      <motion.div
        animate={{ scale: isHovering ? hoverScale : 1 }}
        // transition={{ duration: 0.2, ease: "easeInOut" }}
        transition={{ type: "tween", ease: "backOut", duration:0.5}}

        style={{
          left: smoothMouse.x,
          top: smoothMouse.y,
          width: cursorSize,
          height: cursorSize, 
        }}
        className={`fixed z-50 bg-[#2C671A] rounded-full pointer-events-none`}
      ></motion.div>
      <div className="w-screen h-screen flex justify-center items-center">
        <div
          ref={textDivRef} // Assign the ref to this div
          className="mx-20 text-6xl font-medium text-left border-2 border-red-400 p-4"
        >
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error rerum
          mollitia rem repellendus dolorem deleniti molestiae similique delectus
          voluptates numquam eaque asperiores exercitationem laboriosam.
        </div>
      </div>
    </div>
  );
}
