'use client';

import { IBM_Plex_Serif } from 'next/font/google';
import '@/app/globals.css' 
import {HeroUIProvider} from "@heroui/react";
import { Toaster } from 'react-hot-toast';
import SpinnerLoader from './components/Loaders';

const ibm_plex_serif = IBM_Plex_Serif({ subsets: ['latin'], weight: ['200', '300', '400', '500', '600'] });

// export const metadata = {
//   title: 'my sea drive',
//   description: 'Home of your diving media, for your entire diving lifetime!',
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={ibm_plex_serif.className}>
        <HeroUIProvider>
            {children}
            <SpinnerLoader/>
        </HeroUIProvider>
        <Toaster position="bottom-center" 
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