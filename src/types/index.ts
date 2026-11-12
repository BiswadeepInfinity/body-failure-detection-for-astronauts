import { AlertThresholds } from '../config/thresholds';
export type { AlertThresholds };

// Data Models for Astronaut Health & Medication Monitor

export type RiskLevel = 'green' | 'yellow' | 'red';

export interface DailyBiometrics {
  day: number; // Flight Day (e.g. 1 to 30)
  date: string; // YYYY-MM-DD
  sleepHours: number; // Actual hours slept
  sleepOnsetLatencyMin: number; // Time taken to fall asleep (minutes)
  restingHeartRate: number; // bpm
  stressLevel: number; // 0 - 100 index (e.g. HRV derived)
  moodScore: number; // 1 - 10 rating (crew self-report / voice cadence)
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  medicationsTaken: string[]; // Medication IDs or names
  notes?: string;
}

export interface BaselineMetric {
  rollingAvgSleepHours: number;
  rollingAvgRestingHR: number;
  rollingAvgStress: number;
  rollingAvgMood: number;
  rollingAvgSleepLatencyMin: number;
}

export interface Astronaut {
  id: string;
  name: string;
  role: string; // Commander, Flight Engineer, Science Specialist, Pilot
  age: number;
  gender: 'M' | 'F' | 'Other';
  avatarInitials: string;
  missionDay: number;
  overallStatus: RiskLevel;
  topAlertSummary: string;
  history: DailyBiometrics[];
  activeMedications: ScheduledMedication[];
  recentAlerts: HealthAlert[];
}

export interface HealthAlert {
  id: string;
  astronautId: string;
  astronautName: string;
  day: number;
  timestamp: string;
  level: RiskLevel;
  category: 'sleep' | 'cardiac' | 'stress' | 'medication' | 'potency';
  title: string;
  reason: string; // Short one-line explanation why alert fired
  flightSurgeonNote?: string;
  acknowledged?: boolean;
}

export interface MedicationScheduleItem {
  time: string; // e.g. "21:30"
  drugName: string;
  dose: string;
  instructions: string;
  taken: boolean;
  takenAt?: string;
}

export interface ScheduledMedication {
  id: string;
  drugName: string;
  category: 'hypnotic' | 'stimulant' | 'analgesic' | 'antiemetic' | 'antihistamine' | 'cardiovascular';
  dose: string;
  frequency: string;
  targetWindow: 'bedtime' | 'morning' | 'prn';
  isSedating: boolean;
  prescribedFor: string;
  startDay: number;
  endDay?: number;
}

export interface DrugInteractionRule {
  drugA: string;
  drugB: string;
  severity: 'red' | 'yellow';
  ruleDescription: string;
  nasaRef: string;
}

export interface MedicineInventoryItem {
  id: string;
  tradeName: string;
  genericName: string;
  category: string;
  batchNumber: string;
  totalUnits: number;
  unit: string;
  storageLocation: string; // e.g. "Med-Kit Alfa Locker 3", "Resupply Pack 2"
  packagingType: 'Original Blister' | 'Repackaged Pouch' | 'Liquid Vial' | 'Bulk Bottle';
  monthsInStorage: number;
  expirationDate: string;
  potencyRisk: RiskLevel;
  potencyRiskReason: string;
  estimatedPotencyRemainingPct: number;
}

export interface SleepDrugEvaluation {
  drugName: string;
  astronautId: string;
  astronautName: string;
  baselineLatencyMin: number;
  postDrugLatencyMin: number;
  baselineSleepHours: number;
  postDrugSleepHours: number;
  baselineNextDayAlertness: number; // 1-10
  postDrugNextDayAlertness: number; // 1-10
  verdict: string; // e.g. "Cut sleep latency by 9.2 min, but total sleep hours unchanged."
  evidenceCitation: string;
}
