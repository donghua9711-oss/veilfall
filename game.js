// Veilfall: 1v1 duel vs AI. Reduce the enemy Ward from 20 to 0.
const $ = s => document.querySelector(s), sleep = ms => new Promise(r => setTimeout(r, ms));
const MAX_WARD = 20, MAX_BOARD = 5, MAX_HAND = 7, MAX_MANA = 10;
const TURN_SECONDS = 15, TIMEOUT_BURN = 2;
let S, uid = 0;
const other = w => w === 'p' ? 'o' : 'p';
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const newSide = () => ({ward: MAX_WARD, mana: 0, max: 0, deck: shuffle([...CARDS, ...CARDS]), hand: [], board: []});
const makeCreature = c => ({c, id: ++uid, atk: c.atk, hp: c.hp, max: c.hp, ready: true});

function newGame() {
  S = {p: newSide(), o: newSide(), turn: 'p', busy: false, sel: null, over: false};
  for (let i = 0; i < 4; i++) { drawCard('p'); drawCard('o'); }
  ensureOpener('p'); ensureOpener('o');
  $('#end-screen').classList.add('hidden');
  startTurn('p');
}
function ensureOpener(w) {           // guarantee a card playable on turn 1 (cost 1), preferring a creature
  const s = S[w]; if (s.hand.some(c => c.cost <= 1)) return;
  let di = s.deck.findIndex(c => c.cost <= 1 && !c.spell);
  if (di < 0) di = s.deck.findIndex(c => c.cost <= 1);
  if (di < 0) return;
  const t = s.hand[0]; s.hand[0] = s.deck[di]; s.deck[di] = t;
}
function drawCard(w) {
  const s = S[w], c = s.deck.pop();
  if (!c) return hitWard(w, 1);              // fatigue
  if (s.hand.length < MAX_HAND) s.hand.push(c);
}
function startTurn(w) {
  const s = S[w]; S.turn = w; s.max = Math.min(MAX_MANA, s.max + 1); s.mana = s.max;
  if (w === 'p') { S.played = false; S.deadline = Date.now() + TURN_SECONDS * 1000; }
  if (w === 'p') setTimeout(maybeAutoPass, 1400);
  drawCard(w); s.board.forEach(i => i.ready = true); S.sel = null;
  setHint(w === 'p' ? 'Summon your creatures - they attack on their own when your turn ends.' : 'The Rift Warden is plotting...');
  checkEnd(); render();
  if (w === 'o' && !S.over) aiTurn();
}
function setHint(t) { $('#hint').textContent = t; }
function pop(sel, text, cls) {
  const el = $(sel); if (!el) return;
  const r = el.getBoundingClientRect(), s = document.createElement('span');
  s.textContent = text; s.className = cls; s.style.left = r.left + r.width / 2 - 14 + 'px'; s.style.top = r.top + r.height / 3 + 'px';
  $('#fx').append(s); setTimeout(() => s.remove(), 950);
}
function hitWard(w, n) { S[w].ward = Math.max(0, S[w].ward - n); pop(w === 'p' ? '#pward' : '#oward', '-' + n, 'dmg'); }
function healWard(w, n) { S[w].ward = Math.min(MAX_WARD, S[w].ward + n); pop(w === 'p' ? '#pward' : '#oward', '+' + n, 'heal'); }
function hitCreature(inst, n) { inst.hp -= n; pop(`[data-id="${inst.id}"]`, '-' + n, 'dmg'); }
function explodeAt(el) {
  const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const ghost = el.cloneNode(true);
  ghost.classList.add('die-clone');
  ghost.style.left = r.left + 'px'; ghost.style.top = r.top + 'px'; ghost.style.width = r.width + 'px'; ghost.style.height = r.height + 'px';
  document.body.append(ghost); setTimeout(() => ghost.remove(), 460);
  const ring = document.createElement('div'); ring.className = 'ring';
  ring.style.left = (cx - r.width / 2) + 'px'; ring.style.top = (cy - r.width / 2) + 'px'; ring.style.width = r.width + 'px'; ring.style.height = r.width + 'px';
  document.body.append(ring); setTimeout(() => ring.remove(), 480);
  const cols = ['#ffd56e', '#ff8a5a', '#c99aff', '#fff3d6'];
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('div'); p.className = 'px';
    const a = Math.random() * Math.PI * 2, d = 34 + Math.random() * 62;
    p.style.setProperty('--dx', Math.cos(a) * d + 'px'); p.style.setProperty('--dy', Math.sin(a) * d + 'px');
    p.style.left = (cx - 4) + 'px'; p.style.top = (cy - 4) + 'px'; p.style.background = cols[i % cols.length];
    document.body.append(p); setTimeout(() => p.remove(), 580);
  }
}
const LOG = [];
function logEvent(t) { LOG.push(t); if (LOG.length > 3) LOG.shift(); const el = $('#log'); if (el) el.innerHTML = LOG.map((x, i) => `<div class="${i === LOG.length - 1 ? 'last' : ''}">${x}</div>`).join(''); }
function zapAt(el) {                 // a lightning bolt strikes the target card or Ward
  if (!el) return;
  const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  let pts = [], x = cx + (Math.random() * 60 - 30), y = Math.max(0, r.top - 190);
  pts.push(x + ',' + y);
  const steps = 5;
  for (let i = 1; i <= steps; i++) pts.push((cx + (x - cx) * (1 - i / steps) + (Math.random() * 26 - 13)) + ',' + (y + (cy - y) * i / steps));
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'zap');
  svg.innerHTML = `<polyline points="${pts.join(' ')}" fill="none" stroke="#ffe95a" stroke-width="3.5" stroke-linejoin="round"/><polyline points="${pts.join(' ')}" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-linejoin="round"/>`;
  document.body.append(svg); setTimeout(() => svg.remove(), 300);
  const f = document.createElement('div'); f.className = 'flash';
  f.style.left = r.left + 'px'; f.style.top = r.top + 'px'; f.style.width = r.width + 'px'; f.style.height = r.height + 'px';
  document.body.append(f); setTimeout(() => f.remove(), 300);
  el.classList.add('shake'); setTimeout(() => el.classList.remove('shake'), 320);
}
function reapDead() {
  for (const w of ['p', 'o']) for (const i of S[w].board) if (i.hp <= 0) { const el = document.querySelector(`[data-id="${i.id}"]`); if (el) explodeAt(el); }
  for (const w of ['p', 'o']) S[w].board = S[w].board.filter(i => i.hp > 0);
}
function validTargets(w) {                    // enemy side w: guards shield everything else
  const guards = S[w].board.filter(i => i.c.guard);
  return guards.length ? guards : [...S[w].board, 'ward'];
}
function battlecry(w, [kind, n]) {
  if (kind === 'heal') healWard(w, n);
  if (kind === 'hit') hitWard(other(w), n);
  if (kind === 'draw') for (let i = 0; i < n; i++) drawCard(w);
}
function playCreature(w, idx) {
  const s = S[w], c = s.hand[idx]; s.mana -= c.cost; s.hand.splice(idx, 1);
  s.board.push(makeCreature(c)); if (w === 'p') S.played = true; logEvent((w === 'p' ? 'You summoned ' : 'Warden summoned ') + c.name + '.'); if (c.bc) battlecry(w, c.bc);
  checkEnd(); render();
}
function castSpell(w, idx, target) {
  const s = S[w], c = s.hand[idx], e = other(w), [kind, n] = c.spell;
  if (w === 'p') S.played = true;
  logEvent((w === 'p' ? 'You cast ' : 'Warden cast ') + c.name + '.');
  s.mana -= c.cost; s.hand.splice(idx, 1);
  if (kind === 'bolt') { zapAt(target === 'ward' ? $(w === 'p' ? '#oward' : '#pward') : $(`[data-id="${target.id}"]`)); target === 'ward' ? hitWard(e, n) : hitCreature(target, n); }
  if (kind === 'heal') healWard(w, n);
  if (kind === 'nova') [...S[e].board].forEach(i => hitCreature(i, n));
  S.sel = null; reapDead(); checkEnd(); setHint('Summoned. Your creatures attack on their own when your turn ends.'); render();
}
async function attack(w, att, target) {
  const was = S.busy; S.busy = true; S.sel = null;
  const el = $(`[data-id="${att.id}"]`); if (el) el.classList.add(w === 'p' ? 'lungeU' : 'lungeD');
  await sleep(220);
  att.ready = false;
  if (target === 'ward') hitWard(other(w), att.atk);
  else { hitCreature(target, att.atk); hitCreature(att, target.atk); }
  S.busy = was; logEvent(att.c.name + ' attacked ' + (target === 'ward' ? (w === 'p' ? 'the enemy Ward' : 'your Ward') : target.c.name) + '.'); reapDead(); checkEnd(); render();
}
function checkEnd() {
  if (S.over) return;
  if (S.o.ward <= 0) endGame(true); else if (S.p.ward <= 0) endGame(false);
}
function endGame(win) {
  S.over = true;
  setTimeout(() => {
    $('.panel').className = 'panel ' + (win ? 'win' : 'lose');
    $('#endTitle').textContent = win ? 'VICTORY' : 'DEFEAT';
    $('#endText').textContent = win ? 'The Rift Warden\'s Ward has shattered. The veil is yours.' : 'Your Ward has fallen. The Rift Warden claims the veil.';
    $('#end-screen').classList.remove('hidden');
  }, 600);
}
async function playerAttackPhase() {         // creatures attack on their own, one by one
  for (const a of [...S.p.board]) {
    if (S.over) break;
    if (!a.ready || a.hp <= 0 || !S.p.board.includes(a)) continue;
    await attack('p', a, playerAutoTarget(a)); await sleep(170);
  }
}
function endTurn() {
  if (S.turn !== 'p' || S.busy || S.over) return;
  S.busy = true; S.sel = null; render();
  playerAttackPhase().then(() => { S.busy = false; if (!S.over) startTurn('o'); });
}

// ---------- AI ----------
function aiPickPlay() {
  const o = S.o, p = S.p; let best = null;
  o.hand.forEach((c, i) => {
    if (c.cost > o.mana) return;
    let v = -1, run;
    if (!c.spell) { if (o.board.length < MAX_BOARD) { v = c.cost + 1; run = () => playCreature('o', i); } }
    else {
      const [k, n] = c.spell;
      if (k === 'heal' && o.ward <= 14) { v = c.cost + (o.ward <= 10 ? 4 : 0); run = () => castSpell('o', i); }
      if (k === 'nova') { const kills = p.board.filter(x => x.hp <= n).length; if (kills >= 2 || p.board.length >= 3) { v = c.cost + kills * 2; run = () => castSpell('o', i); } }
      if (k === 'bolt') {
        if (p.ward <= n) { v = 99; run = () => castSpell('o', i, 'ward'); }
        else { const t = p.board.filter(x => x.hp <= n).sort((a, b) => b.c.cost - a.c.cost)[0]; if (t && t.c.cost >= c.cost - 1) { v = c.cost + t.c.cost; run = () => castSpell('o', i, t); } }
      }
    }
    if (run && (!best || v > best.v)) best = {v, run};
  });
  return best && best.run;
}
function aiPickTarget(a) {
  const ts = validTargets('p'), ward = ts.includes('ward'), cs = ts.filter(t => t !== 'ward');
  if (ward && a.atk >= S.p.ward) return 'ward';
  const free = cs.filter(t => a.atk >= t.hp && a.hp > t.atk).sort((x, y) => y.c.cost - x.c.cost)[0]; if (free) return free;
  const trade = cs.find(t => a.atk >= t.hp && t.c.cost >= a.c.cost); if (trade) return trade;
  if (ward) return 'ward';
  const t = cs.sort((x, y) => x.hp - y.hp)[0];
  return t && (a.atk >= t.hp || a.hp > t.atk) ? t : null;
}
function aiForcePlay() {               // the Warden must act: cheapest affordable card, played plainly
  const o = S.o, p = S.p;
  const idxs = o.hand.map((c, i) => i).filter(i => o.hand[i].cost <= o.mana).sort((a, b) => o.hand[a].cost - o.hand[b].cost);
  for (const i of idxs) {
    const c = o.hand[i];
    if (!c.spell) { if (o.board.length < MAX_BOARD) { playCreature('o', i); return true; } continue; }
    const [k, n] = c.spell;
    if (k === 'bolt') { const t = [...p.board].sort((a, b) => b.c.cost - a.c.cost)[0]; castSpell('o', i, t || 'ward'); return true; }
    if (k === 'nova' && p.board.length) { castSpell('o', i); return true; }
    if (k === 'heal' && o.ward <= MAX_WARD - n) { castSpell('o', i); return true; }
  }
  return false;
}
async function aiTurn() {
  S.busy = true; render(); await sleep(450);
  const handBefore = S.o.hand.length, boardBefore = S.o.board.length;
  for (let n = 0; n < 8 && !S.over; n++) { const act = aiPickPlay(); if (!act) break; act(); await sleep(450); }
  if (!S.over && S.o.hand.length === handBefore && S.o.board.length === boardBefore) { if (aiForcePlay()) await sleep(450); }
  for (const a of [...S.o.board]) {
    if (S.over) break; if (!a.ready || a.hp <= 0) continue;
    const t = aiPickTarget(a); if (!t) continue;
    await attack('o', a, t); await sleep(320);
  }
  S.busy = false; if (!S.over) startTurn('p'); else render();
}

// ---------- Rendering ----------
function cardHtml(c, o = {}) {
  const inst = o.inst;
  const stats = c.spell
    ? `<span class="b ${c.spell[0] === 'heal' ? 'hp' : 'atk'}"><i>${c.spell[1]}</i><small>${c.spell[0] === 'heal' ? 'HEAL' : 'DMG'}</small></span><span class="kind">SPELL</span>`
    : `<span class="b atk"><i>${inst ? inst.atk : c.atk}</i><small>ATK</small></span><span class="b hp${inst && inst.hp < inst.max ? ' hurt' : ''}"><i>${inst ? inst.hp : c.hp}</i><small>HP</small></span>`;
  const P = PAL[c.el];
  return `<div class="card ${o.cls || ''}" style="--f:${P.f};--b:${P.b};${o.style || ''}" ${o.attrs || ''}><div class="hd"><i class="gem">${c.cost}</i><span class="nm">${c.name}</span></div><div class="art">${artOf(c)}</div><div class="tx">${c.text}</div><div class="st">${stats}</div></div>`;
}
function wardHtml(s) { return `<b>${s.ward}</b><small>WARD</small><div class="bar"><i style="width:${s.ward / MAX_WARD * 100}%"></i></div>`; }
function targetSet() {
  if (!S.sel || S.over) return [];
  return S.sel.att ? validTargets('o') : [...S.o.board, 'ward'];
}
function boardHtml(w, tg) {
  return S[w].board.map(i => {
    let cls = (i.c.guard ? 'gd ' : '') + (w === 'p' && S.turn === 'p' && i.ready && !S.busy ? 'rdy ' : '');
    if (S.sel && S.sel.att === i) cls += 'sel ';
    if (w === 'o' && tg.includes(i)) cls += 'tgt ';
    return cardHtml(i.c, {inst: i, cls, attrs: `data-id="${i.id}" data-side="${w}"`});
  }).join('');
}
function render() {
  const {p, o} = S, tg = targetSet();
  $('#oward').innerHTML = wardHtml(o); $('#pward').innerHTML = wardHtml(p);
  $('#oward').classList.toggle('tgt', tg.includes('ward'));
  $('#ometa').textContent = `Mana ${o.mana}/${o.max}, deck ${o.deck.length}, hand ${o.hand.length}`;
  $('#pmeta').textContent = `Mana ${p.mana}/${p.max}, deck ${p.deck.length}`;
  $('#pmana').innerHTML = Array.from({length: MAX_MANA}, (_, k) => `<i class="${k < p.mana ? 'on' : k < p.max ? 'used' : ''}"></i>`).join('');
  $('#opips').innerHTML = Array.from({length: MAX_MANA}, (_, k) => `<i class="${k < o.mana ? 'on' : k < o.max ? 'used' : ''}"></i>`).join('');
  $('#turn').textContent = S.over ? 'Duel over' : S.turn === 'p' ? 'Your turn' : 'Enemy turn';
  $('#ohand').innerHTML = o.hand.map(() => '<div class="back"></div>').join('');
  $('#oboard').innerHTML = boardHtml('o', tg); $('#pboard').innerHTML = boardHtml('p', tg);
  $('#phand').innerHTML = p.hand.map((c, i) => cardHtml(c, {cls: S.turn === 'p' && !S.busy && c.cost <= p.mana ? 'ok' : '', attrs: `data-hand="${i}"`})).join('');
  $('#end').disabled = S.turn !== 'p' || S.busy || S.over;
}

// ---------- Turn timer ----------
function tickTimer() {
  const bar = $('#timer'); if (!bar || !S) return;
  if (S.over || S.turn !== 'p') { bar.className = ''; return; }
  const left = Math.max(0, S.deadline - Date.now()), secs = Math.ceil(left / 1000);
  bar.className = 'on' + (secs <= 10 ? ' low' : '');
  bar.querySelector('i').style.width = (left / (TURN_SECONDS * 1000) * 100) + '%';
  bar.querySelector('span').textContent = secs + 's to summon';
  if (left > 0 || S.busy) return;
  S.busy = true;                                     // summoning is closed
  if (!S.played) { hitWard('p', TIMEOUT_BURN); setHint('Time! You summoned nothing - the Rift burns your Ward for ' + TIMEOUT_BURN + '.'); }
  else setHint('Time! Your turn passes.');
  render();
  setTimeout(() => { S.busy = false; if (!S.over) endTurn(); }, 1300);
}
setInterval(tickTimer, 250);

function playerAutoTarget(att) {
  const ts = validTargets('o'), cs = ts.filter(t => t !== 'ward'), ward = ts.includes('ward');
  const guard = cs.find(t => t.c.guard); if (guard) return guard;
  if (ward && att.atk >= S.o.ward) return 'ward';
  const free = cs.filter(t => att.atk >= t.hp && att.hp > t.atk).sort((a, b) => b.c.cost - a.c.cost)[0]; if (free) return free;
  const trade = cs.find(t => att.atk >= t.hp && t.c.cost >= att.c.cost); if (trade) return trade;
  if (ward) return 'ward';
  return cs.sort((a, b) => a.hp - b.hp)[0] || 'ward';
}
function playerBoltTarget(n) {
  const ts = validTargets('o'), cs = ts.filter(t => t !== 'ward');
  const kill = cs.filter(t => t.hp <= n).sort((a, b) => b.c.cost - a.c.cost)[0]; if (kill) return kill;
  if (ts.includes('ward') && S.o.ward <= n) return 'ward';
  const guard = cs.find(t => t.c.guard); if (guard) return guard;
  return cs.sort((a, b) => b.c.cost - a.c.cost)[0] || 'ward';
}
function maybeAutoPass() {               // nothing playable and nothing ready to attack: the turn passes by itself
  if (!S || S.over || S.turn !== 'p' || S.busy) return;
  const p = S.p;
  const canPlay = p.hand.some(c => c.cost <= p.mana && (c.spell || p.board.length < MAX_BOARD));
  const canAttack = p.board.some(i => i.ready);
  if (canPlay || canAttack) return;
  setHint('Nothing left to do - your turn passes by itself.');
  setTimeout(() => { if (S && !S.over && S.turn === 'p' && !S.busy) endTurn(); }, 900);
}
// ---------- Input ----------
async function onBoardClick(e) {
  if (S.turn !== 'p' || S.busy || S.over) return;
  const t = e.target.closest('[data-hand],[data-id],#oward');
  if (!t) { S.sel = null; return render(); }
  const p = S.p;
  if (t.dataset.hand !== undefined) {          // one click plays the card
    const idx = +t.dataset.hand, c = p.hand[idx];
    if (c.cost > p.mana) return setHint('Not enough mana.');
    if (c.spell) { const r = c.spell[0] === 'bolt' ? castSpell('p', idx, playerBoltTarget(c.spell[1])) : castSpell('p', idx); maybeAutoPass(); return r; }
    if (p.board.length >= MAX_BOARD) return setHint('Your board is full.');
    const r = playCreature('p', idx); maybeAutoPass(); return r;
  }
  return setHint('You only summon - your creatures attack on their own when your turn ends.');
}
function showTitle() {
  $('#fan').innerHTML = ['paladin', 'drake', 'nova'].map((id, k) => cardHtml(CARDS.find(x => x.id === id), {style: `transform:rotate(${(k - 1) * 9}deg) translateY(${k === 1 ? -10 : 0}px)`})).join('');
}
$('#game').addEventListener('click', onBoardClick);
$('#end').onclick = endTurn;
$('#restart').onclick = $('#again').onclick = newGame;
$('#start').onclick = () => { $('#title').classList.add('hidden'); $('#game').classList.remove('hidden'); newGame(); };
showTitle();

// ---------- Lobby: card gallery + rules ----------
const DESC = {
  cinderkit: 'Fast, cheap attacker. Only 1 HP, so it falls quickly - pure early pressure.',
  mossback: 'Guard wall. Enemies must attack Mossback first, so it soaks up hits while your other creatures attack freely.',
  nixie: 'Healer on arrival: the moment it is summoned, your Ward regains 2 HP.',
  stormfang: 'On arrival: deals 1 damage straight to the enemy Ward - and like every creature, it attacks at the end of the turn it is summoned.',
  witch: 'On arrival: draw 1 extra card from your deck.',
  paladin: 'Guard knight. Enemies must chew through her 5 HP before they can touch anything else you control.',
  roc: 'On arrival: deals 1 damage straight to the enemy Ward, then fights as a 4/3.',
  drake: 'On arrival: deals 2 damage straight to the enemy Ward, then fights as a 5/4 dragon.',
  serpent: 'Pure muscle: 4 attack and 6 HP, no tricks. Very hard to remove.',
  phoenix: 'On arrival: heals your Ward by 4, then fights as a 5/5.',
  colossus: 'The biggest Guard in the game: 7/7, and enemies must destroy it before anything else.',
  spark: 'Lightning spell: 2 damage to one enemy creature or the enemy Ward. A cheap finisher - the target is struck by lightning.',
  fireball: 'Heavy spell: 5 damage to one enemy creature or the enemy Ward. Kills almost anything in one hit.',
  mend: 'Healing spell: your Ward regains 5 HP.',
  nova: 'Board-clear spell: 3 damage to EVERY enemy creature at the same time.'
};
function buildGallery() {
  $('#galleryGrid').innerHTML = CARDS.map(c => {
    const stats = c.spell ? `Spell - costs ${c.cost} mana` : `Creature - costs ${c.cost} mana - ${c.atk} ATK / ${c.hp} HP${c.guard ? ' - Guard' : ''}${c.charge ? ' - Swift' : ''}`;
    return `<div class="g-item">${cardHtml(c, {})}<div class="g-info"><b>${c.name}</b><div class="g-stats">${stats}</div><p>${DESC[c.id] || c.text}</p></div></div>`;
  }).join('');
}
document.addEventListener('DOMContentLoaded', () => {
  $('#galleryBtn').onclick = () => { buildGallery(); $('#gallery').hidden = false; };
  $('#galleryClose').onclick = () => { $('#gallery').hidden = true; };
  $('#rulesBtn').onclick = () => { $('#rules').hidden = false; };
  $('#rulesClose').onclick = () => { $('#rules').hidden = true; };
  $('#lobby').onclick = () => location.reload();
});
