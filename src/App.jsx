import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import SoundMixer from './components/SoundMixer';
import ZenMode from './components/ZenMode';
import { useIdle } from './hooks/useIdle';
import './App.css';

function App() {
  const [mode, setMode] = useState('work');
  const [task, setTask] = useState(""); // New: Current Goal
  const [currentTime, setCurrentTime] = useState(""); // New: To sync with Tab Title
  
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('focus_sessions');
    return saved ? parseInt(saved) : 0;
  });

  const isIdle = useIdle(15000); 

  useEffect(() => {
    localStorage.setItem('focus_sessions', sessions);
  }, [sessions]);

  // FEATURE 1: Dynamic Tab Title
  useEffect(() => {
    const prefix = mode === 'work' ? 'Focus' : 'Break';
    document.title = currentTime ? `(${currentTime}) ${prefix}` : 'FocusFlow';
  }, [currentTime, mode]);

  const handleTimerComplete = () => {
    if (mode === 'work') {
      setSessions(prev => prev + 1);
    }
    setMode(prev => (prev === 'work' ? 'break' : 'work'));
  };

  const appStyles = {
    backgroundColor: mode === 'work' ? '#0f172a' : '#064e3b',
    color: '#f8fafc',
    minHeight: '100vh',
    transition: 'all 1.5s ease-in-out'
  };

  return (
    <div style={appStyles} className="d-flex flex-column align-items-center justify-content-center p-3">
      {isIdle && <ZenMode />}

      <div className="container text-center" style={{ maxWidth: '500px' }}>
        <header className="mb-4">
          <h1 className="fw-bold tracking-tight">FocusFlow</h1>
          
          {/* FEATURE 2: Task Input Field */}
          <div className="mt-3 mb-2">
            <input 
              type="text" 
              className="form-control form-control-sm bg-transparent text-white border-0 text-center opacity-75 focus-none"
              placeholder="What are you focusing on?"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              style={{ fontSize: '1.2rem', outline: 'none', boxShadow: 'none' }}
            />
            <div className="mx-auto bg-white opacity-25" style={{ height: '1px', width: '60%' }}></div>
          </div>

          <div className="badge rounded-pill bg-light text-dark px-3 py-2 mt-3">
            🔥 {sessions} Sessions Completed
          </div>
        </header>

        {/* Pass setCurrentTime to Timer to sync the Tab Title */}
        <Timer 
          mode={mode} 
          onModeChange={handleTimerComplete} 
          onTick={(time) => setCurrentTime(time)} 
        />
        
        <div className="d-flex justify-content-center">
          <SoundMixer />
        </div>
      </div>
    </div>
  );
}

export default App;