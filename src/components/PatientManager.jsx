import React from 'react';
import { Save, FolderOpen, Plus } from 'lucide-react';

export function PatientManager({ patientId, setPatientId, patients, onSave, onLoad, onReset }) {
  const [showDirectory, setShowDirectory] = React.useState(false);

  return (
    <div className="patient-manager">
      <div className="pm-active-row">
         <input 
            type="text" 
            placeholder="Enter Patient ID/Name" 
            value={patientId} 
            onChange={e => setPatientId(e.target.value)} 
         />
         <button onClick={onSave} className="pm-btn"><Save size={14} /> Save</button>
         <button onClick={() => setShowDirectory(!showDirectory)} className="pm-btn ghost"><FolderOpen size={14} /></button>
         <button onClick={onReset} className="pm-btn ghost"><Plus size={14} /></button>
      </div>
      
      {showDirectory && Object.keys(patients).length > 0 && (
         <div className="pm-directory">
            {Object.values(patients).map(p => (
               <div key={p.patientId} className="pm-entry" onClick={() => { onLoad(p.patientId); setShowDirectory(false); }}>
                  <span className="pm-id">{p.patientId}</span>
                  <span className="pm-date">{p.date}</span>
               </div>
            ))}
         </div>
      )}
    </div>
  );
}
