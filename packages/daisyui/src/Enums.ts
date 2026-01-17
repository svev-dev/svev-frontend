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
