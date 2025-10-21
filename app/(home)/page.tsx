import Hero from './components/Hero';
import PixelBlast from '@/app/(home)/components/pixel-background';
import HomeMenu from "@/app/(home)/components/home-menu";

export default function HomePage() {

  return (
    <HomeMenu>
      <div className='relative h-svh w-full bg-fd-background overflow-hidden flex flex-col justify-center text-center'>
        <div className='fixed inset-0 h-full w-full z-[1] opacity-75'>
          <PixelBlast
            variant="circle"
            pixelSize={6}
            color="#B19EEF"
            patternScale={3}
            patternDensity={1.2}
            pixelSizeJitter={0.5}
            enableRipples
            rippleSpeed={0.4}
            rippleThickness={0.12}
            rippleIntensityScale={1.5}
            liquidStrength={0.12}
            liquidRadius={1.2}
            speed={0.6}
            edgeFade={0.25}
            transparent
          />
        </div>
        <Hero />
      </div>
    </HomeMenu>
  );
}
