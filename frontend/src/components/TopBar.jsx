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

  return (
    <header className="h-20 glass-panel border-b border-white/5 px-8 flex items-center justify-between z-20 sticky top-0">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search for subjects, study packs, or AI tutors..."
            className="w-full bg-dark-surface/50 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all placeholder:text-slate-500"
          />
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
          Online
        </div>

        {/* Multi-language Support */}
        <button className="text-slate-400 hover:text-white transition-colors">
          <Globe className="w-5 h-5" />
        </button>

        {/* Parent Notifications */}
        <button className="relative text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-dark-bg" />
        </button>

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
