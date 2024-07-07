'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import FileUploadArea from '@/app/components/FileUploadArea';
import { fetchWithAuth } from '@/app/utils/api';
import { useSession } from '@/app/hooks/useSession';
import { useRouter } from 'next/navigation';
import { FaPlay, FaEdit, FaTrash, FaTimes, FaCheckCircle, FaTimesCircle, FaArrowCircleLeft, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function DiveDetails({ id }) {
  const [dive, setDive] = useState(null);
  const { session, loading: sessionLoading } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeMediaItem, setActiveMediaItem] = useState(null);
  const router = useRouter();
  const [activeMediaKey, setActiveMediaKey] = useState(0);

  const handleMediaClick = (media) => {
    setActiveMediaItem(media);
    setActiveMediaKey(prevKey => prevKey + 1);
  };

  useEffect(() => {
    if (session) {
      fetchWithAuth(`/dives/${id}`)
        .then(setDive)
        .catch(console.error);
    }
  }, [id, session]);

  const handleEditClick = () => {
    setEditedName(dive.name);
    setIsEditing(true);
  };

  const handleSaveName = async () => {
    try {
      const updatedDive = await fetchWithAuth(`/dives/${id}`, {
        method: 'PATCH',
        body: { name: editedName }
      });
      setDive(updatedDive);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating dive name:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setIsDeleting(true);
  };

  const handleConfirmDelete = async (deleteMedia = false) => {
    try {
      await fetchWithAuth(`/dives/${id}?delete_media=${deleteMedia}`, {
        method: 'DELETE',
      });
      toast.success('Dive deleted');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting dive:', error);
    }
    setIsDeleting(false);
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);
  };

  const renderMediaItem = (media) => {
    const thumbnail = media.thumbnails && media.thumbnails.length > 0 ? media.thumbnails[0] : media.raw_url;
    return (
      <div 
        className="relative aspect-w-16 aspect-h-9 cursor-pointer group overflow-hidden rounded"
        onClick={() => handleMediaClick(media)}
      >
        <img 
          src={thumbnail} 
          alt={media.filename}
          className="w-full h-full object-cover object-center"
        />
        {media.mime_type.startsWith('video/') && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <FaPlay className="text-white text-4xl" />
          </div>
        )}
      </div>
    );
  };

  const renderActiveMedia = () => {
    if (!activeMediaItem) return null;

    if (activeMediaItem.mime_type.startsWith('image/')) {
      return (
        <img 
          src={activeMediaItem.raw_url} 
          alt={activeMediaItem.filename}
          className="w-full h-full object-contain"
        />
      );
    } else if (activeMediaItem.mime_type.startsWith('video/')) {
      return (
        <video 
          controls
          className="w-full h-full"
          autoPlay
          key={activeMediaKey}
        >
          <source src={activeMediaItem.raw_url} type={activeMediaItem.mime_type} />
          Your browser does not support the video tag.
        </video>
      );
    }
  };

  if (sessionLoading || !dive) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg p-8">
        

        <div className="flex items-center mb-2 group">
          <Link href="/dashboard" className="text-primary-200 text-3xl hover:underline block mr-2">
            <FaArrowCircleLeft/>
          </Link>
          {isEditing ? (
            <>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-3xl font-bold mr-2 p-1 border rounded"
              />
              <FaCheckCircle onClick={handleSaveName} className="text-green-500 mr-2 text-xl cursor-pointer"/>
              <FaTimesCircle onClick={handleCancelEdit} className="text-red-500 text-xl cursor-pointer" />
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mr-2">{dive.name}</h2>
              <div className="hidden group-hover:flex items-center">
                <FaEdit onClick={handleEditClick} className="text-zinc-500 hover:text-zinc-700 transition-colors duration-200 mr-2 text-xl cursor-pointer"/>
                <FaTrash onClick={handleDeleteClick} className="text-zinc-500 hover:text-zinc-700 transition-colors duration-200 text-xl cursor-pointer"/>
              </div>
            </>
          )}
        </div>

        {isDeleting && (
          <div className="mt-4 p-4 bg-red-100 rounded">
            <p className="mb-2">Are you sure you want to delete this dive?</p>
            <button
              onClick={() => handleConfirmDelete(false)}
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            >
              Delete Dive Only
            </button>
            <button
              onClick={() => handleConfirmDelete(true)}
              className="bg-red-700 text-white px-4 py-2 rounded mr-2"
            >
              Delete Dive and Media
            </button>
            <button
              onClick={handleCancelDelete}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}

        <p className="text-gray-500 mb-4">{dive.location} - {dive.date}</p>

        {activeMediaItem && (
          <div className="mb-4 relative max-h-800" key={activeMediaKey}>
            <button 
              onClick={() => setActiveMediaItem(null)}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 z-10"
            >
              <FaTimes />
            </button>
            <div className="aspect-w-16 aspect-h-9">
              {renderActiveMedia()}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
          {dive.media_items.map((media, index) => (
            <div key={index}>
              {renderMediaItem(media)}
            </div>
          ))}
        </div>

        <FileUploadArea diveId={dive.id}/>    
      </div>
    </div>
  );
}