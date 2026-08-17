import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Activity,
  Layers
} from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const SignInView: React.FC = () => {
  const { login, setUserProfile } = useERP();
  const [email, setEmail] = useState('elena.vance@livsera.health');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<'Director' | 'Pharmacist' | 'Admin'>('Director');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setUserProfile({
        name: role === 'Director' ? 'Dr. Elena Vance' : role === 'Pharmacist' ? 'Marcus Thorne, PharmD' : 'Sarah Jenkins',
        title: role === 'Director' ? 'Chief Medical Operations' : role === 'Pharmacist' ? 'Lead Clinical Pharmacist' : 'ERP Systems Admin',
        role: role === 'Director' ? 'Director of Clinical Operations' : role === 'Pharmacist' ? 'Clinical Dispensing Lead' : 'System Administrator',
        department: 'Central Pharmacy & Clinical Supply',
        avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
      });
      login();
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Bento Feature Card */}
        <div className="bento-card-highlight p-8 flex flex-col justify-between hidden md:flex">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-sky-500/30 mb-6">
              L
            </div>
            <h1 className="text-[26px] font-bold text-white tracking-tight leading-tight">
              Livsera Health ERP
            </h1>
            <p className="text-sm text-sky-200/80 mt-2 leading-relaxed">
              Enterprise clinical pharmaceutical inventory, neural stockout mitigation, and automated dispensary order flows.
            </p>
          </div>

          <div className="space-y-3 my-6">
            <div className="flex items-center gap-3 text-xs text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-sky-400" />
              <span>Real-time hospital ward dispensing telemetry</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Biomedical LSTM predictive stockout warnings</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>Automated 1-click supplier Purchase Orders</span>
            </div>
          </div>

          <div className="pt-4 border-t border-sky-500/20 text-[11px] text-zinc-400 font-data-mono">
            SECURE ACCESS • 256-BIT ENCRYPTION • HIPAA COMPLIANT
          </div>
        </div>

        {/* Right Sign-in Form Bento Card */}
        <div className="bento-card p-8 flex flex-col justify-center space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-semibold uppercase text-sky-400 tracking-wider">
                Clinician Portal
              </span>
            </div>
            <h2 className="text-[24px] font-bold text-white tracking-tight">
              Authenticate Session
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Select your role profile to access clinical telemetry.
            </p>
          </div>

          {/* Quick Role Switcher */}
          <div className="grid grid-cols-3 gap-2 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setRole('Director')}
              className={`py-1.5 rounded-lg transition-colors ${
                role === 'Director' ? 'bg-sky-500 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Director
            </button>
            <button
              type="button"
              onClick={() => setRole('Pharmacist')}
              className={`py-1.5 rounded-lg transition-colors ${
                role === 'Pharmacist' ? 'bg-sky-500 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Pharmacist
            </button>
            <button
              type="button"
              onClick={() => setRole('Admin')}
              className={`py-1.5 rounded-lg transition-colors ${
                role === 'Admin' ? 'bg-sky-500 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Clinical ID / Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 font-data-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 active:scale-[0.98]"
            >
              {loading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  Access ERP System <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-center text-zinc-500">
            Need credential elevation? Contact the IT Pharmacy Superuser.
          </p>
        </div>
      </div>
    </div>
  );
};
