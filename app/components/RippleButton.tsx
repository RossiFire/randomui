"use client";
import { useGSAP } from "@gsap/react";
import { FunctionComponent, useRef, useState } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ComponentProps<"button"> {
    rippleClassName?: string;
}

const RippleButton: FunctionComponent<ButtonProps> = ({
  className,
  children,
  rippleClassName,
  ...props
}) => {
  const rippleRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });


  useGSAP(() => {
    if (!rippleRef.current) return;

    const tl = gsap.timeline();

    // Multiply mouse position to improve ripple out effect
    const calculatedMousePosition = {
      x: mousePosition.x * (isHovered ? 1 : 1.2),
      y: mousePosition.y * (isHovered ? 1 : 1.2),
    };

    // Reset mouse entry point within the button
    tl.to(rippleRef.current, {
      x: mousePosition.x,
      y: mousePosition.y,
      duration: 0,
    })
    .to(rippleRef.current, {
      scale: isHovered ? 2 : 0,
      x: calculatedMousePosition.x,
      y: calculatedMousePosition.y,
      duration: 0.4,
      ease: isHovered ? "power1.out" : "expo.out",
    });
    
  }, [isHovered, mousePosition]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offset = (rippleRef.current?.offsetWidth || 2) / 2;
    const x = e.clientX - rect.left - offset;
    const y = e.clientY - rect.top - offset;
    setMousePosition({ x, y });
  };


  return (
    <button
      {...props}
      className={cn(
        "px-4 py-1.5 group font-medium border border-white cursor-pointer rounded-lg relative overflow-hidden active:scale-95 transition-transform duration-150",
        className
      )}
      onMouseEnter={(e) => {
        setIsHovered(true);
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        props.onMouseLeave?.(e);
      }}
      onMouseMove={(e) => {
        handleMouseMove(e);
        props.onMouseMove?.(e);
      }}
    >
      <div
        ref={rippleRef}
        className={cn("absolute pointer-events-none bg-fd-foreground rounded-full scale-0 top-0 left-0 size-28", rippleClassName)}
      />
      <span className="relative z-10 text-fd-primary  group-hover:text-fd-primary-foreground transition-colors duration-300">
        {children}
      </span>
    </button>
  );
};

export default RippleButton;