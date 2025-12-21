/**
 * Parses an HTML string and returns the first element.
 * @param html - HTML string to parse
 * @returns The first HTMLElement from the parsed HTML
 * @example
 * const element = htmlToElement('<div class="form-check">...</div>');
 */
export function htmlToElement(html: string): HTMLElement {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const element = doc.body.firstElementChild as HTMLElement;
  if (element === null) {
    throw new Error('HTML string did not contain any elements');
  }
  return element;
}

/**
 * Parses an HTML string and returns all elements as an array.
 * @param html - HTML string to parse
 * @returns Array of HTMLElements from the parsed HTML
 * @example
 * const elements = htmlToElements('<div>...</div><div>...</div>');
 */
export function htmlToElements(html: string): HTMLElement[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return Array.from(doc.body.children) as HTMLElement[];
}

export function escapeHTML(str: string): string {
  const div = document.createElement('div');
  div.textContent = str; // Browser encodes characters here
  return div.innerHTML; // Returns the escaped string
}
