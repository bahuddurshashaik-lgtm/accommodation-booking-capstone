export interface Property {
  id: number;
  name: string;
  location: string;
  description: string;
  nightly_price_usd_cents: number;
  free_wifi: boolean;
  image_url: string;
  created_at: string;
}

export interface PropertyResponse {
  id: number;
  name: string;
  location: string;
  description: string;
  nightly_price_cents: number;
  currency: string;
  free_wifi: boolean;
  image_url: string;
}

export interface SearchParams {
  location?: string;
  freeWifi?: boolean;
  currency: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface SearchResponse {
  properties: PropertyResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: SearchParams;
}

export interface BookingQuoteResponse {
  property_id: number;
  property_name: string;
  nightly_price_cents: number;
  nights: number;
  subtotal_cents: number;
  currency: string;
}

export type Currency = 'USD' | 'EUR' | 'GBP';
