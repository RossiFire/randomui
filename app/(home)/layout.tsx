export default function Layout({ children }: LayoutProps<'/'>) {
  return <div className='h-svh w-full overflow-hidden'>
    {children}
  </div>;
}
