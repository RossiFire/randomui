import { DemoBlock } from "@/components/demoBlock"
import { cn } from "@/lib/utils";



const LiftTextDemo: React.FC = () => {

    return ( 
        <DemoBlock containerClassName="py-12 flex flex-col">
            <div className="flex flex-col gap-4 text-center">
                <h2 className="mt-0 mb-0 text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-fd-primary to-fd-accent-foreground">
                    Lift Text
                </h2>
                <h2 className="text-sm text-fd-muted-foreground mt-0">Hover to see the effect</h2>
            </div>
            <div className="flex flex-col justify-center items-center mt-12">
                <LiftText text="About" />
                <LiftText text="Projects" />
                <LiftText text="Services" />
                <LiftText text="Work with us" />
            </div>
        </DemoBlock>
    )
}




function LiftText({ className, text, ...props }: Omit<React.ComponentProps<"a">, "children"> & { text: string }) {
    return (
      <div className="overflow-hidden">
        <a
          className={cn(
            "text-white text-4xl uppercase no-underline font-medium leading-none cursor-pointer",
            "group",
            className
          )}
          style={{
            textShadow: "0 1.85ex 0",
          }}
          {...props}
        >
          {text.split("").map((char, index) => {
            if (char === " ") {
              return <span key={index}> </span>;
            }
            return (
              <span
                key={index}
                className="relative inline-block group-hover:animate-[lift-text-up_0.3s_forwards]"
                style={{
                  animationDelay: 'calc(sibling-index() * 0.02s)'
                }}
              >
                {char}
              </span>
            );
          })}
        </a>
      </div>
    );
  }
  




  export { 
    LiftTextDemo, 
 };
 
