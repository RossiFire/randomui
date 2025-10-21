import { docs } from '@/.source';
import { type InferPageType, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { FlameIcon, icons } from 'lucide-react';
import { createElement } from 'react';

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  plugins: [
    lucideIconsPlugin(),
    {
      transformPageTree: {
        file(node, file) {
          if(file){
            const fileData = this.storage.read(file);
            if(fileData && (fileData.data as unknown as { hot_item?: boolean }).hot_item) {
              node.name = <div className='flex gap-2 items-center'>
                {node.name}
                <FlameIcon className="size-4 fill-fd-error/50 stroke-fd-error" />
              </div>
            }
          }
          return node;
        },
      },
    },
  ],
  icon(icon) {
    if (!icon) {
      return;
    }
    if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
  },
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}
