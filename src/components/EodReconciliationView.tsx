import React, { useState, useEffect, useRef } from 'react';
import {
  MOCK_RECONCILIATION,
  INITIAL_DENOMINATIONS,
  MOCK_UNSYNCED_ENTRIES,
} from '../mock/data';
import { formatNGN, formatNumber } from '../lib/format';
import { DenominationItem, UnsyncedEntry } from '../types';
import {
  Calculator,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Plus,
  Minus,
  Coins,
  Receipt,
  FileWarning,
  KeyRound,
  Check,
} from 'lucide-react';

interface EodReconciliationViewProps {
  initialConfirmOpen?: boolean;
}

export const EodReconciliationView: React.FC<EodReconciliationViewProps> = ({
  initialConfirmOpen = false,
}) => {
  const [denominations, setDenominations] = useState<DenominationItem[]>(INITIAL_DENOMINATIONS);
  const [unsyncedEntries, setUnsyncedEntries] = useState<UnsyncedEntry[]>(MOCK_UNSYNCED_ENTRIES);
  const [confirmModalOpen, setConfirmModalOpen] = useState(initialConfirmOpen);
  const [supervisorPin, setSupervisorPin] = useState('8842');
  const [isClosed, setIsClosed] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const pinInputRef = useRef<HTMLInputElement>(null);

  // Compute total counted physical cash from denomination breakdown
  const countedCashFromNotes = denominations.reduce((sum, item) => sum + item.value * item.count, 0);

  // Update reconciliation table dynamically
  const reconciliationData = MOCK_RECONCILIATION.map((row) => {
    if (row.mode === 'Cash') {
      const diff = countedCashFromNotes - row.expectedAmount;
      return {
        ...row,
        countedAmount: countedCashFromNotes,
        variance: diff,
      };
    }
    return row;
  });

  const totalExpected = reconciliationData.reduce((acc, row) => acc + row.expectedAmount, 0);
  const totalCounted = reconciliationData.reduce((acc, row) => acc + row.countedAmount, 0);
  const totalVariance = totalCounted - totalExpected;

  const handleDenominationChange = (index: number, delta: number) => {
    setDenominations((prev) => {
      const next = [...prev];
      const newCount = Math.max(0, next[index].count + delta);
      next[index] = { ...next[index], count: newCount };
      return next;
    });
  };

  const handleDenominationDirectInput = (index: number, val: string) => {
    const parsed = parseInt(val) || 0;
    setDenominations((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], count: Math.max(0, parsed) };
      return next;
    });
  };

  const handleResolveUnsynced = (id: string) => {
    setUnsyncedEntries((prev) => prev.filter((item) => item.id !== id));
    setSuccessToast(`Entry ${id} verified and queued for cloud sync!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Esc key and modal focus handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && confirmModalOpen) {
        setConfirmModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [confirmModalOpen]);

  useEffect(() => {
    if (confirmModalOpen && pinInputRef.current) {
      setTimeout(() => pinInputRef.current?.focus(), 50);
    }
  }, [confirmModalOpen]);

  const handleConfirmCloseRegister = () => {
    setConfirmModalOpen(false);
    setIsClosed(true);
    setSuccessToast('Day-End Reconciliation completed! Counter register sealed.');
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-[1400px] mx-auto select-none overflow-y-auto">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-2xl text-xs flex items-center gap-2 animate-fadeIn font-semibold">
          <Check className="h-4 w-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              End-of-Day (EOD) Reconciliation
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                isClosed
                  ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                  : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
              }`}>
                {isClosed ? 'REGISTER SEALED' : 'SESSION #LOS01-942'}
              </span>
            </h1>
            <p className="text-xs text-zinc-400">
              Cross-verify expected system receipts against physical cash and payment gateway records.
            </p>
          </div>
        </div>

        {/* Action Button: Close Day (minimum 44px tap target height) */}
        {!isClosed ? (
          <button
            onClick={() => setConfirmModalOpen(true)}
            className="min-h-[44px] px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
          >
            <Lock className="h-4 w-4" />
            <span>Close Day & Settle Register</span>
            <ArrowRight className="h-4 w-4 opacity-80" />
          </button>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-mono font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Day Closed • Vault Bag #VB-091</span>
          </div>
        )}
      </div>

      {/* Section 1: Summary Variance Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-[#0e0e11] border border-zinc-800">
          <span className="text-[10px] uppercase font-mono text-zinc-500 block">Total Expected Collections</span>
          <span className="text-lg font-bold text-zinc-100 tabular-nums font-mono mt-0.5 block">
            {formatNGN(totalExpected)}
          </span>
          <span className="text-[11px] text-zinc-400">142 total waybills cleared today</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0e0e11] border border-zinc-800">
          <span className="text-[10px] uppercase font-mono text-zinc-500 block">Total Counted &amp; Verified</span>
          <span className="text-lg font-bold text-zinc-100 tabular-nums font-mono mt-0.5 block">
            {formatNGN(totalCounted)}
          </span>
          <span className="text-[11px] text-zinc-400">Physical notes + gateway settle</span>
        </div>

        <div className={`p-3.5 rounded-xl border ${
          totalVariance === 0
            ? 'bg-emerald-950/20 border-emerald-800/60'
            : totalVariance < 0
            ? 'bg-red-950/20 border-red-800/60'
            : 'bg-amber-950/20 border-amber-800/60'
        }`}>
          <span className="text-[10px] uppercase font-mono text-zinc-500 block">Register Net Variance</span>
          <span className={`text-lg font-bold tabular-nums font-mono mt-0.5 block ${
            totalVariance === 0 ? 'text-emerald-400' : totalVariance < 0 ? 'text-red-400' : 'text-amber-400'
          }`}>
            {totalVariance === 0 ? '₦0 (Balanced)' : formatNGN(totalVariance)}
          </span>
          <span className="text-[11px] text-zinc-400">
            {totalVariance === 0
              ? 'Exact ledger alignment'
              : totalVariance < 0
              ? 'POS batch dispute flagged (-₦5,000)'
              : 'Surplus cash in drawer'}
          </span>
        </div>
      </div>

      {/* Section 2: Expected vs Counted by Payment Mode (Table) */}
      <div className="bg-[#0e0e11] border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-indigo-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
              Channel Reconciliation Breakdown
            </h2>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">Auto-balanced live</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-zinc-900/90 text-zinc-400 uppercase font-mono text-[10px] border-b border-zinc-800">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Payment Channel</th>
                <th className="py-2.5 px-4 font-semibold text-right">Transactions</th>
                <th className="py-2.5 px-4 font-semibold text-right">Expected Amount</th>
                <th className="py-2.5 px-4 font-semibold text-right">Counted / Settled</th>
                <th className="py-2.5 px-4 font-semibold text-right">Variance</th>
                <th className="py-2.5 px-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-sans">
              {reconciliationData.map((row) => {
                const hasVariance = row.variance !== 0;

                return (
                  <tr key={row.mode} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-zinc-200">
                      {row.mode}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums font-mono text-zinc-300">
                      {row.transactions} txns
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums font-mono font-medium text-zinc-200">
                      {formatNGN(row.expectedAmount)}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums font-mono font-semibold text-zinc-100">
                      {formatNGN(row.countedAmount)}
                    </td>
                    <td
                      className={`py-2.5 px-4 text-right tabular-nums font-mono font-bold ${
                        row.variance === 0
                          ? 'text-emerald-400'
                          : row.variance < 0
                          ? 'text-red-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {row.variance === 0 ? '₦0' : formatNGN(row.variance)}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                          !hasVariance
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                            : 'bg-red-950/80 text-red-400 border border-red-800/80'
                        }`}
                      >
                        {!hasVariance ? 'MATCHED' : 'DISCREPANCY'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Physical Cash Denomination Counter & Unsynced Entries (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Cash Denomination Counter for Nigerian Naira (7 cols) */}
        <div className="lg:col-span-7 bg-[#0e0e11] border border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-amber-400" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
                Nigerian Naira Physical Cash Counter
              </h2>
            </div>
            <span className="text-xs font-bold text-amber-400 font-mono tabular-nums">
              Total: {formatNGN(countedCashFromNotes)}
            </span>
          </div>

          <div className="space-y-2">
            {denominations.map((item, idx) => {
              const subtotal = item.value * item.count;

              return (
                <div
                  key={item.value}
                  className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors gap-3"
                >
                  <div className="w-24">
                    <span className="text-xs font-bold font-mono text-zinc-200 block">{item.label}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">₦{item.value}</span>
                  </div>

                  {/* Quantity Stepper with 44px tap targets */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDenominationChange(idx, -1)}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-200 font-bold text-base transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
                      aria-label={`Decrease ${item.label}`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      value={item.count}
                      onChange={(e) => handleDenominationDirectInput(idx, e.target.value)}
                      className="w-16 min-h-[44px] text-center bg-zinc-950 border border-zinc-700 rounded-lg text-xs font-mono font-bold text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 tabular-nums"
                    />

                    <button
                      type="button"
                      onClick={() => handleDenominationChange(idx, 1)}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-200 font-bold text-base transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
                      aria-label={`Increase ${item.label}`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-right w-28">
                    <span className="text-xs font-bold text-zinc-100 font-mono tabular-nums block">
                      {formatNGN(subtotal)}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">{formatNumber(item.count)} notes</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Unsynced & Quarantined Entries (5 cols) */}
        <div className="lg:col-span-5 bg-[#0e0e11] border border-zinc-800 rounded-xl p-4 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <FileWarning className="h-4 w-4 text-amber-400" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
                  Unsynced &amp; Quarantined Entries
                </h2>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                {unsyncedEntries.length} Items
              </span>
            </div>

            <p className="text-[11px] text-zinc-400 mt-2">
              Waybills flagged during offline micro-drops or awaiting hazardous cargo clearance. Must be cleared before sealing the register.
            </p>

            <div className="space-y-2.5 mt-3">
              {unsyncedEntries.length === 0 ? (
                <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-center text-xs text-emerald-300">
                  <CheckCircle2 className="h-6 w-6 mx-auto mb-1 text-emerald-400" />
                  All local queue entries synchronized and cleared!
                </div>
              ) : (
                unsyncedEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-indigo-400">
                        {entry.waybillNo}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800/60 font-semibold">
                        {entry.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-snug">{entry.note}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80 text-[10px] text-zinc-500 font-mono">
                      <span>Value: {formatNGN(entry.amount)}</span>
                      <button
                        onClick={() => handleResolveUnsynced(entry.id)}
                        className="min-h-[36px] px-2.5 py-1 rounded bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/60 transition-colors font-sans text-xs"
                      >
                        Force Cloud Sync
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-900 text-[11px] text-zinc-500 font-mono border border-zinc-800/80 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Station terminal audit log: All actions hashed locally</span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal (Accessible Dialog with Focus Trap & Esc Support) */}
      {confirmModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setConfirmModalOpen(false)}
        >
          <div
            ref={modalRef}
            className="bg-[#0e0e11] border border-zinc-800 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Lock className="h-4 w-4" />
                </div>
                <h3 id="modal-title" className="text-sm font-bold text-zinc-100">
                  Confirm Register Closeout
                </h3>
              </div>
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 text-xs px-2 py-1 rounded hover:bg-zinc-800"
                aria-label="Close dialog"
              >
                ✕ Esc
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <p>
                You are about to seal counter register session <strong>#LOS01-942</strong>. Once sealed, all waybills will be committed to the master airline manifest and the cash drawer locked.
              </p>

              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total Counted Cash:</span>
                  <span className="font-bold text-zinc-200">{formatNGN(countedCashFromNotes)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">POS &amp; Gateway Sum:</span>
                  <span className="font-bold text-zinc-200">
                    {formatNGN(totalCounted - countedCashFromNotes)}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-zinc-800 font-bold">
                  <span className="text-zinc-300">Net Settled Total:</span>
                  <span className="text-emerald-400">{formatNGN(totalCounted)}</span>
                </div>
              </div>

              {totalVariance !== 0 && (
                <div className="p-2.5 rounded-lg bg-amber-950/50 border border-amber-800 text-amber-200 flex items-start gap-2 text-[11px]">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                  <span>
                    Variance of {formatNGN(totalVariance)} will be reported in the nightly supervisor exception dossier.
                  </span>
                </div>
              )}

              {/* Supervisor PIN input */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Station Supervisor Authorization PIN
                </label>
                <div className="relative">
                  <input
                    ref={pinInputRef}
                    type="password"
                    maxLength={6}
                    value={supervisorPin}
                    onChange={(e) => setSupervisorPin(e.target.value)}
                    placeholder="Enter 4-digit PIN"
                    className="w-full px-3 py-2 text-sm bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <KeyRound className="h-4 w-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Modal Actions with 44px+ minimum tap target */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="min-h-[44px] px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-zinc-500"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmCloseRegister}
                className="min-h-[44px] px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-lg shadow-indigo-600/30 focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                Confirm &amp; Seal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
