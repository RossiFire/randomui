"use client";

import { DemoBlock } from "@/components/demoBlock";
import RippleButton from "./RippleButton";
import RippleButtonDesignSystem from "./RippleButtonDesignSystem";


const RippleButtonDemo: React.FC = () => {


    return ( 
        <DemoBlock className="m-0">
            <div className="min-h-52 flex items-center justify-center">
                <RippleButton aria-label="I'm a ripple button" rippleClassName="size-24">
                    I'm cool as fuck
                </RippleButton>
            </div>
        </DemoBlock>
     );
}
 

const RippleButtonDesignSystemDemo: React.FC = () => {
    return (
        <DemoBlock className="m-0">
            <div className="min-h-52 flex items-center justify-center">
                <RippleButtonDesignSystem aria-label="I'm a ripple button" rippleClassName="size-16">
                    I'm cool as fuck
                </RippleButtonDesignSystem>
            </div>
        </DemoBlock>
    )
}

export { RippleButtonDemo, RippleButtonDesignSystemDemo };