import { Astronaut, DailyBiometrics, BaselineMetric, HealthAlert } from '../types';
import { DEFAULT_THRESHOLDS } from '../config/thresholds';

/**
 * Calculates rolling 14-day baseline for an astronaut up to a specific flight day
 */
export function calculate14DayBaseline(history: DailyBiometrics[], currentDay: number): BaselineMetric {
  const windowDays = history.filter(h => h.day <= currentDay && h.day > Math.max(0, currentDay - 14));
  if (windowDays.length === 0) {
    return {
      rollingAvgSleepHours: 6.5,
      rollingAvgRestingHR: 62,
      rollingAvgStress: 40,
      rollingAvgMood: 7.5,
      rollingAvgSleepLatencyMin: 22
    };
  }

  const sumSleep = windowDays.reduce((acc, curr) => acc + curr.sleepHours, 0);
  const sumHR = windowDays.reduce((acc, curr) => acc + curr.restingHeartRate, 0);
  const sumStress = windowDays.reduce((acc, curr) => acc + curr.stressLevel, 0);
  const sumMood = windowDays.reduce((acc, curr) => acc + curr.moodScore, 0);
  const sumLatency = windowDays.reduce((acc, curr) => acc + curr.sleepOnsetLatencyMin, 0);

  const count = windowDays.length;
  return {
    rollingAvgSleepHours: Number((sumSleep / count).toFixed(2)),
    rollingAvgRestingHR: Math.round(sumHR / count),
    rollingAvgStress: Math.round(sumStress / count),
    rollingAvgMood: Number((sumMood / count).toFixed(1)),
    rollingAvgSleepLatencyMin: Math.round(sumLatency / count)
  };
}

/**
 * Generates 30 days of simulated crew data for 4 astronauts,
 * with real mission phenomena and clinical edge cases purposefully injected.
 * 
 * Injected Clinical Storylines:
 * 1. CDR Marcus Vance (Commander):
 *    - Day 1-17: Nominal baseline (sleep ~6.8h, HR ~58).
 *    - Day 18-24: High operational workload / sleep deprivation (sleep drops to 4.9h, stress spikes to 78).
 *    - Day 22: Prescribed Zolpidem 10mg. Sleep latency drops from 48 min to 18 min, but total sleep hours stay at ~5.8h! (Classic NASA OCHMO brief finding).
 *    - Day 28: Logs Promethazine for space motion sickness -> TRIGGERS RED ALERT INTERACTION.
 * 
 * 2. FE Dr. Elena Rostova (Flight Engineer):
 *    - Nominal healthy circadian stability, high stress recovery, baseline sleep 6.4h.
 * 
 * 3. MS Kaito Tanaka (Science Specialist):
 *    - Circadian phase delay & prolonged sleep latency (avg 52 min). Taking Melatonin.
 * 
 * 4. PLT Sarah Jenkins (Pilot):
 *    - Moderate elevation in resting heart rate and stress around Day 14-20 due to EVA preparation.
 */
export function generateSimulatedCrewData(): Astronaut[] {
  const astronauts: Astronaut[] = [
    {
      id: 'ast-01',
      name: 'CDR Marcus Vance',
      role: 'Mission Commander',
      age: 44,
      gender: 'M',
      avatarInitials: 'MV',
      missionDay: 30,
      overallStatus: 'red',
      topAlertSummary: 'Dual Sedative Interaction: Zolpidem + Promethazine flagged (NASA rule violation).',
      history: [],
      activeMedications: [
        {
          id: 'med-sch-01',
          drugName: 'Zolpidem',
          category: 'hypnotic',
          dose: '10mg',
          frequency: 'Nightly before sleep',
          targetWindow: 'bedtime',
          isSedating: true,
          prescribedFor: 'Mission fatigue & sleep onset insomnia',
          startDay: 22
        },
        {
          id: 'med-sch-02',
          drugName: 'Promethazine',
          category: 'antiemetic',
          dose: '25mg',
          frequency: 'PRN for microgravity vestibular nausea',
          targetWindow: 'prn',
          isSedating: true,
          prescribedFor: 'Space motion sickness',
          startDay: 28
        }
      ],
      recentAlerts: []
    },
    {
      id: 'ast-02',
      name: 'Dr. Elena Rostova',
      role: 'Flight Engineer / Medical Officer',
      age: 39,
      gender: 'F',
      avatarInitials: 'ER',
      missionDay: 30,
      overallStatus: 'green',
      topAlertSummary: 'All biometrics within personal baseline tolerance band.',
      history: [],
      activeMedications: [
        {
          id: 'med-sch-03',
          drugName: 'Acetaminophen',
          category: 'analgesic',
          dose: '500mg',
          frequency: 'PRN for musculoskeletal stiffness',
          targetWindow: 'prn',
          isSedating: false,
          prescribedFor: 'Post-resistive exercise spine elongation pain',
          startDay: 10
        }
      ],
      recentAlerts: []
    },
    {
      id: 'ast-03',
      name: 'MS Kaito Tanaka',
      role: 'Science Payload Specialist',
      age: 36,
      gender: 'M',
      avatarInitials: 'KT',
      missionDay: 30,
      overallStatus: 'yellow',
      topAlertSummary: 'Prolonged sleep latency (>48 min) for 4 consecutive flight days.',
      history: [],
      activeMedications: [
        {
          id: 'med-sch-04',
          drugName: 'Melatonin',
          category: 'hypnotic',
          dose: '3mg sublingual',
          frequency: 'Nightly 30 min before crew quarters lights-out',
          targetWindow: 'bedtime',
          isSedating: false,
          prescribedFor: 'Circadian resynchronization',
          startDay: 14
        }
      ],
      recentAlerts: []
    },
    {
      id: 'ast-04',
      name: 'PLT Sarah Jenkins',
      role: 'Spacecraft Pilot',
      age: 41,
      gender: 'F',
      avatarInitials: 'SJ',
      missionDay: 30,
      overallStatus: 'yellow',
      topAlertSummary: 'Elevated sustained resting HR (+14 bpm over 14d baseline) during docking sim prep.',
      history: [],
      activeMedications: [
        {
          id: 'med-sch-05',
          drugName: 'Modafinil',
          category: 'stimulant',
          dose: '100mg',
          frequency: 'Morning dose (pre-EVA / simulated night docking)',
          targetWindow: 'morning',
          isSedating: false,
          prescribedFor: 'Fatigue countermeasure during critical orbital shift',
          startDay: 16,
          endDay: 20
        }
      ],
      recentAlerts: []
    }
  ];

  // Populate Marcus Vance (Commander) - Injected Storyline
  for (let day = 1; day <= 30; day++) {
    let sleepHours = 6.6 + (Math.sin(day) * 0.4);
    let latency = 24 + Math.round(Math.random() * 8);
    let hr = 58 + Math.round(Math.random() * 5);
    let stress = 35 + Math.round(Math.random() * 10);
    let mood = 8;
    const meds: string[] = [];

    // Stress & sleep degradation phase (Day 17-21)
    if (day >= 17 && day <= 21) {
      sleepHours = 5.2 - ((day - 17) * 0.25); // drops down to ~4.2 - 4.8h
      latency = 45 + (day - 17) * 5; // sleep onset up to 60 mins
      hr = 68 + (day - 17) * 3;
      stress = 74 + (day - 17) * 2;
      mood = 5;
    }

    // Started Zolpidem at Day 22
    if (day >= 22) {
      meds.push('Zolpidem 10mg');
      // NASA brief finding: cuts sleep onset time by ~8.5-12 min, but total sleep time does not substantially increase
      latency = 16 + Math.round(Math.random() * 5); // rapid sleep onset!
      sleepHours = 5.8 + (Math.sin(day) * 0.3); // still only ~5.8 hours!
      stress = 58;
      mood = 6.5;
    }

    // Day 28: logged Promethazine for space nausea
    if (day >= 28) {
      meds.push('Promethazine 25mg');
      hr = 54; // bradycardia / depression
      stress = 50;
      mood = 5;
    }

    const dateStr = `2026-10-${day < 10 ? '0' + day : day}`;
    astronauts[0].history.push({
      day,
      date: dateStr,
      sleepHours: Number(sleepHours.toFixed(1)),
      sleepOnsetLatencyMin: latency,
      restingHeartRate: hr,
      stressLevel: stress,
      moodScore: Number(mood.toFixed(1)),
      medicationsTaken: meds,
      notes: day === 22 ? 'Initiated Zolpidem 10mg po qhs for sleep latency.' : (day === 28 ? 'Reported nausea after centrifugal centrifuge experiment. Took Promethazine.' : undefined)
    });
  }

  // Populate Elena Rostova (Engineer) - Stable nominal
  for (let day = 1; day <= 30; day++) {
    const sleep = 6.4 + (Math.cos(day * 0.5) * 0.5);
    const latency = 18 + Math.round(Math.random() * 8);
    const hr = 59 + Math.round(Math.random() * 4);
    const stress = 32 + Math.round(Math.random() * 8);
    const mood = 8.5;
    const meds = day % 4 === 0 ? ['Acetaminophen 500mg'] : [];

    astronauts[1].history.push({
      day,
      date: `2026-10-${day < 10 ? '0' + day : day}`,
      sleepHours: Number(sleep.toFixed(1)),
      sleepOnsetLatencyMin: latency,
      restingHeartRate: hr,
      stressLevel: stress,
      moodScore: mood,
      medicationsTaken: meds
    });
  }

  // Populate Kaito Tanaka (Science) - Sleep latency problem
  for (let day = 1; day <= 30; day++) {
    const sleep = 6.0 + (Math.sin(day * 0.4) * 0.6);
    let latency = 38 + Math.round(Math.random() * 15);
    if (day >= 24) latency = 52 + (day % 5) * 4; // prolonged latency spike
    const hr = 62 + Math.round(Math.random() * 5);
    const stress = 52 + (day % 10);
    const mood = 6.5;
    const meds = day >= 14 ? ['Melatonin 3mg'] : [];

    astronauts[2].history.push({
      day,
      date: `2026-10-${day < 10 ? '0' + day : day}`,
      sleepHours: Number(sleep.toFixed(1)),
      sleepOnsetLatencyMin: latency,
      restingHeartRate: hr,
      stressLevel: stress,
      moodScore: mood,
      medicationsTaken: meds
    });
  }

  // Populate Sarah Jenkins (Pilot) - Docking stress & HR elevation
  for (let day = 1; day <= 30; day++) {
    let sleep = 6.5 + (Math.cos(day) * 0.4);
    let hr = 61 + Math.round(Math.random() * 4);
    let stress = 42;
    const meds: string[] = [];

    if (day >= 16 && day <= 20) {
      meds.push('Modafinil 100mg');
      hr = 76 + (day % 4) * 3; // HR elevation
      stress = 72;
      sleep = 5.9;
    }

    astronauts[3].history.push({
      day,
      date: `2026-10-${day < 10 ? '0' + day : day}`,
      sleepHours: Number(sleep.toFixed(1)),
      sleepOnsetLatencyMin: 22,
      restingHeartRate: hr,
      stressLevel: stress,
      moodScore: 7.2,
      medicationsTaken: meds
    });
  }

  // Generate automated clinical alerts using engine rules
  astronauts.forEach(ast => {
    ast.recentAlerts = evaluateAstronautAlerts(ast);
  });

  return astronauts;
}

/**
 * Alert evaluation engine comparing today's readings to 14-day baseline and NASA rules
 */
export function evaluateAstronautAlerts(astronaut: Astronaut): HealthAlert[] {
  const alerts: HealthAlert[] = [];
  const currentDay = astronaut.missionDay;
  const history = astronaut.history;
  const today = history.find(h => h.day === currentDay) || history[history.length - 1];
  if (!today) return alerts;

  const baseline = calculate14DayBaseline(history, currentDay);

  // 1. Sleep Delta Alert (Relative to individual baseline)
  const sleepDelta = baseline.rollingAvgSleepHours - today.sleepHours;
  if (sleepDelta >= DEFAULT_THRESHOLDS.sleep.baselineDeviationHours) {
    alerts.push({
      id: `alt-slp-${astronaut.id}-${currentDay}`,
      astronautId: astronaut.id,
      astronautName: astronaut.name,
      day: currentDay,
      timestamp: `MET Day ${currentDay} 07:15`,
      level: today.sleepHours < DEFAULT_THRESHOLDS.sleep.criticalMinHours ? 'red' : 'yellow',
      category: 'sleep',
      title: 'Sleep Deficit vs Baseline',
      reason: `Slept ${today.sleepHours}h, which is ${sleepDelta.toFixed(1)}h below personal 14-day baseline (${baseline.rollingAvgSleepHours}h).`,
      flightSurgeonNote: 'Consider circadian schedule review and light-box adjustment.'
    });
  }

  // 2. Sleep Latency Alert
  if (today.sleepOnsetLatencyMin >= DEFAULT_THRESHOLDS.sleep.onsetLatencyWarningMin) {
    alerts.push({
      id: `alt-lat-${astronaut.id}-${currentDay}`,
      astronautId: astronaut.id,
      astronautName: astronaut.name,
      day: currentDay,
      timestamp: `MET Day ${currentDay} 07:30`,
      level: 'yellow',
      category: 'sleep',
      title: 'Delayed Sleep Onset Latency',
      reason: `Took ${today.sleepOnsetLatencyMin} mins to fall asleep (baseline: ${baseline.rollingAvgSleepLatencyMin} mins).`,
      flightSurgeonNote: 'Review caffeine/stimulant cutoff timing and evening screen usage.'
    });
  }

  // 3. Resting Heart Rate Delta
  const hrDelta = today.restingHeartRate - baseline.rollingAvgRestingHR;
  if (hrDelta >= DEFAULT_THRESHOLDS.heartRate.sustainedElevatedBpm || today.restingHeartRate > DEFAULT_THRESHOLDS.heartRate.restingMaxBpm) {
    alerts.push({
      id: `alt-hr-${astronaut.id}-${currentDay}`,
      astronautId: astronaut.id,
      astronautName: astronaut.name,
      day: currentDay,
      timestamp: `MET Day ${currentDay} 08:00`,
      level: hrDelta > 20 ? 'red' : 'yellow',
      category: 'cardiac',
      title: 'Elevated Resting Heart Rate',
      reason: `Resting HR is ${today.restingHeartRate} bpm (+${hrDelta} bpm over 14-day baseline of ${baseline.rollingAvgRestingHR} bpm).`,
      flightSurgeonNote: 'Evaluate fluid status, hydration, CO2 partial pressure, and workload strain.'
    });
  }

  // 4. Stress Index Alert
  if (today.stressLevel >= DEFAULT_THRESHOLDS.stress.highThreshold) {
    alerts.push({
      id: `alt-str-${astronaut.id}-${currentDay}`,
      astronautId: astronaut.id,
      astronautName: astronaut.name,
      day: currentDay,
      timestamp: `MET Day ${currentDay} 09:30`,
      level: today.stressLevel >= DEFAULT_THRESHOLDS.stress.criticalThreshold ? 'red' : 'yellow',
      category: 'stress',
      title: 'Acute High Stress Detected',
      reason: `Crew autonomic stress index at ${today.stressLevel}/100 (baseline avg: ${baseline.rollingAvgStress}).`,
      flightSurgeonNote: 'Scheduled 30-min relaxation decompression protocol.'
    });
  }

  // 5. Drug-Drug Interaction Check (NASA ISS Medical Kit rule)
  const meds = today.medicationsTaken;
  const hasZolpidem = meds.some(m => m.toLowerCase().includes('zolpidem'));
  const hasPromethazine = meds.some(m => m.toLowerCase().includes('promethazine'));
  const hasDiphenhydramine = meds.some(m => m.toLowerCase().includes('diphenhydramine'));

  if (hasZolpidem && (hasPromethazine || hasDiphenhydramine)) {
    alerts.push({
      id: `alt-med-int-${astronaut.id}-${currentDay}`,
      astronautId: astronaut.id,
      astronautName: astronaut.name,
      day: currentDay,
      timestamp: `MET Day ${currentDay} 22:45`,
      level: 'red',
      category: 'medication',
      title: 'CRITICAL DRUG INTERACTION: Dual CNS Depressants',
      reason: `Logged Zolpidem concurrently with Promethazine. ISS Medical Kit Rule: "Do not use sedating antiemetics with sleep meds."`,
      flightSurgeonNote: 'URGENT: Alert flight surgeon. Withhold secondary sedative; monitor pulse oximetry.'
    });
  }

  return alerts;
}

