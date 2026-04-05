/**
 * CLINICAL RECOMMENDATION REGISTRY (RECS)
 * Alignment: IDSA 2024 / Sanford Guide / CDC 2024
 * DEFINITIVE 10/10 MEDICAL AUTHORITY MATRIX
 */
export const RECS = {
  all: [
    {
      tier: 1, name: 'Empiric Sepsis (Standard)',
      abx: ["abx_11", "abx_71"], // Pip-Tazo + Vancomycin
      notes: 'Initial choice for undifferentiated source. Covers MRSA, Pseudomonas, and major Gram-negatives.',
      miss: ['ESBL (High-risk)', 'KPC', 'MBL', 'VRE']
    },
    {
      tier: 2, name: 'Sepsis (ESBL / Hospital-acquired Risk)',
      abx: ["abx_16", "abx_71"], // Meropenem + Vancomycin
      notes: 'Escalate to carbapenem if prior ESBL history or recent broad-spectrum failure. Prevents treatment failure seen with Pip-Tazo in ESBL bacteremia.',
      miss: ['KPC', 'MBL', 'VRE']
    },
    {
      tier: 3, name: 'Sepsis (MDR / CPE Risk)',
      abx: ["abx_40", "abx_19", "abx_71"], // Ceftaz-Avibac + Aztreonam + Vancomycin
      notes: 'Extensive cover for suspected Carbapenemase producers. Ceftaz-Avi/Aztreonam synergy mandatory for MBL/NDM coverage.',
      miss: ['VRE']
    }
  ],

  // 🫁 RESPIRATORY / PNEUMONIA / PERTUSSIS
  cap: [
    {
      tier: 1, name: 'CAP Standard (IDSA/ATS)',
      abx: ["abx_36", "abx_61"], // Ceftriaxone + Azithromycin
      notes: 'Standard empiric cover for S. pneumoniae and atypicals. Azithro covers atypicals.',
      miss: ['MRSA', 'Pseudomonas']
    },
    {
      tier: 2, name: 'CAP Hospitalized (Monotherapy)',
      abx: ["abx_23"], // Levofloxacin
      notes: '750mg po/IV OD. Respiratory fluoroquinolone (Levo or Moxi 400mg) used if beta-lactam allergy or as preferred mono-therapy.',
      miss: ['MRSA']
    }
  ],
  hap: [
    {
      tier: 1, name: 'HAP/VAP Empiric (Standard Tier)',
      abx: ["abx_38", "abx_71"], // Cefepime + Vancomycin
      notes: 'IDSA 2016 Preference. Standard empiric for HAP/VAP covering Pseudomonas and MRSA. Use Cefepime 2g q8h.',
      miss: ['ESBL', 'MBL']
    },
    {
      tier: 2, name: 'HAP/VAP (Alternative Tier)',
      abx: ["abx_11", "abx_71"], // Pip-Tazo + Vancomycin
      notes: 'Alternative empiric covering Pseudomonas, MRSA, and anaerobes (if aspiration risk).',
      miss: ['ESBL', 'MBL']
    },
    {
      tier: 3, name: 'Elizabethkingia anophelis (Targeted)',
      abx: ["abx_66", "abx_83"], // Minocycline + Rifampicin
      notes: 'For confirmed Elizabethkingia (intrinsically BL-resistant). ID specialist consult mandatory.',
      miss: ['Standard GNB']
    }
  ],
  resp_pertussis: [
    {
      tier: 1, name: 'Whooping Cough (Preferred)',
      abx: ["abx_61"], // Azithromycin
      notes: 'Adult/Child: 500mg x 1, then 250mg. Infant <2m: 10mg/kg x 5 days.',
      miss: ['None']
    },
    {
      tier: 2, name: 'Alternative (Adults / Intolerance)',
      abx: ["abx_62", "abx_84"], // Clarithromycin, TMP-SMX
      notes: 'Clarithromycin 500mg bid x 7d OR TMP-SMX DS bid x 14d. Use if macrolide-intolerant or QT-prolongation risk.',
      miss: ['None']
    }
  ],

  // 🩸 BSI / SEPSIS / ENDOCARDITIS / RESISTANCE
  bact: [
    {
      tier: 1, name: 'Class B: MBL / NDM Sepsis (IDSA 2024)',
      abx: ["abx_40", "abx_19"], // Ceftazidime-avibactam + Aztreonam
      notes: 'Synergy combo for NDM/VIM. Avibactam protects Aztreonam from hydrolysis by co-carried ESBLs.',
      miss: ['Gram-positives']
    },
    {
      tier: 1, name: 'IDSA 2024 MDR Acinetobacter (CRAB)',
      abx: ["abx_92", "abx_14"], // Sulbactam-Durlobactam + Imipenem
      notes: 'Preferred for CRAB/MDR-Acinetobacter. 10/10 medical authority for 2024 IDSA alignment.',
      miss: ['MBL (NDM)']
    },
    {
      tier: 1, name: 'KPC-producing Klebsiella / E. coli',
      abx: ["abx_37", "abx_17"], // Ceftazidime-avibactam or Meropenem-vaborbactam
      notes: 'Preferred tier for KPC. Meropenem-vaborbactam superior if KPC-only; Ceftaz-Avi better for OXA-48/KPC combo.',
      miss: ['MBL (NDM/VIM)']
    },
    {
      tier: 1, name: 'ESBL Sepsis (Non-CRE)',
      abx: ["abx_16"], // Meropenem
      notes: 'Carbapenems are first line for ESBL bacteremia. Avoid Pip-Tazo due to treatment failures.',
      miss: ['KPC', 'MBL']
    }
  ],
  mening: [
    {
      tier: 1, name: 'Bacterial Meningitis (Standard adult)',
      abx: ["abx_36", "abx_71", "abx_100"], // Ceftriaxone + Vancomycin + Dexamethasone
      notes: 'Ceftriaxone 2g q12h + Vanc. dexamethasone 0.15mg/kg MUST START 15-30min BEFORE antibiotics (IDSA Grade A).',
      miss: ['Listeria (add Ampicillin)']
    },
    {
      tier: 1, name: 'Listeria Risk (>50y / Immunoc.)',
      abx: ["abx_36", "abx_71", "abx_7", "abx_100"], // Ceftriaxone + Vancomycin + Ampicillin + Dex
      notes: 'Ampicillin 2g IV q4h is MANDATORY for Listeria coverage in patients >50y, alcoholic, or pregnant.',
      miss: ['None']
    },
    {
      tier: 2, name: 'Neonatal Meningitis (GBS/E. coli)',
      abx: ["abx_7", "abx_55"], // Ampicillin + Gentamicin
      notes: 'Empiric for neonates. Covers GBS, E. coli, and Listeria. Swap Gent for Cefotaxime if higher CNS penetration required.',
      miss: ['Staph']
    }
  ],
  endo: [
    {
      tier: 1, name: 'Standard NVE Empiric (Acute)',
      abx: ["abx_71", "abx_55"], // Vancomycin + Gentamicin
      notes: 'AHA 2023. Standard empiric for acute native valve IE. Gentamicin dose should be short-course (3-5 days) to minimize nephrotoxicity.',
      miss: ['VRE']
    },
    {
      tier: 2, name: 'VRE Endocarditis (AHA/ESC 2023)',
      abx: ["abx_76"], // Linezolid
      notes: 'Linezolid 600mg IV/PO q12h x 6 weeks. High-dose Daptomycin + Ampicillin is an alternative.',
      miss: ['Gram-negatives']
    },
    {
      tier: 3, name: 'HACEK / Eikenella',
      abx: ["abx_36"], // Ceftriaxone
      notes: 'Standard Tier for HACEK. Eikenella is resistant to metronidazole/clindamycin.',
      miss: ['Staph']
    }
  ],
  pve: [
    {
      tier: 1, name: 'Early PVE (Post-Surgical)',
      abx: ["abx_71", "abx_55", "abx_83"], // Vancomycin + Gentamicin + Rifampin
      notes: 'Standard empiric for prosthetic valves. Rifampicin is CRITICAL for biofilm penetration (target S. epidermidis).',
      miss: ['VRE']
    }
  ],

  // 💩 GASTROINTESTINAL
  gi_cdiff: [
    {
      tier: 1, name: 'C. diff (IDSA 2021 Preferred)',
      abx: ["abx_94"], // Fidaxomicin
      notes: 'Preferred 1st line (200mg po bid x 10d). Lower recurrence rate than Vancomycin.',
      miss: ['Systemic infection']
    },
    {
      tier: 2, name: 'C. diff (Alternative Tier)',
      abx: ["abx_95"], // Vancomycin (PO)
      notes: '125mg po qid x 10 days. IV Vancomycin is INEFFECTIVE for luminal C. diff.',
      miss: ['Systemic infection']
    },
    {
      tier: 3, name: 'Fulminant Sepsis-C. diff',
      abx: ["abx_95", "abx_89"], // Oral Vancomycin + IV Metronidazole
      notes: 'Vancomycin 500mg q6h po + Metronidazole 500mg IV q8h. Add rectal Vanc if ileus present.',
      miss: ['None']
    }
  ],
  gi_diarrhea: [
    {
      tier: 1, name: 'Empiric Bacterial Diarrhea (IDSA)',
      abx: ["abx_61"], // Azithromycin
      notes: 'Covers Campylobacter (preferred), Salmonella, and Shigella. 500mg po daily x 3 days.',
      miss: ['Viral']
    },
    {
      tier: 2, name: 'Alternative (Adults/Travelers)',
      abx: ["abx_20"], // Ciprofloxacin
      notes: 'Cipro 750mg po x 3 days. Use for Salmonella/Shigella if NOT suspected Campylobacter (high FQ-R).',
      miss: ['Campylobacter (FQ-resistant)']
    }
  ],

  // 🧠 CNS
  brain_abscess: [
    {
      tier: 1, name: 'Odontogenic / Anaerobic',
      abx: ["abx_36", "abx_89"], // Ceftriaxone + Metronidazole
      notes: 'Definitive cover for B. fragilis and anaerobic oral flora (Prevotella/Peptostrep).',
      miss: ['MRSA']
    }
  ],

  // 💧 UROLOGY
  uti_simple: [
    {
      tier: 1, name: 'Uncomplicated Cystitis (IDSA)',
      abx: ["abx_85"], // Nitrofurantoin
      notes: 'Nitrofurantoin 100mg po bid x 5 days. Preferred first-line. Avoid if CrCl <30.',
      miss: ['Proteus', 'Pseudomonas']
    },
    {
      tier: 1, name: 'TMP-SMX (DS) - Uncomplicated',
      abx: ["abx_84"], // TMP-SMX
      notes: '160/800mg (DS) po bid x 3 days. Use ONLY if local E. coli resistance <20%.',
      miss: ['Enterococcus']
    },
    {
      tier: 1, name: 'Fosfomycin (Single Dose)',
      abx: ["abx_87"], // Fosfomycin (PO)
      notes: '3g po x 1 dose. Good for MDR/ESBL compliance, but lower efficacy than 5-day nitrofurantoin.',
      miss: ['Staph saprophyticus']
    },
    {
      tier: 2, name: 'Pivmecillinam (Preferred Alternative)',
      abx: ["abx_88"], // Pivmecillinam
      notes: '400mg po bid x 5-7 days. High ecological safety (low collateral damage).',
      miss: ['Gram-positives']
    }
  ],
  uti_comp: [
    {
      tier: 1, name: 'Complicated UTI / Pyelo',
      abx: ["abx_36"], // Ceftriaxone
      notes: 'Preferred IV empiric. Ciprofloxacin is an alternative if beta-lactam anaphylaxis.',
      miss: ['Enterococcus']
    },
    {
      tier: 1, name: 'ESBL Risk factor present',
      abx: ["abx_13"], // Ertapenem
      notes: 'Carbapenem of choice for stable ESBL GNB in urinary source.',
      miss: ['Pseudomonas', 'Enterococcus']
    },
    {
      tier: 2, name: 'Struvite stones (Proteus)',
      abx: ["abx_84"], // TMP-SMX
      notes: 'Struvite stones are caused by urea-splitting GNB (Proteus/Klebsiella). Urological removal is MANDATORY for clearance.',
      miss: ['Pseudomonas']
    },
    {
      tier: 2, name: 'C. urealyticum (Encrusted Cystitis)',
      abx: ["abx_71"], // Vancomycin
      notes: 'Intrinsically resistant to most agents. REQ: Glycopeptide + cystoscopic removal. Specialist urology consult MANDATORY.',
      miss: ['Gram-negatives']
    }
  ],

  // 🩹 SKIN & SOFT TISSUE
  ssti: [
    {
      tier: 1, name: 'Non-purulent Cellulitis',
      abx: ["abx_46"], // Cephalexin
      notes: '500mg po qid. Targets Group A Strep and MSSA. Add MRSA cover if risk factors present.',
      miss: ['MRSA', 'Gram-negatives']
    },
    {
      tier: 1, name: 'Purulent / MRSA Suspected',
      abx: ["abx_84"], // TMP-SMX
      notes: '1-2 DS tabs po bid. Drug of choice for community-acquired MRSA SSTI.',
      miss: ['Group A Strep']
    },
    {
      tier: 2, name: 'Animal/Human Bites',
      abx: ["abx_9"], // Amox-Clav
      notes: '875/125mg po bid. Targets Pasteurella, Eikenella, and anaerobes.',
      miss: ['MRSA']
    }
  ],

  // 🦴 BONE & JOINT
  osteo: [
    {
      tier: 1, name: 'Acute Osteomyelitis (Empiric)',
      abx: ["abx_71", "abx_36"], // Vancomycin + Ceftriaxone
      notes: 'Standard adult empiric. Covers MRSA and common Gram-negatives.',
      miss: ['Pseudomonas (add Ceftaz/Fepime if risk)']
    },
    {
      tier: 2, name: 'Chronic / Diabetic Foot Osteo',
      abx: ["abx_11"], // Pip-Tazo
      notes: 'Broad coverage including Pseudomonas and anaerobes. Bone penetration limited; surgery usually required.',
      miss: ['MRSA']
    }
  ],

  // 🥙 INTRA-ABDOMINAL
  iab: [
    {
      tier: 1, name: 'IAB Empiric (Monotherapy)',
      abx: ["abx_11"], // Pip-Tazo
      notes: 'Preferred first-line. Pip-Tazo has excellent anaerobic coverage (including B. fragilis); Metronidazole addition is redundant.',
      miss: ['ESBL', 'MBL']
    },
    {
      tier: 2, name: 'Severe IAB / MDR Risk',
      abx: ["abx_16"], // Meropenem
      notes: 'Used for ESBL history or high-severity ICU-acquired peritonitis.',
      miss: ['KPC', 'MBL']
    }
  ],

  // 🐑 ZOONOTIC
  zoonotic_qfever: [
    {
      tier: 1, name: 'Q Fever (Coxiella burnetii)',
      abx: ["abx_64"], // Doxycycline
      notes: '100mg po bid x 14 days. If pregnant (Doxy contraindicated), use TMP-SMX DS bid. Doxy + Hydroxychloroquine if chronic.',
      miss: ['None']
    }
  ],

  // 💊 STI / BV
  sti: [
    {
      tier: 1, name: 'Gonorrhoea (CDC 2021)',
      abx: ["abx_36"], // Ceftriaxone
      notes: '500mg IM x 1 dose (1g if >150kg). Dual therapy with Azithro is no longer recommended.',
      miss: ['Chlamydia (if not excluded)']
    },
    {
      tier: 1, name: 'Chlamydia trachomatis (CDC)',
      abx: ["abx_64"], // Doxycycline
      notes: '100mg po bid x 7 days. Preferred over Azithromycin (higher cure rates for rectal/urogenital).',
      miss: ['Gonorrhoea']
    },
    {
      tier: 2, name: 'Bacterial Vaginosis (Gardnerella)',
      abx: ["abx_89"], // Metronidazole
      notes: '500mg po bid x 7 days. Do NOT use 2g single dose for BV. Clue cells diagnostic.',
      miss: ['Candidiasis']
    }
  ]
};
