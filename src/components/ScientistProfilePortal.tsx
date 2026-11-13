import React, { useState } from 'react';
import { Astronaut, DailyBiometrics } from '../types';
import { 
  User, 
  Calendar, 
  Plus, 
  Heart, 
  Moon, 
  Activity, 
  Smile, 
  Pill, 
  CheckCircle2, 
  FileText,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Props {
  astronauts: Astronaut[];
  onUpdateDailyLog: (astronautId: string, log: DailyBiometrics) => void;
}

export const ScientistProfilePortal: React.FC<Props> = ({ astronauts, onUpdateDailyLog }) => {
  const [selectedAstroId, setSelectedAstroId] = useState<string>(astronauts[0]?.id || 'ast-01');
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(9); // 0 = Jan ... 9 = Oct
  const [selectedDay, setSelectedDay] = useState<number>(30); // Day of flight/month
  const [isSuccessMessage, setIsSuccessMessage] = useState<boolean>(false);

  const months = [
    { name: 'January 2026', days: 31, offsetDay: 0 },
    { name: 'February 2026', days: 28, offsetDay: 31 },
    { name: 'March 2026', days: 31, offsetDay: 59 },
    { name: 'April 2026', days: 30, offsetDay: 90 },
    { name: 'May 2026', days: 31, offsetDay: 120 },
    { name: 'June 2026', days: 30, offsetDay: 151 },
    { name: 'July 2026', days: 31, offsetDay: 181 },
    { name: 'August 2026', days: 31, offsetDay: 212 },
    { name: 'September 2026', days: 30, offsetDay: 243 },
    { name: 'October 2026', days: 31, offsetDay: 0 }, // Primary active mission month
    { name: 'November 2026', days: 30, offsetDay: 31 },
    { name: 'December 2026', days: 31, offsetDay: 61 }
  ];

  const currentMonth = months[selectedMonthIndex];
  const astronaut = astronauts.find(a => a.id === selectedAstroId) || astronauts[0];
  
  // Find record: In October (index 9), day corresponds directly to Flight Day 1-30
  const dayLog = selectedMonthIndex === 9 
    ? astronaut.history.find(h => h.day === selectedDay)
    : undefined;

  // Form input state initialized with current selected day values or sensible defaults
  const [sleepHours, setSleepHours] = useState<number>(dayLog?.sleepHours || 6.5);
  const [sleepLatency, setSleepLatency] = useState<number>(dayLog?.sleepOnsetLatencyMin || 20);
  const [restingHR, setRestingHR] = useState<number>(dayLog?.restingHeartRate || 62);
  const [stressIndex, setStressIndex] = useState<number>(dayLog?.stressLevel || 35);
  const [moodScore, setMoodScore] = useState<number>(dayLog?.moodScore || 8.0);
  const [medications, setMedications] = useState<string>(dayLog?.medicationsTaken.join(', ') || '');
  const [clinicalNotes, setClinicalNotes] = useState<string>(dayLog?.notes || '');

  // Synchronize form when day changes
  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    const existing = selectedMonthIndex === 9 ? astronaut.history.find(h => h.day === day) : undefined;
    if (existing) {
      setSleepHours(existing.sleepHours);
      setSleepLatency(existing.sleepOnsetLatencyMin);
      setRestingHR(existing.restingHeartRate);
      setStressIndex(existing.stressLevel);
      setMoodScore(existing.moodScore);
      setMedications(existing.medicationsTaken.join(', '));
      setClinicalNotes(existing.notes || '');
    } else {
      setSleepHours(6.5);
      setSleepLatency(20);
      setRestingHR(62);
      setStressIndex(35);
      setMoodScore(8.0);
      setMedications('');
      setClinicalNotes('');
    }
    setIsSuccessMessage(false);
  };

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    const targetFlightDay = selectedMonthIndex === 9 ? selectedDay : (selectedDay > 30 ? 30 : selectedDay);
    const monthNum = selectedMonthIndex + 1;
    const dateString = `2026-${monthNum < 10 ? '0' + monthNum : monthNum}-${selectedDay < 10 ? '0' + selectedDay : selectedDay}`;

    const newLog: DailyBiometrics = {
      day: targetFlightDay,
      date: dateString,
      sleepHours: Number(sleepHours),
      sleepOnsetLatencyMin: Number(sleepLatency),
      restingHeartRate: Number(restingHR),
      stressLevel: Number(stressIndex),
      moodScore: Number(moodScore),
      medicationsTaken: medications.split(',').map(m => m.trim()).filter(Boolean),
      notes: clinicalNotes.trim() || undefined
    };

    onUpdateDailyLog(astronaut.id, newLog);
    setIsSuccessMessage(true);
    setTimeout(() => setIsSuccessMessage(false), 3500);
  };

  const calendarDays = Array.from({ length: currentMonth.days }, (_, i) => i + 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '4px 8px', borderRadius: 4, color: '#38bdf8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
            <User size={13} /> Crew Self-Service Telemetry & EHR Portal
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff' }}>
            Astronaut Multi-Month Medical Calendar & EHR
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Continuous mission timeline with full month navigation across Expedition 71 flight phases.
          </p>
        </div>

        {/* Scientist/Astronaut Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Active Scientist Profile:</span>
          <select 
            value={selectedAstroId} 
            onChange={(e) => {
              setSelectedAstroId(e.target.value);
              setSelectedDay(30);
              setIsSuccessMessage(false);
            }}
            style={{
              background: 'var(--bg-surface)',
              color: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 6,
              padding: '6px 14px',
              fontSize: 13,
              fontWeight: 600
            }}
          >
            {astronauts.map(a => (
              <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Scientist Profile Bio Card */}
      <div className="space-card" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)', borderColor: 'var(--border-subtle)', padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: '#1e293b',
              border: '2px solid #38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 18,
              color: '#38bdf8'
            }}>
              {astronaut.avatarInitials}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff' }}>{astronaut.name}</h3>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  {astronaut.role}
                </span>
                <span style={{
                  fontSize: 11,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: astronaut.overallStatus === 'red' ? 'rgba(239, 68, 68, 0.2)' : (astronaut.overallStatus === 'yellow' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'),
                  color: astronaut.overallStatus === 'red' ? '#fca5a5' : (astronaut.overallStatus === 'yellow' ? '#fcd34d' : '#6ee7b7')
                }}>
                  Status: {astronaut.overallStatus.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                Age: {astronaut.age} · Gender: {astronaut.gender} · Mission Day: {astronaut.missionDay} · Telemetry Logs: {astronaut.history.length} Entries
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Assigned Medications</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', marginTop: 2 }}>
              {astronaut.activeMedications.length > 0 ? astronaut.activeMedications.map(m => m.drugName).join(', ') : 'None'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Multi-Month Calendar on Left, Log Update Form on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 20 }}>
        
        {/* LEFT COLUMN: Mission Calendar with Month Switcher */}
        <div className="space-card" style={{ padding: 18 }}>
          {/* Month Navigator Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={16} style={{ color: '#38bdf8' }} />
              <strong style={{ fontSize: 15, color: '#ffffff' }}>{currentMonth.name}</strong>
              {selectedMonthIndex === 9 && (
                <span style={{ fontSize: 9, background: '#0284c7', color: '#fff', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>
                  ACTIVE MISSION PHASE
                </span>
              )}
            </div>

            {/* Previous / Next Month Arrows */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button 
                onClick={() => setSelectedMonthIndex(prev => Math.max(0, prev - 1))}
                disabled={selectedMonthIndex === 0}
                style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: selectedMonthIndex === 0 ? 'var(--text-muted)' : '#fff', borderRadius: 4, padding: '4px 6px', cursor: selectedMonthIndex === 0 ? 'not-allowed' : 'pointer' }}
                title="Previous Month"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setSelectedMonthIndex(prev => Math.min(11, prev + 1))}
                disabled={selectedMonthIndex === 11}
                style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: selectedMonthIndex === 11 ? 'var(--text-muted)' : '#fff', borderRadius: 4, padding: '4px 6px', cursor: selectedMonthIndex === 11 ? 'not-allowed' : 'pointer' }}
                title="Next Month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Month Selector Pills */}
          <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 8, marginBottom: 12 }}>
            {months.map((m, idx) => (
              <button
                key={m.name}
                onClick={() => {
                  setSelectedMonthIndex(idx);
                  setSelectedDay(1);
                }}
                style={{
                  fontSize: 10,
                  padding: '3px 8px',
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: selectedMonthIndex === idx ? '#38bdf8' : 'var(--border-subtle)',
                  background: selectedMonthIndex === idx ? '#38bdf8' : 'transparent',
                  color: selectedMonthIndex === idx ? '#000' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: selectedMonthIndex === idx ? 700 : 400,
                  whiteSpace: 'nowrap'
                }}
              >
                {m.name.split(' ')[0].substring(0, 3)}
              </button>
            ))}
          </div>

          {/* Day Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
            {calendarDays.map(day => {
              const entry = selectedMonthIndex === 9 ? astronaut.history.find(h => h.day === day) : undefined;
              const isSelected = selectedDay === day;
              const hasAlert = entry && (entry.sleepHours < 5.0 || entry.restingHeartRate > 75 || entry.stressLevel > 70);
              const hasMed = entry && entry.medicationsTaken.length > 0;

              return (
                <div
                  key={day}
                  onClick={() => handleSelectDay(day)}
                  style={{
                    background: isSelected ? 'rgba(56, 189, 248, 0.25)' : (entry ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255,255,255,0.03)'),
                    border: `1px solid ${isSelected ? '#38bdf8' : (hasAlert ? 'rgba(239, 68, 68, 0.5)' : 'var(--border-subtle)')}`,
                    borderRadius: 6,
                    padding: '8px 6px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, color: isSelected ? '#38bdf8' : '#ffffff', fontFamily: 'var(--font-mono)' }}>
                    D{day}
                  </span>

                  {entry ? (
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.2 }}>
                      <div>{entry.sleepHours}h</div>
                      <div>{entry.restingHeartRate} bpm</div>
                    </div>
                  ) : (
                    <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>
                      {selectedMonthIndex === 9 ? 'No log' : 'Future'}
                    </span>
                  )}

                  <div style={{ display: 'flex', gap: 3, marginTop: 2 }}>
                    {hasMed && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#a855f7' }} title="Medication Taken" />}
                    {hasAlert && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#ef4444' }} title="Anomalous Reading" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 16, fontSize: 11, color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8' }} /> Selected Day
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a855f7' }} /> Meds Logged
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} /> Telemetry Strain
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Edit/Log Form for Selected Day */}
        <div className="space-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={18} style={{ color: '#38bdf8' }} /> Daily Log: {currentMonth.name.split(' ')[0]} Day {selectedDay}
              </h4>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                Mission Date: 2026-{(selectedMonthIndex + 1) < 10 ? '0' + (selectedMonthIndex + 1) : (selectedMonthIndex + 1)}-{selectedDay < 10 ? '0' + selectedDay : selectedDay} · Subject: {astronaut.name}
              </p>
            </div>

            {dayLog && (
              <span style={{ fontSize: 10, background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', padding: '3px 8px', borderRadius: 4 }}>
                Active Telemetry Record
              </span>
            )}
          </div>

          {/* Success Banner */}
          {isSuccessMessage && (
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#6ee7b7', padding: '10px 14px', borderRadius: 6, marginBottom: 14, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={16} />
              <span><strong>Log Successfully Saved!</strong> ML Adaptive manifold and clinical alerts updated in real time.</span>
            </div>
          )}

          <form onSubmit={handleSaveLog} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Row 1: Sleep Duration & Sleep Latency */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Moon size={13} style={{ color: '#38bdf8' }} /> Total Sleep Duration (Hours):
                </label>
                <input 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="14"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px 10px', borderRadius: 6, fontSize: 13, fontFamily: 'var(--font-mono)' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Clock size={13} style={{ color: '#38bdf8' }} /> Sleep Latency (Minutes to sleep):
                </label>
                <input 
                  type="number" 
                  min="0" 
                  max="180"
                  value={sleepLatency}
                  onChange={(e) => setSleepLatency(parseInt(e.target.value) || 0)}
                  style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px 10px', borderRadius: 6, fontSize: 13, fontFamily: 'var(--font-mono)' }}
                  required
                />
              </div>
            </div>

            {/* Row 2: Heart Rate & Stress */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Heart size={13} style={{ color: '#f87171' }} /> Resting Heart Rate (BPM):
                </label>
                <input 
                  type="number" 
                  min="35" 
                  max="160"
                  value={restingHR}
                  onChange={(e) => setRestingHR(parseInt(e.target.value) || 0)}
                  style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px 10px', borderRadius: 6, fontSize: 13, fontFamily: 'var(--font-mono)' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Activity size={13} style={{ color: '#fbbf24' }} /> Autonomic Stress Index (0-100):
                </label>
                <input 
                  type="number" 
                  min="0" 
                  max="100"
                  value={stressIndex}
                  onChange={(e) => setStressIndex(parseInt(e.target.value) || 0)}
                  style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px 10px', borderRadius: 6, fontSize: 13, fontFamily: 'var(--font-mono)' }}
                  required
                />
              </div>
            </div>

            {/* Row 3: Mood Rating */}
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Smile size={13} style={{ color: '#a855f7' }} /> Mood & Cognitive Alertness (1 to 10 rating):
              </label>
              <input 
                type="number" 
                step="0.5" 
                min="1" 
                max="10"
                value={moodScore}
                onChange={(e) => setMoodScore(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px 10px', borderRadius: 6, fontSize: 13, fontFamily: 'var(--font-mono)' }}
                required
              />
            </div>

            {/* Row 4: Medications Taken */}
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Pill size={13} style={{ color: '#38bdf8' }} /> Medications Administered (comma-separated):
              </label>
              <input 
                type="text" 
                value={medications}
                onChange={(e) => setMedications(e.target.value)}
                placeholder="e.g. Zolpidem 10mg, Promethazine 25mg"
                style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px 10px', borderRadius: 6, fontSize: 13 }}
              />
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                Logging multiple sedatives (e.g. Zolpidem + Promethazine) will evaluate drug interaction contraindications.
              </span>
            </div>

            {/* Row 5: Scientist Notes */}
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <FileText size={13} style={{ color: 'var(--text-muted)' }} /> Crew Subjective Observations / Mission Notes:
              </label>
              <textarea 
                rows={2}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="e.g. High operational workload during robotic arm simulation. Mild cephalic fullness."
                style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px 10px', borderRadius: 6, fontSize: 12, resize: 'vertical' }}
              />
            </div>

            {/* Save Button */}
            <button 
              type="submit"
              className="btn-primary"
              style={{ background: '#38bdf8', color: '#000', fontWeight: 700, padding: '10px', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 6 }}
            >
              <Plus size={16} /> Save Daily Medical Record to Local Storage
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
