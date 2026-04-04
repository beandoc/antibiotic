const fs = require('fs');
const html = fs.readFileSync('AbxSpectrum_v3.html', 'utf-8');

function extractArray(name) {
  const startSplit = html.split('const ' + name + '=[');
  if (startSplit.length < 2) return '';
  const rest = startSplit[1];
  const endSplits = rest.split(/];/);
  return '[' + endSplits[0] + ']';
}

const abxRaw = extractArray('ABX');
const orgRaw = extractArray('ORGS');
const covRaw = extractArray('COV');

const ABX = eval(abxRaw);
const ORGS = eval(orgRaw);
const COV = eval(covRaw);

const abxJSON = ABX.map((a, i) => ({ id: 'abx_'+i, name: a.n, class: a.cls, route: a.ro }));
const orgJSON = ORGS.map((o, i) => ({ id: 'org_'+i, name: o.n, category: o.c, sources: o.s, crit: o.crit }));

abxJSON.forEach((a, aIdx) => {
  a.coverage = {};
  orgJSON.forEach((o, oIdx) => {
    a.coverage[o.id] = COV[oIdx][aIdx];
  });
});

const AF_DRUGS = [
  {id: 'fluconazole', name: 'Fluconazole', class: 'AZOLES'},
  {id: 'itraconazole', name: 'Itraconazole', class: 'AZOLES'},
  {id: 'voriconazole', name: 'Voriconazole', class: 'AZOLES'},
  {id: 'posaconazole', name: 'Posaconazole', class: 'AZOLES'},
  {id: 'isavuconazole', name: 'Isavuconazole', class: 'AZOLES'},
  {id: 'anidulafungin', name: 'Anidulafungin', class: 'ECHINOCANDINS'},
  {id: 'caspofungin', name: 'Caspofungin', class: 'ECHINOCANDINS'},
  {id: 'micafungin', name: 'Micafungin', class: 'ECHINOCANDINS'},
  {id: 'rezafungin', name: 'Rezafungin', class: 'ECHINOCANDINS'},
  {id: 'amphotericin_b', name: 'Amphotericin B', class: 'POLYENES'}
];

const AF_ORGS = [
  {id: 'a_fumigatus', name: 'A. fumigatus', category: 'MOLDS', sources: ['all','cap','hap']},
  {id: 'a_niger', name: 'A. niger', category: 'MOLDS', sources: ['all','cap']},
  {id: 'a_terreus', name: 'A. terreus', category: 'MOLDS', sources: ['all','cap']},
  {id: 'a_flavus', name: 'A. flavus', category: 'MOLDS', sources: ['all','cap']},
  {id: 'c_albicans', name: 'C. albicans', category: 'YEASTS', sources: ['all','bact','uti']},
  {id: 'c_auris', name: 'C. auris', category: 'YEASTS', sources: ['all','bact','uti'], crit: 1},
  {id: 'c_dubliniensis', name: 'C. dubliniensis', category: 'YEASTS', sources: ['all','bact']},
  {id: 'c_glabrata', name: 'C. glabrata', category: 'YEASTS', sources: ['all','bact','uti'], crit: 1},
  {id: 'c_guilliermondii', name: 'C. guilliermondii', category: 'YEASTS', sources: ['all','bact']},
  {id: 'c_krusei', name: 'C. krusei', category: 'YEASTS', sources: ['all','bact'], crit: 1},
  {id: 'c_lusitaniae', name: 'C. lusitaniae', category: 'YEASTS', sources: ['all','bact']},
  {id: 'c_parapsilosis', name: 'C. parapsilosis', category: 'YEASTS', sources: ['all','bact']},
  {id: 'c_tropicalis', name: 'C. tropicalis', category: 'YEASTS', sources: ['all','bact']},
  {id: 'cryptococcus', name: 'Cryptococcus sp.', category: 'YEASTS', sources: ['all','mening']},
  {id: 'dematiaceous', name: 'Dematiaceous molds', category: 'MOLDS', sources: ['all','ssti']},
  {id: 'fusarium', name: 'Fusarium sp.', category: 'MOLDS', sources: ['all','bact','ssti']},
  {id: 'mucor', name: 'Mucormycosis', category: 'MURAL', sources: ['all','cap','ssti']},
  {id: 'scedo_apiospermum', name: 'S. apiospermum', category: 'MOLDS', sources: ['all']},
  {id: 'l_prolificans', name: 'L. prolificans', category: 'MOLDS', sources: ['all']},
  {id: 't_marneffei', name: 'T. marneffei', category: 'DIMORPHIC', sources: ['all']},
  {id: 'trichosporon', name: 'Trichosporon spp.', category: 'YEASTS', sources: ['all']},
  {id: 'blastomyces', name: 'Blastomyces', category: 'DIMORPHIC', sources: ['all','cap']},
  {id: 'coccidioides', name: 'Coccidioides', category: 'DIMORPHIC', sources: ['all','cap']},
  {id: 'histoplasma', name: 'Histoplasma', category: 'DIMORPHIC', sources: ['all','cap']},
  {id: 'sporothrix', name: 'Sporothrix', category: 'DIMORPHIC', sources: ['all','ssti']}
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

AF_DRUGS.forEach((a, aIdx) => {
  a.coverage = {};
  AF_ORGS.forEach((o, oIdx) => {
    a.coverage[o.id] = AF_COV[oIdx][aIdx];
  });
});

const CATS = {
  gpc: {id:'gpc', l:'GPC', name: 'Aerobic Gram Positive Cocci', color: '#a78bfa'},
  gpb: {id:'gpb', l:'GP Bacilli', name: 'Aerobic Gram Positive Bacilli', color: '#c084fc'},
  gne: {id:'gne', l:'Enterobacterales', name: 'GN Enterobacterales', color: '#38bdf8'},
  gnn: {id:'gnn', l:'GN Non-Entero', name: 'GN Non-Enterobacterales', color: '#22d3ee'},
  nf: {id:'nf', l:'Non-Fermenters', name: 'GN Non-Fermenters', color: '#f87171'},
  atyp: {id:'atyp', l:'Atypicals', name: 'Cell-wall Deficient/Atypicals', color: '#fbbf24'},
  an: {id:'an', l:'Anaerobes', name: 'Anaerobes', color: '#fb7185'}
};

const AF_CATS = {
  YEASTS: {id:'YEASTS', l:'Yeasts', name: 'Pathogenic Yeasts', color: '#4ade80'},
  MOLDS: {id:'MOLDS', l:'Molds', name: 'Filamentous Molds', color: '#facc15'},
  DIMORPHIC: {id:'DIMORPHIC', l:'Dimorphic', name: 'Dimorphic Fungi', color: '#c084fc'},
  MURAL: {id:'MURAL', l:'Mucorales', name: 'Mucormycosis', color: '#f87171'}
};

const SOURCES = [
  { id: 'all', l: 'All Sources', ico: '🌐' },
  { id: 'cap', l: 'CAP', ico: '🫁' },
  { id: 'hap', l: 'HAP/VAP', ico: '🏥' },
  { id: 'uti', l: 'UTI', ico: '💧' },
  { id: 'bact', l: 'Bacteremia', ico: '🩸' },
  { id: 'mening', l: 'Meningitis', ico: '🧠' },
  { id: 'iab', l: 'Intra-abd', ico: '🫀' },
  { id: 'ssti', l: 'SSTI', ico: '🩹' },
  { id: 'osteo', l: 'Osteomyelitis', ico: '🦴' },
  { id: 'endo', l: 'Endocarditis', ico: '❤️' },
  { id: 'sti', l: 'STI', ico: '💊' },
  { id: 'zoo', l: 'Zoonoses', ico: '🐾' }
];

const outStr = "export const ORGANISM_CATEGORIES = " + JSON.stringify(CATS) + ";\n" +
"export const ANTIFUNGAL_CATEGORIES = " + JSON.stringify(AF_CATS) + ";\n" +
"export const SOURCES = " + JSON.stringify(SOURCES) + ";\n" +
"export const ORGANISMS = " + JSON.stringify(orgJSON) + ";\n" +
"export const ANTIBIOTICS = " + JSON.stringify(abxJSON) + ";\n" +
"export const AF_ORGS = " + JSON.stringify(AF_ORGS) + ";\n" +
"export const AF_DRUGS = " + JSON.stringify(AF_DRUGS) + ";\n";

fs.writeFileSync('src/data.js', outStr);
console.log('Done!');

