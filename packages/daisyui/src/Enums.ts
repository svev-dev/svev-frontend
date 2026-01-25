export const Variants = [
  'neutral',
  'primary',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
  'error',
] as const;

export type Variant = (typeof Variants)[number];

export const Sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export type Size = (typeof Sizes)[number];

export const Directions = ['vertical', 'horizontal'] as const;
export type Direction = (typeof Directions)[number];

export const VerticalPlacements = ['top', 'middle', 'bottom'] as const;
export type VerticalPlacement = (typeof VerticalPlacements)[number];

export const HorizontalPlacements = ['start', 'end'] as const;
export type HorizontalPlacement = (typeof HorizontalPlacements)[number];

export const Alignments = ['start', 'center', 'end'] as const;
export type Alignment = (typeof Alignments)[number];

export const Sides = ['top', 'bottom', 'left', 'right'] as const;
export type Side = (typeof Sides)[number];

export function getVariantClass(className: string, variant?: Variant): string {
  if (!variant) return '';
  return `${className}-${variant}`;
}

export function getSizeClass(className: string, size: Size): string {
  if (size === 'md') return '';
  return `${className}-${size}`;
}

export function getDirectionClass(className: string, direction: Direction): string {
  if (direction === 'vertical') return '';
  return `${className}-${direction}`;
}

export function getAlignmentClass(className: string, alignment?: Alignment): string {
  if (!alignment) return '';
  return `${className}-${alignment}`;
}

export function getSideClass(className: string, side?: Side): string {
  if (!side) return '';
  return `${className}-${side}`;
}
