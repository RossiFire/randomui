import '@/app/global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Inter } from 'next/font/google';
import GlobalNoisyBackground from './components/GlobalNoisyBackground';

const inter = Inter({
  subsets: ['latin'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-svh">
        <GlobalNoisyBackground />
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
