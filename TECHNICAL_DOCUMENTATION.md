# Technical System Architecture & Specification Document
**Project:** Astronaut Health + Medication Monitor  
**Challenge:** NASA Space Apps Challenge 2026 — *Create Health Monitoring Software for Astronauts on Space Missions*  
**Revision:** 2.4.0 · Production Prototype  
**Classification:** Prototype Decision-Support System (Simulated Data · Not an FDA/CE Medical Device)  
**Authors:** Lead Researcher: Tanish (B.Pharm) · Core Engineering Team  

---

## 1. Executive Summary & Problem Formulation

### 1.1 Context
Human space exploration missions beyond Low Earth Orbit (LEO)—such as the Artemis Lunar Basecamp and Mars transit—face extreme operational constraints:
* **Severe Communication Latency:** One-way radio transit times between Earth and Mars vary from 4 to 24 minutes, creating an 8 to 48-minute round-trip delay, with recurring complete communication blackouts during solar conjunction.
* **Extreme Data Scarcity ($N \le 6$):** Clinical trials require cohorts of thousands of patients. Deep space crews operate under small-cohort, non-stationary physiological conditions where population-wide averages from Earth do not directly apply.
* **Microgravity Pharmacokinetics (PK) & Pharmacodynamics (PD) Shifts:** Altered fluid distribution (cephalad fluid shifts), delayed gastric emptying, altered hepatic cytochrome P450 enzyme activity, and modified receptor sensitivity degrade predictable therapeutic responses.
* **Accelerated Pharmaceutical Degradation:** Spaceflight research (*Reichard et al. 2023*) documents that active pharmaceutical ingredients (APIs) flown in space stowage degrade approximately 1.5× faster than ground controls (~0.2% extra potency loss per month), heavily exacerbated by secondary repackaging (e.g., poly/foil pouches vs. hermetic blister packaging).

### 1.2 System Purpose
The **Astronaut Health + Medication Monitor** is a 100% offline-capable, edge-computed clinical decision-support prototype. It shifts space medicine away from static Earth-derived threshold displays toward:
1. **Personalized $N=1$ Dynamic Rolling Baselines:** Calibrating biometric anomalies relative to an astronaut’s own moving physiological manifold (NASA-STD-3001 compliant).
2. **Space Pharmacovigilance & Real-World Evidence (RWE) Logging:** Capturing low-friction post-dose clinical outcomes on a standard 15-drug space first-aid formulary.
3. **Autonomous Edge Machine Learning:** Applying recursive Bayesian updates and multi-variate Mahalanobis distance metrics to detect Out-Of-Distribution (OOD) novel physiological states without reliance on ground mission control.
4. **Asynchronous Store-and-Forward Telemetry:** Ensuring zero-latency local execution on Mars, with encrypted batch synchronization across Deep Space Network (DSN) windows.

---

## 2. System Architecture & Topology

```
+----------------------------------------------------------------------------------------------------+
|                                    SPACECRAFT / MARS HABITAT (EDGE)                                |
|                                                                                                    |
|  +------------------------+      +-------------------------------+      +-----------------------+  |
|  |   Biometric Telemetry  | ---> | Personalized Baseline Engine  | ---> | Multi-Axial Anomaly   |  |
|  |   (Sleep, HR, Stress)  |      | (14-Day Rolling Window)       |      | Detection (Mahalanobis)|  |
|  +------------------------+      +-------------------------------+      +-----------------------+  |
|                                                                                     |              |
|  +------------------------+      +-------------------------------+                  v              |
|  | 15-Drug Space Medical  | ---> | Automated Follow-Up Engine    | ---> | Autonomous Clinical   |  |
|  | Kit Administration Log |      | (Edge Timers: +15 to +120m)   |      | Decision Support      |  |
|  +------------------------+      +-------------------------------+      | - Drug Interactions   |  |
|                                                  |                      | - Degradation Flags   |  |
|                                                  v                      | - Novelty Hypotheses  |  |
|                                  +-------------------------------+      +-----------------------+  |
|                                  | 2-Tap Micro Check-in Screen   |                  |              |
|                                  | (Relief, Onset, Side-Effects) |                  |              |
|                                  +-------------------------------+                  |              |
|                                                  |                                  |              |
|                                                  v                                  v              |
|                                  +-------------------------------+      +-----------------------+  |
|                                  | Bayesian Pharmacovigilance    | ---> | Encrypted Local Cache |  |
|                                  | Model (Dose-Response Profile) |      | (Zero-Lag Execution)  |  |
|                                  +-------------------------------+      +-----------------------+  |
+-------------------------------------------------------------------------------------|--------------+
                                                                                      | (DSN Pass)
                                                                                      | Asynchronous
                                                                                      | Sync Packet
                                                                                      v
+----------------------------------------------------------------------------------------------------+
|                                 EARTH MISSION CONTROL (HOUSTON / JSC)                              |
|                                                                                                    |
|  +-----------------------------------------------------------------------------------------------+  |
|  | Comprehensive Crew EHR Ledger & Spaceflight Pharmaceutical Efficacy Database                 |  |
|  +-----------------------------------------------------------------------------------------------+  |
+----------------------------------------------------------------------------------------------------+
```

---

## 3. Mathematical & Algorithmic Formulation

### 3.1 Adaptive $N=1$ Online Physiological Learning Engine

Rather than relying on static Earth reference intervals (e.g., Resting Heart Rate $< 100\text{ bpm}$), the system establishes an evolving individual biometric state tensor:
$$\mathbf{x}_t = \begin{bmatrix} x_{1,t} \\ x_{2,t} \\ x_{3,t} \\ x_{4,t} \\ x_{5,t} \end{bmatrix} = \begin{bmatrix} \text{Sleep Duration (hours)} \\ \text{Sleep Onset Latency (minutes)} \\ \text{Resting Heart Rate (bpm)} \\ \text{Autonomic Stress Index (0--100)} \\ \text{Crew Mood Score (1--10)} \end{bmatrix}$$

#### Parameter Adaptation (Exponential Forgetting Formulation):
To accommodate non-stationary microgravity adaptation without catastrophic forgetting:
$$\boldsymbol{\mu}_t = (1 - \alpha)\boldsymbol{\mu}_{t-1} + \alpha \mathbf{x}_t$$
$$\boldsymbol{\sigma}^2_{i,t} = (1 - \alpha)\boldsymbol{\sigma}^2_{i,t-1} + \alpha (x_{i,t} - \mu_{i,t})^2$$

*Where $\alpha \in [0.02, 0.25]$ is the operator-tunable online learning rate.*

#### Multi-Variate Mahalanobis Distance Metric ($D_M$):
Assuming a localized diagonalized covariance approximation $\boldsymbol{\Sigma}_t = \operatorname{diag}(\boldsymbol{\sigma}^2_{1,t}, \dots, \boldsymbol{\sigma}^2_{5,t})$:
$$D_M(\mathbf{x}_t) = \sqrt{(\mathbf{x}_t - \boldsymbol{\mu}_t)^T \boldsymbol{\Sigma}_t^{-1} (\mathbf{x}_t - \boldsymbol{\mu}_t)} = \sqrt{\sum_{i=1}^{5} \frac{(x_{i,t} - \mu_{i,t})^2}{\sigma^2_{i,t}}}$$

#### Novelty & Out-of-Distribution (OOD) Classification:
Under a 5-dimensional multivariate normal assumption, $D_M^2$ follows a chi-square distribution with 5 degrees of freedom ($\chi^2_5$). A critical threshold is established:
$$\text{State}(\mathbf{x}_t) = \begin{cases} 
\text{Nominal Manifold}, & D_M(\mathbf{x}_t) < 2.5\sigma \\
\text{Physiological Drift (Caution)}, & 2.5\sigma \le D_M(\mathbf{x}_t) < 3.2\sigma \\
\text{Out-of-Distribution (Novel Condition)}, & D_M(\mathbf{x}_t) \ge 3.2\sigma 
\end{cases}$$

When $D_M(\mathbf{x}_t) \ge 3.2\sigma$, the system automatically triggers its **Autonomous Clinical Hypothesis Engine**, mapping individual component Z-scores ($Z_i = \frac{x_{i,t} - \mu_{i,t}}{\sigma_{i,t}}$) to potential spaceflight etiologies:
* Elevated Resting HR ($Z_{\text{HR}} > +1.8$) paired with normal stress $\rightarrow$ *Cephalad fluid shift compensation, mild hypovolemia, or elevated habitat $P_{\text{CO}_2} > 3.5\text{ mmHg}$.*
* Depressed Sleep Duration ($Z_{\text{Sleep}} < -1.5$) paired with elevated stress $\rightarrow$ *Cumulative cognitive fatigue coupled with circadian phase misalignment.*
* Reduced Sleep Latency ($Z_{\text{Latency}} < -1.0$) paired with short duration ($Z_{\text{Sleep}} < -1.0$) during active hypnotic dosing $\rightarrow$ *Pharmacodynamic tolerance with blunted slow-wave restorative sleep architecture.*

---

### 3.2 Bayesian Real-World Evidence Pharmacovigilance Model

To quantify drug efficacy across small cohorts without ground databases, the model deploys a **Beta-Binomial Conjugate Bayesian Formulation**.

#### Priors:
Terrestrial clinical efficacy benchmarks $\theta_0 \in [0, 1]$ (derived from FDA/clinical trial records) are encoded with an epistemic prior weight $w_0 = 2.0$.

#### Likelihood & Evidence Scoring:
When an astronaut completes a 2-tap micro-assessment for drug $j$, the response is mapped to an outcome score $r_k$:
$$r_k = \begin{cases}
+1.0, & \text{Completely Resolved (100\% therapeutic benefit)} \\
+0.5, & \text{Partially Improved (50\% therapeutic benefit)} \\
0.0, & \text{No Change (0\% therapeutic benefit)} \\
-0.2, & \text{Worsened (Adverse reaction / paradoxical symptom exacerbation)}
\end{cases}$$

#### Posterior Estimation:
For $N_{\text{obs}}$ evaluated doses:
$$\hat{\theta}_{\text{flight}, j} = \frac{\theta_{0, j} \cdot w_0 + \sum_{k=1}^{N_{\text{obs}}} r_k}{w_0 + N_{\text{obs}}} \times 100\%$$

$$\Delta_{\text{Efficacy}, j} = \hat{\theta}_{\text{flight}, j} - \theta_{0, j}$$

#### Storage Degradation vs. Tolerance Disambiguation Rule:
A clinical alert for storage degradation is asserted if and only if:
$$\text{DegradationAlert}_j = \text{True} \iff (\Delta_{\text{Efficacy}, j} \le -15\%) \land (T_{\text{stowage}} \ge 12\text{ months}) \land (\text{Packaging} = \text{Repackaged Pouch})$$

---

## 4. The 15-Medication Space Formulary Kit Specification

The system manages the 15 standard medications comprising the baseline deep space first-aid kit, derived from NASA-STD-3001 and operational ISS medical checklists:

| ID | Generic Name | Trade Name | Class | Standard Dose & Route | Space Indication | Follow-Up Delay | Earth Prior ($\theta_0$) | Stowage Form | Flight Loss Rate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **MED-01** | Ibuprofen | Motrin/Advil | Analgesic | 400 mg PO | Spine elongation ache, muscular strain | +60 min | 88% | Blister Pack | 0.18%/mo |
| **MED-02** | Acetaminophen | Tylenol | Analgesic | 500 mg PO | Cephalalgia, sinus pressure | +45 min | 82% | Blister Pack | 0.15%/mo |
| **MED-03** | Zolpidem | Ambien | Hypnotic | 10 mg PO | Sleep onset insomnia, circadian disruption | +45 min | 85% | Blister Pack | 0.22%/mo |
| **MED-04** | Melatonin | Melatonin | Hypnotic | 3 mg SL | Circadian entrainment across 16 sunrises | +30 min | 70% | Blister Pack | 0.20%/mo |
| **MED-05** | Promethazine | Phenergan | Antiemetic | 25 mg PO | Space Adaptation Syndrome (SAS) nausea | +45 min | 90% | Repackaged Pouch | 0.38%/mo |
| **MED-06** | Scopolamine | Transderm-Scop | Antiemetic | 1.5 mg TD | SAS motion sickness prophylaxis | +90 min | 84% | Repackaged Pouch | 0.42%/mo |
| **MED-07** | Modafinil | Provigil | Stimulant | 100 mg PO | Critical fatigue countermeasure (EVA) | +60 min | 92% | Blister Pack | 0.16%/mo |
| **MED-08** | Pseudoephedrine | Sudafed | Decongestant | 60 mg PO | Cephalic fluid shift nasal engorgement | +45 min | 78% | Blister Pack | 0.19%/mo |
| **MED-09** | Diphenhydramine | Benadryl | Antihistamine | 25 mg PO | Environmental dust allergy, mild sedation | +60 min | 80% | Repackaged Pouch | 0.40%/mo |
| **MED-10** | Loperamide | Imodium | GI Antidiarrheal | 2 mg PO | Habitat GI distress / diarrhea | +60 min | 91% | Blister Pack | 0.17%/mo |
| **MED-11** | Omeprazole | Prilosec | GI PPI | 20 mg PO | Microgravity gastroesophageal reflux | +90 min | 86% | Blister Pack | 0.21%/mo |
| **MED-12** | Augmentin | Co-Amoxiclav | Antibiotic | 875/125 mg PO | Bacterial skin/respiratory complications | +120 min | 89% | Blister Pack | 0.35%/mo |
| **MED-13** | Hydrocortisone | Cortaid | Corticosteroid | 1% Topical | Microgravity contact dermatitis / rash | +60 min | 83% | Repackaged Pouch | 0.30%/mo |
| **MED-14** | Carboxymethylcellulose | Refresh | Ophthalmic | 1-2 drops Top | Dry eye syndrome from forced airflow | +15 min | 94% | Dropper Bottle | 0.25%/mo |
| **MED-15** | Aspirin | Bayer Aspirin | Anti-platelet | 325 mg PO | Emergency cardiac / ischemic protocol | +30 min | 95% | Blister Pack | 0.24%/mo |

---

## 5. Software Architecture & Implementation Details

### 5.1 Technology Stack
* **Language:** TypeScript 5.7.2 (strict type-safety, zero implicit `any`)
* **Core Framework:** React 19.0.0
* **Bundler & Build Tool:** Vite 6.1.0 (ESNext target, tree-shaken production output)
* **Iconography:** Lucide-React 0.475.0
* **Execution Environment:** Edge client-side JavaScript runtime (Browser LocalStorage / IndexedDB cache compatible)
* **Network Requirements:** None (100% offline-first execution)

### 5.2 Module Breakdown & Directory Structure
```
d:\Nasa Space Challenge\
├── src\
│   ├── config\
│   │   └── thresholds.ts            # Clinical trigger limits (decoupled for research leads)
│   ├── data\
│   │   ├── dataGenerator.ts         # 30-day synthetic telemetry engine & baseline calculator
│   │   ├── formulary.ts             # Drug interaction rules & stock items
│   │   └── spaceFormulary15.ts      # 15-drug space first-aid formulary dataset
│   ├── ml\
│   │   ├── adaptiveEngine.ts        # Online Bayesian N=1 learning & Mahalanobis model
│   │   └── doseResponseModel.ts     # Real-world spaceflight pharmacovigilance Bayesian model
│   ├── components\
│   │   ├── StatusBadge.tsx          # Multi-modal visual status indicators
│   │   ├── CrewOverview.tsx         # Mission Control crew triage cards & sparklines
│   │   ├── AstronautDetail.tsx      # Longitudinal biometric charts & 14-day baseline bands
│   │   ├── MedicationScreen.tsx     # Dose logging & real-time interaction contraindication engine
│   │   ├── MedicationOutcomeTracker.tsx # 15-drug tracker & 2-tap micro check-in interface
│   │   ├── SleepEffectivenessScreen.tsx # Hypnotic efficacy evaluation module
│   │   ├── MedicineStockScreen.tsx  # Physical stowage degradation inventory
│   │   ├── AlertsLogScreen.tsx      # Triage stream with editable Flight Surgeon directives
│   │   ├── AdaptiveMLScreen.tsx     # Deep space edge ML & novel hypothesis UI
│   │   ├── SettingsModal.tsx        # In-app threshold tuning for research leads
│   │   └── DemoWalkthroughModal.tsx # 6-step guided judge demonstration modal
│   ├── types\
│   │   └── index.ts                 # Type definitions & domain interfaces
│   ├── App.tsx                      # Root component & navigation state
│   ├── main.tsx                     # Entrypoint mount
│   └── index.css                    # Spacecraft low-glare dark styling system
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 6. Verification, Validation & Build Status

The application has been verified against strict TypeScript compilation and production packaging:
* **TypeScript Check:** `tsc --noEmit` passed with 0 errors.
* **Vite Bundle Build:** Production build generated cleanly in 4.15s:
  * `dist/index.html`: 0.81 kB (gzip: 0.46 kB)
  * `dist/assets/index-*.css`: 6.44 kB (gzip: 1.92 kB)
  * `dist/assets/index-*.js`: 349.10 kB (gzip: 98.85 kB)

---

## 7. Compliance & Regulatory Disclaimers

> **MANDATORY NOTICE:**  
> This software is a prototype designed solely for research, academic evaluation, and competitive demonstration under the **NASA Space Apps Challenge 2026**. It is **not** an FDA-approved, CE-certified, or flight-certified Medical Device Data System (MDDS) or Software as a Medical Device (SaMD). All physiological telemetry and pharmacovigilance datasets in this prototype are synthetically generated for demonstration purposes. Operational clinical decisions must always be confirmed by a licensed Flight Surgeon or Medical Officer.

