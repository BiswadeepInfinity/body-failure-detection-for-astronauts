import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, X } from 'lucide-react';

interface Props {
  onStepChange: (stepIndex: number, tabName: string, astronautId?: string) => void;
  onClose: () => void;
}

export const DemoWalkthroughModal: React.FC<Props> = ({ onStepChange, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Step 1: Mission Control Overview & Sleep Decline',
      tab: 'overview',
      astroId: undefined,
      description: 'Observe CDR Marcus Vance flagged in Red. His personalized 14-day rolling baseline detected a sudden drop to 4.2h sleep alongside acute autonomic stress before he reported any symptoms.',
      actionLabel: 'Go to Crew Overview'
    },
    {
      title: 'Step 2: Personalized Microgravity Baseline',
      tab: 'detail',
      astroId: 'ast-01',
      description: 'Inspect Marcus Vance’s detail telemetry. The baseline band highlights the crucial contrast between rigid Earth standard guidelines (8.0h) and his real individual space baseline (6.8h down to 4.5h).',
      actionLabel: 'Inspect Marcus Telemetry'
    },
    {
      title: 'Step 3: Hypnotic Efficacy & Sleep Architecture',
      tab: 'sleep_effectiveness',
      astroId: 'ast-01',
      description: 'Zolpidem was prescribed on Flight Day 22. See the plain verdict: Zolpidem reduced sleep onset latency by 14.5 minutes, yet total slow-wave restorative sleep did not significantly improve (+0.6h)—mirroring official NASA OCHMO technical briefs.',
      actionLabel: 'View Hypnotic Effectiveness'
    },
    {
      title: 'Step 4: Real-time Multi-Drug Interaction Warning',
      tab: 'medication',
      astroId: 'ast-01',
      description: 'On Day 28, Marcus logged Promethazine for space motion sickness. The pharmacology engine flags a critical RED alert because NASA ISS Medical Kit rules strictly mandate: "Do not use with sleep meds" due to additive CNS depression.',
      actionLabel: 'View Interaction Alert'
    },
    {
      title: 'Step 5: Microgravity Drug Degradation Flags',
      tab: 'stock',
      astroId: undefined,
      description: 'Open the spacecraft inventory. Notice that Promethazine (repackaged 14 months ago) is flagged Yellow, and Benadryl (repackaged 26 months ago) is flagged Red due to 1.5× microgravity degradation (Reichard et al. 2023, npj Microgravity).',
      actionLabel: 'View Formulary Stock Flags'
    },
    {
      title: 'Step 6: Scientist EHR Portal & Multi-Month Calendar',
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

  const activeStepData = steps[currentStep];

  return (
    <div style={{
      position: 'fixed',
      bottom: 28,
      right: 28,
      zIndex: 9999,
      maxWidth: 440,
      width: 'calc(100vw - 56px)',
      background: 'rgba(10, 14, 24, 0.72)',
      backdropFilter: 'blur(28px)',
      WebkitBackdropFilter: 'blur(28px)',
      border: '1px solid rgba(255, 255, 255, 0.16)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      borderRadius: 24,
      padding: '24px 26px',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }}>
      {/* Top Header Row with Step Counter & Dismiss */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 999,
            padding: '3px 12px',
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            color: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <Sparkles size={13} style={{ color: '#fbbf24' }} /> Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        <button 
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#cbd5e1',
            borderRadius: 999,
            width: 30,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          title="Close Walkthrough"
        >
          <X size={15} />
        </button>
      </div>

      {/* Single Active Tip Content Card */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h4 style={{ fontSize: 16.5, fontWeight: 700, color: '#ffffff', lineHeight: 1.35 }}>
          {activeStepData.title}
        </h4>
        <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.6 }}>
          {activeStepData.description}
        </p>
      </div>

      {/* Progress Dots Indicator */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', margin: '4px 0' }}>
        {steps.map((_, idx) => (
          <div
            key={idx}
            onClick={() => handleApplyStep(idx)}
            style={{
              height: 4,
              flex: 1,
              borderRadius: 999,
              background: idx === currentStep ? '#ffffff' : (idx < currentStep ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.1)'),
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title={`Jump to Step ${idx + 1}`}
          />
        ))}
      </div>

      {/* Controls: Prev / Next Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
        <button
          onClick={() => {
            if (currentStep > 0) handleApplyStep(currentStep - 1);
          }}
          disabled={currentStep === 0}
          style={{
            background: 'transparent',
            border: 'none',
            color: currentStep === 0 ? 'rgba(255, 255, 255, 0.25)' : 'var(--text-secondary)',
            fontSize: 13,
            cursor: currentStep === 0 ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 0'
          }}
        >
          <ArrowLeft size={14} /> Back
        </button>

        <button 
          onClick={() => {
            const nextIdx = (currentStep + 1) % steps.length;
            handleApplyStep(nextIdx);
          }}
          style={{
            background: '#ffffff',
            color: '#000000',
            border: 'none',
            borderRadius: 999,
            padding: '9px 20px',
            fontSize: 13.5,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(255, 255, 255, 0.25)',
            transition: 'all 0.15s ease'
          }}
        >
          <span>{currentStep === steps.length - 1 ? 'Finish Script' : 'NEXT STEP'}</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
