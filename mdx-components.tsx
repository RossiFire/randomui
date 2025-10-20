import defaultMdxComponents from 'fumadocs-ui/mdx';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import type { MDXComponents } from 'mdx/types';
import { CodeBlock, Pre } from './components/codeblock';
import * as DemoComponents from './demo';
import { Alert } from './components/ui/alert';


// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    ...components,
    Alert: Alert,
    pre: ({ ref: _ref, ...props }) => (
      <CodeBlock {...props}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),
    wrapper: ({ children }) => (
      <div className="flex flex-col gap-4">
        {children}
      </div>
    ),
    ...DemoComponents,
  };
}




