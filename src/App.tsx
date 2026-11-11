import { useState, useEffect } from 'react';
import { Screen, Tenant, TransportMode } from './types';
import { MOCK_TENANTS } from './mock/data';
import { LoginScreen } from './components/LoginScreen';
import { TenantGate } from './components/TenantGate';
import { AppShell } from './components/AppShell';
import { CommandCenterDashboard } from './components/CommandCenterDashboard';
import { FastCounterIntake } from './components/FastCounterIntake';
import { EodReconciliationView } from './components/EodReconciliationView';
import { Compass } from 'lucide-react';

export function App() {
  // Read initial screen and flags from URL query parameters (?screen=...)
  const getInitialParams = () => {
    if (typeof window === 'undefined') {
      return { screen: 'dashboard' as Screen, subState: '' };
    }
    const params = new URLSearchParams(window.location.search);
    const screenParam = params.get('screen') || 'dashboard';

    if (screenParam === 'login-error') return { screen: 'login' as Screen, subState: 'login-error' };
    if (screenParam === 'login') return { screen: 'login' as Screen, subState: '' };
    if (screenParam === 'tenant-suspended') return { screen: 'tenant' as Screen, subState: 'tenant-suspended' };
    if (screenParam === 'tenant') return { screen: 'tenant' as Screen, subState: '' };
    if (screenParam === 'intake-error') return { screen: 'intake' as Screen, subState: 'intake-error' };
    if (screenParam === 'intake') return { screen: 'intake' as Screen, subState: '' };
    if (screenParam === 'eod-modal') return { screen: 'eod' as Screen, subState: 'eod-modal' };
    if (screenParam === 'eod') return { screen: 'eod' as Screen, subState: '' };
    return { screen: 'dashboard' as Screen, subState: '' };
  };

  const initial = getInitialParams();
  const [currentScreen, setCurrentScreen] = useState<Screen>(initial.screen);
  const [subState, setSubState] = useState<string>(initial.subState);
  const [selectedTenant, setSelectedTenant] = useState<Tenant>(MOCK_TENANTS[0]);
  const [activeMode, setActiveMode] = useState<TransportMode>('Air');
  const [activeHubCode, setActiveHubCode] = useState<string>('LOS-01');
  const [showDemoNav, setShowDemoNav] = useState(false);

  // Sync state changes with URL query string for deep-linking and browser navigation
  const navigateTo = (screen: Screen, stateName = '') => {
    setCurrentScreen(screen);
    setSubState(stateName);
    const targetQuery = stateName ? stateName : screen;
    const url = new URL(window.location.href);
    url.searchParams.set('screen', targetQuery);
    window.history.replaceState({}, '', url.toString());
  };

  // Listen to popstate in case user clicks back/forward
  useEffect(() => {
    const handlePopState = () => {
      const p = getInitialParams();
      setCurrentScreen(p.screen);
      setSubState(p.subState);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-zinc-100 font-sans relative selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Screen 1: Login */}
      {currentScreen === 'login' && (
        <LoginScreen
          onLogin={() => navigateTo('tenant')}
          initialError={subState === 'login-error'}
        />
      )}

      {/* Screen 2: TenantGate */}
      {currentScreen === 'tenant' && (
        <TenantGate
          onSelectTenant={(tenant) => {
            setSelectedTenant(tenant);
            navigateTo('dashboard');
          }}
          onLogout={() => navigateTo('login')}
          initialSuspendedOnly={subState === 'tenant-suspended'}
        />
      )}

      {/* Screens 3, 4, 5: Hosted within AppShell */}
      {(currentScreen === 'dashboard' || currentScreen === 'intake' || currentScreen === 'eod') && (
        <AppShell
          currentScreen={currentScreen}
          onNavigate={(screen) => navigateTo(screen)}
          selectedTenant={selectedTenant}
          onSwitchTenant={() => navigateTo('tenant')}
          onLogout={() => navigateTo('login')}
          activeMode={activeMode}
          onChangeMode={setActiveMode}
          activeHubCode={activeHubCode}
          onChangeHub={setActiveHubCode}
          initialRailCollapsed={true}
        >
          {currentScreen === 'dashboard' && (
            <CommandCenterDashboard
              onNavigateToIntake={() => navigateTo('intake')}
              onNavigateToEod={() => navigateTo('eod')}
            />
          )}

          {currentScreen === 'intake' && (
            <FastCounterIntake
              initialShowErrors={subState === 'intake-error'}
            />
          )}

          {currentScreen === 'eod' && (
            <EodReconciliationView
              initialConfirmOpen={subState === 'eod-modal'}
            />
          )}
        </AppShell>
      )}

      {/* Floating Demo Navigator Bar for easy inspection across all required reviewer states */}
      <div className="fixed bottom-32 left-2.5 z-50 select-none">
        {showDemoNav ? (
          <div className="bg-[#0e0e11] border border-zinc-800 rounded-xl p-3 shadow-2xl max-w-sm space-y-2 animate-fadeIn text-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
              <span className="font-bold text-zinc-200 flex items-center gap-1.5 font-mono text-[11px]">
                <Compass className="h-3.5 w-3.5 text-indigo-400" />
                Screen &amp; State Deep Links
              </span>
              <button
                onClick={() => setShowDemoNav(false)}
                className="text-zinc-500 hover:text-zinc-200 text-xs px-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
              <button
                onClick={() => navigateTo('login')}
                className={`px-2 py-1.5 rounded text-left border ${
                  currentScreen === 'login' && subState !== 'login-error'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-850'
                }`}
              >
                1. Login
              </button>
              <button
                onClick={() => navigateTo('login', 'login-error')}
                className={`px-2 py-1.5 rounded text-left border ${
                  currentScreen === 'login' && subState === 'login-error'
                    ? 'bg-red-600 text-white border-red-500'
                    : 'bg-zinc-900 border-zinc-800 text-red-300 hover:bg-zinc-850'
                }`}
              >
                Login (Error)
              </button>

              <button
                onClick={() => navigateTo('tenant')}
                className={`px-2 py-1.5 rounded text-left border ${
                  currentScreen === 'tenant' && subState !== 'tenant-suspended'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-850'
                }`}
              >
                2. Tenant Gate
              </button>
              <button
                onClick={() => navigateTo('tenant', 'tenant-suspended')}
                className={`px-2 py-1.5 rounded text-left border ${
                  currentScreen === 'tenant' && subState === 'tenant-suspended'
                    ? 'bg-red-600 text-white border-red-500'
                    : 'bg-zinc-900 border-zinc-800 text-red-300 hover:bg-zinc-850'
                }`}
              >
                Tenant (Suspended)
              </button>

              <button
                onClick={() => navigateTo('dashboard')}
                className={`px-2 py-1.5 rounded text-left border ${
                  currentScreen === 'dashboard'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-850'
                }`}
              >
                3. Dashboard
              </button>
              <button
                onClick={() => navigateTo('intake')}
                className={`px-2 py-1.5 rounded text-left border ${
                  currentScreen === 'intake' && subState !== 'intake-error'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-850'
                }`}
              >
                4. Fast Intake
              </button>

              <button
                onClick={() => navigateTo('intake', 'intake-error')}
                className={`px-2 py-1.5 rounded text-left border ${
                  currentScreen === 'intake' && subState === 'intake-error'
                    ? 'bg-red-600 text-white border-red-500'
                    : 'bg-zinc-900 border-zinc-800 text-red-300 hover:bg-zinc-850'
                }`}
              >
                Intake (Errors)
              </button>
              <button
                onClick={() => navigateTo('eod')}
                className={`px-2 py-1.5 rounded text-left border ${
                  currentScreen === 'eod' && subState !== 'eod-modal'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-850'
                }`}
              >
                5. EOD Reconcile
              </button>

              <button
                onClick={() => navigateTo('eod', 'eod-modal')}
                className={`col-span-2 px-2 py-1.5 rounded text-left border ${
                  currentScreen === 'eod' && subState === 'eod-modal'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-zinc-900 border-zinc-800 text-indigo-300 hover:bg-zinc-850'
                }`}
              >
                EOD (Confirm Modal Open)
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowDemoNav(true)}
            className="flex items-center justify-center h-9 w-9 rounded-lg bg-[#0e0e11]/95 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 shadow-xl backdrop-blur transition-colors"
            title="Open Demo Screen Switcher"
            aria-label="Open Demo Screen Switcher"
          >
            <Compass className="h-4 w-4 text-indigo-400" />
          </button>
        )}
      </div>
    </div>
  );
}
