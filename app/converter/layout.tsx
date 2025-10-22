import { Metadata } from "next";

interface ConverterLayoutProps {
    children: React.ReactNode;
}
export const metadata: Metadata = {
  title: "Random UI - Code Converter",
  description: "Convert your code to Random UI code",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const ConverterLayout: React.FC<ConverterLayoutProps> = ({ children }) => {
    return <>{children}</>;
}
 
export default ConverterLayout;