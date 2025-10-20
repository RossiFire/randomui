"use client";
import { cn } from "@/lib/utils";
import useNoisyBackgroundStore from "../../store/noisy-background-store";

interface GlobalNoisyBackgroundProps {
  className?: string;
}

const GlobalNoisyBackground: React.FC<GlobalNoisyBackgroundProps> = ({ className }) => {

  const { isAnimationActive, active } = useNoisyBackgroundStore();

  return (
    active && <div
      className={cn(
        "pointer-events-none fixed inset-[0%] flex items-center justify-center z-[9999] overflow-hidden",
        className
      )}
    >
      <div
        style={{
          backgroundImage: "url('/assets/noisy-background/noisy_texture.webp')",
          flex: "none",
          width: "300%",
          maxWidth: "none",
          height: "300%",
          position: "absolute",
          backgroundSize: "256px",
          animation: isAnimationActive ? "noise 1s steps(1) infinite" : "none",
        }}
      ></div>
    </div>
  );
};

export default GlobalNoisyBackground;
