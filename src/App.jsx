import React, { useState, useMemo, useEffect } from 'react';
import { Target, Zap, Microscope, Shield } from 'lucide-react';

import { ANTIBIOTICS, ORGANISMS, SOURCES, RECOMMENDATIONS as RECS } from './data';
import { getRegimenCoverage, getCoverage } from './utils/coverageEngine';

import { SituationScreen } from './components/SituationScreen';
import { RegimenScreen } from './components/RegimenScreen';
import { CultureScreen } from './components/CultureScreen';
import { SafetyScreen } from './screens/SafetyScreen';
import { GapAnalysisSheet } from './components/GapAnalysisSheet';

function App() {
  const [activeTab, setActiveTab] = useState('situation');
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  useEffect(() => {
    document.body.classList.toggle('light-theme', !isDarkMode);
  }, [isDarkMode]);

  const [selectedSourceId, setSelectedSourceId] = useState(null);
  const [riskModifiers, setRiskModifiers] = useState(new Set());
  const [manualAbx, setManualAbx] = useState(new Set());
  const [activeRegimenIdx, setActiveRegimenIdx] = useState(0); 
  const [activeGapOrg, setActiveGapOrg] = useState(null);
  const [cultureSource, setCultureSource] = useState('blood');
  const [eGFR, setEGFR] = useState(100);
  const [childPugh, setChildPugh] = useState('A');
  const [search, setSearch] = useState('');
  const [labRecords, setLabRecords] = useState({});

  const resetAll = () => {
    setSelectedSourceId(null);
    setRiskModifiers(new Set());
    setManualAbx(new Set());
    setLabRecords({});
    setEGFR(100);
    setSearch('');
    setActiveTab('situation');
  };

  const availableRegimens = useMemo(() => {
    const id = selectedSourceId || 'all';
    const isHighRisk = riskModifiers.has('ICU / Ventilated') || riskModifiers.has('Prev. ABX <90d');
    const recs = (RECS[id] || RECS['all']) || [];
    return [...recs].sort((a, b) => isHighRisk ? b.tier - a.tier : a.tier - b.tier);
  }, [selectedSourceId, riskModifiers]);

  const currentSource = useMemo(() => {
    return SOURCES.find(s => s.id === selectedSourceId) || { id: 'all', l: 'Undifferentiated', ico: '🌐' };
  }, [selectedSourceId]);

  const manualRegimen = useMemo(() => {
    if (manualAbx.size === 0) return null;
    return { name: 'MANUAL BUILD', abx: Array.from(manualAbx), tier: 0, notes: 'User-specified antibiotic combination.' };
  }, [manualAbx]);

  const relevantOrgs = useMemo(() => {
    const id = selectedSourceId || 'all';
    return ORGANISMS.filter(o => o.sources.includes(id) || o.sources.includes('all'));
  }, [selectedSourceId]);

  const toggleManualAbx = (id) => {
    const next = new Set(manualAbx);
    if (next.has(id)) next.delete(id); else next.add(id);
    setManualAbx(next);
  };

  return (
    <div className="app-container">
      <main className="main-content">
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
            onShowEmpiric={() => setActiveTab('regimen')} 
            isDarkMode={isDarkMode}
            onToggleTheme={() => setIsDarkMode(!isDarkMode)}
            onNewPatient={resetAll}
          />
        )}
        {activeTab === 'regimen' && (
          <RegimenScreen 
            source={currentSource} 
            recommendations={availableRegimens}
            riskModifiers={riskModifiers}
            activeSlide={activeRegimenIdx}
            setSlide={setActiveRegimenIdx}
            getCov={(abxIds) => getRegimenCoverage(abxIds, relevantOrgs)}
            onOpenGap={(org) => setActiveGapOrg(org)}
            onSelect={() => setActiveTab('culture')}
            onManual={() => setActiveTab('culture')}
          />
        )}
        {activeTab === 'culture' && (
          <CultureScreen 
            search={search} setSearch={setSearch} 
            activeSource={cultureSource} setSource={setCultureSource}
            labRecords={labRecords} onAddRecord={(s, o) => setLabRecords(prev => ({...prev, [s]: o}))}
            onRemoveRecord={(s) => {const n = {...labRecords}; delete n[s]; setLabRecords(n);}}
            currentRegimen={manualRegimen || availableRegimens[activeRegimenIdx]} 
            getCoverage={getCoverage} 
          />
        )}
        {activeTab === 'safety' && (
          <SafetyScreen 
            eGFR={eGFR} setEGFR={setEGFR} 
            childPugh={childPugh} setChildPugh={setChildPugh} 
            currentRegimen={manualRegimen || availableRegimens[activeRegimenIdx]} 
          />
        )}
      </main>

      {activeGapOrg && (
        <GapAnalysisSheet 
          org={activeGapOrg} 
          onAdd={id => {
            toggleManualAbx(id);
            setActiveGapOrg(null);
          }}
          onClose={() => setActiveGapOrg(null)}
        />
      )}

      <nav className="bottom-instrument-nav">
        <button className={activeTab === 'situation' ? 'active' : ''} onClick={() => setActiveTab('situation')}><Target size={20} /><span>TRIAGE</span></button>
        <button className={activeTab === 'regimen' ? 'active' : ''} onClick={() => setActiveTab('regimen')}><Zap size={20} /><span>EMPIRIC</span></button>
        <button className={activeTab === 'culture' ? 'active' : ''} onClick={() => setActiveTab('culture')}><Microscope size={20} /><span>CULTURE</span></button>
        <button className={activeTab === 'safety' ? 'active' : ''} onClick={() => setActiveTab('safety')}><Shield size={20} /><span>SAFETY</span></button>
      </nav>
    </div>
  );
}

export default App;
