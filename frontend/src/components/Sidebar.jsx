import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  LineChart, 
  Trophy, 
  BookOpen, 
  CalendarDays,
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: BrainCircuit, label: 'AI Adaptive Quiz', path: '/quiz' },
  { icon: LineChart, label: 'Analytics & Focus', path: '/analytics' },
  { icon: Trophy, label: 'Gamification', path: '/gamification' },
  { icon: BookOpen, label: 'Study Packs', path: '/study-packs' },
  { icon: CalendarDays, label: 'Scheduler', path: '/scheduler' },
];

export default function Sidebar() {
  return (
    <div className="w-64 h-full glass-panel border-r border-white/5 flex flex-col z-20">
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-neon-purple flex items-center justify-center shadow-[0_0_15px_rgba(176,38,255,0.5)]">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-wide">
          Neuro<span className="text-gradient">Path</span>
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Main Menu</p>
        
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group
              ${isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-neon-blue to-neon-purple"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
                <item.icon className={`w-5 h-5 ${isActive ? 'text-neon-blue' : 'group-hover:text-neon-blue transition-colors'}`} />
                <span className="font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 space-y-2">
        <button className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
        <button className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
