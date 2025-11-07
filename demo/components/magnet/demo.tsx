"use client";

import { DemoBlock } from "@/components/demoBlock";
import Magnet from "./magnet";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const MagnetDemo: React.FC = () => {

    const [isActive, setIsActive] = useState(false);

    return ( 
        <DemoBlock>
            <div className="flex flex-col md:flex-row w-full items-center justify-around gap-20 md:gap-0">
                    <Magnet>
                        <div>Hover me</div>
                    </Magnet>
                    <Magnet className="rounded-full bg-fd-accent cursor-pointer text-fd-accent-foreground p-3 border border-fd-accent-foreground/10">
                        <StarIcon className="size-6" />
                    </Magnet>
                    <Magnet magnetMultiplier={3}>
                        High effect 
                    </Magnet>
                    <div className="flex flex-col gap-4 justify-center items-center">
                        <Magnet isActive={isActive}>
                            Magnet: {isActive ? "Active" : "Inactive"}
                        </Magnet>
                        <Button onClick={() => setIsActive(!isActive)} className="text-xs">
                            Toggle
                        </Button>

                    </div>
            </div>
        </DemoBlock>
     );
}
 
export { MagnetDemo };