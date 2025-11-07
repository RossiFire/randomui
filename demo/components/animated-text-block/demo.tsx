"use client";
import { DemoBlock } from "@/components/demoBlock"
import { useHydration } from "@/hooks/use-hydration";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { interFont } from "@/lib/fonts";
import { Button } from "@/components/ui/button";
import { Prata } from "next/font/google";
import { useState } from "react";
import { useGSAP } from "@gsap/react";


const prata = Prata({ weight: '400', subsets: ['latin'], variable: '--font-prata' })


const AnimatedTextBlockDemo: React.FC = () => {
  const isMounted = useHydration();

  const [animating, setAnimating] = useState(false);

  const runAnimation = () => {
    gsap.set(".faded-text", { clipPath: "inset(0px 100% 0px 0px)" });
    gsap.set(".high-line-reveal", { scaleX: 1 });

    const tl = gsap.timeline({
      onComplete: () => setAnimating(false),
      onStart: () => setAnimating(true),
    });
    tl.to(".faded-text", {
      clipPath: "inset(0px 0% 0px 0px)",
      duration: 0.6,
      stagger: 0.2,
      ease: "power2.inOut",
    }).to(
      ".faded-text .high-line-reveal",
      {
        scaleX: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "power4.inOut",
      },
      "<20%"
    );
  };


  if(!isMounted) return null;



    return ( 
        <DemoBlock containerClassName="py-12">
            <div className="flex flex-col gap-12 justify-center items-center">
                <div className="flex flex-col gap-0 whitespace-pre-wrap items-center text-center">
                    <TextLineReveal spanClass="faded-text" lineClass="high-line-reveal"><strong className={cn("text-[#e17055] md:text-3xl lg:text-5xl",prata.className)}>REDEFINING</strong> WEB,</TextLineReveal>
                    <TextLineReveal spanClass="faded-text" lineClass="high-line-reveal">CHASING <strong className={cn("text-[#e17055] md:text-3xl lg:text-5xl",prata.className)}>PERFORMANCE</strong>,</TextLineReveal>
                    <TextLineReveal spanClass="faded-text" lineClass="high-line-reveal">BRINGING IT ALL IN</TextLineReveal>
                    <TextLineReveal spanClass="faded-text" lineClass="high-line-reveal">ALL WAYS. DEFINING A</TextLineReveal>
                    <TextLineReveal spanClass="faded-text" lineClass="high-line-reveal"><strong className={cn("text-[#e17055] md:text-3xl lg:text-5xl",prata.className)}>STANDARD</strong> WITH RUI</TextLineReveal>
                    <TextLineReveal spanClass="faded-text" lineClass="high-line-reveal">ON AND OFF THE</TextLineReveal>
                    <TextLineReveal spanClass="faded-text" lineClass="high-line-reveal">WEB.</TextLineReveal>
                </div>
                <Button 
                    onClick={runAnimation} 
                    disabled={animating}
                >
                    {animating ? "Animating..." : "Run animation"}
                </Button>
            </div>
        </DemoBlock>
    )
}



const AnimatedTextBlockAlternativeDemo: React.FC = () => {
    const isMounted = useHydration();
  
    const [animating, setAnimating] = useState(false);
  
    const runAnimation = () => {
      gsap.set(".faded-text-1", { clipPath: "inset(0px 100% 0px 0px)" });
      gsap.set(".high-line-reveal-1", { scaleX: 1 });
  
      const tl = gsap.timeline({
        onComplete: () => setAnimating(false),
        onStart: () => setAnimating(true),
      });
      tl.to(".faded-text-1", {
        clipPath: "inset(0px 0% 0px 0px)",
        duration: 0.8,
        stagger: 0.05,
        ease: "power2.out",
      }).to(
        ".faded-text-1 .high-line-reveal-1",
        {
          scaleX: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: "power4.inOut",
        },
        "<20%"
      );
    };
  
  
    if(!isMounted) return null;
  
  
  
      return ( 
          <DemoBlock containerClassName="py-12" className="m-0">
              <div className="flex flex-col gap-12 justify-center items-center">
                  <div className="flex flex-col gap-0 whitespace-pre-wrap items-center text-center">
                      <TextLineReveal spanClass="faded-text-1" lineClass="high-line-reveal-1"><strong className={cn("text-[#e17055] md:text-3xl lg:text-5xl",prata.className)}>REDEFINING</strong> WEB,</TextLineReveal>
                      <TextLineReveal spanClass="faded-text-1" lineClass="high-line-reveal-1">CHASING <strong className={cn("text-[#e17055] md:text-3xl lg:text-5xl",prata.className)}>PERFORMANCE</strong>,</TextLineReveal>
                      <TextLineReveal spanClass="faded-text-1" lineClass="high-line-reveal-1">BRINGING IT ALL IN</TextLineReveal>
                      <TextLineReveal spanClass="faded-text-1" lineClass="high-line-reveal-1">ALL WAYS. DEFINING A</TextLineReveal>
                      <TextLineReveal spanClass="faded-text-1" lineClass="high-line-reveal-1"><strong className={cn("text-[#e17055] md:text-3xl lg:text-5xl",prata.className)}>STANDARD</strong> WITH RUI</TextLineReveal>
                      <TextLineReveal spanClass="faded-text-1" lineClass="high-line-reveal-1">ON AND OFF THE</TextLineReveal>
                      <TextLineReveal spanClass="faded-text-1" lineClass="high-line-reveal-1">WEB.</TextLineReveal>
                  </div>
                  <Button 
                      onClick={runAnimation} 
                      disabled={animating}
                  >
                      {animating ? "Animating..." : "Run animation"}
                  </Button>
              </div>
          </DemoBlock>
      )
  }





const AnimatedTextBlockWrongDemo: React.FC = () => {
    const isMounted = useHydration();
  
    const [animating, setAnimating] = useState(false);
  
    const runAnimation = () => {
      gsap.set(".faded-text-2", { clipPath: "inset(0px 100% 0px 0px)" });
      gsap.set(".high-line-reveal-2", { scaleX: 1 });
  
      const tl = gsap.timeline({
        onComplete: () => setAnimating(false),
        onStart: () => setAnimating(true),
      });
      tl.to(".faded-text-2", {
        clipPath: "inset(0px 0% 0px 0px)",
        duration: 0.3,
        stagger: 0.05,
        ease: "sine.inOut",
      }).to(
        ".faded-text-2 .high-line-reveal-2",
        {
          scaleX: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power4.inOut",
        },
        "<20%"
      );
    };
  
  
    if(!isMounted) return null;
  
  
  
      return ( 
          <DemoBlock containerClassName="py-12" className="m-0">
              <div className="flex flex-col gap-12 justify-center items-center">
                  <div className="flex flex-col gap-0 whitespace-pre-wrap items-center text-center">
                      <TextLineReveal spanClass="faded-text-2" lineClass="high-line-reveal-2"><strong className={cn("text-[#e17055] text-xl md:text-3xl lg:text-5xl",prata.className)}>REDEFINING</strong> WEB,</TextLineReveal>
                      <TextLineReveal spanClass="faded-text-2" lineClass="high-line-reveal-2">CHASING <strong className={cn("text-[#e17055] md:text-3xl lg:text-5xl",prata.className)}>PERFORMANCE</strong>,</TextLineReveal>
                      <TextLineReveal spanClass="faded-text-2" lineClass="high-line-reveal-2">BRINGING IT ALL IN</TextLineReveal>
                      <TextLineReveal spanClass="faded-text-2" lineClass="high-line-reveal-2">ALL WAYS. DEFINING A</TextLineReveal>
                      <TextLineReveal spanClass="faded-text-2" lineClass="high-line-reveal-2"><strong className={cn("text-[#e17055] text-xl md:text-3xl lg:text-5xl",prata.className)}>STANDARD</strong> WITH RUI</TextLineReveal>
                      <TextLineReveal spanClass="faded-text-2" lineClass="high-line-reveal-2">ON AND OFF THE</TextLineReveal>
                      <TextLineReveal spanClass="faded-text-2" lineClass="high-line-reveal-2">WEB.</TextLineReveal>
                  </div>
                  <Button 
                      onClick={runAnimation} 
                      disabled={animating}
                  >
                      {animating ? "Animating..." : "Run animation"}
                  </Button>
              </div>
          </DemoBlock>
      )
  }


const AnimatedTextBlockScrollingDemo: React.FC = () => {
    
  
    useGSAP(()=>{
        gsap.set(".faded-text-3", { clipPath: "inset(0px 100% 0px 0px)" });
        gsap.set(".high-line-reveal-3", { scaleX: 1 });
    
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "#text-line-section",
            start: "top 70%",
          },
        });
        tl.to(".faded-text-3", {
            clipPath: "inset(0px 0% 0px 0px)",
            duration: 0.8,
            stagger: 0.05,
            ease: "power2.out",
        }).to(
            ".faded-text-3 .high-line-reveal-3",
            {
                scaleX: 0,
                duration: 0.8,
                stagger: 0.05,
                ease: "power4.inOut",
            },
            "<20%"
        );
    })
  
    return ( 
        <DemoBlock containerClassName="py-12 h-[400px] overflow-scroll relative" className="m-0">
            <div className="h-[400px] grid place-items-center" id="text-line-section" >
                <span className="text-fd-muted-foreground text-sm md:text-base">Scroll to see the animation</span>
            </div>
            <div className="flex flex-col gap-12 justify-center items-center">
                <div className="flex flex-col gap-0 whitespace-pre-wrap items-center text-center">
                    <TextLineReveal spanClass="faded-text-3" lineClass="high-line-reveal-3"><strong className={cn("text-[#e17055] text-xl md:text-3xl lg:text-5xl",prata.className)}>REDEFINING</strong> WEB,</TextLineReveal>
                    <TextLineReveal spanClass="faded-text-3" lineClass="high-line-reveal-3">CHASING <strong className={cn("text-[#e17055] md:text-3xl lg:text-5xl",prata.className)}>PERFORMANCE</strong>,</TextLineReveal>
                    <TextLineReveal spanClass="faded-text-3" lineClass="high-line-reveal-3">BRINGING IT ALL IN</TextLineReveal>
                    <TextLineReveal spanClass="faded-text-3" lineClass="high-line-reveal-3">ALL WAYS. DEFINING A</TextLineReveal>
                    <TextLineReveal spanClass="faded-text-3" lineClass="high-line-reveal-3"><strong className={cn("text-[#e17055] text-xl md:text-3xl lg:text-5xl",prata.className)}>STANDARD</strong> WITH RUI</TextLineReveal>
                    <TextLineReveal spanClass="faded-text-3" lineClass="high-line-reveal-3">ON AND OFF THE</TextLineReveal>
                    <TextLineReveal spanClass="faded-text-3" lineClass="high-line-reveal-3">WEB.</TextLineReveal>
                </div>
            </div>
        </DemoBlock>
    )
  }




const TextLineReveal: React.FC<{ children: React.ReactNode, spanClass: string, lineClass: string }> = ({
    children,
    spanClass,
    lineClass,
}) => {
    return (
        <span
        className={cn(
            "text text-2xl md:text-4xl lg:text-6xl font-bold uppercase relative text-fd-foreground leading-[60px] md:leading-[100px] -tracking-wider",
            spanClass,
            interFont
        )}
        >
        {children}
        <div className={cn(
            "absolute bottom-0 left-0 w-full h-full bg-[#e17055] will-change-transform scale-x-0 origin-[right_center]",
            lineClass
        )}></div>
        </span>
    );
};








  export { 
    AnimatedTextBlockDemo, 
    AnimatedTextBlockAlternativeDemo,
    AnimatedTextBlockWrongDemo,
    AnimatedTextBlockScrollingDemo
 };
 
