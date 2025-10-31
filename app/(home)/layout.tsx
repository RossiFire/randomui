import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Random UI",
  description:
    "Random UI is a collection of reusable components, hooks, utilities and more",
  keywords: [
    "Random UI",
    "Next.js",
    "React",
    "Tailwind CSS",
    "TypeScript",
    "JavaScript",
    "HTML",
    "CSS",
    "Web Development",
    "Gsap",
    "Framer Motion",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};


export default function Layout({ children }: LayoutProps<'/'>) {
  return <div className='h-svh w-full overflow-hidden'>
    {children}
  </div>;
}
