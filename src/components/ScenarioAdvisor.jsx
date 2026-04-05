import React, { useState, useMemo } from 'react';
import { ANTIBIOTICS, ORGANISMS, SOURCES } from '../data';
import { getCoverage } from '../utils/coverageEngine';
import styles from './ScenarioAdvisor.module.css';
import modalStyles from './DrugPickerModal.module.css';

function OrgPickerModal({ onAdd, onClose }) {
  const [search, setSearch] = useState('');
  const filtered = search.length > 0 
    ? ORGANISMS.filter(o => o.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <div className={modalStyles.drugPickerOverlay} onClick={onClose}>
      <div className={modalStyles.drugPickerSheet} onClick={e => e.stopPropagation()}>
        <div className={modalStyles.dpsHeader}>
           <div className={modalStyles.dpsTitleRow}><span className={modalStyles.dpsTitle}>SELECT ORGANISM</span></div>
           <div className={modalStyles.dpsSearchWrap}>
              <span className={modalStyles.dpsSearchIco}>🔍</span>
              <input 
                className={modalStyles.dpsSearchInput} autoFocus placeholder="Search pathogen..."
                value={search} onChange={e => setSearch(e.target.value)}
              />
           </div>
        </div>
        <div className={modalStyles.dpsBody}>
           {filtered.map(o => (
             <button key={o.id} className={modalStyles.dpsDrugRow} onClick={() => { onAdd(o); onClose(); }}>
               <span className={modalStyles.dpsDrugName}>{o.name}</span>
             </button>
           ))}
           {search.length > 0 && filtered.length === 0 && <div className={modalStyles.dpsEmpty}>No matches</div>}
           {search.length === 0 && <div className={modalStyles.dpsEmpty} style={{opacity: 0.5}}>Type to search organisms...</div>}
        </div>
        <div className={modalStyles.dpsFooter}>
          <button className={modalStyles.dpsCancelBtn} onClick={onClose} style={{width:'100%'}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export function ScenarioAdvisor({ sourceId, riskModifiers, onToggleModifier, selectedAbxSet, onToggleAbx, eGFR, setEGFR, onOpenDrugPicker, onBack, onNext }) {
  const [showOrgPicker, setShowOrgPicker] = useState(false);
  const [cultureOrgs, setCultureOrgs] = useState([]);
  const [astOverrides, setAstOverrides] = useState({}); // { 'orgId_drugId': 'S'|'I'|'R' }

  const source = SOURCES.find(s => s.id === sourceId) || { l: 'Undifferentiated', ico: '🌐' };
  
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
      let best = 0;
      abxIds.forEach(drugId => {
         const key = `${org.id}_${drugId}`;
         const override = astOverrides[key];
         let current = 0;
         if (override === 'S') current = 2;
         else if (override === 'I') current = 1;
         else if (override === 'R') current = 0;
         else current = getCoverage(org.id, [drugId]);
         if (current > best) best = current;
      });
      map[org.id] = best;
    });
    return map;
  }, [targetOrgs, selectedAbxSet, astOverrides]);

  const gaps = targetOrgs.filter(org => coverageMap[org.id] < 2);

  const toggleAST = (orgId, drugId, val) => {
    setAstOverrides(prev => {
       const next = { ...prev };
       const key = `${orgId}_${drugId}`;
       if (next[key] === val) delete next[key]; else next[key] = val;
       return next;
    });
  };

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
               <input type="range" min="5" max="100" step="5" value={eGFR} onChange={e => setEGFR(Number(e.target.value))} className={styles.advSlider} />
               <div className={styles.sliderLabels}><span>Dialysis</span><span>Normal</span></div>
            </div>

            <div className={styles.formGroup}>
               <label>Drug Risk Factors</label>
               <div className={styles.modsRow}>
                  {['ICU / Ventilated', 'Prev. ABX <90d', 'Known MDR Carrier'].map(m => (
                    <button key={m} className={`${styles.modChip} ${riskModifiers?.has(m) ? styles.modActive : ''}`} onClick={() => onToggleModifier(m)}>
                      {m}
                    </button>
                  ))}
               </div>
            </div>
         </div>

         <div className={styles.inputGrid}>
            <div className={styles.advSectionBlock}>
               <h3 className={styles.sectionTitle}>Selected Antibiotics</h3>
               {selectedAbxList.map(abx => (
                  <div key={abx.id} className={styles.advItemCard}>
                    <div className={styles.abxCTop}>
                       <strong>{abx.name}</strong>
                       <button className={styles.advRemoveBtn} onClick={() => onToggleAbx(abx.id)}>✕</button>
                    </div>
                    <div className={styles.abxCSub}>{abx.class}</div>
                  </div>
               ))}
               <button className={`${styles.advAddBtn} ${styles.primary}`} onClick={onOpenDrugPicker}>+ Add Antibiotic</button>
            </div>

            <div className={styles.advSectionBlock}>
               <h3 className={styles.sectionTitle}>Culture Results & Overrides</h3>
               {cultureOrgs.map(org => (
                  <div key={org.id} className={styles.orgCardComplex}>
                     <div className={styles.orgRow}>
                        <strong>{org.name}</strong>
                        <button className={styles.advRemoveBtn} onClick={() => setCultureOrgs(o => o.filter(x => x.id !== org.id))}>✕</button>
                     </div>
                     {selectedAbxList.length > 0 && (
                        <div className={styles.astList}>
                           {selectedAbxList.map(abx => {
                              const v = astOverrides[`${org.id}_${abx.id}`];
                              return (
                                 <div key={abx.id} className={styles.astRow}>
                                    <span>{abx.name}</span>
                                    <div className={styles.astToggles}>
                                       <button onClick={() => toggleAST(org.id, abx.id, 'S')} className={`${styles.astBtn} ${v==='S'?styles.astS:''}`}>S</button>
                                       <button onClick={() => toggleAST(org.id, abx.id, 'I')} className={`${styles.astBtn} ${v==='I'?styles.astI:''}`}>I</button>
                                       <button onClick={() => toggleAST(org.id, abx.id, 'R')} className={`${styles.astBtn} ${v==='R'?styles.astR:''}`}>R</button>
                                    </div>
                                 </div>
                              )
                           })}
                        </div>
                     )}
                  </div>
               ))}
               <button className={styles.advAddBtn} onClick={() => setShowOrgPicker(true)}>+ Add Microbiology Result</button>
            </div>
         </div>

         <div className={styles.advSectionBlock}>
            <h3 className={styles.sectionTitle}>Coverage Analysis</h3>
            <div className={styles.advAnalysisList}>
               {targetOrgs.map(org => {
                  const coverage = coverageMap[org.id];
                  return (
                     <div key={org.id} className={styles.advCovRow}>
                        <span className={styles.orgName}>{org.name}</span>
                        <span className={coverage >= 2 ? styles.badgeReliable : coverage === 1? styles.badgeWarning : styles.badgeNone}>
                           {coverage >= 2 ? 'RELIABLE' : coverage === 1 ? 'INTERMEDIATE' : 'INADEQUATE/GAPPED'}
                        </span>
                     </div>
                  );
               })}
            </div>
            {gaps.length > 0 && (
               <div className={`${styles.advAlertBox} ${styles.advAlertBoxDanger}`}>
                  <div className={styles.alertHdr}>CRITICAL COVERAGE GAP</div>
                  <div className={styles.alertItems}>{gaps.map(g => <div key={g.id}>{g.name}</div>)}</div>
               </div>
            )}
         </div>
      </div>

      <div className={styles.advActionFooter}>
         <button className={styles.finalBtn} onClick={onNext}>
            Confirm & Proceed to Safety Check ▸
         </button>
      </div>

      {showOrgPicker && <OrgPickerModal onAdd={o => setCultureOrgs([...cultureOrgs, o])} onClose={() => setShowOrgPicker(false)} />}
    </div>
  );
}
