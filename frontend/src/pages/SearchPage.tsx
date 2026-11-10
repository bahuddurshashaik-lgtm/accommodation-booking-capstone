import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProperties } from '../services/api';
import { SearchResponse, Currency } from '../types';
import CurrencySelector from '../components/CurrencySelector';
import SearchForm from '../components/SearchForm';
import SortControls from '../components/SortControls';
import PropertyCard from '../components/PropertyCard';
import Pagination from '../components/Pagination';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current values from URL
  const currency = (searchParams.get('currency') || 'USD') as Currency;
  const location = searchParams.get('location') || '';
  const freeWifi = searchParams.get('freeWifi') === 'true';
  const sortBy = searchParams.get('sortBy') || 'name';
  const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    loadResults();
  }, [searchParams]);

  const loadResults = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = {
        currency,
        sortBy,
        sortOrder,
        page,
        limit: 10
      };

      if (location) params.location = location;
      if (freeWifi) params.freeWifi = true;

      const results = await searchProperties(params);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to load properties. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCurrencyChange = (newCurrency: Currency) => {
    searchParams.set('currency', newCurrency);
    setSearchParams(searchParams);
  };

  const handleSearch = (newLocation: string, newFreeWifi: boolean) => {
    if (newLocation) {
      searchParams.set('location', newLocation);
    } else {
      searchParams.delete('location');
    }

    if (newFreeWifi) {
      searchParams.set('freeWifi', 'true');
    } else {
      searchParams.delete('freeWifi');
    }

    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    searchParams.set('sortBy', newSortBy);
    searchParams.set('sortOrder', newSortOrder);
    setSearchParams(searchParams);
  };

  const handlePageChange = (newPage: number) => {
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '30px' }}>Accommodation Search</h1>

      <CurrencySelector value={currency} onChange={handleCurrencyChange} />

      <SearchForm
        onSearch={handleSearch}
        initialLocation={location}
        initialFreeWifi={freeWifi}
      />

      {loading && <p>Loading properties...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {searchResults && !loading && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
              Found {searchResults.pagination.total} properties
            </p>
          </div>

          <SortControls
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}
          >
            {searchResults.properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {searchResults.properties.length === 0 && (
            <p style={{ textAlign: 'center', fontSize: '16px', color: '#666' }}>
              No properties found. Try adjusting your search filters.
            </p>
          )}

          <Pagination
            currentPage={searchResults.pagination.page}
            totalPages={searchResults.pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
