import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import Header from '@/components/header';
import { getContent } from '@/services/contentService';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Teknoverse Unfolded',
  description: 'A high-tech animated showcase for a modern website named Teknoverse.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getContent();

  return (
    <html lang="en">
      <body className={cn('font-body antialiased', poppins.variable)}>
        <Header logoUrl={content.logoUrl} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
