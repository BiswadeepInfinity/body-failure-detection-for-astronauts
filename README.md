# Astronaut Health + Medication Monitor
**NASA Space Apps Challenge 2026 Prototype**  
*Challenge: Create Health Monitoring Software for Astronauts on Space Missions*

---

## 🚀 Overview & Our Standout Pharmacy Edge
Most astronaut health monitoring solutions only display basic fitness biometrics (e.g. heart rate and raw sleep hours). Our software features a **specialized spaceflight pharmacy intelligence layer** designed with clinical pharmacy principles:

1. **15-Medication Space First-Aid Tracker & 2-Tap Micro Check-In:** Tracks the 15 standard NASA medical kit drugs (Ibuprofen, Zolpidem, Promethazine, Modafinil, Scopolamine, etc.). An automated local timer prompts astronauts for 5-second feedback (Symptom Relief, Onset Speed, Microgravity Side Effects).
2. **Deep Space Offline Execution & Store-and-Forward:** Runs 100% locally on Mars edge hardware with zero Earth connectivity needed. Encrypts and batches feedback into asynchronous telemetry packets for when Deep Space Network (DSN) windows open up.
3. **Custom Bayesian Drug Response & Degradation AI (`src/ml/doseResponseModel.ts`):** Evaluates real-world spaceflight evidence against Earth benchmarks. Detects whether declining efficacy stems from delayed microgravity gastric absorption, physiological tolerance, or storage packaging degradation (Reichard et al. 2023).
4. **Adaptive Online ML Engine (`src/ml/adaptiveEngine.ts`):** Continuous N=1 personalized baseline tracking using multi-variate Mahalanobis distance, flagging unprecedented Out-Of-Distribution (OOD) bodily states.
5. **Real-time Drug Interaction Guardian:** Implements NASA ISS Medical Kit rules (e.g. Zolpidem + Promethazine contraindications) to prevent dangerous additive CNS depression.

---

## 🛠️ Architecture & Build Order

- **Data Generator (`src/data/dataGenerator.ts`):** 30 days of high-fidelity synthetic telemetry across 4 crew members with injected clinical scenarios (sleep deprivation, hypnotic initiation, dual-sedative interaction, and sustained cardiac elevation).
- **Clinical Thresholds Config (`src/config/thresholds.ts`):** Fully decoupled settings file allowing research leads (like Tanish) to tune alert triggers without editing application code.
- **Formulary & Interaction Matrix (`src/data/formulary.ts`):** NASA ISS Medical Kit formulary, degradation profiles, and multi-drug interaction rules.
- **UI Screens:**
  - `CrewOverview.tsx`: Mission Control crew status cards with 7-day sparklines and baseline comparisons.
  - `AstronautDetail.tsx`: 14-day baseline bands, biometrics, and plain-word alert reasons.
  - `MedicationScreen.tsx`: Dose logging, pre-screening interaction check, and crew side-effect assessments.
  - `SleepEffectivenessScreen.tsx`: Before-and-after outcome analysis for sleep medications.
  - `MedicineStockScreen.tsx`: Spacecraft stowage inventory with packaging-dependent degradation risk flags.
  - `AlertsLogScreen.tsx`: Triage queue with editable Flight Surgeon directives/notes.
  - `DemoWalkthroughModal.tsx`: Step-by-step interactive script for hackathon judging.

---

## 💻 Running the App Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle
npm run build
```

Open `http://localhost:3000` in your browser.

---

## 🧪 5-Step Hackathon Demo Script (Section 7)

Click the **"Hackathon Demo Script"** button at the top of the app to walk judges through the story:
1. **Crew Overview:** Point out CDR Marcus Vance flagged in Red due to a rolling sleep deficit.
2. **Astronaut Detail:** Show how Marcus's sleep dropped to 4.2h below his personal 14-day baseline.
3. **Hypnotic Effectiveness:** Demonstrate that starting Zolpidem cut sleep latency by 14 minutes, but failed to add restorative total sleep hours.
4. **Drug Interaction Warning:** Show the immediate Red alert when Marcus logged Promethazine (violating NASA's *"Do not use with sleep meds"* rule).
5. **Medicine Stock:** Highlight the repackaged medications flagged Yellow and Red due to accelerated microgravity degradation.

