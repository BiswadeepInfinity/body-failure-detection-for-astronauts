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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Top Banner / Summary metrics */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.3px' }}>
            Expedition 71 Crew Roster Status
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginTop: 4 }}>
            Continuous biometric telemetry & personalized 14-day rolling baseline comparison.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          <div className="metric-box" style={{ padding: '12px 20px', borderRadius: 16 }}>
            <div className="metric-label">Active Crew</div>
            <div className="metric-val" style={{ fontSize: 20 }}>{astronauts.length} POB</div>
          </div>
          <div className="metric-box" style={{ padding: '12px 20px', borderRadius: 16, borderColor: 'rgba(239, 68, 68, 0.25)' }}>
            <div className="metric-label" style={{ color: '#f87171' }}>Active Flagged Issues</div>
            <div className="metric-val" style={{ fontSize: 20, color: '#f87171' }}>
              {astronauts.reduce((acc, a) => acc + a.recentAlerts.length, 0)} Alerts
            </div>
          </div>
        </div>
      </div>

      {/* 4 Astronaut Cards */}
      <div className="grid-2" style={{ gap: 24 }}>
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
                borderRadius: 22,
                padding: '28px',
                borderColor: astronaut.overallStatus === 'red' ? 'rgba(239, 68, 68, 0.3)' : undefined,
                background: astronaut.overallStatus === 'red' ? 'linear-gradient(180deg, rgba(239, 68, 68, 0.05) 0%, var(--bg-card) 100%)' : 'var(--bg-card)'
              }}
              onClick={() => onSelectAstronaut(astronaut.id)}
            >
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 999,
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 16,
                    color: '#ffffff'
                  }}>
                    {astronaut.avatarInitials}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff' }}>{astronaut.name}</h3>
                    <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                      {astronaut.role} · Age {astronaut.age}
                    </div>
                  </div>
                </div>
                <StatusBadge level={astronaut.overallStatus} />
              </div>

              {/* Single-line Top Alert / Medical Warning */}
              <div style={{
                background: astronaut.overallStatus === 'red' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${astronaut.overallStatus === 'red' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.06)'}`,
                borderRadius: 12,
                padding: '10px 16px',
                marginBottom: 18,
                fontSize: 13.5,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                color: astronaut.overallStatus === 'red' ? '#fca5a5' : 'var(--text-secondary)'
              }}>
                <ShieldAlert size={16} style={{ flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {astronaut.topAlertSummary}
                </span>
              </div>

              {/* Biometric quick glance */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 18 }}>
                <div className="metric-box" style={{ borderRadius: 14, padding: '14px 16px' }}>
                  <div className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                    <Moon size={13} /> Sleep
                  </div>
                  <div className="metric-val" style={{ fontSize: 24 }}>{today.sleepHours}h</div>
                  <div className="metric-sub" style={{ fontSize: 12 }}>Base: {baseline.rollingAvgSleepHours}h</div>
                </div>

                <div className="metric-box" style={{ borderRadius: 14, padding: '14px 16px' }}>
                  <div className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                    <Heart size={13} /> Rest HR
                  </div>
                  <div className="metric-val" style={{ fontSize: 24 }}>{today.restingHeartRate} <span style={{ fontSize: 13 }}>bpm</span></div>
                  <div className="metric-sub" style={{ fontSize: 12 }}>Base: {baseline.rollingAvgRestingHR} bpm</div>
                </div>

                <div className="metric-box" style={{ borderRadius: 14, padding: '14px 16px' }}>
                  <div className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                    <Activity size={13} /> Stress
                  </div>
                  <div className="metric-val" style={{ fontSize: 24 }}>{today.stressLevel}</div>
                  <div className="metric-sub" style={{ fontSize: 12 }}>Base: {baseline.rollingAvgStress}</div>
                </div>
              </div>

              {/* 7-day Sleep Trend Sparkline */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                  <span>7-Day Sleep Duration vs Target (8.0h)</span>
                  <span>Latest: {today.sleepHours} hrs</span>
                </div>
                <div className="mini-chart" style={{ height: 50, gap: 5 }}>
                  {last7Days.map((d) => {
                    const heightPercent = Math.min(100, Math.max(15, (d.sleepHours / 9) * 100));
                    const isBelowBaseline = d.sleepHours < (baseline.rollingAvgSleepHours - 1.0);
                    const isCrit = d.sleepHours < 5.0;
                    return (
                      <div
                        key={d.day}
                        className={`chart-bar ${isCrit ? 'critical' : (isBelowBaseline ? 'below-baseline' : '')}`}
                        style={{ height: `${heightPercent}%`, borderRadius: '4px 4px 0 0' }}
                        title={`Day ${d.day}: ${d.sleepHours} hrs (Latency: ${d.sleepOnsetLatencyMin}m)`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Action link */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, color: '#ffffff', fontSize: 13.5, fontWeight: 600 }}>
                <span>Inspect Crew Details</span>
                <ArrowRight size={15} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

