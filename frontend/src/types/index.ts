export type Currency = 'USD' | 'EUR' | 'GBP';

export interface Property {
  id: number;
  name: string;
  location: string;
  description: string;
  nightly_price_cents: number;
  currency: Currency;
  free_wifi: boolean;
  image_url: string;
}

export interface SearchParams {
  location?: string;
  freeWifi?: boolean;
  currency?: Currency;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  properties: Property[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: SearchParams;
}

export interface BookingQuote {
  property_id: number;
  property_name: string;
  nightly_price_cents: number;
  nights: number;
  subtotal_cents: number;
  currency: Currency;
}
