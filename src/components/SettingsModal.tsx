import React, { useState } from 'react';
import { AlertThresholds } from '../types';
import { Sliders, RefreshCw, Save, Check } from 'lucide-react';

interface Props {
  thresholds: AlertThresholds;
  onUpdateThresholds: (newThresholds: AlertThresholds) => void;
  onResetDefaults: () => void;
}

export const SettingsModal: React.FC<Props> = ({ 
  thresholds, 
  onUpdateThresholds, 
  onResetDefaults 
}) => {
  const [current, setCurrent] = useState<AlertThresholds>(thresholds);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    onUpdateThresholds(current);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sliders size={18} style={{ color: '#38bdf8' }} /> Clinical Alert Thresholds Configuration
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Editable parameters for Tanish (research lead) to calibrate alert trigger rules without altering codebase.
          </p>
        </div>
        <button className="btn-secondary" onClick={onResetDefaults} title="Reset to NASA standard defaults">
          <RefreshCw size={13} /> Reset Defaults
        </button>
      </div>

      {/* Sleep Settings */}
      <div className="space-card" style={{ padding: 14 }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#38bdf8', marginBottom: 10 }}>
          Sleep & Circadian Thresholds
        </h4>
        <div className="grid-2">
          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>
              NASA-STD-3001 Target Hours:
            </label>
            <input 
              type="number" 
              step="0.5"
              value={current.sleep.nasaTargetHours}
              onChange={(e) => setCurrent({
                ...current,
                sleep: { ...current.sleep, nasaTargetHours: parseFloat(e.target.value) || 8.0 }
              })}
              style={{ width: '100%', background: 'var(--bg-surface)', color: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: 6, fontSize: 12 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>
              Baseline Deviation Trigger (Hours Drop):
            </label>
            <input 
              type="number" 
              step="0.1"
              value={current.sleep.baselineDeviationHours}
              onChange={(e) => setCurrent({
                ...current,
                sleep: { ...current.sleep, baselineDeviationHours: parseFloat(e.target.value) || 1.2 }
              })}
              style={{ width: '100%', background: 'var(--bg-surface)', color: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: 6, fontSize: 12 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>
              Critical Minimum Sleep Hours (Red Alert):
            </label>
            <input 
              type="number" 
              step="0.5"
              value={current.sleep.criticalMinHours}
              onChange={(e) => setCurrent({
                ...current,
                sleep: { ...current.sleep, criticalMinHours: parseFloat(e.target.value) || 5.0 }
              })}
              style={{ width: '100%', background: 'var(--bg-surface)', color: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: 6, fontSize: 12 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>
              Sleep Latency Warning (Minutes):
            </label>
            <input 
              type="number" 
              value={current.sleep.onsetLatencyWarningMin}
              onChange={(e) => setCurrent({
                ...current,
                sleep: { ...current.sleep, onsetLatencyWarningMin: parseFloat(e.target.value) || 40 }
              })}
              style={{ width: '100%', background: 'var(--bg-surface)', color: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: 6, fontSize: 12 }}
            />
          </div>
        </div>
      </div>

      {/* Heart Rate & Stress Settings */}
      <div className="space-card" style={{ padding: 14 }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#f87171', marginBottom: 10 }}>
          Cardiac & Stress Thresholds (Clinical Placeholders)
        </h4>
        <div className="grid-2">
          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>
              Resting Max Safe HR (BPM):
            </label>
            <input 
              type="number" 
              value={current.heartRate.restingMaxBpm}
              onChange={(e) => setCurrent({
                ...current,
                heartRate: { ...current.heartRate, restingMaxBpm: parseInt(e.target.value) || 92 }
              })}
              style={{ width: '100%', background: 'var(--bg-surface)', color: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: 6, fontSize: 12 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>
              Sustained HR Delta Above Baseline (BPM):
            </label>
            <input 
              type="number" 
              value={current.heartRate.sustainedElevatedBpm}
              onChange={(e) => setCurrent({
                ...current,
                heartRate: { ...current.heartRate, sustainedElevatedBpm: parseInt(e.target.value) || 18 }
              })}
              style={{ width: '100%', background: 'var(--bg-surface)', color: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: 6, fontSize: 12 }}
            />
          </div>
        </div>
      </div>

      {/* Storage Degradation Thresholds */}
      <div className="space-card" style={{ padding: 14 }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#fbbf24', marginBottom: 10 }}>
          Microgravity Potency Degradation Flags
        </h4>
        <div className="grid-2">
          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>
              Caution Risk Months (Yellow):
            </label>
            <input 
              type="number" 
              value={current.medication.yellowPotencyRiskMonths}
              onChange={(e) => setCurrent({
                ...current,
                medication: { ...current.medication, yellowPotencyRiskMonths: parseInt(e.target.value) || 12 }
              })}
              style={{ width: '100%', background: 'var(--bg-surface)', color: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: 6, fontSize: 12 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>
              Critical Risk Months (Red):
            </label>
            <input 
              type="number" 
              value={current.medication.redPotencyRiskMonths}
              onChange={(e) => setCurrent({
                ...current,
                medication: { ...current.medication, redPotencyRiskMonths: parseInt(e.target.value) || 24 }
              })}
              style={{ width: '100%', background: 'var(--bg-surface)', color: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: 6, fontSize: 12 }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, alignItems: 'center' }}>
        {savedNotice && (
          <span style={{ fontSize: 12, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Check size={14} /> Thresholds applied!
          </span>
        )}
        <button className="btn-primary" onClick={handleSave}>
          <Save size={14} /> Apply Settings
        </button>
      </div>
    </div>
  );
};

