import React from 'react';
import { Stethoscope } from 'lucide-react';

interface TermExplanation {
  mlTerm: string;
  mathSymbol?: string;
  doctorTranslation: string;
  plainEnglishExplanation: string;
  whyItMattersInSpace: string;
  clinicalExample: string;
}

export const ML_GLOSSARY: Record<string, TermExplanation> = {
  mahalanobisDistance: {
    mlTerm: 'True Mahalanobis Distance',
    mathSymbol: 'D_M',
    doctorTranslation: 'Multi-Organ Deviation Index',
    plainEnglishExplanation: 'Measures how far an astronaut\'s combined vital signs (sleep, heart rate, stress, and mood) have drifted away from their healthy baseline. Rather than looking at heart rate or sleep in isolation, it calculates the distance across all 5 biometrics simultaneously while accounting for how they naturally fluctuate together in zero gravity.',
    whyItMattersInSpace: 'In deep space, single vitals fluctuate constantly due to fluid shifts and routine spacewalk fatigue. Traditional alarms create alert fatigue with constant false alarms. The Mahalanobis metric only triggers when multiple systems decouple in a physiologically dangerous pattern.',
    clinicalExample: 'If heart rate climbs to 78 bpm during EVA exercise, D_M stays low (<1.8σ, nominal). But if that same 78 bpm occurs during sleep alongside a 4.2-hour sleep window and high sympathetic stress, D_M jumps above 3.2σ, flagging acute systemic strain days before physical collapse.'
  },
  covarianceMatrix: {
    mlTerm: '5x5 Full Covariance Matrix',
    mathSymbol: 'Σ (Sigma)',
    doctorTranslation: 'Vital Sign Interconnection Grid',
    plainEnglishExplanation: 'A mathematical correlation table that continuously tracks how each vital sign interacts with every other vital sign for this specific crew member. It quantifies whether an increase in emotional stress reliably drives down sleep duration or drives up resting heart rate.',
    whyItMattersInSpace: 'Every human body responds uniquely to the stress of microgravity, radiation, and isolation. One astronaut may manifest acute strain through sleep onset insomnia, while another manifests it through tachycardia. The covariance matrix maps each individual’s unique physiological fingerprint.',
    clinicalExample: 'A Commander with high baseline resilience might normally show zero correlation between flight workload and resting heart rate. If their covariance matrix suddenly shows strong positive coupling between stress and heart rate, the model recognizes early loss of autonomic buffering.'
  },
  priorWeightDecay: {
    mlTerm: 'Earth Prior Weight Decay',
    mathSymbol: 'W_Earth = (1 - α)^t',
    doctorTranslation: 'Earth-to-Space Physiology Transition',
    plainEnglishExplanation: 'When astronauts first launch (Flight Day 1), the AI initializes with clinical trials collected from healthy terrestrial subjects (PhysioNet MMASH and WESAD datasets). As each flight day passes, the AI gradually decays the weight of Earth assumptions using an exponential learning rate, replacing them with the astronaut\'s genuine microgravity telemetry.',
    whyItMattersInSpace: 'No human has Earth physiology in deep space. Cephalad fluid shifts permanently elevate central venous pressure, alter nocturnal blood pressure dipping, and disrupt circadian melatonin release. Forgetting Earth baseline values prevents false medical alarms.',
    clinicalExample: 'On Day 1, the AI evaluates vitals using 100% Earth clinical priors. By Flight Day 15, Earth influence drops to 28%. By Flight Day 30, the onboard model is 92% customized to that astronaut’s space physiology.'
  },
  outOfDistribution: {
    mlTerm: 'Out-Of-Distribution (OOD) Anomaly',
    mathSymbol: 'D_M > 2.8σ',
    doctorTranslation: 'Unprecedented Physiological Crisis',
    plainEnglishExplanation: 'A mathematical boundary indicating that the crew member’s combined bodily parameters have drifted into a state never before encountered in their flight history or in established space medicine baselines.',
    whyItMattersInSpace: 'During a Mars mission, round-trip radio signals take up to 44 minutes. Crew members cannot wait for Houston flight surgeons to diagnose a novel health crisis. When an Out-of-Distribution state occurs, the spacecraft computer immediately alerts the crew and provides diagnostic recommendations locally.',
    clinicalExample: 'When an astronaut exhibits simultaneous severe sleep fragmentation, resting bradycardia, and blunted autonomic response, the system recognizes this combination as completely out-of-distribution, triggering the space pharmacology engine to check for adverse drug-drug interactions.'
  },
  naiveBayesHypotheses: {
    mlTerm: 'Naive Bayes Posterior Classifier',
    mathSymbol: 'P(Diagnosis | Biometrics)',
    doctorTranslation: 'Differential Medical Diagnosis',
    plainEnglishExplanation: 'A probabilistic medical decision tool that takes the astronaut\'s biometric deviations (Z-scores) and active medications, combining them with space medicine epidemiology to compute the exact statistical probability of competing clinical diagnoses.',
    whyItMattersInSpace: 'Rather than outputting a vague red warning, the AI ranks specific medical conditions from highest to lowest likelihood (e.g., #1 Zolpidem Tolerance 84%, #2 Environmental CO2 Accumulation 12%), providing flight surgeons with actionable rationale and protocols.',
    clinicalExample: 'If a crew member takes Zolpidem and Promethazine together, the classifier immediately calculates an 88% probability for "Dual-Sedative CNS Depression", alerts the Medical Officer, and recommends continuous pulse oximetry monitoring.'
  },
  nigEpistemicConfidence: {
    mlTerm: 'Normal-Inverse-Gamma Posterior Certainty',
    mathSymbol: 'NIG(μ, λ, α, β)',
    doctorTranslation: 'AI Clinical Experience & Reliability Score',
    plainEnglishExplanation: 'Measures how confident the machine learning engine is in its own predictions based on the depth of historical data it has collected for that astronaut.',
    whyItMattersInSpace: 'On Flight Day 2, the AI has only observed 2 nights of data, meaning its certainty is low (~45%) and it acts conservatively. By Flight Day 30, the model has accumulated 30 days of continuous telemetry, tightening its posterior variance and reaching >80% clinical confidence.',
    clinicalExample: 'If an anomaly is flagged on Day 3, the AI notes that its confidence is low due to limited observation depth. If the same anomaly occurs on Day 28, the AI alerts the crew with 88% confidence that a true physiological failure is imminent.'
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
    <div style={{
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      padding: '24px 28px',
      marginBottom: 28,
      borderRadius: 20
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 999,
            padding: '5px 14px',
            color: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.3px'
          }}>
            <Stethoscope size={15} style={{ color: '#ffffff' }} /> Plain-English Interpreter
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Plain astronaut & flight surgeon translation
          </span>
        </div>

        {/* Term Switcher Buttons - Clean Liquid Glass Pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.entries(ML_GLOSSARY).map(([key, item]) => {
            const isSelected = key === selectedKey;
            return (
              <button
                key={key}
                onClick={() => setSelectedKey(key)}
                style={{
                  background: isSelected ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid rgba(255, 255, 255, 0.06)',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  padding: '6px 16px',
                  borderRadius: 999,
                  fontSize: 12.5,
                  fontWeight: isSelected ? 600 : 400,
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

      {/* Selected Term Detail Box with Liquid Glass Tint */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 18,
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.6px', marginBottom: 6 }}>
              Engineering & Mathematical Term:
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 10 }}>
              {current.mlTerm} {current.mathSymbol && <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 15 }}>({current.mathSymbol})</span>}
            </div>

            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.6px', marginTop: 18, marginBottom: 6 }}>
              Plain-English Medical Meaning:
            </div>
            <div style={{ fontSize: 15, color: '#f1f5f9', lineHeight: 1.7 }}>
              {current.plainEnglishExplanation}
            </div>
          </div>

          <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.08)', paddingLeft: 32 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.6px', marginBottom: 6 }}>
              Why This Is Vital For Space Crew Safety:
            </div>
            <div style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.7 }}>
              {current.whyItMattersInSpace}
            </div>
          </div>
        </div>

        {/* Real-World Spaceflight Clinical Scenario */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: 16,
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: 12,
          padding: '14px 18px'
        }}>
          <div style={{ fontSize: 12, color: '#ffffff', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
            🔬 Space Medicine Clinical Example:
          </div>
          <div style={{ fontSize: 14.5, color: '#e2e8f0', lineHeight: 1.6 }}>
            {current.clinicalExample}
          </div>
        </div>
      </div>

      {/* Dynamic Live Flight Surgeon Narrative */}
      {dynamicDoctorVerdict && (
        <div style={{
          marginTop: 18,
          background: dynamicDoctorVerdict.severity === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.03)',
          border: `1px solid ${dynamicDoctorVerdict.severity === 'critical' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
          borderRadius: 14,
          padding: '14px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }}>
          <div style={{
            fontSize: 13,
            fontWeight: 600,
            color: dynamicDoctorVerdict.severity === 'critical' ? '#fca5a5' : '#ffffff'
          }}>
            👨‍⚕️ Real-time Diagnostic Evaluation: {dynamicDoctorVerdict.headline}
          </div>
          <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>
            {dynamicDoctorVerdict.explanation}
          </div>
        </div>
      )}
    </div>
  );
};
