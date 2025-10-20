"use client";
import { DemoBlock } from "@/components/demoBlock";
import { useBreakPoints } from "./use-breakpoints";
import { cn } from "@/lib/utils";

interface UseBreakpointsDemoProps {}

const UseBreakpointsDemo: React.FC<UseBreakpointsDemoProps> = () => {
  
    const { isMobile, isTablet, isDesktop } = useBreakPoints();

  return (
    <DemoBlock>
      <div className="text-center space-y-4">
        <div className="text-lg font-semibold text-fd-foreground">
          Current Breakpoints
        </div>
        <div className="flex gap-4 w-full items-center justify-center">
          <div className={cn("bg-fd-muted/50 rounded-lg p-4", isMobile && "bg-fd-primary/20")}>
            <div className={"text-base font-bold text-fd-foreground whitespace-nowrap"}>
            Mobile Size
            </div>
          </div>
          <div className={cn("bg-fd-muted/50 rounded-lg p-4", isTablet && "bg-fd-primary/20")}>
            <div className="text-base font-bold text-fd-foreground whitespace-nowrap">
              Tablet Size
            </div>
          </div>
          <div className={cn("bg-fd-muted/50 rounded-lg p-4", isDesktop && "bg-fd-primary/20")}>
            <div className="text-base font-bold text-fd-foreground whitespace-nowrap">
              Desktop Size
            </div>
          </div>
        </div>
        <p className="text-sm text-fd-muted-foreground">
          Resize your browser window to see the values update in real-time
        </p>
      </div>
    </DemoBlock>
  );
};

export default UseBreakpointsDemo;
