import React from 'react';

export function GapAnalysisSheet({ org, onAdd, onClose }) {
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
