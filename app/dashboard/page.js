'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';


export default function Dashboard() {
  const [dives, setDives] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchUserAndDives = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dives/`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        const data = await response.json();
        setDives(data);
      } else {
        router.push('/login/');
      }
    };

    fetchUserAndDives();
  }, [supabase, router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {dives.map((dive) => (
        <div className="bg-white shadow rounded-lg p-4 mb-16" key={dive.id}>
          <Link href={`/dashboard/dive/${dive.id}`} className="block">
            <h2 className="text-2xl font-bold mb-2">{dive.name} </h2>
            <p className="text-gray-500 mb-4">{dive.location} - {dive.date}</p>
          </Link>
          <div className="grid grid-cols-6 gap-4 mb-4">
            {dive.media_items.map((media, index) => (
              <div key={index} className="bg-gray-200 aspect-video flex items-center justify-center">
                
                <p>{media.filename}</p>

              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}