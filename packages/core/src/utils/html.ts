export function escapeHTML(str: string): string {
  const div = document.createElement('div');
  div.textContent = str; // Browser encodes characters here
  return div.innerHTML; // Returns the escaped string
}
