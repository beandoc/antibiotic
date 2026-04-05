import React from 'react';
import { ShieldCheck, Target, AlertTriangle } from 'lucide-react';
import { ANTIBIOTICS, ANTIFUNGALS } from '../data';
import { getSafetyStatus } from '../utils/safetyEngine';
import styles from './SafetyScreen.module.css';

export function SafetyScreen({ eGFR, setEGFR, childPugh, setChildPugh, currentRegimen, onNext }) {
  const ALL_DRUGS = [...ANTIBIOTICS, ...ANTIFUNGALS];
  const drugs = currentRegimen?.abx?.map(id => ALL_DRUGS.find(a => String(a.id) === String(id)) || { name: id }) || [];
  const creatinine = (2.4 * (100 / eGFR)).toFixed(1);
  const ckdStage = eGFR < 15 ? '5' : eGFR < 30 ? '4' : eGFR < 45 ? '3b' : eGFR < 60 ? '3a' : '2';

  return (
    <div className={`screen fade-in ${styles.safetyScreen}`}>
       <header className="screen-header mode-hdr">
        <div><h1>SAFETY · ORGAN FUNCTION</h1></div>
      </header>
      
      <div className={styles.safetyGrid}>
        <div className={styles.safetySectionCard}>
           <div className={styles.sCardHdr}>Renal function</div>
           <div className={styles.renalControls}>
              <div className={styles.rcMetric}>
                 <div className={styles.rcLbl}>Estimated GFR</div>
                 <div className={styles.rcVal}>{eGFR} <span>mL/min</span></div>
                 <input type="range" min="5" max="120" value={eGFR} onChange={e => setEGFR(Number(e.target.value))} />
              </div>
              <div className={styles.rcSide}>
                 <div className={styles.sStat}><label>Creatinine</label><span>{creatinine} mg/dL</span></div>
                 <div className={styles.sStat}><label>CKD stage</label><span>{ckdStage}</span></div>
              </div>
           </div>
        </div>

        <div className={styles.safetySectionCard}>
           <div className={styles.sCardHdr}>Liver function</div>
           <div className={styles.renalControls} style={{marginTop: '10px'}}>
              <div className={styles.rcMetric}>
                 <div className={styles.rcLbl}>Child-Pugh Class</div>
                 <div className={styles.rcVal}>{childPugh}</div>
                 <div className={styles.cpToggles}>
                    {['A', 'B', 'C'].map(c => (
                       <button key={c} className={`${styles.cpBtn} ${childPugh === c ? styles.active : ''}`} onClick={() => setChildPugh(c)}>Class {c}</button>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        <div className={styles.safetySectionCard}>
           <div className={styles.sCardHdr}>💊 Current regimen safety</div>
           <div className={styles.safetyList}>
              {drugs.map((a, i) => {
                 const safety = getSafetyStatus(a, eGFR, childPugh);
                 return (
                   <div key={i} className={styles.safetyLineItem}>
                      <div className={styles.sName}>{a.name}</div>
                      <div className={`${styles.sBadgeStack} ${safety.type}`}>
                         <div className={styles.sMainTag}>{safety.label}</div>
                         <div className={styles.sSubNote}>{safety.note}</div>
                      </div>
                   </div>
                 );
              })}
              {drugs.length === 0 && <div className={styles.sEmpty}>No medications selected for safety screen</div>}
           </div>
        </div>
      </div>
      
      <div className="regimen-footer-actions" style={{ gap: '10px', marginTop: '40px' }}>
         <button className="f-btn ghost" onClick={() => onNext({ back: true })} style={{ flex: 1 }}>← Back</button>
         <button className="f-btn blue" onClick={onNext} style={{ flex: 2 }}>Continue to Culture ▸</button>
      </div>
    </div>
  );
}
