import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { majorFont } from './fonts';
import { cn } from 'fumadocs-ui/utils/cn';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className={cn('text-lg font-bold text-fd-foreground', majorFont)}>Random UI</span>
      ),
    },
    githubUrl: "https://github.com/RossiFire/randomui",
    // see https://fumadocs.dev/docs/ui/navigation/links
    links: [],
  };
}
