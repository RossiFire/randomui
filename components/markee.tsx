"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const MarkeeContext = React.createContext<boolean>(false);
const MarkeeContentContext = React.createContext<boolean>(false);

function Markee({ className, ...props}: React.ComponentProps<"div">) {
  return (
    <MarkeeContext.Provider value={true}>
      <div
        data-slot="markee"
        className={cn(
          "relative flex overflow-hidden max-w-fit",
          className
        )}
        role="region"
        aria-label="Marquee content"
        aria-live="polite"
        {...props}
      />
    </MarkeeContext.Provider>
  );
}
Markee.displayName = "Markee";

function MarkeeFade({
  className,
  position,
  ...props
}: React.ComponentProps<"div"> & { position: "left" | "right" }) {
  const isInMarkee = React.useContext(MarkeeContext);

  if (!isInMarkee) {
    console.error("MarkeeFade must be used inside a Markee component");
    return null;
  }

  return (
    <div
      aria-hidden="true"
      data-slot="markee-fade"
      className={cn(
        "absolute top-0 h-full w-12 z-10 pointer-events-none",
        position === "left"
          ? "left-0 bg-gradient-to-r from-background to-transparent"
          : "right-0 bg-gradient-to-l from-background to-transparent",
        className
      )}
      {...props}
    />
  );
}
MarkeeFade.displayName = "MarkeeFade";

function MarkeeSpacer({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="markee-spacer"
      className={cn("shrink-0 w-4", className)}
      aria-hidden="true"
      aria-label="Marquee spacer"
      {...props}
    />
  );
}
MarkeeSpacer.displayName = "MarkeeSpacer";

interface MarkeeContentProps extends React.ComponentProps<"ul"> {
  /**
   * Direction of the animation.
   * @default "left" (left to right)
   */
  direction?: "left" | "right";
  /**
   * Duration in seconds of the animation.
   * Higher values result in slower animation and vice versa.
   * @default 10
   */
  duration?: number;
  /**
   * Animation easing
   * @default "linear"
   */
  ease?: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out";
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean;
  /**
   * Whether the markee is paused or not
   * @default false
   */
  paused?: boolean;
}
function MarkeeContent({ 
  duration = 10, 
  ease = "linear", 
  direction = "left", 
  pauseOnHover = false, 
  paused = false,
  className, 
  ...props 
}: MarkeeContentProps) {
  const animationStyle = React.useMemo(
    () => ({
      animationDuration: `${duration}s`,
      animationTimingFunction: ease,
      animationDirection: direction === "left" ? ("normal" as const) : ("reverse" as const),
    }),
    [duration, ease, direction]
  );
  
  const isInMarkee = React.useContext(MarkeeContext);
  
  if (!isInMarkee) {
    console.error("MarkeeContent must be used inside a Markee component");
    return null;
  }

  return <MarkeeContentContext.Provider value={true}>
    <div 
      data-slot="markee-content-wrapper"
      style={{ ...animationStyle }}
      className={cn(
        "relative flex shrink-0 animate-markee-scroll [animation-iteration-count:infinite] motion-reduce:[animation-play-state:paused", 
        pauseOnHover && "hover:[animation-play-state:paused]",
        paused && "[animation-play-state:paused]",
        className
      )}
    >
      <ul
        data-slot="markee-content"
        className="flex shrink-0 justify-around min-w-full pl-0!"
        role="list"
        aria-label="Marquee content list"
        {...props}
      />
      
      <ul
        data-slot="markee-content-hidden"
        className="flex shrink-0 justify-around min-w-full absolute top-0 left-full pl-0!"
        {...props}
        aria-hidden="true"
      />
    </div>
  </MarkeeContentContext.Provider>;
}
MarkeeContent.displayName = "MarkeeContent";

function MarkeeItem({ ...props }: React.ComponentProps<"li">) {
  return <li 
  data-slot="markee-item"
  role="listitem" 
  aria-label="Marquee item"
  {...props} />;
}
MarkeeItem.displayName = "MarkeeItem";

export { Markee, MarkeeSpacer, MarkeeFade, MarkeeContent, MarkeeItem };
export type { MarkeeContentProps };