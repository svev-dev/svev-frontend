export function createSVGElement(raw: string): SVGElement {
  const container = document.createElement('div');
  container.innerHTML = raw.trim();

  const svg = container.querySelector('svg');
  if (!(svg instanceof SVGElement)) {
    throw new Error('Failed to parse SVG');
  }

  return svg;
}
