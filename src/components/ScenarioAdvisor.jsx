import React, { useState, useMemo } from 'react';
import { ANTIBIOTICS, ORGANISMS, SOURCES } from '../data';
import { getCoverage } from '../utils/coverageEngine';
import styles from './ScenarioAdvisor.module.css';

// Custom Organism Picker is low-risk so we keep it local for speed
function OrgPickerModal({ onAdd, onClose }) {
  const [search, setSearch] = useState('');
  const filtered = search.length > 0 
    ? ORGANISMS.filter(o => o.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <div className="drug-picker-overlay" onClick={onClose}>
      <div className="drug-picker-sheet" onClick={e => e.stopPropagation()}>
        <div className="dps-header">
           <div className="dps-title-row"><span className="dps-title">SELECT ORGANISM</span></div>
           <div className="dps-search-wrap">
              <span className="dps-search-ico">🔍</span>
              <input 
                className="dps-search-input" autoFocus placeholder="Search pathogen..."
                value={search} onChange={e => setSearch(e.target.value)}
              />
           </div>
        </div>
        <div className="dps-body">
           {filtered.map(o => (
             <button key={o.id} className="dps-drug-row" onClick={() => { onAdd(o); onClose(); }}>
               <span className="dps-drug-name">{o.name}</span>
             </button>
           ))}
           {search.length > 0 && filtered.length === 0 && <div className="dps-empty">No matches</div>}
           {search.length === 0 && <div className="dps-empty" style={{opacity: 0.5}}>Type to search organisms...</div>}
        </div>
        <div className="dps-footer">
          <button className="dps-cancel-btn" onClick={onClose} style={{width:'100%'}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export function ScenarioAdvisor({ sourceId, selectedAbxSet, onToggleAbx, eGFR, setEGFR, onOpenDrugPicker, onBack, onNext }) {
  const [showOrgPicker, setShowOrgPicker] = useState(false);
  const [cultureOrgs, setCultureOrgs] = useState([]);

  // Source details
  const source = SOURCES.find(s => s.id === sourceId) || { l: 'Undifferentiated', ico: '🌐' };
  
  // Deriving baseline organisms for the scenario
  const baselineOrgIds = useMemo(() => {
    const id = sourceId || 'all';
    return ORGANISMS.filter(o => o.sources.includes(id) || o.sources.includes('all')).slice(0, 3).map(o => o.id);
  }, [sourceId]);

  const targetOrgs = useMemo(() => {
    const combined = new Map();
    baselineOrgIds.forEach(id => {
       const org = ORGANISMS.find(o => o.id === id);
       if (org) combined.set(id, org);
    });
    cultureOrgs.forEach(org => {
       combined.set(org.id, org);
    });
    return Array.from(combined.values());
  }, [baselineOrgIds, cultureOrgs]);

  const selectedAbxList = Array.from(selectedAbxSet).map(id => ANTIBIOTICS.find(a => String(a.id) === String(id))).filter(Boolean);

  const coverageMap = useMemo(() => {
    const map = {};
    const abxIds = Array.from(selectedAbxSet);
    targetOrgs.forEach(org => {
      map[org.id] = getCoverage(org.id, abxIds);
    });
    return map;
  }, [targetOrgs, selectedAbxSet]);

  const gaps = targetOrgs.filter(org => coverageMap[org.id] < 2);

  return (
    <div className={`${styles.advisorScreen} screen fade-in`}>
      <div className={styles.advHeader}>
         <h1 className={styles.advMainTitle}>Clinical Antibiotic Advisor</h1>
         <button className={styles.advBackBtn} onClick={onBack}>← Change Scenario</button>
      </div>

      <div className={styles.advBody}>
         
         <div className={`${styles.advCard} ${styles.scenarioCard}`}>
            <h2>{source.ico} {source.l}</h2>
            <p>Empiric coverage targets for this source.</p>
         </div>

         <div className={`${styles.advCard} ${styles.patientContext}`}>
            <h3 className={styles.sectionTitle}>Patient Context</h3>
            
            <div className={styles.formGroup}>
               <label>Kidney Function (eGFR: {eGFR} mL/min)</label>
               <input 
                  type="range" min="5" max="100" step="5" 
                  value={eGFR} onChange={e => setEGFR(Number(e.target.value))} 
                  className={styles.advSlider}
               />
               <div className={styles.sliderLabels}>
                  <span>Dialysis</span>
                  <span>Normal</span>
               </div>
            </div>

            <div className={styles.formGroup}>
               <label>Drug Allergies</label>
               <button className={styles.advAddBtn}>+ Add Allergy (Penicillin, etc.)</button>
            </div>
         </div>

         <div className={styles.inputGrid}>
           <div className={styles.advSectionBlock}>
              <h3 className={styles.sectionTitle}>Selected Antibiotics</h3>
              {selectedAbxList.length === 0 ? (
                 <p className={styles.advEmptyText}>No antibiotics selected yet</p>
              ) : (
                 <div className={styles.advList}>
                    {selectedAbxList.map(abx => (
                       <div key={abx.id} className={`${styles.advItemCard} abx-card`}>
                         <div className={styles.abxCTop}>
                            <strong>{abx.name}</strong>
                            <button className={styles.advRemoveBtn} onClick={() => onToggleAbx(abx.id)}>✕</button>
                         </div>
                         <div className={styles.abxCSub}>{abx.class}</div>
                         <div className={styles.abxCDetails}>
                            <span>📍 {abx.route}</span>
                            <span>💊 Dosing calc available in Safety →</span>
                         </div>
                       </div>
                    ))}
                 </div>
              )}
              <button className={`${styles.advAddBtn} primary`} onClick={onOpenDrugPicker}>+ Add Antibiotic</button>
           </div>

           <div className={styles.advSectionBlock}>
              <h3 className={styles.sectionTitle}>Culture Results</h3>
              {cultureOrgs.length === 0 ? (
                 <p className={styles.advEmptyText}>No microbiology found yet</p>
              ) : (
                 <div className={styles.advList}>
                    {cultureOrgs.map(org => (
                       <div key={org.id} className={`${styles.advItemCard} ${styles.orgCard}`}>
                          <span>{org.name}</span>
                          <button className={styles.advRemoveBtn} onClick={() => setCultureOrgs(prev => prev.filter(o => o.id !== org.id))}>✕</button>
                       </div>
                    ))}
                 </div>
              )}
              <button className={styles.advAddBtn} onClick={() => setShowOrgPicker(true)}>+ Add Organism</button>
           </div>
         </div>

         {selectedAbxList.length > 0 && (
            <div className={styles.advSectionBlock}>
               <h3 className={styles.sectionTitle}>Coverage Analysis</h3>
               <div className={styles.advAnalysisList}>
                  {targetOrgs.map(org => {
                     const isCovered = coverageMap[org.id] >= 2;
                     return (
                        <div key={org.id} className={styles.advCovRow}>
                           <span className={styles.orgName}>{org.name}</span>
                           {isCovered ? (
                              <span className={styles.badgeReliable}>Reliable</span>
                           ) : (
                              <span className={styles.badgeNone}>Inadequate</span>
                           )}
                        </div>
                     );
                  })}
               </div>
               
               {gaps.length > 0 && (
                  <>
                     <div className={`${styles.advAlertBox} ${styles.advAlertBoxDanger} mt-4`}>
                        <div className={styles.alertHdr}>
                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                           Action Required: Coverage Gaps
                        </div>
                        <div className={styles.alertItems}>
                           {gaps.map(g => (
                              <div key={g.id} className={styles.alertItemRow}>{g.name}</div>
                           ))}
                        </div>
                     </div>

                     <div className={`${styles.advAlertBox} ${styles.advAlertBoxInfo} mt-4`}>
                        <div className={`${styles.alertHdr} ${styles.alertHdrInfo}`}>
                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21h6"></path><path d="M12 21v-4"></path><path d="M12 17A7 7 0 1 0 5 10c0 2.38 1.19 4.47 3 5.74V17h8v-1.26c1.81-1.27 3-3.36 3-5.74A7 7 0 1 0 12 10z"></path></svg>
                           Clinical Suggestion
                        </div>
                        <div className={styles.recItems}>
                           {ANTIBIOTICS.filter(a => gaps.every(g => a.coverage[g.id] >= 2)).slice(0, 3).map(a => (
                              <div key={a.id} className={styles.recRow}>
                                 <span className={styles.arr}>→</span> <strong>{a.name}</strong> — Resolves all coverage gaps
                              </div>
                           ))}
                        </div>
                     </div>
                  </>
               )}
            </div>
         )}
      </div>

      <div className={styles.advActionFooter}>
         <button className={styles.finalBtn} onClick={onNext}>
            Proceed to Final Safety Check ▸
         </button>
      </div>

      {showOrgPicker && (
         <OrgPickerModal onAdd={(org) => {
            if (!cultureOrgs.find(o => o.id === org.id)) setCultureOrgs([...cultureOrgs, org]);
         }} onClose={() => setShowOrgPicker(false)} />
      )}
    </div>
  );
}
