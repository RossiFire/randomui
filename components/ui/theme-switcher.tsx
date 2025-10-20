import { Moon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useHydration } from "@/hooks/use-hydration";
import { cn } from "@/lib/utils";

const ThemeSwitcher = ({className}: {className?: string}) => {
  const { theme, setTheme } = useTheme();
  const isMounted = useHydration();

  const sunRef = useRef<SVGSVGElement>(null);
  const moonRef = useRef<SVGSVGElement>(null);

  useEffect(()=>{
    setTimeout(() => {
      if(theme === "light"){
        gsap.set(moonRef.current, { opacity: 0, rotation: -45, scale: 0.9 });
      } else {
        gsap.set(sunRef.current, { opacity: 0, rotation: -45, scale: 0.9 });
      }
    }, 500);
  },[sunRef, moonRef])


  useGSAP(() => {

    if (!moonRef.current || !sunRef.current) return;

    const toAnimate = theme === "light" ? sunRef.current : moonRef.current;
    const toHide = theme === "light" ? moonRef.current : sunRef.current;

    gsap.to(toAnimate,{
      opacity: 1,
      rotation: 0,
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
      delay: 0.2
    })

    gsap.to(toHide,{
      opacity: 0,
      rotation: theme === "light" ? 90 : -90,
      scale: 0.9,
      duration: 0.3,
      ease: "power2.in",
    })

  }, [theme]);


  if(!isMounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(
        "size-7 md:size-9 p-0 border-none relative cursor-pointer bg-fd-muted-foreground/30 border border-fd-muted-foreground/80 text-fd-muted rounded-xl",
        "hover:bg-fd-muted-foreground/40 transition-colors",
        className
        )}
    >
      <Moon
        id="moon"
        className={cn("size-4 abs-center", theme === "light" && "opacity-0 scale-90 rotate-3")}
        ref={moonRef}
      />
      <SunIcon
        id="sun"
        className={cn("size-4 abs-center", theme === "dark" && "opacity-0 scale-90 rotate-3")}
        ref={sunRef}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};

export default ThemeSwitcher;