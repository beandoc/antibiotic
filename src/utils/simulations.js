import { getRegimenCoverage, getCoverage } from './coverageEngine.js';
import { getSafetyStatus } from './safetyEngine.js';
import { ORGANISMS, ANTIBIOTICS } from '../data.js';

console.log("🚀 STARTING CLINICAL HARDENING SIMULATION\n");

const findOrg = (name) => ORGANISMS.find(o => o.name.toLowerCase().includes(name.toLowerCase()));
const findAbx = (name) => ANTIBIOTICS.find(a => a.name.toLowerCase().includes(name.toLowerCase()));

// --- CASE 1: HAP + ELIZABETHKINGIA (Intrinsic Resistance) ---
const hapOrgs = ORGANISMS.filter(o => o.sources.includes('hap'));
const piptazo = findAbx('Pip-Tazo');
const levo = findAbx('Levofloxacin');

if (piptazo && levo) {
  const oldHapRegimen = [piptazo.id, levo.id];
  const hapResult = getRegimenCoverage(oldHapRegimen, hapOrgs);
  console.log("CASE 1: HAP + PipTazo/Levo");
  // Elizabethkingia is org_88
  const eliz = ORGANISMS.find(o => o.id === 'org_88');
  const elizGap = hapResult.gaps.find(g => g.id === 'org_88');
  console.log(`- Elizabethkingia Coverage Score: ${3 - (elizGap ? 3 : 0)}`); 
  console.log(`- Result: ${elizGap ? '✅ GAP detected (Correct clinical model)' : '❌ Error: Elizabethkingia covered by PipTazo/Levo'}`);
} else {
  console.log("CASE 1: Error finding meds (Pip-Tazo/Levo)");
}

// --- CASE 2: VRE ENDOCARDITIS (Accuracy) ---
const vre = findOrg('E. faecium (VRE)');
const linezolid = findAbx('Linezolid');
if (vre && linezolid) {
  const vreScore = getCoverage(vre.id, [linezolid.id]);
  console.log("\nCASE 2: VRE Endocarditis + Linezolid");
  console.log(`- VRE Coverage Score: ${vreScore} (Target: 3) ${vreScore === 3 ? '✅' : '❌'}`);
}

// --- CASE 3: VANCOMYCIN TDM AT NORMAL EGFR (Monitoring logic) ---
const vanc = findAbx('Vancomycin');
if (vanc) {
  const safetyNormal = getSafetyStatus(vanc, 100);
  console.log("\nCASE 3: Vancomycin at eGFR 100");
  console.log(`- Status: ${safetyNormal.label} (${safetyNormal.type})`);
  console.log(`- Result: ${safetyNormal.type === 'monitoring' ? '✅ TDM TRIGGERED' : '❌ SILENT NORMAL'}`);
}

// --- CASE 4: DIALYSIS SAFETY (The Dialysis Gap) ---
if (vanc) {
  const safetyDialysis = getSafetyStatus(vanc, 0); // User entered 0 or dialysis
  console.log("\nCASE 4: Vancomycin in Dialysis (eGFR 0)");
  console.log(`- Status: ${safetyDialysis.label}`);
  console.log(`- Note: ${safetyDialysis.note}`);
  console.log(`- Result: ${safetyDialysis.label.includes('POST-HD') ? '✅ DIALYSIS TRIGGERED' : '❌ GAP BUG'}`);
}

// --- CASE 5: ESBL COVERAGE (Ertapenem) ---
const ertapenem = findAbx('Ertapenem');
const esbl = findOrg('E. coli (ESBL)');
if (ertapenem && esbl) {
  const esblScore = getCoverage(esbl.id, [ertapenem.id]);
  console.log("\nCASE 5: Ertapenem vs ESBL");
  console.log(`- Score: ${esblScore} ${esblScore === 3 ? '✅ RELIABLE' : '❌ ERROR'}`);
}

console.log("\n✅ SIMULATION COMPLETE");
