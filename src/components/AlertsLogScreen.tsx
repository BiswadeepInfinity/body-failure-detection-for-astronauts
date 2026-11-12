import React, { useState } from 'react';
import { HealthAlert } from '../types';
import { StatusBadge } from './StatusBadge';
import { 
  ShieldAlert, 
  MessageSquare, 
  Save, 
  Clock
} from 'lucide-react';

interface Props {
  alerts: HealthAlert[];
  onUpdateAlertNote: (alertId: string, note: string) => void;
}

export const AlertsLogScreen: React.FC<Props> = ({ alerts, onUpdateAlertNote }) => {
  const [filterLevel, setFilterLevel] = useState<'all' | 'red' | 'yellow'>('all');
  const [editingAlertId, setEditingAlertId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const filteredAlerts = filterLevel === 'all' 
    ? alerts 
    : alerts.filter(a => a.level === filterLevel);

  // Sort by Red first, then Yellow
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    if (a.level === 'red' && b.level !== 'red') return -1;
    if (b.level === 'red' && a.level !== 'red') return 1;
    return b.day - a.day;
  });

  const handleStartEdit = (alert: HealthAlert) => {
    setEditingAlertId(alert.id);
    setNoteText(alert.flightSurgeonNote || '');
  };

  const handleSaveNote = (alertId: string) => {
    onUpdateAlertNote(alertId, noteText);
    setEditingAlertId(null);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldAlert size={22} style={{ color: '#f87171' }} /> Mission Control Clinical Alert Stream
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Continuous triage of biometrics, sleep deficits, drug interactions, and pharmacotherapy notes.
          </p>
        </div>

        {/* Severity Filter */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            className={`btn-secondary ${filterLevel === 'all' ? 'active' : ''}`}
            onClick={() => setFilterLevel('all')}
            style={{ background: filterLevel === 'all' ? 'var(--nasa-blue-light)' : undefined, color: filterLevel === 'all' ? '#fff' : undefined }}
          >
            All Alerts ({alerts.length})
          </button>
          <button 
            className={`btn-secondary ${filterLevel === 'red' ? 'active' : ''}`}
            onClick={() => setFilterLevel('red')}
            style={{ background: filterLevel === 'red' ? 'rgba(239, 68, 68, 0.2)' : undefined, color: filterLevel === 'red' ? '#f87171' : undefined }}
          >
            Critical Red Only ({alerts.filter(a => a.level === 'red').length})
          </button>
          <button 
            className={`btn-secondary ${filterLevel === 'yellow' ? 'active' : ''}`}
            onClick={() => setFilterLevel('yellow')}
            style={{ background: filterLevel === 'yellow' ? 'rgba(245, 158, 11, 0.2)' : undefined, color: filterLevel === 'yellow' ? '#fcd34d' : undefined }}
          >
            Caution Yellow ({alerts.filter(a => a.level === 'yellow').length})
          </button>
        </div>
      </div>

      {/* Alert Feed List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sortedAlerts.map(alert => (
          <div 
            key={alert.id}
            className={`alert-strip ${alert.level}`}
            style={{ flexDirection: 'column', gap: 8, padding: 16 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <StatusBadge level={alert.level} />
                <strong style={{ fontSize: 14, color: alert.level === 'red' ? '#fca5a5' : '#fcd34d' }}>
                  {alert.title}
                </strong>
                <span style={{ fontSize: 11, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', padding: '2px 8px', borderRadius: 4 }}>
                  {alert.astronautName}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <Clock size={12} /> {alert.timestamp}
              </div>
            </div>

            {/* Plain one-line reason */}
            <div style={{ fontSize: 13, color: '#ffffff', lineHeight: 1.4, margin: '4px 0' }}>
              <strong>Clinical Context:</strong> {alert.reason}
            </div>

            {/* Flight Surgeon Interactive Note Field */}
            <div style={{ 
              background: 'rgba(0,0,0,0.3)', 
              borderRadius: 6, 
              padding: 10, 
              marginTop: 4, 
              border: '1px solid var(--border-subtle)',
              width: '100%'
            }}>
              {editingAlertId === alert.id ? (
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#93c5fd', marginBottom: 4 }}>
                    Update Flight Surgeon Clinical Directive / EHR Note:
                  </label>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    rows={2}
                    style={{
                      width: '100%',
                      background: 'var(--bg-surface)',
                      color: '#ffffff',
                      border: '1px solid var(--border-focus)',
                      borderRadius: 4,
                      padding: 8,
                      fontSize: 12,
                      fontFamily: 'inherit',
                      marginBottom: 8
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button className="btn-secondary" onClick={() => setEditingAlertId(null)}>
                      Cancel
                    </button>
                    <button className="btn-primary" onClick={() => handleSaveNote(alert.id)}>
                      <Save size={13} /> Save Directive
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <MessageSquare size={14} style={{ color: '#38bdf8' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Flight Surgeon Action: <strong style={{ color: '#e2e8f0' }}>{alert.flightSurgeonNote || 'No specific clinical action recorded.'}</strong>
                    </span>
                  </div>
                  <button 
                    className="btn-secondary" 
                    style={{ padding: '4px 8px', fontSize: 11 }}
                    onClick={() => handleStartEdit(alert)}
                  >
                    Edit Note
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
