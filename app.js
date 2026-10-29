"use strict";

/* ---------- Utilitaires ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = {
  get(k, d) { try { const v = localStorage.getItem("ts_" + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem("ts_" + k, JSON.stringify(v)); } catch { /* stockage indisponible */ } }
};
const eur = n => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
const num = (n, d = 2) => n.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });
const pct = n => (n >= 0 ? "+" : "") + num(n) + " %";
const cls = n => (n >= 0 ? "pos" : "neg");
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ---------- Onglets ---------- */
$$("#tabs button").forEach(b => b.addEventListener("click", () => {
  $$("#tabs button").forEach(x => x.classList.toggle("active", x === b));
  $$(".tab").forEach(t => t.classList.toggle("active", t.id === "tab-" + b.dataset.tab));
  if (b.dataset.tab === "sim" && sim) drawChart();
}));

/* ---------- Questions (composant partagé) ---------- */
// Affiche une liste de questions ; renvoie une fonction qui corrige et retourne le score.
function renderQuestions(container, questions) {
  container.innerHTML = "";
  questions.forEach((qq, qi) => {
    const box = document.createElement("div");
    box.className = "q";
    const t = document.createElement("strong");
    t.textContent = `${qi + 1}. ${qq.q}`;
    box.appendChild(t);
    const opts = document.createElement("div");
    opts.className = "opts";
    qq.o.forEach((text, oi) => {
      const l = document.createElement("label");
      l.className = "opt";
      const r = document.createElement("input");
      r.type = "radio"; r.name = `q${qi}`; r.value = oi;
      l.append(r, document.createTextNode(text));
      opts.appendChild(l);
    });
    box.appendChild(opts);
    const ex = document.createElement("div");
    ex.className = "expl hidden";
    ex.textContent = qq.e;
    box.appendChild(ex);
    container.appendChild(box);
  });
  return function grade() {
    let score = 0;
    $$(".q", container).forEach((box, qi) => {
      const chosen = $(`input[name=q${qi}]:checked`, box);
      const labels = $$(".opt", box);
      labels.forEach((l, oi) => {
        l.classList.toggle("good", oi === questions[qi].a);
        l.classList.toggle("bad", chosen && +chosen.value === oi && oi !== questions[qi].a);
        $("input", l).disabled = true;
      });
      if (chosen && +chosen.value === questions[qi].a) score++;
      $(".expl", box).classList.remove("hidden");
    });
    return score;
  };
}

/* ---------- Leçons ---------- */
function renderLessons() {
  const done = store.get("lessons", {});
  const list = $("#lesson-list");
  list.innerHTML = "";
  LESSONS.forEach(ls => {
    const b = document.createElement("button");
    b.className = "lesson-card";
    const d = done[ls.id];
    b.innerHTML = `<div class="lvl">${ls.level}</div><strong>${ls.title}</strong>` +
      (d ? `<div class="done">✔ Validée (${d.score}/${d.total})</div>` : `<div class="muted">À faire</div>`);
    b.addEventListener("click", () => openLesson(ls));
    list.appendChild(b);
  });
  const n = LESSONS.filter(l => done[l.id]).length;
  $("#learn-bar").style.width = (100 * n / LESSONS.length) + "%";
  $("#learn-progress").textContent = `${n} / ${LESSONS.length} leçons validées`;
}

function openLesson(ls) {
  const view = $("#lesson-view");
  $("#lesson-list").classList.add("hidden");
  view.classList.remove("hidden");
  view.innerHTML = `<button class="ghost" id="lesson-back">← Retour aux leçons</button><h2>${ls.title}</h2>${ls.html}<h3>Vérifie tes connaissances</h3><div id="lesson-q"></div><button class="primary" id="lesson-check">Corriger</button><p id="lesson-res" class="msg"></p>`;
  const grade = renderQuestions($("#lesson-q"), ls.quiz);
  $("#lesson-back").onclick = closeLesson;
  $("#lesson-check").onclick = () => {
    const score = grade();
    const res = $("#lesson-res");
    $("#lesson-check").disabled = true;
    if (score === ls.quiz.length) {
      const done = store.get("lessons", {});
      done[ls.id] = { score, total: ls.quiz.length };
      store.set("lessons", done);
      res.className = "msg ok";
      res.textContent = `Bravo, ${score}/${ls.quiz.length} : leçon validée !`;
    } else {
      res.className = "msg warn";
      res.textContent = `${score}/${ls.quiz.length}. Relis la leçon et réessaie pour la valider.`;
    }
  };
  window.scrollTo(0, 0);
}
function closeLesson() {
  $("#lesson-view").classList.add("hidden");
  $("#lesson-list").classList.remove("hidden");
  renderLessons();
}

/* ---------- Quiz libre ---------- */
function newQuiz() {
  const all = LESSONS.flatMap(l => l.quiz);
  const picked = shuffle(all).slice(0, 10).map(q => {
    // mélange les options en conservant la bonne réponse
    const idx = shuffle(q.o.map((_, i) => i));
    return { q: q.q, o: idx.map(i => q.o[i]), a: idx.indexOf(q.a), e: q.e };
  });
  const box = $("#quiz-box");
  box.innerHTML = `<h2>Quiz : 10 questions aléatoires</h2><p class="muted">Meilleur score : <span id="quiz-best">${store.get("quizBest", "–")}</span></p><div id="quiz-q"></div><button class="primary" id="quiz-check">Corriger</button> <button class="ghost hidden" id="quiz-again">Nouveau quiz</button><p id="quiz-res" class="msg"></p>`;
  const grade = renderQuestions($("#quiz-q"), picked);
  $("#quiz-check").onclick = () => {
    const s = grade();
    $("#quiz-check").classList.add("hidden");
    $("#quiz-again").classList.remove("hidden");
    const best = store.get("quizBest", 0);
    if (typeof best !== "number" || s > best) store.set("quizBest", s);
    $("#quiz-res").className = "msg " + (s >= 7 ? "ok" : "warn");
    $("#quiz-res").textContent = `Score : ${s}/${picked.length}`;
  };
  $("#quiz-again").onclick = newQuiz;
}

/* ---------- Glossaire ---------- */
function renderGlossary(q = "") {
  const f = q.trim().toLowerCase();
  const items = GLOSSARY.filter(([t, d]) => !f || t.toLowerCase().includes(f) || d.toLowerCase().includes(f));
  const dl = $("#gloss-list");
  dl.innerHTML = "";
  items.forEach(([t, d]) => {
    const dt = document.createElement("dt"); dt.textContent = t;
    const dd = document.createElement("dd"); dd.textContent = d;
    dl.append(dt, dd);
  });
  if (!items.length) dl.textContent = "Aucun résultat.";
}
$("#gloss-q").addEventListener("input", e => renderGlossary(e.target.value));

/* ---------- Calculateur de risque ---------- */
function calcRisk() {
  const cap = +$("#r-cap").value, rp = +$("#r-risk").value;
  const entry = +$("#r-entry").value, stop = +$("#r-stop").value;
  const targetRaw = $("#r-target").value, target = targetRaw === "" ? null : +targetRaw;
  const out = $("#r-out"), warn = $("#r-warn");
  warn.className = "msg"; warn.textContent = "";
  if (!(cap > 0 && rp > 0 && entry > 0 && stop > 0) || entry === stop) {
    out.innerHTML = ""; warn.className = "msg err";
    warn.textContent = "Renseigne un capital, un risque, un prix d'entrée et un stop différents de l'entrée.";
    return;
  }
  const long = stop < entry;
  const riskEur = cap * rp / 100;
  const perShare = Math.abs(entry - stop);
  const qty = Math.floor(riskEur / perShare);
  const value = qty * entry;
  let rr = null;
  if (target != null && target > 0) {
    const valid = long ? target > entry : target < entry;
    rr = valid ? Math.abs(target - entry) / perShare : NaN;
  }
  const cell = (l, v) => `<div><span>${l}</span><strong>${v}</strong></div>`;
  out.innerHTML =
    cell("Sens", long ? "Achat (long)" : "Vente à découvert") +
    cell("Perte max. si stop touché", eur(riskEur)) +
    cell("Risque par titre", num(perShare)) +
    cell("Quantité à prendre", qty) +
    cell("Montant engagé", eur(value) + ` (${num(100 * value / cap, 1)} % du capital)`) +
    (rr == null ? "" : cell("Ratio gain/risque", isNaN(rr) ? "objectif incohérent" : "1 : " + num(rr, 2)));
  if (qty < 1) { warn.className = "msg err"; warn.textContent = "Le stop est trop éloigné pour ce niveau de risque : la quantité calculée est 0."; }
  else if (value > cap) { warn.className = "msg warn"; warn.textContent = "Cette position dépasse ton capital : elle nécessiterait du levier. Rapproche le stop ou réduis le risque."; }
  else if (rr != null && !isNaN(rr) && rr < 2) { warn.className = "msg warn"; warn.textContent = "Ratio gain/risque inférieur à 2 : ce trade est peu attractif en théorie."; }
  else if (isNaN(rr) && rr != null) { warn.className = "msg warn"; warn.textContent = "L'objectif doit être du bon côté de l'entrée (au-dessus pour un achat)."; }
}
$$("#tab-risk input").forEach(i => i.addEventListener("input", calcRisk));

/* ================= SIMULATEUR ================= */
const FEE = 0.001;
const WARMUP = 60, PLAY = 120;
const SCENARIOS = {
  bull: { name: "Tendance haussière", mu: 0.0014, sigma: 0.012, kappa: 0 },
  bear: { name: "Tendance baissière", mu: -0.0014, sigma: 0.012, kappa: 0 },
  range: { name: "Marché latéral", mu: 0, sigma: 0.011, kappa: 0.07 },
  volatile: { name: "Marché volatil", mu: 0.0002, sigma: 0.028, kappa: 0.01 }
};

function mulberry32(a) {
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
function gauss(r) { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

function genCandles(sc, seed, n) {
  const r = mulberry32(seed);
  const base = 100; let p = base; const out = [];
  for (let i = 0; i < n; i++) {
    let ret = sc.mu + sc.kappa * Math.log(base / p) + sc.sigma * gauss(r);
    // gap occasionnel (annonce nocturne)
    let o = p;
    if (r() < 0.04) o = p * Math.exp(sc.sigma * 1.5 * gauss(r));
    const c = o * Math.exp(ret);
    const w = Math.abs(sc.sigma * gauss(r)) * 0.7;
    const h = Math.max(o, c) * (1 + w * r());
    const l = Math.min(o, c) * (1 - w * r());
    out.push({ o, h, l, c });
    p = c;
  }
  return out;
}

function sma(vals, n) {
  const out = []; let sum = 0;
  vals.forEach((v, i) => { sum += v; if (i >= n) sum -= vals[i - n]; out.push(i >= n - 1 ? sum / n : null); });
  return out;
}
function rsi(vals, n = 14) {
  const out = vals.map(() => null);
  if (vals.length <= n) return out;
  let g = 0, l = 0;
  for (let i = 1; i <= n; i++) { const d = vals[i] - vals[i - 1]; if (d >= 0) g += d; else l -= d; }
  g /= n; l /= n;
  out[n] = l === 0 ? 100 : 100 - 100 / (1 + g / l);
  for (let i = n + 1; i < vals.length; i++) {
    const d = vals[i] - vals[i - 1];
    g = (g * (n - 1) + Math.max(d, 0)) / n;
    l = (l * (n - 1) + Math.max(-d, 0)) / n;
    out[i] = l === 0 ? 100 : 100 - 100 / (1 + g / l);
  }
  return out;
}

let sim = null, autoTimer = null;

function startSim() {
  let key = $("#sim-scenario").value;
  const keys = Object.keys(SCENARIOS);
  const revealed = key !== "mystery";
  if (key === "mystery") key = keys[Math.floor(Math.random() * keys.length)];
  const seed = Math.floor(Math.random() * 2 ** 31);
  const candles = genCandles(SCENARIOS[key], seed, WARMUP + PLAY);
  const closes = candles.map(c => c.c);
  sim = {
    key, revealed, candles,
    sma20: sma(closes, 20), sma50: sma(closes, 50), rsi: rsi(closes, 14),
    idx: WARMUP - 1, startIdx: WARMUP - 1,
    startCash: 10000, cash: 10000, shares: 0, avg: 0,
    stop: null, target: null,
    log: [], closed: [], fees: 0, equity: [10000],
    usedStop: false, done: false, hover: null
  };
  $("#sim-setup").classList.add("hidden");
  $("#sim-result").classList.add("hidden");
  $("#sim-game").classList.remove("hidden");
  $("#journal").innerHTML = "";
  $("#stop").value = ""; $("#target").value = "";
  setMsg("Nouvelle partie. Observe le graphique, puis avance jour par jour.", "");
  addLog(`Début de partie : ${eur(sim.startCash)} en liquidités.`);
  refresh();
}

const price = () => sim.candles[sim.idx].c;
const equityNow = () => sim.cash + sim.shares * price();

function setMsg(t, kind) { const m = $("#sim-msg"); m.textContent = t; m.className = "msg " + kind; }
function addLog(t) {
  const d = document.createElement("div");
  d.textContent = `J${sim.idx - sim.startIdx} – ${t}`;
  const j = $("#journal"); j.prepend(d);
}

function buy(qty, px, why) {
  const cost = qty * px, fee = cost * FEE;
  sim.cash -= cost + fee; sim.fees += fee;
  sim.avg = (sim.avg * sim.shares + cost) / (sim.shares + qty);
  sim.shares += qty;
  addLog(`${why}: achat de ${qty} à ${num(px)} (frais ${num(fee)} €)`);
}
function sell(qty, px, why) {
  const proceeds = qty * px, fee = proceeds * FEE;
  const pnl = (px - sim.avg) * qty - fee - qty * sim.avg * FEE; // frais d'achat approximés au prorata
  sim.cash += proceeds - fee; sim.fees += fee; sim.shares -= qty;
  sim.closed.push({ pnl, why });
  addLog(`${why}: vente de ${qty} à ${num(px)} → résultat ${pnl >= 0 ? "+" : ""}${num(pnl)} €`);
  if (sim.shares === 0) { sim.avg = 0; sim.stop = sim.target = null; $("#stop").value = ""; $("#target").value = ""; }
}

function maxQty() { return Math.floor(sim.cash / (price() * (1 + FEE))); }

function onBuy() {
  if (!sim || sim.done) return;
  const q = Math.floor(+$("#qty").value);
  if (!(q >= 1)) return setMsg("Quantité invalide.", "err");
  if (q > maxQty()) return setMsg(`Liquidités insuffisantes (max ${maxQty()} titres).`, "err");
  buy(q, price(), "Ordre");
  setMsg(`Achat de ${q} titres exécuté.`, "ok");
  refresh();
}
function onSell(all) {
  if (!sim || sim.done) return;
  const q = all ? sim.shares : Math.floor(+$("#qty").value);
  if (!(q >= 1)) return setMsg("Quantité invalide.", "err");
  if (q > sim.shares) return setMsg(`Tu ne détiens que ${sim.shares} titres (pas de vente à découvert ici).`, "err");
  sell(q, price(), "Ordre");
  setMsg(`Vente de ${q} titres exécutée.`, "ok");
  refresh();
}
function onLevels() {
  if (!sim || sim.done) return;
  if (!sim.shares) return setMsg("Ouvre d'abord une position pour lui associer un stop/objectif.", "err");
  const s = $("#stop").value === "" ? null : +$("#stop").value;
  const t = $("#target").value === "" ? null : +$("#target").value;
  if (s != null && s >= price()) return setMsg("Le stop doit être sous le prix actuel.", "err");
  if (t != null && t <= price()) return setMsg("L'objectif doit être au-dessus du prix actuel.", "err");
  sim.stop = s; sim.target = t;
  if (s != null) sim.usedStop = true;
  setMsg("Niveaux enregistrés. Ils sont vérifiés à chaque nouveau jour.", "ok");
  refresh();
}

function nextDay() {
  if (!sim || sim.done) return false;
  sim.idx++;
  const c = sim.candles[sim.idx];
  if (sim.shares > 0) {
    if (sim.stop != null && c.l <= sim.stop) {
      const px = Math.min(sim.stop, c.o);
      sell(sim.shares, px, "Stop-loss déclenché");
      setMsg(`Stop-loss déclenché à ${num(px)}.`, "warn");
    } else if (sim.target != null && c.h >= sim.target) {
      const px = Math.max(sim.target, c.o);
      sell(sim.shares, px, "Objectif atteint");
      setMsg(`Objectif atteint à ${num(px)}.`, "ok");
    }
  }
  sim.equity.push(equityNow());
  if (sim.idx >= sim.candles.length - 1) { finish(); return false; }
  refresh();
  return true;
}
function advance(n) { for (let i = 0; i < n; i++) if (!nextDay()) break; }
function toggleAuto() {
  if (autoTimer) { stopAuto(); return; }
  $("#btn-auto").textContent = "Pause ⏸";
  autoTimer = setInterval(() => { if (!nextDay()) stopAuto(); }, 350);
}
function stopAuto() { clearInterval(autoTimer); autoTimer = null; $("#btn-auto").textContent = "Auto ▶▶"; }

function refresh() {
  if (!sim) return;
  const eq = equityNow();
  const perf = 100 * (eq / sim.startCash - 1);
  $("#st-day").textContent = `${sim.idx - sim.startIdx} / ${PLAY}`;
  $("#st-price").textContent = num(price());
  $("#st-cash").textContent = eur(sim.cash);
  $("#st-pos").textContent = sim.shares ? `${sim.shares} @ ${num(sim.avg)}` : "aucune";
  $("#st-equity").textContent = eur(eq);
  const p = $("#st-perf"); p.textContent = pct(perf); p.className = cls(perf);
  drawChart();
}

function finish() {
  stopAuto();
  if (!sim || sim.done) return;
  if (sim.shares > 0) { addLog("Clôture automatique de la position en fin de partie."); sell(sim.shares, price(), "Fin de partie"); sim.equity[sim.equity.length - 1] = equityNow(); }
  sim.done = true;
  refresh();
  showResult();
}

function showResult() {
  const eq = equityNow();
  const ret = 100 * (eq / sim.startCash - 1);
  const bh = 100 * (sim.candles[sim.candles.length - 1].c / sim.candles[sim.startIdx].c - 1);
  let peak = sim.equity[0], mdd = 0;
  sim.equity.forEach(v => { peak = Math.max(peak, v); mdd = Math.max(mdd, 100 * (peak - v) / peak); });
  const wins = sim.closed.filter(t => t.pnl > 0).length;
  const n = sim.closed.length;
  const tips = [];
  if (n === 0) tips.push("Tu n'as pris aucune position. Rester à l'écart est une décision valable, mais pour progresser, teste de petites positions avec un stop.");
  if (n > 12) tips.push(`${n} trades clôturés en 120 jours : attention au surtrading, les frais (${eur(sim.fees)}) pèsent sur ta performance.`);
  if (n > 0 && !sim.usedStop) tips.push("Tu n'as jamais utilisé de stop-loss. Définis ta perte maximale avant d'entrer (voir leçon 7).");
  if (mdd > 15) tips.push(`Ton capital a connu une baisse maximale de ${num(mdd, 1)} %. Réduis la taille de tes positions pour mieux dormir la nuit.`);
  if (n >= 3 && wins / n < 0.4 && ret > 0) tips.push("Peu de trades gagnants mais résultat positif : tes gains sont plus gros que tes pertes, c'est le bon réflexe.");
  if (n >= 3 && wins / n >= 0.5 && ret < 0) tips.push("Tu as souvent raison mais tu perds de l'argent : tes pertes sont plus grandes que tes gains. Coupe plus vite les positions perdantes.");
  if (ret < bh - 3) tips.push(`Tu as fait moins bien qu'un simple « acheter et conserver » (${pct(bh)}). Sur un marché haussier, c'est souvent difficile à battre.`);
  if (ret > bh + 3) tips.push(`Tu as battu l'achat-conservation (${pct(bh)}). Vérifie que ce n'est pas dû à de la chance en rejouant d'autres scénarios.`);
  if (!tips.length) tips.push("Résultat sans point faible évident. Rejoue d'autres scénarios pour valider ta méthode.");
  const el = $("#sim-result");
  el.classList.remove("hidden");
  el.innerHTML = `<h2>Fin de partie</h2>
    <p>Le scénario était : <strong>${SCENARIOS[sim.key].name}</strong>.</p>
    <div class="result-grid">
      <div><span>Capital final</span><strong>${eur(eq)}</strong></div>
      <div><span>Performance</span><strong class="${cls(ret)}">${pct(ret)}</strong></div>
      <div><span>Acheter &amp; conserver</span><strong class="${cls(bh)}">${pct(bh)}</strong></div>
      <div><span>Baisse max (drawdown)</span><strong>${num(mdd, 1)} %</strong></div>
      <div><span>Trades clôturés</span><strong>${n}${n ? ` (${wins} gagnants)` : ""}</strong></div>
      <div><span>Frais payés</span><strong>${eur(sim.fees)}</strong></div>
    </div>
    <h3>Ce que tu peux améliorer</h3><ul class="tips">${tips.map(t => `<li>${t}</li>`).join("")}</ul>
    <button class="primary" id="sim-again">Rejouer</button>`;
  $("#sim-again").onclick = () => { $("#sim-game").classList.add("hidden"); el.classList.add("hidden"); $("#sim-setup").classList.remove("hidden"); sim = null; };
  const best = store.get("simBest", null);
  if (best == null || ret > best) store.set("simBest", ret);
}

/* ---------- Dessin du graphique ---------- */
const COL = { up: "#26a69a", down: "#ef5350", grid: "#2a3452", text: "#8d98b5", s20: "#f5a623", s50: "#5b8cff", avg: "#e6eaf5", stop: "#ef5350", tgt: "#26a69a" };
const VISIBLE = 80;

function drawChart() {
  if (!sim) return;
  const cv = $("#chart");
  const dpr = window.devicePixelRatio || 1;
  const W = cv.clientWidth, H = cv.clientHeight;
  if (!W || !H) return;
  cv.width = W * dpr; cv.height = H * dpr;
  const g = cv.getContext("2d");
  g.scale(dpr, dpr);
  g.clearRect(0, 0, W, H);
  g.font = "11px system-ui, sans-serif";

  const showRsi = $("#ind-rsi").checked;
  const padR = 56, padL = 6;
  const priceH = showRsi ? H * 0.72 : H - 18;
  const rsiTop = priceH + 14, rsiH = H - rsiTop - 4;

  const end = sim.idx, start = Math.max(0, end - VISIBLE + 1);
  const vis = sim.candles.slice(start, end + 1);
  const n = VISIBLE, step = (W - padL - padR) / n;
  const xOf = i => padL + (i - start) * step + step / 2;

  let lo = Infinity, hi = -Infinity;
  const consider = v => { if (v != null) { lo = Math.min(lo, v); hi = Math.max(hi, v); } };
  vis.forEach(c => { consider(c.l); consider(c.h); });
  for (let i = start; i <= end; i++) { if ($("#ind-sma20").checked) consider(sim.sma20[i]); if ($("#ind-sma50").checked) consider(sim.sma50[i]); }
  if (sim.shares) { consider(sim.avg); consider(sim.stop); consider(sim.target); }
  const mg = (hi - lo) * 0.06 || 1; lo -= mg; hi += mg;
  const yOf = v => 10 + (hi - v) / (hi - lo) * (priceH - 20);

  // grille et axe des prix
  g.strokeStyle = COL.grid; g.fillStyle = COL.text; g.lineWidth = 1;
  for (let k = 0; k <= 5; k++) {
    const v = lo + (hi - lo) * k / 5, y = yOf(v);
    g.beginPath(); g.moveTo(padL, y); g.lineTo(W - padR, y); g.stroke();
    g.fillText(num(v), W - padR + 4, y + 4);
  }

  // bougies
  const bw = Math.max(2, step * 0.65);
  vis.forEach((c, k) => {
    const i = start + k, x = xOf(i), up = c.c >= c.o;
    g.strokeStyle = g.fillStyle = up ? COL.up : COL.down;
    g.beginPath(); g.moveTo(x, yOf(c.h)); g.lineTo(x, yOf(c.l)); g.stroke();
    const y1 = yOf(Math.max(c.o, c.c)), y2 = yOf(Math.min(c.o, c.c));
    g.fillRect(x - bw / 2, y1, bw, Math.max(1, y2 - y1));
  });

  // moyennes mobiles
  const line = (arr, color) => {
    g.strokeStyle = color; g.lineWidth = 1.5; g.beginPath(); let on = false;
    for (let i = start; i <= end; i++) { if (arr[i] == null) continue; const x = xOf(i), y = yOf(arr[i]); on ? g.lineTo(x, y) : g.moveTo(x, y); on = true; }
    g.stroke(); g.lineWidth = 1;
  };
  if ($("#ind-sma20").checked) line(sim.sma20, COL.s20);
  if ($("#ind-sma50").checked) line(sim.sma50, COL.s50);

  // niveaux de position
  const level = (v, color, label) => {
    if (v == null) return;
    const y = yOf(v);
    g.strokeStyle = color; g.setLineDash([5, 4]); g.beginPath(); g.moveTo(padL, y); g.lineTo(W - padR, y); g.stroke(); g.setLineDash([]);
    g.fillStyle = color; g.fillText(label + " " + num(v), W - padR + 4, y - 3);
  };
  if (sim.shares) { level(sim.avg, COL.avg, "PRU"); level(sim.stop, COL.stop, "Stop"); level(sim.target, COL.tgt, "Obj"); }

  // prix courant
  const cy = yOf(price());
  g.fillStyle = "#5b8cff"; g.fillRect(W - padR, cy - 8, padR, 16);
  g.fillStyle = "#fff"; g.fillText(num(price()), W - padR + 4, cy + 4);

  // RSI
  if (showRsi) {
    g.strokeStyle = COL.grid; g.fillStyle = COL.text;
    const ry = v => rsiTop + (100 - v) / 100 * rsiH;
    [30, 50, 70].forEach(v => { g.beginPath(); g.moveTo(padL, ry(v)); g.lineTo(W - padR, ry(v)); g.stroke(); g.fillText(v, W - padR + 4, ry(v) + 4); });
    g.fillText("RSI 14", padL + 2, rsiTop + 11);
    g.strokeStyle = "#b388ff"; g.lineWidth = 1.5; g.beginPath(); let on = false;
    for (let i = start; i <= end; i++) { const v = sim.rsi[i]; if (v == null) continue; const x = xOf(i), y = ry(v); on ? g.lineTo(x, y) : g.moveTo(x, y); on = true; }
    g.stroke(); g.lineWidth = 1;
  }

  // réticule au survol
  if (sim.hover != null && sim.hover >= start && sim.hover <= end) {
    const x = xOf(sim.hover);
    g.strokeStyle = "rgba(230,234,245,.35)"; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke();
  }
}

function onHover(e) {
  if (!sim) return;
  const cv = $("#chart"), rect = cv.getBoundingClientRect();
  const x = e.clientX - rect.left, padR = 56, padL = 6;
  const step = (rect.width - padL - padR) / VISIBLE;
  const start = Math.max(0, sim.idx - VISIBLE + 1);
  const i = start + Math.floor((x - padL) / step);
  if (i < start || i > sim.idx) { sim.hover = null; $("#ohlc").textContent = ""; }
  else {
    sim.hover = i; const c = sim.candles[i];
    $("#ohlc").textContent = `J${i - sim.startIdx}  O ${num(c.o)}  H ${num(c.h)}  B ${num(c.l)}  C ${num(c.c)}`;
  }
  drawChart();
}

/* ---------- Branchements ---------- */
$("#sim-start").onclick = startSim;
$("#btn-buy").onclick = onBuy;
$("#btn-sell").onclick = () => onSell(false);
$("#btn-sell-all").onclick = () => onSell(true);
$("#btn-max").onclick = () => { if (sim) $("#qty").value = Math.max(1, maxQty()); };
$("#btn-levels").onclick = onLevels;
$("#btn-next").onclick = () => { stopAuto(); nextDay(); };
$("#btn-week").onclick = () => { stopAuto(); advance(5); };
$("#btn-auto").onclick = toggleAuto;
// confirmation intégrée à la page (confirm() est bloqué dans les pages publiées)
let endArmed = null;
$("#btn-end").onclick = () => {
  if (!sim || sim.done) return;
  const b = $("#btn-end");
  if (!endArmed) {
    b.textContent = "Confirmer la fin ?";
    endArmed = setTimeout(() => { endArmed = null; b.textContent = "Terminer la partie"; }, 4000);
    return;
  }
  clearTimeout(endArmed); endArmed = null; b.textContent = "Terminer la partie";
  finish();
};
["#ind-sma20", "#ind-sma50", "#ind-rsi"].forEach(s => $(s).addEventListener("change", drawChart));
$("#chart").addEventListener("mousemove", onHover);
$("#chart").addEventListener("mouseleave", () => { if (sim) { sim.hover = null; $("#ohlc").textContent = ""; drawChart(); } });
window.addEventListener("resize", drawChart);

/* ---------- Initialisation ---------- */
renderLessons();
newQuiz();
renderGlossary();
calcRisk();
