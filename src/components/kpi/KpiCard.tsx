import React from 'react';

interface KpiCardProps {
  label: string;
  value: string;
  helperText?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ label, value, helperText }) => {
  return (
    <article
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 16,
        background: '#ffffff',
      }}
    >
      <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>{label}</p>
      <p style={{ margin: '8px 0', fontSize: 24, fontWeight: 700 }}>{value}</p>
      {helperText ? <small style={{ color: '#9ca3af' }}>{helperText}</small> : null}
    </article>
  );
};
