'use client'

import React from 'react';
import { Spinner } from '@nextui-org/react';
import useLoadingStore from '../store/loadingStore';

const SpinnerLoader = () => {

  const isLoading = useLoadingStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm shadow-lg">
        <Spinner size="md" />
      </div>
    </div>
  );
};

export default SpinnerLoader;