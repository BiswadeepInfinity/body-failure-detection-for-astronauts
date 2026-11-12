import React, { useState } from 'react';
import { Astronaut } from '../types';
import { KNOWN_INTERACTIONS } from '../data/formulary';
import { StatusBadge } from './StatusBadge';
import { 
  Pill, 
  ShieldAlert, 
  CheckCircle, 
  PlusCircle, 
  AlertOctagon, 
  Clock, 
  FileText
} from 'lucide-react';

interface Props {
  astronaut: Astronaut;
  onLogMedication: (astronautId: string, drugName: string, dose: string) => void;
  onAcknowledgeAlert?: (alertId: string) => void;
}

export const MedicationScreen: React.FC<Props> = ({ 
  astronaut, 
  onLogMedication
}) => {
  const [selectedDrug, setSelectedDrug] = useState('Promethazine');
  const [selectedDose, setSelectedDose] = useState('25mg');
  const [logNotes, setLogNotes] = useState('Microgravity space motion sickness (SMS) episode');
  const [sideEffectReport, setSideEffectReport] = useState<string[]>([]);
  const [interactionResult, setInteractionResult] = useState<{
    severity: 'red' | 'yellow' | 'none';
    message: string;
    rule?: string;
  } | null>(null);

  // Check interactive interaction check before logging
  const handleSimulateCheck = (drugToLog: string) => {
    const activeNames = astronaut.activeMedications.map(m => m.drugName);
    
    // Check against KNOWN_INTERACTIONS table
    const matchingRule = KNOWN_INTERACTIONS.find(rule => 
      (rule.drugA.toLowerCase() === drugToLog.toLowerCase() && activeNames.some(a => a.toLowerCase().includes(rule.drugB.toLowerCase()))) ||
      (rule.drugB.toLowerCase() === drugToLog.toLowerCase() && activeNames.some(a => a.toLowerCase().includes(rule.drugA.toLowerCase())))
    );

    if (matchingRule) {
      setInteractionResult({
        severity: matchingRule.severity,
        message: matchingRule.ruleDescription,
        rule: matchingRule.nasaRef
      });
    } else {
      setInteractionResult({
        severity: 'none',
        message: 'No hazardous interaction detected with active astronaut regimen in formulary.'
      });
    }
  };

  const handleExecuteLog = () => {
    onLogMedication(astronaut.id, selectedDrug, selectedDose);
  };

  const toggleSideEffect = (effect: string) => {
    if (sideEffectReport.includes(effect)) {
      setSideEffectReport(sideEffectReport.filter(e => e !== effect));
    } else {
      setSideEffectReport([...sideEffectReport, effect]);
    }
  };

  return (
    <div>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Pill size={20} style={{ color: '#38bdf8' }} /> Crew Medication Administration & Safety Engine
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Patient: <strong>{astronaut.name}</strong> ({astronaut.role}) · ISS Medical Kit Formulary Verification
          </p>
        </div>
        <StatusBadge level={astronaut.overallStatus} />
      </div>

      {/* Critical Interaction Warning if already active */}
      {astronaut.recentAlerts.some(a => a.category === 'medication' && a.level === 'red') && (
        <div className="alert-strip red" style={{ marginBottom: 20 }}>
          <AlertOctagon size={24} style={{ color: '#f87171', flexShrink: 0 }} />
          <div>
            <strong style={{ fontSize: 14, color: '#fca5a5' }}>
              CRITICAL FORMULARY ALERT: DUAL CNS DEPRESSION PROTOCOL VIOLATION
            </strong>
            <p style={{ fontSize: 12, color: '#ffffff', marginTop: 4 }}>
              Active administration of <strong>Zolpidem (Hypnotic)</strong> and <strong>Promethazine (Antiemetic)</strong> concurrently violates NASA ISS Medical Kit Safety Checklist: <em>"Do not use with sleep meds."</em>
            </p>
            <p style={{ fontSize: 11, color: '#fca5a5', marginTop: 4 }}>
              Recommendation: Flight surgeon override required. Monitor pulse oximetry for respiratory depression.
            </p>
          </div>
        </div>
      )}

      <div className="grid-2">
        {/* Left Column: Dose Logging & Instant Interaction Verifier */}
        <div className="space-card">
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <PlusCircle size={16} style={{ color: '#38bdf8' }} /> Log Dose & Pre-Screen Drug Interactions
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                Select Medication from Medical Kit:
              </label>
              <select 
                value={selectedDrug}
                onChange={(e) => {
                  setSelectedDrug(e.target.value);
                  handleSimulateCheck(e.target.value);
                }}
                style={{
                  width: '100%',
                  background: 'var(--bg-surface)',
                  color: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 6,
                  padding: '8px 12px',
                  fontSize: 13
                }}
              >
                <option value="Promethazine">Phenergan (Promethazine) - Antiemetic (Sedating)</option>
                <option value="Diphenhydramine">Benadryl (Diphenhydramine) - Antihistamine (Sedating)</option>
                <option value="Zolpidem">Ambien (Zolpidem) - Hypnotic / Sleep Aid</option>
                <option value="Modafinil">Provigil (Modafinil) - Alertness / Stimulant</option>
                <option value="Acetaminophen">Tylenol (Acetaminophen) - Analgesic</option>
                <option value="Melatonin">Melatonin Sublingual - Circadian</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  Dose:
                </label>
                <input 
                  type="text" 
                  value={selectedDose}
                  onChange={(e) => setSelectedDose(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-surface)',
                    color: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 6,
                    padding: '8px 12px',
                    fontSize: 13
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  Time of Administration:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', fontSize: 13, color: 'var(--text-muted)' }}>
                  <Clock size={14} /> MET Day {astronaut.missionDay} 22:45
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                Clinical Indication / Reason:
              </label>
              <input 
                type="text" 
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-surface)',
                  color: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 6,
                  padding: '8px 12px',
                  fontSize: 13
                }}
              />
            </div>

            {/* Interaction Verification Output */}
            {interactionResult && (
              <div style={{
                background: interactionResult.severity === 'red' ? 'var(--status-red-bg)' : (interactionResult.severity === 'yellow' ? 'var(--status-yellow-bg)' : 'var(--status-green-bg)'),
                border: `1px solid ${interactionResult.severity === 'red' ? 'var(--status-red-border)' : (interactionResult.severity === 'yellow' ? 'var(--status-yellow-border)' : 'var(--status-green-border)')}`,
                borderRadius: 6,
                padding: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  {interactionResult.severity === 'red' && <ShieldAlert size={16} style={{ color: '#ef4444' }} />}
                  {interactionResult.severity === 'yellow' && <ShieldAlert size={16} style={{ color: '#f59e0b' }} />}
                  {interactionResult.severity === 'none' && <CheckCircle size={16} style={{ color: '#10b981' }} />}
                  <strong style={{ fontSize: 12, color: interactionResult.severity === 'red' ? '#fca5a5' : (interactionResult.severity === 'yellow' ? '#fcd34d' : '#6ee7b7') }}>
                    {interactionResult.severity === 'red' ? 'CRITICAL CONTRAINDICATION DETECTED' : (interactionResult.severity === 'yellow' ? 'CAUTIONARY INTERACTION DETECTED' : 'SAFETY CHECK PASSED')}
                  </strong>
                </div>
                <div style={{ fontSize: 12, color: '#ffffff' }}>
                  {interactionResult.message}
                </div>
                {interactionResult.rule && (
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                    Ref: {interactionResult.rule}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => handleSimulateCheck(selectedDrug)}
                style={{ flex: 1 }}
              >
                Pre-Check Interaction
              </button>
              <button 
                type="button" 
                className="btn-primary" 
                onClick={handleExecuteLog}
                style={{ flex: 1 }}
              >
                Log Administration
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Active Schedule & Side Effect Check-in */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Today's Schedule */}
          <div className="space-card">
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={16} style={{ color: '#38bdf8' }} /> Current Active Regimen for {astronaut.name}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {astronaut.activeMedications.map(med => (
                <div key={med.id} style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 6,
                  padding: '10px 12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#ffffff', fontSize: 13 }}>
                      {med.drugName} ({med.dose})
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                      Schedule: {med.frequency}
                    </div>
                  </div>
                  <span className={`status-badge ${med.isSedating ? 'yellow' : 'green'}`} style={{ fontSize: 10 }}>
                    {med.isSedating ? 'Sedating' : 'Non-Sedating'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Side-Effect Crew Check-in (Astronaut self-reporting) */}
          <div className="space-card">
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileText size={16} style={{ color: '#10b981' }} /> Astronaut Daily Side-Effect Check-in
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
              Quick self-assessment for next-day sedation, balance disturbances, or altered alertness.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
              {[
                'Morning Grogginess / Hangover',
                'Vestibular / Head Movement Dizziness',
                'Dry Mouth / Anticholinergic',
                'Visual Distortion / Blur',
                'Vivid Dreams / Sleep Disruption',
                'Daytime Somnolence'
              ].map(symptom => {
                const isSelected = sideEffectReport.includes(symptom);
                return (
                  <button
                    key={symptom}
                    onClick={() => toggleSideEffect(symptom)}
                    style={{
                      background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'var(--bg-surface)',
                      border: `1px solid ${isSelected ? '#3b82f6' : 'var(--border-subtle)'}`,
                      color: isSelected ? '#93c5fd' : 'var(--text-main)',
                      padding: '8px 10px',
                      borderRadius: 6,
                      fontSize: 11,
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    {isSelected ? '✓ ' : '+ '} {symptom}
                  </button>
                );
              })}
            </div>

            <button 
              className="btn-secondary" 
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => alert('Side-effect telemetry logged to Mission Control electronic health record (EHR).')}
            >
              Submit Check-In to Flight Surgeon Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

