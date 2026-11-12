import React, { useState } from 'react';
import { Astronaut } from '../types';
import { DeepSpaceAdaptiveMLEngine, AnomalyScoreResult, TERRESTRIAL_PRIORS } from '../ml/adaptiveEngine';
import { 
  BrainCircuit, 
  Cpu, 
  Sparkles, 
  Sliders, 
  Compass
} from 'lucide-react';

interface Props {
  astronauts: Astronaut[];
}

export const AdaptiveMLScreen: React.FC<Props> = ({ astronauts }) => {
  const [selectedAstroId, setSelectedAstroId] = useState<string>('ast-01');
  const [learningRate, setLearningRate] = useState<number>(0.08);

  const astronaut = astronauts.find(a => a.id === selectedAstroId) || astronauts[0];

  // Run the Adaptive Online Learning simulation over the astronaut's 30-day telemetry
  const mlEngine = new DeepSpaceAdaptiveMLEngine(TERRESTRIAL_PRIORS, learningRate);
  const evaluationTimeline: AnomalyScoreResult[] = [];

  astronaut.history.forEach(dayReading => {
    // 1. Evaluate reading against current adaptive manifold
    const evalResult = mlEngine.evaluateReading(dayReading);
    evaluationTimeline.push(evalResult);

    // 2. Perform online Bayesian step (adapts internal priors)
    mlEngine.stepOnlineLearning(dayReading);
  });

  const latestEvaluation = evaluationTimeline[evaluationTimeline.length - 1];
  const adaptiveParams = mlEngine.getModelParameters();

  return (
    <div>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '4px 8px', borderRadius: 4, color: '#c084fc', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>
            <BrainCircuit size={13} /> Deep Space Edge ML · N=1 Self-Supervised Learning
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff' }}>
            Adaptive Physiological Manifold & Novel Condition Discovery
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Continuous online learning in data-sparse microgravity. Detects out-of-distribution bodily states and generates autonomous space medicine hypotheses.
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

      {/* Top 3 ML Diagnostic Cards */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {/* Card 1: Multi-variate Mahalanobis Distance */}
        <div className="space-card" style={{ borderColor: latestEvaluation.isNovelCondition ? '#ef4444' : '#3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Compass size={14} style={{ color: '#38bdf8' }} /> Multi-Variate Mahalanobis Distance
            </span>
            <span style={{
              fontSize: 10,
              padding: '2px 6px',
              borderRadius: 4,
              background: latestEvaluation.isNovelCondition ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              color: latestEvaluation.isNovelCondition ? '#fca5a5' : '#6ee7b7'
            }}>
              {latestEvaluation.isNovelCondition ? 'Out-Of-Distribution' : 'Nominal Manifold'}
            </span>
          </div>
          <div className="metric-val" style={{ color: latestEvaluation.isNovelCondition ? '#f87171' : '#ffffff' }}>
            {latestEvaluation.mahalanobisDistance} <span style={{ fontSize: 13, fontWeight: 400 }}>σ</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
            Multi-axial divergence across [Sleep + HR + Latency + Stress + Mood] covariance.
          </div>
        </div>

        {/* Card 2: Novelty & Uncertainty Index */}
        <div className="space-card" style={{ borderColor: latestEvaluation.noveltyScorePct > 60 ? '#f59e0b' : '#3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Cpu size={14} style={{ color: '#c084fc' }} /> Novelty Discovery Score
            </span>
            <span style={{ fontSize: 11, color: '#c084fc', fontWeight: 600 }}>
              {latestEvaluation.noveltyScorePct}%
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '8px 0' }}>
            <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                width: `${latestEvaluation.noveltyScorePct}%`,
                height: '100%',
                background: latestEvaluation.noveltyScorePct > 65 ? '#ef4444' : (latestEvaluation.noveltyScorePct > 35 ? '#f59e0b' : '#10b981')
              }} />
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            Evaluates: <em>"Have we ever encountered this physiological state in flight history?"</em>
          </div>
        </div>

        {/* Card 3: Model Certainty & N=1 Learning Factor */}
        <div className="space-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <BrainCircuit size={14} style={{ color: '#10b981' }} /> Model Epistemic Certainty
            </span>
            <span style={{ fontSize: 11, color: '#10b981' }}>
              Sample: {adaptiveParams.sampleCount} Days
            </span>
          </div>
          <div className="metric-val" style={{ color: '#10b981' }}>
            {latestEvaluation.modelConfidenceScore}%
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
            System self-estimates higher epistemic uncertainty during unprecedented mission states.
          </div>
        </div>
      </div>

      {/* Autonomous Hypothesis Generator Section */}
      <div className="space-card" style={{ 
        background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.25) 0%, rgba(15, 23, 42, 0.8) 100%)',
        borderColor: '#a855f7',
        marginBottom: 24,
        padding: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Sparkles size={20} style={{ color: '#c084fc' }} />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>
            Autonomous Space Medicine Hypothesis Engine
          </h3>
          <span style={{ fontSize: 11, background: 'rgba(168, 85, 247, 0.2)', color: '#e9d5ff', padding: '2px 8px', borderRadius: 4 }}>
            Active Deep Space Reasoning
          </span>
        </div>

        {latestEvaluation.autonomousHypotheses.length === 0 ? (
          <div style={{ fontSize: 13, color: '#cbd5e1', padding: '10px 0' }}>
            Astronaut manifold is currently nominal. No novel physiological anomalies detected requiring diagnostic hypothesis generation.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {latestEvaluation.autonomousHypotheses.map((hyp, idx) => (
              <div 
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  borderRadius: 6,
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12
                }}
              >
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: 'rgba(168, 85, 247, 0.3)',
                  color: '#c084fc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {idx + 1}
                </div>
                <div>
                  <div style={{ fontSize: 13, color: '#f8fafc', fontWeight: 500, lineHeight: 1.4 }}>
                    {hyp}
                  </div>
                  <div style={{ fontSize: 11, color: '#a855f7', marginTop: 4 }}>
                    Synthesized from multi-parameter drift: {latestEvaluation.contributingBiometrics.filter(b => Math.abs(b.zScore) > 1.0).map(b => `${b.feature} (Z: ${b.zScore})`).join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 30-Day Mahalanobis Anomaly Timeline Chart */}
      <div className="space-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff' }}>
              30-Day Adaptive Novelty & Anomaly Trajectory
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Tracking deviation from dynamically updating personalized baseline throughout the mission.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 11 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10b981' }}>
              <span style={{ width: 10, height: 10, background: '#10b981', borderRadius: 2 }} />
              Nominal (&lt; 2.5σ)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f59e0b' }}>
              <span style={{ width: 10, height: 10, background: '#f59e0b', borderRadius: 2 }} />
              Drift (2.5 - 3.2σ)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ef4444' }}>
              <span style={{ width: 10, height: 10, background: '#ef4444', borderRadius: 2 }} />
              Out-of-Distribution (&gt; 3.2σ)
            </span>
          </div>
        </div>

        {/* Timeline Chart */}
        <div style={{ height: 160, display: 'flex', alignItems: 'flex-end', gap: 6, paddingBottom: 24, position: 'relative', borderBottom: '1px solid var(--border-subtle)' }}>
          {/* OOD Threshold Line */}
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: `${(3.2 / 5.0) * 100}%`,
            borderBottom: '1px dashed #ef4444',
            pointerEvents: 'none',
            zIndex: 1
          }}>
            <span style={{ position: 'absolute', right: 4, bottom: 2, fontSize: 10, color: '#f87171', background: 'var(--bg-card)', padding: '0 4px' }}>
              OOD Novelty Threshold (3.2σ)
            </span>
          </div>

          {evaluationTimeline.map(ev => {
            const heightPct = Math.min(100, Math.max(10, (ev.mahalanobisDistance / 5.0) * 100));
            const barColor = ev.mahalanobisDistance > 3.2 ? '#ef4444' : (ev.mahalanobisDistance > 2.2 ? '#f59e0b' : '#3b82f6');

            return (
              <div key={ev.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', zIndex: 2 }}>
                <div 
                  style={{
                    width: '100%',
                    maxWidth: 24,
                    height: `${heightPct}%`,
                    background: barColor,
                    borderRadius: '2px 2px 0 0',
                    transition: 'height 0.2s ease'
                  }}
                  title={`Day ${ev.day}: Distance ${ev.mahalanobisDistance}σ, Novelty ${ev.noveltyScorePct}%`}
                />
                <span style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                  D{ev.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Online Learning Rate Tuning (Demonstrates live continuous updating) */}
      <div className="space-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sliders size={14} style={{ color: '#38bdf8' }} /> Online Learning Rate (Forgetting Factor α)
            </h4>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Controls how fast the model adapts its belief to non-stationary microgravity biometrics.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input 
              type="range" 
              min="0.02" 
              max="0.25" 
              step="0.01"
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              style={{ width: 140, accentColor: '#a855f7' }}
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#c084fc', width: 45 }}>
              {learningRate.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
