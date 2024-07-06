import { Red_Hat_Display } from 'next/font/google';
import './globals.css';
import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';

const redHatDisplay = Red_Hat_Display({ subsets: ['latin'] });

export const metadata = {
  title: 'MySeaDrive',
  description: 'Home of your diving media, for your entire diving lifetime!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={redHatDisplay.className}>
        <NextUIProvider>
            {children}
        </NextUIProvider>
        <Toaster position="top-center" 
          reverseOrder={false} 
          toastOptions={
            {
              className:'',
              style: {
                background: 'rgba(255, 255, 255, 0.5)'
              }
            }} />
      </body>
    </html>
  );
}