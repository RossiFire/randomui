// Map badge types to their actual filenames and extensions
import Image from "next/image";

export type Badge = "gsap" | "css" | "framer_motion" | "tailwind" | "typescript" | "nextjs" | "react";

const badgeConfig: Record<Badge, { filename: string; extension: string; label: string }> = {
    gsap: { filename: "gsap_logo", extension: "png", label: "GSAP" },
    css: { filename: "css_logo", extension: "png", label: "CSS" },
    framer_motion: { filename: "framer_motion_logo", extension: "svg", label: "Framer Motion" },
    tailwind: { filename: "tailwind_logo", extension: "png", label: "Tailwind CSS" },
    typescript: { filename: "typescript_logo", extension: "png", label: "TypeScript" },
    nextjs: { filename: "nextjs_logo", extension: "png", label: "NextJS" },
    react: { filename: "react_logo", extension: "png", label: "React" },
};

const TechBadge: React.FC<{ badge: Badge }> = ({ badge }) => {
    const { filename, extension, label } = badgeConfig[badge];
    const imagePath = `/assets/badges/${filename}.${extension}`;
    return (
        <div className="flex items-center gap-2 border border-fd-border rounded-lg py-1 px-3 bg-fd-secondary">
            <div className="size-6 relative">
                <Image src={imagePath} alt={label} fill className="object-contain !m-0" loading="lazy" />
            </div>
            <span className="text-sm text-fd-foreground whitespace-nowrap">{label}</span>
        </div>
    );
}

export default TechBadge;