"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";


import { useBreakPoints } from "../../../hooks/use-breakpoints";
import { interFont, majorFont } from "@/lib/fonts";
import ThemeSwitcher from "../../../components/ui/theme-switcher";
import CustomKbd from "@/app/(home)/components/custom-kbd";



export const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Docs", href: "/docs/getting-started" },
  { name: "Contribute", href: "/docs/contribute" },
];

interface HomeMenuProps {
  children: React.ReactNode;
}

const HomeMenu: React.FC<HomeMenuProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);

  const { isMobile } = useBreakPoints();

  // Get the height of the navbar to dynamically hide/show it
  useEffect(() => {
    const updateHeight = () => {
      if (navRef.current) {
        const height = navRef.current.clientHeight;
        setNavHeight(height);
      }
    };

    updateHeight();
    const timeoutId = setTimeout(updateHeight, 100);

    return () => clearTimeout(timeoutId);
  }, []);


  useGSAP(() => {

    const paddingLeftRight = isMobile ? 12 : 30;
    
    const tl = gsap.timeline();

    tl.to('.trigger-name div:nth-child(2)', {
      opacity: open ? 1 : 0,
      ease: "power2.inOut",
    }, "<");
    tl.to('.trigger-name div:nth-child(1)', {
      opacity: open ? 0 : 1,
      ease: "power2.inOut",
    }, "<");

    tl.to(
      ".main-content",
      {
        paddingLeft: open ? paddingLeftRight : 0,
        paddingRight: open ? paddingLeftRight : 0,
        duration: 0.5,
        ease: "power2.inOut",
      },
      "<"
    );

    tl.to(
      ".main-content",
      {
        paddingTop: open ? (navHeight / 2) : 0,
        duration: 0.5,
        ease: "power2.inOut",
      },
      "<"
    );
    if(navHeight > 0){
      tl.to(
        navRef.current,
        {
          translateY: open ? 0 : -navHeight,
          ease: "power2.inOut",
          duration: 0.5,
        },
        "<"
      );
    }
    tl.to(
      ".nav-trigger-button span:nth-child(2)",
      {
        opacity: open ? 0 : 1,
        duration: 0.5,
        ease: "power2.inOut",
      },
      "<"
    );
    tl.to(
      ".nav-trigger",
      {
        top: open ? 16 : 24,
        duration: 0.5,
        ease: "power4.inOut",
      },
      "<"
    );

    tl.to(
      ".nav-trigger-button span:nth-child(1)",
      {
        ease: "power2.inOut",
        marginTop: open ? 6 : 0,
        duration: 0.5,
      },
      "<"
    );
    tl.to(
      ".corners",
      {
        opacity: open ? 1 : 0,
        duration: 0.4,
        ease: "power4.inOut",
        scale: open ? 1 : 1.2,
      },
      open ? "<+=0.1" : "-=0.5"
    );
  }, [open]);


  const simulate = () => {
    const isMac = /Mac|iPod|iPhone|iPad/i.test(navigator.platform);

    const keyboardEvent = new KeyboardEvent('keydown', {
      key: 'k',
      code: 'KeyK',
      bubbles: true,
      cancelable: true,
      metaKey: isMac,
      ctrlKey: !isMac,
    });

    document.dispatchEvent(keyboardEvent);
  };

  return (
    <>
      <NavTrigger setOpen={setOpen} open={open} />
      <div className="wrapper h-fit">
        <header
          ref={navRef}
          className="fixed top-0 left-0 z-80 w-full h-40 bg-[#212121] dark:bg-[#F8FAFC] flex items-center justify-between px-4 md:px-12 translate-y-[-100%]"
          role="banner"
        >
          <div className="relative flex h-full w-full gap-2 md:gap-8">
            <div className="h-full w-0 md:h-3/4 md:w-32 flex justify-center items-start md:items-center pt-3 md:pt-0">
              <span className={cn("text-4xl md:text-8xl font-bold text-fd-primary ml-12 md:ml-0", majorFont)}>R</span>
            </div>

            <div className="flex flex-1 flex-col items-center justify-start pt-6">
              <div
                className="h-11 w-full border-b border-[#A8A8A8]/50"
                aria-hidden="true"
              ></div>
              <div className="flex flex-1 items-center justify-center w-full gap-4 md:gap-12">
                <nav role="navigation" aria-label="Main navigation">
                  <ul className="flex items-center justify-center gap-3 md:gap-8">
                    {NAV_LINKS.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="text-[#F8FAFC] hover:text-[#A8A8A8] dark:text-[#0F0101] dark:hover:text-[#1E293B] text-xs md:text-base"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="flex items-center gap-2">
                  <button onClick={simulate} className={cn(
                    "h-7 md:h-9 px-3 hidden md:flex items-center justify-center gap-2 bg-fd-muted-foreground/30 text-fd-muted rounded-xl cursor-pointer",
                    interFont,
                    "hover:bg-fd-muted-foreground/40 transition-colors",
                  )}>
                      <CustomKbd />
                      <kbd className="text-sm text-fd-background">K</kbd> 
                  </button>
                  <ThemeSwitcher />
                </div>
              </div>
            </div>

            <div
              className="corners absolute bottom-0 left-0 right-0 w-full opacity-0 scale-110"
              aria-hidden="true"
            >
              <Corner className="absolute -bottom-[34px] -left-[2px] -rotate-90 text-[#212121] dark:text-[#F8FAFC] md:-left-[17px]" />
              <Corner className="absolute -bottom-[36px] -right-[4px] text-[#212121] dark:text-[#F8FAFC] md:-right-[18px]" />
            </div>
          </div>
        </header>
        <main className="main-content bg-[#212121] dark:bg-[#F8FAFC]">{children}</main>
      </div>
    </>
  );
};

const NavTrigger = ({
  setOpen,
  open,
}: {
  setOpen: (open: boolean) => void;
  open: boolean;
}) => {
  const onClick = () => {
    setOpen(!open);
  };

  return (
    <div className="nav-trigger fixed top-4 right-4 z-90 flex h-10 items-center justify-center gap-1 overflow-clip rounded-lg bg-[#212121] dark:bg-[#F8FAFC] p-2 md:top-6 md:right-8">
      <button
        onClick={onClick}
        className={cn(
          "trigger-name relative cursor-pointer rounded-md px-2 py-1 text-xs uppercase outline-0 transition-all duration-300 text-[#F8FAFC] dark:text-[#0F0101] md:text-sm",
          !open &&
            "hover:bg-[#A8A8A8]/20 peer-active:bg-[#A8A8A8]/30",
          "focus-visible:outline-none focus-visible:bg-[#A8A8A8]/20"
        )}
        aria-label="Reload website"
      >
        <div>MENU</div>
        <div className="opacity-0 absolute bottom-0 left-0 w-full h-full flex items-center justify-center">CLOSE</div>
      </button>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "nav-trigger-button cursor-pointer flex flex-col justify-center gap-1 rounded-md bg-[#212121] dark:bg-[#F8FAFC] p-2 outline-0",
          !open &&
            "hover:bg-[#A8A8A8]/20 peer-active:bg-[#A8A8A8]/30",
          "focus-visible:outline-none focus-visible:bg-[#A8A8A8]/20"
        )}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
      >
        <span
          className="block h-0.5 w-6 bg-[#F8FAFC] dark:bg-[#0F0101]"
          aria-hidden="true"
        ></span>
        <span
          className="block h-0.5 w-6 bg-[#F8FAFC] dark:bg-[#0F0101]"
          aria-hidden="true"
        ></span>
      </button>
    </div>
  );
};

const Corner = ({ className }: { className?: string }) => {
  return (
    <svg
      className={cn("h-9 w-8", className)}
      viewBox="0 0 8 9"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M0 0H8V8.5V9H7.98554C7.99513 8.83456 8 8.66785 8 8.5C8 3.97343 4.46169 0.273271 0 0.0144618V0Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default HomeMenu;