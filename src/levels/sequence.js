import { SEQUENCE_IT_PREVIEW } from '../data/cu2.js';

export function initSequenceIt() {
  const list = document.getElementById('sequencePreviewList');
  const hint = document.getElementById('sequencePreviewHint');
  if (hint) hint.textContent = SEQUENCE_IT_PREVIEW.hint;
  if (list) {
    list.innerHTML = SEQUENCE_IT_PREVIEW.steps
      .map((s, i) => '<li>' + String.fromCharCode(65 + i) + '. ' + s + '</li>')
      .join('');
  }
}
