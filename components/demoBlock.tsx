import { ReactNode } from 'react';
import { cn } from '../lib/utils';

export interface DemoBlockProps {
  /**
   * Title of the demo block
   */
  title?: string;
  
  /**
   * Description of the demo
   */
  description?: string;
  
  /**
   * The demo component to render
   */
  children: ReactNode;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Additional CSS classes for the container
   */
  containerClassName?: string;
  
  /**
   * Whether to show a border around the demo
   * @defaultValue true
   */
  showBorder?: boolean;
  
  /**
   * Background style for the demo area
   * @defaultValue 'default'
   */
  background?: 'default' | 'dots' | 'grid' | 'none';
  
  /**
   * Whether to disable overflow-hidden on the outer container
   * Useful when you need sticky positioning or other overflow behaviors
   * @defaultValue false
   */
  disableOverflowHidden?: boolean;
}

export function DemoBlock({
  title,
  description,
  children,
  className,
  containerClassName,
  showBorder = true,
  background = 'dots',
  disableOverflowHidden = false,
}: DemoBlockProps) {
  const backgroundClasses = {
    default: 'bg-fd-background',
    dots: 'bg-fd-background bg-[radial-gradient(circle_at_1px_1px,rgb(163_163_163_/_0.15)_1px,transparent_0)] bg-[size:20px_20px]',
    grid: 'bg-fd-background bg-[linear-gradient(to_right,rgb(163_163_163_/_0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgb(163_163_163_/_0.1)_1px,transparent_1px)] bg-[size:20px_20px]',
    none: '',
  };

  return (
    <div className='flex flex-col gap-2'>
      {(title || description) && (
        <div className="">
          {title && (
            <h3 className="text-base font-semibold text-fd-foreground mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-fd-muted-foreground mb-0">{description}</p>
          )}
        </div>
      )}
    <div
      className={cn(
        'my-6 rounded-xl shadow-2xl shadow-fd-card',
        showBorder && 'border border-fd-border shadow-sm',
        !disableOverflowHidden && 'overflow-hidden',
        className,
      )}
    >
      <div
        className={cn(
          'relative p-6 min-h-[200px] h-fit flex items-center justify-center',
          backgroundClasses[background],
          containerClassName,
        )}
      >
        {children}
      </div>
    </div>
    </div>
  );
}