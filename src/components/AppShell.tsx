import React, { useState } from 'react';
import { Screen, Tenant, TransportMode } from '../types';
import { MOCK_HUBS } from '../mock/data';
import {
  LayoutDashboard,
  FilePlus2,
  Calculator,
  Building2,
  LogOut,
  Plane,
  Truck,
  Layers,
  ChevronDown,
  Wifi,
  PanelLeftClose,
  PanelLeft,
  RefreshCw,
} from 'lucide-react';

interface AppShellProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  selectedTenant: Tenant;
  onSwitchTenant: () => void;
  onLogout: () => void;
  activeMode: TransportMode;
  onChangeMode: (mode: TransportMode) => void;
  activeHubCode: string;
  onChangeHub: (code: string) => void;
  children: React.ReactNode;
  initialRailCollapsed?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentScreen,
  onNavigate,
  selectedTenant,
  onSwitchTenant,
  onLogout,
  activeMode,
  onChangeMode,
  activeHubCode,
  onChangeHub,
  children,
  initialRailCollapsed = true, // Default collapsed for 1024x768 CF-31 landscape
}) => {
  const [railCollapsed, setRailCollapsed] = useState(initialRailCollapsed);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing'>('synced');

  const navItems = [
    {
      id: 'dashboard' as Screen,
      label: 'Command Center',
      shortcut: '1',
      icon: LayoutDashboard,
    },
    {
      id: 'intake' as Screen,
      label: 'Fast Intake',
      shortcut: '2',
      icon: FilePlus2,
    },
    {
      id: 'eod' as Screen,
      label: 'EOD Reconciliation',
      shortcut: '3',
      icon: Calculator,
    },
  ];

  const handleSimulateSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
    }, 1200);
  };

  return (
    <div className="flex h-screen w-screen max-w-full overflow-hidden bg-[#09090b] text-zinc-100 font-sans">
      {/* Left Navigation Rail */}
      <aside
        className={`h-full bg-[#0e0e11] border-r border-zinc-800 transition-all duration-200 flex flex-col justify-between shrink-0 select-none z-20 ${
          railCollapsed ? 'w-16' : 'w-56'
        }`}
      >
        {/* Top Rail Header */}
        <div>
          <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-3">
            {!railCollapsed ? (
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                  <span className="font-bold text-xs font-mono">{selectedTenant.initials}</span>
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold text-zinc-100 block truncate leading-tight">
                    {selectedTenant.code}
                  </span>
                  <span className="text-[10px] text-zinc-500 block truncate font-mono">
                    CF-31 Station #1
                  </span>
                </div>
              </div>
            ) : (
              <div className="mx-auto h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-mono font-bold text-xs">
                {selectedTenant.initials}
              </div>
            )}

            <button
              onClick={() => setRailCollapsed(!railCollapsed)}
              className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
              title={railCollapsed ? 'Expand navigation rail' : 'Collapse rail (icon mode)'}
              aria-label={railCollapsed ? 'Expand rail' : 'Collapse rail'}
            >
              {railCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
          </div>

          {/* Nav List */}
          <nav className="p-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-xs font-medium transition-all group relative focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none min-h-[44px] ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                      : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
                  }`}
                  title={`${item.label} (Alt+${item.shortcut})`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 transition-transform ${
                      isActive ? 'text-indigo-400 scale-105' : 'text-zinc-400 group-hover:text-zinc-200'
                    }`}
                  />
                  {!railCollapsed && (
                    <div className="flex-1 flex items-center justify-between overflow-hidden">
                      <span className="truncate">{item.label}</span>
                      <kbd className="hidden group-hover:inline-block text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1 rounded border border-zinc-800">
                        {item.shortcut}
                      </kbd>
                    </div>
                  )}
                  {isActive && railCollapsed && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-500 rounded-l" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Rail Actions */}
        <div className="p-2 border-t border-zinc-800 space-y-1">
          <button
            onClick={onSwitchTenant}
            className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-200 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 min-h-[40px]"
            title="Switch Workspace Tenant"
          >
            <Building2 className="h-4 w-4 shrink-0" />
            {!railCollapsed && <span className="truncate">Switch Tenant</span>}
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs text-zinc-400 hover:bg-red-950/40 hover:text-red-300 transition-colors focus-visible:ring-2 focus-visible:ring-red-500 min-h-[40px]"
            title="Sign Out to Login Screen"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!railCollapsed && <span className="truncate">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top App Header Bar */}
        <header className="h-14 border-b border-zinc-800 bg-[#0e0e11]/90 backdrop-blur px-4 flex items-center justify-between gap-3 shrink-0 select-none z-10">
          {/* Left section: Tenant and Mode Switcher */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Tenant indicator badge */}
            <button
              onClick={onSwitchTenant}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors text-xs focus-visible:ring-2 focus-visible:ring-indigo-500 shrink-0"
              title="Click to switch workspace tenant"
            >
              <div className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="font-semibold text-zinc-200 hidden sm:inline">{selectedTenant.name}</span>
              <span className="font-semibold text-zinc-200 sm:hidden">{selectedTenant.code}</span>
              <ChevronDown className="h-3 w-3 text-zinc-500" />
            </button>

            {/* Transport Mode Switcher (Air / Road / Intermodal) */}
            <div className="flex items-center bg-zinc-900/90 p-0.5 rounded-lg border border-zinc-800 shrink-0">
              {(
                [
                  { mode: 'Air', icon: Plane },
                  { mode: 'Road', icon: Truck },
                  { mode: 'Intermodal', icon: Layers },
                ] as const
              ).map(({ mode, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => onChangeMode(mode)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    activeMode === mode
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">{mode}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right section: Hub Selector, Sync Badge, User Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Hub Selector */}
            <div className="relative">
              <select
                value={activeHubCode}
                onChange={(e) => onChangeHub(e.target.value)}
                className="appearance-none bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs rounded-lg pl-3 pr-7 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono cursor-pointer"
              >
                {MOCK_HUBS.map((hub) => (
                  <option key={hub.code} value={hub.code} className="bg-zinc-900 text-zinc-200">
                    {hub.code} ({hub.city})
                  </option>
                ))}
              </select>
              <ChevronDown className="h-3 w-3 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Offline / Sync Badge */}
            <button
              onClick={handleSimulateSync}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
                syncStatus === 'syncing'
                  ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300'
              }`}
              title="Click to force local queue sync with cloud gateway"
            >
              {syncStatus === 'syncing' ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-400" />
              ) : (
                <Wifi className="h-3.5 w-3.5 text-emerald-400" />
              )}
              <span className="hidden sm:inline">
                {syncStatus === 'syncing' ? 'Syncing...' : 'Online • 3 Local'}
              </span>
            </button>

            {/* User Profile / Menu Button */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg border border-zinc-800 bg-zinc-900 hover:border-zinc-700 text-xs text-zinc-200 focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 font-mono text-[11px] font-medium border border-zinc-700">
                  ES
                </div>
                <span className="hidden lg:inline text-xs font-medium">Emmanuel</span>
                <ChevronDown className="h-3 w-3 text-zinc-500" />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-1.5 w-48 rounded-lg bg-[#0e0e11] border border-zinc-800 shadow-2xl p-1.5 z-50 text-xs animate-fadeIn"
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <div className="px-2.5 py-1.5 border-b border-zinc-800 text-[11px] text-zinc-400">
                    <p className="font-semibold text-zinc-200">Emmanuel Sanni</p>
                    <p className="font-mono text-zinc-500">Badge #CF31-409</p>
                  </div>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onSwitchTenant();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-zinc-800/80 text-zinc-300 flex items-center gap-2 mt-1"
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    <span>Switch Tenant</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-red-950/40 text-red-300 flex items-center gap-2"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Viewport Content Slot */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden bg-[#09090b]">
          {children}
        </main>
      </div>
    </div>
  );
};
