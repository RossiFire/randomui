import * as React from "react";
import { cn } from "@/lib/utils";

const MarkeeContext = React.createContext<boolean>(false);
const MarkeeContentContext = React.createContext<boolean>(false);

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
}

type MarkeeSpacerProps = React.HTMLAttributes<HTMLDivElement>;

const MarkeeSpacer = React.forwardRef<HTMLDivElement, MarkeeSpacerProps>(
  ({ className, ...props }, ref) => {
    const isInContent = React.useContext(MarkeeContentContext);
    
    if (!isInContent) {
      console.error("MarkeeSpacer must be used inside a MarkeeContent component");
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn("shrink-0 w-4", className)}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

MarkeeSpacer.displayName = "MarkeeSpacer";

interface MarkeeContentProps {
  children?: React.ReactNode;
}

const MarkeeContent = ({ children }: MarkeeContentProps) => {
  const isInMarkee = React.useContext(MarkeeContext);
  
  if (!isInMarkee) {
    console.error("MarkeeContent must be used inside a Markee component");
    return null;
  }

  return <>{children}</>;
};

MarkeeContent.displayName = "MarkeeContent";

interface MarkeeFadeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "direction"> {
  /**
   * The direction of the fade effect
   */
  direction: "left" | "right";
}

const MarkeeFade = React.forwardRef<HTMLDivElement, MarkeeFadeProps>(
  ({ className, direction, ...props }, ref) => {
    const isInMarkee = React.useContext(MarkeeContext);
    
    if (!isInMarkee) {
      console.error("MarkeeFade must be used inside a Markee component");
      return null;
    }

    return (
      <div
        ref={ref}
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
);

MarkeeFade.displayName = "MarkeeFade";

const Markee = React.forwardRef<HTMLDivElement, MarkeeProps>(
  (
    {
      children,
      className,
      reverse = false,
      duration = 10,
      ease = "linear",
      pauseOnHover = false,
      ...props
    },
    ref
  ) => {
    const fadeDirections = React.useRef<Set<"left" | "right">>(new Set());
    
    // Memoize flattenChildren to avoid recreating on every render
    const flattenChildren = React.useCallback((nodes: React.ReactNode): React.ReactNode[] => {
      return React.Children.toArray(nodes).flatMap((node) => {
        if (React.isValidElement(node) && node.type === React.Fragment) {
          const fragmentProps = node.props as { children?: React.ReactNode };
          return flattenChildren(fragmentProps.children);
        }
        return node;
      });
    }, []);

    // Separate fades from content and track fade directions
    const { fades, contentItems } = React.useMemo(() => {
      const childrenArray = React.Children.toArray(children);
      const fadesArray: React.ReactNode[] = [];
      const contentArray: React.ReactNode[] = [];
      
      fadeDirections.current.clear();

      React.Children.forEach(childrenArray, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === MarkeeFade) {
            const fadeProps = child.props as MarkeeFadeProps;
            if (fadeDirections.current.has(fadeProps.direction)) {
              console.error(`MarkeeFade with direction "${fadeProps.direction}" already exists in this Markee component`);
            } else {
              fadeDirections.current.add(fadeProps.direction);
              fadesArray.push(child);
            }
          } else if (child.type === MarkeeContent) {
            const props = child.props as MarkeeContentProps;
            contentArray.push(...flattenChildren(props.children));
          }
        }
      });

      return { fades: fadesArray, contentItems: contentArray };
    }, [children, flattenChildren]);

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
      <MarkeeContext.Provider value={true}>
        <MarkeeContentContext.Provider value={true}>
          <div
            ref={ref}
            className={cn(
              "relative flex overflow-hidden max-w-fit marquee-container",
              pauseOnHover && "pause-on-hover",
              className
            )}
            role="region"
            aria-label="Scrolling content"
            aria-live="polite"
            {...props}
          >
            {fades}
            
            <ul
              style={{
                ...animationStyle,
                animationName: "marquee-scroll",
              }}
              className="flex list-none shrink-0 justify-around min-w-full marquee-list"
              role="list"
            >
              {contentItems.map((item, i) => (
                <li key={i} role="listitem">
                  {item}
                </li>
              ))}
            </ul>

            <ul
              aria-hidden="true"
              style={{
                ...animationStyle,
                animationName: "marquee-scroll-infinite",
              }}
              className="flex list-none shrink-0 justify-around min-w-full absolute top-0 left-0 marquee-list"
            >
              {contentItems.map((item, i) => (
                <li key={i}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </MarkeeContentContext.Provider>
      </MarkeeContext.Provider>
    );
  }
);

Markee.displayName = "Markee";

export { Markee, MarkeeSpacer, MarkeeFade, MarkeeContent };
export type { MarkeeProps, MarkeeSpacerProps, MarkeeFadeProps, MarkeeContentProps };