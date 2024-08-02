'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Input, Card, Button } from "@nextui-org/react";
import toast from 'react-hot-toast';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
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

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    });

    if (error) {
      setLoading(false);
      toast.error('Could not log you in');
    } else {
      const redirectTo = searchParams.get('redirectedFrom') || '/dashboard';
      router.push(redirectTo);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      
      <Card className="w-3/4 max-w-md z-10 p-8 bg-white bg-opacity-10 backdrop-blur-md">
        <form onSubmit={handleLogin} >
          <h2 className="text-3xl font-semibold mt-8 mb-16 text-center text-white">Login to MySeaDrive</h2>
          
          <Input
            clearable
            bordered
            fullWidth
            size="lg"
            label="Email"
            contentLeft={<i className="fas fa-envelope" />}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4"
            name='email'
            isInvalid={errors.username}
            errorMessage={errors.username ? "Email is required" : ""}
          />
          <Input
            type='password'
            clearable
            bordered
            fullWidth
            size="lg"
            label="Password"
            contentLeft={<i className="fas fa-lock" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-6"
            name='password'
            isInvalid={errors.password}
            errorMessage={errors.password ? "Password is required" : ""}
          />
          <Button
            auto
            shadow
            type="submit"
            color="primary"
            isLoading={loading}
            className="w-full font-bold uppercase py-6"
          >
            {loading ? 'Logging in...' : 'Dive In'}
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
        <source src="https://assets.myseadrive.com/static/bg_video_compressed.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <Login />
    </Suspense>
  )
}