import * as React from "react";
import { cn } from "@/lib/utils";

const MarkeeContext = React.createContext<boolean>(false);
const MarkeeContentContext = React.createContext<boolean>(false);


function Markee({ children, className,...props}: React.ComponentProps<"div">) {
  return (
    <MarkeeContext.Provider value={true}>
      <div
        data-slot="markee"
        className={cn(
          "relative flex overflow-hidden max-w-fit markee-container",
          className
        )}
        role="region"
        aria-label="Marquee content"
        aria-live="polite"
        {...props}
      >
      {children}
      </div>
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
   * Whether to reverse the animation
   * @default false
   */
  reverse?: boolean;
  /**
   * Duration in seconds
   * @default 10
   */
  duration?: number;
  /**
   * Animation timing function
   * @default "linear"
   */
  ease?: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out";
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean;
}
function MarkeeContent({ 
  duration = 10, 
  ease = "linear", 
  reverse = false, 
  pauseOnHover = false, 
  className, 
  ...props 
}: MarkeeContentProps) {
  const animationStyle = React.useMemo(
    () => ({
      animationDuration: `${duration}s`,
      animationTimingFunction: ease,
      animationDirection: reverse ? ("reverse" as const) : ("normal" as const),
    }),
    [duration, ease, reverse]
  );
  
  const isInMarkee = React.useContext(MarkeeContext);
  
  if (!isInMarkee) {
    console.error("MarkeeContent must be used inside a Markee component");
    return null;
  }

  return <MarkeeContentContext.Provider value={true}>
    <ul
      data-slot="markee-content"
      style={{ ...animationStyle }}
      className={cn(
        "flex shrink-0 justify-around min-w-full animate-markee-scroll [animation-iteration-count:infinite] motion-reduce:[animation-play-state:paused]", 
        pauseOnHover && "[&:hover]:[animation-play-state:paused] peer [&:has(+[data-slot='markee-content-hidden']:hover)]:[animation-play-state:paused]",
        className
      )}
      role="list"
      aria-label="Marquee content list"
      {...props}
    />
    
    <ul
      data-slot="markee-content-hidden"
      style={{ ...animationStyle }}
      className={cn(
        "flex shrink-0 justify-around min-w-full absolute top-0 left-0 animate-markee-scroll-hidden [animation-iteration-count:infinite] motion-reduce:[animation-play-state:paused]", 
        pauseOnHover && "[&:hover]:[animation-play-state:paused] peer-hover:[animation-play-state:paused]", 
        className
      )}
      {...props}
      aria-hidden="true"
    />
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