// Configuration parameters for NASA Astronaut Health & Medication Monitor
// As requested by Tanish (research lead, B.Pharm): customizable without touching core UI code

export interface AlertThresholds {
  sleep: {
    nasaTargetHours: number;        // NASA STD 3001 recommends 8-8.5 hrs
    baselineDeviationHours: number; // Flag when sleep drops > this many hours below astronaut's 14-day rolling baseline
    criticalMinHours: number;       // Red alert threshold
    onsetLatencyWarningMin: number; // Time to fall asleep warning (e.g. > 45 mins)
  };
  heartRate: {
    restingMinBpm: number;
    restingMaxBpm: number;
    sustainedElevatedBpm: number;   // Delta above baseline
  };
  stress: {
    highThreshold: number;          // 0-100 scale
    criticalThreshold: number;
  };
  mood: {
    lowThreshold: number;           // 1-10 scale
    dropDurationDays: number;
  };
  medication: {
    stimulantPreBedWindowHours: number; // e.g. Modafinil/Caffeine within 8 hours of sleep
    sedatingInteractionWarning: string;
    repackagedDegradationMultiplier: number; // Flown drugs degrade ~1.5x faster, 0.2% extra/mo
    yellowPotencyRiskMonths: number;
    redPotencyRiskMonths: number;
  };
}

export const DEFAULT_THRESHOLDS: AlertThresholds = {
  sleep: {
    nasaTargetHours: 8.0,
    baselineDeviationHours: 1.2,
    criticalMinHours: 5.0,
    onsetLatencyWarningMin: 40.0
  },
  heartRate: {
    restingMinBpm: 50,
    restingMaxBpm: 92,
    sustainedElevatedBpm: 18
  },
  stress: {
    highThreshold: 72,
    criticalThreshold: 85
  },
  mood: {
    lowThreshold: 4,
    dropDurationDays: 3
  },
  medication: {
    stimulantPreBedWindowHours: 8,
    sedatingInteractionWarning: "CNS depression risk: NASA ISS checklist rule 'Do not use with sleep meds' triggered.",
    repackagedDegradationMultiplier: 1.5,
    yellowPotencyRiskMonths: 12,
    redPotencyRiskMonths: 24
  }
};

