import React, { useState } from 'react';
import { Package, Lock, Mail, Eye, EyeOff, AlertCircle, WifiOff, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
  initialError?: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, initialError = false }) => {
  const [email, setEmail] = useState('operator.los01@logisticssaas.ng');
  const [password, setPassword] = useState('TerminalPass2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [showError, setShowError] = useState(initialError);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setShowError(true);
      return;
    }
    // Presentational success
    onLogin();
  };

  return (
    <div className="min-h-screen w-full bg-[#09090b] flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background radial gradient accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-[#09090b] to-[#09090b] pointer-events-none" />

      {/* Main card */}
      <div className="relative w-full max-w-md bg-[#0e0e11] border border-zinc-800 rounded-xl shadow-2xl p-6 sm:p-8 z-10 backdrop-blur-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-3 shadow-lg shadow-indigo-950/50">
            <Package className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">logistics<span className="text-indigo-400">SAAS</span></h1>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60 font-semibold tracking-wider">
              Terminal v2.4
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">Panasonic CF-31 Counter Station Client • LOS Gateway</p>
        </div>

        {/* Offline Notice Banner */}
        <div className="mb-4 flex items-center gap-2.5 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
          <WifiOff className="h-4 w-4 text-amber-400 shrink-0" />
          <div className="flex-1 text-[11px] leading-tight">
            <span className="font-medium text-zinc-200">Offline-Ready Mode</span> — Local cache active. Manifest intake can continue without internet.
          </div>
        </div>

        {/* Error State Banner */}
        {showError && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-red-950/50 border border-red-800/80 text-xs text-red-200 animate-fadeIn"
          >
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-[11px] leading-tight">
              <span className="font-semibold text-red-300">Authentication Failed:</span> Counter terminal token expired or invalid station credentials. Please verify your badge key.
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Terminal Operator Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@logisticssaas.ng"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-zinc-900/90 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-zinc-300">Operator Key / PIN</label>
              <button
                type="button"
                onClick={() => setShowError(!showError)}
                className="text-[11px] text-zinc-400 hover:text-indigo-400 transition-colors"
                title="Toggle simulated error state"
              >
                {showError ? 'Hide simulated error' : 'Simulate error'}
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2.5 text-sm bg-zinc-900/90 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-200 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberTerminal}
                onChange={(e) => setRememberTerminal(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 focus:ring-2 cursor-pointer"
              />
              <span className="text-xs text-zinc-400">Remember this CF-31 device</span>
            </label>
            <span className="text-xs text-zinc-500 flex items-center gap-1 font-mono">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              TLS Encrypted
            </span>
          </div>

          {/* Login button with minimum 44px tap target height */}
          <button
            type="submit"
            className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-lg shadow-indigo-600/25 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
          >
            <span>Sign In to Terminal</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Demo Fast Navigation */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
          <p className="text-[11px] text-zinc-500">
            High-density presentational build for rugged counter stations • Touch & Barcode Ready
          </p>
        </div>
      </div>
    </div>
  );
};
