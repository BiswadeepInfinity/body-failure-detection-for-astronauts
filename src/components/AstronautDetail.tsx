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
  Info,
  ChevronLeft
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Flight Header & Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: 16,
        paddingBottom: 16,
        borderBottom: '1px solid rgba(56, 189, 248, 0.12)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button 
            className="btn-secondary" 
            onClick={onBack}
            style={{ padding: '8px 16px', borderRadius: 999, fontSize: 13, gap: 6 }}
          >
            <ChevronLeft size={16} /> Roster
          </button>
          <div>
            <div className="section-title">CREW BIOMETRIC TELEMETRY DOSSIER · ISS EXPEDITION 71</div>
            <div className="section-subheading" style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
              <span>{astronaut.name}</span>
              <StatusBadge level={astronaut.overallStatus} />
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
              {astronaut.role} · Flight Day {astronaut.missionDay} Telemetry Stream
            </div>
          </div>
        </div>

        {/* Day Selector - Avionics Bezel */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(8, 14, 26, 0.8)',
          padding: '8px 16px',
          borderRadius: 999,
          border: '1px solid rgba(56, 189, 248, 0.2)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)'
        }}>
          <Calendar size={14} style={{ color: 'var(--cyan)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.5px' }}>
            SCRUB FLIGHT DAY:
          </span>
          <select 
            value={selectedDay} 
            onChange={(e) => setSelectedDay(Number(e.target.value))}
            style={{
              background: 'transparent',
              color: '#ffffff',
              border: 'none',
              padding: '2px 4px',
              fontSize: 13,
              fontFamily: 'var(--font-mono)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {history.map(h => (
              <option key={h.day} value={h.day} style={{ background: '#090d16', color: '#fff' }}>
                FD {h.day} ({h.date})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary 4 Telemetry Metrics */}
      <div className="grid-4">
        {/* Metric 1: Sleep */}
        <div className="metric-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="metric-label">
              <Moon size={12} style={{ color: '#818cf8' }} /> SWS Duration
            </span>
            <span style={{
              fontSize: 10.5,
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: currentRecord.sleepHours < baseline.rollingAvgSleepHours - 1 ? '#f87171' : '#34d399'
            }}>
              {currentRecord.sleepHours < baseline.rollingAvgSleepHours ? '▼ BELOW BASELINE' : '▲ NOMINAL'}
            </span>
          </div>
          <div className="metric-val">
            {currentRecord.sleepHours} <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)' }}>hrs</span>
          </div>
          
          <div style={{
            background: 'rgba(56, 189, 248, 0.04)',
            border: '1px solid rgba(256, 256, 256, 0.05)',
            padding: '8px 10px',
            borderRadius: 'var(--radius-sm)',
            marginTop: 10,
            fontSize: 11,
            fontFamily: 'var(--font-mono)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>14D Baseline:</span>
              <strong style={{ color: '#94a3b8' }}>{baseline.rollingAvgSleepHours} hrs</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginTop: 4 }}>
              <span>NASA Target:</span>
              <strong style={{ color: '#38bdf8' }}>8.0 - 8.5 hrs</strong>
            </div>
          </div>
        </div>

        {/* Metric 2: Sleep Latency */}
        <div className="metric-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="metric-label">
              <Clock size={12} style={{ color: '#38bdf8' }} /> Sleep Latency
            </span>
            <span style={{
              fontSize: 10.5,
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: currentRecord.sleepOnsetLatencyMin > 35 ? '#fbbf24' : '#34d399'
            }}>
              {currentRecord.sleepOnsetLatencyMin > 35 ? 'DELAYED' : 'OPTIMAL'}
            </span>
          </div>
          <div className="metric-val">
            {currentRecord.sleepOnsetLatencyMin} <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)' }}>min</span>
          </div>
          
          <div style={{
            background: 'rgba(56, 189, 248, 0.04)',
            border: '1px solid rgba(256, 256, 256, 0.05)',
            padding: '8px 10px',
            borderRadius: 'var(--radius-sm)',
            marginTop: 10,
            fontSize: 11,
            fontFamily: 'var(--font-mono)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>14D Rolling:</span>
              <strong style={{ color: '#94a3b8' }}>{baseline.rollingAvgSleepLatencyMin} min</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginTop: 4 }}>
              <span>Hypnotic State:</span>
              <span style={{ color: currentRecord.medicationsTaken.some(m => m.includes('Zolpidem')) ? '#34d399' : 'var(--text-muted)' }}>
                {currentRecord.medicationsTaken.some(m => m.includes('Zolpidem')) ? 'Active (-12m)' : 'None'}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Resting Heart Rate */}
        <div className="metric-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="metric-label">
              <Heart size={12} style={{ color: '#f87171' }} /> Resting HR
            </span>
            <span style={{
              fontSize: 10.5,
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: currentRecord.restingHeartRate > baseline.rollingAvgRestingHR + 10 ? '#fbbf24' : '#34d399'
            }}>
              Δ {currentRecord.restingHeartRate - baseline.rollingAvgRestingHR >= 0 ? '+' : ''}{currentRecord.restingHeartRate - baseline.rollingAvgRestingHR} BPM
            </span>
          </div>
          <div className="metric-val">
            {currentRecord.restingHeartRate} <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)' }}>bpm</span>
          </div>
          
          <div style={{
            background: 'rgba(56, 189, 248, 0.04)',
            border: '1px solid rgba(256, 256, 256, 0.05)',
            padding: '8px 10px',
            borderRadius: 'var(--radius-sm)',
            marginTop: 10,
            fontSize: 11,
            fontFamily: 'var(--font-mono)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>14D Baseline:</span>
              <strong style={{ color: '#94a3b8' }}>{baseline.rollingAvgRestingHR} bpm</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginTop: 4 }}>
              <span>Safety Band:</span>
              <span style={{ color: '#94a3b8' }}>50 - 90 bpm</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Autonomic Load */}
        <div className="metric-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="metric-label">
              <Activity size={12} style={{ color: '#fbbf24' }} /> Autonomic Stress
            </span>
            <span style={{
              fontSize: 10.5,
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: currentRecord.stressLevel > 70 ? '#f87171' : '#34d399'
            }}>
              SCORE {currentRecord.stressLevel}/100
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <div className="metric-val">{currentRecord.stressLevel}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)' }}>
              <Smile size={12} /> Mood: <strong>{currentRecord.moodScore}/10</strong>
            </div>
          </div>
          
          <div style={{
            background: 'rgba(56, 189, 248, 0.04)',
            border: '1px solid rgba(256, 256, 256, 0.05)',
            padding: '8px 10px',
            borderRadius: 'var(--radius-sm)',
            marginTop: 10,
            fontSize: 11,
            fontFamily: 'var(--font-mono)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>14D Avg Stress:</span>
              <strong style={{ color: '#94a3b8' }}>{baseline.rollingAvgStress}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginTop: 4 }}>
              <span>14D Avg Mood:</span>
              <strong style={{ color: '#94a3b8' }}>{baseline.rollingAvgMood} / 10</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Baseline Band Chart (Sleep Duration over last 14 Days) */}
      <div className="space-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Moon size={14} style={{ color: 'var(--cyan)' }} />
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                14-Day Sleep Duration vs Personal Rolling Baseline
              </span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
              Tracking individual astronaut baseline ({baseline.rollingAvgSleepHours}h) against standard NASA target (8.0h).
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 11, fontFamily: 'var(--font-mono)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, background: '#38bdf8', borderRadius: 2 }}></span>
              <span style={{ color: 'var(--text-secondary)' }}>Actual</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 14, height: 2, background: '#34d399' }}></span>
              <span style={{ color: 'var(--text-secondary)' }}>Baseline ({baseline.rollingAvgSleepHours}h)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 14, height: 2, borderTop: '2px dashed rgba(255,255,255,0.4)' }}></span>
              <span style={{ color: 'var(--text-muted)' }}>Target (8.0h)</span>
            </div>
          </div>
        </div>

        {/* Telemetry Bar Chart */}
        <div style={{ height: 170, display: 'flex', alignItems: 'flex-end', gap: 10, paddingBottom: 28, position: 'relative', borderBottom: '1px solid rgba(56, 189, 248, 0.15)' }}>
          {/* Baseline horizontal guideline */}
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: `${(baseline.rollingAvgSleepHours / 9.5) * 100}%`,
            borderBottom: '2px dashed #34d399',
            pointerEvents: 'none',
            zIndex: 1
          }}>
            <span style={{ position: 'absolute', right: 4, bottom: 4, fontSize: 10, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
              Baseline {baseline.rollingAvgSleepHours}h
            </span>
          </div>

          {/* NASA Standard Target guideline */}
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: `${(8.0 / 9.5) * 100}%`,
            borderBottom: '1px dashed rgba(255,255,255,0.3)',
            pointerEvents: 'none',
            zIndex: 1
          }}>
            <span style={{ position: 'absolute', left: 4, bottom: 4, fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              NASA Target (8.0h)
            </span>
          </div>

          {last14Days.map(dayRecord => {
            const heightPct = Math.min(100, Math.max(10, (dayRecord.sleepHours / 9.5) * 100));
            const isDeficit = dayRecord.sleepHours < baseline.rollingAvgSleepHours - 1.0;
            const hasMed = dayRecord.medicationsTaken.length > 0;
            const isSelected = dayRecord.day === selectedDay;

            return (
              <div 
                key={dayRecord.day} 
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', zIndex: 2 }}
                onClick={() => setSelectedDay(dayRecord.day)}
              >
                {hasMed && (
                  <Pill size={11} style={{ color: 'var(--cyan)', marginBottom: 4 }} />
                )}
                <div 
                  style={{
                    width: '100%',
                    maxWidth: 26,
                    height: `${heightPct}%`,
                    background: isDeficit ? '#f87171' : (isSelected ? '#38bdf8' : 'rgba(56, 189, 248, 0.45)'),
                    boxShadow: isSelected ? '0 0 12px rgba(56, 189, 248, 0.5)' : (isDeficit ? '0 0 10px rgba(248, 113, 113, 0.4)' : 'none'),
                    borderRadius: '4px 4px 0 0',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title={`FD ${dayRecord.day}: ${dayRecord.sleepHours}h`}
                />
                <span style={{
                  fontSize: 10,
                  color: isSelected ? '#ffffff' : 'var(--text-muted)',
                  marginTop: 8,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: isSelected ? 700 : 500
                }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={15} style={{ color: '#f59e0b' }} />
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                Active Diagnostic Alerts
              </span>
            </div>
            <span style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: '#38bdf8',
              padding: '2px 8px',
              borderRadius: 999
            }}>
              {astronaut.recentAlerts.length} TRIGGERED
            </span>
          </div>

          {astronaut.recentAlerts.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
              Nominal status: No safety or physiological alerts triggered for Day {selectedDay}.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {astronaut.recentAlerts.map(alt => (
                <div key={alt.id} className={`alert-strip ${alt.level}`} style={{ borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <strong style={{ fontSize: 13, color: alt.level === 'red' ? '#fca5a5' : '#fcd34d' }}>
                        {alt.title}
                      </strong>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {alt.timestamp}
                      </span>
                    </div>
                    <div style={{ fontSize: 12.5, color: '#e2e8f0', marginBottom: 6 }}>
                      {alt.reason}
                    </div>
                    {alt.flightSurgeonNote && (
                      <div style={{
                        fontSize: 11,
                        color: 'var(--text-secondary)',
                        background: 'rgba(8, 14, 26, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        <span style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>SURGEON DIRECTIVE:</span> {alt.flightSurgeonNote}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Active Regimen */}
        <div className="space-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Pill size={15} style={{ color: 'var(--cyan)' }} />
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                Active Pharmacotherapy Regimen
              </span>
            </div>
            <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: 11, borderRadius: 999 }} onClick={onOpenMedication}>
              Manage Dosing →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {astronaut.activeMedications.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
                No active scheduled medications on record.
              </div>
            ) : (
              astronaut.activeMedications.map(med => (
                <div key={med.id} style={{
                  background: 'linear-gradient(135deg, rgba(14,22,42,0.6) 0%, rgba(8,13,24,0.7) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <strong style={{ color: '#ffffff', fontSize: 13 }}>{med.drugName} ({med.dose})</strong>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      padding: '2px 8px',
                      borderRadius: 999,
                      background: med.isSedating ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                      color: med.isSedating ? '#fca5a5' : '#38bdf8',
                      border: `1px solid ${med.isSedating ? 'rgba(239, 68, 68, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`
                    }}>
                      {med.isSedating ? 'SEDATING / HYPNOTIC' : med.category.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    Schedule: {med.frequency} · Prescribed for: {med.prescribedFor}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* NASA Research context */}
          <div style={{
            marginTop: 16,
            background: 'rgba(56, 189, 248, 0.05)',
            border: '1px solid rgba(56, 189, 248, 0.16)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 14px',
            display: 'flex',
            gap: 10
          }}>
            <Info size={16} style={{ color: 'var(--cyan)', flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong style={{ color: '#ffffff' }}>NASA Microgravity PK/PD:</strong> Flown pharmaceuticals undergo altered hepatic clearance, delayed gastric emptying, and spaceflight radiation degradation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
