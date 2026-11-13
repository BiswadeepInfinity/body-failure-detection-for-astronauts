import React from 'react';
import { Stethoscope } from 'lucide-react';

interface TermExplanation {
  mlTerm: string;
  mathSymbol?: string;
  doctorTranslation: string;
  plainEnglishExplanation: string;
  whyItMattersInSpace: string;
}

export const ML_GLOSSARY: Record<string, TermExplanation> = {
  mahalanobisDistance: {
    mlTerm: 'True Mahalanobis Distance',
    mathSymbol: 'D_M',
    doctorTranslation: 'Multi-Organ Deviation Index',
    plainEnglishExplanation: 'Measures how far an astronaut\'s combined vital signs have shifted away from their healthy baseline, taking into account how biometrics naturally fluctuate together.',
    whyItMattersInSpace: 'If a heart rate of 78 bpm happens during intense exercise, it is completely normal. But if that same 78 bpm happens while resting and accompanied by 4.2 hours of fragmented sleep, the combined pattern signals an early bodily breakdown before single-variable alarms trigger.'
  },
  covarianceMatrix: {
    mlTerm: '5x5 Covariance Matrix',
    mathSymbol: 'Σ (Sigma)',
    doctorTranslation: 'Vital Sign Interconnection Grid',
    plainEnglishExplanation: 'A mathematical table showing how sleep, heart rate, stress, and mood influence one another in this specific astronaut.',
    whyItMattersInSpace: 'Different astronauts react differently to zero gravity. Some show stress through higher heart rate; others lose sleep. The matrix learns each individual\'s unique physiological "fingerprint".'
  },
  priorWeightDecay: {
    mlTerm: 'Earth Prior Weight Decay',
    mathSymbol: '(1 - α)^t',
    doctorTranslation: 'Earth-to-Space Physiology Transition',
    plainEnglishExplanation: 'On launch day (Day 1), the AI uses hospital clinical trial data from Earth. Each day in orbit, Earth rules are gradually replaced with the astronaut\'s actual space measurements.',
    whyItMattersInSpace: 'No human has Earth physiology in deep space. Gravity fluid shifts and microgravity permanently alter heart rate and sleep cycles. The AI forgets terrestrial assumptions so it does not give false alarms.'
  },
  outOfDistribution: {
    mlTerm: 'Out-Of-Distribution (OOD) Anomaly',
    mathSymbol: 'D_M > 2.8σ',
    doctorTranslation: 'Unprecedented Physiological Crisis',
    plainEnglishExplanation: 'The astronaut\'s vital signs have formed a bodily pattern never seen before in their mission history, indicating an acute health event.',
    whyItMattersInSpace: 'Deep space missions cannot wait 20 minutes for signals to reach mission control on Earth. When an unprecedented crisis strikes, the spacecraft edge computer immediately flags the anomaly on-site.'
  },
  naiveBayesHypotheses: {
    mlTerm: 'Naive Bayes Posterior Classifier',
    mathSymbol: 'P(Condition | Telemetry)',
    doctorTranslation: 'Differential Medical Diagnosis',
    plainEnglishExplanation: 'A medical diagnostic ranker that lists the most likely physical causes for the astronaut\'s symptoms, ranked from highest to lowest likelihood with clinical reasons.',
    whyItMattersInSpace: 'Gives the crew and mission flight surgeon clear, ranked clinical options (e.g., #1 Sleeping Pill Tolerance, #2 Toxic Spacecraft Gas Buildup, #3 Fluid Shift) so they can take rapid counter-measures.'
  },
  nigEpistemicConfidence: {
    mlTerm: 'Normal-Inverse-Gamma Posterior Certainty',
    mathSymbol: 'NIG(μ, λ, α, β)',
    doctorTranslation: 'AI Clinical Experience & Reliability Score',
    plainEnglishExplanation: 'Measures how confident the AI is in its diagnosis based on how many days it has been observing this specific astronaut.',
    whyItMattersInSpace: 'On Day 1, the AI has 50% confidence because it has only seen 1 night of data. By Day 30, it achieves >80% confidence because it has observed a full month of continuous microgravity telemetry.'
  }
};

interface PlainEnglishInterpreterProps {
  currentTermKey?: string;
  isCompact?: boolean;
  liveBiometrics?: {
    sleepHours?: number;
    restingHeartRate?: number;
    stressLevel?: number;
    mahalanobisDist?: number;
    flightDay?: number;
    topHypothesis?: string;
    astronautName?: string;
  };
}

export const PlainEnglishInterpreter: React.FC<PlainEnglishInterpreterProps> = ({ currentTermKey, isCompact = false, liveBiometrics }) => {
  const [selectedKey, setSelectedKey] = React.useState<string>(currentTermKey || 'mahalanobisDistance');

  const current = ML_GLOSSARY[selectedKey] || ML_GLOSSARY['mahalanobisDistance'];

  // Dynamically generated flight surgeon narrative based on real live numbers
  const dynamicDoctorVerdict = React.useMemo(() => {
    if (!liveBiometrics) return null;
    const { sleepHours = 6.8, restingHeartRate = 62, stressLevel = 30, mahalanobisDist = 1.0, flightDay = 30, topHypothesis, astronautName = 'Astronaut' } = liveBiometrics;
    
    const isAnomaly = mahalanobisDist >= 2.8;
    const isMarginal = mahalanobisDist >= 2.0 && mahalanobisDist < 2.8;

    if (isAnomaly) {
      return {
        severity: 'critical',
        headline: `CRITICAL ALERT: ${astronautName} has entered an Out-Of-Distribution bodily state on Flight Day ${flightDay}.`,
        explanation: `Their combined vital signs (${sleepHours}h sleep, ${restingHeartRate} bpm resting heart rate, ${stressLevel}/100 stress) have deviated ${mahalanobisDist.toFixed(1)} standard deviations from their personalized baseline. ${topHypothesis ? `Primary suspect: "${topHypothesis}".` : ''} This is not normal variation; intervention is warranted.`
      };
    } else if (isMarginal) {
      return {
        severity: 'warning',
        headline: `WATCH ALERT: Early physiological drift detected for ${astronautName} on Day ${flightDay}.`,
        explanation: `Vital signs show mild divergence (${mahalanobisDist.toFixed(1)}σ deviation). Sleep duration (${sleepHours}h) and resting heart rate (${restingHeartRate} bpm) are beginning to decouple from their learned baseline. Recommend scheduled rest.`
      };
    } else {
      return {
        severity: 'nominal',
        headline: `NOMINAL STATUS: ${astronautName}'s body has successfully adapted to microgravity on Day ${flightDay}.`,
        explanation: `All 5 biometric markers are co-varying within their learned spaceflight envelope (${mahalanobisDist.toFixed(1)}σ deviation vs acceptable <2.5σ). The AI is operating with high confidence.`
      };
    }
  }, [liveBiometrics]);

  if (isCompact) {
    return (
      <div style={{
        background: 'rgba(56, 189, 248, 0.08)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: 8,
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10
      }}>
        <Stethoscope size={18} style={{ color: '#38bdf8', marginTop: 2, flexShrink: 0 }} />
        <div style={{ fontSize: 12 }}>
          <strong style={{ color: '#38bdf8' }}>Flight Surgeon Translation:</strong>{' '}
          <span style={{ color: '#e0f2fe' }}>{current.doctorTranslation}</span> —{' '}
          <span style={{ color: '#94a3b8' }}>{current.plainEnglishExplanation}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-card" style={{
      background: 'linear-gradient(135deg, rgba(8, 47, 73, 0.45) 0%, rgba(15, 23, 42, 0.85) 100%)',
      borderColor: 'rgba(56, 189, 248, 0.4)',
      padding: '22px 26px',
      marginBottom: 24,
      borderRadius: 12
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: 8,
            padding: '6px 12px',
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12.5,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.4px'
          }}>
            <Stethoscope size={16} /> Plain-English Medical Interpreter
          </div>
          <span style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
            Translating complex math into plain astronaut & flight surgeon language
          </span>
        </div>

        {/* Term Switcher Buttons with generous padding */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.entries(ML_GLOSSARY).map(([key, item]) => {
            const isSelected = key === selectedKey;
            return (
              <button
                key={key}
                onClick={() => setSelectedKey(key)}
                style={{
                  background: isSelected ? '#38bdf8' : 'rgba(255, 255, 255, 0.06)',
                  border: isSelected ? '1px solid #ffffff' : '1px solid var(--border-subtle)',
                  color: isSelected ? '#000000' : 'var(--text-main)',
                  padding: '7px 14px',
                  borderRadius: 6,
                  fontSize: 12.5,
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {item.doctorTranslation}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Term Detail Box with generous text and spacing */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.45)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 10,
        padding: '18px 22px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 24
      }}>
        <div>
          <div style={{ fontSize: 12, color: '#38bdf8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.4px', marginBottom: 4 }}>
            Engineering & ML Term:
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
            {current.mlTerm} {current.mathSymbol && <span style={{ color: '#c084fc', fontFamily: 'var(--font-mono)', fontSize: 14 }}>({current.mathSymbol})</span>}
          </div>

          <div style={{ fontSize: 12, color: '#34d399', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.4px', marginTop: 14, marginBottom: 4 }}>
            Plain-English Medical Meaning:
          </div>
          <div style={{ fontSize: 14, color: '#f1f5f9', lineHeight: 1.6 }}>
            {current.plainEnglishExplanation}
          </div>
        </div>

        <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.12)', paddingLeft: 22 }}>
          <div style={{ fontSize: 12, color: '#fbbf24', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.4px', marginBottom: 4 }}>
            Why This Matters for Crew Safety in Deep Space:
          </div>
          <div style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.6 }}>
            {current.whyItMattersInSpace}
          </div>
        </div>
      </div>

      {/* Dynamic Live Flight Surgeon Narrative (Computed directly from real-time streaming biometrics) */}
      {dynamicDoctorVerdict && (
        <div style={{
          marginTop: 16,
          background: dynamicDoctorVerdict.severity === 'critical' ? 'rgba(239, 68, 68, 0.15)' : (dynamicDoctorVerdict.severity === 'warning' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.12)'),
          border: `1px solid ${dynamicDoctorVerdict.severity === 'critical' ? 'rgba(239, 68, 68, 0.45)' : (dynamicDoctorVerdict.severity === 'warning' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.35)')}`,
          borderRadius: 8,
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }}>
          <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: dynamicDoctorVerdict.severity === 'critical' ? '#fca5a5' : (dynamicDoctorVerdict.severity === 'warning' ? '#fde68a' : '#6ee7b7')
          }}>
            👨‍⚕️ Live Case Summary: {dynamicDoctorVerdict.headline}
          </div>
          <div style={{ fontSize: 13, color: '#f8fafc', lineHeight: 1.5 }}>
            {dynamicDoctorVerdict.explanation}
          </div>
        </div>
      )}
    </div>
  );
};
