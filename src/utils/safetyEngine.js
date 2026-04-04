import { ANTIBIOTICS } from '../data';

export function getSafetyStatus(abx, egfr) {
  const name = abx?.name || '';
  if (name.includes('Nitrofurantoin') && egfr < 45) return { type: 'danger', label: 'CONTRAINDICATED', note: 'Insufficient urine levels' };
  if (name.includes('Pip-Tazo') && egfr < 40) return { type: 'warning', label: 'DOSE REDUCE', note: '→ 2.25g q6h' };
  if (name.includes('Meropenem') && egfr < 25) return { type: 'warning', label: 'DOSE REDUCE', note: '→ 500mg q8h' };
  if (name.includes('Vancomycin')) return { type: 'warning', label: 'AUC GUIDED', note: '→ 25mg/kg; q24-48h' };
  if (name.includes('Linezolid')) return { type: 'success', label: 'SAFE', note: 'No adjustment req.' };
  if (name.includes('Metronidazole')) return { type: 'warning', label: 'CAUTION', note: 'Severe Child-Pugh C' };
  if (name.includes('Rifampic')) return { type: 'danger', label: 'AVOID', note: 'Hepatotoxic monitor LFTs' };
  if (name.includes('Clindamycin')) return { type: 'success', label: 'SAFE', note: 'Normal hepatic fx only' };
  return { type: 'neutral', label: 'NORMAL', note: 'Standard dose' };
}
