import { useState } from 'react';
import { BookingQuote as BookingQuoteType, Currency } from '../types';
import { formatCurrency } from '../utils/formatCurrency';

interface BookingQuoteProps {
  propertyId: number;
  propertyName: string;
  currency: Currency;
  onGetQuote: (nights: number) => void;
  quote: BookingQuoteType | null;
}

export default function BookingQuote({ propertyId, propertyName, currency, onGetQuote, quote }: BookingQuoteProps) {
  const [nights, setNights] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGetQuote(nights);
  };

  return (
    <div
      style={{
        marginTop: '30px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}
    >
      <h3 style={{ marginTop: '0', marginBottom: '20px' }}>Get Booking Quote</h3>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
          <div>
            <label htmlFor="nights" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Number of nights:
            </label>
            <input
              type="number"
              id="nights"
              min="1"
              value={nights}
              onChange={(e) => setNights(parseInt(e.target.value))}
              style={{
                padding: '8px 12px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                width: '100px'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '8px 24px',
              fontSize: '14px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Calculate
          </button>
        </div>
      </form>

      {quote && (
        <div
          style={{
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        >
          <h4 style={{ marginTop: '0', marginBottom: '15px' }}>Quote Summary</h4>

          <div style={{ marginBottom: '10px' }}>
            <strong>Property:</strong> {quote.property_name}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <strong>Nightly rate:</strong> {formatCurrency(quote.nightly_price_cents, quote.currency)}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <strong>Nights:</strong> {quote.nights}
          </div>

          <div
            style={{
              marginTop: '15px',
              paddingTop: '15px',
              borderTop: '2px solid #ddd',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#007bff'
            }}
          >
            Total: {formatCurrency(quote.subtotal_cents, quote.currency)}
          </div>
        </div>
      )}
    </div>
  );
}
