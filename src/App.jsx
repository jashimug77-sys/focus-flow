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
  const [showModal, setShowModal] = useState(false);

  const [workDuration, setWorkDuration] = useState(() => parseInt(localStorage.getItem('work_duration')) || 25);
  const [breakDuration, setBreakDuration] = useState(() => parseInt(localStorage.getItem('break_duration')) || 5);
  
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('focus_sessions');
    return saved ? parseInt(saved) : 0;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('focus_history');
    return saved ? JSON.parse(saved) : [];
  });

  const isIdle = useIdle(15000); 

  useEffect(() => {
    localStorage.setItem('focus_sessions', sessions);
    localStorage.setItem('focus_history', JSON.stringify(history));
    localStorage.setItem('work_duration', workDuration);
    localStorage.setItem('break_duration', breakDuration);
  }, [sessions, history, workDuration, breakDuration]);

  useEffect(() => {
    const prefix = mode === 'work' ? 'Focus' : 'Break';
    document.title = currentTime ? `(${currentTime}) ${prefix}` : 'FocusFlow';
  }, [currentTime, mode]);

  const handleTimerComplete = () => {
    if (mode === 'work') {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newEntry = { time: timeString, taskName: task || "Unnamed Session", id: Date.now() };
      setHistory(prev => [newEntry, ...prev]);
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
        
        {/* IMPROVED HEADER: Uses Flexbox for perfect balance */}
        <header className="mb-4 d-flex align-items-center justify-content-between">
          <div style={{ width: '40px' }}></div> {/* Spacer to keep Title centered */}
          
          <h1 className="fw-bold tracking-tight text-white display-4 m-0">FocusFlow</h1>
          
          <button 
            className="btn btn-link text-white opacity-50 p-0" 
            onClick={() => setShowModal(true)}
            style={{ fontSize: '1.2rem', textDecoration: 'none' }}
          >
            ⚙️
          </button>
        </header>
        
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

        <Timer 
          mode={mode} 
          onModeChange={handleTimerComplete} 
          onTick={(time) => setCurrentTime(time)} 
          workDuration={workDuration}
          breakDuration={breakDuration} 
        />
        
        <SoundMixer />

        <div className="mt-5 text-start w-100">
          <h6 className="text-uppercase small opacity-50 mb-3 border-bottom pb-2">Recent Activity</h6>
          <div className="history-container" style={{ maxHeight: '150px', overflowY: 'auto' }}>
            {history.length === 0 ? <p className="small opacity-25 text-center py-3">No sessions yet.</p> : (
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
        </div>
      </div>

      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border-secondary">
              <div className="modal-header border-secondary">
                <h5 className="modal-title">Timer Settings</h5>
              </div>
              <div className="modal-body">
                <label className="mb-2">Work Duration (mins)</label>
                <input type="number" className="form-control bg-dark text-white border-secondary mb-3" value={workDuration} onChange={(e) => setWorkDuration(parseInt(e.target.value))} />
                <label className="mb-2">Break Duration (mins)</label>
                <input type="number" className="form-control bg-dark text-white border-secondary" value={breakDuration} onChange={(e) => setBreakDuration(parseInt(e.target.value))} />
              </div>
              <div className="modal-footer border-secondary">
                <button className="btn btn-primary" onClick={() => setShowModal(false)}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;