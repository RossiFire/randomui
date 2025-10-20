"use client";
import { DemoBlock } from "@/components/demoBlock";
import useScreenSize from "./use-screen-size";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface UseScreenSizeDemoProps {}

const UseScreenSizeDemo: React.FC<UseScreenSizeDemoProps> = () => {
  
  const [transformTo, setTransformTo] = useState<"%" | "px">("px");
  const screenSize = useScreenSize({ transformTo: transformTo });

  return (
    <DemoBlock>
      <div className="text-center space-y-4">
        <div className="text-lg font-semibold text-fd-foreground">
          Current Screen Size
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
          <div className="bg-fd-muted/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-fd-foreground">
              {screenSize.width}
            </div>
            <div className="text-sm text-fd-muted-foreground">Width ({transformTo === "%" ? "%" : "px"})</div>
          </div>
          <div className="bg-fd-muted/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-fd-foreground">
              {screenSize.height}
            </div>
            <div className="text-sm text-fd-muted-foreground">Height ({transformTo === "%" ? "%" : "px"})</div>
          </div>
        </div>
        <Button onClick={() => setTransformTo(transformTo === "%" ? "px" : "%")}>
          Get {transformTo === "%" ? "px" : "%"} Size
        </Button>
        <p className="text-sm text-fd-muted-foreground">
          Resize your browser window to see the values update in real-time
        </p>
      </div>
    </DemoBlock>
  );
};

export default UseScreenSizeDemo;
