import React, { useState, useEffect } from 'react';
import { Astronaut, AlertThresholds, HealthAlert } from './types';
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

import { 
  Users, 
  User, 
  Pill, 
  Moon, 
  Package, 
  Bell, 
  Sliders, 
  Play, 
  ShieldCheck, 
  WifiOff,
  X,
  BrainCircuit,
  ClipboardCheck,
  Zap
} from 'lucide-react';

type TabType = 'overview' | 'predictive_failure' | 'detail' | 'medication' | 'med_feedback' | 'sleep_effectiveness' | 'stock' | 'alerts' | 'adaptive_ml';
type UserRole = 'flight_surgeon' | 'astronaut';

export const App: React.FC = () => {
  // Application State
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('flight_surgeon');
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

  // Flatten all alerts across all astronauts for Mission Control Alerts Feed
  const allAlerts: HealthAlert[] = astronauts.flatMap(a => a.recentAlerts);

  // Handle logging new medication
  const handleLogMedication = (astronautId: string, drugName: string, dose: string) => {
    setAstronauts(prev => prev.map(a => {
      if (a.id !== astronautId) return a;

      const updatedHistory = [...a.history];
      const todayRecord = { ...updatedHistory[updatedHistory.length - 1] };
      todayRecord.medicationsTaken = [...todayRecord.medicationsTaken, `${drugName} ${dose}`];
      updatedHistory[updatedHistory.length - 1] = todayRecord;

      // Re-run alert evaluation
      const tempAstro = { ...a, history: updatedHistory };
      const newAlerts = evaluateAstronautAlerts(tempAstro);

      const hasCrit = newAlerts.some(alt => alt.level === 'red');
      const hasCaution = newAlerts.some(alt => alt.level === 'yellow');

      return {
        ...tempAstro,
        overallStatus: hasCrit ? 'red' : (hasCaution ? 'yellow' : 'green'),
        recentAlerts: newAlerts,
        topAlertSummary: newAlerts.length > 0 ? newAlerts[0].title : 'Telemetry within normal limits.'
      };
    }));

    alert(`Logged ${drugName} ${dose}. Decision-support alert engine updated telemetry!`);
  };

  // Handle updating Flight Surgeon clinical note
  const handleUpdateAlertNote = (alertId: string, note: string) => {
    setAstronauts(prev => prev.map(a => ({
      ...a,
      recentAlerts: a.recentAlerts.map(alt => alt.id === alertId ? { ...alt, flightSurgeonNote: note } : alt)
    })));
  };

  return (
    <div className="app-container">
      {/* Top Header Navbar */}
      <header className="top-nav">
        <div className="brand-section">
          <div className="nasa-meatball">NASA</div>
          <div className="app-title-group">
            <h1>ASTRONAUT HEALTH + MEDICATION MONITOR</h1>
            <div className="sub">EXPEDITION 71 · CLINICAL DECISION SUPPORT SYSTEM · 100% OFFLINE READY</div>
          </div>
        </div>

        <div className="nav-actions">
          {/* Demo walkthrough trigger */}
          <button 
            className="btn-primary" 
            style={{ background: '#f59e0b', color: '#000', fontWeight: 600, padding: '5px 12px', fontSize: 12 }}
            onClick={() => setShowDemoGuide(true)}
          >
            <Play size={13} fill="#000" /> Hackathon Demo Script
          </button>

          {/* User Role Switcher */}
          <div className="role-switcher">
            <button 
              className={`role-btn ${currentUserRole === 'flight_surgeon' ? 'active' : ''}`}
              onClick={() => setCurrentUserRole('flight_surgeon')}
            >
              <Users size={13} /> Flight Surgeon
            </button>
            <button 
              className={`role-btn ${currentUserRole === 'astronaut' ? 'active' : ''}`}
              onClick={() => setCurrentUserRole('astronaut')}
            >
              <User size={13} /> Astronaut View
            </button>
          </div>

          {/* Settings button */}
          <button 
            className="btn-secondary" 
            onClick={() => setShowSettings(true)}
            title="Configure Alert Thresholds"
          >
            <Sliders size={14} />
          </button>
        </div>
      </header>

      {/* Mandatory Non-Medical Prototype Disclaimer Banner */}
      <div className="disclaimer-banner">
        <ShieldCheck size={14} />
        <span>
          <strong>DECISION-SUPPORT PROTOTYPE:</strong> Developed for NASA Space Apps Challenge 2026. Uses simulated crew physiological data. Not an FDA/CE medical device.
        </span>
        <span style={{ marginLeft: 12, display: 'inline-flex', alignItems: 'center', gap: 4, color: '#38bdf8' }}>
          <WifiOff size={11} /> Deep Space Local Browser Storage (Zero Latency)
        </span>
      </div>

      {/* Navigation Tabs */}
      <nav className="tab-navigation">
        <button 
          className={`nav-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Users size={15} /> Crew Overview
        </button>

        <button 
          className={`nav-tab-btn ${activeTab === 'predictive_failure' ? 'active' : ''}`}
          onClick={() => setActiveTab('predictive_failure')}
          style={{ borderColor: activeTab === 'predictive_failure' ? '#ef4444' : undefined }}
        >
          <Zap size={15} style={{ color: '#f87171' }} /> Failure Forecast (T-24h to 72h)
          <span style={{ fontSize: 9, background: '#ef4444', color: '#fff', padding: '1px 5px', borderRadius: 10, marginLeft: 4, fontWeight: 700 }}>
            PRIMARY AIM
          </span>
        </button>

        <button 
          className={`nav-tab-btn ${activeTab === 'detail' ? 'active' : ''}`}
          onClick={() => setActiveTab('detail')}
        >
          <User size={15} /> Astronaut Detail & Baseline
        </button>

        <button 
          className={`nav-tab-btn ${activeTab === 'medication' ? 'active' : ''}`}
          onClick={() => setActiveTab('medication')}
        >
          <Pill size={15} /> Medication & Interactions
        </button>

        <button 
          className={`nav-tab-btn ${activeTab === 'med_feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('med_feedback')}
          style={{ borderColor: activeTab === 'med_feedback' ? '#38bdf8' : undefined }}
        >
          <ClipboardCheck size={15} style={{ color: '#38bdf8' }} /> 15-Med Outcome Registry
          <span style={{ fontSize: 9, background: '#0284c7', color: '#fff', padding: '1px 5px', borderRadius: 10, marginLeft: 4 }}>
            RWE
          </span>
        </button>

        <button 
          className={`nav-tab-btn ${activeTab === 'sleep_effectiveness' ? 'active' : ''}`}
          onClick={() => setActiveTab('sleep_effectiveness')}
          style={{ position: 'relative' }}
        >
          <Moon size={15} /> Hypnotic Effectiveness
          <span style={{ fontSize: 9, background: '#2563eb', color: '#fff', padding: '1px 5px', borderRadius: 10, marginLeft: 4 }}>
            STANDOUT
          </span>
        </button>

        <button 
          className={`nav-tab-btn ${activeTab === 'stock' ? 'active' : ''}`}
          onClick={() => setActiveTab('stock')}
        >
          <Package size={15} /> Medicine Stock & Degradation
        </button>

        <button 
          className={`nav-tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          <Bell size={15} /> Alerts Log
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

        <button 
          className={`nav-tab-btn ${activeTab === 'adaptive_ml' ? 'active' : ''}`}
          onClick={() => setActiveTab('adaptive_ml')}
          style={{ borderColor: activeTab === 'adaptive_ml' ? '#a855f7' : undefined }}
        >
          <BrainCircuit size={15} style={{ color: '#c084fc' }} /> Adaptive ML & Novelty Engine
          <span style={{ fontSize: 9, background: '#7c3aed', color: '#fff', padding: '1px 5px', borderRadius: 10, marginLeft: 4 }}>
            N=1 ONLINE
          </span>
        </button>
      </nav>

      {/* Main Viewport Content */}
      <main className="main-viewport">
        {astronauts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
            Initializing telemetry stream and computing rolling 14-day baselines...
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <CrewOverview 
                astronauts={astronauts}
                onSelectAstronaut={(id) => {
                  setSelectedAstronautId(id);
                  setActiveTab('detail');
                }}
              />
            )}

            {activeTab === 'predictive_failure' && (
              <PredictiveFailureDashboard 
                astronauts={astronauts}
              />
            )}

            {activeTab === 'detail' && (
              <AstronautDetail 
                astronaut={currentAstronaut}
                onBack={() => setActiveTab('overview')}
                onOpenMedication={() => setActiveTab('medication')}
              />
            )}

            {activeTab === 'medication' && (
              <MedicationScreen 
                astronaut={currentAstronaut}
                onLogMedication={handleLogMedication}
              />
            )}

            {activeTab === 'med_feedback' && (
              <MedicationOutcomeTracker 
                astronauts={astronauts}
              />
            )}

            {activeTab === 'sleep_effectiveness' && (
              <SleepEffectivenessScreen 
                astronauts={astronauts}
              />
            )}

            {activeTab === 'stock' && (
              <MedicineStockScreen />
            )}

            {activeTab === 'alerts' && (
              <AlertsLogScreen 
                alerts={allAlerts}
                onUpdateAlertNote={handleUpdateAlertNote}
              />
            )}

            {activeTab === 'adaptive_ml' && (
              <AdaptiveMLScreen 
                astronauts={astronauts}
              />
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

      {/* Hackathon Demo Walkthrough Modal */}
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
                setActiveTab(tab as TabType);
                if (astroId) setSelectedAstronautId(astroId);
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
