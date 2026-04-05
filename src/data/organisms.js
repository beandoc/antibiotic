/**
 * CLINICALLY VALIDATED PATHOGEN DATABASE (v10.0)
 * Corrected UTI, CAP, and Sepsis mappings.
 */
export const ORGANISMS = [
  { 
    id: "org_0", 
    name: "E. faecalis (VS)", 
    category: "gpc", 
    sources: ["all", "bact", "uti_comp", "endo", "iab"], 
    note: "Complicated/catheter UTI only." 
  },
  { 
    id: "org_1", 
    name: "E. faecium (VS)", 
    category: "gpc", 
    sources: ["all", "bact", "endo"], 
    note: "Healthcare bacteraemia. Not standard UTI." 
  },
  { id: "org_2", name: "E. faecalis (VRE)", category: "gpc", sources: ["all", "bact", "endo"], crit: 1 },
  { id: "org_3", name: "E. faecium (VRE)", category: "gpc", sources: ["all", "bact", "endo"], crit: 1 },
  { 
    id: "org_4", 
    name: "S. aureus MSSA", 
    category: "gpc", 
    sources: ["all", "bact", "ssti", "osteo", "endo", "cap", "hap", "iab"], 
    note: "Bacteremia marker if in urine. NOT for simple UTI." 
  },
  { id: "org_5", name: "S. aureus MRSA", category: "gpc", sources: ["all", "bact", "ssti", "osteo", "endo", "hap", "cap"], crit: 1 },
  { id: "org_6", name: "Staph coag-neg (MS)", category: "gpc", sources: ["all", "bact", "endo", "ssti"] },
  { id: "org_7", name: "Staph coag-neg (MR)", category: "gpc", sources: ["all", "bact", "endo"], crit: 1 },
  { id: "org_8", name: "S. epidermidis (MR)", category: "gpc", sources: ["all", "bact", "endo"], crit: 1 },
  { id: "org_9", name: "S. epidermidis (MS)", category: "gpc", sources: ["all", "bact", "endo", "ssti"] },
  { id: "org_10", name: "S. lugdunensis", category: "gpc", sources: ["all", "bact", "endo", "ssti"] },
  { 
    id: "org_11", 
    name: "S. saprophyticus", 
    category: "gpc", 
    sources: ["all", "uti_simple", "uti_comp"], 
    note: "Cystitis in young women." 
  },
  { id: "org_12", name: "Strep. anginosus gp", category: "gpc", sources: ["all", "bact", "iab", "ssti", "endo"] },
  { id: "org_13", name: "Strep. pyogenes (A)", category: "gpc", sources: ["all", "ssti", "cap", "bact"] },
  { id: "org_14", name: "Strep. agalactiae (B)", category: "gpc", sources: ["all", "bact", "ssti", "endo", "mening"] },
  { id: "org_15", name: "Strep. gp C,F,G", category: "gpc", sources: ["all", "bact", "ssti"] },
  { id: "org_16", name: "Strep. pneumoniae", category: "gpc", sources: ["all", "cap", "mening", "bact", "endo"] },
  { id: "org_17", name: "Viridans Strep.", category: "gpc", sources: ["all", "bact", "endo"] },
  { id: "org_18", name: "Arcanobacter. sp.", category: "gpb", sources: ["all", "ssti"] },
  { id: "org_19", name: "C. diphtheriae", category: "gpb", sources: ["all"] },
  { id: "org_20", name: "C. jeikeium", category: "gpb", sources: ["all", "bact"], crit: 1 },
  { id: "org_21", name: "L. monocytogenes", category: "gpb", sources: ["all", "mening", "bact"] },
  { id: "org_22", name: "Nocardia sp.", category: "gpb", sources: ["all", "cap", "ssti", "bact"] },
  { id: "org_23", name: "Aeromonas sp.", category: "gne", sources: ["all", "bact", "iab", "ssti"] },
  { id: "org_24", name: "C. freundii", category: "gne", sources: ["all", "bact", "uti_comp", "hap"] },
  { id: "org_25", name: "C. koseri", category: "gne", sources: ["all", "bact", "uti_comp", "mening"] },
  { id: "org_26", name: "E. cloacae", category: "gne", sources: ["all", "bact", "uti_comp", "hap"] },
  { 
    id: "org_27", 
    name: "E. coli (S)", 
    category: "gne", 
    sources: ["all", "uti_simple", "uti_comp", "bact", "iab", "ssti"],
    note: "Most common community UTI pathogen."
  },
  { id: "org_28", name: "E. coli (ESBL)", category: "gne", sources: ["all", "uti_simple", "uti_comp", "bact", "iab"], crit: 1 },
  { id: "org_29", name: "E. coli (KPC)", category: "gne", sources: ["all", "bact", "uti_comp"], crit: 1 },
  { id: "org_30", name: "E. coli (MBL)", category: "gne", sources: ["all", "bact", "uti_comp"], crit: 1 },
  { id: "org_31", name: "Klebsiella pneu (S)", category: "gne", sources: ["all", "bact", "uti_simple", "uti_comp", "hap", "iab"] },
  { id: "org_32", name: "Klebsiella oxytoca (S)", category: "gne", sources: ["all", "bact", "uti_simple", "uti_comp"] },
  { id: "org_33", name: "Klebsiella (ESBL)", category: "gne", sources: ["all", "bact", "uti_comp", "hap", "uti_simple"], crit: 1 },
  { id: "org_34", name: "Klebsiella (KPC)", category: "gne", sources: ["all", "bact", "hap", "uti_comp"], crit: 1 },
  { id: "org_35", name: "Klebsiella (MBL)", category: "gne", sources: ["all", "bact", "uti_comp"], crit: 1 },
  { id: "org_36", name: "K. aerogenes", category: "gne", sources: ["all", "bact", "uti_comp", "hap"] },
  { id: "org_37", name: "M. morganii", category: "gne", sources: ["all", "bact", "uti_comp", "ssti"] },
  { id: "org_38", name: "P. mirabilis", category: "gne", sources: ["all", "uti_simple", "uti_comp", "bact", "ssti"] },
  { id: "org_39", name: "P. vulgaris", category: "gne", sources: ["all", "uti_comp", "bact"] },
  { id: "org_40", name: "Providencia sp.", category: "gne", sources: ["all", "uti_comp", "bact"] },
  { id: "org_41", name: "Salmonella sp.", category: "gne", sources: ["all", "bact", "iab"] },
  { id: "org_42", name: "Serratia marcescens", category: "gne", sources: ["all", "bact", "hap", "uti_comp"] },
  { id: "org_43", name: "Shigella sp.", category: "gne", sources: ["all", "iab", "bact"] },
  { id: "org_44", name: "Y. enterocolitica", category: "gne", sources: ["all", "bact", "iab"] },
  { id: "org_45", name: "Bartonella sp.", category: "gnn", sources: ["all", "bact", "endo", "zoo"] },
  { id: "org_56", name: "H. influenzae", category: "gnn", sources: ["all", "cap", "mening", "ssti", "bact"] },
  { id: "org_59", name: "Legionella sp.", category: "gnn", sources: ["all", "cap", "hap"] },
  { id: "org_71", name: "P. aeruginosa", category: "nf", sources: ["all", "hap", "uti_comp", "bact", "ssti", "cap"], crit: 1 },
  { id: "org_72", name: "S. maltophilia", category: "nf", sources: ["all", "hap", "bact"], crit: 1 },
  { id: "org_76", name: "B. fragilis", category: "an", sources: ["all", "iab", "bact", "ssti"] }
];
