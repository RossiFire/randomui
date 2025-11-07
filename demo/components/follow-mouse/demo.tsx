"use client";

import { DemoBlock } from "@/components/demoBlock";
import { MouseFollowContent, MouseFollowItem } from "./follow-mouse";
import { useState } from "react";
import { Volume2Icon, VolumeOffIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FollowMouseDemoProps {
    
}
 
const FollowMouseDemo: React.FC<FollowMouseDemoProps> = () => {

    const [isVolumeOn, setIsVolumeOn] = useState(false);

    return ( 
        <DemoBlock containerClassName="py-12">
            <div className="flex flex-col w-full items-center justify-around space-y-20">
                <h2 className="mt-0 text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-fd-primary to-fd-accent-foreground">
                    Follow Mouse
                </h2>
                <MouseFollowContent asChild>
                    <div className="flex cursor-pointer flex-col w-60 pb-8 gap-4 bg-gradient-to-br from-fd-background to-fd-muted-foreground/10 border border-fd-muted-foreground/10 rounded-lg p-4">
                        <div className="flex flex-col gap-2">
                            <span className="text-base text-fd-primary">
                                Projects
                            </span>
                            <span className="text-sm text-fd-muted-foreground">
                                Hover this card to see the mouse follow effect
                            </span>
                        </div>
                    <MouseFollowItem offsetX={50} offsetY={30}>
                        <FollowMouseItemContent label="Read more" />
                    </MouseFollowItem>
                    </div>
                </MouseFollowContent>
                <h2 className="mt-0 text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-fd-primary to-fd-accent-foreground">
                    With multiple items
                </h2>
                <div className="w-full gap-4 flex justify-center">
                    <MouseFollowContent asChild>
                        <div className="flex cursor-pointer flex-col w-60 gap-4 bg-gradient-to-br from-fd-background to-fd-muted-foreground/10 border border-fd-muted-foreground/10 rounded-lg p-4">
                            <div className="flex flex-col gap-2">
                                <span className="text-base text-fd-primary">
                                    It works smoothly
                                </span>
                            </div>
                            <MouseFollowItem offsetX={50} offsetY={30}>
                                <FollowMouseItemContent label="See item 1" />
                            </MouseFollowItem>
                        </div>
                    </MouseFollowContent>
                    <MouseFollowContent asChild>
                        <div className="flex cursor-pointer flex-col w-60 gap-4 bg-gradient-to-br from-fd-background to-fd-muted-foreground/10 border border-fd-muted-foreground/10 rounded-lg p-4">
                            <div className="flex flex-col gap-2">
                                <span className="text-base text-fd-primary">
                                    With multiple items
                                </span>
                            </div>
                            <MouseFollowItem offsetX={50} offsetY={30}>
                                <FollowMouseItemContent label="See item 2" />
                            </MouseFollowItem>
                        </div>
                    </MouseFollowContent>
                </div>
                <h2 className="mt-0 mb-2 text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-fd-primary to-fd-accent-foreground">
                    With different positions
                </h2>
                <p className="text-sm text-fd-muted-foreground text-center">
                    You can use the offsetX and offsetY props to position the item where you want.
                </p>
                <div className="w-full gap-4 flex flex-col items-center justify-center mt-4">
                    <MouseFollowContent asChild>
                        <div onClick={() => setIsVolumeOn(!isVolumeOn)} className="aspect-video flex flex-col items-center justify-center w-60 gap-4 bg-gradient-to-br from-fd-background to-fd-muted-foreground/10 border border-fd-muted-foreground/10 rounded-lg p-4">
                            <div className="flex flex-col gap-2">
                                <span className="text-base text-fd-primary select-none">
                                    Toggle volume
                                </span>
                                <span className="text-sm text-fd-muted-foreground mx-auto">Center item</span>
                            </div>
                            <MouseFollowItem>
                                <CenterItemContent isVolumeOn={isVolumeOn} />
                            </MouseFollowItem>
                        </div>
                    </MouseFollowContent>
                    <MouseFollowContent asChild>
                        <div className="flex flex-col w-60 gap-4 bg-gradient-to-br from-fd-background to-fd-muted-foreground/10 border border-fd-muted-foreground/10 rounded-lg p-4">
                            <div className="flex flex-col gap-2">
                                <span className="text-base text-fd-primary">
                                    Top left
                                </span>
                            </div>
                            <MouseFollowItem offsetX={-40} offsetY={-20}>
                                <FollowMouseItemContent label="Click me" />
                            </MouseFollowItem>
                        </div>
                    </MouseFollowContent>
                </div>
            </div>
        </DemoBlock>
     );
}

const FollowMouseItemContent = ({ label }: { label: string }) => {
    return (
        <div className="rounded-lg text-xs bg-fd-muted-foreground/10 backdrop-blur-sm border border-fd-muted-foreground/10 py-1 px-2">
      <div className="text-transparent bg-clip-text bg-gradient-to-r from-fd-primary to-fd-accent-foreground">{label}</div>
    </div>
  );
};

const CenterItemContent = ({ isVolumeOn }: { isVolumeOn: boolean }) => {


    return (
        <div className={cn("rounded-full aspect-square text-xs p-6 border-2 border-dashed border-fd-muted-foreground/20 transition-all duration-150", isVolumeOn && "border-fd-primary/50 text-fd-primary")}>
            <Volume2Icon className={cn("size-4 text-fd-primary transition-all duration-150 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2", !isVolumeOn && "scale-0 opacity-0")} />
            <VolumeOffIcon className={cn("size-4 text-fd-primary transition-all duration-150 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2", isVolumeOn && "scale-0 opacity-0")} />
    </div>
  );
};

export default FollowMouseDemo;