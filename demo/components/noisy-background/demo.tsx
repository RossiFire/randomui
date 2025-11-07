"use client";
import { DemoBlock } from "@/components/demoBlock";
import { Button } from "@/components/ui/button";
import useNoisyBackgroundStore from "@/store/noisy-background-store";


const NoisyBackgroundDemo: React.FC = () => {

    const { toggleBackground, toggleAnimation } = useNoisyBackgroundStore();


    return ( 
        <DemoBlock containerClassName="min-h-[400px] flex flex-col gap-4">
            <h1 className="text-center">Noisy Background</h1>
            <div className="flex gap-2">
                <Button onClick={toggleBackground}>
                    Toggle Background
                </Button>
                <Button onClick={toggleAnimation}>
                    Toggle Animation
                </Button>

            </div>

        </DemoBlock>
    );
}
 
export { NoisyBackgroundDemo };