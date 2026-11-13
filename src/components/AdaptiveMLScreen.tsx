import React, { useState } from 'react';
import { Astronaut } from '../types';
import { DeepSpaceAdaptiveMLEngine, AnomalyScoreResult, TERRESTRIAL_PRIORS } from '../ml/adaptiveEngine';
import { PlainEnglishInterpreter } from './PlainEnglishInterpreter';
import { 
  BrainCircuit, 
  Cpu, 
  Sparkles, 
  Compass,
  CheckCircle2,
  ArrowRight,
  Play,
  RotateCcw,
  Calendar,
  LineChart,
  BookOpen
} from 'lucide-react';

interface Props {
  astronauts: Astronaut[];
}

type ViewSection = 'live_timeline' | 'medical_hypotheses' | 'glossary_interpreter';

export const AdaptiveMLScreen: React.FC<Props> = ({ astronauts }) => {
  const [selectedAstroId, setSelectedAstroId] = useState<string>('ast-01');
  const learningRate = 0.08;
  const [currentDayScrub, setCurrentDayScrub] = useState<number>(30); // Interactive day scrubber
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeViewSection, setActiveViewSection] = useState<ViewSection>('live_timeline');

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

  // Handle Replay / Play / Pause click
  const handleTogglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      // If already at Day 30, reset to Day 1 so the replay actually runs from the beginning!
      if (currentDayScrub >= 30) {
        setCurrentDayScrub(1);
      }
      setIsPlaying(true);
    }
  };

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
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Header with Astronaut Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', padding: '5px 12px', borderRadius: 999, color: '#f8fafc', fontSize: 12, fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase', marginBottom: 6 }}>
            <BrainCircuit size={14} /> Adaptive Intelligence Console
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.3px' }}>
            N=1 Adaptive Machine Learning & Novelty Discovery
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14.5 }}>
            Continuous online covariance learning tracking {astronaut.name}'s personalized microgravity adaptation.
          </p>
        </div>

        {/* Astronaut Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>Astronaut Subject:</span>
          <select 
            value={selectedAstroId} 
            onChange={(e) => {
              setSelectedAstroId(e.target.value);
              setCurrentDayScrub(30);
              setIsPlaying(false);
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              color: '#ffffff',
              border: '1px solid var(--border-glass)',
              borderRadius: 12,
              padding: '8px 16px',
              fontSize: 14
            }}
          >
            {astronauts.map(a => (
              <option key={a.id} value={a.id} style={{ background: '#090c12', color: '#fff' }}>{a.name} ({a.role})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Clean Mode Switcher Tabs - Prevents information overload by showing one section at a time */}
      <div style={{
        display: 'flex',
        gap: 12,
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: 4
      }}>
        <button
          onClick={() => setActiveViewSection('live_timeline')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeViewSection === 'live_timeline' ? '2.5px solid #ffffff' : '2.5px solid transparent',
            color: activeViewSection === 'live_timeline' ? '#ffffff' : 'var(--text-secondary)',
            padding: '12px 6px',
            fontSize: 15,
            fontWeight: activeViewSection === 'live_timeline' ? 700 : 400,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.15s ease'
          }}
        >
          <LineChart size={16} />
          <span>1. Adaptive Learning Timeline & Metrics</span>
        </button>

        <button
          onClick={() => setActiveViewSection('medical_hypotheses')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeViewSection === 'medical_hypotheses' ? '2.5px solid #ffffff' : '2.5px solid transparent',
            color: activeViewSection === 'medical_hypotheses' ? '#ffffff' : 'var(--text-secondary)',
            padding: '12px 6px',
            fontSize: 15,
            fontWeight: activeViewSection === 'medical_hypotheses' ? 700 : 400,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.15s ease'
          }}
        >
          <Sparkles size={16} />
          <span>2. Differential Medical Diagnosis ({latestEvaluation.rankedHypotheses.length > 0 ? `${latestEvaluation.rankedHypotheses.length} Detected` : 'Nominal'})</span>
        </button>

        <button
          onClick={() => setActiveViewSection('glossary_interpreter')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeViewSection === 'glossary_interpreter' ? '2.5px solid #ffffff' : '2.5px solid transparent',
            color: activeViewSection === 'glossary_interpreter' ? '#ffffff' : 'var(--text-secondary)',
            padding: '12px 6px',
            fontSize: 15,
            fontWeight: activeViewSection === 'glossary_interpreter' ? 700 : 400,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.15s ease'
          }}
        >
          <BookOpen size={16} />
          <span>3. Plain-English Flight Surgeon Guide</span>
        </button>
      </div>

      {/* SECTION 1: LIVE TIMELINE, METRICS & DAY SCRUBBER */}
      {activeViewSection === 'live_timeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Top 3 Core Metrics Overview Cards */}
          <div className="grid-3">
            <div className="space-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Compass size={15} /> Multi-Organ Deviation Index (D_M)
                </span>
                <span style={{
                  fontSize: 11.5,
                  padding: '3px 12px',
                  borderRadius: 999,
                  background: latestEvaluation.isNovelCondition ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: latestEvaluation.isNovelCondition ? '#fca5a5' : '#6ee7b7',
                  border: '1px solid var(--border-glass)'
                }}>
                  {latestEvaluation.isNovelCondition ? 'Out-Of-Distribution' : 'Nominal Space Baseline'}
                </span>
              </div>
              <div className="metric-val" style={{ color: latestEvaluation.isNovelCondition ? '#f87171' : '#ffffff' }}>
                {latestEvaluation.mahalanobisDistance} <span style={{ fontSize: 16, fontWeight: 400 }}>σ</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>
                Tracks whether heart rate, sleep, and stress are decoupling simultaneously.
              </div>
            </div>

            <div className="space-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Cpu size={15} /> Novelty Discovery Score
                </span>
                <span style={{ fontSize: 13, color: '#ffffff', fontWeight: 600 }}>
                  {latestEvaluation.noveltyScorePct}%
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0' }}>
                <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{
                    width: `${latestEvaluation.noveltyScorePct}%`,
                    height: '100%',
                    background: latestEvaluation.noveltyScorePct > 65 ? '#ef4444' : (latestEvaluation.noveltyScorePct > 35 ? '#f59e0b' : '#10b981')
                  }} />
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Evaluates whether this combined bodily pattern has ever occurred before in mission history.
              </div>
            </div>

            <div className="space-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <BrainCircuit size={15} /> Model Epistemic Confidence
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  Observed: {currentDayScrub} Flight Days
                </span>
              </div>
              <div className="metric-val" style={{ color: '#ffffff' }}>
                {latestEvaluation.modelConfidenceScore}%
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>
                Mathematical certainty tightens continuously as more space flight days accumulate.
              </div>
            </div>
          </div>

          {/* Interactive Mission Day Timeline Scrubber */}
          <div className="space-card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.6px' }}>
                  Mission Timeline Scrubber
                </span>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', margin: '4px 0' }}>
                  Flight Day {currentDayScrub} of 30
                </h3>
              </div>

              {/* Play / Pause simulation */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button 
                  className="btn-primary"
                  onClick={handleTogglePlayback}
                  style={{ background: isPlaying ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.15)', color: '#fff' }}
                >
                  <Play size={14} fill="#fff" />
                  {isPlaying ? 'Pause Timeline' : (currentDayScrub === 30 ? 'Replay Learning' : 'Play Live Learning')}
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setCurrentDayScrub(1);
                    setIsPlaying(false);
                  }}
                  title="Reset to Day 1"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            {/* Slider */}
            <div style={{ marginBottom: 20 }}>
              <input 
                type="range"
                min="1"
                max="30"
                value={currentDayScrub}
                onChange={(e) => {
                  setCurrentDayScrub(parseInt(e.target.value));
                  setIsPlaying(false);
                }}
                style={{ width: '100%', accentColor: '#ffffff', height: 8 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                <span>Day 1 (100% Earth Clinical Priors)</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>Active Scrub Position: Day {currentDayScrub}</span>
                <span>Day 30 (92% Astronaut Custom Space Profile)</span>
              </div>
            </div>

            {/* Mini Calendar Quick-Select Strip */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={14} /> Jump Directly to Any Flight Date:
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Red = Telemetry Strain Alert | White = Active
                </span>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(15, 1fr)', 
                gap: 6, 
                background: 'rgba(0, 0, 0, 0.3)', 
                padding: 10, 
                borderRadius: 14,
                border: '1px solid rgba(255, 255, 255, 0.06)'
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
                          ? '#ffffff' 
                          : (hasAnomaly ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.02)'),
                        border: isSelected 
                          ? '1px solid #ffffff' 
                          : (hasAnomaly ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)'),
                        borderRadius: 8,
                        padding: '6px 2px',
                        color: isSelected ? '#000000' : (hasAnomaly ? '#fca5a5' : 'var(--text-secondary)'),
                        fontSize: 12,
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

          {/* 30-Day Mahalanobis Anomaly Trajectory Chart */}
          <div className="space-card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff' }}>
                  Multi-Variate Anomaly Trajectory ($D_M$) up to Day {currentDayScrub}
                </h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Tracking multi-variate deviation from dynamically updating personalized baseline ($N=1$ manifold).
                </p>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
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
            <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', paddingBottom: 24, textAlign: 'right', width: 45 }}>
                <span>5.0σ</span>
                <span style={{ color: '#f87171' }}>3.2σ</span>
                <span style={{ color: '#fcd34d' }}>2.5σ</span>
                <span>1.0σ</span>
                <span>0.0σ</span>
              </div>

              <div style={{ flex: 1, height: 180, display: 'flex', alignItems: 'flex-end', gap: 5, paddingBottom: 24, position: 'relative', borderBottom: '1px solid var(--border-subtle)', borderLeft: '1px solid var(--border-subtle)', paddingLeft: 6 }}>
                <div style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: `${(3.2 / 5.0) * 100}%`,
                  borderBottom: '1px dashed #ef4444',
                  pointerEvents: 'none',
                  zIndex: 1
                }}>
                  <span style={{ position: 'absolute', right: 4, bottom: 2, fontSize: 11, color: '#f87171', background: 'var(--bg-card)', padding: '0 6px', borderRadius: 4 }}>
                    OOD Anomaly Threshold (3.2σ)
                  </span>
                </div>

                {evaluationTimeline.map(ev => {
                  const heightPct = Math.min(100, Math.max(8, (ev.mahalanobisDistance / 5.0) * 100));
                  const barColor = ev.mahalanobisDistance > 3.2 ? '#ef4444' : (ev.mahalanobisDistance > 2.5 ? '#f59e0b' : 'rgba(255, 255, 255, 0.4)');

                  return (
                    <div key={ev.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', zIndex: 2 }}>
                      <div 
                        style={{
                          width: '100%',
                          maxWidth: 24,
                          height: `${heightPct}%`,
                          background: barColor,
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.2s ease'
                        }}
                        title={`Day ${ev.day}: Distance ${ev.mahalanobisDistance}σ, Novelty ${ev.noveltyScorePct}%`}
                      />
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                        {ev.day % 5 === 0 || ev.day === 1 || ev.day === currentDayScrub ? `D${ev.day}` : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: DIFFERENTIAL MEDICAL DIAGNOSES (NAIVE BAYES) */}
      {activeViewSection === 'medical_hypotheses' && (
        <div className="space-card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Sparkles size={22} style={{ color: '#ffffff' }} />
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff' }}>
                  Probabilistic Clinical Differential Diagnoses
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                  Evaluates posterior probabilities P(Condition | Telemetry Z-Scores) conditioned on spaceflight clinical priors.
                </p>
              </div>
            </div>
            <span style={{ fontSize: 12, background: 'rgba(255, 255, 255, 0.08)', border: '1px solid var(--border-glass)', color: '#ffffff', padding: '5px 14px', borderRadius: 999, fontWeight: 600 }}>
              Flight Day {currentDayScrub} Assessment
            </span>
          </div>

          {latestEvaluation.rankedHypotheses.length === 0 ? (
            <div style={{ fontSize: 14.5, color: '#cbd5e1', padding: '24px', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--border-glass)', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <CheckCircle2 size={22} style={{ color: '#10b981', flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#ffffff' }}>Nominal Physiological Adaptation:</strong> Astronaut vitals remain within healthy microgravity thresholds ($D_M &lt; 2.8\sigma$). No out-of-distribution bodily failure detected requiring differential intervention.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {latestEvaluation.rankedHypotheses.map((hyp, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: 16,
                    padding: '20px 24px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                        background: idx === 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                        color: idx === 0 ? '#fca5a5' : '#cbd5e1',
                        border: '1px solid var(--border-glass)'
                      }}>
                        RANK #{idx + 1}
                      </span>
                      <strong style={{ fontSize: 17, color: '#ffffff' }}>{hyp.title}</strong>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                        {hyp.probabilityPct}%
                      </span>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Posterior Prob</div>
                    </div>
                  </div>

                  <div style={{ fontSize: 14.5, color: '#cbd5e1', lineHeight: 1.6, margin: '10px 0' }}>
                    <strong>Diagnostic Evidence:</strong> {hyp.evidence}
                  </div>

                  <div style={{ fontSize: 13.5, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '10px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                    <ArrowRight size={16} />
                    <span><strong>Flight Surgeon Action:</strong> {hyp.recommendedAction}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: PLAIN-ENGLISH FLIGHT SURGEON GUIDE & REFERENCE */}
      {activeViewSection === 'glossary_interpreter' && (
        <PlainEnglishInterpreter 
          liveBiometrics={{
            sleepHours: historySubset[historySubset.length - 1]?.sleepHours,
            restingHeartRate: historySubset[historySubset.length - 1]?.restingHeartRate,
            stressLevel: historySubset[historySubset.length - 1]?.stressLevel,
            mahalanobisDist: latestEvaluation?.mahalanobisDistance,
            flightDay: currentDayScrub,
            topHypothesis: latestEvaluation?.rankedHypotheses?.[0]?.title,
            astronautName: astronaut.name
          }}
        />
      )}
    </div>
  );
};
