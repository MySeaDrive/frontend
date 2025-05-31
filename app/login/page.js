` tags. I will pay close attention to indentation, structure, and completeness.

```
<replit_final_file>
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button } from "@heroui/react";
import toast from 'react-hot-toast';
import useLoadingStore from '../store/loadingStore';
import Image from 'next/image';

function Login() {
  const {isLoading, setIsLoading} = useLoadingStore();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/__replauthuser');
        if (response.ok) {
          router.push('/dashboard');
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router, setIsLoading]);

  const handleReplitLogin = () => {
    window.addEventListener("message", authComplete);
    var h = 500;
    var w = 350;
    var left = screen.width / 2 - w / 2;
    var top = screen.height / 2 - h / 2;

    var authWindow = window.open(
      "https://replit.com/auth_with_repl_site?domain=" + location.host,
      "_blank",
      "modal=yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
        w +
        ", height=" +
        h +
        ", top=" +
        top +
        ", left=" +
        left
    );

    function authComplete(e) {
      if (e.data !== "auth_complete") {
        return;
      }

      window.removeEventListener("message", authComplete);
      authWindow.close();
      router.push('/dashboard');
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">

      <Card className="w-3/4 max-w-md z-10 p-8 bg-white bg-opacity-10 backdrop-blur-md">
        <div className='flex flex-col mt-8 mb-16 items-center justify-center'>
          <h2 className="text-3xl font-semibold text-center text-white">
          login to 
          </h2>
          <Image src="/logo_for_dark.webp" width="300" height="100" alt="logo"/>
        </div>

        <Button
          auto
          shadow
          onClick={handleReplitLogin}
          className="w-full font-bold py-6 button-text floating-input"
          disabled={isLoading}
        >
          {isLoading ? 'Diving in...' : 'Login with Replit'}
        </Button>
      </Card>
    </div>
  );
}

export default function LoginWrapper() {
  return (
    <Suspense>
      <video
        autoPlay
        loop
        muted
        className="absolute z-0 w-full h-full object-cover"
      >
        <source src="/bg_video_compressed.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <Login />
    </Suspense>
  )
}