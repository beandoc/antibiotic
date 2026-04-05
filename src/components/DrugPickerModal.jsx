import React, { useState, useMemo } from 'react';
import { ANTIBIOTICS, ANTIFUNGALS } from '../data';
import { X, Search, Check } from 'lucide-react';
import styles from './DrugPickerModal.module.css';

export function DrugPickerModal({ selectedAbx, onToggle, onConfirm, onClose }) {
  const [search, setSearch] = useState('');

  const ALL_DRUGS = useMemo(() => [...ANTIBIOTICS, ...ANTIFUNGALS], []);

  const grouped = useMemo(() => {
    const filtered = ALL_DRUGS.filter(a =>
      !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.class.toLowerCase().includes(search.toLowerCase())
    );
    const map = {};
    filtered.forEach(a => {
      if (!map[a.class]) map[a.class] = [];
      map[a.class].push(a);
    });
    return map;
  }, [search, ALL_DRUGS]);

  const selectedCount = selectedAbx.size;

  return (
    <div className={styles.drugPickerOverlay} onClick={onClose}>
      <div className={styles.drugPickerSheet} onClick={e => e.stopPropagation()}>

        <div className={styles.dpsHeader}>
          <div className={styles.dpsTitleRow}>
            <span className={styles.dpsTitle}>SELECT ANTIBIOTICS</span>
            <span className={styles.dpsCount}>· {ANTIBIOTICS.length} available</span>
            <div className={styles.dpsBulkBtns}>
              <button className={styles.dpsBulkBtn} onClick={() => ANTIBIOTICS.forEach(a => { if (!selectedAbx.has(a.id)) onToggle(a.id); })}>All</button>
              <button className={styles.dpsBulkBtn} onClick={() => ANTIBIOTICS.forEach(a => { if (selectedAbx.has(a.id)) onToggle(a.id); })}>None</button>
            </div>
          </div>

          <div className={styles.dpsSearchWrap}>
            <Search size={18} className={styles.dpsSearchIco} />
            <input
              className={styles.dpsSearchInput}
              placeholder="Search by name or class..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
            {search && (
              <button className={styles.dpsClearBtn} onClick={() => setSearch('')}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className={styles.dpsBody}>
          {Object.keys(grouped).length === 0 ? (
            <div className={styles.dpsEmpty}>No antibiotics found for "{search}"</div>
          ) : (
            Object.entries(grouped).map(([cls, drugs]) => (
              <div key={cls} className={styles.dpsClassGroup}>
                <div className={styles.dpsClassLabel}>
                  <span className={styles.dpsClassArrow}>▸</span>
                  {cls.toUpperCase()}
                </div>
                {drugs.map(drug => {
                  const checked = selectedAbx.has(drug.id);
                  return (
                    <button
                      key={drug.id}
                      className={`${styles.dpsDrugRow} ${checked ? styles.dpsDrugRowChecked : ''}`}
                      onClick={() => onToggle(drug.id)}
                    >
                      <span className={`${styles.dpsCheckbox} ${checked ? styles.dpsCheckboxOn : ''}`}>
                        {checked && <Check size={14} className={styles.dpsCheckMark} />}
                      </span>
                      <span className={styles.dpsDrugName}>{drug.name}</span>
                      <span className={styles.dpsRouteBadge}>{drug.route}</span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className={styles.dpsFooter}>
          <button className={styles.dpsCancelBtn} onClick={onClose}>Cancel</button>
          <button
            className={styles.dpsConfirmBtn}
            onClick={onConfirm}
            disabled={selectedCount === 0}
          >
            {selectedCount === 0
              ? 'Select drugs to apply'
              : `Confirm ${selectedCount} Selection${selectedCount > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}
