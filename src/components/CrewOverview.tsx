import React from 'react';
import { Astronaut } from '../types';
import { StatusBadge } from './StatusBadge';
import { calculate14DayBaseline } from '../data/dataGenerator';
import { Moon, Heart, Activity, ArrowRight, Radio } from 'lucide-react';

interface Props {
  astronauts: Astronaut[];
  onSelectAstronaut: (astronautId: string) => void;
}

// Flight-ops telemetry label map — intentional naming, not generic
const TELEM_LABELS = {
  sleep: 'SWS Duration',
  hr:    'RHR',
  stress: 'Autonomic Load',
};

export const CrewOverview: React.FC<Props> = ({ astronauts, onSelectAstronaut }) => {
  const totalAlerts = astronauts.reduce((acc, a) => acc + a.recentAlerts.length, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* ── Page Header Row ───────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <div className="section-title">Mission Control · Expedition 71</div>
          <div className="section-subheading" style={{ marginTop: 6 }}>Crew Biometric Roster</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 6, fontFamily: 'var(--font-mono)', letterSpacing: '0.3px' }}>
            Continuous telemetry  ·  14-day rolling personal baseline  ·  ISS Segment 71
          </div>
        </div>

        {/* Summary readouts */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
          <div className="metric-box" style={{ padding: '12px 20px', borderRadius: 14, minWidth: 100, textAlign: 'center' }}>
            <div className="metric-label" style={{ justifyContent: 'center' }}>Crew POB</div>
            <div className="metric-val" style={{ fontSize: 22, textAlign: 'center' }}>{astronauts.length}</div>
          </div>
          <div className="metric-box" style={{
            padding: '12px 20px', borderRadius: 14, minWidth: 120, textAlign: 'center',
            borderColor: totalAlerts > 0 ? 'rgba(248,113,113,0.28)' : undefined,
          }}>
            <div className="metric-label" style={{ justifyContent: 'center', color: totalAlerts > 0 ? 'var(--status-red)' : undefined }}>
              Active Flags
            </div>
            <div className="metric-val" style={{ fontSize: 22, textAlign: 'center', color: totalAlerts > 0 ? '#f87171' : '#34d399', textShadow: totalAlerts > 0 ? '0 0 14px rgba(248,113,113,0.3)' : '0 0 14px rgba(52,211,153,0.3)' }}>
              {totalAlerts}
            </div>
          </div>
        </div>
      </div>

      {/* ── 4-up Crew Cards ───────────────────────────────────── */}
      <div className="grid-2" style={{ gap: 22 }}>
        {astronauts.map(astronaut => {
          const currentDay = astronaut.missionDay;
          const today = astronaut.history.find(h => h.day === currentDay) || astronaut.history[astronaut.history.length - 1];
          const baseline = calculate14DayBaseline(astronaut.history, currentDay);
          const last7Days = astronaut.history.slice(-7);
          const status = astronaut.overallStatus;

          // Per-card accent colour for metrics
          const accentColor =
            status === 'red'    ? '#f87171' :
            status === 'yellow' ? '#fbbf24' : '#34d399';

          return (
            <div
              key={astronaut.id}
              className="crew-card"
              style={{
                borderColor:
                  status === 'red'    ? 'rgba(248,113,113,0.2)' :
                  status === 'yellow' ? 'rgba(251,191,36,0.15)'  :
                  'rgba(52,211,153,0.12)',
              }}
              onClick={() => onSelectAstronaut(astronaut.id)}
            >
              {/* Left status accent stripe */}
              <div className={`crew-card-accent ${status}`} />

              <div className="crew-card-body">

                {/* ── Card Header ─────────────────────────── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 13, alignItems: 'center' }}>

                    {/* Hexagonal mission patch avatar */}
                    <div className="mission-patch">
                      <div
                        className="mission-patch-bg"
                        style={{
                          boxShadow: `0 0 14px ${accentColor}30`,
                          background: `linear-gradient(135deg, ${
                            status === 'red'    ? 'rgba(80,20,20,0.95)' :
                            status === 'yellow' ? 'rgba(60,42,8,0.95)'  :
                            'rgba(14,42,32,0.95)'
                          } 0%, rgba(10,16,32,1) 100%)`,
                        }}
                      >
                        {astronaut.avatarInitials}
                      </div>
                    </div>

                    <div>
                      <h3 style={{ fontSize: 16.5, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.2px' }}>
                        {astronaut.name}
                      </h3>
                      <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                        {astronaut.role} · Age {astronaut.age}
                      </div>
                      <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'var(--font-mono)', letterSpacing: '0.5px' }}>
                        MET · D+{String(astronaut.missionDay).padStart(3, '0')}
                      </div>
                    </div>
                  </div>

                  <StatusBadge level={status} />
                </div>

                {/* ── Top Alert Strip ─────────────────────── */}
                <div
                  className={`alert-strip ${status === 'red' ? 'red' : status === 'yellow' ? 'yellow' : 'nominal'}`}
                  style={{ marginBottom: 16 }}
                >
                  <Radio size={13} style={{ flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12.5 }}>
                    {astronaut.topAlertSummary}
                  </span>
                </div>

                {/* ── Biometric Telemetry Readouts ────────── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>

                  {/* SWS Duration (Sleep) */}
                  <div className="metric-box" style={{ borderRadius: 12, padding: '12px 14px' }}>
                    <div className="metric-label" style={{ gap: 4 }}>
                      <Moon size={11} />
                      {TELEM_LABELS.sleep}
                    </div>
                    <div className="metric-val" style={{ fontSize: 22 }}>
                      {today.sleepHours}<span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 2 }}>h</span>
                    </div>
                    <div className="metric-sub">Base {baseline.rollingAvgSleepHours}h</div>
                  </div>

                  {/* RHR */}
                  <div className="metric-box" style={{ borderRadius: 12, padding: '12px 14px' }}>
                    <div className="metric-label" style={{ gap: 4 }}>
                      <Heart size={11} />
                      {TELEM_LABELS.hr}
                    </div>
                    <div className="metric-val" style={{ fontSize: 22 }}>
                      {today.restingHeartRate}<span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 2 }}>bpm</span>
                    </div>
                    <div className="metric-sub">Base {baseline.rollingAvgRestingHR}</div>
                  </div>

                  {/* Autonomic Load Index (Stress) */}
                  <div className="metric-box" style={{ borderRadius: 12, padding: '12px 14px' }}>
                    <div className="metric-label" style={{ gap: 4 }}>
                      <Activity size={11} />
                      {TELEM_LABELS.stress}
                    </div>
                    <div className="metric-val" style={{ fontSize: 22 }}>
                      {today.stressLevel}
                    </div>
                    <div className="metric-sub">Base {baseline.rollingAvgStress}</div>
                  </div>
                </div>

                {/* ── 7-day Sleep Sparkline ───────────────── */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: 10.5, color: 'var(--text-muted)',
                    marginBottom: 5, fontFamily: 'var(--font-mono)', letterSpacing: '0.4px',
                  }}>
                    <span>SWS 7-Day · Target 8.0h</span>
                    <span style={{ color: 'var(--text-secondary)' }}>NOW {today.sleepHours}h</span>
                  </div>
                  <div className="mini-chart">
                    {last7Days.map((d) => {
                      const pct = Math.min(100, Math.max(10, (d.sleepHours / 9) * 100));
                      const isCrit = d.sleepHours < 5.0;
                      const isBelowBase = !isCrit && d.sleepHours < (baseline.rollingAvgSleepHours - 1.0);
                      return (
                        <div
                          key={d.day}
                          className={`chart-bar ${isCrit ? 'critical' : isBelowBase ? 'below-baseline' : ''}`}
                          style={{ height: `${pct}%` }}
                          title={`D+${d.day}: ${d.sleepHours}h (onset ${d.sleepOnsetLatencyMin}m)`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* ── Inspect Link ────────────────────────── */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <span className="inspect-link">
                    View Full Dossier <ArrowRight size={12} />
                  </span>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
