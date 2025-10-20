import { DemoBlock } from "@/components/demoBlock";
import LenisProvider from "@/providers/LenisProvider";

interface StackedCardsDemoProps {
    
}
 
const StackedCardsDemo: React.FC<StackedCardsDemoProps> = () => {
    return ( 
        <LenisProvider>
            <DemoBlock className="m-0" disableOverflowHidden containerClassName="flex flex-col gap-12 py-20">
                <div className="flex flex-col gap-4 text-center">
                    <h1 className="text-2xl font-bold mb-0">Stacked Cards. No JavaScript - just Css</h1>
                    <h2 className="text-sm text-fd-muted-foreground mt-0">Scroll to see the effect</h2>
                </div>
                <div className="flex flex-col items-center">
                <div className="card w-96 h-[580px] rounded-3xl bg-red-300 sticky top-[50px] mb-12"></div>
                <div className="card w-96 h-[580px] rounded-3xl bg-green-400 sticky top-[75px] mb-6"></div>
                <div className="card w-96 h-[580px] rounded-3xl bg-violet-600 sticky top-[150px] mb-0"></div>
                </div>
                <div className="mt-20">
                    <p className="text-base text-fd-muted-foreground">
                        Another content here
                    </p>
                </div>
            </DemoBlock>
        </LenisProvider>
     );
}
 
export default StackedCardsDemo;