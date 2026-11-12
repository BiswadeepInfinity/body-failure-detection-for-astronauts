import React from 'react';
import { Astronaut } from '../types';
import { StatusBadge } from './StatusBadge';
import { calculate14DayBaseline } from '../data/dataGenerator';
import { Moon, Heart, Activity, ArrowRight, ShieldAlert } from 'lucide-react';

interface Props {
  astronauts: Astronaut[];
  onSelectAstronaut: (astronautId: string) => void;
}

export const CrewOverview: React.FC<Props> = ({ astronauts, onSelectAstronaut }) => {
  return (
    <div>
      {/* Top Banner / Summary metrics */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#f8fafc' }}>Expedition 71 Crew Roster Status</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Continuous biometric telemetry & personalized 14-day rolling baseline comparison.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="metric-box" style={{ padding: '8px 14px' }}>
            <div className="metric-label">Active Crew</div>
            <div className="metric-val" style={{ fontSize: 16 }}>{astronauts.length} POB</div>
          </div>
          <div className="metric-box" style={{ padding: '8px 14px', borderColor: 'var(--status-red-border)' }}>
            <div className="metric-label" style={{ color: '#f87171' }}>Active Flagged Issues</div>
            <div className="metric-val" style={{ fontSize: 16, color: '#f87171' }}>
              {astronauts.reduce((acc, a) => acc + a.recentAlerts.length, 0)} Alerts
            </div>
          </div>
        </div>
      </div>

      {/* 4 Astronaut Cards */}
      <div className="grid-2" style={{ gap: 20 }}>
        {astronauts.map(astronaut => {
          const currentDay = astronaut.missionDay;
          const today = astronaut.history.find(h => h.day === currentDay) || astronaut.history[astronaut.history.length - 1];
          const baseline = calculate14DayBaseline(astronaut.history, currentDay);
          const last7Days = astronaut.history.slice(-7);

          return (
            <div 
              key={astronaut.id} 
              className="space-card"
              style={{
                cursor: 'pointer',
                borderColor: astronaut.overallStatus === 'red' ? 'rgba(239, 68, 68, 0.4)' : undefined,
                background: astronaut.overallStatus === 'red' ? 'linear-gradient(180deg, rgba(239, 68, 68, 0.05) 0%, var(--bg-card) 100%)' : 'var(--bg-card)'
              }}
              onClick={() => onSelectAstronaut(astronaut.id)}
            >
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    background: '#1e293b',
                    border: '2px solid #3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                    color: '#60a5fa'
                  }}>
                    {astronaut.avatarInitials}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#ffffff' }}>{astronaut.name}</h3>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {astronaut.role} · Age {astronaut.age}
                    </div>
                  </div>
                </div>
                <StatusBadge level={astronaut.overallStatus} />
              </div>

              {/* Single-line Top Alert / Medical Warning */}
              <div style={{
                background: astronaut.overallStatus === 'red' ? 'rgba(239, 68, 68, 0.12)' : (astronaut.overallStatus === 'yellow' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(15, 23, 42, 0.6)'),
                border: `1px solid ${astronaut.overallStatus === 'red' ? 'rgba(239, 68, 68, 0.3)' : (astronaut.overallStatus === 'yellow' ? 'rgba(245, 158, 11, 0.25)' : 'var(--border-subtle)')}`,
                borderRadius: 6,
                padding: '8px 12px',
                marginBottom: 14,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: astronaut.overallStatus === 'red' ? '#fca5a5' : (astronaut.overallStatus === 'yellow' ? '#fcd34d' : '#94a3b8')
              }}>
                <ShieldAlert size={15} style={{ flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {astronaut.topAlertSummary}
                </span>
              </div>

              {/* Biometric quick glance */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
                <div className="metric-box">
                  <div className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Moon size={11} /> Sleep
                  </div>
                  <div className="metric-val">{today.sleepHours}h</div>
                  <div className="metric-sub">Base: {baseline.rollingAvgSleepHours}h</div>
                </div>

                <div className="metric-box">
                  <div className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Heart size={11} /> Rest HR
                  </div>
                  <div className="metric-val">{today.restingHeartRate} <span style={{ fontSize: 11 }}>bpm</span></div>
                  <div className="metric-sub">Base: {baseline.rollingAvgRestingHR} bpm</div>
                </div>

                <div className="metric-box">
                  <div className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Activity size={11} /> Stress
                  </div>
                  <div className="metric-val">{today.stressLevel}</div>
                  <div className="metric-sub">Base: {baseline.rollingAvgStress}</div>
                </div>
              </div>

              {/* 7-day Sleep Trend Sparkline */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                  <span>7-Day Sleep Duration vs Target (8.0h)</span>
                  <span>Latest: {today.sleepHours} hrs</span>
                </div>
                <div className="mini-chart">
                  {last7Days.map((d) => {
                    const heightPercent = Math.min(100, Math.max(15, (d.sleepHours / 9) * 100));
                    const isBelowBaseline = d.sleepHours < (baseline.rollingAvgSleepHours - 1.0);
                    const isCrit = d.sleepHours < 5.0;
                    return (
                      <div
                        key={d.day}
                        className={`chart-bar ${isCrit ? 'critical' : (isBelowBaseline ? 'below-baseline' : '')}`}
                        style={{ height: `${heightPercent}%` }}
                        title={`Day ${d.day}: ${d.sleepHours} hrs (Latency: ${d.sleepOnsetLatencyMin}m)`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Action link */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 4, color: '#38bdf8', fontSize: 12, fontWeight: 500 }}>
                <span>Inspect Crew Details</span>
                <ArrowRight size={14} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

