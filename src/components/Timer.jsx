import React, { useState, useEffect } from 'react';
import ProgressRing from './ProgressRing';

export default function Timer({ mode, onModeChange, onTick, workDuration, breakDuration }) {
  // Use custom durations passed as props
  const totalSeconds = (mode === 'work' ? workDuration : breakDuration) * 60;
  
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isActive, setIsActive] = useState(false);
  const ringColor = mode === 'work' ? '#3b82f6' : '#22c55e';

  // Reset timer whenever mode OR durations change
  useEffect(() => {
    setSecondsLeft(totalSeconds);
    setIsActive(false);
  }, [mode, totalSeconds]);

  const formatTime = (total) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          const next = prev - 1;
          onTick(formatTime(next));
          return next;
        });
      }, 1000);
    } else if (secondsLeft === 0) {
      clearInterval(interval);
      setIsActive(false);
      onModeChange();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, onModeChange, onTick]);

  return (
    <div className="text-center py-2 d-flex flex-column align-items-center">
      <div className="mb-4">
        <ProgressRing 
          percentage={(secondsLeft / totalSeconds) * 100} 
          text={formatTime(secondsLeft)} 
          color={ringColor} 
        />
      </div>

      <div className="d-flex justify-content-center gap-3">
        <button 
          className={`btn btn-lg rounded-pill px-5 shadow-sm ${isActive ? 'btn-danger' : 'btn-primary'}`}
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? 'Pause' : 'Start Focus'}
        </button>
        <button 
          className="btn btn-lg btn-outline-light rounded-pill px-4 opacity-50"
          onClick={() => { setIsActive(false); setSecondsLeft(totalSeconds); }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}