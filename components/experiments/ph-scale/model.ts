export interface LiquidAppearance {
  color: string;
  opacity: number;
  roughness: number;
  bubbleFactor: number;
}

export interface SolutionOption {
  id: string;
  nameAr: string;
  pH: number;
  appearance: LiquidAppearance;
}

export const solutions: SolutionOption[] = [
  { id: 'water', nameAr: 'ماء', pH: 7, appearance: { color: '#a8d9e0', opacity: 0.58, roughness: 0.12, bubbleFactor: 0 } },
  { id: 'lemon', nameAr: 'عصير الليمون', pH: 2.2, appearance: { color: '#ead86a', opacity: 0.88, roughness: 0.3, bubbleFactor: 0.02 } },
  { id: 'soda', nameAr: 'مشروب غازي', pH: 2.8, appearance: { color: '#59402f', opacity: 0.92, roughness: 0.26, bubbleFactor: 1 } },
  { id: 'orange', nameAr: 'عصير البرتقال', pH: 3.5, appearance: { color: '#ed852d', opacity: 0.94, roughness: 0.38, bubbleFactor: 0.04 } },
  { id: 'coffee', nameAr: 'القهوة', pH: 5, appearance: { color: '#56351f', opacity: 0.97, roughness: 0.48, bubbleFactor: 0 } },
  { id: 'milk', nameAr: 'الحليب', pH: 6.5, appearance: { color: '#f1eee2', opacity: 0.98, roughness: 0.52, bubbleFactor: 0 } },
  { id: 'soap', nameAr: 'الصابون السائل', pH: 9.5, appearance: { color: '#a5d3bf', opacity: 0.84, roughness: 0.34, bubbleFactor: 0.08 } },
  { id: 'baking-soda', nameAr: 'محلول بيكربونات الصوديوم', pH: 8.3, appearance: { color: '#d7e4d6', opacity: 0.86, roughness: 0.28, bubbleFactor: 0 } },
];

export function pHToNetConcentration(pH: number) {
  const hydrogen = 10 ** -pH;
  const hydroxide = 10 ** (pH - 14);
  return hydrogen - hydroxide;
}

export function netConcentrationToPH(netConcentration: number) {
  const waterConstant = 1e-14;
  const root = Math.sqrt(netConcentration ** 2 + 4 * waterConstant);
  const hydrogen = netConcentration >= 0
    ? (netConcentration + root) / 2
    : (2 * waterConstant) / (root - netConcentration);
  return Math.max(0, Math.min(14, -Math.log10(hydrogen)));
}

function hexToRgb(hex: string) {
  return [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16));
}

function rgbToHex(rgb: number[]) {
  return `#${rgb.map((value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0')).join('')}`;
}

export function mixLiquidAppearance(composition: Record<string, number>): LiquidAppearance {
  const portions = Object.entries(composition)
    .map(([id, amount]) => ({ solution: solutions.find((item) => item.id === id), amount }))
    .filter((portion): portion is { solution: SolutionOption; amount: number } => Boolean(portion.solution && portion.amount > 0));
  const total = portions.reduce((sum, portion) => sum + portion.amount, 0);
  if (!total) return solutions[0].appearance;

  const mix = (pick: (solution: SolutionOption) => number) =>
    portions.reduce((sum, portion) => sum + pick(portion.solution) * portion.amount, 0) / total;
  const color = [0, 1, 2].map((channel) => mix((solution) => hexToRgb(solution.appearance.color)[channel]));

  return {
    color: rgbToHex(color),
    opacity: mix((solution) => solution.appearance.opacity),
    roughness: mix((solution) => solution.appearance.roughness),
    bubbleFactor: mix((solution) => solution.appearance.bubbleFactor),
  };
}

export function classifyPH(pH: number) {
  if (pH < 6.95) return { label: 'حمضي', detail: 'أقل من 7', color: 'text-orange-800', soft: 'bg-orange-50' };
  if (pH > 7.05) return { label: 'قاعدي', detail: 'أكبر من 7', color: 'text-brand-800', soft: 'bg-brand-50' };
  return { label: 'متعادل', detail: 'يساوي 7', color: 'text-science-800', soft: 'bg-science-50' };
}
