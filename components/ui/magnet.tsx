"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagnetProps {
  children: React.ReactNode;
  className?: string;
  /**
   * To programmatically activate/deactivate the magnetic effect
   */
  isActive?: boolean;

  /**
   * Default is 1. It multiplies the force of the magnetic effect.
   */
  magnetMultiplier?: number;
}

const Magnet: React.FC<MagnetProps> = ({
  children,
  className,
  isActive = true,
  magnetMultiplier = 1,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });

  const mouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive || !ref.current) return;
    const { clientX, clientY } = e;

    const { width, height, left, top} = ref.current.getBoundingClientRect();
    const x =
      (clientX - (left + width / 2)) *
      (magnetMultiplier < 0 ? 1 : (magnetMultiplier < 0 ? 1 : magnetMultiplier));
    const y =
      (clientY - (top + height / 2)) *
      (magnetMultiplier < 0 ? 1 : (magnetMultiplier < 0 ? 1 : magnetMultiplier));
    setPosition({ x, y });
  };

  const mouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const x = useSpring(position.x, { stiffness: 400, damping: 60, mass: 0.2 });
  const y = useSpring(position.y, { stiffness: 400, damping: 60, mass: 0.2 });

  useEffect(() => {
    x.set(position.x);
    y.set(position.y);
  }, [position]);

  useEffect(() => {
    if (!isActive) {
      setPosition({ x: 0, y: 0 });
    }
  }, [isActive]);

  return (
    <motion.div
      className={cn("relative", className)}
      ref={ref}
      whileHover={isActive ? { scale: 1.1 } : {}}
      transition={{ type: "spring", stiffness: 300 }}
      onMouseMove={mouseMove}
      onMouseLeave={mouseLeave}
      style={{ x, y }}
    >
      {children}
    </motion.div>
  );
};

export default Magnet;