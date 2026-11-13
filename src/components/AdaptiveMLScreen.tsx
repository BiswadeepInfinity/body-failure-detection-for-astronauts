import React, { useState } from 'react';
import { Astronaut } from '../types';
import { DeepSpaceAdaptiveMLEngine, AnomalyScoreResult, TERRESTRIAL_PRIORS } from '../ml/adaptiveEngine';
import { PlainEnglishInterpreter } from './PlainEnglishInterpreter';
import { 
  BrainCircuit, 
  Cpu, 
  Sparkles, 
  Sliders, 
  Compass,
  CheckCircle2,
  ArrowRight,
  Play,
  RotateCcw,
  Calendar
} from 'lucide-react';

interface Props {
  astronauts: Astronaut[];
}

export const AdaptiveMLScreen: React.FC<Props> = ({ astronauts }) => {
  const [selectedAstroId, setSelectedAstroId] = useState<string>('ast-01');
  const [learningRate, setLearningRate] = useState<number>(0.08);
  const [currentDayScrub, setCurrentDayScrub] = useState<number>(30); // Interactive day scrubber
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const astronaut = astronauts.find(a => a.id === selectedAstroId) || astronauts[0];

  // Run the Adaptive Online Learning simulation up to the scrubbed flight day
  const mlEngine = new DeepSpaceAdaptiveMLEngine(TERRESTRIAL_PRIORS, learningRate);
  const evaluationTimeline: AnomalyScoreResult[] = [];
  const learnedHistoryMeans: { day: number; sleep: number; hr: number; stress: number }[] = [];

  const historySubset = astronaut.history.slice(0, currentDayScrub);

  historySubset.forEach(dayReading => {
    // 1. Evaluate reading against current state of the adaptive manifold
    const evalResult = mlEngine.evaluateReading(dayReading);
    evaluationTimeline.push(evalResult);

    // 2. Perform online learning step (updates weights, covariance, means)
    mlEngine.stepOnlineLearning(dayReading);

    const p = mlEngine.getModelParameters();
    learnedHistoryMeans.push({
      day: dayReading.day,
      sleep: Number(p.meanVector.sleepHours.toFixed(1)),
      hr: Math.round(p.meanVector.restingHeartRate),
      stress: Math.round(p.meanVector.stressLevel)
    });
  });

  const latestEvaluation = evaluationTimeline[evaluationTimeline.length - 1] || mlEngine.evaluateReading(astronaut.history[0]);
  const adaptiveParams = mlEngine.getModelParameters();

  // Mathematical prior vs astronaut weight calculation
  const earthInfluencePct = Math.round(Math.pow(1 - learningRate, currentDayScrub) * 100);
  const astronautLearnedWeightPct = 100 - earthInfluencePct;

  // Handle auto-playback simulation
  React.useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentDayScrub(prev => {
          if (prev >= 30) {
            setIsPlaying(false);
            return 30;
          }
          return prev + 1;
        });
      }, 600);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '4px 8px', borderRadius: 4, color: '#c084fc', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>
            <BrainCircuit size={13} /> Live Machine Learning Inspection Console
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff' }}>
            Interactive $N=1$ Manifold Learning & Novelty Discovery
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Watch the AI continuously learn this astronaut's unique space physiology day-by-day.
          </p>
        </div>

        {/* Astronaut Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Astronaut Subject:</span>
          <select 
            value={selectedAstroId} 
            onChange={(e) => {
              setSelectedAstroId(e.target.value);
              setCurrentDayScrub(30);
              setIsPlaying(false);
            }}
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

      {/* Plain-English Medical Interpreter Bar */}
      <PlainEnglishInterpreter />

      {/* NEW: LIVE LEARNING INSPECTION PANEL */}
      <div className="space-card" style={{ 
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        borderColor: '#a855f7',
        marginBottom: 24,
        padding: 20
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#c084fc', fontWeight: 700, letterSpacing: 0.5 }}>
              Step-by-Step Training Timeline
            </span>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', margin: '4px 0' }}>
              Simulated Mission Progress: Flight Day {currentDayScrub} of 30
            </h3>
          </div>

          {/* Play/Pause Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button 
              className="btn-primary"
              onClick={() => setIsPlaying(!isPlaying)}
              style={{ background: isPlaying ? '#ef4444' : '#a855f7', color: '#fff', padding: '6px 14px', fontSize: 12, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Play size={13} fill="#fff" />
              {isPlaying ? 'Pause Simulation' : (currentDayScrub === 30 ? 'Replay Learning' : 'Play Live Learning')}
            </button>
            <button 
              className="btn-secondary"
              onClick={() => {
                setCurrentDayScrub(1);
                setIsPlaying(false);
              }}
              title="Reset to Day 1"
              style={{ padding: '6px 10px', borderRadius: 6 }}
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {/* Interactive Mission Day Scrubber & Calendar Quick-Select */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
            <span>Day 1 (Launch: 100% Earth Priors)</span>
            <span style={{ color: '#c084fc', fontWeight: 700 }}>Active Training State: Flight Day {currentDayScrub}</span>
            <span>Day 30 (92% Astronaut Custom Manifold)</span>
          </div>
          <input 
            type="range"
            min="1"
            max="30"
            value={currentDayScrub}
            onChange={(e) => {
              setCurrentDayScrub(parseInt(e.target.value));
              setIsPlaying(false);
            }}
            style={{ width: '100%', accentColor: '#a855f7', height: 8 }}
          />

          {/* Mini Mission Calendar Day Selector Grid */}
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Calendar size={12} style={{ color: '#c084fc' }} /> Jump directly to any mission date on the adaptive calendar:
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                Green = Nominal | Red = Anomaly Detected | Purple = Active Day
              </span>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(15, 1fr)', 
              gap: 4, 
              background: 'rgba(0,0,0,0.3)', 
              padding: 8, 
              borderRadius: 6,
              border: '1px solid var(--border-subtle)'
            }}>
              {astronaut.history.slice(0, 30).map((h) => {
                const isSelected = h.day === currentDayScrub;
                const hasAnomaly = h.sleepHours < 5.0 || h.restingHeartRate > 75 || h.stressLevel > 70;
                return (
                  <button
                    key={h.day}
                    onClick={() => {
                      setCurrentDayScrub(h.day);
                      setIsPlaying(false);
                    }}
                    style={{
                      background: isSelected 
                        ? '#a855f7' 
                        : (hasAnomaly ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.04)'),
                      border: isSelected 
                        ? '1px solid #ffffff' 
                        : (hasAnomaly ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)'),
                      borderRadius: 4,
                      padding: '4px 2px',
                      color: isSelected ? '#ffffff' : (hasAnomaly ? '#fca5a5' : '#cbd5e1'),
                      fontSize: 10,
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease'
                    }}
                    title={`Day ${h.day}: Sleep ${h.sleepHours}h, HR ${h.restingHeartRate}bpm, Stress ${h.stressLevel}`}
                  >
                    D{h.day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Weight Ratio: Earth Priors vs Astronaut Flight Data */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '14px', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
            <span>
              <strong>Where does the AI get its beliefs right now?</strong>
            </span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: '#38bdf8' }}>{earthInfluencePct}% Earth Clinical Prior</span> · <span style={{ color: '#a855f7' }}>{astronautLearnedWeightPct}% {astronaut.name}'s Telemetry</span>
            </span>
          </div>

          <div style={{ height: 10, width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: 5, overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${earthInfluencePct}%`, background: '#38bdf8', transition: 'width 0.2s ease' }} title={`Earth Priors: ${earthInfluencePct}%`} />
            <div style={{ width: `${astronautLearnedWeightPct}%`, background: '#a855f7', transition: 'width 0.2s ease' }} title={`Astronaut Learned: ${astronautLearnedWeightPct}%`} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
            <span>Initial Terrestrial Ground State (MMASH / WESAD)</span>
            <span>Formula: (1 - α)^t = (0.92)^{currentDayScrub}</span>
            <span>Adapted Microgravity Space Profile</span>
          </div>
        </div>

        {/* Comparison: Earth Norm vs Learned Model Baseline vs Today's Actual Value */}
        <div className="grid-3" style={{ gap: 12 }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '12px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Resting Heart Rate</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 }}>
              <span style={{ fontSize: 11, color: '#38bdf8' }}>Earth: {TERRESTRIAL_PRIORS.restingHeartRate} bpm</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#c084fc' }}>Learned: {Math.round(adaptiveParams.meanVector.restingHeartRate)} bpm</span>
            </div>
            <div style={{ fontSize: 11, color: '#ffffff', marginTop: 4, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 4 }}>
              Today Actual: <strong>{historySubset[historySubset.length - 1]?.restingHeartRate} bpm</strong>
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '12px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sleep Duration</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 }}>
              <span style={{ fontSize: 11, color: '#38bdf8' }}>Earth: {TERRESTRIAL_PRIORS.sleepHours} hrs</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#c084fc' }}>Learned: {adaptiveParams.meanVector.sleepHours.toFixed(1)} hrs</span>
            </div>
            <div style={{ fontSize: 11, color: '#ffffff', marginTop: 4, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 4 }}>
              Today Actual: <strong>{historySubset[historySubset.length - 1]?.sleepHours} hrs</strong>
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '12px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Autonomic Stress Index</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 }}>
              <span style={{ fontSize: 11, color: '#38bdf8' }}>Earth: {TERRESTRIAL_PRIORS.stressLevel}</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#c084fc' }}>Learned: {Math.round(adaptiveParams.meanVector.stressLevel)}</span>
            </div>
            <div style={{ fontSize: 11, color: '#ffffff', marginTop: 4, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 4 }}>
              Today Actual: <strong>{historySubset[historySubset.length - 1]?.stressLevel}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 ML Diagnostic Cards */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {/* Card 1: Multi-variate Mahalanobis Distance */}
        <div className="space-card" style={{ borderColor: latestEvaluation.isNovelCondition ? '#ef4444' : '#3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Compass size={14} style={{ color: '#38bdf8' }} /> True Mahalanobis Distance (D_M)
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
            Full covariance: [Sleep ↔ Latency ↔ HR ↔ Stress ↔ Mood] co-movement tracking.
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
            Chi-sq (dof=5) distribution test: Evaluates if bodily pattern has occurred in mission history.
          </div>
        </div>

        {/* Card 3: Model Certainty & N=1 Learning Factor */}
        <div className="space-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <BrainCircuit size={14} style={{ color: '#10b981' }} /> Model Epistemic Confidence
            </span>
            <span style={{ fontSize: 11, color: '#10b981' }}>
              Observed: {currentDayScrub} Flight Days
            </span>
          </div>
          <div className="metric-val" style={{ color: '#10b981' }}>
            {latestEvaluation.modelConfidenceScore}%
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
            Normal-Inverse-Gamma conjugate posterior certainty tightens with flight duration.
          </div>
        </div>
      </div>

      {/* Probabilistic Naive Bayes Hypothesis Ranking Section */}
      <div className="space-card" style={{ 
        background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.25) 0%, rgba(15, 23, 42, 0.8) 100%)',
        borderColor: '#a855f7',
        marginBottom: 24,
        padding: 20
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sparkles size={20} style={{ color: '#c084fc' }} />
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>
                Probabilistic Space Medicine Hypothesis Ranker (Naive Bayes)
              </h3>
              <p style={{ fontSize: 11, color: '#e9d5ff' }}>
                Posterior probability P(Etiology | Telemetry Z-Scores) conditioned on spaceflight clinical priors.
              </p>
            </div>
          </div>
          <span style={{ fontSize: 11, background: 'rgba(168, 85, 247, 0.2)', color: '#e9d5ff', padding: '4px 10px', borderRadius: 4, fontWeight: 600 }}>
            Active Deep Space Reasoning
          </span>
        </div>

        {latestEvaluation.rankedHypotheses.length === 0 ? (
          <div style={{ fontSize: 13, color: '#cbd5e1', padding: '14px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={16} style={{ color: '#10b981' }} />
            Astronaut physiological manifold is nominal on Day {currentDayScrub} ($D_M &lt; 2.8\sigma$). No Out-of-Distribution condition detected requiring differential diagnosis.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {latestEvaluation.rankedHypotheses.map((hyp, idx) => (
              <div 
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: `1px solid ${idx === 0 ? '#a855f7' : 'rgba(168, 85, 247, 0.3)'}`,
                  borderRadius: 8,
                  padding: '14px 16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 10,
                      fontWeight: 700,
                      background: idx === 0 ? '#a855f7' : 'rgba(168, 85, 247, 0.3)',
                      color: '#ffffff'
                    }}>
                      RANK #{idx + 1}
                    </span>
                    <strong style={{ fontSize: 14, color: '#ffffff' }}>{hyp.title}</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#c084fc', fontFamily: 'var(--font-mono)' }}>
                      {hyp.probabilityPct}%
                    </span>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>Posterior Prob</div>
                  </div>
                </div>

                <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.4, margin: '6px 0' }}>
                  <strong>Diagnostic Evidence:</strong> {hyp.evidence}
                </div>

                <div style={{ fontSize: 11, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '6px 10px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                  <ArrowRight size={12} />
                  <span><strong>Flight Surgeon Action:</strong> {hyp.recommendedAction}</span>
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
              Adaptive Novelty & Anomaly Trajectory ($D_M$) up to Day {currentDayScrub}
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Tracking multi-variate deviation from dynamically updating personalized baseline ($N=1$ manifold).
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

        {/* Timeline Chart with Y-Axis Scale Markers */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', paddingBottom: 24, textAlign: 'right', width: 40 }}>
            <span>5.0σ</span>
            <span style={{ color: '#f87171' }}>3.2σ</span>
            <span style={{ color: '#fcd34d' }}>2.5σ</span>
            <span>1.0σ</span>
            <span>0.0σ</span>
          </div>

          <div style={{ flex: 1, height: 170, display: 'flex', alignItems: 'flex-end', gap: 4, paddingBottom: 24, position: 'relative', borderBottom: '1px solid var(--border-subtle)', borderLeft: '1px solid var(--border-subtle)', paddingLeft: 6 }}>
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
                OOD Threshold (3.2σ)
              </span>
            </div>

            <div style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: `${(2.5 / 5.0) * 100}%`,
              borderBottom: '1px dashed rgba(245, 158, 11, 0.4)',
              pointerEvents: 'none',
              zIndex: 1
            }} />

            {evaluationTimeline.map(ev => {
              const heightPct = Math.min(100, Math.max(8, (ev.mahalanobisDistance / 5.0) * 100));
              const barColor = ev.mahalanobisDistance > 3.2 ? '#ef4444' : (ev.mahalanobisDistance > 2.5 ? '#f59e0b' : '#3b82f6');

              return (
                <div key={ev.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', zIndex: 2 }}>
                  <div 
                    style={{
                      width: '100%',
                      maxWidth: 22,
                      height: `${heightPct}%`,
                      background: barColor,
                      borderRadius: '2px 2px 0 0',
                      transition: 'height 0.2s ease'
                    }}
                    title={`Day ${ev.day}: Distance ${ev.mahalanobisDistance}σ, Novelty ${ev.noveltyScorePct}%`}
                  />
                  <span style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                    {ev.day % 5 === 0 || ev.day === 1 || ev.day === currentDayScrub ? `D${ev.day}` : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Online Learning Rate Tuning */}
      <div className="space-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sliders size={14} style={{ color: '#38bdf8' }} /> Online Forgetting Factor (Learning Rate $\alpha$)
            </h4>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Controls adaptive rate of personal covariance manifold: higher $\alpha$ adapts faster to microgravity shifts.
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
