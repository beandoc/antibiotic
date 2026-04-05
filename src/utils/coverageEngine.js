import { ANTIBIOTICS, ANTIFUNGALS } from '../data';

export const getCoverage = (targetOrgId, abxIds) => {
  if (!abxIds || abxIds.length === 0) return 0;
  
  const ALL_DRUGS = [...ANTIBIOTICS, ...ANTIFUNGALS];

  return Math.max(...abxIds.map(id => {
    const drug = ALL_DRUGS.find(d => String(d.id) === String(id));
    return (drug && drug.coverage) ? drug.coverage[targetOrgId] || 0 : 0;
  }));
};

export const getRegimenCoverage = (abxIds, relevantOrgs) => {
  if (!abxIds || abxIds.length === 0 || !relevantOrgs || relevantOrgs.length === 0) return { total: 0, gaps: [] };
  const scores = relevantOrgs.map(o => ({ o, s: getCoverage(o.id, abxIds) }));
  const covCount = scores.filter(x => x.s >= 2).length;
  const gaps = scores.filter(x => x.s === 0).map(x => x.o);
  return { total: Math.round((covCount / relevantOrgs.length) * 100), gaps };
};
