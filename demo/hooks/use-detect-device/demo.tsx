"use client";
import { DemoBlock } from "@/components/demoBlock";
import { useDevice } from "./use-detect-device";

const UseDetectDeviceDemo: React.FC = () => {

    const device = useDevice();
    return ( 
        <DemoBlock>
        <div className="text-center space-y-4">
          <div className="text-sm text-fd-muted-foreground">
            Current Device
          </div>
          <p className="text-lg font-semibold text-fd-foreground">
            {device}
          </p>
          <p className="text-sm text-fd-muted-foreground mt-8">
            Open on other devices to see different values
          </p>
        </div>
      </DemoBlock>
     );
}
 
export { UseDetectDeviceDemo };