import { Chapter } from '@/types';

export const chapters: Chapter[] = [
  // ===== PHYSICS (Engineering Step-01) =====
  { id: 'p-01-1', subjectId: 'physics', subjectCode: 'P', code: 'P-01', title: 'Vector', part: 'Part-01', topics: 'Resultant of Vectors: Parallelogram Law, Resolution into Components, Resultant using Perpendicular Components, Relative Velocity', stepNumber: 1, coachingDate: '2026-08-19', orderIndex: 1 },
  { id: 'p-01-2', subjectId: 'physics', subjectCode: 'P', code: 'P-01', title: 'Vector', part: 'Part-02', topics: 'Dot Product and its Applications, Cross Product and its Applications, Vector Calculus (Gradient, Curl & Divergence), River-Boat Related', stepNumber: 1, coachingDate: '2026-08-20', orderIndex: 2 },
  { id: 'p-02-1', subjectId: 'physics', subjectCode: 'P', code: 'P-02', title: 'Dynamics', part: 'Part-01', topics: 'Dynamics (Projectile Excluded)', stepNumber: 1, coachingDate: '2026-08-26', orderIndex: 3 },
  { id: 'p-02-2', subjectId: 'physics', subjectCode: 'P', code: 'P-02', title: 'Physical World & Measurement', part: 'Part-02', topics: 'Physical World & Measurement + Projectile', stepNumber: 1, coachingDate: '2026-08-27', orderIndex: 4 },
  { id: 'p-03-1', subjectId: 'physics', subjectCode: 'P', code: 'P-03', title: 'Newtonian Mechanics', part: 'Part-01', topics: "Newton's Laws of Motion, Friction (Up to Uniform Circular Motion)", stepNumber: 1, coachingDate: '2026-09-02', orderIndex: 5 },
  { id: 'p-03-2', subjectId: 'physics', subjectCode: 'P', code: 'P-03', title: 'Newtonian Mechanics', part: 'Part-02', topics: 'Conservation of Momentum, Collision, Moment of Inertia, Torque, Angular Momentum, Rotational Kinetic Energy', stepNumber: 1, coachingDate: '2026-09-03', orderIndex: 6 },
  { id: 'p-04-1', subjectId: 'physics', subjectCode: 'P', code: 'P-04', title: 'Circular Motion', part: 'Part-01', topics: 'Uniform Circular Motion: Horizontal, Vertical Circular Motion, Banking of Roads', stepNumber: 1, coachingDate: '2026-09-09', orderIndex: 7 },
  { id: 'p-04-2', subjectId: 'physics', subjectCode: 'P', code: 'P-04', title: 'Work, Energy & Power', part: 'Part-02', topics: 'Work, Energy & Power', stepNumber: 1, coachingDate: '2026-09-10', orderIndex: 8 },
  { id: 'p-05-1', subjectId: 'physics', subjectCode: 'P', code: 'P-05', title: 'Gravitation & Gravity', part: 'Part-01', topics: 'Gravitation & Gravity', stepNumber: 1, coachingDate: '2026-09-16', orderIndex: 9 },
  { id: 'p-05-2', subjectId: 'physics', subjectCode: 'P', code: 'P-05', title: 'Structural Properties of Matter', part: 'Part-02', topics: 'Structural Properties of Matter', stepNumber: 1, coachingDate: '2026-09-17', orderIndex: 10 },

  // ===== CHEMISTRY (Engineering Step-01) =====
  { id: 'c-01-1', subjectId: 'chemistry', subjectCode: 'C', code: 'C-01', title: 'Quantitative Chemistry', part: 'Part-01', topics: 'Mole, Chemical Reactions, Stoichiometry, Concentration', stepNumber: 1, coachingDate: '2026-08-21', orderIndex: 11 },
  { id: 'c-01-2', subjectId: 'chemistry', subjectCode: 'C', code: 'C-01', title: 'Quantitative Chemistry', part: 'Part-02', topics: 'Oxidation-Reduction, Acid-Base Titration, Beer-Lambert Law, Absorption Spectrum, Safe Use of Laboratory', stepNumber: 1, coachingDate: '2026-08-22', orderIndex: 12 },
  { id: 'c-02-1', subjectId: 'chemistry', subjectCode: 'C', code: 'C-02', title: 'Chemical Changes', part: 'Part-01', topics: 'Green Chemistry, Chemical Equilibrium, Kp, Kc', stepNumber: 1, coachingDate: '2026-08-28', orderIndex: 13 },
  { id: 'c-02-2', subjectId: 'chemistry', subjectCode: 'C', code: 'C-02', title: 'Chemical Changes', part: 'Part-02', topics: 'Chemical Kinetics, Theories of Chemical Reactions, Arrhenius Equation, Order of Reaction, Catalyst', stepNumber: 1, coachingDate: '2026-08-29', orderIndex: 14 },
  { id: 'c-03-1', subjectId: 'chemistry', subjectCode: 'C', code: 'C-03', title: 'Acid-Base Equilibrium', part: 'Part-01', topics: 'Acid-Base Equilibrium + Environmental Chemistry (Acid-Base Theories)', stepNumber: 1, coachingDate: '2026-09-04', orderIndex: 15 },
  { id: 'c-03-2', subjectId: 'chemistry', subjectCode: 'C', code: 'C-03', title: 'Thermochemistry', part: 'Part-02', topics: 'Thermochemistry', stepNumber: 1, coachingDate: '2026-09-05', orderIndex: 16 },
  { id: 'c-04-1', subjectId: 'chemistry', subjectCode: 'C', code: 'C-04', title: 'Qualitative Chemistry', part: 'Part-01', topics: 'Atomic Models, Principles of Electron Configuration, Quantum Numbers, Atomic Spectra', stepNumber: 1, coachingDate: '2026-09-11', orderIndex: 17 },
  { id: 'c-04-2', subjectId: 'chemistry', subjectCode: 'C', code: 'C-04', title: 'Qualitative Chemistry', part: 'Part-02', topics: 'Solubility, Solubility Product, Identification of Ions, Qualitative Analysis, Chromatography, Solvent Extraction', stepNumber: 1, coachingDate: '2026-09-12', orderIndex: 18 },
  { id: 'c-05-1', subjectId: 'chemistry', subjectCode: 'C', code: 'C-05', title: 'Periodic Properties & Bonding', part: 'Part-01', topics: 'Periodic Table, Block Elements, Periodic Trends', stepNumber: 1, coachingDate: '2026-09-18', orderIndex: 19 },
  { id: 'c-05-2', subjectId: 'chemistry', subjectCode: 'C', code: 'C-05', title: 'Chemical Bonding', part: 'Part-02', topics: 'Ionic Bond, Covalent Bond, Metallic Bond, Hybridization, VSEPR', stepNumber: 1, coachingDate: '2026-09-19', orderIndex: 20 },

  // ===== MATH (Engineering Step-01) =====
  { id: 'm-01-1', subjectId: 'math', subjectCode: 'M', code: 'M-01', title: 'Straight Line', part: 'Part-01', topics: 'Coordinate System to Equations of Straight Lines in Different Forms', stepNumber: 1, coachingDate: '2026-08-24', orderIndex: 21 },
  { id: 'm-01-2', subjectId: 'math', subjectCode: 'M', code: 'M-01', title: 'Straight Line', part: 'Part-02', topics: 'Equations of Straight Lines (All Problems) to Image', stepNumber: 1, coachingDate: '2026-08-25', orderIndex: 22 },
  { id: 'm-02-1', subjectId: 'math', subjectCode: 'M', code: 'M-02', title: 'Circle', part: 'Part-01', topics: 'Condition for a Circle, Equations in Different Forms, Polar Equation, Two Circles', stepNumber: 1, coachingDate: '2026-08-31', orderIndex: 23 },
  { id: 'm-02-2', subjectId: 'math', subjectCode: 'M', code: 'M-02', title: 'Circle', part: 'Part-02', topics: 'Tangents and Secants, Relative Position of Two Circles, Common Tangents', stepNumber: 1, coachingDate: '2026-09-01', orderIndex: 24 },
  { id: 'm-03-1', subjectId: 'math', subjectCode: 'M', code: 'M-03', title: 'Conics', part: 'Part-01', topics: 'Identification of Conics & Parabola', stepNumber: 1, coachingDate: '2026-09-07', orderIndex: 25 },
  { id: 'm-03-2', subjectId: 'math', subjectCode: 'M', code: 'M-03', title: 'Conics', part: 'Part-02', topics: 'Ellipse, Hyperbola, All Tangents and Secants of Conics', stepNumber: 1, coachingDate: '2026-09-08', orderIndex: 26 },
  { id: 'm-04-1', subjectId: 'math', subjectCode: 'M', code: 'M-04', title: 'Real Numbers & Complex Numbers', part: 'Part-01', topics: 'Real Numbers & Inequalities, Powers of i, Modulus & Argument of Complex Numbers', stepNumber: 1, coachingDate: '2026-09-14', orderIndex: 27 },
  { id: 'm-04-2', subjectId: 'math', subjectCode: 'M', code: 'M-04', title: 'Complex Numbers', part: 'Part-02', topics: 'Polar Form, Multiplication & Division, Powers, Conjugate, Roots, Locus', stepNumber: 1, coachingDate: '2026-09-15', orderIndex: 28 },
  { id: 'm-05-1', subjectId: 'math', subjectCode: 'M', code: 'M-05', title: 'Matrices & Determinants', part: 'Part-01', topics: 'Matrices & Determinants', stepNumber: 1, coachingDate: '2026-09-21', orderIndex: 29 },
  { id: 'm-05-2', subjectId: 'math', subjectCode: 'M', code: 'M-05', title: 'Polynomials & Polynomial Equations', part: 'Part-02', topics: 'Polynomials & Polynomial Equations', stepNumber: 1, coachingDate: '2026-09-22', orderIndex: 30 },

  // ===== HIGHER MATH (BVP Step-01) =====
  { id: 'hm-01-1', subjectId: 'higher-math', subjectCode: 'HM', code: 'HM-01', title: 'Differentiation 1', part: 'Part-01', topics: 'Limits & Continuity', stepNumber: 1, coachingDate: '2026-08-19', orderIndex: 31 },
  { id: 'hm-01-2', subjectId: 'higher-math', subjectCode: 'HM', code: 'HM-01', title: 'Differentiation 2', part: 'Part-02', topics: 'Differentiation Rules, Chain Rule', stepNumber: 1, coachingDate: '2026-08-20', orderIndex: 32 },
  { id: 'hm-02-1', subjectId: 'higher-math', subjectCode: 'HM', code: 'HM-02', title: 'Integration 1', part: 'Part-01', topics: 'Fundamental Theorem, Formulas', stepNumber: 1, coachingDate: '2026-08-21', orderIndex: 33 },
  { id: 'hm-02-2', subjectId: 'higher-math', subjectCode: 'HM', code: 'HM-02', title: 'Integration 2', part: 'Part-02', topics: 'Substitution Method', stepNumber: 1, coachingDate: '2026-08-22', orderIndex: 34 },
  { id: 'hm-03-1', subjectId: 'higher-math', subjectCode: 'HM', code: 'HM-03', title: 'Differentiation 3', part: 'Part-01', topics: 'Exponential & Logarithmic Function Differentiation', stepNumber: 1, coachingDate: '2026-08-26', orderIndex: 35 },
  { id: 'hm-03-2', subjectId: 'higher-math', subjectCode: 'HM', code: 'HM-03', title: 'Integration 3', part: 'Part-02', topics: 'Integration By Parts', stepNumber: 1, coachingDate: '2026-08-27', orderIndex: 36 },
  { id: 'hm-04-1', subjectId: 'higher-math', subjectCode: 'HM', code: 'HM-04', title: 'Differentiation 4', part: 'Part-01', topics: 'Parametric & Implicit Function Differentiation', stepNumber: 1, coachingDate: '2026-08-28', orderIndex: 37 },
  { id: 'hm-04-2', subjectId: 'higher-math', subjectCode: 'HM', code: 'HM-04', title: 'Integration 4', part: 'Part-02', topics: 'Partial Fractions', stepNumber: 1, coachingDate: '2026-08-29', orderIndex: 38 },
  { id: 'hm-05-1', subjectId: 'higher-math', subjectCode: 'HM', code: 'HM-05', title: 'Differentiation 5', part: 'Part-01', topics: "Rate of Change, Increasing/Decreasing Functions, Rolle's & Mean Value Theorem", stepNumber: 1, coachingDate: '2026-09-02', orderIndex: 39 },
  { id: 'hm-05-2', subjectId: 'higher-math', subjectCode: 'HM', code: 'HM-05', title: 'Integration 5', part: 'Part-02', topics: 'Definite Integrals', stepNumber: 1, coachingDate: '2026-09-03', orderIndex: 40 },
  { id: 'hm-06-1', subjectId: 'higher-math', subjectCode: 'HM', code: 'HM-06', title: 'Maxima & Minima', part: 'Part-01', topics: 'Extreme Values, Maclaurin & Taylor Series', stepNumber: 1, coachingDate: '2026-09-04', orderIndex: 41 },
  { id: 'hm-06-2', subjectId: 'higher-math', subjectCode: 'HM', code: 'HM-06', title: 'Integration 6', part: 'Part-02', topics: 'Area & Volume', stepNumber: 1, coachingDate: '2026-09-05', orderIndex: 42 },
  { id: 'hm-07-1', subjectId: 'higher-math', subjectCode: 'HM', code: 'HM-07', title: 'Special Integration', part: 'Part-01', topics: 'Trigonometric Substitution & Integration', stepNumber: 1, coachingDate: '2026-09-09', orderIndex: 43 },
  { id: 'hm-07-2', subjectId: 'higher-math', subjectCode: 'HM', code: 'HM-07', title: 'Differential Equations 1', part: 'Part-02', topics: 'Formation, Solution', stepNumber: 1, coachingDate: '2026-09-10', orderIndex: 44 },
  { id: 'hm-08-1', subjectId: 'higher-math', subjectCode: 'HM', code: 'HM-08', title: 'Matrix & Determinants', part: 'Part-01', topics: 'Definition, Addition, Subtraction, Multiplication', stepNumber: 1, coachingDate: '2026-09-11', orderIndex: 45 },
  { id: 'hm-08-2', subjectId: 'higher-math', subjectCode: 'HM', code: 'HM-08', title: 'Differential Equations 2', part: 'Part-02', topics: 'Special Types, Applications', stepNumber: 1, coachingDate: '2026-09-12', orderIndex: 46 },
  { id: 'hm-09-1', subjectId: 'higher-math', subjectCode: 'HM', code: 'HM-09', title: 'Inverse Matrix', part: 'Part-01', topics: 'Inverse Matrix, Solving Equations', stepNumber: 1, coachingDate: '2026-09-14', orderIndex: 47 },
  { id: 'hm-09-2', subjectId: 'higher-math', subjectCode: 'HM', code: 'HM-09', title: 'Complex Numbers 1', part: 'Part-02', topics: 'Definition, Algebraic Operations', stepNumber: 1, coachingDate: '2026-09-15', orderIndex: 48 },
  { id: 'hm-10-1', subjectId: 'higher-math', subjectCode: 'HM', code: 'HM-10', title: 'Probability', part: 'Part-01', topics: "Definitions, Conditional Probability, Bayes' Theorem", stepNumber: 1, coachingDate: '2026-09-16', orderIndex: 49 },
  { id: 'hm-10-2', subjectId: 'higher-math', subjectCode: 'HM', code: 'HM-10', title: 'Complex Numbers 2', part: 'Part-02', topics: 'Geometric Representation, Modulus, Argument', stepNumber: 1, coachingDate: '2026-09-17', orderIndex: 50 },
];

export function getChaptersBySubject(code: string): Chapter[] {
  return chapters.filter(c => c.subjectCode === code);
}

export function getChapterById(id: string): Chapter | undefined {
  return chapters.find(c => c.id === id);
}
