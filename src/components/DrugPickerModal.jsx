import React, { useState, useMemo } from 'react';
import { ANTIBIOTICS, ANTIFUNGALS } from '../data';
import { X, Search, Check } from 'lucide-react';
import styles from './DrugPickerModal.module.css';

/**
 * Performance Fix (Issue 2): Hoisting ALL_DRUGS to module level.
 * Eliminates redundant allocation on every component mount.
 */
const ALL_DRUGS = [...ANTIBIOTICS, ...ANTIFUNGALS];

/**
 * UX Fix (Issue 3): Deterministic Clinical Ranking.
 * Ensures Penicillins and Carbapenems appear in a standard hierarchy.
 */
const CLASS_ORDER = [
  'Penicillins', 'Ceph (PO)', 'Ceph (IV)', 'Carbapenems', 'Monobactams', 
  'Fluoroquinolones', 'Aminoglycosides', 'Macrolides', 'Tetracyclines', 
  'Glyco/Lipo', 'Oxazolidinones', 'Polymyxins', 'Nitroimidazoles',
  'Misc (PO)', 'Misc (IV)', 'Antifungals (Azoles)', 'Antifungals (Echin)', 'Other'
];

export function DrugPickerModal({ 
  selectedAbx, 
  onToggle, 
  onSelectAll, 
  onSelectNone, 
  onConfirm, 
  onClose 
}) {
  const [search, setSearch] = useState('');

  const grouped = useMemo(() => {
    const filtered = ALL_DRUGS.filter(a =>
      !search || 
      a.name.toLowerCase().includes(search.toLowerCase()) || 
      a.class.toLowerCase().includes(search.toLowerCase())
    );
    const map = {};
    filtered.forEach(a => {
      if (!map[a.class]) map[a.class] = [];
      map[a.class].push(a);
    });
    return map;
  }, [search]); // ALL_DRUGS is now stable outside component

  const totalVisible = Object.values(grouped).flat().length;
  const selectedCount = selectedAbx.size;

  return (
    <div className={styles.drugPickerOverlay} onClick={onClose}>
      <div className={styles.drugPickerSheet} onClick={e => e.stopPropagation()}>

        <div className={styles.dpsHeader}>
          <div className={styles.dpsTitleRow}>
            <span className={styles.dpsTitle}>MEDICATION SEARCH</span>
            {/* UX Fix (Issue 4): Count reflects filtered results */}
            <span className={styles.dpsCount}>· {totalVisible} available</span>
            
            <div className={styles.dpsBulkBtns}>
              {/* Performance Fix (Issue 1): Atomic Bulk Updates */}
              <button 
                className={styles.dpsBulkBtn} 
                onClick={() => onSelectAll(ALL_DRUGS.map(d => d.id))}
              >All</button>
              <button 
                className={styles.dpsBulkBtn} 
                onClick={onSelectNone}
              >None</button>
            </div>
          </div>

          <div className={styles.dpsSearchWrap}>
            <Search size={18} className={styles.dpsSearchIco} />
            <input
              className={styles.dpsSearchInput}
              placeholder="Search by name, class, or target..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
            {search && (
              // Accessibility Fix (Issue 5): Aria label
              <button className={styles.dpsClearBtn} onClick={() => setSearch('')} aria-label="Clear search">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className={styles.dpsBody}>
          {Object.keys(grouped).length === 0 ? (
            <div className={styles.dpsEmpty}>No results matching "{search}"</div>
          ) : (
            // UX Fix (Issue 3): Clinical Class Sorting
            Object.entries(grouped)
              .sort(([a], [b]) => {
                const ai = CLASS_ORDER.indexOf(a);
                const bi = CLASS_ORDER.indexOf(b);
                return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
              })
              .map(([cls, drugs]) => (
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
                      // Accessibility Fix (Issue 5): ARIA attributes
                      aria-pressed={checked}
                      aria-label={`${drug.name}, ${drug.class}, ${drug.route}${checked ? ', selected' : ''}`}
                    >
                      <span className={`${styles.dpsCheckbox} ${checked ? styles.dpsCheckboxOn : ''}`}>
                        {checked && <Check size={14} className={styles.dpsCheckMark} />}
                      </span>
                      <div className={styles.dpsInfoCol}>
                         <div className={styles.dpsNameRow}>
                            <span className={styles.dpsDrugName}>{drug.name}</span>
                            <span className={styles.dpsRouteBadge}>{drug.route}</span>
                         </div>
                         {/* Enhanced Detail: Surfaces dose_std for selection safety */}
                         <div className={styles.dpsDoseStd}>{drug.dose_std || "Standard Dose Variable"}</div>
                      </div>
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
              ? 'Select drugs'
              : `Confirm ${selectedCount} Selection${selectedCount > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}
