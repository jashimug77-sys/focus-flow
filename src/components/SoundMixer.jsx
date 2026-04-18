import React, { useState, useRef, useEffect } from 'react';

export default function SoundMixer() {
  const [isPlaying, setIsPlaying] = useState({ nature: false, cafe: false });
  const natureRef = useRef(new Audio('/sounds/nature.mp3')); // Ensure this file exists!
  const cafeRef = useRef(new Audio('/sounds/cafe.mp3'));

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      natureRef.current.pause();
      cafeRef.current.pause();
    };
  }, []);

  const toggleSound = (sound) => {
    if (sound === 'nature') {
      if (isPlaying.nature) natureRef.current.pause();
      else natureRef.current.play();
      setIsPlaying(prev => ({ ...prev, nature: !prev.nature }));
    } else {
      if (isPlaying.cafe) cafeRef.current.pause();
      else cafeRef.current.play();
      setIsPlaying(prev => ({ ...prev, cafe: !prev.cafe }));
    }
  };

  return (
    <div className="d-flex justify-content-center gap-3 my-4">
      {/* Nature Sound Button */}
      <button 
        className={`btn btn-sm rounded-pill px-4 ${isPlaying.nature ? 'btn-info text-white' : 'btn-outline-info'}`}
        onClick={() => toggleSound('nature')}
      >
        {isPlaying.nature ? '🔊 Nature' : '🔇 Nature'}
      </button>

      {/* Cafe Sound Button */}
      <button 
        className={`btn btn-sm rounded-pill px-4 ${isPlaying.cafe ? 'btn-info text-white' : 'btn-outline-info'}`}
        onClick={() => toggleSound('cafe')}
      >
        {isPlaying.cafe ? '🔊 Cafe' : '🔇 Cafe'}
      </button>
    </div>
  );
}