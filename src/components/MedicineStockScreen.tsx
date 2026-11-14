import React, { useState } from 'react';
import { INITIAL_INVENTORY } from '../data/formulary';
import { StatusBadge } from './StatusBadge';
import { 
  Info, 
  Layers
} from 'lucide-react';

export const MedicineStockScreen: React.FC = () => {
  const [inventory] = useState(INITIAL_INVENTORY);
  const [filter, setFilter] = useState<'all' | 'flagged'>('all');

  const filteredItems = filter === 'all' 
    ? inventory 
    : inventory.filter(i => i.potencyRisk === 'yellow' || i.potencyRisk === 'red');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Flight Control Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: 16,
        paddingBottom: 16,
        borderBottom: '1px solid rgba(56, 189, 248, 0.12)'
      }}>
        <div>
          <div className="section-title amber">PHARMACEUTICAL INVENTORY · MICROGRAVITY STABILITY</div>
          <div className="section-subheading" style={{ marginTop: 4 }}>
            Formulary Stock & Radiation Degradation Tracker
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4, fontFamily: 'var(--font-mono)' }}>
            Tracking duration in orbit, secondary repackaging vulnerability, and active chemical degradation (~1.5× terrestrial baseline).
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{
          display: 'flex',
          gap: 6,
          background: 'rgba(5, 8, 15, 0.75)',
          padding: '6px',
          borderRadius: 999,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <button 
            onClick={() => setFilter('all')}
            style={{
              background: filter === 'all' ? 'rgba(56, 189, 248, 0.22)' : 'transparent',
              color: filter === 'all' ? '#ffffff' : 'var(--text-secondary)',
              border: filter === 'all' ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
              borderRadius: 999,
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: filter === 'all' ? 700 : 500,
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)'
            }}
          >
            ALL STOCK ({inventory.length})
          </button>
          <button 
            onClick={() => setFilter('flagged')}
            style={{
              background: filter === 'flagged' ? 'rgba(245, 158, 11, 0.22)' : 'transparent',
              color: filter === 'flagged' ? '#fcd34d' : 'var(--text-secondary)',
              border: filter === 'flagged' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
              borderRadius: 999,
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: filter === 'flagged' ? 700 : 500,
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)'
            }}
          >
            RISK FLAGS ({inventory.filter(i => i.potencyRisk !== 'green').length})
          </button>
        </div>
      </div>

      {/* Research Background Box: Reichard et al. 2023 */}
      <div style={{ 
        background: 'rgba(56, 189, 248, 0.05)',
        border: '1px solid rgba(56, 189, 248, 0.18)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start'
      }}>
        <Info size={22} style={{ color: 'var(--cyan)', flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)', letterSpacing: '0.5px', marginBottom: 4 }}>
            SPACEFLIGHT PHARMACOKINETICS & STABILITY MODEL (REICHARD ET AL. 2023)
          </div>
          <p style={{ fontSize: 12.5, color: '#cbd5e1', lineHeight: 1.6 }}>
            Flown pharmaceutical audits confirm medications aboard the ISS degrade roughly <strong>1.5× faster than terrestrial controls</strong>, losing approximately <strong>0.2% extra active potency per month</strong> in stowage. Secondary repackaging into polyethylene/foil pouches significantly accelerates moisture absorption compared to primary glass/blister packaging.
          </p>
          <div style={{ marginTop: 6, fontSize: 11.5, color: '#fcd34d', fontFamily: 'var(--font-mono)' }}>
            * Empirical dataset baseline: Low Earth Orbit (LEO / ISS Segment). Deep-space GCR galactic radiation impacts are simulated.
          </div>
        </div>
      </div>

      {/* Inventory Table Container */}
      <div className="space-card" style={{ padding: '4px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.15)', background: 'rgba(5, 8, 15, 0.4)' }}>
              <th style={{ padding: '14px 16px', color: 'var(--cyan)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '1px' }}>MEDICATION & BATCH</th>
              <th style={{ padding: '14px 16px', color: 'var(--cyan)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '1px' }}>CATEGORY</th>
              <th style={{ padding: '14px 16px', color: 'var(--cyan)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '1px' }}>STORAGE LOCATION</th>
              <th style={{ padding: '14px 16px', color: 'var(--cyan)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '1px' }}>PACKAGING</th>
              <th style={{ padding: '14px 16px', color: 'var(--cyan)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '1px' }}>ORBIT DURATION</th>
              <th style={{ padding: '14px 16px', color: 'var(--cyan)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '1px' }}>EXPIRATION</th>
              <th style={{ padding: '14px 16px', color: 'var(--cyan)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '1px' }}>ACTIVE POTENCY</th>
              <th style={{ padding: '14px 16px', color: 'var(--cyan)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '1px' }}>RISK ASSESSMENT</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.15s ease' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>{item.tradeName}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{item.genericName} · {item.batchNumber}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: 11.5, color: '#93c5fd', fontFamily: 'var(--font-mono)' }}>{item.category}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 12.5, color: '#fff' }}>{item.storageLocation}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.totalUnits} {item.unit} in kit</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: 999,
                    fontSize: 10.5,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    background: item.packagingType === 'Repackaged Pouch' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                    color: item.packagingType === 'Repackaged Pouch' ? '#fcd34d' : '#38bdf8',
                    border: `1px solid ${item.packagingType === 'Repackaged Pouch' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`
                  }}>
                    {item.packagingType.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <strong style={{ fontFamily: 'var(--font-mono)', color: '#fff' }}>{item.monthsInStorage} mos</strong>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{item.expirationDate}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 54,
                      height: 6,
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: 999,
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${item.estimatedPotencyRemainingPct}%`,
                        height: '100%',
                        background: item.potencyRisk === 'red' ? '#f87171' : (item.potencyRisk === 'yellow' ? '#fbbf24' : '#34d399')
                      }} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: item.potencyRisk === 'red' ? '#fca5a5' : '#ffffff' }}>
                      {item.estimatedPotencyRemainingPct}%
                    </span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <StatusBadge level={item.potencyRisk} text={item.potencyRisk === 'green' ? 'Nominal' : (item.potencyRisk === 'yellow' ? 'Moderate Risk' : 'High Degradation')} />
                    <div style={{ fontSize: 10.5, color: 'var(--text-secondary)', maxWidth: 220, lineHeight: 1.3 }}>
                      {item.potencyRiskReason}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
