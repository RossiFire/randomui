import * as React from "react";
import { cn } from "@/lib/utils";

interface MarkeeProps extends React.HTMLAttributes<HTMLDivElement> {
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
  /**
   * Gap between items. Pass a string for static gap or an object for responsive breakpoints.
   * @default "1rem"
   * @example "2rem" - static gap
   * @example { "0px": "1rem", "768px": "2rem", "1024px": "3rem" } - responsive gap
   */
  gap?: string | Record<string, string>;
}

const Markee = React.forwardRef<HTMLDivElement, MarkeeProps>(
  (
    {
      children,
      className,
      reverse = false,
      duration = 10,
      ease = "linear",
      pauseOnHover = false,
      gap = "1rem",
      ...props
    },
    ref
  ) => {
    const items = React.Children.toArray(children);

    const breakpointStyles = React.useMemo(() => {
      const breakpoints =
        typeof gap === "string"
          ? { "0px": gap }
          : { "0px": "1rem", ...gap };

      return Object.entries(breakpoints)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(
          ([key, value]) =>
            `@media screen and (min-width: ${key}) { .marquee-container { --marquee-gap: ${value}; } }`
        )
        .join("\n");
    }, [gap]);

    const animationStyle = React.useMemo(
      () => ({
        animationDuration: `${duration}s`,
        animationTimingFunction: ease,
        animationIterationCount: "infinite" as const,
        animationDirection: reverse ? ("reverse" as const) : ("normal" as const),
      }),
      [duration, ease, reverse]
    );

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex overflow-hidden max-w-fit marquee-container gap-[var(--marquee-gap)]",
          pauseOnHover && "pause-on-hover",
          className
        )}
        role="region"
        aria-label="Marquee content"
        aria-live="off"
        {...props}
      >
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-fd-background to-transparent z-10 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-fd-background to-transparent z-10 pointer-events-none"
        />

        <ul
          style={{
            ...animationStyle,
            animationName: "scroll",
          }}
          className="flex list-none shrink-0 justify-around gap-[var(--marquee-gap)] min-w-full marquee-list"
        >
          {items.map((item, i) => (
            <li key={i} aria-label={`Marquee item ${i + 1}`}>
              {item}
            </li>
          ))}
        </ul>

        <ul
          aria-hidden="true"
          className="flex list-none shrink-0 justify-around gap-[var(--marquee-gap)] min-w-full absolute top-0 left-0 marquee-list"
          style={{
            ...animationStyle,
            animationName: "infinite-marquee-scroll",
          }}
        >
          {items.map((item, i) => (
            <li key={i} aria-label={`Marquee item ${i + 1}`}>
              {item}
            </li>
          ))}
        </ul>

        <style jsx>{`
          ${breakpointStyles}

          .pause-on-hover:hover .marquee-list {
            animation-play-state: paused;
          }

          @media (prefers-reduced-motion: reduce) {
            .marquee-list {
              animation-play-state: paused !important;
            }
          }

          @keyframes scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(calc(-100% - var(--marquee-gap)));
            }
          }

          @keyframes infinite-marquee-scroll {
            from {
              transform: translateX(calc(100% + var(--marquee-gap)));
            }
            to {
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    );
  }
);

Markee.displayName = "Markee";

export { Markee };
export type { MarkeeProps };