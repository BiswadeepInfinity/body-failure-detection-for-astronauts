import React, { useState } from 'react';
import { Astronaut } from '../types';
import { PrognosticFailureEngine } from '../ml/prognosticFailureModel';
import { 
  Zap, 
  ShieldAlert, 
  Clock, 
  AlertOctagon
} from 'lucide-react';

interface Props {
  astronauts: Astronaut[];
}

export const PredictiveFailureDashboard: React.FC<Props> = ({ astronauts }) => {
  const [selectedAstroId, setSelectedAstroId] = useState<string>('ast-01');

  const astronaut = astronauts.find(a => a.id === selectedAstroId) || astronauts[0];
  const prognosis = PrognosticFailureEngine.forecastAstronautFailure(astronaut.id, astronaut.history);

  return (
    <div>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '4px 8px', borderRadius: 4, color: '#fca5a5', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>
            <Zap size={13} /> Primary Mission Purpose · Multi-Horizon Predictive Prognostics
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff' }}>
            Upcoming Body & Cognitive Failure Forecasting
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Predicting physiological collapse, micro-sleep failure, and autonomic crises 24 to 72 hours BEFORE clinical onset.
          </p>
        </div>

        {/* Astronaut Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Crew Subject:</span>
          <select 
            value={selectedAstroId} 
            onChange={(e) => setSelectedAstroId(e.target.value)}
            style={{
              background: 'var(--bg-surface)',
              color: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 6,
              padding: '6px 12px',
              fontSize: 13
            }}
          >
            {astronauts.map(a => (
              <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Forecast Summary Card */}
      <div className="space-card" style={{ 
        background: prognosis.overallFailureRiskScore > 60 
          ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(15, 23, 42, 0.8) 100%)' 
          : 'var(--bg-card)',
        borderColor: prognosis.overallFailureRiskScore > 60 ? '#ef4444' : 'var(--border-subtle)',
        marginBottom: 24,
        padding: 20
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#fca5a5', letterSpacing: 0.5 }}>
              Prognostic Horizon: 7-Day Forward Trajectory · Subject: {astronaut.name}
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', margin: '6px 0' }}>
              Composite Body Failure Risk: <span style={{ color: prognosis.overallFailureRiskScore > 60 ? '#ef4444' : '#f59e0b' }}>{prognosis.overallFailureRiskScore}%</span>
            </h3>
            <p style={{ fontSize: 13, color: '#cbd5e1', maxWidth: 840, lineHeight: 1.5 }}>
              Velocity analysis ($dv/dt$) indicates <strong>{prognosis.predictedRisks.length} imminent functional failure domains</strong> projected within the next 24 to 72 flight hours unless pre-emptive operational countermeasures are deployed immediately.
            </p>
          </div>

          <div style={{
            background: prognosis.overallFailureRiskScore > 60 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            border: `1px solid ${prognosis.overallFailureRiskScore > 60 ? '#ef4444' : '#f59e0b'}`,
            borderRadius: 8,
            padding: '10px 16px',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: 11, color: '#fca5a5', fontWeight: 600, textTransform: 'uppercase' }}>
              Earliest Failure Horizon
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              {prognosis.predictedRisks.length > 0 ? `T - ${Math.min(...prognosis.predictedRisks.map(r => r.timeToFailureHours))}h` : 'No Imminent Collapse'}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              Pre-Symptomatic Window
            </div>
          </div>
        </div>

        {/* 48-Hour Biometric Extrapolation Cards */}
        <div className="grid-3" style={{ marginTop: 20 }}>
          {prognosis.biometricTrajectories.map(tr => (
            <div key={tr.metric} className="metric-box" style={{ background: 'rgba(15, 23, 42, 0.7)', borderColor: tr.status === 'diverging_to_failure' ? '#ef4444' : 'var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="metric-label">{tr.metric}</span>
                <span style={{
                  fontSize: 10,
                  padding: '1px 5px',
                  borderRadius: 4,
                  background: tr.status === 'diverging_to_failure' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: tr.status === 'diverging_to_failure' ? '#fca5a5' : '#6ee7b7'
                }}>
                  {tr.status === 'diverging_to_failure' ? 'Breaches Limit in 48h' : 'Stable'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '6px 0' }}>
                <div className="metric-val" style={{ color: tr.status === 'diverging_to_failure' ? '#ef4444' : '#ffffff' }}>
                  {tr.projectedIn48h} <span style={{ fontSize: 11, fontWeight: 400 }}>{tr.unit}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  Current: {tr.currentValue} {tr.unit}
                </div>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                Critical Failure Threshold: <strong style={{ color: '#fca5a5' }}>{tr.criticalFailureLimit} {tr.unit}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Imminent Body Failure Domains List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertOctagon size={18} style={{ color: '#ef4444' }} /> Forecasted Physiological & Cognitive Failure Events
        </h3>

        {prognosis.predictedRisks.length === 0 ? (
          <div className="space-card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
            No upcoming organ or cognitive failure vectors projected within the 7-day prognostic window.
          </div>
        ) : (
          prognosis.predictedRisks.map(risk => (
            <div 
              key={risk.title}
              className="space-card"
              style={{
                borderColor: risk.severityLevel === 'critical' ? 'rgba(239, 68, 68, 0.5)' : (risk.severityLevel === 'high' ? 'rgba(245, 158, 11, 0.5)' : 'var(--border-subtle)'),
                background: risk.severityLevel === 'critical' ? 'linear-gradient(180deg, rgba(239, 68, 68, 0.1) 0%, var(--bg-card) 100%)' : 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      background: risk.severityLevel === 'critical' ? '#ef4444' : '#f59e0b',
                      color: '#ffffff'
                    }}>
                      {risk.severityLevel} Failure Risk
                    </span>
                    <strong style={{ fontSize: 15, color: '#ffffff' }}>{risk.title}</strong>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                    Domain: <span style={{ color: '#38bdf8' }}>{risk.domain}</span> · Contributing Vectors: {risk.contributingVectors.map(v => `${v.name} (${v.velocity})`).join(' · ')}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                    <Clock size={14} /> Time to Failure: {risk.timeToFailureHours} Hours
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Forecast Probability: <strong>{risk.failureProbabilityPct}%</strong>
                  </div>
                </div>
              </div>

              {/* Mechanism Description */}
              <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, background: 'rgba(0,0,0,0.25)', padding: '10px 12px', borderRadius: 6, margin: '10px 0' }}>
                <strong style={{ color: '#fca5a5' }}>Predicted Breakdown Mechanism:</strong> {risk.predictedFailureMechanism}
              </div>

              {/* Actionable Pre-emptive Countermeasure */}
              <div style={{ background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: 6, padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <ShieldAlert size={16} style={{ color: '#38bdf8', flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: 12, color: '#e0f2fe' }}>
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
