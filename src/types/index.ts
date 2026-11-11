export type Screen = 'login' | 'tenant' | 'dashboard' | 'intake' | 'eod';

export type TransportMode = 'Air' | 'Road' | 'Intermodal';

export interface Hub {
  code: string;
  name: string;
  city: string;
  type: 'Gateway' | 'Main Hub' | 'Spoke';
}

export interface Tenant {
  id: string;
  name: string;
  code: string;
  initials: string;
  plan: 'Enterprise Tier' | 'Growth Network' | 'Regional Operator';
  hubsCount: number;
  activeShipments: number;
  status: 'active' | 'suspended';
  suspendedReason?: string;
}

export interface Shipment {
  id: string;
  waybillNo: string;
  shipper: string;
  consignee: string;
  origin: string;
  destination: string;
  pieces: number;
  actualKg: number;
  chargeableKg: number;
  mode: TransportMode;
  status: 'Manifested' | 'In Transit' | 'Cleared' | 'Quarantined' | 'Delivered';
  paymentMode: 'Cash' | 'Transfer' | 'POS' | 'Wallet';
  paymentStatus: 'Paid' | 'Pending' | 'Credit';
  totalAmount: number;
  timestamp: string;
}

export interface HubStatusSummary {
  code: string;
  name: string;
  status: 'Optimal' | 'Busy' | 'Congested';
  transitQueue: number;
  nextDeparture: string;
  carrierInfo: string;
}

export interface AlertNotice {
  id: string;
  level: 'critical' | 'warning' | 'info';
  title: string;
  detail: string;
  time: string;
}

export interface PaymentReconciliationRow {
  mode: 'Cash' | 'Bank Transfer' | 'POS Terminal' | 'Corporate Wallet';
  transactions: number;
  expectedAmount: number;
  countedAmount: number;
  variance: number;
}

export interface DenominationItem {
  value: number;
  label: string;
  count: number;
}

export interface UnsyncedEntry {
  id: string;
  waybillNo: string;
  type: 'Offline Cache' | 'Quarantine Inspection' | 'Weight Discrepancy';
  destination: string;
  amount: number;
  timestamp: string;
  note: string;
}
