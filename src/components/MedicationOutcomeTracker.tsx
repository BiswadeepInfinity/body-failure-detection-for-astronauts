import React, { useState } from 'react';
import { SPACE_FORMULARY_15 } from '../data/spaceFormulary15';
import { DoseOutcomeLog, SpaceDrugBayesianModel } from '../ml/doseResponseModel';
import { Astronaut } from '../types';
import { 
  Pill, 
  Clock, 
  Send, 
  CheckCircle2, 
  Radio, 
  AlertTriangle, 
  Database
} from 'lucide-react';

interface Props {
  astronauts: Astronaut[];
}

export const MedicationOutcomeTracker: React.FC<Props> = ({ astronauts }) => {
  const [selectedAstroId, setSelectedAstroId] = useState<string>('ast-01');
  const [selectedMedId, setSelectedMedId] = useState<string>('med-01');
  
  // Local Mars Network / Telemetry Simulator State
  const [marsSyncStatus, setMarsSyncStatus] = useState<'local' | 'syncing' | 'synced'>('local');

  // Pre-seeded Realistic Mission Pharmacovigilance Logs
  const [outcomeLogs, setOutcomeLogs] = useState<DoseOutcomeLog[]>([
    {
      id: 'log-01',
      astronautId: 'ast-01',
      astronautName: 'CDR Marcus Vance',
      medicationId: 'med-01',
      genericName: 'Ibuprofen 400mg',
      doseLoggedAt: 'MET Day 24 14:15',
      flightDay: 24,
      monthsInSpaceflight: 8,
      packagingType: 'Original Blister',
      reliefScore: 'complete',
      onsetSpeed: '30-60m',
      reportedSideEffects: ['None'],
      completedCheckIn: true
    },
    {
      id: 'log-02',
      astronautId: 'ast-01',
      astronautName: 'CDR Marcus Vance',
      medicationId: 'med-03',
      genericName: 'Zolpidem 10mg',
      doseLoggedAt: 'MET Day 22 22:30',
      flightDay: 22,
      monthsInSpaceflight: 8,
      packagingType: 'Original Blister',
      reliefScore: 'partial',
      onsetSpeed: '<30m',
      reportedSideEffects: ['Morning Grogginess / Hangover'],
      completedCheckIn: true
    },
    {
      id: 'log-03',
      astronautId: 'ast-03',
      astronautName: 'MS Kaito Tanaka',
      medicationId: 'med-05',
      genericName: 'Promethazine 25mg',
      doseLoggedAt: 'MET Day 27 08:20',
      flightDay: 27,
      monthsInSpaceflight: 14,
      packagingType: 'Repackaged Pouch',
      reliefScore: 'none',
      onsetSpeed: 'no-effect',
      reportedSideEffects: ['Drowsiness'],
      completedCheckIn: true
    },
    {
      id: 'log-04',
      astronautId: 'ast-04',
      astronautName: 'PLT Sarah Jenkins',
      medicationId: 'med-05',
      genericName: 'Promethazine 25mg',
      doseLoggedAt: 'MET Day 28 11:00',
      flightDay: 28,
      monthsInSpaceflight: 14,
      packagingType: 'Repackaged Pouch',
      reliefScore: 'none',
      onsetSpeed: 'no-effect',
      reportedSideEffects: ['None'],
      completedCheckIn: true
    }
  ]);

  // Active Pending Micro-Assessment modal / drawer for current astronaut
  const [activeCheckInLogId, setActiveCheckInLogId] = useState<string | null>(null);
  const [pendingRelief, setPendingRelief] = useState<'complete' | 'partial' | 'none' | 'worsened'>('partial');
  const [pendingOnset, setPendingOnset] = useState<'<30m' | '30-60m' | '>60m' | 'no-effect'>('30-60m');
  const [pendingSideEffects, setPendingSideEffects] = useState<string[]>(['None']);

  const selectedMed = SPACE_FORMULARY_15.find(m => m.id === selectedMedId) || SPACE_FORMULARY_15[0];
  const currentAstro = astronauts.find(a => a.id === selectedAstroId) || astronauts[0];

  // Run Custom Bayesian Drug Response AI Model
  const earthMap: Record<string, number> = {};
  SPACE_FORMULARY_15.forEach(m => { earthMap[m.id] = m.earthEfficacyBenchmarkPct; });
  const modelProfiles = SpaceDrugBayesianModel.evaluateFormulary(outcomeLogs, earthMap);

  // 1-Click Dose Logger
  const handleLogDose = () => {
    const newLog: DoseOutcomeLog = {
      id: `log-${Date.now()}`,
      astronautId: currentAstro.id,
      astronautName: currentAstro.name,
      medicationId: selectedMed.id,
      genericName: `${selectedMed.genericName} (${selectedMed.standardDose})`,
      doseLoggedAt: `MET Day ${currentAstro.missionDay} 16:45`,
      flightDay: currentAstro.missionDay,
      monthsInSpaceflight: 10,
      packagingType: selectedMed.stowageForm,
      reliefScore: 'partial',
      onsetSpeed: '30-60m',
      reportedSideEffects: ['None'],
      completedCheckIn: false
    };

    setOutcomeLogs([newLog, ...outcomeLogs]);
    setActiveCheckInLogId(newLog.id); // Triggers the simulated 2-tap prompt immediately
  };

  // Submit 2-Tap Astronaut Assessment
  const handleSubmitAssessment = () => {
    if (!activeCheckInLogId) return;

    setOutcomeLogs(prev => prev.map(l => {
      if (l.id === activeCheckInLogId) {
        return {
          ...l,
          reliefScore: pendingRelief,
          onsetSpeed: pendingOnset,
          reportedSideEffects: pendingSideEffects,
          completedCheckIn: true
        };
      }
      return l;
    }));

    setActiveCheckInLogId(null);
  };

  // Simulate Mars Store-and-Forward DSN transmission
  const handleSimulateSync = () => {
    setMarsSyncStatus('syncing');
    setTimeout(() => {
      setMarsSyncStatus('synced');
      setTimeout(() => setMarsSyncStatus('local'), 3500);
    }, 1500);
  };

  return (
    <div>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '4px 8px', borderRadius: 4, color: '#38bdf8', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>
            <Database size={13} /> Deep Space Pharmacovigilance & Real-World Evidence Registry
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff' }}>
            15-Medication Space First-Aid Tracker & Outcome Feedback
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Generating unprecedented clinical evidence on how Earth pharmaceuticals perform, metabolize, and degrade in microgravity.
          </p>
        </div>

        {/* Mars Store-and-Forward Status Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-subtle)', padding: '8px 14px', borderRadius: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <Radio size={14} style={{ color: marsSyncStatus === 'syncing' ? '#fbbf24' : '#10b981' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Mars Link:</span>
            <strong style={{ color: '#ffffff' }}>
              {marsSyncStatus === 'syncing' ? 'Transmitting to DSN (14 min delay)...' : (marsSyncStatus === 'synced' ? 'Packet Synced with Houston EHR' : 'Autonomous Offline Mode')}
            </strong>
          </div>
          <button 
            className="btn-secondary" 
            style={{ padding: '4px 10px', fontSize: 11 }}
            onClick={handleSimulateSync}
          >
            <Send size={11} /> Sync Packet
          </button>
        </div>
      </div>

      {/* Two Columns: Fast Dose Logging vs. Micro 2-Tap Check-in Prompt */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Left Column: 1-Click Dose Logger */}
        <div className="space-card">
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Pill size={16} style={{ color: '#38bdf8' }} /> 1. Log Medication from 15-Drug First-Aid Kit
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  Crew Member:
                </label>
                <select 
                  value={selectedAstroId} 
                  onChange={(e) => setSelectedAstroId(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-surface)', color: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '7px 10px', fontSize: 12 }}
                >
                  {astronauts.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  Select Medication:
                </label>
                <select 
                  value={selectedMedId} 
                  onChange={(e) => setSelectedMedId(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-surface)', color: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '7px 10px', fontSize: 12 }}
                >
                  {SPACE_FORMULARY_15.map(m => (
                    <option key={m.id} value={m.id}>{m.genericName} ({m.standardDose})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Drug Info Box */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <strong style={{ color: '#38bdf8', fontSize: 13 }}>{selectedMed.genericName} — {selectedMed.tradeName}</strong>
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(56, 189, 248, 0.15)', color: '#93c5fd' }}>
                  {selectedMed.stowageForm}
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                <strong>Microgravity Indication:</strong> {selectedMed.spaceIndication}
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-muted)' }}>
                <span>Route: <strong>{selectedMed.route}</strong></span>
                <span>Earth Benchmark: <strong>{selectedMed.earthEfficacyBenchmarkPct}%</strong></span>
                <span>Follow-up Window: <strong>+{selectedMed.followUpWindowMin} min</strong></span>
              </div>
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
              onClick={handleLogDose}
            >
              <Pill size={14} /> Record Dose Administered
            </button>
          </div>
        </div>

        {/* Right Column: 2-Tap Astronaut Micro Check-In Card */}
        <div className="space-card" style={{ borderColor: activeCheckInLogId ? '#38bdf8' : undefined }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={16} style={{ color: '#f59e0b' }} /> 2. Astronaut 2-Tap Clinical Check-In
          </h3>

          {!activeCheckInLogId ? (
            <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              <Clock size={28} style={{ margin: '0 auto 10px', color: '#64748b' }} />
              <div>No pending micro check-ins waiting right now.</div>
              <div style={{ fontSize: 11, marginTop: 4 }}>
                Log a dose on the left to simulate the automated post-dose symptom evaluation timer!
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 6, padding: '8px 12px', fontSize: 12, color: '#93c5fd' }}>
                Follow-up timer reached: How are your symptoms after taking <strong>{selectedMed.genericName}</strong>?
              </div>

              {/* Tap 1: Symptom Relief */}
              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Symptom Relief Level:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  {[
                    { label: 'Completely Gone', val: 'complete', color: '#10b981' },
                    { label: 'Partially Better', val: 'partial', color: '#f59e0b' },
                    { label: 'No Change', val: 'none', color: '#ef4444' },
                    { label: 'Worsened', val: 'worsened', color: '#dc2626' }
                  ].map(op => (
                    <button
                      key={op.val}
                      onClick={() => setPendingRelief(op.val as any)}
                      style={{
                        background: pendingRelief === op.val ? 'rgba(56, 189, 248, 0.25)' : 'var(--bg-surface)',
                        border: `1px solid ${pendingRelief === op.val ? '#38bdf8' : 'var(--border-subtle)'}`,
                        color: pendingRelief === op.val ? '#ffffff' : 'var(--text-main)',
                        padding: '6px 4px',
                        borderRadius: 6,
                        fontSize: 10,
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                    >
                      {op.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tap 2: Onset Speed */}
              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  How Fast Did It Kick In?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  {['<30m', '30-60m', '>60m', 'no-effect'].map(spd => (
                    <button
                      key={spd}
                      onClick={() => setPendingOnset(spd as any)}
                      style={{
                        background: pendingOnset === spd ? 'rgba(56, 189, 248, 0.25)' : 'var(--bg-surface)',
                        border: `1px solid ${pendingOnset === spd ? '#38bdf8' : 'var(--border-subtle)'}`,
                        color: pendingOnset === spd ? '#ffffff' : 'var(--text-main)',
                        padding: '6px 4px',
                        borderRadius: 6,
                        fontSize: 11,
                        cursor: 'pointer'
                      }}
                    >
                      {spd}
                    </button>
                  ))}
                </div>
              </div>

              {/* Side Effect Check */}
              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Any Microgravity Side Effects?
                </label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['None', 'Drowsiness', 'Stomach Upset / Reflux', 'Headache', 'Dizziness'].map(se => (
                    <button
                      key={se}
                      onClick={() => setPendingSideEffects([se])}
                      style={{
                        background: pendingSideEffects.includes(se) ? 'rgba(168, 85, 247, 0.2)' : 'var(--bg-surface)',
                        border: `1px solid ${pendingSideEffects.includes(se) ? '#c084fc' : 'var(--border-subtle)'}`,
                        color: pendingSideEffects.includes(se) ? '#e9d5ff' : 'var(--text-secondary)',
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        cursor: 'pointer'
                      }}
                    >
                      {se}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={handleSubmitAssessment}
              >
                <CheckCircle2 size={14} /> Submit 5-Second Check-in
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Real-World Space Evidence Table (Custom Bayesian Model Output) */}
      <div className="space-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff' }}>
              Real-World Spaceflight Drug Efficacy & Degradation Registry
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Synthesized by local Bayesian model: comparing Earth benchmarks vs. actual flight outcomes.
            </p>
          </div>
          <span style={{ fontSize: 11, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
            {outcomeLogs.length} Doses Evaluated
          </span>
        </div>

        <table className="space-table">
          <thead>
            <tr>
              <th>Medication</th>
              <th>Packaging / Storage</th>
              <th>Earth Benchmark</th>
              <th>Flight Efficacy (Bayesian)</th>
              <th>Efficacy Drift Δ</th>
              <th>Avg Onset</th>
              <th>Model Diagnosis & Stability Flag</th>
            </tr>
          </thead>
          <tbody>
            {SPACE_FORMULARY_15.map(med => {
              const prof = modelProfiles[med.id] || {
                earthBenchmarkPct: med.earthEfficacyBenchmarkPct,
                flightObservedEfficacyPct: med.earthEfficacyBenchmarkPct,
                efficacyDriftDeltaPct: 0,
                averageOnsetMins: 45,
                aiClinicalVerdict: 'Awaiting crew follow-up micro check-in telemetry.',
                degradationAlert: false
              };

              return (
                <tr key={med.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#ffffff' }}>{med.genericName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{med.tradeName} · {med.standardDose}</div>
                  </td>
                  <td>
                    <span style={{
                      fontSize: 11,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: med.stowageForm === 'Repackaged Pouch' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                      color: med.stowageForm === 'Repackaged Pouch' ? '#fcd34d' : '#93c5fd'
                    }}>
                      {med.stowageForm}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                      {med.earthEfficacyBenchmarkPct}%
                    </span>
                  </td>
                  <td>
                    <strong style={{ fontFamily: 'var(--font-mono)', color: prof.degradationAlert ? '#ef4444' : '#ffffff' }}>
                      {prof.flightObservedEfficacyPct}%
                    </strong>
                  </td>
                  <td>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      color: prof.efficacyDriftDeltaPct < -10 ? '#ef4444' : (prof.efficacyDriftDeltaPct === 0 ? 'var(--text-muted)' : '#10b981')
                    }}>
                      {prof.efficacyDriftDeltaPct > 0 ? '+' : ''}{prof.efficacyDriftDeltaPct}%
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)' }}>~{prof.averageOnsetMins} min</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {prof.degradationAlert && <AlertTriangle size={14} style={{ color: '#ef4444', flexShrink: 0 }} />}
                      <span style={{ fontSize: 11, color: prof.degradationAlert ? '#fca5a5' : 'var(--text-secondary)' }}>
                        {prof.aiClinicalVerdict}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
