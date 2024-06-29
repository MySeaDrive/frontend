import { Manrope } from 'next/font/google';
import './globals.css';
import { NextUIProvider } from '@nextui-org/react';
import Navigation from './components/Navigation';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata = {
  title: 'MySeaDrive',
  description: 'Home of your diving media, for your entire diving lifetime!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <NextUIProvider>
          <Navigation/>
          {children}
        </NextUIProvider>
      </body>
    </html>
  );
}