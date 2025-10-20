"use client";

import { XIcon, MenuIcon, Instagram, Mail, Phone, Linkedin, Facebook, Twitter } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import Magnet from "../magnet/magnet";
import { Button } from "@/components/ui/button";
import { interFont } from "@/lib/fonts";


const MENU_OPTIONS: OptionItem[] = [
    {
        id: "about",
        label: "About",
        longLabel: "About myself & this project",
    },
    {
        id: "contacts",
        label: "Contacts",
        longLabel: "Contacts & socials",
    },
    {
        id: "who",
        label: "Who",
        longLabel: "Who let the dogs out?",
    },
];

export type OptionItem = {
  id: string;
  label: string;
  longLabel?: string;
};

const FloatingMenu: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentOption, setCurrentOption] = useState<OptionItem | null>(null);

  const isCurrentAnimating = useRef<boolean>(false);
  const optionsRefs = useRef<HTMLButtonElement[]>([]);

  /**
   * Reusable function to fade out the menu panel and set the openLink to null
   * @param onComplete
   * @param duration
   */
  const fadeOutOptionsPanel = (onComplete: () => void) => {
    const fadeOutTl = gsap.timeline();
    fadeOutTl
      .to("#menu-options", {
        opacity: 0,
        duration: 0.2,
        y: 10,
        ease: "expo.out",
        filter: "blur(10px)",
      })
      .to(
        "#menu-options",
        {
          duration: 0,
          onComplete: () => {
            fadeOutTl.kill();
            onComplete();
          },
        },
        "+=0.5"
      );
  };

  // To focus the first menu option when the menu is opened
  useEffect(() => {
    if (isMenuOpen && optionsRefs.current[0]) {
      optionsRefs.current[0].focus();
    }
  }, [isMenuOpen]);

  // To navigate through the menu options and close the menu via keyboard
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsMenuOpen(false);
      if (currentOption)
        fadeOutOptionsPanel(() => {
          setCurrentOption(null);
        });
      if (
        document.activeElement &&
        document.activeElement instanceof HTMLElement
      ) {
        document.activeElement.blur();
      }
    }

    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      const currentIndex = optionsRefs.current.findIndex(
        (ref) => ref === document.activeElement
      );
      if (currentIndex === -1) return;

      const nextIndex =
        e.key === "ArrowRight"
          ? Math.min(currentIndex + 1, optionsRefs.current.length - 1)
          : Math.max(currentIndex - 1, 0);

      if (nextIndex !== currentIndex) {
        optionsRefs.current[nextIndex]?.focus();
      }
    }
  };

  // Core GSAP hook listening for Menu open/close
  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set("#core-panel", {
          pointerEvents: isMenuOpen ? "auto" : "none",
        });
        gsap.set(".menu_option", { pointerEvents: isMenuOpen ? "auto" : "none" });
      },
    });

    tl.to(".ham-icon", {
      opacity: isMenuOpen ? 0 : 1,
      scale: isMenuOpen ? 0 : 1,
      duration: isMenuOpen ? 0.2 : 0.3,
      rotation: isMenuOpen ? 180 : 0,
      ease: isMenuOpen ? "expo.out" : "back.out(1.7)",
    });
    tl.to(
      ".x-icon",
      {
        opacity: isMenuOpen ? 1 : 0,
        scale: isMenuOpen ? 1 : 0.8,
        rotation: isMenuOpen ? 180 : 0,
        duration: 0.2,
        ease: isMenuOpen ? "back.out(1.7)" : "expo.in",
      },
      "<"
    );
    tl.to(
      "#core-panel",
      {
        opacity: isMenuOpen ? 1 : 0,
        filter: isMenuOpen ? "blur(0px)" : "blur(10px)",
        y: isMenuOpen ? 0 : 10,
        duration: 0.5,
        ease: isMenuOpen ? "expo.out" : "expo.in",
      },
      "<"
    );

    tl.to(
      ".menu_option",
      {
        opacity: isMenuOpen ? 1 : 0,
        filter: isMenuOpen ? "blur(0px)" : "blur(10px)",
        x: isMenuOpen ? 0 : 40,
        duration: 0.3,
        stagger: 0.1,
        ease: isMenuOpen ? "expo.out" : "expo.in",
      },
      "<+=0.1"
    );
  }, [isMenuOpen]);

  const openOption = (option: OptionItem) => {
    if (currentOption && currentOption.id === option.id) return;
    if (isCurrentAnimating.current) return;

    const fadeInAnimation = () => {
      setCurrentOption(option);
      const fadeAnimation = gsap.to("#menu-options", {
        opacity: 1,
        duration: 0.2,
        y: 0,
        ease: "expo.out",
        filter: "blur(0px)",
        onComplete: () => {
          fadeAnimation.kill();
          isCurrentAnimating.current = false;
        },
      });
    };

    isCurrentAnimating.current = true;

    if (currentOption) fadeOutOptionsPanel(fadeInAnimation);
    else fadeInAnimation();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);

    if (currentOption)
      fadeOutOptionsPanel(() => {
        setCurrentOption(null);
      });
  };

  const closeOptionsPanel = () => {
    const tl = gsap.timeline();

    tl.to("#menu-options", {
      opacity: 0,
      duration: 0.2,
      y: 10,
      ease: "expo.out",
      filter: "blur(10px)",
    })
      // To wait for the menu options to fade out
      .to(
        "#menu-options",
        {
          duration: 0,
          onComplete: () => {
            setCurrentOption(null);
            tl.kill();
          },
        },
        "+=0.5"
      );
  };

  return (
    <nav
      role="navigation"
      aria-label="Main Menu"
      className={cn(
        // Layout & positioning
        "absolute top-8 right-8 z-[999]",
        // Flexbox
        "flex flex-col items-end gap-2 w-84",
        // Interactive states
        !isMenuOpen && "pointer-events-none",
        interFont
      )}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center justify-end gap-2">
        <nav
          className={cn(
            // Flexbox
            "flex items-center gap-2",
            // Interactive states
            !isMenuOpen && "pointer-events-none"
          )}
          role="tablist"
          aria-label="Menu options"
        >
          {MENU_OPTIONS.map((link, index) => (
            <button
              role="tab"
              ref={(el) => {
                optionsRefs.current[index] = el!;
              }}
              key={link.id}
              onClick={() => openOption(link)}
              aria-expanded={currentOption?.id === link.id}
              aria-controls={`option-${link.label.toLowerCase().replace(/ /g, "-")}`}
              aria-haspopup="true"
              aria-selected={currentOption?.id === link.id}
              className={cn(
                // Base styles
                "menu_option text-sm dark:text-white text-[#2b2a2a]",
                // Layout & sizing
                "w-fit rounded-xl py-1 px-3",
                // Background & borders
                "dark:bg-white/5 border dark:border-white/5 backdrop-blur-sm bg-black/20 border-black/20",
                // Interactive states
                "cursor-pointer transition-all duration-500",
                "hover:border-transparent hover:dark:bg-white/10",
                "focus:outline-none focus:border-black focus:dark:border-white/50",
                // Animation states
                "opacity-0 blur-[10px] translate-x-10 pointer-events-auto",
                // Active state
                currentOption?.id === link.id && "dark:bg-white/10 bg-black/30"
              )}
            >
              {link.label}
            </button>
          ))}
        </nav>
        <Magnet isActive={!isMenuOpen} className="flex">
          <button
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="core-panel menu-options"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className={cn(
              // Layout
              "button-menu size-8 md:size-10 text-sm cursor-pointer relative z-30 aspect-square rounded-full backdrop-blur-sm pointer-events-auto",
              // Colors
              "bg-black/20 dark:bg-white/5 border border-black/20 dark:border-white/5 text-[#2b2a2a] dark:text-white",
              // Interactive states
              "transition-all duration-500",
              "hover:border-transparent hover:bg-black/30 hover:dark:bg-white/10",
              "focus:outline-none focus:border-black focus:dark:border-white/50",
            )}
          >
            <XIcon
              className="x-icon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 size-4 md:size-6"
              aria-hidden="true"
            />
            <MenuIcon
              className="ham-icon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 size-4 md:size-6"
              aria-hidden="true"
            />
          </button>
        </Magnet>
      </div>

      <div
        id="core-panel"
        role="region"
        aria-label="Core panel"
        className={cn(
          // Layout
          "w-full rounded-xl overflow-hidden",
          "backdrop-blur-sm opacity-0 blur-[10px] translate-y-5",
          // Colors
          "bg-black/20 dark:bg-white/5 border border-black/20 dark:border-white/5 transition-colors duration-500",
          // Interactive states
          "hover:bg-black/30 hover:dark:bg-white/10",
          !isMenuOpen && "pointer-events-none"
        )}
        aria-hidden={!isMenuOpen}
      >
        <div
          className={cn(
            // Base styles
            "text-sm text-[#2b2a2a] dark:text-white",
            // Layout
            "flex flex-col gap-2 p-3",
            // Interactive states
            "transition-all duration-500 hover:border-transparent"
          )}
        >
                      <span className="text-lg">Let's get in touch!</span>
          <span className="text-[#545454] dark:text-[#949494]">
            Keep updated with the latest news and releases from our team!
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="w-full border-b border-white/5 !py-1 focus:outline-none focus:border-white/20"
              placeholder="example@email.com"
            />
            <Button
              className={cn(
                // Base styles
                "text-xs",
                // Layout
                "rounded-lg p-2",
                // Background & borders
                "bg-white/5 border border-white/5 backdrop-blur-sm text-[#2b2a2a] dark:text-white",
                // Interactive states
                "hover:bg-white/10"
              )}
            >
              Subscribe
            </Button>
          </div>
        </div>
      </div>
      <div
        id="menu-options"
        role="region"
        aria-label={`Option ${currentOption?.label}`}
        aria-live="polite"
        className={cn(
          // Base styles
          "text-sm",
          // Layout
          "w-full min-h-10 flex flex-col gap-4 rounded-xl p-3",
          "opacity-0 translate-y-2.5 blur-[10px]",
          // Colors
          "backdrop-blur-sm bg-black/20 dark:bg-white/5 border border-black/20 dark:border-white/5",
          // Interactive states
          "transition-all duration-500 hover:border-transparent hover:dark:bg-white/10 hover:bg-black/30",
          (!currentOption || !isMenuOpen) && "invisible pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between w-full text-[#545454] dark:text-[#949494]">
          <h2 className="text-sm !m-0">{currentOption?.longLabel ?? currentOption?.label}</h2>
          <button
            onClick={closeOptionsPanel}
            aria-label="Close options panel"
            className={cn(
              "text-sm cursor-pointer transition-all duration-200",
              "hover:text-black hover:dark:text-white focus:outline-none focus:scale-110 focus:text-black focus:dark:text-white"
            )}
          >
            <XIcon className="size-4" aria-hidden="true" />
          </button>
        </div>
        <OptionsPanelContent option={currentOption} />
      </div>
    </nav>
  );
};

const OptionsPanelContent = ({ option }: { option: OptionItem | null }) => {
  if (!option) return null;

  if (option.id === "about")
    return (
      <div
        className="w-full text-[#2b2a2a] dark:text-white"
        id={`option-${option.label.toLowerCase().replace(/ /g, "-")}`}
        aria-labelledby={`option-${option.label.toLowerCase().replace(/ /g, "-")}`}
      >
        <p>
          I should write something aboute myself and this project but I'm too lazy to do it.
          Actually this is tsx so you can add whatever you want here.
        </p>
      </div>
    );

  if (option.id === "contacts")
    return (
      <div
        className="w-full text-[#2b2a2a] dark:text-white space-y-4"
        id={`option-${option.label.toLowerCase().replace(/ /g, "-")}`}
        aria-labelledby={`option-${option.label.toLowerCase().replace(/ /g, "-")}`}
      >
        <div className="flex items-center gap-2">
          <Facebook className="size-4" />
          <Twitter className="size-4" />
          <Instagram className="size-4" />
          <Linkedin className="size-4" />
        </div>
        <div className="flex gap-8">
            <div className="flex gap-2 text-[#545454] dark:text-[#949494] items-center">
                <Phone className="size-4" />
                <span className="text-sm">+127 0 0 1</span>
            </div>
            <div className="flex gap-2 text-[#545454] dark:text-[#949494] items-center">
                <Mail className="size-4" />
                <span className="text-sm">example@email.com</span>
            </div>
        </div>
        <p>
          For any question or request, don&apos;t contact me on any of my Socials.
        </p>
      </div>
    );

  if (option.id === "who")
    return (
      <div
        className="w-full text-[#2b2a2a] dark:text-white"
        id={`option-${option.label.toLowerCase().replace(/ /g, "-")}`}
        aria-labelledby={`option-${option.label.toLowerCase().replace(/ /g, "-")}`}
      >
         <pre className={cn(
           "whitespace-pre-wrap break-words",
           "text-sm leading-relaxed",
           "w-full",
           interFont
         )}>
{`Who let the dogs out?
Who, who, who, who, who?
Who let the dogs out?
Who, who, who, who, who?
Who let the dogs out?
Who, who, who, who, who?
Who let the dogs out?

Well, the party was nice, the party was pumpin'
Heya, yippie yi yo
And everybody havin' a ball
Huh, huh, yippie yi yo
I tell the fellas start the name callin'
Yippie yi yo
And the girls respond to the call
I heard a woman shout out
`}
         </pre>
      </div>
    );
};

export default FloatingMenu;