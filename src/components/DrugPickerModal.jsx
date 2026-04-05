import React, { useState, useMemo } from 'react';
import { ANTIBIOTICS } from '../data';

export function DrugPickerModal({ selectedAbx, onToggle, onConfirm, onClose }) {
  const [search, setSearch] = useState('');

  // Group antibiotics by class
  const grouped = useMemo(() => {
    const filtered = ANTIBIOTICS.filter(a =>
      !search || a.name.toLowerCase().includes(search.toLowerCase())
    );
    const map = {};
    filtered.forEach(a => {
      if (!map[a.class]) map[a.class] = [];
      map[a.class].push(a);
    });
    return map;
  }, [search]);

  const selectedCount = selectedAbx.size;

  return (
    <div className="drug-picker-overlay" onClick={onClose}>
      <div className="drug-picker-sheet" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="dps-header">
          <div className="dps-title-row">
            <span className="dps-title">ANTIBIOTICS</span>
            <span className="dps-count">· {ANTIBIOTICS.length}</span>
            <div className="dps-bulk-btns">
              <button className="dps-bulk-btn" onClick={() => ANTIBIOTICS.forEach(a => { if (!selectedAbx.has(a.id)) onToggle(a.id); })}>All</button>
              <button className="dps-bulk-btn" onClick={() => ANTIBIOTICS.forEach(a => { if (selectedAbx.has(a.id)) onToggle(a.id); })}>None</button>
            </div>
          </div>

          {/* Search */}
          <div className="dps-search-wrap">
            <span className="dps-search-ico">🔍</span>
            <input
              className="dps-search-input"
              placeholder="Search antibiotic..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
            {search && (
              <button className="dps-clear-btn" onClick={() => setSearch('')}>✕</button>
            )}
          </div>
        </div>

        {/* Scrollable list */}
        <div className="dps-body">
          {Object.keys(grouped).length === 0 ? (
            <div className="dps-empty">No antibiotics match "{search}"</div>
          ) : (
            Object.entries(grouped).map(([cls, drugs]) => (
              <div key={cls} className="dps-class-group">
                <div className="dps-class-label">
                  <span className="dps-class-arrow">▸</span>
                  {cls.toUpperCase()}
                </div>
                {drugs.map(drug => {
                  const checked = selectedAbx.has(drug.id);
                  return (
                    <button
                      key={drug.id}
                      className={`dps-drug-row ${checked ? 'dps-drug-row--checked' : ''}`}
                      onClick={() => onToggle(drug.id)}
                    >
                      <span className={`dps-checkbox ${checked ? 'dps-checkbox--on' : ''}`}>
                        {checked && <span className="dps-check-mark">✓</span>}
                      </span>
                      <span className="dps-drug-name">{drug.name}</span>
                      <span className="dps-route-badge">{drug.route}</span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="dps-footer">
          <button className="dps-cancel-btn" onClick={onClose}>Cancel</button>
          <button
            className="dps-confirm-btn"
            onClick={onConfirm}
            disabled={selectedCount === 0}
          >
            {selectedCount === 0
              ? 'Select drugs to apply'
              : `Apply ${selectedCount} drug${selectedCount > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}
