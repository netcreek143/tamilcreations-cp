import type { Metadata } from 'next';
import { Lato, Playfair_Display } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import BottomNav from '@/components/layout/BottomNav';
import { CartProvider } from '@/lib/cart-context';
import { WishlistProvider } from '@/lib/wishlist-context';
import { Toaster } from 'sonner';

const lato = Lato({
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tamil Creations | Premium Sarees & Accessories',
  description: 'Your premier destination for exquisite sarees, fashion accessories, and traditional attire. Timeless elegance for every occasion.',
  keywords: ['sarees', 'accessories', 'Tamil Creations', 'traditional wear', 'fashion'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lato.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <SessionProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
              <BottomNav />
              <Toaster position="top-center" richColors />
            </WishlistProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
