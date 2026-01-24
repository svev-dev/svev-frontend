export function uppercaseFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.substring(1);
}

export function camelCaseToWords(string: string): string {
  // Add space before capital letters and split into words
  const words = string
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ');
  // Capitalize the first letter of each word
  return words.map((word) => uppercaseFirstLetter(word.toLowerCase())).join(' ');
}
