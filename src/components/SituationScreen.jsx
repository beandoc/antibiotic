import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { SOURCES } from '../data';
import { PatientManager } from './PatientManager';

const RISK_MODS_FALLBACK = ['ICU / Ventilated', 'Prev. ABX <90d', 'Known MDR Carrier', 'Immunocompromised', 'Renal Impairment', 'Hepatic Impairment'];

export function SituationScreen({ selectedId, onToggleSource, riskModifiers, onToggleModifier, onShowEmpiric, isDarkMode, onToggleTheme, pmProps }) {
  const RISKS = RISK_MODS_FALLBACK;
  
  return (
    <div className="screen fade-in">
       <header className="screen-header mode-hdr">
        <div style={{ width: '100%' }}>
           <PatientManager {...pmProps} />
           <h1>SUSPECTED SOURCE</h1>
        </div>
        <button className="theme-toggle" onClick={onToggleTheme}>
           {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>
      <div className="source-grid">
        <button className={`source-tile ${!selectedId ? 'active-source' : ''}`} onClick={() => onToggleSource(null)}><span className="ico">��</span><span className="lbl">UNDIFFERENTIATED</span></button>
        {SOURCES.map(s => <button key={s.id} className={`source-tile ${selectedId === s.id ? 'active-source' : ''}`} onClick={() => onToggleSource(s.id)}><span className="ico">{s.ico}</span><span className="lbl">{s.l?.toUpperCase()}</span></button>)}
      </div>
      <div className="modifier-section">
        <label>RISK MODIFIERS</label>
        <div className="chip-cloud">
           {RISKS.map(r => (
             <button key={r} className={`mod-chip ${riskModifiers.has(r) ? 'active' : ''}`} onClick={() => onToggleModifier(r)}>
               {r}
             </button>
           ))}
        </div>
      </div>
      <div className="triage-footer">
         <button className="confirm-btn" onClick={onShowEmpiric}>Show empiric options →</button>
      </div>
    </div>
  );
}
