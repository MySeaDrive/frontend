'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import FileUploadArea from '@/app/components/FileUploadArea';


export default function DiveDetails({ id }) {

  const [dive, setDive] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchDive = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dives/${id}`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dive');
        }

        const diveData = await response.json();
        setDive(diveData);
      } catch (error) {
        console.error('Error fetching dive:', error);
        // Handle error (e.g., show error message to user)
      } finally {
        setLoading(false);
      }
    };

    fetchDive();
  }, [id, router, supabase]);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!dive) {
    return <div>Dive not found</div>;
  }

  return (
    <div className="container flex">


        <div className="w-3/4 mx-4 my-8">
            <div className="bg-white shadow rounded-lg p-4">
                <Link href="/dashboard" className="text-blue-500 hover:underline mb-4 block">
                    ← Back
                </Link>
                <h2 className="text-2xl font-bold mb-2">{dive.name} </h2>
                <p className="text-gray-500 mb-4">{dive.location} - {dive.date}</p>
            
            <div className="grid grid-cols-6 gap-4 mb-4">
                {[1, 2, 3].map((media, index) => (
                <div key={index} className="bg-gray-200 aspect-video flex items-center justify-center">
                    <img 
                    src='/dive_placeholder.webp' />
                    </div>
                ))}
            </div>
            
            <FileUploadArea diveId={dive.id}/>    

            </div>
        </div>
        
        <div className='w-1/4 mx-4 my-8'>
            <div className="bg-white shadow rounded-lg p-4">
                <h2 className='text-xl'>Dive Info</h2>
            </div>
        </div>

    </div>

  );
}