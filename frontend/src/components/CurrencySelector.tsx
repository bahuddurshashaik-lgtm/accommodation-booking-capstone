import { Currency } from '../types';

interface CurrencySelectorProps {
  value: Currency;
  onChange: (currency: Currency) => void;
}

export default function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor="currency" style={{ marginRight: '10px', fontWeight: 'bold' }}>
        Currency:
      </label>
      <select
        id="currency"
        value={value}
        onChange={(e) => onChange(e.target.value as Currency)}
        style={{
          padding: '8px 12px',
          fontSize: '14px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        <option value="USD">USD ($)</option>
        <option value="EUR">EUR (€)</option>
        <option value="GBP">GBP (£)</option>
      </select>
    </div>
  );
}
