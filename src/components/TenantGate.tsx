import React, { useState } from 'react';
import { Tenant } from '../types';
import { MOCK_TENANTS } from '../mock/data';
import { Building2, Layers, AlertTriangle, ArrowRight, ShieldAlert, LogOut, CheckCircle2 } from 'lucide-react';

interface TenantGateProps {
  onSelectTenant: (tenant: Tenant) => void;
  onLogout: () => void;
  initialSuspendedOnly?: boolean;
}

export const TenantGate: React.FC<TenantGateProps> = ({
  onSelectTenant,
  onLogout,
  initialSuspendedOnly = false,
}) => {
  const [selectedSuspended, setSelectedSuspended] = useState<Tenant | null>(
    initialSuspendedOnly ? MOCK_TENANTS.find((t) => t.status === 'suspended') || null : null
  );

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-zinc-100 p-6 md:p-8 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
              logistics<span className="text-indigo-400">SAAS</span> Multi-Tenant Gateway
            </h1>
            <p className="text-xs text-zinc-400">Station Terminal: CF31-LOS-GATE01 • Lagos Ikeja Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-medium text-zinc-200">Emmanuel Sanni</span>
            <span className="text-[11px] text-zinc-500">Regional Station Lead</span>
          </div>
          <button
            onClick={onLogout}
            className="min-h-[40px] px-3 py-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Selection Body */}
      <main className="max-w-6xl w-full mx-auto py-8 flex-1">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 font-mono">Counter Partition Access</span>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100 mt-1">Select Freight Operator Workspace</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Choose the authorized logistics provider database partition to initialize manifest processing and counter cash drawers.
          </p>
        </div>

        {/* Suspended Modal / Banner Overlay if suspended clicked */}
        {selectedSuspended && (
          <div
            role="alert"
            className="mb-8 p-4 rounded-xl bg-red-950/40 border border-red-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fadeIn"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-900/40 border border-red-700/60 flex items-center justify-center text-red-400 shrink-0">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-red-200">{selectedSuspended.name} — Workspace Locked</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-900/60 text-red-300 uppercase font-semibold">
                    SUSPENDED
                  </span>
                </div>
                <p className="text-xs text-red-300/90 mt-1 leading-relaxed max-w-2xl">
                  {selectedSuspended.suspendedReason}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedSuspended(null)}
              className="px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-900/60 text-red-200 border border-red-700 text-xs shrink-0 transition-colors"
            >
              Dismiss Warning
            </button>
          </div>
        )}

        {/* Tenant Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_TENANTS.map((tenant) => {
            const isSuspended = tenant.status === 'suspended';

            return (
              <div
                key={tenant.id}
                className={`relative rounded-xl border p-5 transition-all flex flex-col justify-between ${
                  isSuspended
                    ? 'bg-[#0e0e11]/70 border-red-900/40 hover:border-red-800/70'
                    : 'bg-[#0e0e11] border-zinc-800 hover:border-zinc-700 hover:shadow-xl hover:shadow-indigo-950/20'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-base font-mono border ${
                          isSuspended
                            ? 'bg-red-950/50 border-red-800 text-red-400'
                            : 'bg-indigo-950/60 border-indigo-700/60 text-indigo-300'
                        }`}
                      >
                        {tenant.initials}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                          {tenant.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                          <span className="font-mono text-zinc-500">ID: {tenant.code}</span>
                          <span>•</span>
                          <span>{tenant.plan}</span>
                        </div>
                      </div>
                    </div>

                    {isSuspended ? (
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-red-950/80 border border-red-800 text-red-400 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Suspended
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Active
                      </span>
                    )}
                  </div>

                  {/* Hubs and Shipments Stats */}
                  <div className="grid grid-cols-2 gap-2 my-4 py-3 px-3 rounded-lg bg-zinc-900/70 border border-zinc-800/70">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-zinc-500 block">Hub Footprint</span>
                      <span className="text-sm font-semibold text-zinc-200 tabular-nums">{tenant.hubsCount} Hubs</span>
                      <span className="text-[11px] text-zinc-500 block mt-0.5">Nationwide network</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-zinc-500 block">Active Manifests</span>
                      <span className="text-sm font-semibold text-zinc-200 tabular-nums">
                        {isSuspended ? 'Frozen (0)' : `${tenant.activeShipments} in transit`}
                      </span>
                      <span className="text-[11px] text-zinc-500 block mt-0.5">
                        {isSuspended ? 'License restricted' : 'Normal throughput'}
                      </span>
                    </div>
                  </div>

                  {isSuspended && (
                    <div className="text-xs text-red-400/90 mb-4 bg-red-950/30 p-2.5 rounded-lg border border-red-900/40">
                      <strong>Audit Hold:</strong> CBN and NCAA regulatory e-manifest verification in progress. Station intake disabled.
                    </div>
                  )}
                </div>

                {/* Card Action Button with minimum 44px tap target height */}
                {isSuspended ? (
                  <button
                    onClick={() => setSelectedSuspended(tenant)}
                    className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-red-400 border border-red-900/50 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>View Suspension Audit Details</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onSelectTenant(tenant)}
                    className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-md shadow-indigo-900/30 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
                  >
                    <span>Launch Counter Station</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-zinc-400" />
          <span>Tenant Gate Isolation Architecture • Multi-Tenant RBAC</span>
        </div>
        <div className="font-mono text-[11px] text-zinc-600">
          Replit Ready • Presentational UI Build v1.0
        </div>
      </footer>
    </div>
  );
};
