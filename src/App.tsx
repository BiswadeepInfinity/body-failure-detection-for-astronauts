import React, { useState, useEffect } from 'react';
import { Astronaut, AlertThresholds, HealthAlert, DailyBiometrics } from './types';
import { generateSimulatedCrewData, evaluateAstronautAlerts } from './data/dataGenerator';
import { DEFAULT_THRESHOLDS } from './config/thresholds';
import { CrewOverview } from './components/CrewOverview';
import { AstronautDetail } from './components/AstronautDetail';
import { MedicationScreen } from './components/MedicationScreen';
import { SleepEffectivenessScreen } from './components/SleepEffectivenessScreen';
import { MedicineStockScreen } from './components/MedicineStockScreen';
import { AlertsLogScreen } from './components/AlertsLogScreen';
import { AdaptiveMLScreen } from './components/AdaptiveMLScreen';
import { MedicationOutcomeTracker } from './components/MedicationOutcomeTracker';
import { PredictiveFailureDashboard } from './components/PredictiveFailureDashboard';
import { SettingsModal } from './components/SettingsModal';
import { DemoWalkthroughModal } from './components/DemoWalkthroughModal';
import { MLModelDebugger } from './components/MLModelDebugger';
import { ScientistProfilePortal } from './components/ScientistProfilePortal';

import { 
  Users, 
  Activity, 
  Pill, 
  Bell, 
  Play, 
  ShieldCheck, 
  WifiOff,
  Sliders,
  X,
  Binary,
  Calendar
} from 'lucide-react';

type MainSection = 'crew_health' | 'scientist_portal' | 'predictive_intelligence' | 'pharmacology' | 'alerts_log' | 'ml_debugger';
type SubTabPharmacy = 'logging' | 'outcomes' | 'efficacy' | 'inventory';
type SubTabIntelligence = 'failure_forecast' | 'adaptive_manifold';

export const App: React.FC = () => {
  // Navigation State
  const [activeSection, setActiveSection] = useState<MainSection>('crew_health');
  const [selectedSubPharmacy, setSelectedSubPharmacy] = useState<SubTabPharmacy>('logging');
  const [selectedSubIntelligence, setSelectedSubIntelligence] = useState<SubTabIntelligence>('adaptive_manifold');
  const [detailViewAstroId, setDetailViewAstroId] = useState<string | null>(null);

  // Core Data
  const [astronauts, setAstronauts] = useState<Astronaut[]>([]);
  const [selectedAstronautId, setSelectedAstronautId] = useState<string>('ast-01');
  const [thresholds, setThresholds] = useState<AlertThresholds>(DEFAULT_THRESHOLDS);
  
  // Modals
  const [showSettings, setShowSettings] = useState(false);
  const [showDemoGuide, setShowDemoGuide] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const data = generateSimulatedCrewData();
    setAstronauts(data);
  }, []);

  const currentAstronaut = astronauts.find(a => a.id === selectedAstronautId) || astronauts[0];
  const allAlerts: HealthAlert[] = astronauts.flatMap(a => a.recentAlerts);

  // Handle logging new medication
  const handleLogMedication = (astronautId: string, drugName: string, dose: string) => {
    setAstronauts(prev => prev.map(a => {
      if (a.id !== astronautId) return a;

      const updatedHistory = [...a.history];
      const todayRecord = { ...updatedHistory[updatedHistory.length - 1] };
      todayRecord.medicationsTaken = [...todayRecord.medicationsTaken, `${drugName} ${dose}`];
      updatedHistory[updatedHistory.length - 1] = todayRecord;

      const tempAstro = { ...a, history: updatedHistory };
      const newAlerts = evaluateAstronautAlerts(tempAstro);
      const hasCrit = newAlerts.some(alt => alt.level === 'red');
      const hasCaution = newAlerts.some(alt => alt.level === 'yellow');

      return {
        ...tempAstro,
        overallStatus: hasCrit ? 'red' : (hasCaution ? 'yellow' : 'green'),
        recentAlerts: newAlerts,
        topAlertSummary: newAlerts.length > 0 ? newAlerts[0].title : 'Telemetry within baseline limits.'
      };
    }));

    alert(`Logged ${drugName} ${dose}. Decision-support telemetry evaluated.`);
  };

  const handleUpdateAlertNote = (alertId: string, note: string) => {
    setAstronauts(prev => prev.map(a => ({
      ...a,
      recentAlerts: a.recentAlerts.map(alt => alt.id === alertId ? { ...alt, flightSurgeonNote: note } : alt)
    })));
  };

  // Handle Scientist updating or adding a daily log via their profile calendar
  const handleUpdateDailyLog = (astronautId: string, log: DailyBiometrics) => {
    setAstronauts(prev => prev.map(a => {
      if (a.id !== astronautId) return a;

      const existingIdx = a.history.findIndex(h => h.day === log.day);
      let updatedHistory = [...a.history];

      if (existingIdx >= 0) {
        updatedHistory[existingIdx] = log;
      } else {
        updatedHistory.push(log);
        updatedHistory.sort((x, y) => x.day - y.day);
      }

      const tempAstro = { ...a, history: updatedHistory };
      const newAlerts = evaluateAstronautAlerts(tempAstro);
      const hasCrit = newAlerts.some(alt => alt.level === 'red');
      const hasCaution = newAlerts.some(alt => alt.level === 'yellow');

      return {
        ...tempAstro,
        overallStatus: hasCrit ? 'red' : (hasCaution ? 'yellow' : 'green'),
        recentAlerts: newAlerts,
        topAlertSummary: newAlerts.length > 0 ? newAlerts[0].title : 'Telemetry within baseline limits.'
      };
    }));
  };

  return (
    <div className="app-container">
      {/* Top Header Navbar */}
      <header className="top-nav" style={{ padding: '12px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="brand-section" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="nasa-meatball" style={{ fontWeight: 800, letterSpacing: 1 }}>NASA</div>
          <div className="app-title-group">
            <h1 style={{ fontSize: 17, fontWeight: 700, margin: 0, letterSpacing: '0.5px', color: '#ffffff' }}>
              ASTRONAUT PHYSIOLOGICAL & PHARMACOLOGICAL MONITOR
            </h1>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
              Autonomous Edge Clinical Decision Support · Grounded in MMASH & WESAD Telemetry
            </div>
          </div>
        </div>

        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Demo walkthrough trigger */}
          <button 
            className="btn-primary" 
            style={{ background: '#f59e0b', color: '#000', fontWeight: 700, padding: '7px 14px', fontSize: 12, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => setShowDemoGuide(true)}
          >
            <Play size={13} fill="#000" /> Guided Mission Script
          </button>

          {/* Settings button */}
          <button 
            className="btn-secondary" 
            onClick={() => setShowSettings(true)}
            title="Configure Clinical Thresholds"
            style={{ padding: '7px 10px', borderRadius: 6 }}
          >
            <Sliders size={14} />
          </button>
        </div>
      </header>

      {/* Edge Offline Notice */}
      <div className="disclaimer-banner" style={{ background: 'rgba(15, 23, 42, 0.9)', borderBottom: '1px solid var(--border-subtle)', padding: '6px 24px', fontSize: 11, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
          <ShieldCheck size={14} style={{ color: '#10b981' }} />
          <span><strong>CLINICAL DECISION SUPPORT PROTOTYPE</strong> · Multi-Axial Biometrics & Drug Pharmacokinetics</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#38bdf8' }}>
          <WifiOff size={12} />
          <span>Local Spacecraft Edge Execution (Zero Earth Transit Latency)</span>
        </div>
      </div>

      {/* Main Clean Navigation Tabs */}
      <nav className="tab-navigation" style={{ display: 'flex', gap: 8, padding: '10px 24px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
        {/* Tab 1: Crew Health Overview */}
        <button 
          className={`nav-tab-btn ${activeSection === 'crew_health' ? 'active' : ''}`}
          onClick={() => {
            setActiveSection('crew_health');
            setDetailViewAstroId(null);
          }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 6, fontWeight: 600, fontSize: 13 }}
        >
          <Users size={16} /> 1. Mission Control Overview
        </button>

        {/* Tab 2: NEW Scientist Profile & Calendar Journal */}
        <button 
          className={`nav-tab-btn ${activeSection === 'scientist_portal' ? 'active' : ''}`}
          onClick={() => setActiveSection('scientist_portal')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 6, fontWeight: 600, fontSize: 13, borderColor: activeSection === 'scientist_portal' ? '#38bdf8' : undefined }}
        >
          <Calendar size={16} style={{ color: '#38bdf8' }} /> 2. Scientist Profiles & Calendar Logs
          <span style={{ fontSize: 10, background: '#0284c7', color: '#fff', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
            DAILY JOURNAL
          </span>
        </button>

        {/* Tab 3: Predictive & Adaptive Intelligence */}
        <button 
          className={`nav-tab-btn ${activeSection === 'predictive_intelligence' ? 'active' : ''}`}
          onClick={() => setActiveSection('predictive_intelligence')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 6, fontWeight: 600, fontSize: 13, borderColor: activeSection === 'predictive_intelligence' ? '#c084fc' : undefined }}
        >
          <Activity size={16} style={{ color: '#c084fc' }} /> 3. Adaptive AI & Failure Forecasting
          <span style={{ fontSize: 10, background: '#a855f7', color: '#fff', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
            N=1 ML
          </span>
        </button>

        {/* Tab 4: Spaceflight Pharmacology */}
        <button 
          className={`nav-tab-btn ${activeSection === 'pharmacology' ? 'active' : ''}`}
          onClick={() => setActiveSection('pharmacology')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 6, fontWeight: 600, fontSize: 13, borderColor: activeSection === 'pharmacology' ? '#38bdf8' : undefined }}
        >
          <Pill size={16} style={{ color: '#38bdf8' }} /> 4. Space Pharmacology & Formulary
          <span style={{ fontSize: 10, background: '#0284c7', color: '#fff', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
            15 DRUGS
          </span>
        </button>

        {/* Tab 5: Clinical Triage & Alerts */}
        <button 
          className={`nav-tab-btn ${activeSection === 'alerts_log' ? 'active' : ''}`}
          onClick={() => setActiveSection('alerts_log')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 6, fontWeight: 600, fontSize: 13 }}
        >
          <Bell size={16} /> 5. Clinical Alerts
          {allAlerts.length > 0 && (
            <span style={{
              background: allAlerts.some(a => a.level === 'red') ? '#ef4444' : '#f59e0b',
              color: '#ffffff',
              fontSize: 10,
              padding: '1px 6px',
              borderRadius: 10,
              fontWeight: 700
            }}>
              {allAlerts.length}
            </span>
          )}
        </button>

        {/* Tab 6: ML Math & Diagnostics Debugger */}
        <button 
          className={`nav-tab-btn ${activeSection === 'ml_debugger' ? 'active' : ''}`}
          onClick={() => setActiveSection('ml_debugger')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 6, fontWeight: 600, fontSize: 13, borderColor: activeSection === 'ml_debugger' ? '#38bdf8' : undefined }}
        >
          <Binary size={16} style={{ color: '#38bdf8' }} /> 6. ML Model Debugger Sandbox
        </button>
      </nav>

      {/* Sub-navigation for Tab 2 (Predictive Intelligence) */}
      {activeSection === 'predictive_intelligence' && (
        <div style={{ display: 'flex', gap: 10, padding: '8px 24px', background: 'rgba(15, 23, 42, 0.7)', borderBottom: '1px solid var(--border-subtle)', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>View Mode:</span>
          <button 
            style={{
              background: selectedSubIntelligence === 'adaptive_manifold' ? '#a855f7' : 'transparent',
              color: '#ffffff',
              border: '1px solid',
              borderColor: selectedSubIntelligence === 'adaptive_manifold' ? '#a855f7' : 'var(--border-subtle)',
              padding: '4px 12px',
              borderRadius: 4,
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: 500
            }}
            onClick={() => setSelectedSubIntelligence('adaptive_manifold')}
          >
            Adaptive Manifold & Naive Bayes Hypotheses ($D_M$ Distance)
          </button>
          <button 
            style={{
              background: selectedSubIntelligence === 'failure_forecast' ? '#ef4444' : 'transparent',
              color: '#ffffff',
              border: '1px solid',
              borderColor: selectedSubIntelligence === 'failure_forecast' ? '#ef4444' : 'var(--border-subtle)',
              padding: '4px 12px',
              borderRadius: 4,
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: 500
            }}
            onClick={() => setSelectedSubIntelligence('failure_forecast')}
          >
            Pre-Symptomatic Failure Prognostics (24-72h Trajectory)
          </button>
        </div>
      )}

      {/* Sub-navigation for Tab 3 (Pharmacology) */}
      {activeSection === 'pharmacology' && (
        <div style={{ display: 'flex', gap: 10, padding: '8px 24px', background: 'rgba(15, 23, 42, 0.7)', borderBottom: '1px solid var(--border-subtle)', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Formulary View:</span>
          <button 
            style={{
              background: selectedSubPharmacy === 'logging' ? '#0284c7' : 'transparent',
              color: '#ffffff',
              border: '1px solid',
              borderColor: selectedSubPharmacy === 'logging' ? '#0284c7' : 'var(--border-subtle)',
              padding: '4px 12px',
              borderRadius: 4,
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: 500
            }}
            onClick={() => setSelectedSubPharmacy('logging')}
          >
            Dose Logging & Interaction Screen
          </button>
          <button 
            style={{
              background: selectedSubPharmacy === 'outcomes' ? '#0284c7' : 'transparent',
              color: '#ffffff',
              border: '1px solid',
              borderColor: selectedSubPharmacy === 'outcomes' ? '#0284c7' : 'var(--border-subtle)',
              padding: '4px 12px',
              borderRadius: 4,
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: 500
            }}
            onClick={() => setSelectedSubPharmacy('outcomes')}
          >
            15-Drug Micro Check-In Registry
          </button>
          <button 
            style={{
              background: selectedSubPharmacy === 'efficacy' ? '#0284c7' : 'transparent',
              color: '#ffffff',
              border: '1px solid',
              borderColor: selectedSubPharmacy === 'efficacy' ? '#0284c7' : 'var(--border-subtle)',
              padding: '4px 12px',
              borderRadius: 4,
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: 500
            }}
            onClick={() => setSelectedSubPharmacy('efficacy')}
          >
            Hypnotic Efficacy (Latency vs Sleep Duration)
          </button>
          <button 
            style={{
              background: selectedSubPharmacy === 'inventory' ? '#0284c7' : 'transparent',
              color: '#ffffff',
              border: '1px solid',
              borderColor: selectedSubPharmacy === 'inventory' ? '#0284c7' : 'var(--border-subtle)',
              padding: '4px 12px',
              borderRadius: 4,
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: 500
            }}
            onClick={() => setSelectedSubPharmacy('inventory')}
          >
            Stowage Inventory & Degradation (Reichard 2023)
          </button>
        </div>
      )}

      {/* Main Viewport Content */}
      <main className="main-viewport" style={{ padding: '24px' }}>
        {astronauts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
            Loading empirical telemetry streams and calculating multi-axial baselines...
          </div>
        ) : (
          <>
            {/* Section 1: Crew Health & Baselines */}
            {activeSection === 'crew_health' && (
              detailViewAstroId ? (
                <AstronautDetail 
                  astronaut={astronauts.find(a => a.id === detailViewAstroId) || currentAstronaut}
                  onBack={() => setDetailViewAstroId(null)}
                  onOpenMedication={() => {
                    setSelectedAstronautId(detailViewAstroId);
                    setActiveSection('pharmacology');
                    setSelectedSubPharmacy('logging');
                  }}
                />
              ) : (
                <CrewOverview 
                  astronauts={astronauts}
                  onSelectAstronaut={(id) => {
                    setSelectedAstronautId(id);
                    setDetailViewAstroId(id);
                  }}
                />
              )
            )}

            {/* Section 2: NEW Scientist Profile & Calendar Journal Portal */}
            {activeSection === 'scientist_portal' && (
              <ScientistProfilePortal 
                astronauts={astronauts}
                onUpdateDailyLog={handleUpdateDailyLog}
              />
            )}

            {/* Section 2: Adaptive AI & Failure Forecasting */}
            {activeSection === 'predictive_intelligence' && (
              selectedSubIntelligence === 'adaptive_manifold' ? (
                <AdaptiveMLScreen astronauts={astronauts} />
              ) : (
                <PredictiveFailureDashboard astronauts={astronauts} />
              )
            )}

            {/* Section 3: Space Pharmacology */}
            {activeSection === 'pharmacology' && (
              <>
                {selectedSubPharmacy === 'logging' && (
                  <MedicationScreen 
                    astronaut={currentAstronaut}
                    onLogMedication={handleLogMedication}
                  />
                )}
                {selectedSubPharmacy === 'outcomes' && (
                  <MedicationOutcomeTracker astronauts={astronauts} />
                )}
                {selectedSubPharmacy === 'efficacy' && (
                  <SleepEffectivenessScreen astronauts={astronauts} />
                )}
                {selectedSubPharmacy === 'inventory' && (
                  <MedicineStockScreen />
                )}
              </>
            )}

            {/* Section 4: Clinical Triage & Alerts */}
            {activeSection === 'alerts_log' && (
              <AlertsLogScreen 
                alerts={allAlerts}
                onUpdateAlertNote={handleUpdateAlertNote}
              />
            )}

            {/* Section 5: ML Model Debugger */}
            {activeSection === 'ml_debugger' && (
              <MLModelDebugger astronauts={astronauts} />
            )}
          </>
        )}
      </main>

      {/* Thresholds Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
              <button 
                onClick={() => setShowSettings(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            <SettingsModal 
              thresholds={thresholds}
              onUpdateThresholds={(t) => {
                setThresholds(t);
                setShowSettings(false);
              }}
              onResetDefaults={() => setThresholds(DEFAULT_THRESHOLDS)}
            />
          </div>
        </div>
      )}

      {/* Guided Walkthrough Script Modal */}
      {showDemoGuide && (
        <div className="modal-overlay" onClick={() => setShowDemoGuide(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
              <button 
                onClick={() => setShowDemoGuide(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            <DemoWalkthroughModal 
              onStepChange={(_, tab, astroId) => {
                if (astroId) setSelectedAstronautId(astroId);
                if (tab === 'overview') {
                  setActiveSection('crew_health');
                  setDetailViewAstroId(null);
                } else if (tab === 'detail') {
                  setActiveSection('crew_health');
                  setDetailViewAstroId(astroId || 'ast-01');
                } else if (tab === 'adaptive_ml') {
                  setActiveSection('predictive_intelligence');
                  setSelectedSubIntelligence('adaptive_manifold');
                } else if (tab === 'predictive_failure') {
                  setActiveSection('predictive_intelligence');
                  setSelectedSubIntelligence('failure_forecast');
                } else if (tab === 'medication') {
                  setActiveSection('pharmacology');
                  setSelectedSubPharmacy('logging');
                } else if (tab === 'sleep_effectiveness') {
                  setActiveSection('pharmacology');
                  setSelectedSubPharmacy('efficacy');
                } else if (tab === 'stock') {
                  setActiveSection('pharmacology');
                  setSelectedSubPharmacy('inventory');
                } else if (tab === 'alerts') {
                  setActiveSection('alerts_log');
                }
              }}
              onClose={() => setShowDemoGuide(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
