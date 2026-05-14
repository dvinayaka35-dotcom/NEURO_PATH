import { Bell, Search, User, Globe, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TopBar() {
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

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white group-hover:text-neon-blue transition-colors">Alex Student</p>
            <p className="text-xs text-slate-500">Level 42 Scholar</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-purple to-neon-blue p-[2px]">
            <div className="w-full h-full rounded-full bg-dark-bg flex items-center justify-center">
              <User className="w-5 h-5 text-slate-300" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
