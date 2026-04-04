import React from 'react';
import { Microscope, Search, Plus } from 'lucide-react';
import { SOURCES, ORGANISMS } from '../data';

export function CultureScreen({ search, setSearch, activeSource, setSource, labRecords, onAddRecord, onRemoveRecord, currentRegimen, getCoverage }) {
  const filteredOrgs = search.length > 1 ? ORGANISMS.filter(o => o.name.toLowerCase().includes(search.toLowerCase())) : [];
  
  return (
    <div className="screen fade-in">
      <header className="screen-header mode-hdr">
        <div><h1>CULTURE RADAR</h1></div>
      </header>

      <div className="culture-grid">
         <div className="c-source-selector">
            {SOURCES.slice(0, 4).map(s => (
               <button key={s.id} className={`c-src-btn ${activeSource === s.id ? 'active' : ''}`} onClick={() => setSource(s.id)}>
                 <span className="c-ico">{s.ico}</span>
                 <span className="c-lbl">{s.l}</span>
               </button>
            ))}
         </div>
         
         <div className="c-workspace">
           <div className="search-box-wrap">
             <Search size={18} />
             <input placeholder={`Search organism for ${activeSource.toUpperCase()}...`} value={search} onChange={e => setSearch(e.target.value)} />
           </div>

           {search && (
             <div className="search-results">
               {filteredOrgs.map(o => (
                 <div key={o.id} className="res-item" onClick={() => { onAddRecord(activeSource, o); setSearch(''); }}>
                   {o.name} <Plus size={12} className="add-ico" />
                 </div>
               ))}
             </div>
           )}

           <div className="lab-history-stack">
              {Object.entries(labRecords).map(([srcId, org]) => {
                 const src = SOURCES.find(x => x.id === srcId) || { l: 'Other', ico: '🔬' };
                 const covResult = getCoverage(org.id, currentRegimen?.abx || []);
                 const isResistant = covResult === 0;
                 const isSensitive = covResult >= 2;

                 return (
                   <div key={srcId} className="lab-report-card fade-in">
                      <div className="l-top">
                         <div className="l-meta-row">
                            <span className="l-ico">{src.ico}</span>
                            <span className="l-src-name">{src.l} culture #1</span>
                         </div>
                         <button className="l-rem" onClick={() => onRemoveRecord(srcId)}>Reset</button>
                      </div>
                      <div className="l-org-found">{org.name}</div>
                      <div className="susceptibility-check">
                         {isResistant ? (
                           <div className="alert-banner danger">
                              <div className="a-hdr">⚠ RESISTANT</div>
                              <div className="a-msg">Escalate immediately. Regimen offers zero coverage against this isolate.</div>
                           </div>
                         ) : isSensitive ? (
                           <div className="alert-banner pass">
                              <div className="a-hdr">✓ SENSITIVE</div>
                              <div className="a-msg">Current regimen covers this isolate. No change needed for this source.</div>
                           </div>
                         ) : (
                           <div className="alert-banner neutral">
                              <div className="a-hdr">± VARIABLE</div>
                              <div className="a-msg">Intermediate sensitivity. Monitor clinical response.</div>
                           </div>
                         )}
                      </div>
                   </div>
                 );
              })}
           </div>
         </div>
      </div>
    </div>
  );
}
