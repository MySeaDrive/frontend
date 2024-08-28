import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import useLoadingStore from '../store/loadingStore';

export async function fetchWithAuth(url, options = {}) {
  const setIsLoading = useLoadingStore.getState().setIsLoading;
  setIsLoading(true);

  try {
    const supabase = createClientComponentClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session');
    }

    const headers = {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      ...options,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if(response.status == 404) {
      throw new Error('404');
    }

    if (!response.ok) {
      throw new Error('API request failed');
    }

    return response.json();
  } finally {
    setIsLoading(false);
  }
}