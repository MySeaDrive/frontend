
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/__replauthuser');
        if (response.ok) {
          const user = await response.json();
          if (user && user.id) {
            setSession(user);
          } else {
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      }
      setLoading(false);
    };

    checkSession();
  }, [router]);

  return { session, loading };
}
