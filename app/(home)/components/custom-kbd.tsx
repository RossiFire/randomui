"use client";

import { useOs } from "@/hooks/use-os";
import { cn } from "@/lib/utils";

interface CustomKbdProps {
    className?: string;
}
 
const CustomKbd: React.FC<CustomKbdProps> = ({ className }) => {

    const os = useOs();

    return (
        <kbd className={cn("text-sm text-fd-background", className)}>{os === "macos" ? "⌘" : "Ctrl"}</kbd>
    );
}
 
export default CustomKbd;