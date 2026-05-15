import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Lock, Bell, Moon, Sun, Trash2, 
  Clock, Shield, Save, CheckCircle, AlertTriangle 
} from 'lucide-react';
import api from '../api';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [userData, setUserData] = useState({
    email: localStorage.getItem('email') || '',
    parent_phone: '',
    theme: 'dark',
    notif_quiz: true,
    notif_docs: true
  });
  const [loginActivity, setLoginActivity] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('dark');

  useEffect(() => {
    fetchUserData();
    fetchLoginActivity();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/user/me', { params: { email: userData.email || localStorage.getItem('email') } });
      setUserData(response.data);
      setSelectedTheme(response.data.theme);
      applyTheme(response.data.theme);
    } catch (err) {
      console.error('Error fetching user data', err);
    }
  };

  const applyTheme = (theme) => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  const fetchLoginActivity = async () => {
    try {
      const response = await api.get('/user/activity', { params: { email: userData.email || localStorage.getItem('email') } });
      setLoginActivity(response.data);
    } catch (err) {
      console.error('Error fetching login activity', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log('Applying theme:', selectedTheme);
    
    // Apply UI change immediately
    applyTheme(selectedTheme);
    
    setLoading(true);
    try {
      const email = userData.email || localStorage.getItem('email');
      if (!email) throw new Error('User email not found');

      const updatedData = { ...userData, email, theme: selectedTheme };
      await api.put(`/user/update?email=${email}`, updatedData);
      
      setUserData(updatedData);
      setSuccess('Settings updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Update failed:', err);
      // Fallback: even if API fails, we want the theme to persist in this session
      localStorage.setItem('preferredTheme', selectedTheme);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you absolutely sure? This will delete all your learning data permanently.')) {
      try {
        await api.delete(`/user/delete?email=${userData.email}`);
        localStorage.clear();
        window.location.href = '/register';
      } catch (err) {
        console.error('Deletion failed', err);
      }
    }
  };

  const tabs = [
    { id: 'account', name: 'Account Details', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Moon },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">System Settings</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id 
                ? 'bg-neon-purple text-white shadow-[0_0_15px_rgba(176,38,255,0.3)]' 
                : 'hover:bg-white/5 text-slate-400'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.name}</span>
            </button>
          ))}
          <button 
            onClick={handleDelete}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all mt-8"
          >
            <Trash2 className="w-5 h-5" />
            <span className="font-medium">Delete Account</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-card p-8 rounded-3xl min-h-[500px]">
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-3 mb-6"
            >
              <CheckCircle className="w-5 h-5" />
              {success}
            </motion.div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-neon-blue" /> Account Information
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={userData.email}
                    disabled
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Parent's Phone Number</label>
                  <input 
                    type="tel" 
                    value={userData.parent_phone || ''}
                    onChange={(e) => setUserData({...userData, parent_phone: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:border-neon-purple outline-none transition-all"
                  />
                </div>
              </div>
              <button 
                onClick={handleUpdate}
                disabled={loading}
                className="bg-neon-blue text-dark-bg px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'} <Save className="w-5 h-5" />
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Lock className="w-5 h-5 text-neon-purple" /> Change Password
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <input 
                    type="password" 
                    placeholder="New Password"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:border-neon-purple outline-none transition-all"
                  />
                  <input 
                    type="password" 
                    placeholder="Confirm New Password"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:border-neon-purple outline-none transition-all"
                  />
                </div>
                <button className="bg-neon-purple text-white px-6 py-3 rounded-xl font-bold transition-all">
                  Update Password
                </button>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-400" /> Recent Login Activity
                </h2>
                <div className="space-y-3">
                  {loginActivity.map((activity, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-medium">Successful Login</span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" /> Notification Preferences
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div>
                    <h3 className="font-medium">Quiz Reminders</h3>
                    <p className="text-xs text-slate-400">Get notified when a new adaptive quiz is ready.</p>
                  </div>
                  <button 
                    onClick={() => setUserData({...userData, notif_quiz: !userData.notif_quiz})}
                    className={`w-12 h-6 rounded-full relative transition-all ${userData.notif_quiz ? 'bg-neon-purple' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${userData.notif_quiz ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div>
                    <h3 className="font-medium">Documentation Reminders</h3>
                    <p className="text-xs text-slate-400">Reminders for daily reading and research tasks.</p>
                  </div>
                  <button 
                    onClick={() => setUserData({...userData, notif_docs: !userData.notif_docs})}
                    className={`w-12 h-6 rounded-full relative transition-all ${userData.notif_docs ? 'bg-neon-purple' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${userData.notif_docs ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              </div>
              <button 
                onClick={handleUpdate}
                className="bg-neon-blue text-dark-bg px-6 py-3 rounded-xl font-bold transition-all"
              >
                Save Preferences
              </button>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {userData.theme === 'dark' ? <Moon className="w-5 h-5 text-neon-purple" /> : <Sun className="w-5 h-5 text-amber-500" />} 
                Visual Theme
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setSelectedTheme('light')}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                    selectedTheme === 'light' ? 'border-neon-blue bg-neon-blue/5' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <Sun className={`w-8 h-8 ${selectedTheme === 'light' ? 'text-neon-blue' : 'text-slate-500'}`} />
                  <span className="font-bold uppercase tracking-widest text-xs">Light Mode</span>
                </button>
                <button 
                  onClick={() => setSelectedTheme('dark')}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                    selectedTheme === 'dark' ? 'border-neon-purple bg-neon-purple/5' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <Moon className={`w-8 h-8 ${selectedTheme === 'dark' ? 'text-neon-purple' : 'text-slate-500'}`} />
                  <span className="font-bold uppercase tracking-widest text-xs">Dark Mode</span>
                </button>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex gap-3 text-amber-400">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p className="text-xs leading-relaxed">
                  Theme changes are stored in your AI cloud profile and will synchronize across all your neuro-linked devices.
                </p>
              </div>
              <button 
                onClick={handleUpdate}
                className="bg-neon-purple text-white px-6 py-3 rounded-xl font-bold transition-all"
              >
                Apply Theme
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
