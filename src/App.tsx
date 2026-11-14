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
import { DeepSpaceBackground } from './components/DeepSpaceBackground';

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
    <div className="app-container" style={{ position: 'relative', overflowX: 'hidden' }}>
      {/* Immersive Deep Space Ambient Canvas */}
      <DeepSpaceBackground />

      {/* Floating Liquid Glass Navigation Capsule */}
      <header className="glass-nav-bar">
        {/* Brand Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: 11.5,
            letterSpacing: '1.5px',
            padding: '5px 12px',
            borderRadius: 999,
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)'
          }}>
            NASA
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14.5, fontWeight: 700, color: '#ffffff', letterSpacing: '0.4px' }}>
                EXPEDITION 71 · BIOMONITOR & CLINICAL DECISION SUPPORT
              </span>
              <span style={{
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                color: '#38bdf8',
                fontSize: 10,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 999,
                letterSpacing: 0.5
              }}>
                EDGE N=1
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2, fontFamily: 'var(--font-mono)' }}>
              <WifiOff size={11} style={{ color: '#38bdf8' }} />
              <span>Offline Edge Deep-Space Execution · Zero Ground Latency</span>
            </div>
          </div>
        </div>

        {/* Central Segmented Pill Track */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(7, 12, 22, 0.65)',
          backdropFilter: 'blur(16px)',
          padding: '5px 8px',
          borderRadius: 999,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)'
        }}>
          <button
            onClick={() => {
              setActiveSection('crew_health');
              setDetailViewAstroId(null);
            }}
            style={{
              background: activeSection === 'crew_health' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
              color: activeSection === 'crew_health' ? '#ffffff' : '#94a3b8',
              border: activeSection === 'crew_health' ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
              borderRadius: 999,
              padding: '8px 16px',
              fontSize: 13.5,
              fontWeight: activeSection === 'crew_health' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s ease'
            }}
          >
            <Users size={15} style={{ color: activeSection === 'crew_health' ? '#38bdf8' : 'inherit' }} />
            <span>Mission Control</span>
          </button>

          <button
            onClick={() => setActiveSection('scientist_portal')}
            style={{
              background: activeSection === 'scientist_portal' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
              color: activeSection === 'scientist_portal' ? '#ffffff' : '#94a3b8',
              border: activeSection === 'scientist_portal' ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
              borderRadius: 999,
              padding: '8px 16px',
              fontSize: 13.5,
              fontWeight: activeSection === 'scientist_portal' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s ease'
            }}
          >
            <Calendar size={15} style={{ color: activeSection === 'scientist_portal' ? '#38bdf8' : 'inherit' }} />
            <span>Scientist Profiles</span>
          </button>

          <button
            onClick={() => setActiveSection('predictive_intelligence')}
            style={{
              background: activeSection === 'predictive_intelligence' ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
              color: activeSection === 'predictive_intelligence' ? '#ffffff' : '#94a3b8',
              border: activeSection === 'predictive_intelligence' ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid transparent',
              borderRadius: 999,
              padding: '8px 16px',
              fontSize: 13.5,
              fontWeight: activeSection === 'predictive_intelligence' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s ease'
            }}
          >
            <Activity size={15} style={{ color: activeSection === 'predictive_intelligence' ? '#c084fc' : 'inherit' }} />
            <span>Adaptive AI</span>
          </button>

          <button
            onClick={() => setActiveSection('pharmacology')}
            style={{
              background: activeSection === 'pharmacology' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
              color: activeSection === 'pharmacology' ? '#ffffff' : '#94a3b8',
              border: activeSection === 'pharmacology' ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
              borderRadius: 999,
              padding: '8px 16px',
              fontSize: 13.5,
              fontWeight: activeSection === 'pharmacology' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s ease'
            }}
          >
            <Pill size={15} style={{ color: activeSection === 'pharmacology' ? '#38bdf8' : 'inherit' }} />
            <span>Pharmacology</span>
          </button>

          <button
            onClick={() => setActiveSection('alerts_log')}
            style={{
              background: activeSection === 'alerts_log' ? 'rgba(244, 63, 94, 0.2)' : 'transparent',
              color: activeSection === 'alerts_log' ? '#ffffff' : '#94a3b8',
              border: activeSection === 'alerts_log' ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid transparent',
              borderRadius: 999,
              padding: '8px 16px',
              fontSize: 13.5,
              fontWeight: activeSection === 'alerts_log' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s ease'
            }}
          >
            <Bell size={15} style={{ color: activeSection === 'alerts_log' ? '#f87171' : 'inherit' }} />
            <span>Alerts</span>
            {allAlerts.length > 0 && (
              <span style={{
                background: allAlerts.some(a => a.level === 'red') ? '#f43f5e' : '#f59e0b',
                color: '#ffffff',
                fontSize: 10.5,
                padding: '1px 7px',
                borderRadius: 999,
                fontWeight: 800
              }}>
                {allAlerts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSection('ml_debugger')}
            style={{
              background: activeSection === 'ml_debugger' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
              color: activeSection === 'ml_debugger' ? '#ffffff' : '#94a3b8',
              border: activeSection === 'ml_debugger' ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
              borderRadius: 999,
              padding: '8px 16px',
              fontSize: 13.5,
              fontWeight: activeSection === 'ml_debugger' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s ease'
            }}
          >
            <Binary size={15} style={{ color: activeSection === 'ml_debugger' ? '#38bdf8' : 'inherit' }} />
            <span>Debugger</span>
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button 
            className="btn-primary" 
            style={{ 
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(217, 119, 6, 0.9) 100%)', 
              color: '#000000', 
              fontWeight: 700, 
              padding: '7px 16px', 
              fontSize: 12.5, 
              borderRadius: 999, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6,
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)'
            }}
            onClick={() => setShowDemoGuide(true)}
          >
            <Play size={12} fill="#000" /> Mission Script
          </button>

          <button 
            className="btn-secondary" 
            onClick={() => setShowSettings(true)}
            title="Configure Clinical Thresholds"
            style={{ 
              padding: '7px 10px', 
              borderRadius: 999, 
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}
          >
            <Sliders size={14} />
          </button>
        </div>
      </header>

      {/* Sub-navigation for Tab 2 (Predictive Intelligence) - Clean minimal style without heavy boxes */}
      {activeSection === 'predictive_intelligence' && (
        <div style={{ display: 'flex', gap: 24, padding: '10px 32px', background: 'rgba(5, 7, 10, 0.95)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', alignItems: 'center' }}>
          <span style={{ fontSize: 11.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>Mode:</span>
          <button 
            style={{
              background: 'transparent',
              color: selectedSubIntelligence === 'adaptive_manifold' ? '#c084fc' : 'var(--text-secondary)',
              border: 'none',
              borderBottom: selectedSubIntelligence === 'adaptive_manifold' ? '1.5px solid #a855f7' : '1.5px solid transparent',
              padding: '4px 2px',
              fontSize: 13,
              cursor: 'pointer',
              fontWeight: selectedSubIntelligence === 'adaptive_manifold' ? 600 : 400
            }}
            onClick={() => setSelectedSubIntelligence('adaptive_manifold')}
          >
            Adaptive Manifold & Bayes Hypotheses (D_M)
          </button>
          <button 
            style={{
              background: 'transparent',
              color: selectedSubIntelligence === 'failure_forecast' ? '#f87171' : 'var(--text-secondary)',
              border: 'none',
              borderBottom: selectedSubIntelligence === 'failure_forecast' ? '1.5px solid #ef4444' : '1.5px solid transparent',
              padding: '4px 2px',
              fontSize: 13,
              cursor: 'pointer',
              fontWeight: selectedSubIntelligence === 'failure_forecast' ? 600 : 400
            }}
            onClick={() => setSelectedSubIntelligence('failure_forecast')}
          >
            Failure Prognostics (24-72h Trajectory)
          </button>
        </div>
      )}

      {/* Sub-navigation for Tab 3 (Pharmacology) - Clean minimal style without heavy boxes */}
      {activeSection === 'pharmacology' && (
        <div style={{ display: 'flex', gap: 24, padding: '10px 32px', background: 'rgba(5, 7, 10, 0.95)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', alignItems: 'center' }}>
          <span style={{ fontSize: 11.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>Formulary View:</span>
          <button 
            style={{
              background: 'transparent',
              color: selectedSubPharmacy === 'logging' ? '#38bdf8' : 'var(--text-secondary)',
              border: 'none',
              borderBottom: selectedSubPharmacy === 'logging' ? '1.5px solid #38bdf8' : '1.5px solid transparent',
              padding: '4px 2px',
              fontSize: 13,
              cursor: 'pointer',
              fontWeight: selectedSubPharmacy === 'logging' ? 600 : 400
            }}
            onClick={() => setSelectedSubPharmacy('logging')}
          >
            Dose Logging & Interaction Screen
          </button>
          <button 
            style={{
              background: 'transparent',
              color: selectedSubPharmacy === 'outcomes' ? '#38bdf8' : 'var(--text-secondary)',
              border: 'none',
              borderBottom: selectedSubPharmacy === 'outcomes' ? '1.5px solid #38bdf8' : '1.5px solid transparent',
              padding: '4px 2px',
              fontSize: 13,
              cursor: 'pointer',
              fontWeight: selectedSubPharmacy === 'outcomes' ? 600 : 400
            }}
            onClick={() => setSelectedSubPharmacy('outcomes')}
          >
            15-Drug Micro Check-In Registry
          </button>
          <button 
            style={{
              background: 'transparent',
              color: selectedSubPharmacy === 'efficacy' ? '#38bdf8' : 'var(--text-secondary)',
              border: 'none',
              borderBottom: selectedSubPharmacy === 'efficacy' ? '1.5px solid #38bdf8' : '1.5px solid transparent',
              padding: '4px 2px',
              fontSize: 13,
              cursor: 'pointer',
              fontWeight: selectedSubPharmacy === 'efficacy' ? 600 : 400
            }}
            onClick={() => setSelectedSubPharmacy('efficacy')}
          >
            Hypnotic Efficacy (Latency vs Sleep Duration)
          </button>
          <button 
            style={{
              background: 'transparent',
              color: selectedSubPharmacy === 'inventory' ? '#38bdf8' : 'var(--text-secondary)',
              border: 'none',
              borderBottom: selectedSubPharmacy === 'inventory' ? '1.5px solid #38bdf8' : '1.5px solid transparent',
              padding: '4px 2px',
              fontSize: 13,
              cursor: 'pointer',
              fontWeight: selectedSubPharmacy === 'inventory' ? 600 : 400
            }}
            onClick={() => setSelectedSubPharmacy('inventory')}
          >
            Stowage Inventory & Degradation (Reichard 2023)
          </button>
        </div>
      )}

      {/* Main Viewport Content */}
      <main className="main-viewport" style={{ position: 'relative', zIndex: 1 }}>
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

      {/* Floating Transparent Guided Demo Walkthrough (No dimming backdrop, floating HUD capsule) */}
      {showDemoGuide && (
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
            } else if (tab === 'scientist_portal') {
              setActiveSection('scientist_portal');
            } else if (tab === 'ml_debugger') {
              setActiveSection('ml_debugger');
            }
          }}
          onClose={() => setShowDemoGuide(false)}
        />
      )}
    </div>
  );
};

export default App;
