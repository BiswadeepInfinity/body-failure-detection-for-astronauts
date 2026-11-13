# Astronaut Health + Medication Monitor
**NASA Space Apps Challenge 2026 Prototype**  
*Challenge: Create Health Monitoring Software for Astronauts on Space Missions*

---

## 🚀 Overview & Our Standout Edge

Most astronaut health monitoring solutions display static threshold alerts against fixed Earth-derived population norms. This system is different: it builds a **personalized physiological model of each individual astronaut** that starts from Earth knowledge and continuously learns from their own mission data — with no ground connection, no training phase, and no GPU required.

### The Core Problem We Solve
Every crewed space mission — ISS, Lunar Gateway, Artemis, deep space transit — shares one critical constraint: **the astronaut cannot wait for Earth to decide if something is wrong.** Communication blackouts, latency delays of up to 24 minutes one-way, and the absence of a bedside physician make onboard autonomous health intelligence a mission-critical capability, not an enhancement.

---

## 🧠 The ML System — What It Actually Does

**Fully custom. Zero external ML libraries. Zero pre-trained models. Zero GPU. Zero internet.**

All three ML models are hand-written in TypeScript and run entirely in-browser:

### Model 1: Adaptive Physiological Manifold (`src/ml/adaptiveEngine.ts`)

The model learns what "normal" means **for this specific astronaut** in space — not for the average human on Earth.

**How it learns:**
- Day 1 (Launch): Model starts with terrestrial priors (Earth clinical reference values)  
- Day 14: Model is ~68% the astronaut's own spaceflight data, ~32% Earth prior  
- Day 30: Model is ~92% the astronaut's own spaceflight physiology  
- No retraining. No ground sync. Self-calibrates continuously from daily biometric readings.

**What it computes:**

| Step | Algorithm | What It Detects |
| :--- | :--- | :--- |
| Learn baseline | Full-covariance EMA update (5×5 matrix) | How biometrics co-move in this astronaut's microgravity profile |
| Measure deviation | True Mahalanobis Distance $D_M$ | How far today's reading is from the learned personal manifold |
| Track confidence | Normal-Inverse-Gamma (NIG) posterior | How certain the model is — low on Day 5, high on Day 25 |
| Classify state | Chi-square $(\chi^2_5)$ OOD threshold at $3.2\sigma$ | Whether today's state is Nominal, Drift, or Out-of-Distribution |
| Rank causes | Naive Bayes probabilistic classifier | Which spaceflight hypothesis best explains the anomaly pattern |

### Model 2: Drug Efficacy Estimator (`src/ml/doseResponseModel.ts`)

A **Bayesian weighted mean posterior** that quantifies how well each drug is working in space vs. Earth clinical trials. Starts with FDA/trial priors; updates with every 2-tap crew assessment. Distinguishes declining efficacy from pharmacological tolerance vs. storage degradation.

### Model 3: Failure Trajectory (`src/ml/prognosticFailureModel.ts`)

Computes **biometric velocity** ($dv/dt$) over the recent 7-day window via linear extrapolation, projecting critical physiological thresholds 48 hours forward with pre-emptive countermeasure recommendations.

---

## 💊 Standout Pharmacy Intelligence Layer

1. **15-Medication Space First-Aid Tracker & 2-Tap Micro Check-In:** Tracks the standard NASA medical kit (Zolpidem, Promethazine, Modafinil, Scopolamine, etc.) with 5-second crew feedback on relief, onset speed, and microgravity side effects.

2. **Real-time Drug Interaction Guardian:** NASA ISS Medical Kit contraindication rules — Zolpidem + Promethazine fires a critical RED alert (additive CNS depression).

3. **Spaceflight Drug Degradation Flags:** 1.5× microgravity degradation multiplier (Reichard et al. 2023) applied by packaging type and stowage duration.

4. **Degradation vs. Tolerance Disambiguation:** When drug response declines, the system distinguishes storage failure from physiological tolerance using a 3-condition logical gate on efficacy delta, stowage months, and packaging type.

---

## 🛠️ Screens & Architecture

| Screen | What It Shows |
| :--- | :--- |
| **Crew Overview** | 4-astronaut mission status cards, 7-day sleep sparklines, 14-day baseline comparison |
| **Astronaut Detail** | Full 30-day biometric history with rolling baseline band and alert reasons |
| **Adaptive ML Engine** | 30-day Mahalanobis trajectory, NIG confidence score, Naive Bayes ranked hypotheses, EMA slider |
| **Predictive Failure** | 7-day biometric velocity extrapolation, composite failure risk score, 48h projections |
| **Medication Screen** | Dose logger with live interaction pre-screening |
| **Sleep Effectiveness** | Pre/post hypnotic outcome analysis (Zolpidem sleep latency vs. total hours) |
| **Medicine Stock** | Stowage inventory with degradation risk flags |
| **Alerts Log** | Triage queue with editable Flight Surgeon directives |
| **Demo Script** | 6-step interactive judge walkthrough modal |

---

## 💻 Running the App Locally

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # Production bundle
```

---

## 🧪 6-Step Hackathon Demo Script

Click **"Hackathon Demo Script"** in the app:

1. **Crew Overview** — CDR Marcus Vance flagged Red: sleep deficit + drug interaction
2. **Astronaut Detail** — Sleep dropped to 4.2h below his *personal* 14-day baseline (not a fixed NASA norm)
3. **Sleep Effectiveness** — Zolpidem cut latency by 14 min but did not increase total sleep hours (matches NASA OCHMO brief findings)
4. **Drug Interaction** — Promethazine on Day 28 triggers CRITICAL RED: dual CNS depressant violation
5. **Medicine Stock** — Repackaged Promethazine (14 months) flagged Yellow; Benadryl (26 months) flagged Red
6. **Adaptive ML** — 30-day Mahalanobis chart shows Day 28+ OOD spike; Naive Bayes ranks "dual CNS sedative pharmacodynamic cascade" as top hypothesis

---

## 📐 Mathematical Foundations

| Component | Algorithm | Training? | GPU? | Library? |
| :--- | :--- | :---: | :---: | :---: |
| Baseline learning | Full-covariance EMA ($5 \times 5$) | No | No | No |
| Anomaly distance | True Mahalanobis $D_M$ | No | No | No |
| Epistemic confidence | Normal-Inverse-Gamma posterior | No | No | No |
| Hypothesis ranking | Naive Bayes classifier | No | No | No |
| Drug efficacy | Bayesian weighted mean | No | No | No |
| Failure trajectory | Linear velocity extrapolation | No | No | No |

For full mathematical derivations, formulas, and implementation notes → [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md)
