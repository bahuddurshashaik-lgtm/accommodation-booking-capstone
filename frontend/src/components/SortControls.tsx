interface SortControlsProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export default function SortControls({ sortBy, sortOrder, onSortChange }: SortControlsProps) {
  return (
    <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
      <div>
        <label htmlFor="sortBy" style={{ marginRight: '10px', fontWeight: 'bold' }}>
          Sort by:
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value, sortOrder)}
          style={{
            padding: '8px 12px',
            fontSize: '14px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          <option value="name">Name</option>
          <option value="location">Location</option>
          <option value="nightly_price_usd_cents">Price</option>
        </select>
      </div>

      <div>
        <label htmlFor="sortOrder" style={{ marginRight: '10px', fontWeight: 'bold' }}>
          Order:
        </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => onSortChange(sortBy, e.target.value as 'asc' | 'desc')}
          style={{
            padding: '8px 12px',
            fontSize: '14px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
}
