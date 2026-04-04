import React from 'react';
import { ShieldCheck, Target, AlertTriangle } from 'lucide-react';
import { ANTIBIOTICS } from '../data';
import { getSafetyStatus } from '../utils/safetyEngine';

export function SafetyScreen({ eGFR, setEGFR, childPugh, setChildPugh, currentRegimen }) {
  const drugs = currentRegimen?.abx?.map(id => ANTIBIOTICS.find(a => String(a.id) === String(id)) || { name: id }) || [];
  const creatinine = (2.4 * (100 / eGFR)).toFixed(1);
  const ckdStage = eGFR < 15 ? '5' : eGFR < 30 ? '4' : eGFR < 45 ? '3b' : eGFR < 60 ? '3a' : '2';

  return (
    <div className="screen fade-in">
       <header className="screen-header mode-hdr">
        <div>
           <h1>SAFETY · ORGAN FUNCTION</h1>
        </div>
      </header>
      
      <div className="safety-grid">
        <div className="safety-section-card">
           <div className="s-card-hdr">Renal function</div>
           <div className="renal-controls">
              <div className="rc-metric">
                 <div className="rc-lbl">eGFR</div>
                 <div className="rc-val">{eGFR} <span>mL/min</span></div>
                 <input type="range" min="5" max="120" value={eGFR} onChange={e => setEGFR(Number(e.target.value))} />
              </div>
              <div className="rc-side">
                 <div className="s-stat"><label>Creatinine</label><span>{creatinine} mg/dL</span></div>
                 <div className="s-stat"><label>CKD stage</label><span>{ckdStage}</span></div>
              </div>
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
    </div>
  );
}
