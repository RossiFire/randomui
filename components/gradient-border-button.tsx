"use client";
import { FunctionComponent } from "react";
import { cn } from "@/lib/utils";
import { interFont } from "@/lib/fonts";

interface GradientBorderButtonProps extends React.ComponentProps<"button"> {
  gradientClassName?: string;
  innerClassName?: string;
}

const GradientBorderButton: FunctionComponent<GradientBorderButtonProps> = ({
  className,
  children,
  gradientClassName,
  innerClassName,
  ...props
}) => {
  return (
    <button
      {...props}
      className={cn(
        "relative px-4 py-1.5 text-sm md:text-base font-medium rounded-lg overflow-hidden group active:scale-95 transition-transform duration-150",
        className,
        interFont
      )}
    >
      {/* Animated gradient border */}
      <div
        className={cn(
          "absolute w-[120%] aspect-square abs-center animate-spin-slow",
          gradientClassName
        )}
        style={{
          background: "conic-gradient(from 0deg, var(--color-fd-primary), var(--color-fd-accent), var(--color-fd-primary))",
          willChange: "transform",
        }}
      />
      
      {/* Inner background */}
      <div
        className={cn(
          "absolute inset-[2px] rounded-[6px] bg-fd-background",
          innerClassName
        )}
      />
      
      {/* Content */}
      <span className="relative z-10 text-fd-foreground transition-colors duration-300">
        {children}
      </span>
    </button>
  );
};

export default GradientBorderButton;

