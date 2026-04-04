import React from 'react';
import { ANTIBIOTICS } from '../data';

export function RegimenScreen({ source, recommendations, riskModifiers, activeSlide, setSlide, getCov, onOpenGap, onSelect, onManual }) {
  const mods = Array.from(riskModifiers).join(' · ');

  const handleScroll = (e) => {
    const slideWidth = e.target.offsetWidth;
    const slideIdx = Math.round(e.target.scrollLeft / slideWidth);
    if (slideIdx !== activeSlide) setSlide(slideIdx);
  };

  return (
    <div className="screen fade-in">
       <header className="screen-header mode-hdr">
        <div>
           <h1>{source.ico} {source.l?.toUpperCase()}</h1>
        </div>
      </header>
      
      {mods && <div className="active-mods-banner">⚠️ High Risk: {mods}</div>}

      <div className="swipe-instruction">Swipe to compare options →</div>

      <div className="regimen-deck" onScroll={handleScroll}>
         {recommendations.map((r, i) => {
           // We have already passed activeSlide here
           const { total, gaps } = getCov(r.abx);
           const badge = i === 0 ? '⭐ FIRST-LINE' : i === 1 ? '⚡ ALTERNATIVE' : '🔥 ESCALATION';
           
           return (
             <div key={i} className="regimen-slide">
                <div className={`smart-card tier-${r.tier || (i+1)}`}>
                   <div className="c-hdr">
                      <div className="t-badge">{badge}</div>
                      <div className="p-stat">{total}% COVERED</div>
                   </div>
                   <div className="regimen-title">{r.name}</div>
                   <div className="regimen-abx-chips">
                      {r.abx.map(id => {
                        // ALWAYS search by string ID to prevent number/string mismatch breaking the UI
                        const cleanId = String(id).replace('abx_', '');
                        const name = ANTIBIOTICS.find(a => String(a.id) === String(id) || String(a.id) === `abx_${cleanId}`)?.name || id;
                        return <div key={id} className="abx-chip">{name}</div>;
                      })}
                   </div>
                   
                   <div className="confidence-meter">
                      <div className="meter-fill" style={{ width: `${total}%` }}></div>
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
         <button className="f-btn ghost" onClick={onManual}>+ Add drug manually</button>
         <button className="f-btn blue" onClick={onSelect}>▶ Apply current regimen</button>
      </div>
    </div>
  );
}
