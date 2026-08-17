import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Bell,
  Database,
  RefreshCw,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const SettingsView: React.FC = () => {
  const { userProfile, setUserProfile, addToast, medicines } = useERP();
  const [name, setName] = useState(userProfile.name);
  const [role, setRole] = useState(userProfile.role);
  const [title, setTitle] = useState(userProfile.title);
  const [dept, setDept] = useState(userProfile.department);
  const [autoReorder, setAutoReorder] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState(25);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile((prev) => ({
      ...prev,
      name,
      role,
      title,
      department: dept,
    }));
    addToast('success', 'Profile Updated', 'Clinician profile information updated.');
  };

  const handleResetData = () => {
    localStorage.removeItem('livsera_medicines');
    localStorage.removeItem('livsera_orders');
    localStorage.removeItem('livsera_customers');
    addToast('info', 'Cache Cleared', 'Reloading system telemetry datasets...');
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-[24px] font-bold text-white tracking-tight">
          System & Formulary Preferences
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Configure clinical parameters, automated telemetry thresholds, and clinician account details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Clinician Profile Bento Card */}
        <div className="bento-card p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
            <Shield className="w-4 h-4 text-sky-400" />
            <h3 className="font-bold text-white text-sm">Clinician Account Profile</h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Full Name & Title</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Clinical Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Title Designation</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Assigned Department</label>
              <input
                type="text"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl font-bold text-xs transition-all shadow-lg shadow-sky-500/20"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>

        {/* Telemetry & Automation Settings */}
        <div className="space-y-6">
          <div className="bento-card p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="font-bold text-white text-sm">Neural AI & Reorder Controls</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div>
                  <span className="font-semibold text-white block">Auto-Generate Reorder POs</span>
                  <span className="text-[11px] text-zinc-400">
                    Propose 1-click POs when projected stockout is &lt; 5 days
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoReorder}
                  onChange={(e) => setAutoReorder(e.target.checked)}
                  className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div>
                  <span className="font-semibold text-white block">Critical Alert SMS Broadcast</span>
                  <span className="text-[11px] text-zinc-400">
                    Notify On-Call Pharmacist on zero balance
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Database Maintenance */}
          <div className="bento-card p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
              <Database className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-white text-sm">Database & Demo Telemetry</h3>
            </div>
            <p className="text-xs text-zinc-400">
              Reset simulated dispensary data back to factory clinical state.
            </p>
            <button
              onClick={handleResetData}
              className="px-4 py-2 bg-zinc-900 border border-zinc-700 hover:bg-rose-500/20 hover:border-rose-500/40 text-rose-400 rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Local State to Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
