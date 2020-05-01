const fixerElement = document.createElement('textarea');
export function unescapeHtml(cardText) {
  fixerElement.innerHTML = cardText;
  return fixerElement.value;
}
