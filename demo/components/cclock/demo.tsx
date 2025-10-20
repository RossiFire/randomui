'use client';
import { DemoBlock } from "@/components/demoBlock";
import { useState } from "react";
import CClock from "./cclock";
import ClockCounter from "./cclock-counter";
import { Button } from "@/components/ui/button";

interface CClockDemoProps {
    
}
 
export const CClockDemo: React.FC<CClockDemoProps> = () => {
    return ( 
        <DemoBlock containerClassName="h-[400px]" className="m-0">
            <CClock className="scale-50" />
        </DemoBlock>
    );
}
 
export const CClockCounterDemo: React.FC<CClockDemoProps> = () => {

    const [value, setValue] = useState(1);
    return ( 
        <DemoBlock containerClassName="flex flex-col items-center justify-center" className="m-0">
            <ClockCounter value={value} className="scale-50" />
            <div className="flex gap-2 mb-12">

                <Button onClick={() => setValue(1)} disabled={value === 1}>Reset</Button>
                <Button onClick={() => setValue(value - 1)} disabled={value === 1}>- 1</Button>
                <Button onClick={() => setValue(value + 1)}>+ 1</Button>
                <Button onClick={() => setValue(value + 15)}>+ 15</Button>
                <Button onClick={() => setValue(value + 100)}>+ 100</Button>
            </div>
        </DemoBlock>
    );
}