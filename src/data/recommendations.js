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
      tier: 1, name: 'Bacteremia / Septicaemia (BS)',
      abx: ["abx_11", "abx_71"], // Pip-Tazo + Vancomycin
      notes: 'Empiric cover for GPC and GN species until culture returns.',
      miss: ['ESBL producers', 'MDR-GN']
    }
  ],
  mening: [
    {
      tier: 1, name: 'Community Bacterial Meningitis',
      abx: ["abx_36", "abx_71"], // Ceftriaxone + Vancomycin
      notes: 'Add Dexamethasone 0.15mg/kg before or with first dose.',
      miss: ['Listeria (add Ampicillin if >50y)']
    }
  ],
  endo: [
    {
      tier: 1, name: 'Native Valve Endocarditis (Empiric)',
      abx: ["abx_1", "abx_71"], // Flucloxacillin + Vancomycin
      notes: 'Standard empiric cover until TTE/TOE results return.',
      miss: ['HACEK organisms', 'Culture-negative endo']
    }
  ],
  osteo: [
    {
      tier: 1, name: 'Acute Osteomyelitis',
      abx: ["abx_1", "abx_71"], // Flucloxacillin + Vancomycin
      notes: 'Covers Staph aureus (MSSA/MRSA) and Streptococci.',
      miss: ['Pseudomonas (in IVDU/diabetes)']
    }
  ],
  iab: [
    {
      tier: 1, name: 'Intra-abdominal Sepsis',
      abx: ["abx_11"], // Pip-Tazo monotherapy
      notes: 'Standard coverage for surgical source. Add metronidazole if using Ceftriaxone.',
      miss: ['Enterococci (VRE)']
    }
  ],
  uti_simple: [
    {
      tier: 1, name: 'Uncomplicated Cystitis',
      abx: ["abx_85", "abx_87"], // Nitrofurantoin + Fosfomycin
      notes: 'First-line for simple cystitis. Avoid if pyelonephritis suspected.',
      miss: ['Proteus', 'ESBL']
    }
  ],
  uti_comp: [
    {
      tier: 1, name: 'Complicated UTI / Pyelo',
      abx: ["abx_36", "abx_20"], // Ceftriaxone + Ciprofloxacin
      notes: 'Step-down to oral ciprofloxacin when stable.',
      miss: ['ESBL (use carbapenem)', 'Enterococcus']
    }
  ],
  ssti: [
    {
      tier: 1, name: 'Cellulitis (Strep/MSSA)',
      abx: ["abx_29"], // Cefazolin
      notes: 'Targets S. pyogenes and MSSA. Not for MRSA.',
      miss: ['MRSA', 'Pseudomonas']
    },
    {
      tier: 2, name: 'Diabetic Foot / Necrotising',
      abx: ["abx_11", "abx_71"], // Pip-Tazo + Vancomycin
      notes: 'Broad empiric cover including MRSA and Pseudomonas.',
      miss: ['ESBL', 'MDR-GN']
    }
  ],
  sti: [
    {
      tier: 1, name: 'Syndromic STI Cover',
      abx: ["abx_36", "abx_61"], // Ceftriaxone + Azithromycin
      notes: 'Covers N. gonorrhoeae and C. trachomatis.',
      miss: ['TV', 'Mycoplasma (MDR)']
    }
  ]
};
