import * as React from "react";
import { cn } from "@/lib/utils";

const MarkeeContext = React.createContext<boolean>(false);
const MarkeeContentContext = React.createContext<boolean>(false);


function Markee({ children, className,...props}: React.ComponentProps<"div">) {
  return (
    <MarkeeContext.Provider value={true}>
      <div
        className={cn(
          "relative flex overflow-hidden max-w-fit marquee-container",
          className
        )}
        role="region"
        aria-label="Marquee content"
        aria-live="polite"
        {...props}
      >
      {children}
        <style jsx>{`
          .pause-on-hover:hover .marquee-list {
            animation-play-state: paused;
          }

          @media (prefers-reduced-motion: reduce) {
            .marquee-list {
              animation-play-state: paused !important;
            }
          }

          @keyframes marquee-scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-100%);
            }
          }

          @keyframes marquee-scroll-infinite {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    </MarkeeContext.Provider>
  );
}
Markee.displayName = "Markee";

function MarkeeSpacer({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("shrink-0 w-4", className)}
      aria-hidden="true"
      aria-label="Marquee spacer"
      {...props}
    />
  );
}
MarkeeSpacer.displayName = "MarqueeSpacer";

function MarkeeItem({ ...props }: React.ComponentProps<"li">) {
  return <li role="listitem" {...props} />;
}
MarkeeItem.displayName = "MarkeeItem";

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
function MarkeeContent({ duration = 10, ease = "linear", reverse = false, pauseOnHover = false, ...props }: MarkeeContentProps) {
  const isInMarkee = React.useContext(MarkeeContext);

  if (!isInMarkee) {
    console.error("MarkeeContent must be used inside a Markee component");
    return null;
  }

  const animationStyle = React.useMemo(
    () => ({
      animationDuration: `${duration}s`,
      animationTimingFunction: ease,
      animationIterationCount: "infinite" as const,
      animationDirection: reverse ? ("reverse" as const) : ("normal" as const),
    }),
    [duration, ease, reverse]
  );


  return <MarkeeContentContext.Provider value={true}>
    <ul
      style={{ ...animationStyle, animationName: "marquee-scroll" }}
      className="flex list-none shrink-0 justify-around min-w-full marquee-list"
      role="list"
      aria-label="Marquee content list"
      {...props}
    />
    
    <ul
      style={{ ...animationStyle, animationName: "marquee-scroll-infinite" }}
      className="flex list-none shrink-0 justify-around min-w-full absolute top-0 left-0 marquee-list"
      {...props}
      aria-hidden="true"
    />
  </MarkeeContentContext.Provider>;
}
MarkeeContent.displayName = "MarkeeContent";

function MarkeeFade({
  className,
  direction,
  ...props
}: React.ComponentProps<"div"> & { direction: "left" | "right" }) {
  const isInMarkee = React.useContext(MarkeeContext);

  if (!isInMarkee) {
    console.error("MarkeeFade must be used inside a Markee component");
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute top-0 h-full w-12 z-10 pointer-events-none",
        direction === "left"
          ? "left-0 bg-gradient-to-r from-fd-background to-transparent"
          : "right-0 bg-gradient-to-l from-fd-background to-transparent",
        className
      )}
      {...props}
    />
  );
}
MarkeeFade.displayName = "MarkeeFade";

export { Markee, MarkeeSpacer, MarkeeFade, MarkeeContent, MarkeeItem };
export type { MarkeeContentProps };