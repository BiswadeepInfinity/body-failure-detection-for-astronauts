import React, { useState } from 'react';
import { HealthAlert } from '../types';
import { StatusBadge } from './StatusBadge';
import { 
  ShieldAlert, 
  MessageSquare, 
  Save, 
  Clock,
  Radio
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header with Space Avionics Styling */}
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
          <div className="section-title">FLIGHT SURGEON TELEMETRY STREAM · CLINICAL TRIAGE</div>
          <div className="section-subheading" style={{ marginTop: 4 }}>
            Active Crew Health Alert Journal
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4, fontFamily: 'var(--font-mono)' }}>
            Continuous triage of biometrics, sleep deficits, drug interactions, and flight directives.
          </div>
        </div>

        {/* Severity Filter Pills */}
        <div style={{
          display: 'flex',
          gap: 6,
          background: 'rgba(5, 8, 15, 0.75)',
          padding: '6px',
          borderRadius: 999,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <button 
            onClick={() => setFilterLevel('all')}
            style={{
              background: filterLevel === 'all' ? 'rgba(56, 189, 248, 0.22)' : 'transparent',
              color: filterLevel === 'all' ? '#ffffff' : 'var(--text-secondary)',
              border: filterLevel === 'all' ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
              borderRadius: 999,
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: filterLevel === 'all' ? 700 : 500,
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)'
            }}
          >
            ALL ALERTS ({alerts.length})
          </button>
          <button 
            onClick={() => setFilterLevel('red')}
            style={{
              background: filterLevel === 'red' ? 'rgba(239, 68, 68, 0.22)' : 'transparent',
              color: filterLevel === 'red' ? '#f87171' : 'var(--text-secondary)',
              border: filterLevel === 'red' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid transparent',
              borderRadius: 999,
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: filterLevel === 'red' ? 700 : 500,
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)'
            }}
          >
            CRITICAL ({alerts.filter(a => a.level === 'red').length})
          </button>
          <button 
            onClick={() => setFilterLevel('yellow')}
            style={{
              background: filterLevel === 'yellow' ? 'rgba(245, 158, 11, 0.22)' : 'transparent',
              color: filterLevel === 'yellow' ? '#fcd34d' : 'var(--text-secondary)',
              border: filterLevel === 'yellow' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
              borderRadius: 999,
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: filterLevel === 'yellow' ? 700 : 500,
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)'
            }}
          >
            CAUTION ({alerts.filter(a => a.level === 'yellow').length})
          </button>
        </div>
      </div>

      {/* Alert Feed List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {sortedAlerts.map(alert => (
          <div 
            key={alert.id}
            className={`alert-strip ${alert.level}`}
            style={{
              flexDirection: 'column',
              alignItems: 'stretch',
              gap: 12,
              padding: '18px 22px',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <StatusBadge level={alert.level} />
                <span style={{ fontSize: 15, fontWeight: 700, color: alert.level === 'red' ? '#fca5a5' : '#fcd34d' }}>
                  {alert.title}
                </span>
                <span style={{
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  color: '#38bdf8',
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  padding: '2px 10px',
                  borderRadius: 999
                }}>
                  {alert.astronautName}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <Clock size={13} /> {alert.timestamp}
              </div>
            </div>

            {/* Clinical context */}
            <div style={{ fontSize: 13.5, color: '#f1f5f9', lineHeight: 1.5 }}>
              <span style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>CLINICAL CONTEXT: </span>
              {alert.reason}
            </div>

            {/* Flight Surgeon Interactive Note Field */}
            <div style={{ 
              background: 'rgba(6, 10, 20, 0.7)', 
              borderRadius: 'var(--radius-sm)', 
              padding: '12px 16px', 
              border: '1px solid rgba(255, 255, 255, 0.08)',
              width: '100%'
            }}>
              {editingAlertId === alert.id ? (
                <div>
                  <label style={{ display: 'block', fontSize: 11.5, color: '#38bdf8', fontFamily: 'var(--font-mono)', marginBottom: 8, letterSpacing: '0.5px' }}>
                    ENTER FLIGHT SURGEON CLINICAL DIRECTIVE / EHR RECORD:
                  </label>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    rows={2}
                    style={{
                      width: '100%',
                      background: 'rgba(11, 18, 32, 0.85)',
                      color: '#ffffff',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      borderRadius: 'var(--radius-sm)',
                      padding: 10,
                      fontSize: 13,
                      fontFamily: 'inherit',
                      marginBottom: 10
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: 12, borderRadius: 999 }} onClick={() => setEditingAlertId(null)}>
                      Cancel
                    </button>
                    <button className="btn-primary" style={{ padding: '6px 16px', fontSize: 12, borderRadius: 999 }} onClick={() => handleSaveNote(alert.id)}>
                      <Save size={13} /> Save Directive
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                    <Radio size={14} style={{ color: 'var(--cyan)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Flight Surgeon Action: <strong style={{ color: '#ffffff' }}>{alert.flightSurgeonNote || 'No specific clinical action recorded.'}</strong>
                    </span>
                  </div>
                  <button 
                    className="btn-secondary" 
                    style={{ padding: '5px 12px', fontSize: 11.5, borderRadius: 999 }}
                    onClick={() => handleStartEdit(alert)}
                  >
                    Edit Directive
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
