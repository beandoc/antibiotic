import { penicillins } from './meds/penicillins';
import { carbapenems } from './meds/carbapenems';
import { monobactams } from './meds/monobactams';
import { fluoroquinolones } from './meds/fluoroquinolones';
import { cephalosporins_iv } from './meds/cephalosporins_iv';
import { cephalosporins_po } from './meds/cephalosporins_po';
import { aminoglycosides } from './meds/aminoglycosides';
import { lincosamides } from './meds/lincosamides';
import { macrolides } from './meds/macrolides';
import { tetracyclines } from './meds/tetracyclines';
import { glycopeptides_lipopeptides } from './meds/glycopeptides_lipopeptides';
import { oxazolidinones } from './meds/oxazolidinones';
import { miscellaneous } from './meds/miscellaneous';

import { RECS } from './recommendations';

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
