"use client";

import { DemoBlock } from "@/components/demoBlock";
import TechBadge from "@/components/ui/tech-badge";
import { MarkeeFade, MarkeeSpacer, Markee, MarkeeContent, MarkeeItem } from "./marquee-demo";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";


interface MagnetDemoProps {
    
}
 
const MarqueeDemo: React.FC<MagnetDemoProps> = () => {


    const [showFades, setShowFades] = useState(true);
    const [pauseOnHover, setPauseOnHover] = useState(false);
    const [reverse, setReverse] = useState(false);
    const [duration, setDuration] = useState(15);


    return (
      <DemoBlock containerClassName="flex flex-col items-center justify-center h-[400px]">
        <h2 className="mt-0 text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-fd-primary to-fd-accent-foreground">
            Markee
        </h2>
        <Markee className="w-full md:w-3/4">
          {showFades && <MarkeeFade position="left" className="from-fd-background" />}
          <MarkeeContent duration={duration} pauseOnHover={pauseOnHover}>
            <MarkeeItem className="list-none">
              <TechBadge badge="nextjs" />
            </MarkeeItem>
            <MarkeeSpacer className="w-2 md:w-4" />
            <MarkeeItem className="list-none">
              <TechBadge badge="gsap" />
            </MarkeeItem>
            <MarkeeSpacer className="w-2 md:w-4" />
            <MarkeeItem className="list-none">
              <TechBadge badge="react" />
            </MarkeeItem>
            <MarkeeSpacer className="w-2 md:w-4" />
            <MarkeeItem className="list-none">
              <TechBadge badge="typescript" />
            </MarkeeItem>
            <MarkeeSpacer className="w-2 md:w-4" />
            <MarkeeItem className="list-none">
              <TechBadge badge="framer_motion" />
            </MarkeeItem>
            <MarkeeSpacer className="w-2 md:w-4" />
            <MarkeeItem className="list-none">
              <TechBadge badge="tailwind" />
            </MarkeeItem>
            <MarkeeSpacer className="w-2 md:w-4" />
            <MarkeeItem className="list-none">
              <TechBadge badge="css" />
            </MarkeeItem>
          </MarkeeContent>
          {showFades && <MarkeeFade position="right" className="from-fd-background" />}
        </Markee>
        <div className="mt-8 flex gap-4">
            <Button variant="secondary" onClick={() => setShowFades(!showFades)}>
                Fades {showFades ? "On" : "Off"}
            </Button>
            <Button variant="secondary" onClick={() => setPauseOnHover(!pauseOnHover)}>
                Pause on hover {pauseOnHover ? "On" : "Off"}
            </Button>
            <Button variant="secondary" onClick={() => setReverse(!reverse)}>
                Reverse {reverse ? "On" : "Off"}
            </Button>
            <div className="flex items-center gap-2 ml-2">
                <Button variant="secondary" onClick={() => setDuration(duration - 1)} disabled={duration <= 1}>-</Button>
                <Input
                    type="number"
                    readOnly
                    className="w-12 !pl-3 !pr-0 text-center"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                />
                <Button variant="secondary" onClick={() => setDuration(duration + 1)} disabled={duration >= 30}>+</Button>
            </div>
        </div>
      </DemoBlock>
    );
}
 
export default MarqueeDemo;