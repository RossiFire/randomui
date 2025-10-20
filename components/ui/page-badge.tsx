import TechBadge, { Badge } from "./tech-badge";


interface PageBadgeProps {
    badges: Badge[];
}
const PageBadge: React.FC<PageBadgeProps> = ({ badges }) => {
    return (
        <div className="flex gap-2 items-center">
            {badges.map((badge,i) => <TechBadge key={i} badge={badge} />)}
        </div>
    );
};

export default PageBadge;