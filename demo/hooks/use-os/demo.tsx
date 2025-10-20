"use client";
import { DemoBlock } from "@/components/demoBlock";
import { useOs } from "@/hooks/use-os";

interface UseOsDemoProps {
    
}
 
const UseOsDemo: React.FC<UseOsDemoProps> = () => {

    const os = useOs();
    return ( 
        <DemoBlock>
        <div className="text-center space-y-4">
          <div className="text-sm text-fd-muted-foreground">
            Current OS
          </div>
          <p className="text-lg font-semibold text-fd-foreground">
            {os}
          </p>
          <p className="text-sm text-fd-muted-foreground mt-8">
            Open on other operating systems to see different values
          </p>
        </div>
      </DemoBlock>
     );
}
 
export default UseOsDemo;