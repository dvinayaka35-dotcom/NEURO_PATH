import { useState, useEffect } from 'react';
import { Bell, Search, User, Globe, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export default function TopBar() {
  const [displayName, setDisplayName] = useState('New Learner');
  const [customName, setCustomName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [level, setLevel] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [isFocusMode, setIsFocusMode] = useState(false);

  useEffect(() => {
    const handleFocusMode = (e) => setIsFocusMode(e.detail);
    window.addEventListener('focusModeToggle', handleFocusMode);
    return () => window.removeEventListener('focusModeToggle', handleFocusMode);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email') || '';
    const storedCustomName = localStorage.getItem('customName');
    const xp = parseInt(localStorage.getItem('xp') || '0');
    const fallbackName = email
      ? email.split('@')[0].replace(/\b\w/g, (c) => c.toUpperCase())
      : 'New Learner';

    setIsLoggedIn(!!token);
    setDisplayName(fallbackName);
    setCustomName(storedCustomName || fallbackName);
    setLevel(Math.floor(xp / 100) + 1);
    setProfileImage(localStorage.getItem(`profileImage_${email}`));

    // Listen for global profile updates
    const handleUpdate = () => {
      const currentEmail = localStorage.getItem('email');
      setProfileImage(localStorage.getItem(`profileImage_${currentEmail}`));
    };
    window.addEventListener('profileUpdate', handleUpdate);
    return () => window.removeEventListener('profileUpdate', handleUpdate);
  }, []);

  const [profileImage, setProfileImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lang, setLang] = useState(localStorage.getItem('language') || 'EN');
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: "Focus streak: 3 days!", time: "2h ago" },
    { id: 2, text: "New Python Quiz available", time: "4h ago" },
    { id: 3, text: "Welcome to NeuroPath", time: "1d ago" }
  ];

  const handleLanguageToggle = () => {
    const nextLang = lang === 'EN' ? 'KN' : 'EN';
    setLang(nextLang);
    localStorage.setItem('language', nextLang);
    window.dispatchEvent(new Event('languageChange'));
  };

  const handleNameSave = () => {
    const trimmedName = customName.trim();
    const nextName = trimmedName || displayName;
    localStorage.setItem('customName', nextName);
    setCustomName(nextName);
    setIsEditing(false);
  };

  const handleNameKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNameSave();
    }
  };
  const searchableItems = [
    { title: 'Dashboard', path: '/', description: 'Overview of your progress' },
    { title: 'Smart Scheduler', path: '/scheduler', description: 'AI-powered study routine' },
    { title: 'Adaptive Quiz', path: '/quiz', description: 'Test your knowledge' },
    { title: 'Analytics', path: '/analytics', description: 'Detailed performance insights' },
    { title: 'Chat', path: '/chat', description: 'Ask the AI Assistant' },
    { title: 'Study Packs', path: '/study-packs', description: 'Curated learning materials' },
    { title: 'Profile', path: '/profile', description: 'View your account' },
    { title: 'Settings', path: '/settings', description: 'System preferences' },
    // Subjects
    { title: 'Python Programming', path: '/quiz', description: 'Organizes software design around objects and data structures' },
    { title: 'Dynamic Websites', path: '/quiz', description: 'Responsive Web & Full-Stack Development' },
    { title: 'Software Engineering', path: '/quiz', description: 'Testing Techniques & SDLC' },
    { title: 'Business Intelligence', path: '/quiz', description: 'ETL Process & Data Architecture' }
  ];

  const filteredResults = searchQuery.trim() === '' 
    ? [] 
    : searchableItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter' && filteredResults.length > 0) {
      navigate(filteredResults[0].path);
      setSearchQuery('');
    }
  };

  if (isFocusMode) return null;

  return (
    <header className="h-20 glass-panel border-b border-white/5 px-4 md:px-8 flex items-center justify-between z-50 sticky top-0">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyPress}
            placeholder={lang === 'KN' ? "ಹುಡುಕಿ..." : "Search subjects..."}
            className="w-full bg-dark-surface/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all placeholder:text-slate-500"
          />
          
          {/* Search Results Dropdown */}
          {filteredResults.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-full glass-panel border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[100] max-h-[400px] overflow-y-auto">
              {filteredResults.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    navigate(result.path);
                    setSearchQuery('');
                  }}
                  className="w-full p-4 text-left hover:bg-white/10 border-b border-white/5 last:border-0 transition-colors flex items-center justify-between group"
                >
                  <div>
                    <p className="font-bold text-sm text-white group-hover:text-neon-blue transition-colors">{result.title}</p>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{result.description}</p>
                  </div>
                  <Search className="w-4 h-4 text-slate-700 group-hover:text-neon-blue opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-5">
        {!isLoggedIn && (
          <div className="hidden sm:flex gap-3">
            <Link to="/login" className="px-4 py-2 rounded-full border border-white/10 text-slate-300 hover:bg-white/10 transition-colors">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 rounded-full bg-gradient-to-r from-neon-purple to-neon-blue text-white hover:opacity-90 transition-opacity">
              Register
            </Link>
          </div>
        )}
        {/* Offline Mode Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {lang === 'KN' ? 'ಆನ್‌ಲೈನ್' : 'Online'}
        </div>

        {/* Multi-language Support */}
        <button 
          onClick={handleLanguageToggle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all"
        >
          <Globe className="w-4 h-4 text-neon-blue" />
          <span className="text-xs font-bold">{lang}</span>
        </button>

        {/* Parent Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-dark-bg" />
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-72 glass-panel border border-white/10 rounded-2xl p-4 shadow-2xl z-50">
              <h3 className="font-bold text-sm mb-3">Notifications</h3>
              <div className="space-y-3">
                {notifications.map(n => (
                  <div key={n.id} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                    <p className="text-xs text-white leading-tight">{n.text}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-white/10" />

        <div
          role="button"
          tabIndex={0}
          onClick={() => navigate('/profile')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              navigate('/profile');
            }
          }}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="text-right hidden sm:block">
            {isEditing ? (
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                onBlur={handleNameSave}
                onKeyPress={handleNameKeyPress}
                onClick={(e) => e.stopPropagation()}
                className="text-sm font-medium text-white bg-transparent border-b border-neon-purple outline-none"
                autoFocus
              />
            ) : (
              <p
                className="text-sm font-medium text-white group-hover:text-neon-blue transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                {customName}
              </p>
            )}
            <p className="text-xs text-slate-500">Level {level} Scholar</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-purple to-neon-blue p-[2px]">
            <div className="w-full h-full rounded-full bg-dark-bg flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-slate-300" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
