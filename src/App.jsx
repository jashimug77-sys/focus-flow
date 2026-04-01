import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import SoundMixer from './components/SoundMixer';
import ZenMode from './components/ZenMode';
import { useIdle } from './hooks/useIdle';
import './App.css';

function App() {
  const [mode, setMode] = useState('work');
  const [task, setTask] = useState(""); 
  const [currentTime, setCurrentTime] = useState(""); 
  
  // Load sessions and history from localStorage
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('focus_sessions');
    return saved ? parseInt(saved) : 0;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('focus_history');
    return saved ? JSON.parse(saved) : [];
  });

  const isIdle = useIdle(15000); 

  // Sync data to localStorage
  useEffect(() => {
    localStorage.setItem('focus_sessions', sessions);
    localStorage.setItem('focus_history', JSON.stringify(history));
  }, [sessions, history]);

  useEffect(() => {
    const prefix = mode === 'work' ? 'Focus' : 'Break';
    document.title = currentTime ? `(${currentTime}) ${prefix}` : 'FocusFlow';
  }, [currentTime, mode]);

  const handleTimerComplete = () => {
    if (mode === 'work') {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Add new entry to history
      const newEntry = {
        time: timeString,
        taskName: task || "Unnamed Session",
        id: Date.now()
      };
      
      setHistory(prev => [newEntry, ...prev]); // Add to top of list
      setSessions(prev => prev + 1);
    }
    setMode(prev => (prev === 'work' ? 'break' : 'work'));
  };

  const appStyles = {
    backgroundColor: mode === 'work' ? '#0f172a' : '#064e3b',
    color: '#ffffff',
    minHeight: '100vh',
    transition: 'all 1.5s ease-in-out',
    paddingBottom: '50px'
  };

  return (
    <div style={appStyles} className="d-flex flex-column align-items-center justify-content-start pt-5 p-3">
      {isIdle && <ZenMode />}

      <div className="container text-center" style={{ maxWidth: '500px' }}>
        <header className="mb-4">
          <h1 className="fw-bold tracking-tight text-white display-4">FocusFlow</h1>
          
          <div className="mt-4 mb-2">
            <input 
              type="text" 
              className="form-control bg-transparent border-0 text-center focus-none custom-placeholder"
              placeholder="What is your main goal right now?"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              style={{ fontSize: '1.4rem', outline: 'none', boxShadow: 'none', color: '#0ea5e9' }}
            />
            <div className="mx-auto" style={{ height: '2px', width: '70%', backgroundColor: '#0ea5e9', opacity: '0.6' }}></div>
          </div>

          <div className="badge rounded-pill bg-white text-dark px-4 py-2 mt-3 shadow-sm">
            🔥 {sessions} Sessions Completed
          </div>
        </header>

        <Timer 
          mode={mode} 
          onModeChange={handleTimerComplete} 
          onTick={(time) => setCurrentTime(time)} 
        />
        
        <SoundMixer />

        {/* FEATURE: SESSION HISTORY LIST */}
        <div className="mt-5 text-start w-100">
          <h6 className="text-uppercase small opacity-50 mb-3 border-bottom pb-2">Recent Activity</h6>
          <div className="history-container" style={{ maxHeight: '150px', overflowY: 'auto' }}>
            {history.length === 0 ? (
              <p className="small opacity-25 text-center py-3">No sessions completed yet.</p>
            ) : (
              <ul className="list-unstyled">
                {history.map((item) => (
                  <li key={item.id} className="d-flex justify-content-between small mb-2 p-2 rounded bg-white bg-opacity-10">
                    <span className="text-info">{item.time}</span>
                    <span className="text-white-50 text-truncate ms-3">{item.taskName}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {history.length > 0 && (
            <button 
              className="btn btn-sm btn-link text-danger p-0 mt-2 opacity-50 text-decoration-none"
              onClick={() => setHistory([])}
            >
              Clear History
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;