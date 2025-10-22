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
        <span className={cn('text-lg bg-gradient-to-bl from-fd-primary to-fd-accent text-transparent bg-clip-text', majorFont)}>Random UI</span>
      ),
    },
    githubUrl: "https://github.com/RossiFire/randomui",
    // see https://fumadocs.dev/docs/ui/navigation/links
    links: [],
  };
}
