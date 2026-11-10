import axios from 'axios';
import { SearchResponse, Property, BookingQuote, SearchParams } from '../types';

const api = axios.create({
  baseURL: '/api'
});

export async function searchProperties(params: SearchParams): Promise<SearchResponse> {
  const response = await api.get<SearchResponse>('/search', { params });
  return response.data;
}

export async function getPropertyById(id: number, currency: string): Promise<Property> {
  const response = await api.get<Property>(`/properties/${id}`, {
    params: { currency }
  });
  return response.data;
}

export async function getBookingQuote(
  propertyId: number,
  nights: number,
  currency: string
): Promise<BookingQuote> {
  const response = await api.get<BookingQuote>('/booking/quote', {
    params: {
      property_id: propertyId,
      nights,
      currency
    }
  });
  return response.data;
}
