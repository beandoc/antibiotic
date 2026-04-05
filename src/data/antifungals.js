/**
 * CLINICALLY VALIDATED ANTIFUNGAL DATABASE (v10.0)
 * Restoration: Yeasts, Molds, & Dimorphic Fungi.
 */

export const ANTIFUNGAL_CATEGORIES = {
  YEASTS: { id: 'YEASTS', l: 'Yeasts', name: 'Pathogenic Yeasts', color: '#4ade80' },
  MOLDS: { id: 'MOLDS', l: 'Molds', name: 'Filamentous Molds', color: '#facc15' },
  DIMORPHIC: { id: 'DIMORPHIC', l: 'Dimorphic', name: 'Dimorphic Fungi', color: '#c084fc' },
  MURAL: { id: 'MURAL', l: 'Mucorales', name: 'Mucormycosis', color: '#f87171' }
};

export const AF_ORGS = [
  { id: 'a_fumigatus', name: 'A. fumigatus', category: 'MOLDS', sources: ['all', 'cap', 'hap'] },
  { id: 'a_niger', name: 'A. niger', category: 'MOLDS', sources: ['all', 'cap'] },
  { id: 'a_terreus', name: 'A. terreus', category: 'MOLDS', sources: ['all', 'cap'] },
  { id: 'a_flavus', name: 'A. flavus', category: 'MOLDS', sources: ['all', 'cap'] },
  { id: 'c_albicans', name: 'C. albicans', category: 'YEASTS', sources: ['all', 'bact', 'uti_comp', 'uti_simple'] },
  { id: 'c_auris', name: 'C. auris', category: 'YEASTS', sources: ['all', 'bact', 'uti_comp'], crit: 1 },
  { id: 'c_dubliniensis', name: 'C. dubliniensis', category: 'YEASTS', sources: ['all', 'bact'] },
  { id: 'c_glabrata', name: 'C. glabrata', category: 'YEASTS', sources: ['all', 'bact', 'uti_comp'], crit: 1 },
  { id: 'c_guilliermondii', name: 'C. guilliermondii', category: 'YEASTS', sources: ['all', 'bact'] },
  { id: 'c_krusei', name: 'C. krusei', category: 'YEASTS', sources: ['all', 'bact'], crit: 1 },
  { id: 'c_lusitaniae', name: 'C. lusitaniae', category: 'YEASTS', sources: ['all', 'bact'] },
  { id: 'c_parapsilosis', name: 'C. parapsilosis', category: 'YEASTS', sources: ['all', 'bact'] },
  { id: 'c_tropicalis', name: 'C. tropicalis', category: 'YEASTS', sources: ['all', 'bact'] },
  { id: 'cryptococcus', name: 'Cryptococcus sp.', category: 'YEASTS', sources: ['all', 'mening'] },
  { id: 'dematiaceous', name: 'Dematiaceous molds', category: 'MOLDS', sources: ['all', 'ssti'] },
  { id: 'fusarium', name: 'Fusarium sp.', category: 'MOLDS', sources: ['all', 'bact', 'ssti'] },
  { id: 'mucor', name: 'Mucormycosis', category: 'MURAL', sources: ['all', 'cap', 'ssti'] },
  { id: 'scedo_apiospermum', name: 'S. apiospermum', category: 'MOLDS', sources: ['all'] },
  { id: 'l_prolificans', name: 'L. prolificans', category: 'MOLDS', sources: ['all'] },
  { id: 't_marneffei', name: 'T. marneffei', category: 'DIMORPHIC', sources: ['all'] },
  { id: 'trichosporon', name: 'Trichosporon spp.', category: 'YEASTS', sources: ['all'] },
  { id: 'blastomyces', name: 'Blastomyces', category: 'DIMORPHIC', sources: ['all', 'cap'] },
  { id: 'coccidioides', name: 'Coccidioides', category: 'DIMORPHIC', sources: ['all', 'cap'] },
  { id: 'histoplasma', name: 'Histoplasma', category: 'DIMORPHIC', sources: ['all', 'cap'] },
  { id: 'sporothrix', name: 'Sporothrix', category: 'DIMORPHIC', sources: ['all', 'ssti'] }
];

const AF_COV = [
  [0, 1, 3, 3, 3, 1, 1, 1, 0, 2],
  [0, 1, 3, 3, 3, 1, 1, 1, 0, 2],
  [0, 1, 3, 3, 3, 1, 1, 1, 0, 0],
  [0, 1, 3, 3, 3, 1, 1, 1, 0, 2],
  [3, 2, 2, 2, 2, 3, 3, 3, 3, 2],
  [0, 1, 1, 1, 1, 3, 3, 3, 2, 1],
  [3, 2, 2, 2, 2, 3, 3, 3, 2, 3],
  [1, 1, 1, 1, 1, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 2, 3, 3, 3, 2, 3],
  [0, 0, 2, 2, 2, 3, 3, 3, 2, 3],
  [3, 2, 2, 2, 2, 3, 3, 3, 2, 0],
  [3, 2, 2, 2, 2, 2, 2, 2, 3, 3],
  [3, 2, 2, 2, 2, 3, 3, 3, 3, 3],
  [3, 2, 2, 2, 2, 0, 0, 0, 0, 3],
  [0, 3, 3, 2, 2, 1, 1, 1, 0, 2],
  [0, 1, 1, 1, 1, 0, 0, 0, 0, 1],
  [0, 0, 0, 2, 2, 0, 0, 0, 0, 3],
  [0, 0, 2, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 3, 3, 0, 0, 0, 0, 0, 0, 3],
  [1, 2, 2, 2, 2, 0, 0, 0, 0, 2],
  [1, 3, 2, 2, 2, 0, 0, 0, 0, 3],
  [3, 3, 2, 2, 2, 0, 0, 0, 0, 3],
  [1, 3, 2, 2, 2, 0, 0, 0, 0, 3],
  [1, 3, 2, 2, 2, 0, 0, 0, 0, 3]
];

const AF_DRUGS_BASE = [
  { id: 'af_0', name: 'Fluconazole', class: 'AZOLES', route: 'IV/PO' },
  { id: 'af_1', name: 'Itraconazole', class: 'AZOLES', route: 'PO' },
  { id: 'af_2', name: 'Voriconazole', class: 'AZOLES', route: 'IV/PO' },
  { id: 'af_3', name: 'Posaconazole', class: 'AZOLES', route: 'IV/PO' },
  { id: 'af_4', name: 'Isavuconazole', class: 'AZOLES', route: 'IV' },
  { id: 'af_5', name: 'Anidulafungin', class: 'ECHINOCANDINS', route: 'IV' },
  { id: 'af_6', name: 'Caspofungin', class: 'ECHINOCANDINS', route: 'IV' },
  { id: 'af_7', name: 'Micafungin', class: 'ECHINOCANDINS', route: 'IV' },
  { id: 'af_8', name: 'Rezafungin', class: 'ECHINOCANDINS', route: 'IV' },
  { id: 'af_9', name: 'Amphotericin B', class: 'POLYENES', route: 'IV' }
];

export const ANTIFUNGALS = AF_DRUGS_BASE.map((d, dIdx) => {
  const coverage = {};
  AF_ORGS.forEach((o, oIdx) => {
    coverage[o.id] = AF_COV[oIdx][dIdx];
  });
  return { ...d, coverage };
});
