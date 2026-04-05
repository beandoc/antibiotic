import React from 'react';
import { ANTIBIOTICS } from '../data';
import styles from './RegimenScreen.module.css';

export function RegimenScreen({ source, recommendations, riskModifiers, activeSlide, setSlide, getCov, onOpenGap, onSelect, onManual }) {
  const mods = Array.from(riskModifiers).join(' · ');

  const handleScroll = (e) => {
    const slideWidth = e.target.offsetWidth;
    const slideIdx = Math.round(e.target.scrollLeft / slideWidth);
    if (slideIdx !== activeSlide) setSlide(slideIdx);
  };

  return (
    <div className={`screen fade-in ${styles.regimenScreen}`}>
       <header className="screen-header mode-hdr">
        <div>
           <h1>{source.ico} {source.l?.toUpperCase()}</h1>
        </div>
      </header>
      
      {mods && <div className={styles.activeModsBanner}>⚠️ HIGH RISK: {mods}</div>}

      <div className={styles.swipeInstruction}>Swipe to compare protocols →</div>

      <div className={styles.regimenSwipeDeck} onScroll={handleScroll}>
          {recommendations.map((r, i) => {
            const { total, gaps } = getCov(r.abx);
            const tierCls = r.tier === 1 ? styles.tier1 : r.tier === 2 ? styles.tier2 : styles.tier3;
            const badge = i === 0 ? '⭐ FIRST-LINE' : i === 1 ? '⚡ ALTERNATIVE' : '🔥 ESCALATION';
            
            return (
              <div key={i} className={styles.regimenSlide}>
                 <div className={`${styles.smartCard} ${tierCls}`}>
                    <div className={styles.cHdr}>
                       <div className={styles.tBadge}>{badge}</div>
                       <div className={styles.pStat}>{total}% COVERED</div>
                    </div>
                    <div className={styles.regimenTitle}>{r.name}</div>
                    <div className={styles.regimenAbxChips}>
                       {r.abx.map(id => {
                         const cleanId = String(id).replace('abx_', '');
                         const name = ANTIBIOTICS.find(a => String(a.id) === String(id) || String(a.id) === `abx_${cleanId}`)?.name || id;
                         return <div key={id} className={styles.abxChip}>{name}</div>;
                       })}
                    </div>
                    
                    <div className={styles.confidenceMeter}>
                       <div className={styles.meterFill} style={{ width: `${total}%` }}></div>
                    </div>

                    <div className={styles.gapZone}>
                       <div className={styles.gapLbl}>Potential Gaps:</div>
                       <div className={styles.gapPills}>
                          {gaps.slice(0, 4).map(g => (
                            <div key={g.id} className={`${styles.miniGapPill} ${styles.clickable}`} onClick={() => onOpenGap(g)}>
                              <span className={styles.gDot}></span> {g.name}
                            </div>
                          ))}
                          {gaps.length > 4 && <div className={styles.miniGapPill}>+{gaps.length - 4} more</div>}
                       </div>
                    </div>
                 </div>
              </div>
            );
          })}
      </div>

      <div className={styles.paginationDots}>
         {recommendations.map((_, i) => (
           <div key={i} className={`${styles.pDot} ${activeSlide === i ? styles.active : ''}`}></div>
         ))}
      </div>

      <div className="regimen-footer-actions">
         <button className="f-btn ghost" style={{ flex: 1 }} onClick={onManual}>Manual Entry</button>
         <button className="f-btn blue" style={{ flex: 2 }} onClick={onSelect}>Apply Protocol ▸</button>
      </div>
    </div>
  );
}
