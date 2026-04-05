import { ANTIBIOTICS, ANTIFUNGALS, ORGANISMS } from '../data.js';

/**
 * MASTER DRUG LOOKUP MAP (v12.0)
 * Hoisted outside functions to build once. Replaces O(n) find() with O(1) get().
 */
const DRUG_MAP = new Map(
  [...ANTIBIOTICS, ...ANTIFUNGALS].map(d => [String(d.id), d])
);

/**
 * Returns the best coverage score (0–3) for a target organism
 * across all antibiotics in the regimen.
 * 0=inactive  1=variable(±)  2=active(+)  3=highly active(++)
 */
export const getCoverage = (targetOrgId, abxIds) => {
  if (!abxIds?.length) return 0;

  const scores = abxIds.map(id => {
    const drug = DRUG_MAP.get(String(id));
    return drug?.coverage?.[targetOrgId] ?? 0;
  });

  // Guard against spread of empty array (Math.max(...[]) returns -Infinity)
  return scores.length ? Math.max(...scores) : 0;
};

/**
 * Returns full coverage analysis for a regimen against relevant organisms.
 * total    : % of organisms with active coverage (score ≥ 2)
 * covered  : organisms with score ≥ 2 (Reliable)
 * variable : organisms with score = 1 (± — Amber pills in UI)
 * gaps     : organisms with score = 0 (Inadequate — Red pills)
 * criticalGaps : gaps where organism.crit === 1 (MDR — triggers Red Banner)
 */
export const getRegimenCoverage = (abxIds, relevantOrgs) => {
  if (!abxIds?.length || !relevantOrgs?.length) {
    return { 
      total: 0, 
      covered: [], 
      variable: [], 
      gaps: [], 
      criticalGaps: [] 
    };
  }

  const scores = relevantOrgs.map(o => ({
    o,
    s: getCoverage(o.id, abxIds),
  }));

  const covered      = scores.filter(x => x.s >= 2).map(x => x.o);
  const variable     = scores.filter(x => x.s === 1).map(x => x.o);
  const gaps         = scores.filter(x => x.s === 0).map(x => x.o);
  const criticalGaps = gaps.filter(o => o.crit === 1);

  return {
    total: Math.round((covered.length / relevantOrgs.length) * 100),
    covered,
    variable,
    gaps,
    criticalGaps,
  };
};
