import { SELECT_IT_PREVIEW } from '../data/cu2.js';

export function initSelectIt() {
  const mission = document.getElementById('selectPreviewMission');
  const list = document.getElementById('selectPreviewList');
  if (mission) mission.textContent = SELECT_IT_PREVIEW.mission;
  if (list) {
    list.innerHTML = SELECT_IT_PREVIEW.items
      .map((item) => '<li>' + item + '</li>')
      .join('');
  }
}
