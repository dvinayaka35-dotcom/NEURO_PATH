import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import Analytics from './pages/Analytics';
import Chat from './pages/Chat';
import StudyPacks from './pages/StudyPacks';
import Scheduler from './pages/Scheduler';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import VoiceAssistantModal from './components/VoiceAssistantModal';

function AppContent() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Global Study Timer Logic
  useEffect(() => {
    let interval;
    if (token) {
      interval = setInterval(() => {
        const currentTime = parseInt(localStorage.getItem('totalStudyTime') || '0');
        localStorage.setItem('totalStudyTime', (currentTime + 1).toString());
        
        // Update XP every 5 minutes of study (300 seconds)
        if ((currentTime + 1) % 300 === 0) {
          const currentXP = parseInt(localStorage.getItem('xp') || '0');
          localStorage.setItem('xp', (currentXP + 10).toString());
          window.dispatchEvent(new Event('profileUpdate'));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [token]);

  // Always redirect to login if no token is found and not on an auth page
  if (!token && !isAuthPage) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen bg-dark-bg overflow-hidden relative">
      {/* Futuristic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-neon-purple/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neon-blue/20 blur-[120px] pointer-events-none" />

      <Sidebar />

      <div className="flex flex-col flex-1 relative z-10">
        <TopBar />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto h-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/study-packs" element={<StudyPacks />} />
              <Route path="/scheduler" element={<Scheduler />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Floating Voice Assistant Button / Modal */}
      <VoiceAssistantModal />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
