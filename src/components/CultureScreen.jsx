import React from 'react';
import { Microscope, Search, Plus, ShieldCheck } from 'lucide-react';
import { SOURCES, ORGANISMS, AF_ORGS } from '../data';
import styles from './CultureScreen.module.css';

export function CultureScreen({ search, setSearch, activeSource, setSource, labRecords, onAddRecord, onRemoveRecord, currentRegimen, getCoverage, onSkip, onFinish }) {
  const ALL_ORGS = [...ORGANISMS, ...AF_ORGS];
  const filteredOrgs = search.length > 1 ? ALL_ORGS.filter(o => o.name.toLowerCase().includes(search.toLowerCase())) : [];
  
  return (
    <div className={`screen fade-in ${styles.cultureScreen}`}>
      <header className="screen-header mode-hdr">
        <div><h1>CULTURE RADAR</h1></div>
      </header>

      <div className={styles.cultureGrid}>
         <div className={styles.cSourceSelector}>
            {SOURCES.slice(0, 4).map(s => (
               <button key={s.id} className={`${styles.cSrcBtn} ${activeSource === s.id ? styles.active : ''}`} onClick={() => setSource(s.id)}>
                 <span className={styles.cIco}>{s.ico}</span>
                 <span className={styles.cLbl}>{s.l}</span>
               </button>
            ))}
         </div>
         
         <div className={styles.cWorkspace}>
            <div className={styles.searchBoxWrap}>
              <Search size={18} className={styles.searchIco} />
              <input placeholder={`Search organism for ${activeSource.toUpperCase()}...`} value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {search && (
              <div className={styles.searchResults}>
                {filteredOrgs.map(o => (
                  <div key={o.id} className={styles.resItem} onClick={() => { onAddRecord(activeSource, o); setSearch(''); }}>
                    {o.name} <Plus size={12} className={styles.addIco} />
                  </div>
                ))}
              </div>
            )}

            <div className={styles.labHistoryStack}>
               {Object.keys(labRecords).length === 0 && !search && (
                  <div className={styles.emptyCultureState}>
                     <Microscope size={32} className={styles.ecsIco} />
                     <h3>No cultures reported</h3>
                     <p>Enter pathogen data manually using the search above to cross-reference against the current regimen.</p>
                     <button className={`confirm-btn ${styles.ecsBtn}`} onClick={() => onSkip({ back: true })}>
                        Awaiting isolate identification
                     </button>
                  </div>
               )}

               {Object.entries(labRecords).map(([srcId, org]) => {
                  const src = SOURCES.find(x => x.id === srcId) || { l: 'Other', ico: '🔬' };
                  const covResult = getCoverage(org.id, currentRegimen?.abx || []);
                  const isResistant = covResult === 0;
                  const isSensitive = covResult >= 2;

                  return (
                    <div key={srcId} className={`${styles.labReportCard} fade-in`}>
                       <div className={styles.lTop}>
                          <div className={styles.lMetaRow}>
                             <span className={styles.lIco}>{src.ico}</span>
                             <span className={styles.lSrcName}>{src.l} culture #1</span>
                          </div>
                          <button className={styles.lRem} onClick={() => onRemoveRecord(srcId)}>Reset</button>
                       </div>
                       <div className={styles.lOrgFound}>{org.name}</div>
                       <div className={styles.susceptibilityCheck}>
                          {isResistant ? (
                            <div className={`${styles.alertBanner} ${styles.danger}`}>
                               <div className={styles.aHdr}>⚠ RESISTANT</div>
                               <div className={styles.aMsg}>Escalate immediately. Regimen offers zero coverage against this isolate.</div>
                            </div>
                          ) : isSensitive ? (
                            <div className={`${styles.alertBanner} ${styles.pass}`}>
                               <div className={styles.aHdr}>✓ SENSITIVE</div>
                               <div className={styles.aMsg}>Current regimen covers this isolate. No change needed for this source.</div>
                            </div>
                          ) : (
                            <div className={`${styles.alertBanner} ${styles.neutral}`}>
                               <div className={styles.aHdr}>± VARIABLE</div>
                               <div className={styles.aMsg}>Intermediate sensitivity. Monitor clinical response.</div>
                            </div>
                          )}
                       </div>
                    </div>
                  );
               })}
            </div>
         </div>
      </div>

       <div className="regimen-footer-actions" style={{ gap: '10px', marginTop: '40px' }}>
         <button className="f-btn ghost" onClick={() => onSkip({ back: true })} style={{ flex: 1 }}>
            ← Back
         </button>
         <button className="f-btn blue" onClick={onFinish} style={{ flex: 2 }}>
            Finalize Treatment ▸
         </button>
      </div>
    </div>
  );
}
