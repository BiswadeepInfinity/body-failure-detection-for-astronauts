import { DrugInteractionRule, MedicineInventoryItem } from '../types';

// Standard NASA ISS Medical Kit formulary & sedating interaction table
// Based on NASA ISS Medical Kit checklist & Spaceflight Pharmacy research (Reichard et al. 2023)

export const KNOWN_INTERACTIONS: DrugInteractionRule[] = [
  {
    drugA: 'Zolpidem',
    drugB: 'Promethazine',
    severity: 'red',
    ruleDescription: 'Severe additive CNS depression & respiratory risk. NASA ISS Checklist rule: "Do not use with sleep meds".',
    nasaRef: 'ISS Medical Kit Rulebook 2024 - Hypnotics & Antiemetics contraindication'
  },
  {
    drugA: 'Zolpidem',
    drugB: 'Diphenhydramine',
    severity: 'red',
    ruleDescription: 'Dual hypnotic/antihistamine sedation. Severe grogginess, impaired EVA operational readiness.',
    nasaRef: 'NASA-STD-3001 Vol 1 Crew Medical Protocols'
  },
  {
    drugA: 'Zolpidem',
    drugB: 'Melatonin',
    severity: 'yellow',
    ruleDescription: 'Concurrent sleep aid administration. Increased morning somnolence and altered circadian entrainment.',
    nasaRef: 'OCHMO Sleep Technical Brief'
  },
  {
    drugA: 'Modafinil',
    drugB: 'Zolpidem',
    severity: 'yellow',
    ruleDescription: 'Stimulant/hypnotic antagonization. Modafinil logged within 8h of scheduled bedtime blunts hypnotic sleep latency efficacy.',
    nasaRef: 'NASA OCHMO Fatigue Countermeasures Guidelines'
  },
  {
    drugA: 'Promethazine',
    drugB: 'Diphenhydramine',
    severity: 'yellow',
    ruleDescription: 'Additive anticholinergic burden: urinary retention, blurred vision, microgravity vestibular disorientation.',
    nasaRef: 'ISS Space Motion Sickness Clinical Practice Guidelines'
  }
];

// Initial stock simulation representing ISS / Deep Space Medical Kit
export const INITIAL_INVENTORY: MedicineInventoryItem[] = [
  {
    id: 'med-01',
    tradeName: 'Ambien',
    genericName: 'Zolpidem 10mg',
    category: 'Hypnotic (Sleep Aid)',
    batchNumber: 'NASA-EXP71-ZLP01',
    totalUnits: 48,
    unit: 'tablets',
    storageLocation: 'ISS Med-Kit Alfa (Sleep & Psych Locker)',
    packagingType: 'Original Blister',
    monthsInStorage: 7,
    expirationDate: '2027-04-15',
    potencyRisk: 'green',
    potencyRiskReason: 'Within manufacturer standard packaging; storage degradation minimal (<1.5% loss).',
    estimatedPotencyRemainingPct: 98.4
  },
  {
    id: 'med-02',
    tradeName: 'Phenergan (Repackaged)',
    genericName: 'Promethazine 25mg',
    category: 'Antiemetic / Motion Sickness',
    batchNumber: 'NASA-EXP70-PRM04',
    totalUnits: 20,
    unit: 'capsules',
    storageLocation: 'ISS Med-Kit Bravo (Emergency / SMS Locker)',
    packagingType: 'Repackaged Pouch',
    monthsInStorage: 14,
    expirationDate: '2026-12-10',
    potencyRisk: 'yellow',
    potencyRiskReason: 'Repackaged into space pouch >12 mos ago. Flight data shows ~1.5x ground degradation rate (~0.2% extra loss/month).',
    estimatedPotencyRemainingPct: 89.2
  },
  {
    id: 'med-03',
    tradeName: 'Provigil',
    genericName: 'Modafinil 100mg',
    category: 'Wakefulness / Alertness',
    batchNumber: 'NASA-EXP71-MDF02',
    totalUnits: 60,
    unit: 'tablets',
    storageLocation: 'ISS Med-Kit Alfa (Operational Alertness)',
    packagingType: 'Original Blister',
    monthsInStorage: 6,
    expirationDate: '2027-09-01',
    potencyRisk: 'green',
    potencyRiskReason: 'Nominal stability; primary barrier packaging intact.',
    estimatedPotencyRemainingPct: 99.1
  },
  {
    id: 'med-04',
    tradeName: 'Benadryl (Repackaged)',
    genericName: 'Diphenhydramine 25mg',
    category: 'Antihistamine / Mild Sedative',
    batchNumber: 'NASA-EXP68-DPH09',
    totalUnits: 12,
    unit: 'tablets',
    storageLocation: 'ISS Med-Kit Charlie (General Care)',
    packagingType: 'Repackaged Pouch',
    monthsInStorage: 26,
    expirationDate: '2026-06-30',
    potencyRisk: 'red',
    potencyRiskReason: 'Exceeded 24 months in flown repackaged condition. Significant risk of active ingredient degradation (>15% potency drop). Flagged for disposal/resupply.',
    estimatedPotencyRemainingPct: 82.5
  },
  {
    id: 'med-05',
    tradeName: 'Tylenol',
    genericName: 'Acetaminophen 500mg',
    category: 'Analgesic / Antipyretic',
    batchNumber: 'NASA-EXP71-ACT08',
    totalUnits: 120,
    unit: 'tablets',
    storageLocation: 'Crew Quarter Convenience Kit',
    packagingType: 'Original Blister',
    monthsInStorage: 8,
    expirationDate: '2027-11-20',
    potencyRisk: 'green',
    potencyRiskReason: 'Excellent chemical stability profile under standard cabin conditions.',
    estimatedPotencyRemainingPct: 97.9
  },
  {
    id: 'med-06',
    tradeName: 'Melatonin Sublingual',
    genericName: 'Melatonin 3mg',
    category: 'Circadian Regulator',
    batchNumber: 'NASA-EXP71-MLT03',
    totalUnits: 90,
    unit: 'lozenges',
    storageLocation: 'ISS Med-Kit Alfa (Sleep Locker)',
    packagingType: 'Original Blister',
    monthsInStorage: 9,
    expirationDate: '2027-02-28',
    potencyRisk: 'green',
    potencyRiskReason: 'Stable under ambient cabin temperature and relative humidity.',
    estimatedPotencyRemainingPct: 96.5
  }
];

