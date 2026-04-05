import { penicillins } from './meds/penicillins.js';
import { carbapenems } from './meds/carbapenems.js';
import { monobactams } from './meds/monobactams.js';
import { fluoroquinolones } from './meds/fluoroquinolones.js';
import { cephalosporins_iv } from './meds/cephalosporins_iv.js';
import { cephalosporins_po } from './meds/cephalosporins_po.js';
import { aminoglycosides } from './meds/aminoglycosides.js';
import { lincosamides } from './meds/lincosamides.js';
import { macrolides } from './meds/macrolides.js';
import { tetracyclines } from './meds/tetracyclines.js';
import { glycopeptides_lipopeptides } from './meds/glycopeptides_lipopeptides.js';
import { oxazolidinones } from './meds/oxazolidinones.js';
import { miscellaneous } from './meds/miscellaneous.js';

import { RECS } from './recommendations.js';

/**
 * MASTER ANTIBIOTIC REGISTRY (Modularized)
 * Decompressed from 8,500-line monolith to ensure AI stability and clinical parity.
 */
export const ANTIBIOTICS = [
  ...penicillins,
  ...carbapenems,
  ...monobactams,
  ...fluoroquinolones,
  ...cephalosporins_iv,
  ...cephalosporins_po,
  ...aminoglycosides,
  ...lincosamides,
  ...macrolides,
  ...tetracyclines,
  ...glycopeptides_lipopeptides,
  ...oxazolidinones,
  ...miscellaneous
];

/**
 * Aliasing and re-exporting for system-wide clinical compatibility.
 */
export const RECOMMENDATIONS = RECS;

export { penicillins, carbapenems, monobactams, fluoroquinolones, cephalosporins_iv, cephalosporins_po, aminoglycosides, lincosamides, macrolides, tetracyclines, glycopeptides_lipopeptides, oxazolidinones, miscellaneous };
