import React, { useState } from 'react';
import { Astronaut, DailyBiometrics } from '../types';
import { calculate14DayBaseline } from '../data/dataGenerator';
import { StatusBadge } from './StatusBadge';
import { 
  Moon, 
  Heart, 
  Activity, 
  Smile, 
  Clock, 
  AlertTriangle, 
  Pill,
  Calendar,
  Info
} from 'lucide-react';

interface Props {
  astronaut: Astronaut;
  onBack: () => void;
  onOpenMedication: () => void;
}

export const AstronautDetail: React.FC<Props> = ({ astronaut, onBack, onOpenMedication }) => {
  const [selectedDay, setSelectedDay] = useState<number>(astronaut.missionDay);
  const history = astronaut.history;
  const currentRecord: DailyBiometrics = history.find(h => h.day === selectedDay) || history[history.length - 1];
  const baseline = calculate14DayBaseline(history, selectedDay);

  const last14Days = history.slice(Math.max(0, selectedDay - 14), selectedDay);

  return (
    <div>
      {/* Top Breadcrumb & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn-secondary" onClick={onBack}>
            ← Crew Roster
          </button>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 10 }}>
              {astronaut.name}
              <StatusBadge level={astronaut.overallStatus} />
            </h2>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {astronaut.role} · Mission Day {astronaut.missionDay} Telemetry Stream
            </div>
          </div>
        </div>

        {/* Day Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
          <Calendar size={14} style={{ color: '#38bdf8' }} />
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Viewing Day:</span>
          <select 
            value={selectedDay} 
            onChange={(e) => setSelectedDay(Number(e.target.value))}
            style={{
              background: 'var(--bg-surface)',
              color: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 4,
              padding: '2px 8px',
              fontSize: 12,
              fontFamily: 'var(--font-mono)'
            }}
          >
            {history.map(h => (
              <option key={h.day} value={h.day}>Flight Day {h.day} ({h.date})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary 4 Telemetry Metrics with Personalized 14-Day Baseline Bands */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {/* Metric 1: Sleep */}
        <div className="space-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Moon size={13} style={{ color: '#818cf8' }} /> Sleep Duration
            </span>
            <span style={{ fontSize: 11, color: currentRecord.sleepHours < baseline.rollingAvgSleepHours - 1 ? '#f87171' : '#10b981' }}>
              {currentRecord.sleepHours < baseline.rollingAvgSleepHours ? '▼ Below Baseline' : '▲ Nominal'}
            </span>
          </div>
          <div className="metric-val">{currentRecord.sleepHours} <span style={{ fontSize: 13, fontWeight: 400 }}>hrs</span></div>
          
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '6px 8px', borderRadius: 4, marginTop: 8, fontSize: 11 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Personal 14d Baseline:</span>
              <strong style={{ color: '#94a3b8' }}>{baseline.rollingAvgSleepHours} hrs</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginTop: 2 }}>
              <span>NASA-STD-3001 Target:</span>
              <strong style={{ color: '#38bdf8' }}>8.0 - 8.5 hrs</strong>
            </div>
          </div>
        </div>

        {/* Metric 2: Sleep Latency */}
        <div className="space-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Clock size={13} style={{ color: '#38bdf8' }} /> Sleep Onset Latency
            </span>
            <span style={{ fontSize: 11, color: currentRecord.sleepOnsetLatencyMin > 35 ? '#fbbf24' : '#10b981' }}>
              {currentRecord.sleepOnsetLatencyMin > 35 ? 'Delayed' : 'Quick'}
            </span>
          </div>
          <div className="metric-val">{currentRecord.sleepOnsetLatencyMin} <span style={{ fontSize: 13, fontWeight: 400 }}>min</span></div>
          
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '6px 8px', borderRadius: 4, marginTop: 8, fontSize: 11 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>14d Rolling Avg:</span>
              <strong style={{ color: '#94a3b8' }}>{baseline.rollingAvgSleepLatencyMin} min</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginTop: 2 }}>
              <span>Hypnotic Effect:</span>
              <span style={{ color: '#10b981' }}>{currentRecord.medicationsTaken.some(m => m.includes('Zolpidem')) ? 'Active (-12m)' : 'None'}</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Resting Heart Rate */}
        <div className="space-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Heart size={13} style={{ color: '#f87171' }} /> Resting HR
            </span>
            <span style={{ fontSize: 11, color: currentRecord.restingHeartRate > baseline.rollingAvgRestingHR + 10 ? '#fbbf24' : '#10b981' }}>
              Δ {currentRecord.restingHeartRate - baseline.rollingAvgRestingHR >= 0 ? '+' : ''}{currentRecord.restingHeartRate - baseline.rollingAvgRestingHR} bpm
            </span>
          </div>
          <div className="metric-val">{currentRecord.restingHeartRate} <span style={{ fontSize: 13, fontWeight: 400 }}>bpm</span></div>
          
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '6px 8px', borderRadius: 4, marginTop: 8, fontSize: 11 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Personal 14d Baseline:</span>
              <strong style={{ color: '#94a3b8' }}>{baseline.rollingAvgRestingHR} bpm</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginTop: 2 }}>
              <span>Clinical Safe Band:</span>
              <span style={{ color: '#94a3b8' }}>50 - 90 bpm</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Autonomic Stress & Mood */}
        <div className="space-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Activity size={13} style={{ color: '#fbbf24' }} /> Stress & Mood
            </span>
            <span style={{ fontSize: 11, color: currentRecord.stressLevel > 70 ? '#f87171' : '#10b981' }}>
              Stress: {currentRecord.stressLevel}/100
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <div className="metric-val">{currentRecord.stressLevel}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Smile size={13} /> Mood: <strong>{currentRecord.moodScore}/10</strong>
            </div>
          </div>
          
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '6px 8px', borderRadius: 4, marginTop: 8, fontSize: 11 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>14d Avg Stress:</span>
              <strong style={{ color: '#94a3b8' }}>{baseline.rollingAvgStress}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginTop: 2 }}>
              <span>14d Avg Mood:</span>
              <strong style={{ color: '#94a3b8' }}>{baseline.rollingAvgMood} / 10</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Baseline Band Chart (Sleep Duration over last 14 Days) */}
      <div className="space-card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff' }}>
              14-Day Sleep Duration vs Personal Rolling Baseline
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Comparing actual sleep to individual astronaut baseline ({baseline.rollingAvgSleepHours}h) and NASA target (8.0h).
            </p>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 11 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, background: '#3b82f6', borderRadius: 2 }}></span>
              <span>Actual Sleep</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 2, background: '#10b981' }}></span>
              <span>Personal Baseline ({baseline.rollingAvgSleepHours}h)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 2, background: '#e2e8f0', borderTop: '1px dashed #94a3b8' }}></span>
              <span>NASA Target (8.0h)</span>
            </div>
          </div>
        </div>

        {/* CSS Chart Representation */}
        <div style={{ height: 160, display: 'flex', alignItems: 'flex-end', gap: 8, paddingBottom: 24, position: 'relative', borderBottom: '1px solid var(--border-subtle)' }}>
          {/* Baseline horizontal guideline */}
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: `${(baseline.rollingAvgSleepHours / 9.5) * 100}%`,
            borderBottom: '2px dashed #10b981',
            pointerEvents: 'none',
            zIndex: 1
          }}>
            <span style={{ position: 'absolute', right: 4, bottom: 2, fontSize: 10, color: '#10b981', background: 'var(--bg-card)', padding: '0 4px' }}>
              Baseline {baseline.rollingAvgSleepHours}h
            </span>
          </div>

          {/* NASA Standard Target guideline */}
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: `${(8.0 / 9.5) * 100}%`,
            borderBottom: '1px dashed rgba(255,255,255,0.4)',
            pointerEvents: 'none',
            zIndex: 1
          }}>
            <span style={{ position: 'absolute', left: 4, bottom: 2, fontSize: 10, color: '#94a3b8', background: 'var(--bg-card)', padding: '0 4px' }}>
              NASA-STD-3001 (8.0h)
            </span>
          </div>

          {last14Days.map(dayRecord => {
            const heightPct = Math.min(100, Math.max(10, (dayRecord.sleepHours / 9.5) * 100));
            const isDeficit = dayRecord.sleepHours < baseline.rollingAvgSleepHours - 1.0;
            const hasMed = dayRecord.medicationsTaken.length > 0;

            return (
              <div 
                key={dayRecord.day} 
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', zIndex: 2 }}
                onClick={() => setSelectedDay(dayRecord.day)}
              >
                {hasMed && (
                  <Pill size={11} style={{ color: '#38bdf8', marginBottom: 2 }} />
                )}
                <div 
                  style={{
                    width: '100%',
                    maxWidth: 28,
                    height: `${heightPct}%`,
                    background: isDeficit ? '#ef4444' : (dayRecord.day === selectedDay ? '#60a5fa' : '#2563eb'),
                    borderRadius: '3px 3px 0 0',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title={`Day ${dayRecord.day}: ${dayRecord.sleepHours}h sleep. Meds: ${dayRecord.medicationsTaken.join(', ') || 'None'}`}
                />
                <span style={{ fontSize: 10, color: dayRecord.day === selectedDay ? '#ffffff' : 'var(--text-muted)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
                  D{dayRecord.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two columns: Alert Engine Diagnosis & Active Medications */}
      <div className="grid-2">
        {/* Active Alerts for this Crew Member */}
        <div className="space-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={15} style={{ color: '#f59e0b' }} /> Clinical Decision-Support Alerts
            </h3>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {astronaut.recentAlerts.length} triggered
            </span>
          </div>

          {astronaut.recentAlerts.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              No active safety or physiological alerts triggered for Day {selectedDay}.
            </div>
          ) : (
            astronaut.recentAlerts.map(alt => (
              <div key={alt.id} className={`alert-strip ${alt.level}`}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <strong style={{ fontSize: 13, color: alt.level === 'red' ? '#fca5a5' : '#fcd34d' }}>
                      {alt.title}
                    </strong>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {alt.timestamp}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-main)', marginBottom: 6 }}>
                    <strong>Why fired:</strong> {alt.reason}
                  </div>
                  {alt.flightSurgeonNote && (
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.25)', padding: '4px 8px', borderRadius: 4 }}>
                      <span style={{ color: '#38bdf8' }}>Flight Surgeon Action:</span> {alt.flightSurgeonNote}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Current Active Regimen */}
        <div className="space-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Pill size={15} style={{ color: '#38bdf8' }} /> Active Pharmacotherapy Regimen
            </h3>
            <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11 }} onClick={onOpenMedication}>
              Manage Dosing →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {astronaut.activeMedications.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                No active scheduled medications on record.
              </div>
            ) : (
              astronaut.activeMedications.map(med => (
                <div key={med.id} style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 6,
                  padding: '10px 14px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <strong style={{ color: '#ffffff', fontSize: 13 }}>{med.drugName} ({med.dose})</strong>
                    <span style={{
                      fontSize: 10,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: med.isSedating ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                      color: med.isSedating ? '#fca5a5' : '#93c5fd'
                    }}>
                      {med.isSedating ? 'Sedating / Hypnotic' : med.category}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    Schedule: {med.frequency} · Prescribed for: {med.prescribedFor}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Research insight callout */}
          <div style={{ marginTop: 14, background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '10px 12px', display: 'flex', gap: 8 }}>
            <Info size={16} style={{ color: '#38bdf8', flexShrink: 0 }} />
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              <strong>NASA Pharmacotherapy Context:</strong> Flown medications are monitored for altered bioavailability, gastric emptying delay under zero-g, and hepatic enzyme changes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

