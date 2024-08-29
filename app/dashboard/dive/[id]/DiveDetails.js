'use client'

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import FileUploadArea from '@/app/components/FileUploadArea';
import { fetchWithAuth } from '@/app/utils/api';
import { useSession } from '@/app/hooks/useSession';
import { useRouter } from 'next/navigation';
import { FaPlay, FaEdit, FaTrash, FaTimes, FaCheckCircle, FaTimesCircle, FaExchangeAlt } from 'react-icons/fa';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Checkbox } from "@nextui-org/react";
import toast from 'react-hot-toast';
import ProcessingSection from './ProcessingSection';
import Log from './Log';
import VideoPlayer from '@/app/components/VideoPlayer';

export default function DiveDetails({ id }) {
  const [dive, setDive] = useState(null);
  const { session, loading: sessionLoading } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeMediaItem, setActiveMediaItem] = useState(null);
  const router = useRouter();
  const [activeMediaKey, setActiveMediaKey] = useState(0);
  const [dives, setDives] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [intervalJob, setIntervalJob] = useState(null);

  useEffect(() => {
    if (session) {
      fetchWithAuth('/dives/')
        .then(setDives)
        .catch(console.error);
    }
  }, [session]);

  const fetchDiveDetails = async () => {
    if (session) {
      try {
        const data = await fetchWithAuth(`/dives/${id}`);
        setDive(data);

        // Fetch again after N secs if items are in processing
        if(data.media_items.filter(media => media.state === 'processing').length > 0) {
          setTimeout(fetchDiveDetails, 10000);
        }


      } catch (error) {
        console.error('Error fetching dive details:', error);
      }
    }

  };

  useEffect(() => {
    fetchDiveDetails();
  }, [id, session]);


  const handleMediaClick = (media) => {
    setActiveMediaItem(media);
    setActiveMediaKey(prevKey => prevKey + 1);
  };

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

  const handleDeleteSelectedItems = async () => {
    try {
      await Promise.all(selectedItems.map(itemId => 
        fetchWithAuth(`/media/${itemId}`, { method: 'DELETE' })
      ));
      setDive(prevDive => ({
        ...prevDive,
        media_items: prevDive.media_items.filter(item => !selectedItems.includes(item.id))
      }));
      setSelectedItems([]);
      toast.success('Selected items deleted');
    } catch (error) {
      console.error('Error deleting items:', error);
      toast.error('Failed to delete selected items');
    }
  };

  const handleMoveSelectedItems = async (newDiveId) => {
    try {
      await Promise.all(selectedItems.map(itemId => 
        fetchWithAuth(`/media/${itemId}/move?new_dive_id=${newDiveId}`, { method: 'PATCH' })
      ));
      setDive(prevDive => ({
        ...prevDive,
        media_items: prevDive.media_items.filter(item => !selectedItems.includes(item.id))
      }));
      setSelectedItems([]);
      toast.success('Selected items moved');
    } catch (error) {
      console.error('Error moving items:', error);
      toast.error('Failed to move selected items');
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const handleProcessingUpdate = (updatedMediaItems) => {
    setDive(prevDive => ({
      ...prevDive,
      media_items: updatedMediaItems
    }));
  };

  const renderMediaItem = (media) => {
    const thumbnail = media.thumbnails && media.thumbnails.length > 0 ? media.thumbnails[0] : media.raw_url;
    return (
      <div className="flex flex-col overflow-hidden rounded-lg shadow-md">
        <div 
          className="relative aspect-w-16 aspect-h-9 cursor-pointer overflow-hidden"
          onClick={() => handleMediaClick(media)}
        >
          <img 
            src={thumbnail} 
            alt={media.filename}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
          <Checkbox
            isSelected={selectedItems.includes(media.id)}
            onChange={() => handleSelectItem(media.id)}
            className="p-0"
          />
          {media.mime_type.startsWith('video/') && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleMediaClick(media);
              }}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaPlay className="text-xl" />
            </button>
          )}
        </div>
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
        <Suspense fallback={<div>Loading video player...</div>}>
          <VideoPlayer 
            src={activeMediaItem.processed_url} 
            type={activeMediaItem.mime_type}
          />
        </Suspense>
      );
    }
  };

  if (sessionLoading || !dive) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-md p-8 border">

        <div className="flex">
          <div className="w-3/4 pr-4">
          
            <div className="flex items-center mb-2 group">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="text-2xl font-bold mr-2 p-1 rounded border"
                  />
                  <FaCheckCircle onClick={handleSaveName} className="text-green-500 mr-2 text-xl cursor-pointer"/>
                  <FaTimesCircle onClick={handleCancelEdit} className="text-red-500 text-xl cursor-pointer" />
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mr-8">{dive.name}</h2>
                  <div className="hidden group-hover:flex items-center">
                    <FaEdit onClick={handleEditClick} className="text-zinc-500 hover:text-zinc-700 transition-colors duration-200 mr-2 text-xl cursor-pointer"/>
                    <FaTrash onClick={handleDeleteClick} className="text-zinc-500 hover:text-zinc-700 transition-colors duration-200 text-xl cursor-pointer"/>
                  </div>
                </>
              )}
            </div>

            {isDeleting && (
              <div className="mt-4 p-4 bg-red-100 rounded">
                <p className="mb-2">are you sure you want to delete this dive?</p>
                <button
                  onClick={() => handleConfirmDelete(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded mr-2 button-text text-xs"
                >
                  Delete Dive Only
                </button>
                <button
                  onClick={() => handleConfirmDelete(true)}
                  className="bg-red-700 text-white px-4 py-2 rounded mr-2 button-text text-xs"
                >
                  Delete Dive and Media
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded button-text text-xs"
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
                <div className="aspect-w-16 aspect-h-9" style={{maxHeight: '800px'}}>
                  {renderActiveMedia()}
                </div>
              </div>
            )}

            {selectedItems.length > 0 && (
              <div className="mb-4 p-4 bg-blue-100 rounded flex items-center justify-between">
                <span>{selectedItems.length} item(s) selected</span>
                <div>
                  <Button color="danger" size='sm' className='mr-2' variant='bordered' onClick={handleDeleteSelectedItems}>
                        <FaTrash className="mr-2 inline" /> Delete Selected
                  </Button>

                  {  
                    dives.filter(d => d.id !== dive.id).length > 0 &&
                    <Dropdown>
                      <DropdownTrigger>
                        <Button size="sm" color="primary" variant='bordered'>
                          <FaExchangeAlt className="mr-2 inline" /> Move
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Selected items actions">
                        {dives.filter(d => d.id !== dive.id).map(d => (
                          <DropdownItem key={d.id} onClick={() => handleMoveSelectedItems(d.id)}>
                            <span className='ml-6'>{d.name}</span>
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  }
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
              {dive.media_items.filter(media => media.state === 'ready').map((media, index) => (
                <div key={index}>
                  {renderMediaItem(media)}
                </div>
              ))}
            </div>

            <ProcessingSection processingItems={dive.media_items.filter(media => media.state === 'processing')} />

            <FileUploadArea diveId={dive.id}/>    
          </div>

          <div className="w-1/4 pl-4">
            <Log diveId={id} diveDate={dive.date} />
          </div>

        </div>
      </div>
    </div>
  );
}