export const RECS = {
  all: [
    {
      tier: 1, name: 'Broad-spectrum Sepsis',
      abx: ["abx_11", "abx_71"], // Pip-Tazo + Vancomycin
      notes: 'Initial choice for undifferentiated source in the medical ICU.',
      miss: ['VRE', 'Klebsiella (MBL)', 'S. maltophilia']
    }
  ],
  cap: [
    {
      tier: 1, name: 'CAP Standard (IDSA/BTS)',
      abx: ["abx_36", "abx_61"], // Ceftriaxone + Azithromycin
      notes: 'Covers S. pneumoniae, atypicals, H. influenzae.',
      miss: ['MRSA-CAP', 'P. aeruginosa']
    }
  ],
  bact: [
    {
      tier: 1, name: 'MDR Septicaemia (Regional/India)',
      abx: ["abx_91", "abx_55", "abx_71"], // Cefoperazone-Sulb + Gentamicin + Vancomycin
      notes: 'Recommended preferred empiric cover for high-risk BSI where MDR-GNB/Acinetobacter suspected.',
      miss: ['VRE', 'MBL-producers']
    },
    {
      tier: 1, name: 'Standard Empiric BSI',
      abx: ["abx_36", "abx_89"], // Ceftriaxone + Metronidazole
      notes: 'Low-risk empiric cover for community-acquired bacteremia. Add Vancomycin separately if MRSA risk.',
      miss: ['Pseudomonas', 'MRSA']
    },
    {
      tier: 2, name: 'Alternative (Carbapenem-based)',
      abx: ["abx_16", "abx_71"], // Meropenem + Vancomycin
      notes: 'Use for life-threatening sepsis with prior history of ESBL/MDR Gram-negatives.',
      miss: ['MBL-producers', 'S. maltophilia']
    }
  ],
  mening: [
    {
      tier: 1, name: 'Community Bacterial Meningitis',
      abx: ["abx_36", "abx_71"], // Ceftriaxone + Vancomycin
      notes: 'Standard adult empiric cover. Add dexamethasone before/with first dose.',
      miss: ['Listeria (add Ampicillin if >50y)']
    }
  ],
  endo: [
    {
      tier: 1, name: 'Native Valve IE (Empiric)',
      abx: ["abx_71", "abx_11"], // Vancomycin + Pip-Tazo
      notes: 'Standard empiric cover until TTE/TOE results return. Covers Staph, Strep, Enterococcus.',
      miss: ['HACEK organisms']
    }
  ],
  osteo: [
    {
      tier: 1, name: 'Acute Osteomyelitis',
      abx: ["abx_29", "abx_71"], // Cefazolin + Vancomycin
      notes: 'Covers major GP pathogens (S. aureus). Adjust based on bone biopsy.',
      miss: ['Gram-negatives']
    }
  ],
  iab: [
    {
      tier: 1, name: 'Intra-abdominal Sepsis',
      abx: ["abx_11", "abx_89"], // Pip-Tazo + Metronidazole
      notes: 'Broad surgical cover. Metronidazole provides definitive B. fragilis activity.',
      miss: ['ESBL producers']
    }
  ],
  uti_simple: [
    {
      tier: 1, name: 'Uncomplicated Cystitis',
      abx: ["abx_85", "abx_87"], // Nitrofurantoin + Fosfomycin (PO)
      notes: 'Fosfomycin sachet 3g once. Nitrofurantoin 5-7 days.',
      miss: ['Pyelonephritis (inadequate tissue levels)']
    }
  ],
  uti_comp: [
    {
      tier: 1, name: 'Complicated UTI / Pyelo',
      abx: ["abx_36", "abx_20"], // Ceftriaxone + Ciprofloxacin
      notes: 'Use carbapenem (Ertapenem) if prior ESBL history.',
      miss: ['ESBL', 'Enterococcus']
    }
  ],
  ssti: [
    {
      tier: 1, name: 'Cellulitis (Standard)',
      abx: ["abx_29"], // Cefazolin
      notes: 'Standard for MSSA/Strep. Use Vancomycin if purulent or MRSA risk.',
      miss: ['MRSA']
    },
    {
      tier: 2, name: 'Necrotising Fasciitis',
      abx: ["abx_11", "abx_71", "abx_89"], // Pip-Tazo + Vancomycin + Clindamycin (wait clinda is 59)
      notes: 'Urgent surgical review. Metronidazole/Clindamycin for toxin suppression.',
      miss: ['MDR-GNB']
    }
  ],
  brain_abscess: [
    {
      tier: 1, name: 'Bacterial Brain Abscess (Standard)',
      abx: ["abx_36", "abx_89"], // Ceftriaxone + Metronidazole
      notes: 'Standard cover for odontogenic or sinus source. Neurosurgical consultation mandatory.',
      miss: ['MRSA (add Vanco)', 'Nocardia']
    },
    {
      tier: 2, name: 'Post-trauma / Post-neurosurg',
      abx: ["abx_38", "abx_71", "abx_89"], // Cefepime + Vancomycin + Metronidazole
      notes: 'Definitive cover for MRSA and P. aeruginosa post-surgical abscess.',
      miss: ['Fungi', 'Toxoplasmosis']
    }
  ],
  pve: [
    {
      tier: 1, name: 'Prosthetic Valve IE (Empiric India/Regional)',
      abx: ["abx_71", "abx_16"], // Vancomycin + Meropenem
      notes: 'Broad cover for MRCONS (36%) and Non-HACEK GNB (30%) identified in regional cohorts.',
      miss: ['VRE', 'Fungi']
    },
    {
      tier: 2, name: 'Late-onset PVE (>1 year)',
      abx: ["abx_71", "abx_11"], // Vancomycin + Pip-Tazo
      notes: 'Resembles subacute NVE but retains high MRSA risk.',
      miss: ['MDR-GNB']
    }
  ]
};
