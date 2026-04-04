import React, { useState, useMemo, useEffect } from 'react';
import { 
  Target, Zap, Microscope, Shield, 
  Plus, Search, ShieldCheck, Check, 
  AlertTriangle, Info, Database, Sun, Moon
} from 'lucide-react';
import { ANTIBIOTICS, ORGANISMS, SOURCES, RECOMMENDATIONS as RECS } from './data';
const RISK_MODS_FALLBACK = ['ICU / Ventilated', 'Prev. ABX <90d', 'Known MDR Carrier', 'Immunocompromised', 'Renal Impairment', 'Hepatic Impairment'];

function App() {
  const [activeTab, setActiveTab] = useState('situation');
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  useEffect(() => {
    document.body.classList.toggle('light-theme', !isDarkMode);
  }, [isDarkMode]);
  const [selectedSourceId, setSelectedSourceId] = useState(null);
  const [riskModifiers, setRiskModifiers] = useState(new Set());
  const [manualAbx, setManualAbx] = useState(new Set());
  const [activeRegimenIdx, setActiveRegimenIdx] = useState(0); 
  const [activeGapOrg, setActiveGapOrg] = useState(null);
  const [cultureSource, setCultureSource] = useState('blood');
  const [eGFR, setEGFR] = useState(100);
  const [childPugh, setChildPugh] = useState('A');
  const [search, setSearch] = useState('');
  const [labRecords, setLabRecords] = useState({}); // sourceId -> organism object
  const [activeCultureOrg, setActiveCultureOrg] = useState(null);

  const resetAll = () => {
    setSelectedSourceId(null);
    setRiskModifiers(new Set());
    setManualAbx(new Set());
    setLabRecords({});
    setEGFR(100);
    setSearch('');
    setActiveCultureOrg(null);
    setActiveTab('situation');
  };

  const availableRegimens = useMemo(() => {
    const id = selectedSourceId || 'all';
    const isHighRisk = riskModifiers.has('ICU / Ventilated') || riskModifiers.has('Prev. ABX <90d');
    const recs = (RECS[id] || RECS['all']) || [];
    return [...recs].sort((a, b) => isHighRisk ? b.tier - a.tier : a.tier - b.tier);
  }, [selectedSourceId, riskModifiers]);

  const manualRegimen = useMemo(() => {
    if (manualAbx.size === 0) return null;
    return { name: 'MANUAL BUILD', abx: Array.from(manualAbx), tier: 0, notes: 'User-specified antibiotic combination.' };
  }, [manualAbx]);

  const relevantOrgs = useMemo(() => {
    const id = selectedSourceId || 'all';
    return ORGANISMS.filter(o => o.sources.includes(id) || o.sources.includes('all'));
  }, [selectedSourceId]);

  const getRegimenCoverage = (abxIds) => {
    if (!abxIds || abxIds.length === 0) return { total: 0, gaps: [] };
    const orgs = relevantOrgs;
    const scores = orgs.map(o => {
      const s = Math.max(...abxIds.map(id => {
        const abx = ANTIBIOTICS.find(a => a.id === id);
        return (abx && abx.coverage) ? abx.coverage[o.id] || 0 : 0;
      }));
      return { o, s };
    });
    const covCount = scores.filter(x => x.s >= 2).length;
    const gaps = scores.filter(x => x.s === 0).map(x => x.o);
    return { total: Math.round((covCount / orgs.length) * 100), gaps };
  };

  const toggleManualAbx = (id) => {
    const next = new Set(manualAbx);
    if (next.has(id)) next.delete(id); else next.add(id);
    setManualAbx(next);
  };

  return (
    <div className="app-container">
      <main className="main-content">
        {activeTab === 'situation' && (
          <SituationScreen 
            selectedId={selectedSourceId} 
            onToggleSource={setSelectedSourceId} 
            riskModifiers={riskModifiers} 
            onToggleModifier={(m) => {
              const next = new Set(riskModifiers);
              if (next.has(m)) next.delete(m); else next.add(m);
              setRiskModifiers(next);
            }}
            onShowEmpiric={() => setActiveTab('regimen')} 
            isDarkMode={isDarkMode}
            onToggleTheme={() => setIsDarkMode(!isDarkMode)}
            onNewPatient={resetAll}
          />
        )}
        {activeTab === 'regimen' && (
          <RegimenScreen 
            source={currentSource} 
            recommendations={availableRegimens}
            riskModifiers={riskModifiers}
            getCov={getRegimenCoverage}
            onOpenGap={(org) => setActiveGapOrg(org)}
          />
        )}
        {activeTab === 'culture' && (
          <CultureScreen 
            search={search} setSearch={setSearch} 
            activeSource={cultureSource} setSource={setCultureSource}
            labRecords={labRecords} onAddRecord={(s, o) => setLabRecords(prev => ({...prev, [s]: o}))}
            onRemoveRecord={(s) => {const n = {...labRecords}; delete n[s]; setLabRecords(n);}}
            currentRegimen={manualRegimen || availableRegimens[activeRegimenIdx]} 
            getCoverage={getRegimenCoverage} 
          />
        )}
        {activeTab === 'safety' && (
          <SafetyScreen eGFR={eGFR} setEGFR={setEGFR} childPugh={childPugh} setChildPugh={setChildPugh} currentRegimen={manualRegimen || availableRegimens[activeRegimenIdx]} />
        )}
      </main>

      {activeGapOrg && (
        <GapAnalysisSheet 
          org={activeGapOrg} 
          regimen={manualRegimen || availableRegimens[activeRegimenIdx]}
          onAdd={id => {
            toggleManualAbx(id);
            setActiveGapOrg(null);
          }}
          onClose={() => setActiveGapOrg(null)}
        />
      )}

      <nav className="bottom-instrument-nav">
        <button className={activeTab === 'situation' ? 'active' : ''} onClick={() => setActiveTab('situation')}><Target size={20} /><span>TRIAGE</span></button>
        <button className={activeTab === 'regimen' ? 'active' : ''} onClick={() => setActiveTab('regimen')}><Zap size={20} /><span>EMPIRIC</span></button>
        <button className={activeTab === 'culture' ? 'active' : ''} onClick={() => setActiveTab('culture')}><Microscope size={20} /><span>CULTURE</span></button>
        <button className={activeTab === 'safety' ? 'active' : ''} onClick={() => setActiveTab('safety')}><Shield size={20} /><span>SAFETY</span></button>
      </nav>
    </div>
  );
}

function SituationScreen({ selectedId, onToggleSource, riskModifiers, onToggleModifier, onShowEmpiric, isDarkMode, onToggleTheme, onNewPatient }) {
  const RISKS = RISK_MODS_FALLBACK;
  
  return (
    <div className="screen fade-in">
       <header className="screen-header mode-hdr">
        <div>
           <button className="new-patient-btn" onClick={onNewPatient}>+ NEW PATIENT</button>
           <h1>SUSPECTED SOURCE</h1>
        </div>
        <button className="theme-toggle" onClick={onToggleTheme}>
           {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>
      <div className="source-grid">
        <button className={`source-tile ${!selectedId ? 'active-source' : ''}`} onClick={() => onToggleSource(null)}><span className="ico">🌐</span><span className="lbl">UNDIFFERENTIATED</span></button>
        {SOURCES.map(s => <button key={s.id} className={`source-tile ${selectedId === s.id ? 'active-source' : ''}`} onClick={() => onToggleSource(s.id)}><span className="ico">{s.ico}</span><span className="lbl">{s.l?.toUpperCase()}</span></button>)}
      </div>
      <div className="modifier-section">
        <label>RISK MODIFIERS</label>
        <div className="chip-cloud">
           {RISKS.map(r => (
             <button key={r} className={`mod-chip ${riskModifiers.has(r) ? 'active' : ''}`} onClick={() => onToggleModifier(r)}>{r}</button>
           ))}
        </div>
      </div>
      <div className="action-area">
         <button className="confirm-btn" onClick={onShowEmpiric}>Show empiric options →</button>
      </div>
    </div>
  );
}

function RegimenScreen({ source, recommendations, riskModifiers, getCov, onOpenGap }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const mods = Array.from(riskModifiers).join(' · ');

  const handleScroll = (e) => {
    const slideWidth = e.target.offsetWidth;
    const slideIdx = Math.round(e.target.scrollLeft / slideWidth);
    if (slideIdx !== activeSlide) setActiveSlide(slideIdx);
  };

  return (
    <div className="screen fade-in">
       <header className="screen-header">
        <div className="breadcrumb"><span className="ico">{source?.ico || '🌐'}</span> {source?.l || 'Undifferentiated'} {mods && `· ${mods}`}</div>
        <p>Swipe to compare options →</p>
      </header>

      <div className="regimen-swipe-deck" onScroll={handleScroll}>
         {recommendations.slice(0, 3).map((r, i) => {
           const { total, gaps } = getCov(r.abx);
           const badge = i === 0 ? '⭐ FIRST-LINE' : i === 1 ? '⚡ ALTERNATIVE' : '🔴 ESCALATION';
           
           return (
             <div key={i} className="regimen-slide">
                <div className={`smart-card tier-${r.tier || (i+1)}`}>
                   <div className="c-hdr">
                      <div className="t-badge">{badge}</div>
                      <div className="p-stat">{total}% COVERED</div>
                   </div>
                   <div className="regimen-title">{r.name}</div>
                   <div className="regimen-abx-chips">
                      {r.abx.map((id, idx) => {
                        const abx = ANTIBIOTICS.find(a => a.id === id);
                        return <div key={idx} className="mini-pill">{abx?.name || id}</div>;
                      })}
                   </div>
                   
                   <div className="confidence-meter">
                      <div className="meter-fill" style={{ width: `${total}%` }}></div>
                      <div className="meter-val">{total}%</div>
                   </div>

                   <div className="gap-zone">
                      <div className="gap-lbl">{i === 2 ? 'Specialist input required — gaps:' : 'Coverage gaps:'}</div>
                      <div className="gap-pills">
                         {gaps.slice(0, 4).map(g => (
                           <div key={g.id} className="mini-gap-pill clickable" onClick={() => onOpenGap(g)}>
                             <span className="g-dot"></span> {g.name}
                           </div>
                         ))}
                         {gaps.length > 4 && <div className="mini-gap-pill overflow">+{gaps.length - 4} more</div>}
                      </div>
                   </div>
                </div>
             </div>
           );
         })}
      </div>

      <div className="pagination-dots">
         {[0, 1, 2].map(i => (
           <div key={i} className={`p-dot ${activeSlide === i ? 'active' : ''}`}></div>
         ))}
      </div>

      <div className="regimen-footer-actions">
         <button className="f-btn ghost">+ Add drug manually</button>
         <button className="f-btn blue">▶ Apply current regimen</button>
      </div>
    </div>
  );
}

function CultureScreen({ search, setSearch, activeSource, setSource, labRecords, onAddRecord, onRemoveRecord, currentRegimen, getCoverage }) {
  const filteredOrgs = useMemo(() => {
    if (!search) return [];
    const q = search.toLowerCase();
    const shorthand = { 'mrsa': 'S. aureus (MRSA)', 'vre': 'E. faecium (VRE)', 'kpc': 'Klebsiella (KPC)', 'esbl': 'E. coli (ESBL)' };
    const targetQ = shorthand[q] || q;
    return ORGANISMS.filter(o => o.name.toLowerCase().includes(targetQ.toLowerCase())).slice(0, 10);
  }, [search]);

  const SOURCES_TAGS = [
    { id: 'blood', l: 'Blood', ico: '🩸' },
    { id: 'urine', l: 'Urine', ico: '💧' },
    { id: 'bal', l: 'BAL', ico: '🫁' },
    { id: 'other', l: 'Other', ico: '+' }
  ];

  return (
    <div className="screen fade-in">
      <header className="screen-header">
        <h1>CULTURE RADAR</h1>
        <div className="nav-culture-sources">
          {SOURCES_TAGS.map(s => (
            <button key={s.id} className={`s-tab ${activeSource === s.id ? 'active' : ''}`} onClick={() => setSource(s.id)}>
              <span className="s-ico">{s.ico}</span>
              <span className="s-lbl">{s.l}</span>
            </button>
          ))}
        </div>
      </header>

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
            const src = SOURCES_TAGS.find(x => x.id === srcId);
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
                      <div className="alert-banner fail">
                         <div className="a-hdr">⚠ RESISTANT</div>
                         <div className="a-msg">Current regimen is inactive. Urgent de-escalation required.</div>
                         <button className="targeted-switch">▶ Switch to Targeted Treatment</button>
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
  );
}

function SafetyScreen({ eGFR, setEGFR, childPugh, setChildPugh, currentRegimen }) {
  const drugs = currentRegimen?.abx?.map(id => ANTIBIOTICS.find(a => a.id === id) || { name: id }) || [];
  const creatinine = (2.4 * (100 / eGFR)).toFixed(1);
  const ckdStage = eGFR < 15 ? '5' : eGFR < 30 ? '4' : eGFR < 45 ? '3b' : eGFR < 60 ? '3a' : '2';

  return (
    <div className="screen fade-in">
      <header className="screen-header">
        <h1 className="safety-accent">Safety · Organ function</h1>
      </header>
      
      <div className="renal-control-instrument">
         <div className="renal-hdr">Renal function</div>
         <div className="slider-row">
            <label>eGFR</label>
            <input type="range" min="5" max="120" value={eGFR} onChange={e => setEGFR(parseInt(e.target.value))} className="renal-slider" />
            <div className="egfr-val-display">{eGFR} mL/min</div>
         </div>
         <div className="metric-row">
            <div className="m-box"><label>Creatinine</label><div className="v">{creatinine} mg/dL</div></div>
            <div className="m-box"><label>CKD stage</label><div className="v">{ckdStage}</div></div>
         </div>
      </div>

      <div className="safety-section-card">
         <div className="s-card-hdr">💊 Current regimen safety</div>
         <div className="safety-list">
            {drugs.map((a, i) => {
               const safety = getSafetyStatus(a, eGFR);
               return (
                 <div key={i} className="safety-line-item">
                    <div className="s-name">{a.name}</div>
                    <div className={`s-badge-stack ${safety.type}`}>
                       <div className="s-main-tag">{safety.label}</div>
                       <div className="s-sub-note">{safety.note}</div>
                    </div>
                 </div>
               );
            })}
         </div>
      </div>
    </div>
  );
}

function GapAnalysisSheet({ org, onAdd, onClose }) {
  if (!org) return null;
  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
       <div className="bottom-sheet-content" onClick={e => e.stopPropagation()}>
          <div className="sheet-hdr">
             <h3>Gap analysis: {org?.name || 'Unknown'}</h3>
             <button className="sheet-close" onClick={onClose}>✕</button>
          </div>
          <div className="org-detail-card">
             <div className="o-meta">MDR ORGANISM</div>
             <div className="l-name">{org.name}</div>
             <div className="o-status-badge">NOT COVERED</div>
          </div>
          <div className="clinical-context-note">
             <h4>CLINICAL RATIONALE</h4>
             <p>VRE coverage is essential in ICU bacteraemia with prior glycopeptide exposure. Linezolid is the preferred rescue agent.</p>
          </div>
          <button className="add-rescue-btn" onClick={() => onAdd('linezolid')}>+ Add Linezolid to regimen</button>
       </div>
    </div>
  );
}

function getSafetyStatus(abx, egfr) {
  const name = abx?.name || '';
  if (name.includes('Nitrofurantoin') && egfr < 45) return { type: 'danger', label: 'CONTRAINDICATED', note: 'Insufficient urine levels' };
  if (name.includes('Pip-Tazo') && egfr < 40) return { type: 'warning', label: 'DOSE REDUCE', note: '→ 2.25g q6h' };
  if (name.includes('Meropenem') && egfr < 25) return { type: 'warning', label: 'DOSE REDUCE', note: '→ 500mg q8h' };
  if (name.includes('Vancomycin')) return { type: 'warning', label: 'AUC GUIDED', note: 'Extend interval' };
  if (name.includes('Linezolid')) return { type: 'success', label: 'SAFE', note: 'No adjustment req.' };
  return { type: 'neutral', label: 'NORMAL', note: 'Standard dose' };
}

export default App;
