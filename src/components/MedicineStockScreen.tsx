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
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '4px 8px', borderRadius: 4, color: '#fcd34d', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>
            <Layers size={13} /> Spaceflight Pharmacy & Microgravity Degradation Engine
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff' }}>
            Spacecraft Formulary Stock & Degradation Risk Flags
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Tracking months in stowage, repackaging vulnerability, and empirical spaceflight degradation (~1.5× ground control rate).
          </p>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            className={`btn-secondary ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
            style={{ background: filter === 'all' ? 'var(--nasa-blue-light)' : undefined, color: filter === 'all' ? '#fff' : undefined }}
          >
            All Stock ({inventory.length})
          </button>
          <button 
            className={`btn-secondary ${filter === 'flagged' ? 'active' : ''}`}
            onClick={() => setFilter('flagged')}
            style={{ background: filter === 'flagged' ? 'rgba(239, 68, 68, 0.2)' : undefined, color: filter === 'flagged' ? '#f87171' : undefined }}
          >
            Degradation Risk Flags ({inventory.filter(i => i.potencyRisk !== 'green').length})
          </button>
        </div>
      </div>

      {/* Research Background Box: Reichard et al. 2023 */}
      <div className="space-card" style={{ 
        background: 'rgba(15, 23, 42, 0.8)',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        marginBottom: 20,
        padding: '14px 18px'
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Info size={20} style={{ color: '#38bdf8', flexShrink: 0, marginTop: 2 }} />
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', marginBottom: 4 }}>
              Spaceflight Pharmacokinetics & Stability Methodology (Reichard et al. 2023)
            </h4>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Flown pharmaceutical studies confirm that medications flown in microgravity degrade roughly <strong>1.5× faster than terrestrial controls</strong>, losing approximately <strong>0.2% extra active potency per month</strong> in stowage. Secondary repackaging into polyethylene/foil astronaut dose packs significantly accelerates moisture absorption and oxidation compared to original blister packaging.
            </p>
            <div style={{ marginTop: 6, fontSize: 11, color: '#fcd34d' }}>
              *Note: Empirical data is currently bounded to Low Earth Orbit (LEO/ISS). Lunar and Martian galactic cosmic radiation (GCR) impacts remain an open clinical frontier.
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="space-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="space-table">
          <thead>
            <tr>
              <th>Medication & Batch</th>
              <th>Category</th>
              <th>Storage Location</th>
              <th>Packaging Type</th>
              <th>Months in Orbit</th>
              <th>Manufacturer Expiry</th>
              <th>Estimated Active Potency</th>
              <th>Stability Risk Flag</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>{item.tradeName}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{item.genericName} · {item.batchNumber}</div>
                </td>
                <td>
                  <span style={{ fontSize: 11, color: '#93c5fd' }}>{item.category}</span>
                </td>
                <td>
                  <div style={{ fontSize: 12 }}>{item.storageLocation}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.totalUnits} {item.unit} remaining</div>
                </td>
                <td>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: 4,
                    fontSize: 11,
                    background: item.packagingType === 'Repackaged Pouch' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                    color: item.packagingType === 'Repackaged Pouch' ? '#fcd34d' : '#93c5fd'
                  }}>
                    {item.packagingType}
                  </span>
                </td>
                <td>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{item.monthsInStorage} mos</strong>
                </td>
                <td>
                  <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)' }}>{item.expirationDate}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 60,
                      height: 6,
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: 3,
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${item.estimatedPotencyRemainingPct}%`,
                        height: '100%',
                        background: item.potencyRisk === 'red' ? '#ef4444' : (item.potencyRisk === 'yellow' ? '#f59e0b' : '#10b981')
                      }} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: item.potencyRisk === 'red' ? '#fca5a5' : '#ffffff' }}>
                      {item.estimatedPotencyRemainingPct}%
                    </span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <StatusBadge level={item.potencyRisk} text={item.potencyRisk === 'green' ? 'Potency Nominal' : (item.potencyRisk === 'yellow' ? 'Moderate Risk' : 'High Degradation')} />
                    <div style={{ fontSize: 10, color: 'var(--text-secondary)', maxWidth: 220 }}>
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
