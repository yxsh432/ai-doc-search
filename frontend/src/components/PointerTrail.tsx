"use client";

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

export const PointerTrail: React.FC = () => {
  const [points, setPoints] = useState<TrailPoint[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPointerVisible, setIsPointerVisible] = useState(false);

  useEffect(() => {
    let id = 0;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsPointerVisible(true);

      const newPoint = { x: e.clientX, y: e.clientY, id: id++ };
      setPoints(prev => [...prev.slice(-20), newPoint]);
    };

    const handleMouseLeave = () => setIsPointerVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {isPointerVisible && (
        <>
          {/* Inner Dot */}
          <motion.div
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              x: mousePos.x - 3,
              y: mousePos.y - 3,
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: '#00f2fe',
              boxShadow: '0 0 10px #00f2fe',
            }}
          />

          {/* Outer Ring with Spring Physics */}
          <motion.div
            animate={{
              x: mousePos.x - 12,
              y: mousePos.y - 12,
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 200,
              mass: 0.5
            }}
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              width: 24,
              height: 24,
              borderRadius: '50%',
              border: '1.5px solid rgba(0, 242, 254, 0.6)',
              boxShadow: '0 0 15px rgba(0, 242, 254, 0.2)',
            }}
          />
        </>
      )}

      {/* Subtle background glow to maintain depth */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>
    </div>
  );
};
