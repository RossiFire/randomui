"use client";

import { DemoBlock } from "@/components/demoBlock";
import { MarqueeDemoComponent } from "./marquee-demo";
import TechBadge from "@/components/ui/tech-badge";


interface MagnetDemoProps {
    
}
 
const MarqueeDemo: React.FC<MagnetDemoProps> = () => {


    return ( 
        <DemoBlock containerClassName="grid place-items-center h-[400px]">
            <MarqueeDemoComponent duration={20} className="w-3/4" gap="1rem" >
                <TechBadge badge="nextjs" />
                <TechBadge badge="gsap" />
                <TechBadge badge="react" />
                <TechBadge badge="typescript" />
                <TechBadge badge="framer_motion" />
                <TechBadge badge="tailwind" />
                <TechBadge badge="css" />
            </MarqueeDemoComponent>
        </DemoBlock>
     );
}
 
export default MarqueeDemo;