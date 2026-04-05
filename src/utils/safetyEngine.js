/**
 * DATA-DRIVEN CLINICAL SAFETY ENGINE (v10.0)
 * Parses renal adjustment rules from the ANTIBIOTICS matrix.
 */
export function getSafetyStatus(abx, egfr) {
  if (!abx || !abx.renal) {
    return { type: 'neutral', label: 'NORMAL', note: 'Standard dose' };
  }

  // Find the matching renal rule based on current eGFR
  const rule = abx.renal.find(r => egfr >= r.egfr_min && egfr <= r.egfr_max);

  if (rule) {
    return {
      type: rule.type || 'warning',
      label: (rule.dose === 'Standard' ? 'SAFE / NORMAL' : rule.dose).toUpperCase(),
      note: rule.dose === 'Standard' ? 'No adjustment req.' : `→ ${rule.dose}`
    };
  }

  return { type: 'neutral', label: 'NORMAL', note: 'Standard dose' };
}
