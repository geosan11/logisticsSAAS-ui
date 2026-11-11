import React, { useState } from 'react';
import { MOCK_KPIS, MOCK_SHIPMENTS, MOCK_HUB_SUMMARIES, MOCK_ALERTS } from '../mock/data';
import { formatNGN, formatKg, formatNumber } from '../lib/format';
import {
  TrendingUp,
  Package,
  Weight,
  CloudUpload,
  AlertCircle,
  FilePlus2,
  Calculator,
  Search,
  ArrowUpRight,
  Printer,
  Clock,
  Plane,
  Truck,
  Layers,
  ShieldCheck,
} from 'lucide-react';

interface CommandCenterDashboardProps {
  onNavigateToIntake: () => void;
  onNavigateToEod: () => void;
}

export const CommandCenterDashboard: React.FC<CommandCenterDashboardProps> = ({
  onNavigateToIntake,
  onNavigateToEod,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Air' | 'Road' | 'Intermodal'>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const filteredShipments = MOCK_SHIPMENTS.filter((s) => {
    const matchesSearch =
      s.waybillNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.shipper.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.consignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || s.mode === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-[1400px] mx-auto select-none">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-xl text-xs flex items-center gap-2 animate-fadeIn">
          <ShieldCheck className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            Command Center Dashboard
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 border border-zinc-700 font-semibold">
              LIVE STREAM
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Lagos Hub (LOS-01) Operations • High-Density Cargo Manifest Monitor
          </p>
        </div>

        {/* Quick Actions Strip */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => showToast('Dispatch Manifest printed for Flight W3-704')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Print Manifest</span>
          </button>

          <button
            onClick={onNavigateToEod}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
          >
            <Calculator className="h-3.5 w-3.5 text-indigo-400" />
            <span>EOD Close</span>
          </button>

          <button
            onClick={onNavigateToIntake}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-colors"
          >
            <FilePlus2 className="h-3.5 w-3.5" />
            <span>Fast Intake</span>
            <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
          </button>
        </div>
      </div>

      {/* KPI Strip (5 Linear/Vercel style metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* KPI 1: Today's Revenue */}
        <div className="bg-[#0e0e11] border border-zinc-800/90 rounded-xl p-3.5 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 mb-1.5">
            <span className="text-[11px] font-medium uppercase font-mono tracking-wider">Today's Revenue</span>
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-zinc-100 tabular-nums">
            {formatNGN(MOCK_KPIS.todayRevenue)}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
            <span>+14.8%</span>
            <span className="text-zinc-500 font-sans">vs yesterday</span>
          </div>
        </div>

        {/* KPI 2: Waybills */}
        <div className="bg-[#0e0e11] border border-zinc-800/90 rounded-xl p-3.5 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 mb-1.5">
            <span className="text-[11px] font-medium uppercase font-mono tracking-wider">Waybills Logged</span>
            <Package className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <div className="text-lg font-bold text-zinc-100 tabular-nums">
            {formatNumber(MOCK_KPIS.waybillsCount)}
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-1 font-mono">
            <span className="text-indigo-400">100%</span>
            <span className="text-zinc-500 font-sans">tagged & stamped</span>
          </div>
        </div>

        {/* KPI 3: Chargeable Weight */}
        <div className="bg-[#0e0e11] border border-zinc-800/90 rounded-xl p-3.5 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 mb-1.5">
            <span className="text-[11px] font-medium uppercase font-mono tracking-wider">Chargeable Weight</span>
            <Weight className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <div className="text-lg font-bold text-zinc-100 tabular-nums">
            {formatKg(MOCK_KPIS.totalChargeableKg)}
          </div>
          <div className="text-[11px] text-zinc-500 flex items-center gap-1 mt-1 font-mono">
            <span>IATA Rule applied</span>
          </div>
        </div>

        {/* KPI 4: Pending Sync */}
        <div className="bg-[#0e0e11] border border-zinc-800/90 rounded-xl p-3.5 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 mb-1.5">
            <span className="text-[11px] font-medium uppercase font-mono tracking-wider">Local Queue Sync</span>
            <CloudUpload className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-amber-300 tabular-nums">
            {MOCK_KPIS.pendingSyncCount} <span className="text-xs font-normal text-zinc-400">held</span>
          </div>
          <div className="text-[11px] text-amber-400/90 flex items-center gap-1 mt-1 font-mono">
            <span>Offline cache safe</span>
          </div>
        </div>

        {/* KPI 5: Debt Outstanding */}
        <div className="col-span-2 md:col-span-1 bg-[#0e0e11] border border-zinc-800/90 rounded-xl p-3.5 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 mb-1.5">
            <span className="text-[11px] font-medium uppercase font-mono tracking-wider">Credit Outstanding</span>
            <AlertCircle className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-zinc-100 tabular-nums">
            {formatNGN(MOCK_KPIS.debtOutstanding)}
          </div>
          <div className="text-[11px] text-zinc-500 flex items-center gap-1 mt-1 font-mono">
            <span>Corporate 30-day</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Table (Left 7 cols) & Hub Status + Alerts (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Live Shipment Stream Table (High Density) */}
        <div className="lg:col-span-8 bg-[#0e0e11] border border-zinc-800 rounded-xl flex flex-col overflow-hidden">
          {/* Table Header Filter Bar */}
          <div className="p-3 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <div className="relative w-full max-w-xs">
                <Search className="h-3.5 w-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter waybill, shipper, destination..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-lg pl-8 pr-3 py-1.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                />
              </div>
            </div>

            {/* Mode Filter Pills */}
            <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-[11px]">
              {(['All', 'Air', 'Road', 'Intermodal'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    selectedFilter === filter
                      ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Table Content Container */}
          <div className="overflow-x-auto max-h-[360px] relative">
            <table className="w-max min-w-full text-left text-xs border-collapse">
              <thead className="bg-zinc-900/90 text-zinc-400 uppercase font-mono text-[10px] tracking-wider sticky top-0 border-b border-zinc-800 z-10 backdrop-blur">
                <tr>
                  <th className="py-2.5 px-1.5 font-semibold whitespace-nowrap">Waybill #</th>
                  <th className="py-2.5 px-1.5 font-semibold whitespace-nowrap">Route</th>
                  <th className="py-2.5 px-1.5 font-semibold whitespace-nowrap tracking-normal">Shipper / Consignee</th>
                  <th className="py-2.5 px-1.5 font-semibold text-right whitespace-nowrap">Pcs</th>
                  <th className="py-2.5 px-1.5 font-semibold text-right whitespace-nowrap tracking-normal">Chg Wt (kg)</th>
                  <th className="py-2.5 px-1.5 font-semibold text-right whitespace-nowrap">Amount</th>
                  <th className="py-2.5 px-1.5 font-semibold text-center whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-sans">
                {filteredShipments.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-zinc-900/60 transition-colors group cursor-pointer"
                    onClick={() => showToast(`Selected Waybill ${s.waybillNo}`)}
                  >
                    <td className="py-2 px-1.5 font-mono font-medium text-indigo-400 whitespace-nowrap">
                      {s.waybillNo}
                    </td>
                    <td className="py-2 px-1.5 font-mono text-zinc-300 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {s.mode === 'Air' && <Plane className="h-3 w-3 text-indigo-400 shrink-0" />}
                        {s.mode === 'Road' && <Truck className="h-3 w-3 text-amber-400 shrink-0" />}
                        {s.mode === 'Intermodal' && <Layers className="h-3 w-3 text-blue-400 shrink-0" />}
                        <span>
                          <span className="font-semibold text-zinc-200">{s.origin}</span>
                          <span className="text-zinc-500 mx-0.5">→</span>
                          <span className="font-semibold text-zinc-200">{s.destination}</span>
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-1.5 whitespace-nowrap">
                      <div className="font-medium text-zinc-200 truncate max-w-[95px]">{s.shipper}</div>
                      <div className="text-[10px] text-zinc-500 truncate max-w-[95px]">{s.consignee}</div>
                    </td>
                    <td className="py-2 px-1.5 text-right tabular-nums text-zinc-300 font-mono whitespace-nowrap">
                      {s.pieces}
                    </td>
                    <td className="py-2 px-1.5 text-right tabular-nums text-zinc-200 font-mono whitespace-nowrap">
                      {s.chargeableKg.toFixed(1)}
                    </td>
                    <td className="py-2 px-1.5 text-right tabular-nums font-semibold text-zinc-100 font-mono whitespace-nowrap">
                      {formatNGN(s.totalAmount)}
                    </td>
                    <td className="py-2 px-1.5 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-medium whitespace-nowrap ${
                          s.status === 'Manifested'
                            ? 'bg-blue-950/60 text-blue-400 border border-blue-800/60'
                            : s.status === 'In Transit'
                            ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                            : s.status === 'Cleared' || s.status === 'Delivered'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                            : 'bg-red-950/60 text-red-400 border border-red-800/60'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-2 border-t border-zinc-800 bg-zinc-900/40 text-[11px] text-zinc-500 flex items-center justify-between px-3">
            <span>Showing {filteredShipments.length} manifest records</span>
            <span className="font-mono">Real-time local IndexedDB buffer</span>
          </div>
        </div>

        {/* Right Column: Hub Status & Realtime Alerts (5 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Hub Status Cards */}
          <div className="bg-[#0e0e11] border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
                Linehaul & Flight Gateways
              </h2>
              <span className="text-[10px] text-zinc-500 font-mono">Active Links</span>
            </div>

            <div className="space-y-2.5">
              {MOCK_HUB_SUMMARIES.map((hub) => (
                <div
                  key={hub.code}
                  className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-zinc-200">{hub.name}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        hub.status === 'Optimal'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                          : 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                      }`}
                    >
                      {hub.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Queue: <strong className="text-zinc-200 font-mono">{hub.transitQueue} pkgs</strong></span>
                    <span className="flex items-center gap-1 font-mono text-indigo-300">
                      <Clock className="h-3 w-3" />
                      {hub.nextDeparture}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1 truncate">
                    Carrier: {hub.carrierInfo}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Alerts List */}
          <div className="bg-[#0e0e11] border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
                Station Watch Notices
              </h2>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 font-mono font-semibold">
                3 ALERTS
              </span>
            </div>

            <div className="space-y-2.5">
              {MOCK_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-2.5 rounded-lg border text-xs ${
                    alert.level === 'critical'
                      ? 'bg-red-950/30 border-red-900/60 text-red-200'
                      : alert.level === 'warning'
                      ? 'bg-amber-950/30 border-amber-900/60 text-amber-200'
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold text-[11px] mb-0.5">
                    <span className="flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {alert.title}
                    </span>
                    <span className="font-mono text-[10px] opacity-75">{alert.time}</span>
                  </div>
                  <p className="text-[11px] opacity-90 leading-relaxed mt-0.5">
                    {alert.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
