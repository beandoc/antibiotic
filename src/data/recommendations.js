export const RECS = {
  all: [
    {
      tier: 1, name: 'Broad-spectrum Sepsis',
      abx: ["abx_11", "abx_16", "abx_71"], // Pip-Tazo + Meropenem + Vancomycin
      notes: 'Reserve dual carbapenem for extreme MDR risk.',
      miss: ['E. faecium (VRE)', 'E. coli (MBL)', 'Klebsiella (MBL)', 'S. maltophilia']
    },
    {
      tier: 1, name: 'Community Sepsis Empiric',
      abx: ["abx_11", "abx_71"], // Pip-Tazo + Vancomycin
      notes: 'Appropriate for most community-acquired sepsis. De-escalate on culture.',
      miss: ['VRE', 'ESBL producers', 'MDR-GN']
    }
  ],
  cap: [
    {
      tier: 1, name: 'CAP Standard (IDSA/BTS)',
      abx: ["abx_36", "abx_61"], // Ceftriaxone + Azithromycin
      notes: 'Covers S. pneumoniae, atypicals, H. influenzae. First-line hospitalised.',
      miss: ['MRSA-CAP', 'P. aeruginosa (structural lung)']
    },
    {
      tier: 1, name: 'CAP Monotherapy (FQ)',
      abx: ["abx_23"], // Levofloxacin
      notes: 'Covers pneumococcus + atypicals. Avoid if TB risk.',
      miss: ['MRSA-CAP', 'P. aeruginosa']
    }
  ],
  hap: [
    {
      tier: 1, name: 'HAP Standard (No MDR risk)',
      abx: ["abx_11", "abx_38", "abx_71"], // Pip-Tazo + Cefepime + Vancomycin
      notes: 'HAP within 5 days. Covers Pseudomonas, MRSA, Gram-negatives.',
      miss: ['ESBL producers', 'KPC', 'S. maltophilia']
    }
  ],
  uti_simple: [
    {
      tier: 1, name: 'Uncomplicated Cystitis',
      abx: ["abx_85", "abx_84", "abx_87"], // Nitrofurantoin + TMP-SMX + Fosfomycin
      notes: 'Nitrofurantoin 5d or TMP-SMX 3d. Avoid FQs for simple UTI.',
      miss: ['Proteus (Nitro inactive)', 'ESBL (TMP-SMX usually inactive)']
    }
  ],
  uti_comp: [
    {
      tier: 1, name: 'Complicated UTI / Pyelo',
      abx: ["abx_20", "abx_36"], // Cipro + Ceftriaxone
      notes: 'For pyelonephritis/systemic illness. Step-down when stable.',
      miss: ['ESBL (use carbapenem)', 'Enterococcus (use Amp)']
    }
  ],
  ssti: [
    {
      tier: 1, name: 'Cellulitis (Strep/MSSA)',
      abx: ["abx_29"], // Cefazolin
      notes: 'Targets S. pyogenes and MSSA. Not for MRSA.',
      miss: ['MRSA', 'Pseudomonas']
    }
  ]
};
