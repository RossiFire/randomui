"use client";

import { DemoBlock } from "@/components/demoBlock";
import { MouseFollowContent, MouseFollowItem } from "./mouse-follow";
import { useState } from "react";
import { Volume2Icon, VolumeOffIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import tailwindLogo from "@/public/assets/badges/tailwind_logo.png";


const EMOJIS = ["🤡", "🤔", "🤨", "🤓", "🤯", "🤠","👹", "💀", "👺", "👻", "👽", "👾", "🤖", "🎃", "👿", "💩", "👏", "👋", "👌", "👍", "👎", "👊", "👏", "👋", "👌", "👍", "👎", "👊"];


const FollowMouseDemo: React.FC = () => {

    const [isVolumeOn, setIsVolumeOn] = useState(false);



    const [selectedEmoji, setSelectedEmoji] = useState(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);

    const onMouseLeave = () => {
        setSelectedEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
    }

    return ( 
        <DemoBlock containerClassName="py-12">
            <div className="flex flex-col w-full items-center justify-around space-y-20">
                <h2 className="mt-0 text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-fd-primary to-fd-accent-foreground">
                    Mouse Follow
                </h2>
                <div className="w-full gap-4 flex justify-center">
                    <MouseFollowContent asChild>
                        <div className="flex cursor-pointer flex-col w-60 gap-4 bg-gradient-to-br from-fd-background to-fd-muted-foreground/10 border border-fd-muted-foreground/10 rounded-lg p-4">
                            <span className="text-base text-fd-primary">
                                Projects
                            </span>
                            <span className="text-sm text-fd-muted-foreground">
                                Hover this card to see the mouse follow effect
                            </span>
                            <MouseFollowItem offsetX={50} offsetY={30}>
                                <FollowMouseItemContent label="Discover" />
                            </MouseFollowItem>
                        </div>
                    </MouseFollowContent>
                    <MouseFollowContent asChild>
                        <div className="flex cursor-pointer flex-col w-60 gap-4 bg-gradient-to-br from-fd-background to-fd-muted-foreground/10 border border-fd-muted-foreground/10 rounded-lg p-4">
                            <span className="text-base text-fd-primary">
                                About
                            </span>
                            <span className="text-sm text-fd-muted-foreground">
                                It works smoothly even with multiple items
                            </span>
                            <MouseFollowItem offsetX={50} offsetY={30}>
                                <FollowMouseItemContent label="See more" />
                            </MouseFollowItem>
                        </div>
                    </MouseFollowContent>
                </div>
                <h2 className="mt-0 text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-fd-primary to-fd-accent-foreground">
                    Custom elements
                </h2>
                <div className="w-full gap-4 flex justify-center">
                    <MouseFollowContent asChild>
                        <div className="flex cursor-pointer flex-col w-60 gap-4 bg-gradient-to-br from-fd-background to-fd-muted-foreground/10 border border-fd-muted-foreground/10 rounded-lg p-4">
                            <span className="text-base text-fd-primary">
                                Icons
                            </span>
                            <span className="text-sm text-fd-muted-foreground">
                                You can actually place any element you want inside the MouseFollowItem
                            </span>
                            <MouseFollowItem offsetX={50} offsetY={30}>
                                <div className="flex items-center gap-2 relative overflow-hidden rounded-full size-10 p-2">
                                    <Image src={tailwindLogo} alt="Tailwind CSS" fill className="object-contain !m-0" />
                                </div>
                            </MouseFollowItem>
                        </div>
                    </MouseFollowContent>
                    <MouseFollowContent asChild>
                        <div
                        onMouseLeave={onMouseLeave}
                        className="flex cursor-pointer flex-col w-60 gap-4 bg-gradient-to-br from-fd-background to-fd-muted-foreground/10 border border-fd-muted-foreground/10 rounded-lg p-4">
                            <span className="text-base text-fd-primary">
                                Dynamic
                            </span>
                            <span className="text-sm text-fd-muted-foreground">
                                You can play with it to create funny effects like this (Enter and leave the card more than once)
                            </span>
                            <MouseFollowItem offsetX={25} offsetY={25}>
                                {selectedEmoji}
                            </MouseFollowItem>
                        </div>
                    </MouseFollowContent>
                </div>
                <h2 className="mt-0 mb-2 text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-fd-primary to-fd-accent-foreground">
                    Different positions
                </h2>
                <p className="text-sm text-fd-muted-foreground text-center">
                    You can use the offsetX and offsetY props to position the item where you want.
                </p>
                <div className="w-full gap-4 flex justify-center">
                    <MouseFollowContent asChild>
                        <div onClick={() => setIsVolumeOn(!isVolumeOn)} className="flex cursor-none select-none flex-col w-60 gap-4 bg-gradient-to-br from-fd-background to-fd-muted-foreground/10 border border-fd-muted-foreground/10 rounded-lg p-4">
                            <span className="text-base text-fd-primary">
                                Center
                            </span>
                            <span className="text-sm text-fd-muted-foreground">
                                This items is centered to the mouse cursor
                            </span>
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
                            <span className="text-sm text-fd-muted-foreground"> This item is positioned at the top left of the mouse cursor</span>
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

export { FollowMouseDemo };