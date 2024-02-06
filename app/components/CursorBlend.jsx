"use client";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorBlend() {
  // Create a ref for the target div
  const textDivRef = useRef(null);

  const cursorSize = 15;
  const mouse = {
    x: useMotionValue(0),
    y: useMotionValue(0),
  };

  const smoothOptions = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothMouse = {
    x: useSpring(mouse.x, smoothOptions),
    y: useSpring(mouse.y, smoothOptions),
  };

  const manageMouseMove = (e) => {
    const { clientX, clientY } = e;
    mouse.x.set(clientX - cursorSize / 2);
    mouse.y.set(clientY - cursorSize / 2);

    // Check if the cursor is over the target div
    if (textDivRef.current) {
        const { left, top, right, bottom } = textDivRef.current.getBoundingClientRect();
        if (clientX > left && clientX < right && clientY > top && clientY < bottom) {
          console.log("Cursor is over the text div!");
        }
      }

  };

  useEffect(() => {
    window.addEventListener("mousemove", manageMouseMove);
    return () => {
      window.removeEventListener("mousemove", manageMouseMove);
    };
  }, []);

  return (
    <div>
      <motion.div
        style={{
          left: smoothMouse.x,
          top: smoothMouse.y,
        }}
        className="fixed w-5 h-5 z-50 bg-[#2C671A] rounded-full pointer-events-none"
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
