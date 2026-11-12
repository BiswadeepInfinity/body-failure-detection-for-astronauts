// 15 Key Spaceflight First-Aid Medications (NASA ISS / Deep Space Medical Kit Formulary)
// Based on NASA Space Flight Human-System Standard (NASA-STD-3001) & Space Pharmacy Research

export interface SpaceMedication {
  id: string;
  genericName: string;
  tradeName: string;
  category: 'analgesic' | 'hypnotic' | 'antiemetic' | 'stimulant' | 'antihistamine' | 'gastrointestinal' | 'antibiotic' | 'ophthalmic' | 'cardiovascular';
  standardDose: string;
  route: 'Oral' | 'Transdermal Patch' | 'Sublingual' | 'Ophthalmic Drops' | 'Topical';
  spaceIndication: string; // Real microgravity rationale
  followUpWindowMin: number; // Simulated clinical outcome check-in delay (e.g. 45-60 min)
  sedating: boolean;
  earthEfficacyBenchmarkPct: number; // Typical terrestrial clinical success rate
  stowageForm: 'Original Blister' | 'Repackaged Pouch' | 'Liquid Ampoule' | 'Multi-dose Dropper';
  flightDegradationRateMonthlyPct: number; // Spaceflight accelerated loss rate (approx 0.2%/mo + packaging factor)
}

export const SPACE_FORMULARY_15: SpaceMedication[] = [
  {
    id: 'med-01',
    genericName: 'Ibuprofen',
    tradeName: 'Motrin / Advil',
    category: 'analgesic',
    standardDose: '400mg',
    route: 'Oral',
    spaceIndication: 'Microgravity spine elongation backache, EVA muscular strain, headache',
    followUpWindowMin: 60,
    sedating: false,
    earthEfficacyBenchmarkPct: 88,
    stowageForm: 'Original Blister',
    flightDegradationRateMonthlyPct: 0.18
  },
  {
    id: 'med-02',
    genericName: 'Acetaminophen',
    tradeName: 'Tylenol',
    category: 'analgesic',
    standardDose: '500mg',
    route: 'Oral',
    spaceIndication: 'Mild cephalalgia (headache), sinus congestion pressure, fever',
    followUpWindowMin: 45,
    sedating: false,
    earthEfficacyBenchmarkPct: 82,
    stowageForm: 'Original Blister',
    flightDegradationRateMonthlyPct: 0.15
  },
  {
    id: 'med-03',
    genericName: 'Zolpidem',
    tradeName: 'Ambien',
    category: 'hypnotic',
    standardDose: '10mg',
    route: 'Oral',
    spaceIndication: 'Acute sleep-onset insomnia, circadian phase shifts across 16 sunrises/day',
    followUpWindowMin: 45,
    sedating: true,
    earthEfficacyBenchmarkPct: 85,
    stowageForm: 'Original Blister',
    flightDegradationRateMonthlyPct: 0.22
  },
  {
    id: 'med-04',
    genericName: 'Melatonin',
    tradeName: 'Melatonin Sublingual',
    category: 'hypnotic',
    standardDose: '3mg',
    route: 'Sublingual',
    spaceIndication: 'Circadian entrainment, non-pharmacological sleep gate alignment',
    followUpWindowMin: 30,
    sedating: false,
    earthEfficacyBenchmarkPct: 70,
    stowageForm: 'Original Blister',
    flightDegradationRateMonthlyPct: 0.20
  },
  {
    id: 'med-05',
    genericName: 'Promethazine',
    tradeName: 'Phenergan',
    category: 'antiemetic',
    standardDose: '25mg',
    route: 'Oral',
    spaceIndication: 'Severe Space Adaptation Syndrome (SAS), acute microgravity nausea/vomiting',
    followUpWindowMin: 45,
    sedating: true,
    earthEfficacyBenchmarkPct: 90,
    stowageForm: 'Repackaged Pouch',
    flightDegradationRateMonthlyPct: 0.38
  },
  {
    id: 'med-06',
    genericName: 'Scopolamine',
    tradeName: 'Transderm-Scop',
    category: 'antiemetic',
    standardDose: '1.5mg patch',
    route: 'Transdermal Patch',
    spaceIndication: 'Prophylaxis for space motion sickness during orbital insertion and entry',
    followUpWindowMin: 90,
    sedating: true,
    earthEfficacyBenchmarkPct: 84,
    stowageForm: 'Repackaged Pouch',
    flightDegradationRateMonthlyPct: 0.42
  },
  {
    id: 'med-07',
    genericName: 'Modafinil',
    tradeName: 'Provigil',
    category: 'stimulant',
    standardDose: '100mg',
    route: 'Oral',
    spaceIndication: 'Fatigue countermeasure during critical docking maneuvers or prolonged EVA',
    followUpWindowMin: 60,
    sedating: false,
    earthEfficacyBenchmarkPct: 92,
    stowageForm: 'Original Blister',
    flightDegradationRateMonthlyPct: 0.16
  },
  {
    id: 'med-08',
    genericName: 'Pseudoephedrine',
    tradeName: 'Sudafed',
    category: 'antihistamine',
    standardDose: '60mg',
    route: 'Oral',
    spaceIndication: 'Cephalic fluid shift nasal mucosal engorgement and Eustachian tube fullness',
    followUpWindowMin: 45,
    sedating: false,
    earthEfficacyBenchmarkPct: 78,
    stowageForm: 'Original Blister',
    flightDegradationRateMonthlyPct: 0.19
  },
  {
    id: 'med-09',
    genericName: 'Diphenhydramine',
    tradeName: 'Benadryl',
    category: 'antihistamine',
    standardDose: '25mg',
    route: 'Oral',
    spaceIndication: 'Environmental allergic rhinitis, space habitat dust irritation, mild sedative',
    followUpWindowMin: 60,
    sedating: true,
    earthEfficacyBenchmarkPct: 80,
    stowageForm: 'Repackaged Pouch',
    flightDegradationRateMonthlyPct: 0.40
  },
  {
    id: 'med-10',
    genericName: 'Loperamide',
    tradeName: 'Imodium',
    category: 'gastrointestinal',
    standardDose: '2mg',
    route: 'Oral',
    spaceIndication: 'Acute gastrointestinal distress or traveler-type diarrhea in habitat',
    followUpWindowMin: 60,
    sedating: false,
    earthEfficacyBenchmarkPct: 91,
    stowageForm: 'Original Blister',
    flightDegradationRateMonthlyPct: 0.17
  },
  {
    id: 'med-11',
    genericName: 'Omeprazole',
    tradeName: 'Prilosec',
    category: 'gastrointestinal',
    standardDose: '20mg',
    route: 'Oral',
    spaceIndication: 'Microgravity gastroesophageal reflux (stomach acid migration into esophagus)',
    followUpWindowMin: 90,
    sedating: false,
    earthEfficacyBenchmarkPct: 86,
    stowageForm: 'Original Blister',
    flightDegradationRateMonthlyPct: 0.21
  },
  {
    id: 'med-12',
    genericName: 'Augmentin',
    tradeName: 'Amoxicillin / Clavulanate',
    category: 'antibiotic',
    standardDose: '875/125mg',
    route: 'Oral',
    spaceIndication: 'Bacterial skin infections, upper respiratory bacterial complications',
    followUpWindowMin: 120,
    sedating: false,
    earthEfficacyBenchmarkPct: 89,
    stowageForm: 'Original Blister',
    flightDegradationRateMonthlyPct: 0.35
  },
  {
    id: 'med-13',
    genericName: 'Hydrocortisone 1%',
    tradeName: 'Cortaid',
    category: 'analgesic',
    standardDose: 'Topical thin layer',
    route: 'Topical',
    spaceIndication: 'Microgravity contact dermatitis, fiberglass insulation contact rash',
    followUpWindowMin: 60,
    sedating: false,
    earthEfficacyBenchmarkPct: 83,
    stowageForm: 'Repackaged Pouch',
    flightDegradationRateMonthlyPct: 0.30
  },
  {
    id: 'med-14',
    genericName: 'Carboxymethylcellulose',
    tradeName: 'Refresh Tears',
    category: 'ophthalmic',
    standardDose: '1-2 drops',
    route: 'Ophthalmic Drops',
    spaceIndication: 'Dry eye syndrome from forced cabin ventilation airflows and micro-debris',
    followUpWindowMin: 15,
    sedating: false,
    earthEfficacyBenchmarkPct: 94,
    stowageForm: 'Multi-dose Dropper',
    flightDegradationRateMonthlyPct: 0.25
  },
  {
    id: 'med-15',
    genericName: 'Aspirin',
    tradeName: 'Bayer Enteric Aspirin',
    category: 'cardiovascular',
    standardDose: '325mg',
    route: 'Oral',
    spaceIndication: 'Emergency anti-platelet protocol for acute ischemic chest discomfort',
    followUpWindowMin: 30,
    sedating: false,
    earthEfficacyBenchmarkPct: 95,
    stowageForm: 'Original Blister',
    flightDegradationRateMonthlyPct: 0.24
  }
];

