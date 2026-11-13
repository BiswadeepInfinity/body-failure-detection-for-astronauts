# Technical System Architecture & Specification Document
**Project:** Astronaut Health + Medication Monitor  
**Challenge:** NASA Space Apps Challenge 2026 — *Create Health Monitoring Software for Astronauts on Space Missions*  
**Revision:** 4.0.0 · Production Prototype  
**Classification:** Prototype Decision-Support System (Simulated Data · Not an FDA/CE Medical Device)  
**Authors:** Lead Researcher: Tanish (B.Pharm) · Core Engineering Team  

> **Document Accuracy Notice:** This document describes the system as fully implemented in the current codebase. All three ML model components (`adaptiveEngine.ts`) are custom-written in TypeScript with no external ML libraries, no pre-trained models, no GPU requirement, and no network dependency. The system runs entirely in-browser on any device. Mathematical claims reflect the actual implementation; where an approximation is used, it is stated explicitly.

---

## 1. Executive Summary & Problem Formulation

### 1.1 Context
Every crewed space mission — from ISS Low Earth Orbit operations to Lunar Gateway, Artemis surface missions, deep space transit, and eventual Mars expeditions — operates under a shared set of extreme constraints that standard Earth-side medical monitoring tools are not designed to handle:

* **Communication Latency & Blackout Periods:** Even ISS faces windows without real-time ground support. Lunar missions introduce seconds-to-minutes of one-way delay. Deep space and planetary missions face delays of 4–24 minutes one-way, with complete communication blackouts during solar conjunction. In all these cases, an astronaut experiencing a medical event **cannot wait for Earth's response.**
* **Extreme Data Scarcity ($N \le 6$):** Clinical trials require cohorts of thousands of patients. Any space crew is a cohort of 4–7 individuals, operating under non-stationary physiological conditions (microgravity adaptation, circadian disruption, mission stress) where population-wide Earth averages are poor predictors of individual response.
* **Microgravity Pharmacokinetics (PK) & Pharmacodynamics (PD) Shifts:** Altered fluid distribution (cephalad fluid shifts), delayed gastric emptying, altered hepatic cytochrome P450 enzyme activity, and modified receptor sensitivity degrade predictable therapeutic responses — affecting every mission beyond Earth's surface.
* **Accelerated Pharmaceutical Degradation:** Spaceflight research (*Reichard et al. 2023*) documents that active pharmaceutical ingredients (APIs) flown in space stowage degrade approximately 1.5× faster than ground controls (~0.2% extra potency loss per month), heavily exacerbated by secondary repackaging (e.g., poly/foil pouches vs. hermetic blister packaging). This is relevant to every mission that carries a medical kit.

### 1.2 System Purpose
The **Astronaut Health + Medication Monitor** is a 100% offline-capable, edge-computed clinical decision-support prototype. It shifts space medicine away from static Earth-derived threshold displays toward:

1. **Personalized $N=1$ Dynamic Rolling Baselines:** Calibrating biometric anomalies relative to an astronaut's own evolving physiological manifold, not generic population norms. The model starts with Earth priors at launch and gradually replaces them with that astronaut's own mission data — by Day 30, over 90% of the model's learned "normal" comes from the individual's flight history.
2. **Space Pharmacovigilance & Real-World Evidence (RWE) Logging:** Capturing low-friction post-dose clinical outcomes across a standard 15-drug space first-aid formulary, with Bayesian efficacy estimation against terrestrial priors.
3. **Adaptive Online Statistical Anomaly Detection:** Applying a full covariance Exponential Moving Average (EMA) online update and multi-variate Mahalanobis distance to continuously flag Out-Of-Distribution (OOD) physiological states without ground connectivity. No training phase. No GPU. Runs live in-browser.
4. **Probabilistic Clinical Hypothesis Ranking:** When an OOD state is detected, a Naive Bayes classifier ranks candidate spaceflight etiologies by posterior probability given the observed Z-score vector — producing a scored, ranked list rather than a fixed rule output.
5. **Mission-Agnostic Offline-First Execution:** Designed for zero-latency local execution on any spacecraft or habitat hardware, with encrypted batch synchronization queued for available ground communication windows — whether that is a continuous ISS downlink, a Lunar relay pass, or a Deep Space Network (DSN) window.

---

## 2. System Architecture & Topology

```
+----------------------------------------------------------------------------------------------------+
|                        SPACECRAFT / HABITAT (EDGE — ANY MISSION PROFILE)                           |
|                                                                                                    |
|  +------------------------+      +-------------------------------+      +-----------------------+  |
|  |   Biometric Telemetry  | ---> | Personalized Baseline Engine  | ---> | Full-Covariance       |  |
|  |   (Sleep, HR, Stress,  |      | EMA Mean + Full 5×5 Cov Mat. |      | Mahalanobis Anomaly   |  |
|  |    Mood, Latency)      |      | NIG Posterior Confidence      |      | Detection + OOD Flag  |  |
|  +------------------------+      +-------------------------------+      +-----------------------+  |
|                                                                                     |              |
|  +------------------------+      +-------------------------------+                  v              |
|  | 15-Drug Space Medical  | ---> | Automated Follow-Up Engine    | ---> | Naive Bayes           |  |
|  | Kit Administration Log |      | (Edge Timers: +15 to +120m)   |      | Hypothesis Ranker:    |  |
|  +------------------------+      +-------------------------------+      | - Fluid Shift         |  |
|                                                  |                      | - CO2 Elevation       |  |
|                                                  v                      | - Drug Tolerance      |  |
|                                  +-------------------------------+      | - Circadian Mismatch  |  |
|                                  | 2-Tap Micro Check-in Screen   |      +-----------------------+  |
|                                  | (Relief, Onset, Side-Effects) |                  |              |
|                                  +-------------------------------+                  v              |
|                                                  |                      +-----------------------+  |
|                                                  v                      | Drug Interaction      |  |
|                                  +-------------------------------+      | Guardian + Degradation|  |
|                                  | Bayesian Pharmacovigilance    |      | Potency Flags         |  |
|                                  | Efficacy Estimator            |      +-----------------------+  |
|                                  | (Weighted Mean Conjugate)     |                  |              |
|                                  +-------------------------------+                  v              |
|                                                                         +-----------------------+  |
|                                                                         | Encrypted Local Cache |  |
|                                                                         | (Zero-Lag Execution)  |  |
|                                                                         +-----------------------+  |
+----------------------------------------------------------------------------------- |--------------+
                                                                                      | (Ground Window)
                                                                                      | Async Sync
                                                                                      v
+----------------------------------------------------------------------------------------------------+
|                            EARTH MISSION CONTROL (HOUSTON / JSC / ESA)                             |
|  +-----------------------------------------------------------------------------------------------+  |
|  | Crew EHR Ledger & Spaceflight Pharmaceutical Efficacy Database                              |  |
|  +-----------------------------------------------------------------------------------------------+  |
+----------------------------------------------------------------------------------------------------+
```

---

## 3. Mathematical & Algorithmic Formulation

> **Critical Design Principle:** All three models below are **training-free**. They have no weights to optimize, no gradient descent, no pre-training phase, and no GPU requirement. Each model computes its output directly from closed-form mathematical formulas, updating in real time as each new day of biometric data arrives. This is the correct architecture for spacecraft edge deployment where compute resources are constrained and no prior population training dataset of spaceflight physiology exists.

---

### 3.1 Adaptive $N=1$ Online Physiological Learning Engine

#### How the Model Learns — The Mission Lifecycle

The system begins with terrestrial priors (Earth-derived clinical reference values). As mission days accumulate, the model continuously replaces these priors with knowledge learned from that specific astronaut's own flight data:

$$\text{Influence of Earth prior after } t \text{ days} = (1-\alpha)^t$$

With $\alpha = 0.08$:
- Day 7: Earth prior influence = $(0.92)^7 \approx 57\%$ — model is still mostly Earth-calibrated
- Day 14: Earth prior influence = $(0.92)^{14} \approx 32\%$ — model is majority astronaut-specific
- Day 30: Earth prior influence = $(0.92)^{30} \approx 8\%$ — model is 92% the astronaut's own spaceflight physiology

No ground connection is needed after launch. No retraining. The model self-calibrates continuously.

#### Biometric State Vector:

$$\mathbf{x}_t = \begin{bmatrix} \text{Sleep Duration (hours)} \\ \text{Sleep Onset Latency (minutes)} \\ \text{Resting Heart Rate (bpm)} \\ \text{Autonomic Stress Index (0--100)} \\ \text{Crew Mood Score (1--10)} \end{bmatrix}$$

#### EMA Mean Update:

$$\boldsymbol{\mu}_t = (1 - \alpha)\,\boldsymbol{\mu}_{t-1} + \alpha\, \mathbf{x}_t$$

Where $\alpha \in [0.02, 0.25]$ is the operator-tunable forgetting factor (exposed as a slider in the Adaptive ML screen).

#### Full Covariance Matrix Update (EMA):

The covariance matrix tracks how biometrics move *together*, not just independently. For example: HR and Stress are known to co-elevate in microgravity under cognitive load — the full covariance captures this:

$$\boldsymbol{\Sigma}_t = (1-\alpha)\,\boldsymbol{\Sigma}_{t-1} + \alpha\,(\mathbf{x}_t - \boldsymbol{\mu}_t)(\mathbf{x}_t - \boldsymbol{\mu}_t)^T$$

This produces a full $5 \times 5$ symmetric positive semi-definite covariance matrix that is updated every day with zero compute overhead — no batch optimization, no matrix decomposition during the update step.

#### True Mahalanobis Distance:

Using the inverse of the learned covariance matrix (computed via Cholesky decomposition for numerical stability):

$$D_M(\mathbf{x}_t) = \sqrt{(\mathbf{x}_t - \boldsymbol{\mu}_t)^T \boldsymbol{\Sigma}_t^{-1} (\mathbf{x}_t - \boldsymbol{\mu}_t)}$$

Unlike a simple Z-score sum, this correctly detects anomalies where **multiple correlated biometrics deviate simultaneously** — the type of multi-system physiological event most clinically significant in spaceflight.

#### Normal-Inverse-Gamma (NIG) Epistemic Confidence Tracking:

Alongside the EMA updates, a conjugate NIG posterior tracks the model's epistemic certainty — how confident it is in its own learned baseline:

$$p(\mu, \sigma^2 \mid \mathbf{x}_{1:t}) = \text{NIG}(\mu_n, \kappa_n, \alpha_n, \beta_n)$$

The NIG posterior variance narrows as $t$ increases, producing a genuine confidence score derived from posterior uncertainty — not a proxy formula. On Day 5, when the model has little data, it correctly reports low confidence. On Day 25, it reports high confidence, having built a stable personal manifold.

#### OOD Classification:

Under a 5-dimensional multivariate normal assumption, $D_M^2 \sim \chi^2_5$:

$$\text{State}(\mathbf{x}_t) = \begin{cases} 
\text{Nominal Manifold}, & D_M(\mathbf{x}_t) < 2.5 \\
\text{Physiological Drift (Caution)}, & 2.5 \le D_M(\mathbf{x}_t) < 3.2 \\
\text{Out-of-Distribution (Novel Condition)}, & D_M(\mathbf{x}_t) \ge 3.2 
\end{cases}$$

The 3.2σ threshold corresponds to approximately the 98th–99th percentile of the $\chi^2_5$ distribution.

---

### 3.2 Naive Bayes Clinical Hypothesis Classifier

When $D_M(\mathbf{x}_t) \ge 3.2$, the system does not look up a fixed rule table. Instead, it scores every candidate spaceflight hypothesis by its posterior probability given the observed Z-score vector, using the Naive Bayes formulation:

$$P(H_h \mid \mathbf{Z}_t) \propto P(H_h) \cdot \prod_{i=1}^{5} P(Z_{i,t} \mid H_h)$$

Where:
- $P(H_h)$ is the clinical prior probability of hypothesis $h$ derived from spaceflight medicine literature
- $P(Z_{i,t} \mid H_h)$ is the likelihood of observing biometric $i$'s Z-score given that hypothesis $h$ is the true cause
- The output is a **ranked list of hypotheses with posterior probabilities**, not a triggered if-else branch

| Hypothesis | Clinical Prior $P(H_h)$ | Key Diagnostic Signature |
| :--- | :--- | :--- |
| Cephalad fluid shift / mild hypovolemia | 0.70 (common early-mission) | $Z_\text{HR} > +1.5$, $Z_\text{stress}$ normal |
| Elevated habitat CO₂ ($>3.5$ mmHg) | 0.35 | $Z_\text{HR} > +1.5$, $Z_\text{mood} < -1.0$, $Z_\text{stress} > +1.0$ |
| Cumulative cognitive fatigue + circadian misalignment | 0.55 | $Z_\text{sleep} < -1.5$, $Z_\text{stress} > +1.5$ |
| Pharmacodynamic GABA tolerance (hypnotic) | 0.45 (if on hypnotic $>5$ days) | $Z_\text{latency} < -1.0$, $Z_\text{sleep} < -1.0$ during active dosing |
| Unclassified novel spaceflight divergence | 0.20 (fallback) | No dominant single-axis signature |

Each hypothesis receives a posterior score. The UI displays them ranked highest to lowest, giving the Flight Surgeon a prioritized differential to investigate.

---

### 3.3 Bayesian Pharmacovigilance Efficacy Estimator

To quantify drug efficacy across small cohorts without Earth-side databases, the model uses a **closed-form Bayesian weighted mean posterior** — no MCMC, no variational inference, no training.

#### Priors:
Terrestrial clinical efficacy benchmarks $\theta_0 \in [0, 1]$ encoded with prior weight $w_0 = 2.0$ pseudo-observations.

#### Likelihood:
Each 2-tap micro-assessment maps to an outcome score $r_k$:

$$r_k = \begin{cases}
+1.0, & \text{Completely Resolved} \\
+0.5, & \text{Partially Improved} \\
0.0, & \text{No Change} \\
-0.2, & \text{Worsened / Adverse Reaction}
\end{cases}$$

#### Posterior:

$$\hat{\theta}_{\text{flight}, j} = \frac{\theta_{0, j} \cdot w_0 + \sum_{k=1}^{N_\text{obs}} r_k}{w_0 + N_\text{obs}} \times 100\%$$

The prior weight diminishes as in-flight observations accumulate — after 10 assessments, the terrestrial prior carries only $\frac{2}{12} \approx 17\%$ of the weight.

#### Storage Degradation vs. Tolerance Disambiguation:

$$\text{DegradationAlert}_j = \text{True} \iff (\Delta_{\text{Efficacy}, j} \le -15\%) \land (T_\text{stowage} \ge 12\text{ months}) \land (\text{Packaging} = \text{Repackaged Pouch})$$

---

### 3.4 Predictive Failure Trajectory Model

Computes a 7-day forward trajectory using **linear velocity extrapolation**:

1. Split the recent 7-day history into two halves
2. Compute mean of each half → estimate rate of change $dv/dt$
3. Project 48 hours forward: $\hat{x}_{t+48h} = x_t + \frac{dv}{dt} \times 2$
4. Score composite failure risk as a weighted sum over triggered failure domains (cognitive collapse, cardiac decompensation, pharmacological rebound)

This is an intentional engineering approximation appropriate for a prototype. It correctly identifies the clinically meaningful scenarios built into the synthetic data: progressive sleep loss velocity, sustained HR elevation trend, and prolonged hypnotic exposure arc.

---

## 4. The 15-Medication Space Formulary Kit Specification

Derived from NASA-STD-3001 and operational ISS medical checklists:

| ID | Generic Name | Trade Name | Class | Standard Dose & Route | Space Indication | Follow-Up Delay | Earth Prior ($\theta_0$) | Stowage Form | Flight Loss Rate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **MED-01** | Ibuprofen | Motrin/Advil | Analgesic | 400 mg PO | Spine elongation ache, muscular strain | +60 min | 88% | Blister Pack | 0.18%/mo |
| **MED-02** | Acetaminophen | Tylenol | Analgesic | 500 mg PO | Cephalalgia, sinus pressure | +45 min | 82% | Blister Pack | 0.15%/mo |
| **MED-03** | Zolpidem | Ambien | Hypnotic | 10 mg PO | Sleep onset insomnia, circadian disruption | +45 min | 85% | Blister Pack | 0.22%/mo |
| **MED-04** | Melatonin | Melatonin | Hypnotic | 3 mg SL | Circadian entrainment across 16 sunrises/day | +30 min | 70% | Blister Pack | 0.20%/mo |
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
* **External ML Libraries:** **None.** All statistical models are implemented from scratch in TypeScript
* **Pre-trained Models:** **None.** All learning is online and personalized from each astronaut's own mission data
* **GPU / Training Requirement:** **None.** All computations are closed-form arithmetic running in-browser
* **Network Requirements:** None (100% offline-first execution)

### 5.2 ML Model Architecture Summary

| Model | Algorithm | Training Required? | GPU Required? | External Library? |
| :--- | :--- | :--- | :--- | :--- |
| Anomaly detection baseline | Full-covariance EMA | No — learns live from daily data | No | No |
| Distance metric | True Mahalanobis ($5 \times 5$ covariance) | No — computed analytically | No | No |
| Epistemic confidence | Normal-Inverse-Gamma posterior | No — closed-form update | No | No |
| Hypothesis ranking | Naive Bayes classifier | No — priors from literature | No | No |
| Drug efficacy tracking | Bayesian weighted mean | No — closed-form conjugate | No | No |
| Failure trajectory | Linear velocity extrapolation | No — arithmetic on history | No | No |

### 5.3 Module Breakdown & Directory Structure
```
d:\body-failure-detection-for-astronauts\
├── src\
│   ├── config\
│   │   └── thresholds.ts              # Clinical alert limits (decoupled for research lead tuning)
│   ├── data\
│   │   ├── dataGenerator.ts           # 30-day synthetic telemetry + 14-day rolling baseline engine
│   │   ├── formulary.ts               # Drug interaction rules & stock inventory
│   │   └── spaceFormulary15.ts        # 15-drug space first-aid formulary dataset
│   ├── ml\
│   │   ├── adaptiveEngine.ts          # Full-covariance EMA · True Mahalanobis · NIG confidence · Naive Bayes hypotheses
│   │   ├── doseResponseModel.ts       # Bayesian weighted-mean pharmacovigilance efficacy estimator
│   │   └── prognosticFailureModel.ts  # 7-day linear velocity extrapolation & failure domain scoring
│   ├── components\
│   │   ├── StatusBadge.tsx            # Multi-modal visual status indicators
│   │   ├── CrewOverview.tsx           # Mission Control crew triage cards & 7-day sparklines
│   │   ├── AstronautDetail.tsx        # 14-day baseline bands & longitudinal biometric charts
│   │   ├── MedicationScreen.tsx       # Dose logging & real-time contraindication engine
│   │   ├── MedicationOutcomeTracker.tsx # 15-drug tracker & 2-tap micro check-in interface
│   │   ├── SleepEffectivenessScreen.tsx # Pre/post hypnotic efficacy evaluation
│   │   ├── MedicineStockScreen.tsx    # Stowage degradation inventory & potency flags
│   │   ├── AlertsLogScreen.tsx        # Triage stream with editable Flight Surgeon directives
│   │   ├── AdaptiveMLScreen.tsx       # Full-covariance manifold · Mahalanobis chart · Naive Bayes hypothesis UI
│   │   ├── PredictiveFailureDashboard.tsx # 7-day biometric trajectory & composite failure risk
│   │   ├── SettingsModal.tsx          # In-app threshold tuning for research leads
│   │   └── DemoWalkthroughModal.tsx   # 6-step guided judge demonstration modal
│   ├── types\
│   │   └── index.ts                   # Type definitions & domain interfaces
│   ├── App.tsx                        # Root component & navigation state machine
│   ├── main.tsx                       # Entrypoint mount
│   └── index.css                      # Spacecraft low-glare dark-mode styling system
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 6. Verification, Validation & Build Status

* **TypeScript Check:** `tsc --noEmit` — 0 errors
* **Vite Production Build:**
  * `dist/index.html`: 0.81 kB (gzip: 0.46 kB)
  * `dist/assets/index-*.css`: 6.44 kB (gzip: 1.92 kB)
  * `dist/assets/index-*.js`: ~349 kB (gzip: ~99 kB)

---

## 7. Compliance & Regulatory Disclaimers

> **MANDATORY NOTICE:**  
> This software is a prototype designed solely for research, academic evaluation, and competitive demonstration under the **NASA Space Apps Challenge 2026**. It is **not** an FDA-approved, CE-certified, or flight-certified Medical Device Data System (MDDS) or Software as a Medical Device (SaMD). All physiological telemetry and pharmacovigilance datasets in this prototype are synthetically generated for demonstration purposes. Operational clinical decisions must always be confirmed by a licensed Flight Surgeon or Medical Officer.
