"use client";

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

interface MouseContextType {
  isVisible: boolean;
  x: number;
  y: number;
}

const MouseContext = React.createContext<MouseContextType | null>(null);

function MouseFollowContent({
  asChild,
  className,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const [mouseState, setMouseState] = React.useState<MouseContextType>({
    isVisible: false,
    x: 0,
    y: 0,
  });

  const handleMouseEnter = React.useCallback(() => {
    setMouseState((prev) => ({ ...prev, isVisible: true }));
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    setMouseState((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setMouseState({
        isVisible: true,
        x: e.clientX,
        y: e.clientY,
      });
    },
    []
  );

  const Comp = asChild ? Slot : "div";

  return (
    <MouseContext.Provider value={mouseState}>
      <Comp
        data-slot="mouse-follow-content"
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        {...props}
      />
    </MouseContext.Provider>
  );
}
MouseFollowContent.displayName = "MouseFollowContent";

interface MouseFollowItemProps extends React.ComponentProps<"div"> {
  offsetX?: number;
  offsetY?: number;
}

function MouseFollowItem({
  offsetX = 0,
  offsetY = 0,
  className,
  ...props
}: MouseFollowItemProps) {
  const context = React.useContext(MouseContext);

  if (!context) {
    console.error("MouseFollowItem must be used inside MouseFollowContent");
    return null;
  }

  const { isVisible, x, y } = context;

  return (
    <div
        data-slot="mouse-follow-item"
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed z-[999]",
          isVisible
            ? "opacity-100 transition-opacity duration-150"
            : "opacity-0 duration-0",
          className
        )}
        style={{
          left: x + offsetX,
          top: y + offsetY,
          transform: "translate(-50%, -50%)",
        }}
        {...props}
      />
  )
}
MouseFollowItem.displayName = "MouseFollowItem";

export { MouseFollowContent, MouseFollowItem };
