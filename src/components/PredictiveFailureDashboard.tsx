import React, { useState } from 'react';
import { Astronaut } from '../types';
import { PrognosticFailureEngine } from '../ml/prognosticFailureModel';
import { 
  Zap, 
  ShieldAlert, 
  Clock, 
  AlertOctagon,
  TrendingDown,
  Activity
} from 'lucide-react';

interface Props {
  astronauts: Astronaut[];
}

export const PredictiveFailureDashboard: React.FC<Props> = ({ astronauts }) => {
  const [selectedAstroId, setSelectedAstroId] = useState<string>('ast-01');

  const astronaut = astronauts.find(a => a.id === selectedAstroId) || astronauts[0];
  const prognosis = PrognosticFailureEngine.forecastAstronautFailure(astronaut.id, astronaut.history);

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
          <div className="section-title violet">AUTONOMOUS MULTI-HORIZON PROGNOSTIC ENGINE</div>
          <div className="section-subheading" style={{ marginTop: 4 }}>
            Upcoming Physiological & Cognitive Failure Vectors
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4, fontFamily: 'var(--font-mono)' }}>
            Predicting bodily collapse, microsleep clusters, and autonomic crises 24 to 72 hours before onset.
          </div>
        </div>

        {/* Astronaut Selector - Avionics Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(8, 14, 26, 0.8)',
          padding: '8px 16px',
          borderRadius: 999,
          border: '1px solid rgba(168, 85, 247, 0.25)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)'
        }}>
          <Activity size={14} style={{ color: 'var(--violet)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.5px' }}>
            CREW SUBJECT:
          </span>
          <select 
            value={selectedAstroId} 
            onChange={(e) => setSelectedAstroId(e.target.value)}
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
            {astronauts.map(a => (
              <option key={a.id} value={a.id} style={{ background: '#090d16', color: '#fff' }}>
                {a.name} ({a.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Forecast Summary Card */}
      <div className="space-card" style={{ 
        background: prognosis.overallFailureRiskScore > 60 
          ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.16) 0%, rgba(13, 20, 36, 0.85) 100%)' 
          : 'var(--bg-card)',
        borderColor: prognosis.overallFailureRiskScore > 60 ? 'rgba(239, 68, 68, 0.35)' : 'rgba(56, 189, 248, 0.18)',
        padding: 24
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#fca5a5', letterSpacing: '1.2px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              PROGNOSTIC HORIZON: 7-DAY TRAJECTORY · SUBJECT: {astronaut.name.toUpperCase()}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#ffffff', margin: '8px 0 6px 0', display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span>Composite Collapse Risk:</span>
              <span style={{ color: prognosis.overallFailureRiskScore > 60 ? '#f87171' : '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                {prognosis.overallFailureRiskScore}%
              </span>
            </div>
            <p style={{ fontSize: 13.5, color: '#cbd5e1', maxWidth: 840, lineHeight: 1.6 }}>
              Telemetry velocity analysis (dv/dt) projects <strong style={{ color: '#fff' }}>{prognosis.predictedRisks.length} imminent functional failure vectors</strong> breaching physiological tolerances within 24 to 72 flight hours without clinical countermeasure intervention.
            </p>
          </div>

          <div style={{
            background: prognosis.overallFailureRiskScore > 60 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            border: `1px solid ${prognosis.overallFailureRiskScore > 60 ? 'rgba(239, 68, 68, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '14px 20px',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: 10.5, color: '#fca5a5', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', letterSpacing: '0.8px' }}>
              EARLIEST CRITICAL HORIZON
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
              {prognosis.predictedRisks.length > 0 ? `T - ${Math.min(...prognosis.predictedRisks.map(r => r.timeToFailureHours))}H` : 'STABLE'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Pre-Symptomatic Window
            </div>
          </div>
        </div>
      </div>

      {/* Trajectory Drift Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <TrendingDown size={15} style={{ color: 'var(--cyan)' }} />
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
            48-Hour Physiological Degradation Trajectories
          </span>
        </div>

        <div className="grid-3">
          {prognosis.trajectoryPredictions.map(tr => (
            <div key={tr.metricName} className="metric-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="metric-label">{tr.metricName}</span>
                <span style={{
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 999,
                  background: tr.status === 'diverging_to_failure' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(52, 211, 153, 0.15)',
                  color: tr.status === 'diverging_to_failure' ? '#f87171' : '#34d399',
                  border: `1px solid ${tr.status === 'diverging_to_failure' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(52, 211, 153, 0.3)'}`
                }}>
                  {tr.status === 'diverging_to_failure' ? 'BREACH IN 48H' : 'STABLE'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '8px 0 4px 0' }}>
                <div className="metric-val" style={{ color: tr.status === 'diverging_to_failure' ? '#f87171' : '#ffffff', fontSize: 26 }}>
                  {tr.projectedIn48h} <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-secondary)' }}>{tr.unit}</span>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Current: {tr.currentValue} {tr.unit}
                </div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                Failure Limit: <strong style={{ color: '#fca5a5' }}>{tr.criticalFailureLimit} {tr.unit}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Imminent Body Failure Domains List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertOctagon size={16} style={{ color: '#f87171' }} />
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
            Predicted Failure Vectors & Targeted Countermeasures
          </span>
        </div>

        {prognosis.predictedRisks.length === 0 ? (
          <div className="space-card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            Nominal forward trajectory: No upcoming failure vectors projected within the 7-day window.
          </div>
        ) : (
          prognosis.predictedRisks.map(risk => (
            <div 
              key={risk.title}
              className="space-card"
              style={{
                borderColor: risk.severityLevel === 'critical' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(245, 158, 11, 0.35)',
                background: risk.severityLevel === 'critical' ? 'linear-gradient(140deg, rgba(239, 68, 68, 0.08) 0%, rgba(10, 16, 28, 0.8) 100%)' : 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 999,
                      fontSize: 10,
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.5px',
                      background: risk.severityLevel === 'critical' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: risk.severityLevel === 'critical' ? '#f87171' : '#fcd34d',
                      border: `1px solid ${risk.severityLevel === 'critical' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`
                    }}>
                      {risk.severityLevel.toUpperCase()} RISK
                    </span>
                    <strong style={{ fontSize: 16, color: '#ffffff' }}>{risk.title}</strong>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    Domain: <span style={{ color: 'var(--cyan)' }}>{risk.domain}</span> · Vectors: {risk.contributingVectors.map(v => `${v.name} (${v.velocity})`).join(' · ')}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#f87171', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', fontFamily: 'var(--font-mono)' }}>
                    <Clock size={14} /> T - {risk.timeToFailureHours} Hours
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                    Probability: <strong style={{ color: '#ffffff' }}>{risk.failureProbabilityPct}%</strong>
                  </div>
                </div>
              </div>

              {/* Mechanism Description */}
              <div style={{
                fontSize: 12.5,
                color: '#cbd5e1',
                lineHeight: 1.6,
                background: 'rgba(56, 189, 248, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                margin: '12px 0'
              }}>
                <strong style={{ color: '#fca5a5', fontFamily: 'var(--font-mono)' }}>PREDICTED BREAKDOWN PATHWAY: </strong>
                {risk.predictedFailureMechanism}
              </div>

              {/* Actionable Pre-emptive Countermeasure */}
              <div style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10
              }}>
                <ShieldAlert size={16} style={{ color: 'var(--cyan)', flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: 12.5, color: '#e0f2fe', lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 700, color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>ACTIONABLE COUNTERMEASURE: </span>
                  {risk.proactivePrescription}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
