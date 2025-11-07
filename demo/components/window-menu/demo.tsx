"use client";

import { DemoBlock } from "@/components/demoBlock";
import WindowMenu from "./window-menu";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2Icon, CheckIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const WindowMenuDemo: React.FC = () => {

    const [fullScreen, setFullScreen] = useState(false);


    return ( 
        <DemoBlock 
            className={cn("relative", fullScreen && "fixed inset-0 size-full")} 
            containerClassName="max-h-[900px] flex flex-col justify-start p-0"
        >
            <WindowMenu>
                <div className="w-full h-full bg-fd-background max-h-[700px] overflow-y-scroll overflow-x-hidden no-scrollbar">
                    <div className="h-[400px] grid place-items-center relative overflow-hidden text-center">
                        <img src="https://picsum.photos/id/29/1900/1080" alt="" className="size-full object-cover brightness-75" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                            <h1 className="font-bold !m-0 text-2xl md:text-3xl text-white">Window Menu</h1>
                            <h2 className="!m-0 ext-fd-muted text-base md:text-lg text-white">Accessible, animated and design-first menu component</h2>
                            <ThemeSwitcher />
                        </div>
                    </div>
                    <div className="text-center py-8">
                        <h3 className="text-3xl">Features</h3>
                        <div className="size-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-18 px-4 md:px-12">
                            <div className="bg-fd-muted rounded-lg p-6 flex flex-col items-start text-left gap-2 col-span-1">
                                <CheckCircle2Icon className="size-8 mb-6" />
                                <span className="text-lg font-bold text-fd-foreground">Accessible</span>
                                <span className="text-fd-muted-foreground text-sm">The menu is fully accessible, with ARIA attributes and Tab navigation.</span>
                            </div>
                            <div className="bg-fd-muted rounded-lg p-6 flex flex-col items-start text-left gap-2 col-span-1">
                                <CheckCircle2Icon className="size-8 mb-6" />
                                <span className="text-lg font-bold text-fd-foreground">Theme</span>
                                <span className="text-fd-muted-foreground text-sm">
                                    The menu is fully themeable, with light and dark mode already managed.
                                    It has opposite colors respect the current theme, to give it better contrast and enhance it&apos;s look and feel.
                                </span>
                            </div>
                            <div className="bg-fd-muted rounded-lg p-6 flex flex-col items-start text-left gap-2 col-span-1">
                                <CheckCircle2Icon className="size-8 mb-6" />
                                <span className="text-lg font-bold text-fd-foreground">Responsive</span>
                                <span className="text-fd-muted-foreground text-sm">The menu is fully responsive.</span>
                            </div>
                            <div className="bg-fd-muted rounded-lg p-6 flex flex-col items-start text-left gap-2 col-span-1">
                                <CheckCircle2Icon className="size-8 mb-6" />
                                <span className="text-lg font-bold text-fd-foreground">Ehm...</span>
                                <span className="text-fd-muted-foreground text-sm">I didn&apos;t know what to write here but I needed to fill the fourth column.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </WindowMenu>
      </DemoBlock>
     );
}

const ThemeSwitcher = () => {

    const { theme, setTheme } = useTheme();
  
    return (
      <Button
      className="flex items-center gap-2"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
        aria-label="Toggle theme"
        >
        Switch theme
        <SunIcon className={cn("size-4", theme === "dark" && "hidden")} />
        <MoonIcon className={cn("size-4", theme === "light" && "hidden")} />
      </Button>
    );
  };
  
export { WindowMenuDemo };