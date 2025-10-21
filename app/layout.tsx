import '@/app/global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Inter } from 'next/font/google';
import GlobalNoisyBackground from './components/GlobalNoisyBackground';
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  subsets: ['latin'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <Analytics />
      <body className="flex flex-col min-h-svh">
        <GlobalNoisyBackground />
        <RootProvider
          theme={{
            defaultTheme: 'dark',
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
