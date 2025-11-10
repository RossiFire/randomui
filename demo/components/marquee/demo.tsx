"use client";

import { DemoBlock } from "@/components/demoBlock";
import TechBadge from "@/components/ui/tech-badge";
import { MarkeeFade, MarkeeSpacer, Markee, MarkeeContent, MarkeeItem } from "@/components/markee";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ArrowLeftRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform } from "framer-motion";
import { useHydration } from "@/hooks/use-hydration";


gsap.registerPlugin(ScrollTrigger);


const BADGES = [
  <TechBadge badge="nextjs" />,
  <TechBadge badge="gsap" />,
  <TechBadge badge="react" />,
  <TechBadge badge="typescript" />,
  <TechBadge badge="framer_motion" />,
  <TechBadge badge="tailwind" />,
  <TechBadge badge="css" />,
]


const MarqueeDemo: React.FC = () => {


    const [showFades, setShowFades] = React.useState(true);
    const [pauseOnHover, setPauseOnHover] = React.useState(false);
    const [direction, setDirection] = React.useState<"left" | "right">("left");
    const [duration, setDuration] = React.useState(10);
    const [paused, setPaused] = React.useState(false);


    return (
      <DemoBlock containerClassName="flex flex-col items-center justify-center h-[400px]">
        <h2 className="mt-0 text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-fd-primary to-fd-accent-foreground">
            Markee
        </h2>
        <Markee className="w-full md:w-3/4">
          {showFades && <MarkeeFade position="left" className="from-fd-background" />}
          <MarkeeContent duration={duration} pauseOnHover={pauseOnHover} direction={direction} paused={paused}>
            {BADGES.map((badge, index) => (
              <React.Fragment key={index}>
                <MarkeeItem className="list-none">
                  {badge}
                </MarkeeItem>
                <MarkeeSpacer className="w-2 md:w-4" />
              </React.Fragment>
            ))}
          </MarkeeContent>
          {showFades && <MarkeeFade position="right" className="from-fd-background" />}
        </Markee>
        <div className="mt-12 flex gap-6 flex-wrap w-full justify-center">
          <div className="flex items-center gap-2">
            <Checkbox id="fades" checked={showFades} onCheckedChange={() => setShowFades(!showFades)} />
            <Label htmlFor="fades" className="text-sm text-fd-muted-foreground font-normal">Fades</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="pauseOnHover" checked={pauseOnHover} onCheckedChange={() => setPauseOnHover(!pauseOnHover)} />
            <Label htmlFor="pauseOnHover" className="text-sm text-fd-muted-foreground font-normal">Pause on hover</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="paused" checked={paused} onCheckedChange={() => setPaused(!paused)} />
            <Label htmlFor="paused" className="text-sm text-fd-muted-foreground font-normal">Paused</Label>
          </div>
          <Button variant="secondary" className="flex items-center gap-2" onClick={() => setDirection(direction === "left" ? "right" : "left")}>
            <span className="text-sm text-fd-muted-foreground font-normal">Direction</span>
            <ArrowLeftRight className="size-4 text-fd-muted-foreground" />
          </Button>

          <div className="flex items-center gap-2">
            <Label htmlFor="duration" className="text-sm text-fd-muted-foreground font-normal">Duration</Label>
            <InputGroup className="w-24">
            <InputGroupInput 
              placeholder="Duration" 
              value={duration} 
              readOnly 
            />
            <InputGroupAddon align="inline-end">
              <Button variant="secondary" className="w-5 !p-0" onClick={() => setDuration(duration - 1)}>-</Button>
              <Button variant="secondary" className="w-5 !p-0" onClick={() => setDuration(duration + 1)}>+</Button>
            </InputGroupAddon>
          </InputGroup>

          </div>
        </div>
      </DemoBlock>
    );
}




const MarqueeDemoWithGSAP: React.FC = () => {

  useGSAP(()=>{
    gsap.set(".mymarkee-content-right", { translateX: "-100%" });

    const tl = gsap.timeline({
      scrollTrigger: {
        scroller: '.markee-demo-with-gsap-wrapper',
        trigger: '.animated-content',
        start: 'top center',
        end: 'bottom 20%',
        scrub: true,
      },
    });
  
   tl.to(".mymarkee-content", {
    translateX: "-10%",
    ease: 'power2.inOut',
   },'<');

   tl.to(".mymarkee-content-right", {
    translateX: "-90%",
    ease: 'power2.inOut',
   },'<');
   
  })

  return (
    <DemoBlock 
      className="max-h-[600px] overflow-scroll no-scrollbar markee-demo-with-gsap-wrapper m-0" 
      containerClassName="flex flex-col items-center justify-center"
    >
        <div className="h-[600px] grid place-items-center">
          <span className="text-lg text-center text-fd-muted-foreground">Scroll to see the animation</span>
        </div>
        <div className="flex flex-col items-center justify-center animated-content w-full min-h-[600px]">
          <h2 className="mt-0 text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-fd-primary to-fd-accent-foreground">
              Markee
          </h2>
          <Markee className="w-full md:w-3/4">
            <MarkeeFade position="left" className="from-fd-background" />
            <MarkeeContent className="mymarkee-content animate-none!" paused >
              {BADGES.map((badge, index) => (
                <React.Fragment key={index}>
                  <MarkeeItem className="list-none">
                    {badge}
                  </MarkeeItem>
                  <MarkeeSpacer className="w-2 md:w-4" />
                </React.Fragment>
              ))}
            </MarkeeContent>
            <MarkeeFade position="right" className="from-fd-background" />
          </Markee>
          <Markee className="w-full md:w-3/4">
            <MarkeeFade position="left" className="from-fd-background" />
            <MarkeeContent className="mymarkee-content-right animate-none!" paused direction="right" >
              {BADGES.map((badge, index) => (
                <React.Fragment key={index}>
                  <MarkeeItem className="list-none">
                    {badge}
                  </MarkeeItem>
                  <MarkeeSpacer className="w-2 md:w-4" />
                </React.Fragment>
              ))}
            </MarkeeContent>
            <MarkeeFade position="right" className="from-fd-background" />
          </Markee>
        </div>
        <div className="h-[600px]"></div>
    </DemoBlock>
  );
}


const MarqueeDemoWithFramerMotion: React.FC = () => {

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isContainerReady, setIsContainerReady] = React.useState(false);

  const { scrollYProgress } = useScroll({
    container: isContainerReady ? containerRef : undefined,
    offset: ["start center", "end end"],
  });
  const translateX = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);
  const translateXInverse = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  const isMounted = useHydration();

  React.useEffect(() => {
    if (!isMounted) return;
    
    // Wait for DOM to be fully rendered and layout to be calculated
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (containerRef.current) {
          setIsContainerReady(true);
        }
      });
    });
  }, [isMounted]);

  if(!isMounted) return null;


  return (
    <DemoBlock 
      className="h-fit m-0" 
      containerClassName="flex flex-col items-center justify-center p-0"
    >
      <div 
        ref={containerRef}
        className="max-h-[600px] overflow-scroll no-scrollbar markee-demo-with-framer-motion-wrapper w-full"
      >
        <div className="h-[600px] grid place-items-center">
          <span className="text-lg text-center text-fd-muted-foreground">Scroll to see the animation</span>
        </div>
        <div className="flex flex-col items-center justify-center animated-content w-full min-h-[600px]">
          <h2 className="mt-0 text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-fd-primary to-fd-accent-foreground">
              Markee
          </h2>
          <Markee className="w-full md:w-3/4">
            <MarkeeFade position="left" className="from-fd-background" />
            <MarkeeContent className="mymarkee-content animate-none!" paused >
              <motion.div style={{ translateX }} className="flex">
                {BADGES.map((badge, index) => (
                  <React.Fragment key={index}>
                    <MarkeeItem className="list-none">
                      {badge}
                    </MarkeeItem>
                    <MarkeeSpacer className="w-2 md:w-4" />
                  </React.Fragment>
                ))}
              </motion.div>
            </MarkeeContent>
            <MarkeeFade position="right" className="from-fd-background" />
          </Markee>
          <Markee className="w-full md:w-3/4">
            <MarkeeFade position="left" className="from-fd-background" />
            <MarkeeContent className="mymarkee-content animate-none!" paused >
              <motion.div style={{ translateX: translateXInverse }} className="flex">
                {BADGES.map((badge, index) => (
                  <React.Fragment key={index}>
                    <MarkeeItem className="list-none">
                      {badge}
                    </MarkeeItem>
                    <MarkeeSpacer className="w-2 md:w-4" />
                  </React.Fragment>
                ))}
              </motion.div>
            </MarkeeContent>
            <MarkeeFade position="right" className="from-fd-background" />
          </Markee>
        </div>
        <div className="h-[600px]"></div>
      </div>
    </DemoBlock>
  );
}

export { MarqueeDemo, MarqueeDemoWithGSAP, MarqueeDemoWithFramerMotion };