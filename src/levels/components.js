/** SVG ikon komponen elektrik CU2 */
const SVGS = {
  mcb: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="10" width="80" height="80" rx="6" fill="#455A64" stroke="#263238" stroke-width="2"/>
    <rect x="30" y="25" width="20" height="50" rx="3" fill="#78909C"/>
    <rect x="55" y="25" width="20" height="50" rx="3" fill="#78909C"/>
    <rect x="80" y="25" width="10" height="50" rx="2" fill="#546E7A"/>
    <text x="60" y="58" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold">MCB</text>
  </svg>`,
  switch: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="25" y="15" width="70" height="70" rx="8" fill="#795548" stroke="#4E342E" stroke-width="2"/>
    <rect x="45" y="30" width="30" height="40" rx="4" fill="#A1887F"/>
    <circle cx="60" cy="50" r="8" fill="#FFF8E1"/>
    <text x="60" y="88" text-anchor="middle" fill="#8D6E63" font-size="9" font-weight="bold">SWITCH</text>
  </svg>`,
  socket: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="20" width="80" height="60" rx="6" fill="#EEEEEE" stroke="#BDBDBD" stroke-width="2"/>
    <rect x="35" y="35" width="12" height="8" rx="2" fill="#424242"/>
    <rect x="55" y="35" width="12" height="8" rx="2" fill="#424242"/>
    <rect x="75" y="38" width="8" height="14" rx="2" fill="#424242"/>
    <text x="60" y="92" text-anchor="middle" fill="#757575" font-size="9" font-weight="bold">SOCKET</text>
  </svg>`,
  lamp: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="40" rx="30" ry="28" fill="#FFF9C4" stroke="#F9A825" stroke-width="2"/>
    <rect x="50" y="65" width="20" height="15" rx="3" fill="#9E9E9E"/>
    <line x1="60" y1="80" x2="60" y2="92" stroke="#757575" stroke-width="3"/>
    <text x="60" y="44" text-anchor="middle" fill="#F57F17" font-size="10" font-weight="bold">💡</text>
  </svg>`,
  db: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="5" width="90" height="90" rx="4" fill="#37474F" stroke="#263238" stroke-width="2"/>
    <rect x="25" y="15" width="70" height="70" rx="2" fill="#455A64"/>
    <line x1="35" y1="30" x2="85" y2="30" stroke="#78909C" stroke-width="2"/>
    <line x1="35" y1="45" x2="85" y2="45" stroke="#78909C" stroke-width="2"/>
    <line x1="35" y1="60" x2="85" y2="60" stroke="#78909C" stroke-width="2"/>
    <text x="60" y="78" text-anchor="middle" fill="#B0BEC5" font-size="8" font-weight="bold">DB</text>
  </svg>`
};

export function componentSvg(id, color) {
  return SVGS[id] || `<div style="width:100%;height:100%;background:${color};border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:bold">${id}</div>`;
}
