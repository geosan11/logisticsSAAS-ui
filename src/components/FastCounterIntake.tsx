import React, { useState, useEffect } from 'react';
import { calcChargeable } from '../lib/calc';
import { formatNGN, formatKg } from '../lib/format';
import { MOCK_HUBS } from '../mock/data';
import {
  FilePlus2,
  Printer,
  Check,
  AlertCircle,
  CreditCard,
  Banknote,
  Building,
  Wallet,
} from 'lucide-react';

interface FastCounterIntakeProps {
  initialShowErrors?: boolean;
}

export const FastCounterIntake: React.FC<FastCounterIntakeProps> = ({
  initialShowErrors = false,
}) => {
  // Form fields
  const [shipperName, setShipperName] = useState('Alaba Electronics Ltd');
  const [shipperPhone, setShipperPhone] = useState('0803 456 7890');
  const [consigneeName, setConsigneeName] = useState('Wuse Commercial Plaza');
  const [consigneePhone, setConsigneePhone] = useState('0809 112 3344');
  const [origin, setOrigin] = useState('LOS-01');
  const [destination, setDestination] = useState('ABV-01');
  const [pieces, setPieces] = useState<number>(3);
  const [actualKg, setActualKg] = useState<number>(14.2);
  const [lengthCm, setLengthCm] = useState<number>(55);
  const [widthCm, setWidthCm] = useState<number>(45);
  const [heightCm, setHeightCm] = useState<number>(38);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Transfer' | 'POS' | 'Wallet'>('Transfer');
  const [paymentRef, setPaymentRef] = useState('GTB-TRX-994102');

  // State flags
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [showErrorBanner, setShowErrorBanner] = useState(initialShowErrors);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  // Rate config
  const ratePerKg = 1850; // NGN per kg for express air
  const handlingFee = 2500; // Flat terminal security/handling fee

  // Dynamic IATA calculation
  const weightCalc = calcChargeable(actualKg, lengthCm, widthCm, heightCm);
  const freightSubtotal = weightCalc.chargeableKg * ratePerKg;
  const vat = Math.round((freightSubtotal + handlingFee) * 0.075);
  const totalAmount = freightSubtotal + handlingFee + vat;

  // Initial error preset if requested
  useEffect(() => {
    if (initialShowErrors) {
      setShipperName('');
      setConsigneePhone('');
      setActualKg(0);
      setErrors({
        shipperName: true,
        consigneePhone: true,
        actualKg: true,
      });
      setShowErrorBanner(true);
    }
  }, [initialShowErrors]);

  const validate = () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!shipperName.trim()) newErrors.shipperName = true;
    if (!consigneeName.trim()) newErrors.consigneeName = true;
    if (!consigneePhone.trim()) newErrors.consigneePhone = true;
    if (pieces <= 0 || isNaN(pieces)) newErrors.pieces = true;
    if (actualKg <= 0 || isNaN(actualKg)) newErrors.actualKg = true;
    if (lengthCm <= 0 || widthCm <= 0 || heightCm <= 0) newErrors.dimensions = true;

    setErrors(newErrors);
    const hasError = Object.keys(newErrors).length > 0;
    setShowErrorBanner(hasError);
    return !hasError;
  };

  const handleSave = () => {
    if (!validate()) return;
    const generatedWaybill = `LOS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setSuccessBanner(`Waybill ${generatedWaybill} generated & saved to local manifest!`);
    setShowErrorBanner(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const handlePrint = () => {
    setPrintModalOpen(true);
  };

  // Keyboard shortcut listener for Enter and Ctrl+P
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+P or Cmd+P to print
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrint();
      }
      // Enter (outside of textareas) saves waybill
      if (e.key === 'Enter' && (e.target as HTMLElement)?.tagName !== 'BUTTON') {
        e.preventDefault();
        handleSave();
      }
      if (e.key === 'Escape' && printModalOpen) {
        setPrintModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shipperName, consigneeName, consigneePhone, pieces, actualKg, lengthCm, widthCm, heightCm, printModalOpen]);

  return (
    <div className="h-full flex flex-col p-4 md:p-5 select-none overflow-y-auto">
      {/* Top Title & Shortcuts */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <FilePlus2 className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              Fast Counter Intake
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60 font-medium">
                Keyboard-First
              </span>
            </h1>
            <p className="text-xs text-zinc-400">Rapid waybill creation with automatic IATA volumetric rounding</p>
          </div>
        </div>

        {/* Keyboard Hints */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
            <kbd className="text-indigo-400 font-semibold">Enter</kbd> Save & Next
          </span>
          <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
            <kbd className="text-indigo-400 font-semibold">Ctrl+P</kbd> Print Receipt
          </span>
        </div>
      </div>

      {/* Validation or Success Notice */}
      {showErrorBanner && (
        <div
          role="alert"
          className="mt-3 p-2.5 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-200 flex items-center justify-between animate-fadeIn shrink-0"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            <span>
              <strong>Validation Incomplete:</strong> Please provide shipper, recipient contact, valid weight and dimensions.
            </span>
          </div>
          <button
            onClick={() => setShowErrorBanner(false)}
            className="text-[11px] underline text-red-300 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {successBanner && (
        <div
          role="status"
          className="mt-3 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-200 flex items-center gap-2 animate-fadeIn shrink-0"
        >
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{successBanner}</span>
        </div>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-3 flex-1 min-h-0">
        {/* Left Column: Form Fields (7 cols) */}
        <div className="lg:col-span-7 bg-[#0e0e11] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div className="space-y-3">
            {/* Section 1: Parties */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Shipper */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-zinc-300">
                  Shipper / Consignor <span className="text-red-400">*</span>
                </label>
                <input
                  tabIndex={1}
                  type="text"
                  placeholder="e.g. Alaba Electronics Ltd"
                  value={shipperName}
                  onChange={(e) => {
                    setShipperName(e.target.value);
                    if (errors.shipperName) setErrors({ ...errors, shipperName: false });
                  }}
                  className={`w-full px-3 py-2 text-xs bg-zinc-900 border rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.shipperName ? 'border-red-500 ring-1 ring-red-500' : 'border-zinc-800'
                  }`}
                />
                <input
                  tabIndex={2}
                  type="tel"
                  placeholder="Shipper Phone (080...)"
                  value={shipperPhone}
                  onChange={(e) => setShipperPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              {/* Consignee */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-zinc-300">
                  Consignee / Recipient <span className="text-red-400">*</span>
                </label>
                <input
                  tabIndex={3}
                  type="text"
                  placeholder="e.g. Wuse Commercial Plaza"
                  value={consigneeName}
                  onChange={(e) => {
                    setConsigneeName(e.target.value);
                    if (errors.consigneeName) setErrors({ ...errors, consigneeName: false });
                  }}
                  className={`w-full px-3 py-2 text-xs bg-zinc-900 border rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.consigneeName ? 'border-red-500 ring-1 ring-red-500' : 'border-zinc-800'
                  }`}
                />
                <input
                  tabIndex={4}
                  type="tel"
                  placeholder="Consignee Phone (080...)"
                  value={consigneePhone}
                  onChange={(e) => {
                    setConsigneePhone(e.target.value);
                    if (errors.consigneePhone) setErrors({ ...errors, consigneePhone: false });
                  }}
                  className={`w-full px-3 py-2 text-xs bg-zinc-900 border rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono ${
                    errors.consigneePhone ? 'border-red-500 ring-1 ring-red-500' : 'border-zinc-800'
                  }`}
                />
              </div>
            </div>

            {/* Section 2: Origin & Destination Routing */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Origin Station</label>
                <select
                  tabIndex={5}
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                >
                  {MOCK_HUBS.map((hub) => (
                    <option key={hub.code} value={hub.code}>
                      {hub.code} - {hub.city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Destination Gateway</label>
                <select
                  tabIndex={6}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-semibold text-indigo-300"
                >
                  {MOCK_HUBS.map((hub) => (
                    <option key={hub.code} value={hub.code}>
                      {hub.code} - {hub.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Section 3: Pieces & Weights */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Pieces / Cartons <span className="text-red-400">*</span>
                </label>
                <input
                  tabIndex={7}
                  inputMode="decimal"
                  type="number"
                  min="1"
                  value={pieces || ''}
                  onChange={(e) => setPieces(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Actual Scale Weight (kg) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    tabIndex={8}
                    inputMode="decimal"
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="0.0"
                    value={actualKg || ''}
                    onChange={(e) => {
                      setActualKg(parseFloat(e.target.value) || 0);
                      if (errors.actualKg) setErrors({ ...errors, actualKg: false });
                    }}
                    className={`w-full pl-3 pr-10 py-2 text-xs bg-zinc-900 border rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono tabular-nums ${
                      errors.actualKg ? 'border-red-500 ring-1 ring-red-500' : 'border-zinc-800'
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-mono">
                    kg
                  </span>
                </div>
              </div>
            </div>

            {/* Section 4: Dimensions in Centimetres (L × W × H) */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-zinc-300">
                  Dimensions in cm (L × W × H) <span className="text-red-400">*</span>
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">
                  IATA Divisor: / 6000
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="relative">
                  <input
                    tabIndex={9}
                    inputMode="decimal"
                    type="number"
                    placeholder="Length"
                    value={lengthCm || ''}
                    onChange={(e) => setLengthCm(parseFloat(e.target.value) || 0)}
                    className="w-full pl-2.5 pr-8 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 font-mono">
                    cm
                  </span>
                </div>
                <div className="relative">
                  <input
                    tabIndex={10}
                    inputMode="decimal"
                    type="number"
                    placeholder="Width"
                    value={widthCm || ''}
                    onChange={(e) => setWidthCm(parseFloat(e.target.value) || 0)}
                    className="w-full pl-2.5 pr-8 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 font-mono">
                    cm
                  </span>
                </div>
                <div className="relative">
                  <input
                    tabIndex={11}
                    inputMode="decimal"
                    type="number"
                    placeholder="Height"
                    value={heightCm || ''}
                    onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                    className="w-full pl-2.5 pr-8 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 font-mono">
                    cm
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick preset chips */}
          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
            <span>Quick box:</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setLengthCm(30);
                  setWidthCm(25);
                  setHeightCm(20);
                }}
                className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-400"
              >
                Small (30×25×20)
              </button>
              <button
                type="button"
                onClick={() => {
                  setLengthCm(50);
                  setWidthCm(40);
                  setHeightCm(35);
                }}
                className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-400"
              >
                Standard (50×40×35)
              </button>
              <button
                type="button"
                onClick={() => {
                  setLengthCm(80);
                  setWidthCm(60);
                  setHeightCm(50);
                }}
                className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-400"
              >
                Crate (80×60×50)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Weight Engine, Payment & Auto Totals (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          {/* Live Weight Engine Card */}
          <div className="bg-[#0e0e11] border border-zinc-800 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 font-mono">
                IATA Freight Engine
              </span>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/70 border border-indigo-800/60 px-1.5 py-0.5 rounded">
                Rule: Round up to 0.5 kg
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block uppercase font-mono">Scale Weight</span>
                <span className="text-sm font-bold text-zinc-200 tabular-nums font-mono">
                  {formatKg(weightCalc.actualRoundedKg)}
                </span>
                <span className="text-[10px] text-zinc-500 block">Raw: {actualKg.toFixed(1)} kg</span>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block uppercase font-mono">Volumetric (LWH/6000)</span>
                <span className="text-sm font-bold text-zinc-200 tabular-nums font-mono">
                  {formatKg(weightCalc.volumetricKg)}
                </span>
                <span className="text-[10px] text-zinc-500 block">
                  Raw: {weightCalc.rawVolumetricKg.toFixed(2)} kg
                </span>
              </div>
            </div>

            {/* Chargeable Weight Highlight */}
            <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-900/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase font-semibold block">
                  Chargeable Weight (Max)
                </span>
                <span className="text-base font-extrabold text-indigo-200 tabular-nums font-mono">
                  {formatKg(weightCalc.chargeableKg)}
                </span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-1 rounded font-semibold ${
                  weightCalc.billedBy === 'volumetric'
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                    : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                }`}
              >
                {weightCalc.billedBy === 'volumetric' ? 'Billed by Volume' : 'Billed by Actual Scale'}
              </span>
            </div>
          </div>

          {/* Payment Method & Auto Total Card */}
          <div className="bg-[#0e0e11] border border-zinc-800 rounded-xl p-3.5 space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Payment Method</label>
              {/* Payment selector with at least 44px tap targets */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'Cash', label: 'Cash Drawer', icon: Banknote },
                  { id: 'Transfer', label: 'Bank Transfer', icon: Building },
                  { id: 'POS', label: 'POS Terminal', icon: CreditCard },
                  { id: 'Wallet', label: 'Corp Wallet', icon: Wallet },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPaymentMode(id as any)}
                    className={`min-h-[44px] px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-2 font-medium transition-all ${
                      paymentMode === id
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm font-semibold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reference input for Transfer / POS */}
            {paymentMode !== 'Cash' && (
              <div>
                <input
                  tabIndex={12}
                  type="text"
                  placeholder={`${paymentMode} Reference / RRN`}
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>
            )}

            {/* Price breakdown and pinned Total */}
            <div className="space-y-1 text-xs pt-1 border-t border-zinc-800">
              <div className="flex justify-between text-zinc-400">
                <span>Weight Freight ({weightCalc.chargeableKg} kg × ₦{ratePerKg.toLocaleString()}):</span>
                <span className="tabular-nums font-mono">{formatNGN(freightSubtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Handling & Security:</span>
                <span className="tabular-nums font-mono">{formatNGN(handlingFee)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>VAT (7.5%):</span>
                <span className="tabular-nums font-mono">{formatNGN(vat)}</span>
              </div>

              {/* Pinned Auto Total */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                <span className="text-sm font-semibold text-zinc-100">Total Settlement</span>
                <span className="text-xl font-extrabold text-emerald-400 tabular-nums font-mono">
                  {formatNGN(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons with 44px+ minimum tap target */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[44px] px-3 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            >
              <Printer className="h-4 w-4" />
              <span>Print Waybill (Ctrl+P)</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="min-h-[44px] px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/25 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
            >
              <Check className="h-4 w-4" />
              <span>Save & Commit (Enter)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Print Receipt Mock Modal */}
      {printModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setPrintModalOpen(false)}
        >
          <div
            className="bg-[#0e0e11] border border-zinc-800 rounded-xl p-5 max-w-sm w-full space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 font-mono flex items-center gap-2">
                <Printer className="h-4 w-4 text-indigo-400" />
                Thermal Barcode Receipt
              </h3>
              <button
                onClick={() => setPrintModalOpen(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                ✕ Esc
              </button>
            </div>

            <div className="bg-white text-zinc-900 p-4 rounded font-mono text-[11px] space-y-2 select-text">
              <div className="text-center border-b pb-2">
                <p className="font-bold text-sm">logisticsSAAS EXPRESS</p>
                <p className="text-[10px]">LOS-01 CARGO COUNTER GATE</p>
                <p className="font-bold text-xs mt-1">WAYBILL # LOS-2026-9082</p>
              </div>
              <div className="space-y-0.5">
                <p>ROUTE: {origin} &gt;&gt;&gt; {destination}</p>
                <p>SHIPPER: {shipperName || 'N/A'}</p>
                <p>CONSIGNEE: {consigneeName || 'N/A'}</p>
                <p>PIECES: {pieces} | CHG WT: {weightCalc.chargeableKg} kg</p>
                <p>PAYMENT: {paymentMode.toUpperCase()}</p>
                <p className="font-bold text-xs pt-1 border-t mt-1">
                  TOTAL PAID: {formatNGN(totalAmount)}
                </p>
              </div>
              <div className="text-center pt-2 border-t text-[10px]">
                * * * BARCODE: ||| | |||| | ||||| * * *
              </div>
            </div>

            <button
              onClick={() => setPrintModalOpen(false)}
              className="w-full min-h-[44px] py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
            >
              Close Print Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
