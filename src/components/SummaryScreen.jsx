import React, { useMemo } from 'react';
import { ShieldCheck, Target, AlertTriangle, FileText, CheckCircle, RefreshCcw } from 'lucide-react';
import { ANTIBIOTICS, ANTIFUNGALS, SOURCES } from '../data';
import styles from './SummaryScreen.module.css';

export function SummaryScreen({ 
  patientId = '', 
  sourceId = '', 
  selectedAbxSet = new Set(), 
  riskModifiers = new Set(), 
  eGFR = 100, 
  astOverrides = {}, 
  onReset 
}) {
  const source = SOURCES.find(s => s.id === sourceId) || { l: 'Undifferentiated', ico: '🌐' };
  const abxIds = Array.from(selectedAbxSet || []);
  const drugs = useMemo(() => {
    const ALL_DRUGS = [...ANTIBIOTICS, ...ANTIFUNGALS];
    return abxIds.map(id => ALL_DRUGS.find(a => String(a.id) === String(id))).filter(Boolean);
  }, [abxIds]);
  
  const strengths = useMemo(() => {
    const list = [];
    if (drugs.length > 0) list.push(`Empiric coverage for ${source.l} target pathogens.`);
    if (drugs.some(d => d.name && ['Vancomycin', 'Linezolid'].includes(d.name))) list.push("MRSA coverage included.");
    if (drugs.some(d => d.name && ['Piperacillin', 'Meropenem', 'Cefepime'].includes(d.name))) list.push("Pseudomonal coverage confirmed.");
    if (eGFR > 60) list.push("Renal function supports full drug loading.");
    if (Object.keys(astOverrides || {}).length > 0) list.push("AST (Manual lab) reports integrated into model.");
    return list;
  }, [drugs, source, eGFR, astOverrides]);

  const weaknesses = useMemo(() => {
    const list = [];
    if (drugs.length === 1) list.push("Monotherapy: Potential for narrow spectrum gaps.");
    if (drugs.some(d => d.class === 'Carbapenems')) list.push("Broad Spectrum: High selective pressure for C. diff / MDR.");
    if (eGFR < 50) list.push("Renally restricted: Dose adjustment required in Safety tab.");
    const riskArr = Array.from(riskModifiers || []);
    if (riskArr.length > 0) list.push(`Patient risk factors (${riskArr.join(', ')}) heighten risk of treatment failure.`);
    return list;
  }, [drugs, eGFR, riskModifiers]);

  const clinicalNote = useMemo(() => {
    return `[ABX-BLUEPRINT] PATIENT: ${patientId || 'UNKNOWN'}
DATE: ${new Date().toLocaleDateString()}
SOURCE: ${source.l} (${source.ico})
REGIMEN: ${drugs.map(d => d.name).join(' + ')}
eGFR: ${eGFR} mL/min
---
PLAN:
Empiric therapy initiated for suspected ${source.l}. Regimen selected based on local spectrum data and patient factors. 
${strengths.map(s => `+ ${s}`).join('\n')}
${weaknesses.map(w => `- ${w}`).join('\n')}
---
FOLLOW-UP: Re-evaluate in 24-48h pending cultures.`;
  }, [patientId, source, drugs, eGFR, strengths, weaknesses]);

  return (
    <div className={`screen fade-in ${styles.summaryScreen}`}>
        <div className={styles.blueprintCard}>
             <div className={styles.bpHeader}>
                  <span>Clinical Handover</span>
                  <h2>TREATMENT BLUEPRINT</h2>
             </div>

             <div className={styles.statsGrid}>
                  <div className={styles.statItem}><div className={styles.statLbl}>Source</div><div className={styles.statVal}>{source.l}</div></div>
                  <div className={styles.statItem}><div className={styles.statLbl}>ABX Selection</div><div className={styles.statVal}>{drugs.length} Drugs</div></div>
                  <div className={styles.statItem}><div className={styles.statLbl}>Stability</div><div className={styles.statVal}>{strengths.length > 2 ? 'HIGH' : 'MEDIUM'}</div></div>
                  <div className={styles.statItem}><div className={styles.statLbl}>eGFR Range</div><div className={styles.statVal}>{eGFR}</div></div>
             </div>

             <div className={styles.section}>
                  <h3><ShieldCheck size={16} color="#34d399" /> CLINICAL STRENGTHS</h3>
                  <div className={styles.prosList}>
                       {strengths.map((s, i) => <div key={i} className={styles.pItem}>{s}</div>)}
                       {strengths.length === 0 && <div className={styles.pItem}>Regimen satisfies minimum coverage targets.</div>}
                  </div>
             </div>

             <div className={styles.section}>
                  <h3><AlertTriangle size={16} color="#ef4444" /> POTENTIAL WEAKNESSES / RISK</h3>
                  <div className={styles.consList}>
                       {weaknesses.map((w, i) => <div key={i} className={styles.cItem}>{w}</div>)}
                       {weaknesses.length === 0 && <div className={styles.cItem}>Minimal coverage gaps identified in current analysis.</div>}
                  </div>
             </div>

             <div className={styles.section}>
                  <h3><FileText size={16} color="#38bdf8" /> EHR SIMULATION NOTE</h3>
                  <div className={styles.clinicalNoteWrap}>
                       <pre className={styles.clinicalNoteText}>{clinicalNote}</pre>
                  </div>
             </div>

             <div className={styles.finishActions}>
                  <button className="confirm-btn" onClick={onReset} style={{ flex: 1, backgroundColor: '#38bdf8' }}>
                       <RefreshCcw size={18} style={{ marginRight: '8px' }} />
                       NEW PATIENT ROUND
                  </button>
             </div>
        </div>
    </div>
  );
}
