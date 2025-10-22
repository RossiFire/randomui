"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

import { useBreakPoints } from "../../hooks/use-breakpoints/use-breakpoints";
import logo from "@/public/assets/rui_logo_short.png";


export const NAV_LINKS = [
  { name: "Services", href: "/services" },
  { name: "About us", href: "/about" },
  { name: "Partners", href: "/partners" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

interface WindowMenuProps {
  children: React.ReactNode;
}

const WindowMenu: React.FC<WindowMenuProps> = ({ children }) => {
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

    gsap.set(".corners", {
      opacity: 0,
      scale: 1.2,
    });
    
    const tl = gsap.timeline();

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
        paddingTop: open ? navHeight : 0,
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
        duration: 0.2,
        ease: "power4.inOut",
        scale: open ? 1 : 1.2,
      },
      open ? "<+=0.3" : "-=0.5"
    );
  }, [open]);

  return (
    <>
      <NavTrigger setOpen={setOpen} open={open} />
      <div className="wrapper size-full">
        <header
          ref={navRef}
          className="absolute top-0 left-0 z-[2] w-full h-40 bg-[#212121] dark:bg-[#F8FAFC] flex items-center justify-between px-4 md:px-12 translate-y-[-100%]"
          role="banner"
        >
          <div className="relative flex h-full w-full gap-2 pt-6 md:gap-8">
            <div className="absolute left-0 top-0 h-16 w-12 md:relative md:h-3/4 md:w-32 overflow-hidden">
              <Image
                src={logo}
                alt="window menu logo"
                className="object-cover !m-0"
              />
            </div>

            <div className="flex flex-1 flex-col items-center justify-start">
              <div
                className="h-11 w-full border-b border-[#A8A8A8]/50"
                aria-hidden="true"
              ></div>
              <div className="flex flex-1 items-center justify-center w-full gap-4 md:gap-12">
                <nav role="navigation" aria-label="Main navigation">
                  <ul className="flex items-center justify-center gap-3 md:gap-8">
                    {NAV_LINKS.map((item) => (
                      <li key={item.name} className="list-none">
                        <Link
                          href={item.href}
                          className="no-underline text-[#F8FAFC] hover:text-[#A8A8A8] dark:text-[#0F0101] dark:hover:text-[#1E293B] text-xs md:text-base"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>

            <div
              className="corners absolute bottom-0 left-0 right-0 w-full"
              aria-hidden="true"
            >
              <Corner className="absolute -bottom-[34px] -left-[2px] -rotate-90 text-[#212121] dark:text-[#F8FAFC] md:-left-[17px]" />
              <Corner className="absolute -bottom-[36px] -right-[4px] text-[#212121] dark:text-[#F8FAFC] md:-right-[18px]" />
            </div>
          </div>
        </header>
        <main className="main-content bg-[#212121] dark:bg-[#F8FAFC] size-full">{children}</main>
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
  const onReload = () => {
    window.location.reload();
  };

  return (
    <div className="nav-trigger absolute top-4 right-4 z-[3] flex h-10 items-center justify-center gap-1 overflow-clip rounded-lg bg-[#212121] dark:bg-[#F8FAFC] p-2 md:top-6 md:right-8">
      <button
        onClick={onReload}
        className={cn(
          "trigger-name cursor-pointer rounded-md px-2 py-1 text-xs uppercase outline-0 transition-all duration-300 text-[#F8FAFC] dark:text-[#0F0101] md:text-sm",
          !open &&
            "hover:bg-[#A8A8A8]/20 peer-active:bg-[#A8A8A8]/30",
          "focus-visible:outline-none focus-visible:bg-[#A8A8A8]/20"
        )}
        aria-label="Reload website"
      >
        Website name
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

export default WindowMenu;
