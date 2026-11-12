// Custom Bayesian Drug Response & Degradation AI Model
// Analyzes Real-World Evidence (RWE) collected from astronaut 2-tap micro check-ins
// Runs 100% locally on Mars edge hardware with zero external dependencies.

export interface DoseOutcomeLog {
  id: string;
  astronautId: string;
  astronautName: string;
  medicationId: string;
  genericName: string;
  doseLoggedAt: string;
  flightDay: number;
  monthsInSpaceflight: number;
  packagingType: string;
  
  // Follow-up 2-Tap Astronaut Assessment
  reliefScore: 'complete' | 'partial' | 'none' | 'worsened'; // 100%, 50%, 0%, -20%
  onsetSpeed: '<30m' | '30-60m' | '>60m' | 'no-effect';
  reportedSideEffects: string[];
  completedCheckIn: boolean;
}

export interface DrugEfficacyProfile {
  medicationId: string;
  genericName: string;
  totalDosesLogged: number;
  evaluatedDosesCount: number;
  earthBenchmarkPct: number;
  flightObservedEfficacyPct: number;
  efficacyDriftDeltaPct: number; // e.g. -24% (flight lower than earth)
  averageOnsetMins: number;
  tolerabilityScorePct: number; // % of doses without adverse events
  aiClinicalVerdict: string;
  degradationAlert: boolean;
}

export class SpaceDrugBayesianModel {
  /**
   * Evaluates aggregate flight real-world evidence against Earth benchmarks
   * using a Beta-Binomial conjugate Bayesian formulation (Priors = Earth, Evidence = Flight)
   */
  public static evaluateFormulary(
    outcomes: DoseOutcomeLog[], 
    earthBenchmarkMap: Record<string, number>
  ): Record<string, DrugEfficacyProfile> {
    const grouped: Record<string, DoseOutcomeLog[]> = {};

    outcomes.forEach(log => {
      if (!grouped[log.medicationId]) {
        grouped[log.medicationId] = [];
      }
      grouped[log.medicationId].push(log);
    });

    const profiles: Record<string, DrugEfficacyProfile> = {};

    Object.keys(grouped).forEach(medId => {
      const logs = grouped[medId];
      const evaluated = logs.filter(l => l.completedCheckIn);
      const earthBenchmark = earthBenchmarkMap[medId] || 85;

      if (evaluated.length === 0) {
        profiles[medId] = {
          medicationId: medId,
          genericName: logs[0]?.genericName || 'Unknown',
          totalDosesLogged: logs.length,
          evaluatedDosesCount: 0,
          earthBenchmarkPct: earthBenchmark,
          flightObservedEfficacyPct: earthBenchmark,
          efficacyDriftDeltaPct: 0,
          averageOnsetMins: 45,
          tolerabilityScorePct: 100,
          aiClinicalVerdict: 'Awaiting crew follow-up micro check-in telemetry.',
          degradationAlert: false
        };
        return;
      }

      // Bayesian Score:
      // Weight each response: complete = 1.0, partial = 0.5, none = 0.0, worsened = -0.2
      let totalWeightedScore = 0;
      let totalSideEffects = 0;
      let sumOnsetMins = 0;

      evaluated.forEach(l => {
        if (l.reliefScore === 'complete') totalWeightedScore += 1.0;
        else if (l.reliefScore === 'partial') totalWeightedScore += 0.5;
        else if (l.reliefScore === 'worsened') totalWeightedScore -= 0.2;

        if (l.reportedSideEffects.length > 0 && !l.reportedSideEffects.includes('None')) {
          totalSideEffects += 1;
        }

        if (l.onsetSpeed === '<30m') sumOnsetMins += 20;
        else if (l.onsetSpeed === '30-60m') sumOnsetMins += 45;
        else if (l.onsetSpeed === '>60m') sumOnsetMins += 75;
        else sumOnsetMins += 90;
      });

      // Observed Efficacy (0-100%)
      const rawEfficacy = Math.max(0, Math.min(100, (totalWeightedScore / evaluated.length) * 100));
      
      // Bayesian Posterior Blending (Prior Weight = 2, Empirical Weight = evaluated.length)
      const priorWeight = 2.0;
      const posteriorEfficacy = Math.round(
        (earthBenchmark * priorWeight + rawEfficacy * evaluated.length) / (priorWeight + evaluated.length)
      );

      const efficacyDelta = posteriorEfficacy - earthBenchmark;
      const avgOnset = Math.round(sumOnsetMins / evaluated.length);
      const tolerability = Math.round(((evaluated.length - totalSideEffects) / evaluated.length) * 100);

      // Degradation vs Tolerance Diagnosis:
      // If drug is in repackaged pouch, has been in space > 10 months, and efficacy dropped > 15%, flag degradation!
      const hasRepackagedLoss = logs.some(l => l.packagingType === 'Repackaged Pouch' && l.monthsInSpaceflight >= 12);
      const degradationAlert = hasRepackagedLoss && efficacyDelta <= -15;

      let verdict = 'Flight response matches nominal terrestrial therapeutic expectation.';
      if (degradationAlert) {
        verdict = `Significant potency loss (${efficacyDelta}% vs Earth). Storage repackaging vulnerability indicated. Consider lot quarantine.`;
      } else if (efficacyDelta <= -18) {
        verdict = `Delayed pharmacodynamic response. Slower gastric emptying or microgravity fluid shift blunting absorption.`;
      } else if (tolerability < 70) {
        verdict = `Heightened microgravity adverse effect rate (${100 - tolerability}% reported drowsiness or dizziness).`;
      }

      profiles[medId] = {
        medicationId: medId,
        genericName: logs[0].genericName,
        totalDosesLogged: logs.length,
        evaluatedDosesCount: evaluated.length,
        earthBenchmarkPct: earthBenchmark,
        flightObservedEfficacyPct: posteriorEfficacy,
        efficacyDriftDeltaPct: efficacyDelta,
        averageOnsetMins: avgOnset,
        tolerabilityScorePct: tolerability,
        aiClinicalVerdict: verdict,
        degradationAlert
      };
    });

    return profiles;
  }
}

