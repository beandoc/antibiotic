import React, { useState, useMemo, useEffect } from 'react';
import { Target, Zap, Microscope, Shield, FileText } from 'lucide-react';

import { ANTIBIOTICS, ORGANISMS, SOURCES, RECOMMENDATIONS as RECS } from './data';
import { getCoverage } from './utils/coverageEngine';

import { SituationScreen } from './components/SituationScreen';
import { CultureScreen } from './components/CultureScreen';
import { SafetyScreen } from './screens/SafetyScreen';
import { DrugPickerModal } from './components/DrugPickerModal';
import { ScenarioAdvisor } from './components/ScenarioAdvisor';
import { SummaryScreen } from './components/SummaryScreen';

function App() {
  const [activeTab, setActiveTab] = useState('situation');
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  useEffect(() => {
    document.body.classList.toggle('light-theme', !isDarkMode);
  }, [isDarkMode]);

  const [selectedSourceId, setSelectedSourceId] = useState(null);
  const [riskModifiers, setRiskModifiers] = useState(new Set());
  const [manualAbx, setManualAbx] = useState(new Set());
  const [showDrugPicker, setShowDrugPicker] = useState(false);
  const [pickerSelection, setPickerSelection] = useState(new Set());
  const [cultureSource, setCultureSource] = useState('blood');
  const [eGFR, setEGFR] = useState(100);
  const [childPugh, setChildPugh] = useState('A');
  const [search, setSearch] = useState('');
  const [labRecords, setLabRecords] = useState({});
  const [astOverrides, setAstOverrides] = useState({});

  const [patientId, setPatientId] = useState('');
  const [patients, setPatients] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('abx_patients');
    if (saved) setPatients(JSON.parse(saved));
  }, []);

  const savePatient = () => {
    if (!patientId) return alert('Please enter a Patient ID/Name to save.');
    const data = {
      patientId,
      date: new Date().toLocaleDateString(),
      selectedSourceId,
      riskModifiers: Array.from(riskModifiers),
      manualAbx: Array.from(manualAbx),
      cultureSource,
      labRecords,
      eGFR, 
      childPugh
    };
    const next = { ...patients, [patientId]: data };
    setPatients(next);
    localStorage.setItem('abx_patients', JSON.stringify(next));
  };

  const loadPatient = (id) => {
    const data = patients[id];
    if (!data) return;
    setPatientId(data.patientId);
    setSelectedSourceId(data.selectedSourceId);
    setRiskModifiers(new Set(data.riskModifiers || []));
    setManualAbx(new Set(data.manualAbx || []));
    setCultureSource(data.cultureSource || 'blood');
    setLabRecords(data.labRecords || {});
    setEGFR(data.eGFR || 100);
    setChildPugh(data.childPugh || 'A');
    setActiveTab('situation');
  };

  const resetAll = () => {
    setPatientId('');
    setSelectedSourceId(null);
    setRiskModifiers(new Set());
    setManualAbx(new Set());
    setLabRecords({});
    setAstOverrides({});
    setEGFR(100);
    setSearch('');
    setActiveTab('situation');
  };

  const availableRegimens = useMemo(() => {
    const id = selectedSourceId || 'all';
    const recs = (RECS[id] || RECS['all']) || [];
    return recs;
  }, [selectedSourceId]);

  const manualRegimen = useMemo(() => {
    if (manualAbx.size === 0) return null;
    return { name: 'MANUAL BUILD', abx: Array.from(manualAbx), tier: 0, notes: 'User-specified antibiotic combination.' };
  }, [manualAbx]);

  const toggleManualAbx = (id) => {
    const next = new Set(manualAbx);
    if (next.has(id)) next.delete(id); else next.add(id);
    setManualAbx(next);
  };

  const openDrugPicker = () => {
    setPickerSelection(new Set(manualAbx));
    setShowDrugPicker(true);
  };

  const togglePickerDrug = (id) => {
    setPickerSelection(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const confirmDrugPicker = () => {
    setManualAbx(new Set(pickerSelection));
    setShowDrugPicker(false);
    setActiveTab('advisor');
  };

  const applyRegimen = (ids) => {
    setManualAbx(prev => {
      const next = new Set(prev);
      ids.forEach(id => next.add(id));
      return next;
    });
  };

  return (
    <div className="app-container">
      <main className="main-content">
        <div className="clinical-step-map">
          {['situation', 'advisor', 'safety', 'culture', 'summary'].map((step, idx) => (
            <React.Fragment key={step}>
              <div className={`step-node ${activeTab === step ? 'active' : ''} ${idx < ['situation', 'advisor', 'safety', 'culture', 'summary'].indexOf(activeTab) ? 'completed' : ''}`}>
                <div className="step-num">{idx + 1}</div>
                <div className="step-lbl">{step.toUpperCase()}</div>
              </div>
              {idx < 4 && <div className="step-path" />}
            </React.Fragment>
          ))}
        </div>

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
            onShowEmpiric={() => setActiveTab('advisor')} 
            isDarkMode={isDarkMode}
            onToggleTheme={() => setIsDarkMode(!isDarkMode)}
            pmProps={{
              patientId, setPatientId, patients,
              onSave: savePatient, onLoad: loadPatient, onReset: resetAll
            }}
          />
        )}
        {activeTab === 'advisor' && (
           <ScenarioAdvisor 
              sourceId={selectedSourceId}
              riskModifiers={riskModifiers}
              onToggleModifier={(m) => {
                const next = new Set(riskModifiers);
                if (next.has(m)) next.delete(m); else next.add(m);
                setRiskModifiers(next);
              }}
              selectedAbxSet={manualAbx}
              onToggleAbx={toggleManualAbx}
              onApplyRegimen={applyRegimen}
              eGFR={eGFR}
              setEGFR={setEGFR}
              onOpenDrugPicker={openDrugPicker}
              onBack={() => setActiveTab('situation')}
              onNext={() => setActiveTab('safety')}
              astOverrides={astOverrides}
              setAstOverrides={setAstOverrides}
           />
        )}
        {activeTab === 'safety' && (
          <SafetyScreen 
            eGFR={eGFR} setEGFR={setEGFR} 
            childPugh={childPugh} setChildPugh={setChildPugh} 
            currentRegimen={manualAbx.size > 0 ? { abx: Array.from(manualAbx) } : availableRegimens[0]} 
            onNext={(opts) => {
              if (opts?.back) setActiveTab('advisor');
              else setActiveTab('culture');
            }}
          />
        )}
        {activeTab === 'culture' && (
          <CultureScreen 
            search={search} setSearch={setSearch} 
            activeSource={cultureSource} setSource={setCultureSource}
            labRecords={labRecords} onAddRecord={(s, o) => setLabRecords(prev => ({...prev, [s]: o}))}
            onRemoveRecord={(s) => {const n = {...labRecords}; delete n[s]; setLabRecords(n);}}
            currentRegimen={manualAbx.size > 0 ? { abx: Array.from(manualAbx) } : availableRegimens[0]} 
            getCoverage={getCoverage} 
            onSkip={() => setActiveTab('safety')}
            onFinish={() => setActiveTab('summary')}
          />
        )}
        {activeTab === 'summary' && (
          <SummaryScreen 
            patientId={patientId}
            sourceId={selectedSourceId}
            selectedAbxSet={manualAbx.size > 0 ? manualAbx : new Set(availableRegimens[0]?.abx || [])}
            riskModifiers={riskModifiers}
            eGFR={eGFR}
            astOverrides={astOverrides}
            onReset={resetAll}
          />
        )}
      </main>

      {showDrugPicker && (
        <DrugPickerModal
          selectedAbx={pickerSelection}
          onToggle={togglePickerDrug}
          onConfirm={confirmDrugPicker}
          onClose={() => setShowDrugPicker(false)}
        />
      )}

      <nav className="bottom-instrument-nav">
        <button className={activeTab === 'situation' ? 'active' : ''} onClick={() => setActiveTab('situation')}><Target size={20} /><span>TRIAGE</span></button>
        <button className={activeTab === 'advisor' ? 'active' : ''} onClick={() => setActiveTab('advisor')}><Zap size={20} /><span>ADVISOR</span></button>
        <button className={activeTab === 'safety' ? 'active' : ''} onClick={() => setActiveTab('safety')}><Shield size={20} /><span>SAFETY</span></button>
        <button className={activeTab === 'culture' ? 'active' : ''} onClick={() => setActiveTab('culture')}><Microscope size={20} /><span>CULTURE</span></button>
        <button className={activeTab === 'summary' ? 'active' : ''} onClick={() => setActiveTab('summary')}><FileText size={20} /><span>SUMMARY</span></button>
      </nav>
    </div>
  );
}

export default App;
