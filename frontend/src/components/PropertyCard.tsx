import { Link, useSearchParams } from 'react-router-dom';
import { Property } from '../types';
import { formatCurrency } from '../utils/formatCurrency';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [searchParams] = useSearchParams();
  const currency = searchParams.get('currency') || 'USD';

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <img
        src={property.image_url}
        alt={property.name}
        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '15px' }}
      />

      <h3 style={{ marginTop: '0', marginBottom: '10px', fontSize: '18px' }}>{property.name}</h3>

      <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>
        📍 {property.location}
      </p>

      <p style={{ fontWeight: 'bold', fontSize: '20px', color: '#007bff', marginBottom: '10px' }}>
        {formatCurrency(property.nightly_price_cents, property.currency)}
        <span style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}> / night</span>
      </p>

      {property.free_wifi && (
        <span
          style={{
            display: 'inline-block',
            padding: '4px 8px',
            backgroundColor: '#28a745',
            color: 'white',
            borderRadius: '4px',
            fontSize: '12px',
            marginBottom: '15px'
          }}
        >
          ✓ Free Wi-Fi
        </span>
      )}

      <div>
        <Link
          to={`/property/${property.id}?currency=${currency}`}
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
