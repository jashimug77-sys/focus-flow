import React, { useState, useEffect } from 'react';

const soundsData = [
  { id: 'rain', label: '🌧️ Rain', file: '/sounds/rain.mp3' },
  { id: 'cafe', label: '☕ Cafe', file: '/sounds/cafe.mp3' }
];

export default function SoundMixer() {
  const [playing, setPlaying] = useState({});
  const [audios] = useState({});

  useEffect(() => {
    // Pre-load audio objects
    soundsData.forEach(sound => {
      const audio = new Audio(sound.file);
      audio.loop = true;
      audios[sound.id] = audio;
    });
    return () => {
      // Clean up on unmount
      Object.values(audios).forEach(a => a.pause());
    };
  }, [audios]);

  const toggleSound = (id) => {
    if (playing[id]) {
      audios[id].pause();
    } else {
      audios[id].play();
    }
    setPlaying(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="mt-5 p-4 rounded-4 bg-white bg-opacity-10 backdrop-blur" style={{ maxWidth: '400px' }}>
      <h6 className="text-uppercase small mb-3 opacity-75">Ambient Mixer</h6>
      <div className="row g-3">
        {soundsData.map(sound => (
          <div key={sound.id} className="col-6 text-center">
            <button 
              className={`btn w-100 rounded-3 ${playing[sound.id] ? 'btn-info' : 'btn-outline-light opacity-50'}`}
              onClick={() => toggleSound(sound.id)}
            >
              {sound.label}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}