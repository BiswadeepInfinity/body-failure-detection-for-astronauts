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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: 16,
        paddingBottom: 16,
        borderBottom: '1px solid rgba(56, 189, 248, 0.12)'
      }}>
        <div>
          <div className="section-title amber">PHARMACOVIGILANCE · SPACE MEDICAL KIT ENGINE</div>
          <div className="section-subheading" style={{ marginTop: 4 }}>
            Medication Administration & Safety Screen
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4, fontFamily: 'var(--font-mono)' }}>
            Patient: <strong style={{ color: '#fff' }}>{astronaut.name}</strong> ({astronaut.role}) · ISS Medical Formulary Safety Protocol
          </div>
        </div>
        <StatusBadge level={astronaut.overallStatus} />
      </div>

      {/* Critical Interaction Warning if already active */}
      {astronaut.recentAlerts.some(a => a.category === 'medication' && a.level === 'red') && (
        <div className="alert-strip red" style={{ borderRadius: 'var(--radius-md)', padding: 18 }}>
          <AlertOctagon size={24} style={{ color: '#f87171', flexShrink: 0 }} />
          <div>
            <strong style={{ fontSize: 14, color: '#fca5a5', fontFamily: 'var(--font-mono)' }}>
              CRITICAL FORMULARY ALERT: DUAL CNS DEPRESSION PROTOCOL VIOLATION
            </strong>
            <p style={{ fontSize: 13, color: '#ffffff', marginTop: 4 }}>
              Active administration of <strong>Zolpidem (Hypnotic)</strong> and <strong>Promethazine (Antiemetic)</strong> concurrently violates NASA ISS Medical Kit Safety Checklist: <em>"Do not use with sleep meds."</em>
            </p>
            <p style={{ fontSize: 11.5, color: '#fca5a5', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
              RECOMMENDATION: Flight surgeon override required. Monitor pulse oximetry for respiratory depression.
            </p>
          </div>
        </div>
      )}

      <div className="grid-2">
        {/* Left Column: Dose Logging & Instant Interaction Verifier */}
        <div className="space-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <PlusCircle size={15} style={{ color: 'var(--cyan)' }} />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              Log Administration & Pre-Screen Interactions
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11.5, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
                SELECT MEDICATION FROM MEDICAL KIT:
              </label>
              <select 
                value={selectedDrug}
                onChange={(e) => {
                  setSelectedDrug(e.target.value);
                  handleSimulateCheck(e.target.value);
                }}
                style={{
                  width: '100%',
                  background: 'rgba(8, 14, 26, 0.85)',
                  color: '#ffffff',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  fontSize: 13,
                  outline: 'none'
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
                <label style={{ display: 'block', fontSize: 11.5, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
                  DOSAGE:
                </label>
                <input 
                  type="text" 
                  value={selectedDose}
                  onChange={(e) => setSelectedDose(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(8, 14, 26, 0.85)',
                    color: '#ffffff',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 14px',
                    fontSize: 13
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11.5, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
                  TIMESTAMP:
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(6, 10, 20, 0.7)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: 12.5,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)'
                }}>
                  <Clock size={14} style={{ color: 'var(--cyan)' }} /> FD {astronaut.missionDay} 22:45 UTC
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11.5, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
                CLINICAL INDICATION / REASON:
              </label>
              <input 
                type="text" 
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(8, 14, 26, 0.85)',
                  color: '#ffffff',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  fontSize: 13
                }}
              />
            </div>

            {/* Interaction Verification Output */}
            {interactionResult && (
              <div style={{
                background: interactionResult.severity === 'red' ? 'var(--status-red-bg)' : (interactionResult.severity === 'yellow' ? 'var(--status-yellow-bg)' : 'var(--status-green-bg)'),
                border: `1px solid ${interactionResult.severity === 'red' ? 'var(--status-red-border)' : (interactionResult.severity === 'yellow' ? 'var(--status-yellow-border)' : 'var(--status-green-border)')}`,
                borderRadius: 'var(--radius-sm)',
                padding: '14px 16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  {interactionResult.severity === 'red' && <ShieldAlert size={16} style={{ color: '#f87171' }} />}
                  {interactionResult.severity === 'yellow' && <ShieldAlert size={16} style={{ color: '#fbbf24' }} />}
                  {interactionResult.severity === 'none' && <CheckCircle size={16} style={{ color: '#34d399' }} />}
                  <strong style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: interactionResult.severity === 'red' ? '#fca5a5' : (interactionResult.severity === 'yellow' ? '#fcd34d' : '#6ee7b7') }}>
                    {interactionResult.severity === 'red' ? 'CRITICAL CONTRAINDICATION DETECTED' : (interactionResult.severity === 'yellow' ? 'CAUTIONARY INTERACTION DETECTED' : 'SAFETY PROTOCOL VERIFIED')}
                  </strong>
                </div>
                <div style={{ fontSize: 13, color: '#ffffff', lineHeight: 1.4 }}>
                  {interactionResult.message}
                </div>
                {interactionResult.rule && (
                  <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
                    REF: {interactionResult.rule}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => handleSimulateCheck(selectedDrug)}
                style={{ flex: 1, justifyContent: 'center', borderRadius: 999 }}
              >
                Pre-Check Safety
              </button>
              <button 
                type="button" 
                className="btn-primary" 
                onClick={handleExecuteLog}
                style={{ flex: 1, justifyContent: 'center', borderRadius: 999 }}
              >
                Log Administration
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Active Schedule & Side Effect Check-in */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Active Schedule */}
          <div className="space-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Clock size={15} style={{ color: 'var(--cyan)' }} />
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                Active Regimen · {astronaut.name}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {astronaut.activeMedications.map(med => (
                <div key={med.id} style={{
                  background: 'linear-gradient(135deg, rgba(14,22,42,0.6) 0%, rgba(8,13,24,0.7) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#ffffff', fontSize: 13.5 }}>
                      {med.drugName} ({med.dose})
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                      Schedule: {med.frequency}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 999,
                    background: med.isSedating ? 'rgba(239, 68, 68, 0.15)' : 'rgba(52, 211, 153, 0.15)',
                    color: med.isSedating ? '#fca5a5' : '#34d399',
                    border: `1px solid ${med.isSedating ? 'rgba(239, 68, 68, 0.3)' : 'rgba(52, 211, 153, 0.3)'}`
                  }}>
                    {med.isSedating ? 'SEDATING' : 'NON-SEDATING'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Side-Effect Crew Check-in (Astronaut self-reporting) */}
          <div className="space-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <FileText size={15} style={{ color: 'var(--emerald)' }} />
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                Subjective Symptoms & Adverse Reaction Check-in
              </span>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 14 }}>
              Next-day psychomotor vigilance assessment and vestibular disruption screening.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
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
                      background: isSelected ? 'rgba(56, 189, 248, 0.18)' : 'rgba(8, 14, 26, 0.6)',
                      border: `1px solid ${isSelected ? 'rgba(56, 189, 248, 0.45)' : 'rgba(255, 255, 255, 0.08)'}`,
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 11.5,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isSelected ? '✓ ' : '+ '} {symptom}
                  </button>
                );
              })}
            </div>

            <button 
              className="btn-secondary" 
              style={{ width: '100%', justifyContent: 'center', borderRadius: 999 }}
              onClick={() => alert('Side-effect telemetry logged to Mission Control electronic health record (EHR).')}
            >
              Submit Check-In to EHR Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
