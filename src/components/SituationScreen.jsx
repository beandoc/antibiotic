import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { SOURCES } from '../data';
import { PatientManager } from './PatientManager';
import styles from './SituationScreen.module.css';

const RISK_MODS_FALLBACK = ['ICU / Ventilated', 'Prev. ABX <90d', 'Known MDR Carrier', 'Immunocompromised', 'Renal Impairment', 'Hepatic Impairment'];

export function SituationScreen({ selectedId, onToggleSource, riskModifiers, onToggleModifier, onShowEmpiric, isDarkMode, onToggleTheme, pmProps }) {
  const RISKS = RISK_MODS_FALLBACK;
  
  return (
    <div className={`screen fade-in ${styles.situationScreen}`}>
       <header className="screen-header mode-hdr">
        <div style={{ width: '100%' }}>
           <PatientManager {...pmProps} />
           <h1>SUSPECTED SOURCE</h1>
        </div>
        <button className="theme-toggle" onClick={onToggleTheme}>
           {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>
      
      <div className={styles.sourceGrid}>
        <button 
          className={`${styles.sourceTile} ${!selectedId ? styles.activeSource : ''}`} 
          onClick={() => onToggleSource(null)}
        >
          <span className={styles.ico}>🌐</span>
          <span className={styles.lbl}>UNDIFFERENTIATED</span>
        </button>
        {SOURCES.map(s => (
          <button 
            key={s.id} 
            className={`${styles.sourceTile} ${selectedId === s.id ? styles.activeSource : ''}`} 
            onClick={() => onToggleSource(s.id)}
          >
            <span className={styles.ico}>{s.ico}</span>
            <span className={styles.lbl}>{s.l?.toUpperCase()}</span>
          </button>
        ))}
      </div>

      <div className={styles.clinicalStatus}>
         Selection: <strong>{selectedId ? SOURCES.find(s=>s.id===selectedId)?.l : 'Undifferentiated Empiric'}</strong> · {riskModifiers.size} Risks active
      </div>

      <div className={styles.modifierSection}>
        <label>CLINICAL RISK MODIFIERS</label>
        <div className={styles.chipCloud}>
           {RISKS.map(r => (
             <button key={r} className={`${styles.modChip} ${riskModifiers.has(r) ? styles.active : ''}`} onClick={() => onToggleModifier(r)}>
               {r}
             </button>
           ))}
        </div>
      </div>

      <div className={styles.footer}>
         <button className="confirm-btn" onClick={onShowEmpiric}>
            Generate Scenario Specific Advice ▸
         </button>
      </div>
    </div>
  );
}
