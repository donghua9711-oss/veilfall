// Procedural anime-style card illustrations (inline SVG): sky + glow + element effect + subject.
const PAL = {
  fire:{s:['#2a0710','#ff7a30'],d:'#6a1a22',l:'#ff9a3c',a:'#ffe27a',f:'#fff2e8',b:'#e0642a'},
  storm:{s:['#0a1236','#6a86ff'],d:'#1e2a78',l:'#a9bcff',a:'#fff36b',f:'#eef2ff',b:'#4d6ae6'},
  void:{s:['#12052b','#9a4cff'],d:'#2e1260',l:'#c99bff',a:'#ff7be5',f:'#f5eeff',b:'#7a3fd8'},
  tide:{s:['#04243a','#1cc6cc'],d:'#0c4d66',l:'#86f2e8',a:'#e0fffb',f:'#e8fbfa',b:'#1a9fb0'},
  grove:{s:['#0b2612','#74d45c'],d:'#1d5c2c',l:'#bff57e',a:'#fff2a6',f:'#effbe8',b:'#4aa63c'},
  light:{s:['#3a2608','#ffd56e'],d:'#8f5c18',l:'#fff1b8',a:'#ffffff',f:'#fff9e6',b:'#d9a62e'}
};
const OL = 'stroke="#150a22" stroke-width="1.3" stroke-linejoin="round"';
const makeRng = seed => { let s = (seed * 7919 + 13) % 2147483647; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
const eye = (P, x, y, k = 1) => `<ellipse cx="${x}" cy="${y}" rx="${2.2*k}" ry="${2.7*k}" fill="${P.a}" stroke="#150a22" stroke-width=".6"/><circle cx="${x+.6*k}" cy="${y-.8*k}" r="${.7*k}" fill="#fff"/>`;

function effectLayer(el, P, r) {
  let o = '';
  if (el === 'fire') {
    for (let i = 0; i < 7; i++) o += `<path transform="translate(${10+i*13+r()*6} 78) scale(${1.1+r()*1.2})" d="M0,0C-9,-10 -3,-20 0,-34C3,-20 9,-10 0,0Z" fill="${i%2?P.l:P.a}" opacity=".95" filter="url(#@@bl)"/>`;
    for (let i = 0; i < 12; i++) o += `<circle cx="${r()*100}" cy="${r()*70}" r="${.4+r()}" fill="${P.a}"/>`;
  } else if (el === 'storm') {
    o += `<ellipse cx="30" cy="8" rx="30" ry="10" fill="${P.d}"/><ellipse cx="72" cy="6" rx="32" ry="11" fill="${P.d}"/>`;
    for (let i = 0; i < 2; i++) { const x = 18 + i * 52 + r() * 8, pts = `${x},10 ${x-8},34 ${x+2},34 ${x-10},68`;
      o += `<polyline points="${pts}" fill="none" stroke="${P.a}" stroke-width="2.6" filter="url(#@@bl)"/><polyline points="${pts}" fill="none" stroke="#fff" stroke-width=".9"/>`; }
  } else if (el === 'void') {
    for (let i = 0; i < 28; i++) o += `<circle cx="${r()*100}" cy="${r()*80}" r="${.3+r()*.9}" fill="#fff" opacity="${.5+r()*.5}"/>`;
    for (let i = 0; i < 3; i++) o += `<ellipse cx="50" cy="44" rx="${46-i*9}" ry="${15-i*2}" transform="rotate(${-25+i*30} 50 44)" fill="none" stroke="${i%2?P.l:P.a}" stroke-width="3" opacity=".4" filter="url(#@@bl)"/>`;
  } else if (el === 'tide') {
    for (let i = 0; i < 3; i++) { const y = 58 + i * 8; o += `<path d="M0,${y} Q12.5,${y-8} 25,${y} T50,${y} T75,${y} T100,${y} V80 H0Z" fill="${i?P.d:P.l}" opacity=".6"/>`; }
    for (let i = 0; i < 8; i++) o += `<circle cx="${r()*100}" cy="${r()*60}" r="${1+r()*2}" fill="none" stroke="${P.a}" stroke-width=".6"/>`;
  } else if (el === 'grove') {
    for (let i = 0; i < 3; i++) o += `<polygon points="${15+i*32},0 ${27+i*32},0 ${4+i*32},80 ${-12+i*32},80" fill="${P.a}" opacity=".14"/>`;
    for (let i = 0; i < 10; i++) o += `<ellipse cx="${r()*100}" cy="${r()*80}" rx="6" ry="2.4" transform="rotate(${r()*180} 50 40)" fill="${i%2?P.l:P.d}" opacity=".55"/>`;
  } else {
    for (let i = 0; i < 9; i++) o += `<polygon points="50,6 ${i*12-4},80 ${i*12+8},80" fill="${P.a}" opacity=".16"/>`;
    for (let i = 0; i < 10; i++) o += `<path d="M${r()*100},${r()*70} l1,-3 l1,3 l3,1 l-3,1 l-1,3 l-1,-3 l-3,-1Z" fill="#fff"/>`;
  }
  return o;
}

const SUBJECT = {
  sprite: P => `<path d="M31,52 L16,36 L34,44Z M69,52 L84,36 L66,44Z" fill="${P.l}" ${OL}/><circle cx="50" cy="50" r="19" fill="${P.d}" ${OL}/><path d="M38,36 L33,20 L46,32Z M62,36 L67,20 L54,32Z" fill="${P.a}" ${OL}/><ellipse cx="50" cy="58" rx="11" ry="7" fill="${P.l}" opacity=".6"/>${eye(P,43,48,1.4)}${eye(P,57,48,1.4)}<path d="M44,60 Q50,65 56,60" fill="none" stroke="#150a22" stroke-width="1.2"/>`,
  golem: P => `<rect x="20" y="34" width="14" height="30" rx="6" fill="${P.d}" ${OL}/><rect x="66" y="34" width="14" height="30" rx="6" fill="${P.d}" ${OL}/><rect x="31" y="30" width="38" height="36" rx="9" fill="${P.d}" ${OL}/><rect x="40" y="14" width="20" height="18" rx="6" fill="${P.l}" ${OL}/><circle cx="50" cy="48" r="11" fill="${P.a}" opacity=".35" filter="url(#@@bl)"/><circle cx="50" cy="48" r="6.5" fill="${P.a}" ${OL}/>${eye(P,45,22,.8)}${eye(P,55,22,.8)}<path d="M33,38 L42,35 M58,35 L67,38" stroke="${P.l}" stroke-width="2"/>`,
  mage: P => `<line x1="74" y1="22" x2="74" y2="72" stroke="${P.l}" stroke-width="2.4"/><circle cx="74" cy="19" r="11" fill="${P.a}" opacity=".35" filter="url(#@@bl)"/><circle cx="74" cy="19" r="6" fill="${P.a}" ${OL}/><path d="M50,12 C36,14 31,34 27,70 L68,70 C66,34 64,14 50,12Z" fill="${P.d}" ${OL}/><path d="M50,22 C42,24 41,34 43,40 C47,44 53,44 57,40 C59,34 58,24 50,22Z" fill="#150a22"/>${eye(P,46,34,.9)}${eye(P,54,34,.9)}<path d="M36,58 Q50,50 64,58" fill="none" stroke="${P.l}" stroke-width="2"/>`,
  wolf: P => `<path d="M30,52 C14,50 12,36 18,26 C20,40 28,44 34,46Z" fill="${P.d}" ${OL}/><ellipse cx="46" cy="52" rx="24" ry="13" fill="${P.d}" ${OL}/><rect x="28" y="58" width="6" height="16" rx="3" fill="${P.d}" ${OL}/><rect x="54" y="58" width="6" height="16" rx="3" fill="${P.d}" ${OL}/><path d="M44,42 L48,30 L52,42 M34,44 L38,34 L42,44" fill="${P.l}" ${OL}/><path d="M62,42 L68,24 L74,36 L84,34 L92,46 L80,56 L66,56Z" fill="${P.l}" ${OL}/>${eye(P,76,43,.9)}`,
  knight: P => `<path d="M32,70 L36,38 L64,38 L68,70Z" fill="${P.d}" ${OL}/><circle cx="50" cy="28" r="12" fill="${P.l}" ${OL}/><rect x="40" y="26" width="20" height="5" rx="2" fill="#150a22"/><path d="M50,10 Q62,4 63,20 Q54,14 50,10Z" fill="${P.a}" ${OL}/><rect x="72" y="14" width="4" height="48" fill="${P.a}" ${OL}/><rect x="67" y="46" width="14" height="4" fill="${P.l}" ${OL}/><path d="M16,40 H38 V56 Q27,68 16,56Z" fill="${P.l}" ${OL}/><circle cx="27" cy="48" r="3" fill="${P.a}"/>`,
  dragon: P => { const w = `<path d="M54,46 C40,26 20,20 4,8 C10,26 8,40 14,52 C20,45 26,52 33,56 C41,53 48,52 54,52Z" fill="${P.l}" ${OL}/><path d="M54,46 L8,14 M54,48 L16,50 M54,50 L32,56" stroke="${P.d}" stroke-width="1.2" fill="none"/>`; return `${w}<g transform="translate(100 0) scale(-1 1)">${w}</g><path d="M52,66 C64,82 84,76 92,60 C82,70 68,70 58,60Z" fill="${P.d}" ${OL}/><ellipse cx="50" cy="56" rx="14" ry="18" fill="${P.d}" ${OL}/><ellipse cx="50" cy="60" rx="7" ry="12" fill="${P.a}" opacity=".55"/><path d="M43,44 L50,24 L57,44Z" fill="${P.d}" ${OL}/><path d="M50,36 l-2,5 l4,0Z M50,44 l-2,5 l4,0Z" fill="${P.a}" ${OL}/><circle cx="50" cy="26" r="10" fill="${P.d}" ${OL}/><path d="M42,28 L50,40 L58,28Z" fill="${P.l}" ${OL}/><path d="M42,20 L34,5 L47,15Z M58,20 L66,5 L53,15Z" fill="${P.a}" ${OL}/>${eye(P,45,24,.8)}${eye(P,55,24,.8)}`; },
  serpent: P => { const d = 'M16,66 C30,30 46,74 58,46 C66,30 78,36 76,24'; return `<path d="${d}" fill="none" stroke="#150a22" stroke-width="15" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${P.d}" stroke-width="12" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${P.l}" stroke-width="3" stroke-dasharray="3 5" stroke-linecap="round"/><circle cx="78" cy="22" r="9" fill="${P.d}" ${OL}/><path d="M73,13 L77,4 L82,13Z M68,17 L62,10 L72,12Z" fill="${P.a}" ${OL}/>${eye(P,74,21,.8)}${eye(P,82,21,.8)}`; },
  bird: P => `<path d="M50,46 L6,18 L20,44 L10,58 L44,56Z M50,46 L94,18 L80,44 L90,58 L56,56Z" fill="${P.l}" ${OL}/><path d="M44,58 L50,78 L56,58Z M38,56 L34,74 L46,60Z M62,56 L66,74 L54,60Z" fill="${P.a}" ${OL}/><ellipse cx="50" cy="48" rx="11" ry="16" fill="${P.d}" ${OL}/><circle cx="50" cy="28" r="9" fill="${P.d}" ${OL}/><path d="M46,32 L50,42 L54,32Z" fill="${P.a}" ${OL}/>${eye(P,46,27,.8)}${eye(P,54,27,.8)}`,
  orb: P => `<circle cx="50" cy="42" r="22" fill="${P.a}" opacity=".4" filter="url(#@@bl)"/><circle cx="50" cy="42" r="14" fill="${P.l}" ${OL}/><circle cx="50" cy="42" r="8" fill="${P.a}"/><path d="M50,28 L58,16 M64,36 L80,30 M36,50 L20,58 M56,56 L62,72" stroke="${P.a}" stroke-width="2.5" stroke-linecap="round"/>`,
  bolt: P => `<polygon points="58,6 30,46 46,46 38,76 72,32 54,32" fill="${P.a}" ${OL}/><polygon points="58,6 30,46 46,46 38,76 72,32 54,32" fill="none" stroke="#fff" stroke-width=".8" opacity=".8"/>`,
  ring: P => `<circle cx="50" cy="42" r="27" fill="none" stroke="${P.l}" stroke-width="3"/><circle cx="50" cy="42" r="19" fill="none" stroke="${P.a}" stroke-width="2" opacity=".8"/><path d="M45,30 h10 v8 h8 v10 h-8 v8 h-10 v-8 h-8 v-10 h8Z" fill="${P.a}" ${OL}/>`,
  burst: P => `<polygon points="50,6 58,30 82,22 68,42 94,50 66,56 76,76 54,64 46,78 40,60 14,66 32,46 8,36 36,34" fill="${P.l}" ${OL}/><circle cx="50" cy="44" r="11" fill="${P.a}" ${OL}/>`
};

const artCache = {};
let artSeq = 0;
function artOf(c) {
  if (artCache[c.id]) return artCache[c.id].replaceAll('@@', 'u' + (++artSeq) + '-');
  const P = PAL[c.el], r = makeRng(c.id.length * 97 + c.cost * 13 + c.name.charCodeAt(0)), g = '@@g';
  artCache[c.id] = `<svg viewBox="0 0 100 80" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.s[0]}"/><stop offset="1" stop-color="${P.s[1]}"/></linearGradient><radialGradient id="${g}r"><stop offset="0" stop-color="${P.a}" stop-opacity=".9"/><stop offset="1" stop-color="${P.l}" stop-opacity="0"/></radialGradient><filter id="@@bl"><feGaussianBlur stdDeviation="1.4"/></filter></defs><rect width="100" height="80" fill="url(#${g})"/><circle cx="50" cy="42" r="34" fill="url(#${g}r)"/>${effectLayer(c.el, P, r)}<g transform="translate(50 42) scale(1.1) translate(-50 -42)">${SUBJECT[c.kind](P)}</g></svg>`;
  return artOf(c);
}
