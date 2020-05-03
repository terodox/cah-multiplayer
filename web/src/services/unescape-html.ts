const fixerElement = document.createElement('textarea');
export function unescapeHtml(cardText) {
  fixerElement.innerHTML = cardText;
  // Fix tags again
  return fixerElement.value;
}
