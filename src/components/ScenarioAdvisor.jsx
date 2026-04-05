import React, { useState, useMemo } from 'react';
import { ANTIBIOTICS, ANTIFUNGALS, ORGANISMS, AF_ORGS, SOURCES, RECOMMENDATIONS } from '../data';
import { getCoverage, getRegimenCoverage } from '../utils/coverageEngine';
import styles from './ScenarioAdvisor.module.css';
import modalStyles from './DrugPickerModal.module.css';
import { AlertTriangle, Plus, X, Search, ShieldAlert, CheckCircle, Info } from 'lucide-react';

function OrgPickerModal({ onAdd, onClose }) {
  const [search, setSearch] = useState('');
  const ALL_ORGS = useMemo(() => [...ORGANISMS, ...AF_ORGS], []);

  const filtered = search.length > 0 
    ? ALL_ORGS.filter(o => o.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <div className={modalStyles.drugPickerOverlay} onClick={onClose}>
      <div className={modalStyles.drugPickerSheet} onClick={e => e.stopPropagation()}>
        <div className={modalStyles.dpsHeader}>
           <div className={modalStyles.dpsTitleRow}><span className={modalStyles.dpsTitle}>PATHOGEN SEARCH</span></div>
           <div className={modalStyles.dpsSearchWrap}>
              <Search size={18} className={modalStyles.dpsSearchIco} />
              <input 
                className={modalStyles.dpsSearchInput} autoFocus placeholder="Type organism (e.g. Klebsiella)..."
                value={search} onChange={e => setSearch(e.target.value)}
              />
           </div>
        </div>
        <div className={modalStyles.dpsBody}>
           {filtered.map(o => {
             const isMdr = o.name.includes('ESBL') || o.name.includes('KPC') || o.name.includes('MBL') || o.name.includes('MRSA') || o.name.includes('VRE');
             return (
               <button key={o.id} className={modalStyles.dpsDrugRow} onClick={() => { onAdd(o); onClose(); }}>
                 <div className={modalStyles.dpsNameRow}>
                    <span className={modalStyles.dpsDrugName}>{o.name}</span>
                    {isMdr && <span className={styles.mdrBadgeSearch}>MDR</span>}
                 </div>
               </button>
             );
           })}
           {search.length > 0 && filtered.length === 0 && <div className={modalStyles.dpsEmpty}>No pathogens found</div>}
           {search.length === 0 && <div className={modalStyles.dpsEmpty} style={{opacity: 0.5}}>Start typing for fuzzy match...</div>}
        </div>
        <div className={modalStyles.dpsFooter}>
          <button className={modalStyles.dpsCancelBtn} onClick={onClose} style={{width:'100%'}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export function ScenarioAdvisor({ 
  sourceId, 
  riskModifiers = new Set(), 
  onToggleModifier, 
  selectedAbxSet = new Set(), 
  onToggleAbx, 
  eGFR = 100, 
  astOverrides = {}, 
  setAstOverrides, 
  onOpenDrugPicker, 
  onBack, 
  onNext 
}) {
  const [showOrgPicker, setShowOrgPicker] = useState(false);
  const [cultureOrgs, setCultureOrgs] = useState([]);

  const source = SOURCES.find(s => s.id === sourceId) || { l: 'Undifferentiated', ico: '🌐' };
  const ALL_ORGS = useMemo(() => [...ORGANISMS, ...AF_ORGS], []);
  const ALL_DRUGS = useMemo(() => [...ANTIBIOTICS, ...ANTIFUNGALS], []);

  const baselineOrgIds = useMemo(() => {
    const id = sourceId || 'all';
    return ALL_ORGS.filter(o => (o.sources || []).includes(id)).slice(0, 4).map(o => o.id);
  }, [sourceId, ALL_ORGS]);

  const targetOrgs = useMemo(() => {
    const combined = new Map();
    baselineOrgIds.forEach(id => {
       const org = ALL_ORGS.find(o => o.id === id);
       if (org) combined.set(id, org);
    });
    cultureOrgs.forEach(org => {
       combined.set(org.id, org);
    });
    return Array.from(combined.values());
  }, [baselineOrgIds, cultureOrgs, ALL_ORGS]);

  const selectedAbxList = useMemo(() => {
    return Array.from(selectedAbxSet).map(id => ALL_DRUGS.find(a => String(a.id) === String(id))).filter(Boolean);
  }, [selectedAbxSet, ALL_DRUGS]);

  const coverageMap = useMemo(() => {
    const map = {};
    const abxIds = Array.from(selectedAbxSet);
    targetOrgs.forEach(org => {
      let best = 0;
      abxIds.forEach(id => {
         const override = astOverrides[`${org.id}_${id}`];
         let current = 0;
         if (override === 'S') current = 2;
         else if (override === 'I') current = 1;
         else if (override === 'R') current = 0;
         else current = getCoverage(org.id, [id]);
         if (current > best) best = current;
      });
      map[org.id] = best;
    });
    return map;
  }, [targetOrgs, selectedAbxSet, astOverrides]);

  const gaps = targetOrgs.filter(org => coverageMap[org.id] < 2);

  const redundancies = useMemo(() => {
    const counts = { anaerobes: 0, pseudomonas: 0 };
    selectedAbxList.forEach(a => {
       const n = a.name.toLowerCase();
       if (n.includes('metro') || n.includes('tazo') || n.includes('mero')) counts.anaerobes++;
       if (n.includes('tazo') || n.includes('mero') || n.includes('ceftaz') || n.includes('fepime')) counts.pseudomonas++;
    });
    const flags = [];
    if (counts.anaerobes > 1) flags.push("Overlapping anaerobic cover.");
    if (counts.pseudomonas > 1) flags.push("Multiple anti-pseudomonals.");
    return flags;
  }, [selectedAbxList]);

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

         <div className={styles.guidelineSection}>
            <h3 className={styles.sectionTitle}>Guideline Recommendations (Sanford/IDSA)</h3>
            <div className={styles.recGrid}>
               {(RECOMMENDATIONS[sourceId] || RECOMMENDATIONS['all']).map((rec, ri) => {
                  const assessment = getRegimenCoverage(rec.abx, targetOrgs);
                  const isAlreadySelected = rec.abx.every(id => selectedAbxSet.has(id));
                  
                  return (
                    <div key={ri} className={`${styles.recCard} ${isAlreadySelected ? styles.recSelected : ''}`}>
                       <div className={styles.recHdr}>
                          <div className={styles.recTier}>Tier {rec.tier}</div>
                          <div className={styles.recMatch}>{assessment.total}% Score</div>
                       </div>
                       <div className={styles.recBody}>
                          <strong className={styles.recName}>{rec.name}</strong>
                          <div className={styles.recTags}>
                             {rec.abx.map(id => {
                                const d = ALL_DRUGS.find(x => x.id === id);
                                return <span key={id} className={styles.recTag}>{d?.name || id}</span>;
                             })}
                          </div>
                          {assessment.gaps.length > 0 && (
                            <div className={styles.recGaps}>
                               Gaps in coverage: {assessment.gaps.map(g => g.name).join(', ')}
                            </div>
                          )}
                          <div className={styles.recNotes}>{rec.notes}</div>
                       </div>
                       <button 
                         className={`${styles.applyRecBtn} ${isAlreadySelected ? styles.applied : ''}`}
                         onClick={() => rec.abx.forEach(id => { if(!selectedAbxSet.has(id)) onToggleAbx(id); })}
                         disabled={isAlreadySelected}
                       >
                          {isAlreadySelected ? 'Regimen Applied ✓' : 'Apply this combination'}
                       </button>
                    </div>
                  );
               })}
            </div>
         </div>

         {redundancies.length > 0 && (
           <div className={styles.stewardshipAlert}>
              <CheckCircle size={14} color="#fbbf24" />
              <span>Stewardship: {redundancies[0]}</span>
           </div>
         )}

         <div className={styles.inputGrid}>
            <div className={styles.advSectionBlock}>
               <h3 className={styles.sectionTitle}>Current Regimen</h3>
               <div className={styles.advList}>
                  {selectedAbxList.map(abx => (
                    <div key={abx.id} className={styles.advItemCard}>
                      <div className={styles.abxCTop}>
                         <strong>{abx.name}</strong>
                         <button className={styles.advRemoveBtn} onClick={() => onToggleAbx(abx.id)}><X size={16} /></button>
                      </div>
                      <div className={styles.abxCSub}>{abx.class}</div>
                    </div>
                  ))}
                  <button className={`${styles.advAddBtn} ${styles.primary}`} onClick={onOpenDrugPicker}>+ Add Antibiotic</button>
               </div>
            </div>

            <div className={styles.advSectionBlock}>
               <h3 className={styles.sectionTitle}>Culture & Lab Results</h3>
               <div className={styles.advList}>
                  {cultureOrgs.map(org => (
                    <div key={org.id} className={styles.orgCardComplex}>
                       <div className={styles.orgRow}>
                          <strong>{org.name}</strong>
                          <button className={styles.advRemoveBtn} onClick={() => setCultureOrgs(o => o.filter(x => x.id !== org.id))}><X size={16} /></button>
                       </div>
                       {selectedAbxList.length > 0 && (
                         <div className={styles.astList}>
                            {selectedAbxList.map(abx => {
                               const v = astOverrides[`${org.id}_${abx.id}`];
                               return (
                                 <div key={abx.id} className={styles.astRow}>
                                    <span>{abx.name}</span>
                                    <div className={styles.astToggles}>
                                       <button onClick={() => setAstOverrides(prev => ({...prev, [`${org.id}_${abx.id}`]: 'S'}))} className={`${styles.astBtn} ${v==='S'?styles.astS:''}`}>S</button>
                                       <button onClick={() => setAstOverrides(prev => ({...prev, [`${org.id}_${abx.id}`]: 'I'}))} className={`${styles.astBtn} ${v==='I'?styles.astI:''}`}>I</button>
                                       <button onClick={() => setAstOverrides(prev => ({...prev, [`${org.id}_${abx.id}`]: 'R'}))} className={`${styles.astBtn} ${v==='R'?styles.astR:''}`}>R</button>
                                    </div>
                                 </div>
                               );
                            })}
                         </div>
                       )}
                    </div>
                  ))}
                  <button className={styles.advAddBtn} onClick={() => setShowOrgPicker(true)}>+ Add Organism Isolate</button>
               </div>
            </div>
         </div>

         <div className={styles.advSectionBlock}>
            <h3 className={styles.sectionTitle}>Coverage Engine</h3>
            <div className={styles.advAnalysisList}>
               {targetOrgs.map(org => {
                  const coverage = coverageMap[org.id];
                  return (
                     <div key={org.id} className={styles.advCovRow}>
                        <span className={styles.orgName}>{org.name}</span>
                        <span className={coverage >= 2 ? styles.badgeReliable : coverage === 1 ? styles.badgeWarning : styles.badgeNone}>
                           {coverage >= 2 ? 'RELIABLE' : coverage === 1 ? 'INTERMEDIATE' : 'INADEQUATE'}
                        </span>
                     </div>
                  );
               })}
            </div>

            {gaps.length > 0 && (
               <div className={styles.remediationCard}>
                  <div className={styles.remedHdr}><ShieldAlert size={18} /> CRITICAL COVERAGE GAP</div>
                  <div className={styles.remedList}>
                     {gaps.map(g => {
                        const rescueDrug = (g.name.includes('MRSA')) ? ALL_DRUGS.find(a => a.name === 'Vancomycin') : 
                                          (g.name.includes('VRE')) ? ALL_DRUGS.find(a => a.name === 'Linezolid') : null;
                        const dose = rescueDrug ? (g.name.includes('MRSA') ? "25mg/kg" : "600mg BD") : "";
                        
                        return (
                           <div key={g.id} className={styles.remedItem}>
                              <div className={styles.remedLabel}>
                                 <strong>{g.name}</strong>
                                 {rescueDrug && <span>Suggested: {rescueDrug.name} {dose}</span>}
                              </div>
                              {rescueDrug && !selectedAbxSet.has(rescueDrug.id) && (
                                 <button className={styles.remedAddBtn} onClick={() => onToggleAbx(rescueDrug.id)}>
                                    <Plus size={14} /> Add
                                 </button>
                              )}
                           </div>
                        );
                     })}
                  </div>
               </div>
            )}
         </div>
      </div>

      <div className={styles.advActionFooter}>
         <button className={styles.finalBtn} onClick={onNext}>
            {gaps.length > 0 ? (
              <><AlertTriangle size={18} /> Proceed with {gaps.length} critical gap{gaps.length > 1 ? 's' : ''} ⚠</>
            ) : (
              'Confirm & Finalize Plan ▸'
            )}
         </button>
      </div>

      {showOrgPicker && <OrgPickerModal onAdd={o => setCultureOrgs(prev => [...prev, o])} onClose={() => setShowOrgPicker(false)} />}
    </div>
  );
}
