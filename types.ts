
export enum ScenarioType {
  HYBRID = 'HYBRID',
  LONG_TERM = 'LONG_TERM',
  SHORT_TERM = 'SHORT_TERM',
}

export interface UnitMixItem {
  name: string;
  count: number;
  avgPrice: number;
  priceRange?: {
    min: number;
    max: number;
    avg: number;
  };
  videoUrl?: string;
}

export interface CaseFinancials {
  revenue: number;
  netIncome: number;
  mabaatShare: number;
  roi: number;
}

export interface Scenario {
  id: string;
  type: ScenarioType;
  name: string;
  color: string;
  description: string;
  financials: {
    worst: CaseFinancials;
    base: CaseFinancials;
    best: CaseFinancials;
  };
  propertyValue: number;
  unitCount: number;
  unitLabel: string;
  occupancyDurationLabel: string;
  unitMix: UnitMixItem[];
}

export interface MarketingVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export interface ComparisonLink {
  platform: string;
  title: string;
  url: string;
  location?: string;
  area?: string;
  price?: number;
  type?: string;
  period?: string;
  photosUrl?: string;
}

export interface Tenant {
  name: string;
  branch: string;
  unit: string;
  source: string;
  duration: string;
  rent: number;
  status: 'Confirmed' | 'Pending' | 'Canceled' | 'Contract Issued';
  cashCollected: number;
  mathwaaRevenue: number;
}

export interface SalesPerformanceItem {
  name: string;
  januaryValue: number;
  lifetimeValue: number;
}

export enum ApartmentStatus {
  VACANT = 'VACANT',
  RENTED = 'RENTED',
  RESERVED = 'RESERVED',
}

export enum ApartmentType {
  STUDIO = 'Studio',
  ONE_BEDROOM = '1 Bedroom',
  TWO_BEDROOM = '2 Bedroom',
}

export interface Apartment {
  id: string;
  number: string;
  type: ApartmentType;
  status: ApartmentStatus;
  monthlyRent: number;
  cashCollected: number;
  lifetimeValue: number;
  contractDurationMonths?: number;
  howHeard?: string;
}

export interface Branch {
  id: string;
  name: string;
  targetYearlyRevenue: {
    min: number;
    max: number;
  };
  apartments: Apartment[];
}

export interface NewBooking {
  branchId: string;
  apartmentId: string;
  contractDurationMonths: number;
  howHeard: string;
}

export interface RawDeal {
  id: number;
  tenantName: string;
  branch: string;
  location: string;
  channel: string;
  channelType: string;
  isPaidSocial: boolean;
  monthlyRent: number | null;
  committedMonths: number;
  committedGross: number;
  annualContract: boolean;
  mgmtFeePct: number;
  mathwaaNet: number;
  salesRep: string;
  contractStart: string;
  notes: string;
}

