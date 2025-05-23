'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Input, Card, Button, Tooltip } from "@heroui/react";
import toast from 'react-hot-toast';
import useLoadingStore from '../store/loadingStore';
import Image from 'next/image';
import { FaGoogle, FaTwitter } from 'react-icons/fa';
// import FaGoogle from 'react-icons/fa/faGoogle'
// import FaTwitter from 'react-icons/fa/faTwitter'


function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {isLoading, setIsLoading} = useLoadingStore();
  const [errors, setErrors] = useState({ username: false, password: false });
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      } else {
        setIsLoading(false);
      }
    };
    checkSession();
  }, [supabase, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({ username: false, password: false });

    // Check for empty fields
    if (!username) setErrors(prev => ({ ...prev, username: true }));
    if (!password) setErrors(prev => ({ ...prev, password: true }));

    // If any field is empty, don't proceed
    if (!username || !password) return;

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    });

    if (error) {
      setIsLoading(false);
      toast.error('Could not log you in');
    } else {
      const redirectTo = searchParams.get('redirectedFrom') || '/dashboard';
      router.push(redirectTo);
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setIsLoading(false);
      toast.error(`Could not log you in with ${provider}`);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      
      <Card className="w-3/4 max-w-md z-10 p-8 bg-white bg-opacity-10 backdrop-blur-md">
        <form onSubmit={handleLogin} >
          <div className='flex flex-col mt-8 mb-16 items-center justify-center'>
            <h2 className="text-3xl font-semibold text-center text-white">
            login to 
            </h2>
            <Image src="/logo_for_dark.webp" width="300" height="100" alt="logo"/>
          </div>


          <div className="flex items-center justify-center space-x-10 mb-6">
            
            <Button
              auto
              shadow
              isIconOnly
              onClick={() => handleSocialLogin('google')}
              className="rounded-full button-text bg-white h-16 w-16 text-xl bg-opacity-20 text-white"
            >
              <FaGoogle />

            </Button>

            <Tooltip content="Coming soon" placement="bottom">
              <Button
                auto
                shadow
                isIconOnly
                disabled={true}
                // onClick={() => handleSocialLogin('twitter')}
                className="rounded-full button-text bg-white h-16 w-16 text-xl bg-opacity-20 text-white"
              >
                <FaTwitter />
              </Button>
            </Tooltip>
          </div>

          <div className="text-center mt-10 mb-6 text-white">
            <span>Or</span>
          </div>

          <Input
            clearable
            bordered
            fullWidth
            size="md"
            label="email"
            contentLeft={<i className="fas fa-envelope" />}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4 floating-input"
            name='email'
            isInvalid={errors.username}
            errorMessage={errors.username ? "Email is required" : ""}
            disabled={isLoading}
          />
          <Input
            type='password'
            clearable
            bordered
            fullWidth
            size="md"
            label="password"
            contentLeft={<i className="fas fa-lock" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-6 floating-input"
            name='password'
            isInvalid={errors.password}
            errorMessage={errors.password ? "Password is required" : ""}
            disabled={isLoading}
          />
          <Button
            auto
            shadow
            type="submit"
            color="primary"
            isLoading={isLoading}
            className="w-full font-bold py-6 button-text floating-input"
            disabled={isLoading}
          >
            {isLoading ? 'Diving in...' : 'Dive In'}
          </Button>
        </form>
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