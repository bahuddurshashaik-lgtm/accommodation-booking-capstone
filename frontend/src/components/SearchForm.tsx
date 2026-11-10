import { useState } from 'react';

interface SearchFormProps {
  onSearch: (location: string, freeWifi: boolean) => void;
  initialLocation?: string;
  initialFreeWifi?: boolean;
}

export default function SearchForm({ onSearch, initialLocation = '', initialFreeWifi = false }: SearchFormProps) {
  const [location, setLocation] = useState(initialLocation);
  const [freeWifi, setFreeWifi] = useState(initialFreeWifi);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(location, freeWifi);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end' }}>
        <div>
          <label htmlFor="location" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Location:
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Paris, London"
            style={{
              padding: '8px 12px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              width: '200px'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            id="freeWifi"
            checked={freeWifi}
            onChange={(e) => setFreeWifi(e.target.checked)}
            style={{ cursor: 'pointer', width: '18px', height: '18px' }}
          />
          <label htmlFor="freeWifi" style={{ fontWeight: 'bold', cursor: 'pointer' }}>
            Free Wi-Fi only
          </label>
        </div>

        <button
          type="submit"
          style={{
            padding: '8px 24px',
            fontSize: '14px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Search
        </button>
      </div>
    </form>
  );
}
