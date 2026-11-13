import React, { useState, useEffect } from 'react';
import { Astronaut, DailyBiometrics } from '../types';
import { DeepSpaceAdaptiveMLEngine, TERRESTRIAL_PRIORS, MLStateVector } from '../ml/adaptiveEngine';
import { 
  Play, 
  RotateCcw, 
  Binary, 
  Layers, 
  Zap, 
  Send,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Calendar
} from 'lucide-react';
import { PlainEnglishInterpreter } from './PlainEnglishInterpreter';

interface Props {
  astronauts: Astronaut[];
}

export const MLModelDebugger: React.FC<Props> = ({ astronauts }) => {
  const [selectedAstroId, setSelectedAstroId] = useState<string>('ast-01');
  const [dayStep, setDayStep] = useState<number>(28);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const learningRate = 0.08;

  // Custom Live Telemetry Injection State
  const [customInput, setCustomInput] = useState<MLStateVector>({
    sleepHours: 4.2,
    sleepLatencyMin: 18,
    restingHeartRate: 54,
    stressLevel: 52,
    moodScore: 5.0
  });
  const [customMedications, setCustomMedications] = useState<string>('Zolpidem 10mg, Promethazine 25mg');
  const [injectionResults, setInjectionResults] = useState<any>(null);

  const astronaut = astronauts.find(a => a.id === selectedAstroId) || astronauts[0];

  // Re-run the engine up to the step
  const mlEngine = new DeepSpaceAdaptiveMLEngine(TERRESTRIAL_PRIORS, learningRate);
  
  for (let i = 0; i < dayStep; i++) {
    const reading = astronaut.history[i];
    if (reading) {
      mlEngine.stepOnlineLearning(reading);
    }
  }

  const currentReading = astronaut.history[dayStep - 1] || astronaut.history[0];
  const evalResult = mlEngine.evaluateReading(currentReading);
  const params = mlEngine.getModelParameters();

  // Playback timer
  useEffect(() => {
    let t: any = null;
    if (isPlaying) {
      t = setInterval(() => {
        setDayStep(prev => {
          if (prev >= 30) {
            setIsPlaying(false);
            return 30;
          }
          return prev + 1;
        });
      }, 700);
    }
    return () => clearInterval(t);
  }, [isPlaying]);

  const earthInfluencePct = Math.round(Math.pow(1 - learningRate, dayStep) * 100);
  const astronautWeightPct = 100 - earthInfluencePct;

  const featureNames = [
    'Sleep Duration (hrs)',
    'Sleep Latency (mins)',
    'Resting HR (bpm)',
    'Stress Index (0-100)',
    'Mood Score (1-10)'
  ];

  // Handle Live Custom Telemetry Injection Test
  const handleTestLiveInput = () => {
    const syntheticReading: DailyBiometrics = {
      day: dayStep + 1,
      date: '2026-11-13 (LIVE INJECTION)',
      sleepHours: Number(customInput.sleepHours),
      sleepOnsetLatencyMin: Number(customInput.sleepLatencyMin),
      restingHeartRate: Number(customInput.restingHeartRate),
      stressLevel: Number(customInput.stressLevel),
      moodScore: Number(customInput.moodScore),
      medicationsTaken: customMedications.split(',').map(s => s.trim()).filter(Boolean)
    };

    const res = mlEngine.evaluateReading(syntheticReading);
    setInjectionResults({
      reading: syntheticReading,
      evaluation: res
    });
  };

  // Preset Injections for Instant Demonstration
  const loadPreset = (type: 'nominal' | 'fluid_shift' | 'dual_sedative' | 'co2_crisis') => {
    if (type === 'nominal') {
      setCustomInput({ sleepHours: 6.8, sleepLatencyMin: 18, restingHeartRate: 61, stressLevel: 30, moodScore: 8.0 });
      setCustomMedications('');
    } else if (type === 'fluid_shift') {
      setCustomInput({ sleepHours: 6.4, sleepLatencyMin: 22, restingHeartRate: 78, stressLevel: 42, moodScore: 7.2 });
      setCustomMedications('');
    } else if (type === 'dual_sedative') {
      setCustomInput({ sleepHours: 4.8, sleepLatencyMin: 12, restingHeartRate: 52, stressLevel: 55, moodScore: 4.5 });
      setCustomMedications('Zolpidem 10mg, Promethazine 25mg');
    } else if (type === 'co2_crisis') {
      setCustomInput({ sleepHours: 5.5, sleepLatencyMin: 35, restingHeartRate: 84, stressLevel: 78, moodScore: 4.0 });
      setCustomMedications('');
    }
    setInjectionResults(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '4px 8px', borderRadius: 4, color: '#38bdf8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
            <Binary size={13} /> Transparent ML Inspection & Live Verification Sandbox
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff' }}>
            Live ML Testing Sandbox & Internal State Inspector
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Prove the model works with any arbitrary data: inject live numbers or adjust sliders to verify mathematical responses instantly.
          </p>
        </div>

        {/* Subject select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Baseline Subject:</span>
          <select 
            value={selectedAstroId} 
            onChange={(e) => {
              setSelectedAstroId(e.target.value);
              setDayStep(1);
              setIsPlaying(false);
              setInjectionResults(null);
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

      {/* Plain-English Medical Interpreter Bar with Live Injected State */}
      <PlainEnglishInterpreter 
        liveBiometrics={{
          sleepHours: injectionResults ? customInput.sleepHours : currentReading?.sleepHours,
          restingHeartRate: injectionResults ? customInput.restingHeartRate : currentReading?.restingHeartRate,
          stressLevel: injectionResults ? customInput.stressLevel : currentReading?.stressLevel,
          mahalanobisDist: injectionResults ? injectionResults.evaluation.mahalanobisDistance : evalResult.mahalanobisDistance,
          flightDay: dayStep,
          topHypothesis: injectionResults ? injectionResults.evaluation.rankedHypotheses?.[0]?.title : evalResult.rankedHypotheses?.[0]?.title,
          astronautName: astronaut.name
        }}
      />

      {/* NEW: LIVE INJECTION SANDBOX (PROOF OF ALGORITHM) */}
      <div className="space-card" style={{ 
        background: 'linear-gradient(135deg, rgba(8, 47, 73, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
        borderColor: '#38bdf8',
        padding: 20
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <span style={{ fontSize: 11, textTransform: 'uppercase', color: '#38bdf8', fontWeight: 700, letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} /> Live Proof of Algorithm: Inject Unseen Numbers
            </span>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#ffffff', margin: '4px 0' }}>
              Test Real-Time Adaptation Against {astronaut.name}'s Learned Day-{dayStep} Baseline
            </h3>
            <p style={{ fontSize: 12, color: '#bae6fd' }}>
              Change the values below to anything you want. When you click <strong>"Run Real-Time AI Inference"</strong>, the model calculates the Mahalanobis Distance and Naive Bayes probabilities live in your browser.
            </p>
          </div>

          {/* Quick Presets */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 400 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', width: '100%', textAlign: 'right' }}>One-Click Test Presets:</span>
            <button 
              onClick={() => loadPreset('nominal')}
              style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#6ee7b7', padding: '3px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}
            >
              Normal Day
            </button>
            <button 
              onClick={() => loadPreset('fluid_shift')}
              style={{ background: 'rgba(56, 189, 248, 0.2)', border: '1px solid #38bdf8', color: '#7dd3fc', padding: '3px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}
            >
              Fluid Shift
            </button>
            <button 
              onClick={() => loadPreset('co2_crisis')}
              style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', color: '#fcd34d', padding: '3px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}
            >
              CO₂ Buildup
            </button>
            <button 
              onClick={() => loadPreset('dual_sedative')}
              style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '3px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}
            >
              Drug Conflict
            </button>
          </div>
        </div>

        {/* 5-Axis Manual Input Form */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, margin: '14px 0' }}>
          <div>
            <label style={{ fontSize: 11, color: '#e0f2fe', display: 'block', marginBottom: 4 }}>Sleep (Hours):</label>
            <input 
              type="number" 
              step="0.1" 
              value={customInput.sleepHours}
              onChange={(e) => setCustomInput({ ...customInput, sleepHours: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid #38bdf8', color: '#fff', padding: '6px 8px', borderRadius: 4, fontSize: 13, fontFamily: 'var(--font-mono)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, color: '#e0f2fe', display: 'block', marginBottom: 4 }}>Sleep Latency (Min):</label>
            <input 
              type="number" 
              value={customInput.sleepLatencyMin}
              onChange={(e) => setCustomInput({ ...customInput, sleepLatencyMin: parseInt(e.target.value) || 0 })}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid #38bdf8', color: '#fff', padding: '6px 8px', borderRadius: 4, fontSize: 13, fontFamily: 'var(--font-mono)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, color: '#e0f2fe', display: 'block', marginBottom: 4 }}>Resting HR (BPM):</label>
            <input 
              type="number" 
              value={customInput.restingHeartRate}
              onChange={(e) => setCustomInput({ ...customInput, restingHeartRate: parseInt(e.target.value) || 0 })}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid #38bdf8', color: '#fff', padding: '6px 8px', borderRadius: 4, fontSize: 13, fontFamily: 'var(--font-mono)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, color: '#e0f2fe', display: 'block', marginBottom: 4 }}>Stress Index (0-100):</label>
            <input 
              type="number" 
              value={customInput.stressLevel}
              onChange={(e) => setCustomInput({ ...customInput, stressLevel: parseInt(e.target.value) || 0 })}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid #38bdf8', color: '#fff', padding: '6px 8px', borderRadius: 4, fontSize: 13, fontFamily: 'var(--font-mono)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, color: '#e0f2fe', display: 'block', marginBottom: 4 }}>Mood Score (1-10):</label>
            <input 
              type="number" 
              step="0.5" 
              value={customInput.moodScore}
              onChange={(e) => setCustomInput({ ...customInput, moodScore: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid #38bdf8', color: '#fff', padding: '6px 8px', borderRadius: 4, fontSize: 13, fontFamily: 'var(--font-mono)' }}
            />
          </div>
        </div>

        {/* Medications string and Execute Button */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 11, color: '#e0f2fe', display: 'block', marginBottom: 4 }}>
              Active Medications Taken (comma-separated):
            </label>
            <input 
              type="text" 
              value={customMedications}
              onChange={(e) => setCustomMedications(e.target.value)}
              placeholder="e.g. Zolpidem 10mg, Promethazine 25mg"
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid #38bdf8', color: '#fff', padding: '6px 10px', borderRadius: 4, fontSize: 12 }}
            />
          </div>

          <button 
            className="btn-primary"
            onClick={handleTestLiveInput}
            style={{ background: '#38bdf8', color: '#000', fontWeight: 700, padding: '8px 20px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8, height: 36, marginTop: 18 }}
          >
            <Send size={14} /> Run Real-Time AI Inference
          </button>
        </div>

        {/* Live Output Card if injected */}
        {injectionResults && (
          <div style={{ marginTop: 16, background: 'rgba(15, 23, 42, 0.9)', border: `1px solid ${injectionResults.evaluation.isNovelCondition ? '#ef4444' : '#10b981'}`, borderRadius: 8, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
                {injectionResults.evaluation.isNovelCondition ? (
                  <AlertTriangle size={16} style={{ color: '#ef4444' }} />
                ) : (
                  <CheckCircle2 size={16} style={{ color: '#10b981' }} />
                )}
                Inference Result: {injectionResults.evaluation.isNovelCondition ? 'OUT-OF-DISTRIBUTION ANOMALY' : 'NOMINAL RECOGNIZED PATTERN'}
              </span>

              <span style={{ fontSize: 14, fontWeight: 800, color: injectionResults.evaluation.isNovelCondition ? '#ef4444' : '#10b981', fontFamily: 'var(--font-mono)' }}>
                Mahalanobis Distance: {injectionResults.evaluation.mahalanobisDistance}σ
              </span>
            </div>

            <div style={{ fontSize: 12, color: '#e0f2fe', marginBottom: 8 }}>
              <strong>Z-Score Divergences vs Day-{dayStep} Baseline:</strong> {injectionResults.evaluation.contributingBiometrics.map((b: any) => `${b.feature} (${b.zScore > 0 ? '+' : ''}${b.zScore}σ)`).join(', ')}
            </div>

            {injectionResults.evaluation.rankedHypotheses.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, borderTop: '1px solid var(--border-subtle)', paddingTop: 8 }}>
                <span style={{ fontSize: 11, color: '#c084fc', fontWeight: 700, textTransform: 'uppercase' }}>
                  Naive Bayes Clinical Diagnosis for Injected Numbers:
                </span>
                {injectionResults.evaluation.rankedHypotheses.map((h: any, i: number) => (
                  <div key={h.title} style={{ fontSize: 12, color: '#ffffff', background: 'rgba(255,255,255,0.05)', padding: '6px 10px', borderRadius: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <span><strong>#{i+1} {h.title}</strong> — {h.evidence}</span>
                    <span style={{ color: '#c084fc', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{h.probabilityPct}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: '#6ee7b7' }}>
                Your custom numbers fall within {astronaut.name}'s normal covariance envelope ($D_M &lt; 2.5\sigma$). No clinical warning triggered.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control Bar: Day Stepper */}
      <div className="space-card" style={{ background: 'rgba(15, 23, 42, 0.8)', borderColor: '#38bdf8', padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button 
              className="btn-primary"
              onClick={() => setIsPlaying(!isPlaying)}
              style={{ background: isPlaying ? '#ef4444' : '#38bdf8', color: '#000', padding: '6px 14px', fontSize: 12, fontWeight: 700, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Play size={13} fill="#000" />
              {isPlaying ? 'Pause' : (dayStep === 30 ? 'Replay' : 'Run Simulation')}
            </button>
            <button 
              className="btn-secondary"
              onClick={() => {
                setDayStep(1);
                setIsPlaying(false);
                setInjectionResults(null);
              }}
              title="Reset to Day 1"
              style={{ padding: '6px 10px', borderRadius: 6 }}
            >
              <RotateCcw size={13} />
            </button>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginLeft: 10 }}>
              Flight Day <span style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{dayStep}</span> of 30
            </span>
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Status on Day {dayStep}: <strong style={{ color: evalResult.isNovelCondition ? '#ef4444' : '#10b981' }}>{evalResult.isNovelCondition ? 'OUT-OF-DISTRIBUTION ANOMALY' : 'NOMINAL MANIFOLD'}</strong>
          </div>
        </div>

        <input 
          type="range"
          min="1"
          max="30"
          value={dayStep}
          onChange={(e) => {
            setDayStep(parseInt(e.target.value));
            setIsPlaying(false);
            setInjectionResults(null);
          }}
          style={{ width: '100%', accentColor: '#38bdf8', height: 8 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
          <span>Day 1 (100% Earth Prior)</span>
          <span>Day 15 (Mid-Mission Adaptive Shift)</span>
          <span>Day 30 (92% Astronaut Custom Model)</span>
        </div>

        {/* Calendar Quick-Select Grid */}
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: '#e0f2fe', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Calendar size={12} style={{ color: '#38bdf8' }} /> Jump directly to any mission date on the debugger calendar:
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              Blue = Active Day | Red = Anomaly Logged
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
              const isSelected = h.day === dayStep;
              const hasAnomaly = h.sleepHours < 5.0 || h.restingHeartRate > 75 || h.stressLevel > 70;
              return (
                <button
                  key={h.day}
                  onClick={() => {
                    setDayStep(h.day);
                    setIsPlaying(false);
                    setInjectionResults(null);
                  }}
                  style={{
                    background: isSelected 
                      ? '#38bdf8' 
                      : (hasAnomaly ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.04)'),
                    border: isSelected 
                      ? '1px solid #ffffff' 
                      : (hasAnomaly ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)'),
                    borderRadius: 4,
                    padding: '4px 2px',
                    color: isSelected ? '#000000' : (hasAnomaly ? '#fca5a5' : '#cbd5e1'),
                    fontSize: 10,
                    fontWeight: isSelected ? 800 : 500,
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

      {/* 4 Debug Pillars */}
      <div className="grid-2" style={{ gap: 20 }}>
        
        {/* Pillar 1: How the AI Weights Change */}
        <div className="space-card">
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Layers size={16} style={{ color: '#38bdf8' }} /> 1. Prior Weight Decay vs. Astronaut Data
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
            Demonstrates how Earth clinical trials are mathematically forgotten as the astronaut's space flight data accumulates.
          </p>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 6, marginBottom: 12, border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>
              Weight Decay Formula: W_earth = (1 - alpha)^t = (0.92)^{dayStep}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, margin: '6px 0' }}>
              <span style={{ color: '#38bdf8' }}>Earth Prior Weight: {earthInfluencePct}%</span>
              <span style={{ color: '#c084fc' }}>{astronaut.name}'s Weight: {astronautWeightPct}%</span>
            </div>
            <div style={{ height: 8, width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: 4, display: 'flex', overflow: 'hidden' }}>
              <div style={{ width: `${earthInfluencePct}%`, background: '#38bdf8' }} />
              <div style={{ width: `${astronautWeightPct}%`, background: '#c084fc' }} />
            </div>
          </div>

          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            <strong>NIG Epistemic Confidence:</strong> <span style={{ color: '#10b981', fontWeight: 700 }}>{evalResult.modelConfidenceScore}%</span> (Tightens as sample count increases from N=1 to N={dayStep}).
          </div>
        </div>

        {/* Pillar 2: Mean Vector Adaptation */}
        <div className="space-card">
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Zap size={16} style={{ color: '#c084fc' }} /> 2. Mean Vector Shift (Running Average)
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
            Compares Earth starting values to the updated baseline the AI has learned for {astronaut.name} by Day {dayStep}.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', fontSize: 11, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 4 }}>
              <span>Biometric Metric</span>
              <span>Earth Prior</span>
              <span>AI Learned (μ)</span>
              <span>Today Actual</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', fontSize: 12, alignItems: 'center' }}>
              <span>Sleep Duration</span>
              <span style={{ color: '#38bdf8' }}>{TERRESTRIAL_PRIORS.sleepHours}h</span>
              <span style={{ color: '#c084fc', fontWeight: 700 }}>{params.meanVector.sleepHours.toFixed(1)}h</span>
              <span style={{ color: '#ffffff' }}>{currentReading.sleepHours}h</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', fontSize: 12, alignItems: 'center' }}>
              <span>Sleep Latency</span>
              <span style={{ color: '#38bdf8' }}>{TERRESTRIAL_PRIORS.sleepLatencyMin}m</span>
              <span style={{ color: '#c084fc', fontWeight: 700 }}>{params.meanVector.sleepLatencyMin.toFixed(0)}m</span>
              <span style={{ color: '#ffffff' }}>{currentReading.sleepOnsetLatencyMin}m</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', fontSize: 12, alignItems: 'center' }}>
              <span>Resting Heart Rate</span>
              <span style={{ color: '#38bdf8' }}>{TERRESTRIAL_PRIORS.restingHeartRate} bpm</span>
              <span style={{ color: '#c084fc', fontWeight: 700 }}>{params.meanVector.restingHeartRate.toFixed(0)} bpm</span>
              <span style={{ color: '#ffffff' }}>{currentReading.restingHeartRate} bpm</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', fontSize: 12, alignItems: 'center' }}>
              <span>Stress Index</span>
              <span style={{ color: '#38bdf8' }}>{TERRESTRIAL_PRIORS.stressLevel}</span>
              <span style={{ color: '#c084fc', fontWeight: 700 }}>{params.meanVector.stressLevel.toFixed(0)}</span>
              <span style={{ color: '#ffffff' }}>{currentReading.stressLevel}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', fontSize: 12, alignItems: 'center' }}>
              <span>Mood Rating</span>
              <span style={{ color: '#38bdf8' }}>{TERRESTRIAL_PRIORS.moodScore}</span>
              <span style={{ color: '#c084fc', fontWeight: 700 }}>{params.meanVector.moodScore.toFixed(1)}</span>
              <span style={{ color: '#ffffff' }}>{currentReading.moodScore}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Pillar 3: Full 5x5 Covariance Matrix Inspection */}
      <div className="space-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Binary size={16} style={{ color: '#10b981' }} /> 3. Live 5x5 Covariance Matrix (Feature Co-movement)
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Updated online via Covariance Matrix EMA. Tracks how biometrics move together (e.g., HR and Stress).
            </p>
          </div>
          <span style={{ fontSize: 10, background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', padding: '2px 8px', borderRadius: 4 }}>
            Symmetric Positive Semi-Definite
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: 11, textAlign: 'right', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)' }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ textAlign: 'left', padding: '6px 8px' }}>Feature Axis</th>
                <th style={{ padding: '6px 8px' }}>Sleep (h)</th>
                <th style={{ padding: '6px 8px' }}>Latency (m)</th>
                <th style={{ padding: '6px 8px' }}>HR (bpm)</th>
                <th style={{ padding: '6px 8px' }}>Stress</th>
                <th style={{ padding: '6px 8px' }}>Mood</th>
              </tr>
            </thead>
            <tbody>
              {params.covarianceMatrix.map((row, rIdx) => (
                <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ textAlign: 'left', padding: '6px 8px', color: '#94a3b8', fontWeight: 600 }}>
                    {featureNames[rIdx]}
                  </td>
                  {row.map((val, cIdx) => {
                    const isDiagonal = rIdx === cIdx;
                    return (
                      <td 
                        key={cIdx} 
                        style={{ 
                          padding: '6px 8px', 
                          color: isDiagonal ? '#38bdf8' : (val > 0 ? '#6ee7b7' : (val < 0 ? '#fca5a5' : '#64748b')),
                          background: isDiagonal ? 'rgba(56, 189, 248, 0.05)' : undefined,
                          fontWeight: isDiagonal ? 700 : 400
                        }}
                      >
                        {val.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pillar 4: Mahalanobis Distance Math + Naive Bayes Output */}
      <div className="grid-2" style={{ gap: 20 }}>
        {/* Distance Breakdown */}
        <div className="space-card" style={{ borderColor: evalResult.isNovelCondition ? '#ef4444' : 'var(--border-subtle)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
            4A. Multi-Variate Mahalanobis Distance (D_M)
          </h3>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
            Computed via matrix inverse: sqrt( (x - mu)^T * InvCov * (x - mu) )
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: evalResult.isNovelCondition ? '#ef4444' : '#10b981', fontFamily: 'var(--font-mono)' }}>
              {evalResult.mahalanobisDistance}σ
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Threshold: &lt; 2.5σ Nominal, &gt; 3.2σ Out-of-Distribution
            </div>
          </div>

          <div style={{ fontSize: 11, color: '#cbd5e1' }}>
            <strong>Contributing Standardized Deviations:</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
              {evalResult.contributingBiometrics.map(b => (
                <span 
                  key={b.feature}
                  style={{
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontSize: 10,
                    background: Math.abs(b.zScore) > 1.5 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.06)',
                    color: Math.abs(b.zScore) > 1.5 ? '#fca5a5' : '#94a3b8'
                  }}
                >
                  {b.feature}: {b.zScore > 0 ? `+${b.zScore}` : b.zScore}σ
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Naive Bayes Output */}
        <div className="space-card" style={{ borderColor: evalResult.rankedHypotheses.length > 0 ? '#a855f7' : 'var(--border-subtle)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
            4B. Naive Bayes Hypothesis Probabilities
          </h3>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
            P(Hypothesis | Z-scores) proportional to P(Prior) * Prod( Likelihood )
          </div>

          {evalResult.rankedHypotheses.length === 0 ? (
            <div style={{ fontSize: 12, color: '#94a3b8', padding: '14px 0' }}>
              No Out-of-Distribution state active on Day {dayStep}. Telemetry lies inside the {evalResult.mahalanobisDistance}σ normal manifold.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {evalResult.rankedHypotheses.map((h, i) => (
                <div key={h.title} style={{ background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 6, border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: 12, color: '#ffffff' }}>#{i+1} {h.title}</strong>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#c084fc', fontFamily: 'var(--font-mono)' }}>
                      {h.probabilityPct}%
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                    {h.evidence}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
