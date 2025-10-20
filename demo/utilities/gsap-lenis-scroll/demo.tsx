"use client";
import { DemoBlock } from "@/components/demoBlock";
import { Button } from "@/components/ui/button";
import LenisProvider from "@/providers/LenisProvider";
import { useLenis } from "lenis/react";
import { useState } from "react";
import { LenisOptions } from "lenis";

interface GsapLenisScrollDemoProps {
    
}
 
const GsapLenisScrollDemo: React.FC<GsapLenisScrollDemoProps> = () => {

    const [lenisOptions, setLenisOptions] = useState<LenisOptions>({
        wheelMultiplier: 1
    })


    const toggleLenis = () => {
        setLenisOptions({
            wheelMultiplier: lenisOptions.wheelMultiplier === 0 ? 1 : 0
        })
    }

    const isEnabled = lenisOptions.wheelMultiplier === 1

    return ( 
        <LenisProvider options={lenisOptions}>
            <DemoBlock className="m-0" disableOverflowHidden containerClassName="flex flex-col gap-12 py-20">
                <div className="flex flex-col gap-4 text-center">
                    <h1 className="text-2xl font-bold mb-0">Gsap Lenis Scroll</h1>
                    <h2 className="text-sm text-fd-muted-foreground mt-0">Scroll this page to see the lenis scroll in action</h2>
                </div>
                <Button onClick={toggleLenis}>
                    {isEnabled ? "Disable Lenis Scroll" : "Enable Lenis Scroll"}
                </Button>
            </DemoBlock>
        </LenisProvider>
     );
}
 
export default GsapLenisScrollDemo;