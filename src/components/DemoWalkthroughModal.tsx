import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  onStepChange: (stepIndex: number, tabName: string, astronautId?: string) => void;
  onClose: () => void;
}

export const DemoWalkthroughModal: React.FC<Props> = ({ onStepChange, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Step 1: Crew Overview & Sleep Decline Detection',
      tab: 'overview',
      astroId: undefined,
      description: 'Observe the 4 astronauts. Notice CDR Marcus Vance flagged in Red. His 14-day rolling baseline detected a sudden drop down to 4.2h sleep and acute stress spikes before he sought medical intervention.',
      actionLabel: 'Go to Crew Overview'
    },
    {
      title: 'Step 2: Personalized 14-Day Baseline Analysis',
      tab: 'detail',
      astroId: 'ast-01',
      description: 'Inspect Marcus Vance’s detail telemetry. The baseline band shows the contrast between fixed NASA standards (8.0h) and Marcus’s individual baseline (6.8h down to 4.5h), demonstrating personalized thresholds.',
      actionLabel: 'Inspect Marcus Telemetry'
    },
    {
      title: 'Step 3: Hypnotic Efficacy (Our Standout Edge)',
      tab: 'sleep_effectiveness',
      astroId: 'ast-01',
      description: 'Zolpidem was started on Day 22. See the plain verdict: Zolpidem cut sleep latency by 14.5 minutes, but total sleep hours did not significantly increase (+0.6h)—mirroring findings from NASA OCHMO technical briefs!',
      actionLabel: 'View Hypnotic Effectiveness'
    },
    {
      title: 'Step 4: Real-time Drug-Drug Interaction Warning',
      tab: 'medication',
      astroId: 'ast-01',
      description: 'On Day 28, Marcus logged Promethazine for space motion sickness. The medication engine flags a critical RED alert because NASA ISS Medical Kit rules strictly mandate: "Do not use with sleep meds" (additive CNS depression risk).',
      actionLabel: 'View Interaction Alert'
    },
    {
      title: 'Step 5: Spaceflight Microgravity Drug Potency Flags',
      tab: 'stock',
      astroId: undefined,
      description: 'Open the spacecraft inventory. Observe that Promethazine (repackaged 14 months ago) is flagged Yellow, and Benadryl (repackaged 26 months ago) is flagged Red due to 1.5× microgravity degradation (Reichard et al. 2023).',
      actionLabel: 'View Formulary Stock Flags'
    },
    {
      title: 'Step 6: Scientist Self-Service EHR Portal & Multi-Month Calendar',
      tab: 'scientist_portal',
      astroId: 'ast-01',
      description: 'Crew members log sleep hours, latency, HR, stress, and medications directly in an intuitive multi-month calendar (Jan-Dec 2026). When astronauts edit or log a day, the model updates live.',
      actionLabel: 'Open Scientist Calendar Portal'
    },
    {
      title: 'Step 7: Adaptive Machine Learning & Novelty Discovery',
      tab: 'adaptive_ml',
      astroId: 'ast-01',
      description: 'Deep space edge AI: Calibrated against real PhysioNet MMASH & WESAD clinical datasets, the onboard system uses continuous online learning with true 5x5 covariance matrix tracking and Mahalanobis distance.',
      actionLabel: 'View Adaptive ML Engine'
    },
    {
      title: 'Step 8: Live ML Math Debugger & Sandbox',
      tab: 'ml_debugger',
      astroId: 'ast-01',
      description: 'Proof of live computation: Inject any arbitrary numbers (or use 1-click presets) to verify Mahalanobis distance D_M, Nig epistemic uncertainty, and Naive Bayes differential diagnoses calculated in real-time in your browser.',
      actionLabel: 'Launch ML Debugger Sandbox'
    }
  ];

  const handleApplyStep = (index: number) => {
    setCurrentStep(index);
    const step = steps[index];
    onStepChange(index, step.tab, step.astroId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} style={{ color: '#f59e0b' }} /> Hackathon Judge Demo Script
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Follow the 5-step guided story prescribed in Section 7 of the project brief.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {steps.map((st, idx) => {
          const isActive = currentStep === idx;
          return (
            <div 
              key={st.title}
              style={{
                background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-surface)',
                border: `1px solid ${isActive ? '#3b82f6' : 'var(--border-subtle)'}`,
                borderRadius: 6,
                padding: '12px 14px',
                cursor: 'pointer'
              }}
              onClick={() => handleApplyStep(idx)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <strong style={{ fontSize: 13, color: isActive ? '#60a5fa' : '#ffffff' }}>
                  {st.title}
                </strong>
                {isActive && (
                  <span style={{ fontSize: 11, color: '#93c5fd', background: 'rgba(59, 130, 246, 0.3)', padding: '2px 8px', borderRadius: 4 }}>
                    Active Step
                  </span>
                )}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {st.description}
              </p>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        <button className="btn-secondary" onClick={onClose}>
          Close Guide
        </button>
        <button 
          className="btn-primary" 
          onClick={() => {
            const nextIdx = (currentStep + 1) % steps.length;
            handleApplyStep(nextIdx);
          }}
        >
          <span>{currentStep === steps.length - 1 ? 'Restart Script (Step 1)' : 'Next Demo Step'}</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
