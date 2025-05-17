'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const useSlideEffect = (words, duration = 2000) => {
  const [index, setIndex] = useState(0);
  const [slide, setSlide] = useState('slide-in');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSlide('slide-out');
      
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % words.length);
        setSlide('slide-in');
      }, duration / 2);
    }, duration);

    return () => clearInterval(intervalId);
  }, [words, duration]);

  return { word: words[index], slide };
};

const LandingPage = () => {
  const words = ['store', 'organize', 'curate', 'edit', 'play', 'share'];
  const { word, slide } = useSlideEffect(words, 2000);

  return (
    <div className="relative">
      
      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen bg-black bg-opacity-20 text-white">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <header className="mb-16 w-2/3 md:py-32">
            <Image src="/logo_for_dark.webp" width="300" height="200" alt="logo"/>
            <h2 className="text-4xl md:text-6xl mt-8 mb-6 leading-tight font-semibold">
              the place to{' '}
              <span className={`text-yellow-200 inline-block w-48 ${slide}`}>
                {word}
              </span>
              <br/>your diving media
            </h2>
            <p className="md:text-xl mb-8">
              for an entire diving lifetime!
            </p>
            <Link href="/login" className="bg-blue-500 hover:bg-blue-600 text-white py-4 px-8 rounded-lg text-md transition duration-300 button-text font-bold floating-input">
              Dive in
            </Link>
          </header>

          {/* Value Propositions */}
          <div className="grid md:grid-cols-2 gap-12">
            <ValueProp
              icon="💿"
              title="all your media, in one safe place"
              description="say goodbye to physical hard drives that fill up often, get scattered and are hard to find. Say hello to the online cloud for all your diving media. Every single original safely backed-up and accessible in an instant."
            />
            <ValueProp
              icon="📸"
              title="dive albums are the new dive logs"
              description="Effortlessly and automagically organize your videos and photos into dives. Tag dive sites, notes, logs and even species you've spotted. Mark your favourites to find them later easily. Truly your diving wall-of-fame!"
            />
            <ValueProp
              icon="✨"
              title="enhance easily and share with the world"
              description="Shrink files losslessly, correct colors, adjust exposure, cut and trim all in the browser. Make it awesome, then make it famous. Share with a link or publish to Youtube. Let the world witness the beauty of the ocean."
            />
            <ValueProp
              icon="🔓"
              title="no lock-ins, no gimmicks… just good software"
              description="Download all your media at any time if you decide to. Your data is after all your data. Also, the whole system is open-source. So you always know exactly what you are dealing with."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ValueProp = ({ icon, title, description }) => {
  return (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6">
      <div className="text-4xl mb-4">{icon}</div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-lg">{description}</p>
    </div>
  );
};

export default function LandingPageWrapper() {
  return (
    <Suspense>
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          className="absolute w-full h-full object-cover"
          poster='/poster.webp'

        >
          <source src="/bg_video_compressed.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      <LandingPage />
    </Suspense>
  )
}