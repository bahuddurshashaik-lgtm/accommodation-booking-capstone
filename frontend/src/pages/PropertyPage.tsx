import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getPropertyById, getBookingQuote } from '../services/api';
import { Property, BookingQuote as BookingQuoteType, Currency } from '../types';
import CurrencySelector from '../components/CurrencySelector';
import BookingQuote from '../components/BookingQuote';
import { formatCurrency } from '../utils/formatCurrency';

export default function PropertyPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [quote, setQuote] = useState<BookingQuoteType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currency = (searchParams.get('currency') || 'USD') as Currency;

  useEffect(() => {
    loadProperty();
  }, [id, currency]);

  const loadProperty = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getPropertyById(parseInt(id), currency);
      setProperty(data);
    } catch (err) {
      setError('Failed to load property details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCurrencyChange = (newCurrency: Currency) => {
    searchParams.set('currency', newCurrency);
    setSearchParams(searchParams);
    setQuote(null);
  };

  const handleGetQuote = async (nights: number) => {
    if (!id) return;

    try {
      const quoteData = await getBookingQuote(parseInt(id), nights, currency);
      setQuote(quoteData);
    } catch (err) {
      console.error('Failed to get quote:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <p>Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <p style={{ color: 'red' }}>{error || 'Property not found'}</p>
        <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>
          ← Back to search
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Link
        to={`/?currency=${currency}`}
        style={{ color: '#007bff', textDecoration: 'none', fontSize: '14px', marginBottom: '20px', display: 'inline-block' }}
      >
        ← Back to search
      </Link>

      <CurrencySelector value={currency} onChange={handleCurrencyChange} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
        <div>
          <img
            src={property.image_url}
            alt={property.name}
            style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px' }}
          />
        </div>

        <div>
          <h1 style={{ marginTop: '0', marginBottom: '15px' }}>{property.name}</h1>

          <p style={{ fontSize: '16px', color: '#666', marginBottom: '15px' }}>
            📍 {property.location}
          </p>

          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#007bff', marginBottom: '15px' }}>
            {formatCurrency(property.nightly_price_cents, property.currency)}
            <span style={{ fontSize: '16px', color: '#666', fontWeight: 'normal' }}> / night</span>
          </p>

          {property.free_wifi && (
            <span
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                borderRadius: '4px',
                fontSize: '14px',
                marginBottom: '20px'
              }}
            >
              ✓ Free Wi-Fi
            </span>
          )}

          <h3 style={{ marginBottom: '10px' }}>Description</h3>
          <p style={{ lineHeight: '1.6', color: '#333' }}>{property.description}</p>

          <BookingQuote
            propertyId={property.id}
            propertyName={property.name}
            currency={currency}
            onGetQuote={handleGetQuote}
            quote={quote}
          />
        </div>
      </div>
    </div>
  );
}
