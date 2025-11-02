"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { interFont, majorFont } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { SplitText } from "gsap/SplitText";
import RippleButton from "@/app/components/RippleButton";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";
import { Markee, MarkeeContent, MarkeeFade, MarkeeSpacer, MarkeeItem } from "@/components/markee";
import TechBadge from "@/components/ui/tech-badge";
import GradientBorderButton from "@/components/gradient-border-button";
import { useHydration } from "@/hooks/use-hydration";
import React from "react";

gsap.registerPlugin(SplitText);

const Hero: React.FC = () => {

    const isMounted = useHydration();

    useGSAP(() => {
        if(!isMounted) return;
        
        gsap.to(".radial-overlay", {
            background: `radial-gradient(circle at center, transparent 50%, var(--color-fd-background) 100%)`,
            duration: 2,
            ease: "power2.out",
        });
        
        
        const splittedH1 = new SplitText(".hero-text", { type: "chars" });

        gsap.from(splittedH1.chars, {
            y: 50,
            opacity: 0,
            delay: 0.25,
            duration: 0.5,
            stagger: 0.05,
            ease: "back.out(1.7)"
        });


        const splittedH2 = new SplitText("h2", {type: "chars"});

        gsap.set(splittedH2.chars, {
            overflow: 'hidden',
            transformOrigin: 'bottom',
            perspective: 1000,
        });

        const tl = gsap.timeline({ repeat: -1 });
        
        tl.to(splittedH2.chars, {
            rotateX: -90,
            stagger: 0.05,
            duration: 0.2,
        }).to(splittedH2.chars, {
            rotateX: 0,
            duration: 0.2,
            ease: "sine.out",
            stagger: 0.05,
        },'<20%');

    }, [isMounted]);

    if(!isMounted) return null;
    const techBadges = [
        <TechBadge key="nextjs" badge="nextjs" />,
        <TechBadge key="gsap" badge="gsap" />,
        <TechBadge key="react" badge="react" />,
        <TechBadge key="typescript" badge="typescript" />,
        <TechBadge key="framer_motion" badge="framer_motion" />,
        <TechBadge key="tailwind" badge="tailwind" />,
        <TechBadge key="css" badge="css" />,
    ]
    return (
        <div className="flex flex-col items-center justify-center gap-8 z-[2] px-4 md:px-0">
            <div className="absolute inset-0 z-[99] radial-overlay touch-none pointer-events-none" style={{ background: `radial-gradient(circle at center, transparent 0%, var(--color-fd-background)) 0%` }} />

                <GradientBorderButton className="hover:scale-105 transition-transform duration-300 mb-12">
                    <Link href="/converter">Try the new AI code converter</Link>
                </GradientBorderButton>
            <h1 className={cn("text-3xl md:text-4xl lg:text-6xl text-fd-foreground hero-text", majorFont)}>Random UI</h1>
            <h2 className={cn("text-base md:text-xl lg:text-2xl text-fd-muted-foreground px-2 md:px-0", interFont)}>A collection of reusable components, hooks, utilities and more</h2>
            <Markee className="w-full md:w-1/2 lg:w-1/3">
                <MarkeeFade position="left" className="from-fd-background"/>
                <MarkeeContent duration={15} pauseOnHover={true}>
                    {techBadges.map((badge, i) => (
                        <React.Fragment key={i}>
                            <MarkeeItem>{badge}</MarkeeItem>
                            <MarkeeSpacer className="w-2 md:w-4" />
                        </React.Fragment>
                    ))}
                </MarkeeContent>
                <MarkeeFade position="right" className="from-fd-background"/>
            </Markee>
            <div className="mt-20 flex items-center gap-4">
                <RippleButton 
                    className={cn("border-none h-8.5",interFont)} 
                >
                    <Link href="/docs/getting-started">Explore Docs</Link>
                </RippleButton>
                <Button variant="secondary" className="flex items-center gap-2 group" asChild>
                    <Link href="https://github.com/RossiFire/randomui" target="_blank" rel="noopener noreferrer">
                        Star on GitHub 
                        <Star 
                            className="size-4 group-hover:rotate-12 transition-transform duration-300 group-hover:fill-amber-300 group-hover:text-amber-300" 
                        />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
 
export default Hero;