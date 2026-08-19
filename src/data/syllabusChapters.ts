import type { SubjectCode } from '@/types';

export interface SyllabusChapter { id: string; subjectCode: SubjectCode; paper: string; title: string; }

const make = (subjectCode: SubjectCode, paper: string, titles: string[]): SyllabusChapter[] => {
  const paperId = paper.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return titles.map((title, index) => ({ id: `${subjectCode.toLowerCase()}-${paperId}-${index + 1}`, subjectCode, paper, title }));
};

export const syllabusChapters: SyllabusChapter[] = [
  ...make('P', 'Physics 1st paper', ['Physical World & Measurement', 'Vector', 'Dynamics', 'Newtonian Mechanics', 'Work, Energy & Power', 'Gravitation & Gravity', 'Structural Properties of Matter', 'Periodic Motion', 'Gas Kinetic Theory']),
  ...make('P', 'Physics 2nd paper', ['Thermodynamics', 'Electrostatics', 'Current Electricity', 'Magnetic Effects & Magnetism', 'Electromagnetic Induction & AC', 'Geometrical Optics', 'Physical Optics', 'Modern Physics', 'Atomic Model & Nuclear Physics', 'Semiconductor & Electronics', 'Astronomy']),
  ...make('C', 'Chemistry 1st paper', ['Laboratory Safety', 'Qualitative Chemistry', 'Periodic Properties & Chemical Bonding', 'Chemical Changes', 'Applied Chemistry']),
  ...make('C', 'Chemistry 2nd paper', ['Environmental Chemistry', 'Organic Chemistry', 'Quantitative Chemistry', 'Electrochemistry', 'Economic Chemistry']),
  ...make('M', 'Higher Math 1st paper', ['Matrices & Determinants', 'Vector', 'Straight Line', 'Circle', 'Permutation & Combination', 'Trigonometric Ratios', 'Trigonometric Functions', 'Functions & Graphs', 'Differentiation', 'Integration']),
  ...make('M', 'Higher Math 2nd paper', ['Real Numbers & Inequalities', 'Linear Programming', 'Complex Numbers', 'Polynomials & Polynomial Equations', 'Binomial Expansion', 'Conics', 'Inverse Trigonometry', 'Statics', 'Motion in a Plane', 'Integration']),
  ...make('Bio', 'Biology 1st paper', ['Cell & Cell Structure', 'Cell Division', 'Cell Chemistry', 'Microorganisms', 'Algae & Fungi', 'Bryophyta & Pteridophyta', 'Gymnosperms & Angiosperms', 'Tissue & Tissue System', 'Plant Physiology', 'Plant Reproduction', 'Biotechnology', 'Organisms, Distribution & Conservation']),
  ...make('Bio', 'Biology 2nd paper', ['Animal Diversity & Classification', 'Animal Identification', 'Human Physiology: Digestion & Absorption', 'Human Physiology: Blood', 'Human Physiology: Respiration', 'Human Physiology: Excretion', 'Human Physiology: Movement', 'Human Physiology: Coordination & Control', 'Continuity of Life', 'Human Defense', 'Genetics & Evolution', 'Animal Behaviour']),
];
