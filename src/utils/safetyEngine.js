/**
 * DATA-DRIVEN CLINICAL SAFETY ENGINE (v11.0)
 * Parses renal (eGFR) and hepatic (Child-Pugh) adjustment rules.
 */
export function getSafetyStatus(abx, rawEgfr, childPugh = 'A') {
  if (!abx) return { type: 'neutral', label: 'NORMAL', note: 'Standard dose' };
  const egfr = Number(rawEgfr);

  // 1. Check Hepatic Safety (Priority if defined)
  if (abx.hepatic) {
    const cpRule = abx.hepatic.find(r => r.class === childPugh);
    if (cpRule && cpRule.dose !== 'Standard') {
      return {
        type: cpRule.type || 'warning',
        label: cpRule.dose.toUpperCase(),
        note: `Hepatic (Child-Pugh ${childPugh}) → ${cpRule.note || 'Adjust'}`
      };
    }
  }

  // 2. Check Renal Safety
  if (abx.renal) {
    const renalRule = abx.renal.find(r => egfr >= r.egfr_min && egfr <= r.egfr_max);
    if (renalRule && renalRule.dose !== 'Standard') {
      return {
        type: renalRule.type || 'warning',
        label: renalRule.dose.toUpperCase(),
        note: `Renal (eGFR ${egfr}) → ${renalRule.dose}`
      };
    }
  }

  return { type: 'neutral', label: 'NORMAL', note: 'Standard dose' };
}
