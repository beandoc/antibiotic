/**
 * DATA-DRIVEN CLINICAL SAFETY ENGINE (v12.0)
 * Parses renal (eGFR) and hepatic (Child-Pugh) adjustment rules.
 * Alignment: IDSA 2024 / Sanford Guide safety matrices.
 */
export function getSafetyStatus(abx, rawEgfr, childPugh = 'A') {
  if (!abx) return { type: 'neutral', label: 'NORMAL', note: 'Standard dose' };

  // Guard 1: eGFR not entered yet or invalid
  const egfr = Number(rawEgfr);
  if (rawEgfr == null || rawEgfr === '' || isNaN(egfr)) {
    return { 
      type: 'unknown', 
      label: 'eGFR NOT SET',
      note: 'Enter kidney function to see dose adjustment' 
    };
  }

  // Guard 2: Dialysis convention (eGFR: -1) — must check before band lookup
  if (egfr <= 0) {
    const dialRule = abx.renal?.find(r => r.egfr_min === -1);
    if (dialRule) return {
      type: dialRule.type || 'danger',
      label: String(dialRule.dose ?? 'See dialysis protocol').toUpperCase(),
      note: `Dialysis → ${dialRule.note || dialRule.dose}`,
    };
  }

  // Phase 1: Evaluate Renal Safety Band
  const renalRule = abx.renal?.find(r =>
    r.egfr_min !== -1 && egfr >= r.egfr_min && egfr <= r.egfr_max
  );
  const renalResult = (renalRule && renalRule.dose !== 'Standard') ? {
    type: renalRule.type || 'warning',
    label: String(renalRule.dose).toUpperCase(),
    note: `Renal (eGFR ${egfr}) → ${renalRule.dose}`,
  } : null;

  // Phase 2: Evaluate Hepatic Safety (Child-Pugh)
  const cpRule = abx.hepatic?.find(r => r.class === childPugh);
  const hepaticResult = (cpRule && cpRule.dose !== 'Standard') ? {
    type: cpRule.type || 'warning',
    label: String(cpRule.dose ?? 'Adjust').toUpperCase(),
    note: `Hepatic (Child-Pugh ${childPugh}) → ${cpRule.note || 'Adjust'}`,
  } : null;

  // Phase 3: Resolution — Return the most severe clinical warning
  // Severity Weighting: danger > warning > caution > monitoring > neutral
  const sev = { danger: 4, warning: 3, caution: 2, monitoring: 1, neutral: 0, unknown: -1 };
  
  if (renalResult && hepaticResult) {
    return (sev[renalResult.type] ?? 0) >= (sev[hepaticResult.type] ?? 0)
      ? renalResult : hepaticResult;
  }
  if (renalResult || hepaticResult) return renalResult || hepaticResult;

  // Phase 4: Monitoring Logic (TDM) — Fires even at normal eGFR (e.g. Vancomycin)
  if (abx.monitoring) {
    return {
      type: 'monitoring',
      label: 'TDM REQUIRED',
      note: `${abx.monitoring.note} — target ${abx.monitoring.target}`,
    };
  }

  return { type: 'neutral', label: 'NORMAL', note: 'Standard dose' };
}
