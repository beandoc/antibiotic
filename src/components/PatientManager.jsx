import React from 'react';
import { Save, FolderOpen, Plus } from 'lucide-react';
import styles from './PatientManager.module.css';

export function PatientManager({ patientId, setPatientId, patients, onSave, onLoad, onReset }) {
  const [showDirectory, setShowDirectory] = React.useState(false);

  return (
    <div className={styles.patientManager}>
      <div className={styles.pmActiveRow}>
         <input 
            type="text" 
            placeholder="Enter Patient ID/Name" 
            value={patientId} 
            onChange={e => setPatientId(e.target.value)} 
         />
         <button onClick={onSave} className={styles.pmBtn}><Save size={14} /> Save</button>
         <button onClick={() => setShowDirectory(!showDirectory)} className={`${styles.pmBtn} ${styles.ghost}`}><FolderOpen size={14} /></button>
         <button onClick={onReset} className={`${styles.pmBtn} ${styles.ghost}`}><Plus size={14} /></button>
      </div>
      
      {showDirectory && patients && Object.keys(patients).length > 0 && (
         <div className={styles.pmDirectory}>
            {Object.values(patients).map(p => (
               <div key={p.patientId} className={styles.pmEntry} onClick={() => { onLoad(p.patientId); setShowDirectory(false); }}>
                  <span className={styles.pmId}>{p.patientId}</span>
                  <span className={styles.pmDate}>{p.date}</span>
               </div>
            ))}
         </div>
      )}
    </div>
  );
}
