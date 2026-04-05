import React from 'react';
import { X, ShieldAlert } from 'lucide-react';
import styles from './GapAnalysisSheet.module.css';

export function GapAnalysisSheet({ org, onAdd, onClose }) {
  if (!org) return null;
  return (
    <div className={styles.bottomSheetOverlay} onClick={onClose}>
       <div className={styles.bottomSheetContent} onClick={e => e.stopPropagation()}>
          <div className={styles.sheetHdr}>
             <h3>Gap analysis: {org?.name || 'Unknown'}</h3>
             <button className={styles.sheetClose} onClick={onClose}><X size={20} /></button>
          </div>

          <div className={styles.orgDetailCard}>
             <div className={styles.oMeta}>TARGET ORGANISM</div>
             <div className={styles.lName}>{org.name}</div>
             <div className={styles.oStatusBadge}>⚠️ COVERAGE INADEQUATE</div>
          </div>

          <div className={styles.clinicalContextNote}>
             <h4>CLINICAL RATIONALE</h4>
             <p>This organism is considered highly pathogenic. Our analysis suggests your current regimen may leave a coverage gap. Expert consultation or empiric escalation with a targeted rescue agent (e.g., Linezolid or Daptomycin) is recommended based on local guidelines.</p>
          </div>

          <button className={styles.addRescueBtn} onClick={() => onAdd('linezolid')}>
            + Add Linezolid to regimen
          </button>
       </div>
    </div>
  );
}
