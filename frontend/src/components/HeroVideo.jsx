import React, { useState } from 'react';
import paellaVideo from '../assets/video/paella.mp4';
import seafoodVideo from '../assets/video/seafood.mp4';
import recipeVideo from '../assets/video/recipe.mp4';

const videos = [recipeVideo, paellaVideo, seafoodVideo];

const HeroVideo = () => {
  const [currentVideo, setCurrentVideo] = useState(0);

  const handleVideoEnd = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length); 
    // % videos.length ensures it loops back to first video
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <video
        key={currentVideo} // re-render video on change
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={videos[currentVideo]}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
      />

      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold font-serif tracking-wide mb-4">
          Authentic Spanish Cuisine
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Experience the taste of Spain in every bite
        </p>
        <a
          href="#reservations"
          className="bg-primary px-6 py-3 rounded-full hover:bg-white hover:text-primary transition"
        >
          Reserve Now
        </a>
      </div>
    </section>
  );
};

export default HeroVideo;
