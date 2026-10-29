"use strict";

/* ---------- Utilitaires ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, c = "", html) => { const e = document.createElement(tag); if (c) e.className = c; if (html != null) e.innerHTML = html; return e; };
const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const ic = (n, s = 18, c = "ic") => `<svg class="${c}" width="${s}" height="${s}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const store = {
  get(k, d) { try { const v = localStorage.getItem("ts_" + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem("ts_" + k, JSON.stringify(v)); } catch { /* stockage indisponible */ } }
};
const eur = n => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
const num = (n, d = 2) => n.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });
const pct = n => (n >= 0 ? "+" : "−") + num(Math.abs(n)) + " %";
const sgn = n => (n >= 0 ? "+" : "−") + num(Math.abs(n));
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ---------- Thème (clair / sombre) ---------- */
const mq = matchMedia("(prefers-color-scheme: dark)");
function resolveTheme() { const t = store.get("theme", null); return t === "light" || t === "dark" ? t : (mq.matches ? "dark" : "light"); }
function applyTheme() {
  const t = resolveTheme();
  document.documentElement.setAttribute("data-theme", t);
  $("#meta-theme").setAttribute("content", css("--bg"));
  $$(".theme-btn").forEach(b => {
    b.innerHTML = ic(t === "dark" ? "sun" : "moon") + (t === "dark" ? "Thème clair" : "Thème sombre");
    b.setAttribute("aria-label", t === "dark" ? "Passer au thème clair" : "Passer au thème sombre");
  });
  if (typeof drawChart === "function") { drawChart(); drawEquity(); }
}
$$(".theme-btn").forEach(b => b.addEventListener("click", () => { store.set("theme", resolveTheme() === "dark" ? "light" : "dark"); applyTheme(); }));
mq.addEventListener("change", () => { if (!store.get("theme", null)) applyTheme(); });

/* ---------- Navigation ---------- */
const TABS = ["learn", "sim", "quiz", "risk", "gloss"];
function route() {
  let t = location.hash.slice(1);
  if (!TABS.includes(t)) t = "learn";
  $$(".tab").forEach(x => x.classList.toggle("active", x.id === "tab-" + t));
  $$("[data-tab]").forEach(a => {
    const on = a.dataset.tab === t;
    a.classList.toggle("is-active", on);
    if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  });
  document.title = $("#tab-" + t).dataset.title + " – TrendScout";
  window.scrollTo(0, 0);
  clearTimeout(toastTimer); $("#toast-zone").innerHTML = "";
  if (t === "sim") { drawChart(); drawEquity(); }
}
window.addEventListener("hashchange", route);

/* ---------- Toast ---------- */
let toastTimer = null;
function toast(text, kind = "info") {
  const z = $("#toast-zone");
  z.innerHTML = "";
  const t = el("div", "toast " + kind);
  t.innerHTML = `<span class="ic">${ic(kind === "ok" ? "check" : kind === "err" ? "x" : kind === "warn" ? "warn" : "info", 16, "ico")}</span><span></span>`;
  t.lastChild.textContent = text;
  z.appendChild(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { z.innerHTML = ""; }, 3800);
}

/* ---------- Questions (composant partagé) ---------- */
function renderQuestions(container, questions) {
  container.innerHTML = "";
  questions.forEach((qq, qi) => {
    const box = el("div", "q");
    const title = el("p", "q-title"); title.textContent = `${qi + 1}. ${qq.q}`;
    const opts = el("div", "opts"); opts.setAttribute("role", "radiogroup"); opts.setAttribute("aria-label", qq.q);
    qq.o.forEach((text, oi) => {
      const l = el("label", "opt", `<input class="sr" type="radio" name="${container.id}-${qi}" value="${oi}"><span class="dot"></span><span class="txt"></span><span class="tag"></span>`);
      $(".txt", l).textContent = text;
      opts.appendChild(l);
    });
    opts.addEventListener("change", () => $$(".opt", opts).forEach(l => l.classList.toggle("is-selected", $("input", l).checked)));
    const ex = el("p", "expl hidden"); ex.textContent = qq.e;
    box.append(title, opts, ex);
    container.appendChild(box);
  });
  return function grade() {
    let score = 0;
    $$(".q", container).forEach((box, qi) => {
      const chosen = $(`input[name="${container.id}-${qi}"]:checked`, box);
      const right = questions[qi].a;
      $$(".opt", box).forEach((l, oi) => {
        const isChosen = chosen && +chosen.value === oi;
        l.classList.remove("is-selected");
        l.classList.add("is-disabled");
        $("input", l).disabled = true;
        if (oi === right) { l.classList.add("is-correct"); $(".tag", l).innerHTML = ic("check", 16) + (isChosen ? "Bonne réponse" : "À retenir"); }
        else if (isChosen) { l.classList.add("is-wrong"); $(".tag", l).innerHTML = ic("x", 16) + "Ta réponse"; }
      });
      if (chosen && +chosen.value === right) score++;
      $(".expl", box).classList.remove("hidden");
    });
    return score;
  };
}

/* ---------- Leçons ---------- */
function nextLesson() { const done = store.get("lessons", {}); return LESSONS.find(l => !done[l.id]) || null; }

function renderLessons() {
  const done = store.get("lessons", {});
  const list = $("#lesson-list");
  list.innerHTML = "";
  LESSONS.forEach(ls => {
    const d = done[ls.id];
    const b = el("button", "glass shadow lesson-card",
      `<span class="pill">${ls.level}</span><span class="title-m"></span>` +
      (d ? `<span class="badge ok">${ic("check", 14)}Validée ${d.score}/${d.total}</span>` : `<span class="badge">À faire · ${ls.quiz.length} questions</span>`));
    b.type = "button";
    $(".title-m", b).textContent = ls.title;
    b.addEventListener("click", () => openLesson(ls));
    list.appendChild(b);
  });
  const n = LESSONS.filter(l => done[l.id]).length;
  const p = Math.round(100 * n / LESSONS.length);
  $("#learn-bar").style.width = p + "%";
  $("#learn-barwrap").setAttribute("aria-valuenow", p);
  $("#learn-progress").textContent = `${n} / ${LESSONS.length} leçons validées`;
  const nx = nextLesson();
  const btn = $("#learn-next");
  btn.textContent = nx ? (n ? "Continuer : " : "Commencer : ") + nx.title.replace(/^\d+\.\s*/, "") : "Tout revoir";
  btn.onclick = () => openLesson(nx || LESSONS[0]);
}

function openLesson(ls) {
  if (location.hash !== "#learn") { history.replaceState(null, "", "#learn"); route(); }
  const view = $("#lesson-view");
  $(".hero").classList.add("hidden");
  $("#lesson-list").classList.add("hidden");
  view.classList.remove("hidden");
  view.innerHTML = `<button class="btn btn-plain btn-sm" id="lesson-back" type="button">← Toutes les leçons</button>
    <h2 class="title-l"></h2><div class="prose">${ls.html}</div><div class="divider"></div>
    <h3 class="title-m">Vérifie tes connaissances</h3><div id="lesson-q"></div>
    <div class="actions"><button class="btn btn-primary" id="lesson-check" type="button">Corriger</button></div>
    <div id="lesson-res" class="hidden"></div>`;
  $("h2", view).textContent = ls.title;
  const grade = renderQuestions($("#lesson-q"), ls.quiz);
  $("#lesson-back").onclick = closeLesson;
  $("#lesson-check").onclick = () => {
    const score = grade();
    const res = $("#lesson-res");
    $("#lesson-check").classList.add("hidden");
    res.classList.remove("hidden");
    if (score === ls.quiz.length) {
      const done = store.get("lessons", {});
      done[ls.id] = { score, total: ls.quiz.length };
      store.set("lessons", done);
      res.className = "keep";
      res.innerHTML = `<span class="k">Leçon validée</span><p>Bravo, ${score}/${ls.quiz.length} : tout est juste.</p>`;
      const idx = LESSONS.indexOf(ls);
      if (LESSONS[idx + 1]) {
        const nb = el("button", "btn btn-primary", "Leçon suivante →"); nb.type = "button";
        nb.onclick = () => { renderLessons(); openLesson(LESSONS[idx + 1]); };
        res.appendChild(nb);
      }
    } else {
      res.className = "keep warn";
      res.innerHTML = `<span class="k">Presque</span><p>${score}/${ls.quiz.length}. Relis la leçon et réessaie pour la valider.</p>`;
      const rb = el("button", "btn btn-plain btn-sm", "Réessayer"); rb.type = "button";
      rb.onclick = () => openLesson(ls);
      res.appendChild(rb);
    }
    res.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };
  window.scrollTo(0, 0);
}
function closeLesson() {
  $("#lesson-view").classList.add("hidden");
  $(".hero").classList.remove("hidden");
  $("#lesson-list").classList.remove("hidden");
  renderLessons();
  window.scrollTo(0, 0);
}

/* ---------- Quiz libre ---------- */
function newQuiz() {
  const all = LESSONS.flatMap(l => l.quiz);
  const picked = shuffle(all).slice(0, 10).map(q => {
    const idx = shuffle(q.o.map((_, i) => i));
    return { q: q.q, o: idx.map(i => q.o[i]), a: idx.indexOf(q.a), e: q.e };
  });
  const best = store.get("quizBest", null);
  const box = $("#quiz-box");
  box.innerHTML = `<h2 class="title-l">Quiz</h2>
    <p class="muted">10 questions aléatoires tirées des leçons. ${typeof best === "number" ? `Meilleur score : <strong>${best}/10</strong>.` : "Pas encore de score enregistré."}</p>
    <div id="quiz-q"></div>
    <div class="actions"><button class="btn btn-primary" id="quiz-check" type="button">Corriger</button><button class="btn btn-plain hidden" id="quiz-again" type="button">Nouveau quiz</button></div>
    <div id="quiz-res" class="hidden"></div>`;
  const grade = renderQuestions($("#quiz-q"), picked);
  $("#quiz-check").onclick = () => {
    const s = grade();
    $("#quiz-check").classList.add("hidden");
    $("#quiz-again").classList.remove("hidden");
    const b = store.get("quizBest", null);
    if (typeof b !== "number" || s > b) store.set("quizBest", s);
    const r = $("#quiz-res");
    r.classList.remove("hidden");
    r.className = s >= 7 ? "keep" : "keep warn";
    r.innerHTML = `<span class="k">Score</span><p class="score">${s}/${picked.length}</p><p>${s >= 7 ? "Très bien, tu maîtrises les bases." : "Relis les leçons concernées puis réessaie."}</p>`;
    r.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };
  $("#quiz-again").onclick = () => { newQuiz(); window.scrollTo(0, 0); };
}

/* ---------- Glossaire ---------- */
function renderGlossary(q = "") {
  const f = q.trim().toLowerCase();
  const items = GLOSSARY.filter(([t, d]) => !f || t.toLowerCase().includes(f) || d.toLowerCase().includes(f))
    .sort((a, b) => a[0].localeCompare(b[0], "fr", { sensitivity: "base" }));
  const box = $("#gloss-list");
  box.innerHTML = "";
  if (!items.length) { box.appendChild(el("p", "muted", "Aucun résultat.")); return; }
  let cur = "";
  items.forEach(([t, d]) => {
    const l = t.normalize("NFD")[0].toUpperCase();
    if (l !== cur) { cur = l; box.appendChild(el("h3", "letter", l)); }
    const row = el("dl", "gl", "<dt></dt><dd></dd>");
    $("dt", row).textContent = t; $("dd", row).textContent = d;
    box.appendChild(row);
  });
}
$("#gloss-q").addEventListener("input", e => renderGlossary(e.target.value));

/* ---------- Calculateur de risque ---------- */
function riskSchema(entry, stop, target) {
  const vals = [entry, stop].concat(target ? [target] : []);
  let lo = Math.min(...vals), hi = Math.max(...vals);
  const pad = (hi - lo) * 0.18 || 1; lo -= pad; hi += pad;
  const W = 340, H = 170, y = v => 10 + (hi - v) / (hi - lo) * (H - 20);
  const zone = (a, b, c) => `<rect x="78" y="${Math.min(y(a), y(b))}" width="${W - 98}" height="${Math.abs(y(a) - y(b))}" rx="8" style="fill:var(${c});opacity:.16"/>`;
  const line = (v, label, c, below) => `<line x1="78" x2="${W - 20}" y1="${y(v)}" y2="${y(v)}" style="stroke:var(${c});stroke-width:2"/>` +
    `<text x="70" y="${y(v) + 4}" text-anchor="end" style="fill:var(--text);font-size:12px;font-weight:600">${num(v)}</text>` +
    `<text x="${W - 26}" y="${y(v) + (below ? 15 : -6)}" text-anchor="end" style="fill:var(${c});font-size:12px;font-weight:600">${label}</text>`;
  const longPos = stop < entry;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Schéma : stop, entrée et objectif">` +
    zone(entry, stop, "--down") + (target ? zone(entry, target, "--up") : "") +
    line(stop, "Stop", "--down", longPos) + line(entry, "Entrée", "--accent", false) + (target ? line(target, "Objectif", "--up", !longPos) : "") + `</svg>`;
}

function calcRisk() {
  const cap = +$("#r-cap").value, rp = +$("#r-risk").value;
  const entry = +$("#r-entry").value, stop = +$("#r-stop").value;
  const targetRaw = $("#r-target").value, target = targetRaw === "" ? null : +targetRaw;
  const out = $("#r-out"), warn = $("#r-warn"), msg = $("p", warn);
  const say = (text, bad) => { warn.classList.remove("hidden"); warn.classList.toggle("bad", !!bad); $(".k", warn).textContent = bad ? "À corriger" : "Attention"; msg.textContent = text; };
  warn.classList.add("hidden");
  if (!(cap > 0 && rp > 0 && entry > 0 && stop > 0) || entry === stop) {
    out.innerHTML = ""; $("#r-schema").innerHTML = "";
    say("Renseigne un capital, un risque, un prix d'entrée et un stop différent de l'entrée.", true);
    return;
  }
  const long = stop < entry;
  const riskEur = cap * rp / 100;
  const perShare = Math.abs(entry - stop);
  const qty = Math.floor(riskEur / perShare);
  const value = qty * entry;
  let rr = null;
  if (target != null && target > 0) rr = (long ? target > entry : target < entry) ? Math.abs(target - entry) / perShare : NaN;
  const cell = (k, v, c = "") => `<div class="stat ${c}"><span class="k">${k}</span><span class="v">${v}</span></div>`;
  out.innerHTML =
    cell("Sens", long ? "Achat (long)" : "Vente à découvert") +
    cell("Perte max. si stop touché", eur(riskEur), "is-down") +
    cell("Risque par titre", num(perShare)) +
    cell("Quantité à prendre", qty) +
    cell("Montant engagé", `${eur(value)} <span class="caption">(${num(100 * value / cap, 1)} %)</span>`) +
    (rr == null ? "" : cell("Ratio gain/risque", isNaN(rr) ? "incohérent" : "1 : " + num(rr, 2), !isNaN(rr) && rr >= 2 ? "is-up" : ""));
  $("#r-schema").innerHTML = riskSchema(entry, stop, target != null && !isNaN(rr) && rr != null ? target : null);
  if (qty < 1) say("Le stop est trop éloigné pour ce niveau de risque : la quantité calculée est 0.", true);
  else if (value > cap) say("Cette position dépasse ton capital : elle nécessiterait du levier. Rapproche le stop ou réduis le risque.");
  else if (rr != null && isNaN(rr)) say("L'objectif doit être du bon côté de l'entrée (au-dessus pour un achat, en dessous pour une vente).", true);
  else if (rr != null && rr < 2) say("Ratio gain/risque inférieur à 2 : ce trade est peu attractif en théorie.");
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
    const ret = sc.mu + sc.kappa * Math.log(base / p) + sc.sigma * gauss(r);
    let o = p;
    if (r() < 0.04) o = p * Math.exp(sc.sigma * 1.5 * gauss(r)); // gap occasionnel
    const c = o * Math.exp(ret);
    const w = Math.abs(sc.sigma * gauss(r)) * 0.7;
    out.push({ o, h: Math.max(o, c) * (1 + w * r()), l: Math.min(o, c) * (1 - w * r()), c });
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
const ind = { sma20: true, sma50: true, rsi: true };

function startSim() {
  let key = $("#sim-scenario").value;
  if (key === "mystery") { const keys = Object.keys(SCENARIOS); key = keys[Math.floor(Math.random() * keys.length)]; }
  const seed = Math.floor(Math.random() * 2 ** 31);
  const candles = genCandles(SCENARIOS[key], seed, WARMUP + PLAY);
  const closes = candles.map(c => c.c);
  sim = {
    key, candles, sma20: sma(closes, 20), sma50: sma(closes, 50), rsi: rsi(closes, 14),
    idx: WARMUP - 1, startIdx: WARMUP - 1,
    startCash: 10000, cash: 10000, shares: 0, avg: 0, stop: null, target: null,
    closed: [], fees: 0, equity: [10000], marks: [], usedStop: false, done: false, hover: null
  };
  $("#sim-setup").classList.add("hidden");
  $("#sim-result").classList.add("hidden");
  $("#sim-game").classList.remove("hidden");
  $("#journal").innerHTML = "";
  $("#stop").value = ""; $("#target").value = "";
  addLog("info", `Début de partie : ${eur(sim.startCash)} en liquidités.`);
  toast("Nouvelle partie. Observe le graphique, puis avance jour par jour.", "info");
  refresh();
  window.scrollTo(0, 0);
}

const price = () => sim.candles[sim.idx].c;
const equityNow = () => sim.cash + sim.shares * price();
const LOG_ICON = { buy: "up", sell: "down", stop: "stop", target: "flag", info: "info" };

function addLog(type, text, amount = "") {
  const row = el("div", "log " + type, `<span class="d">J${sim.idx - sim.startIdx}</span><span class="ic">${ic(LOG_ICON[type], 16, "ico")}</span><span class="t"></span><span class="amt"></span>`);
  $(".t", row).textContent = text;
  $(".amt", row).textContent = amount;
  $("#journal").prepend(row);
}

function buy(qty, px) {
  const cost = qty * px, fee = cost * FEE;
  sim.cash -= cost + fee; sim.fees += fee;
  sim.avg = (sim.avg * sim.shares + cost) / (sim.shares + qty);
  sim.shares += qty;
  sim.marks.push({ i: sim.idx, t: "buy" });
  addLog("buy", `Achat de ${qty} à ${num(px)} (frais ${num(fee)} €)`, "−" + eur(cost + fee).replace("-", ""));
}
function sell(qty, px, why = "Vente", type = "sell") {
  const proceeds = qty * px, fee = proceeds * FEE;
  const pnl = (px - sim.avg) * qty - fee - qty * sim.avg * FEE;
  sim.cash += proceeds - fee; sim.fees += fee; sim.shares -= qty;
  sim.closed.push({ pnl });
  sim.marks.push({ i: sim.idx, t: "sell" });
  addLog(type, `${why} de ${qty} à ${num(px)}`, (pnl >= 0 ? "+" : "−") + eur(Math.abs(pnl)));
  if (sim.shares === 0) { sim.avg = 0; sim.stop = sim.target = null; $("#stop").value = ""; $("#target").value = ""; }
}
const maxQty = () => Math.floor(sim.cash / (price() * (1 + FEE)));

function onBuy() {
  if (!sim || sim.done) return;
  const q = Math.floor(+$("#qty").value);
  if (!(q >= 1)) return toast("Quantité invalide.", "err");
  if (q > maxQty()) return toast(`Liquidités insuffisantes (max ${maxQty()} titres).`, "err");
  buy(q, price());
  toast(`Achat de ${q} titres exécuté.`, "ok");
  refresh();
}
function onSell(all) {
  if (!sim || sim.done) return;
  const q = all ? sim.shares : Math.floor(+$("#qty").value);
  if (!(q >= 1)) return toast(all ? "Tu ne détiens aucun titre." : "Quantité invalide.", "err");
  if (q > sim.shares) return toast(`Tu ne détiens que ${sim.shares} titres (pas de vente à découvert ici).`, "err");
  sell(q, price(), "Vente");
  toast(`Vente de ${q} titres exécutée.`, "ok");
  refresh();
}
function onLevels() {
  if (!sim || sim.done) return;
  if (!sim.shares) return toast("Ouvre d'abord une position pour lui associer un stop ou un objectif.", "err");
  const s = $("#stop").value === "" ? null : +$("#stop").value;
  const t = $("#target").value === "" ? null : +$("#target").value;
  if (s != null && s >= price()) return toast("Le stop doit être sous le prix actuel.", "err");
  if (t != null && t <= price()) return toast("L'objectif doit être au-dessus du prix actuel.", "err");
  sim.stop = s; sim.target = t;
  if (s != null) sim.usedStop = true;
  toast("Niveaux enregistrés. Ils sont vérifiés à chaque nouveau jour.", "ok");
  refresh();
}

function nextDay() {
  if (!sim || sim.done) return false;
  sim.idx++;
  const c = sim.candles[sim.idx];
  if (sim.shares > 0) {
    if (sim.stop != null && c.l <= sim.stop) {
      const px = Math.min(sim.stop, c.o);
      sell(sim.shares, px, "Stop-loss déclenché : vente", "stop");
      toast(`Stop-loss déclenché à ${num(px)}.`, "warn");
    } else if (sim.target != null && c.h >= sim.target) {
      const px = Math.max(sim.target, c.o);
      sell(sim.shares, px, "Objectif atteint : vente", "target");
      toast(`Objectif atteint à ${num(px)}.`, "ok");
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
  $("#btn-auto").textContent = "Pause";
  autoTimer = setInterval(() => { if (!nextDay()) stopAuto(); }, 350);
}
function stopAuto() { clearInterval(autoTimer); autoTimer = null; $("#btn-auto").textContent = "Auto"; }

function refresh() {
  if (!sim) return;
  const eq = equityNow();
  const perf = 100 * (eq / sim.startCash - 1);
  $("#st-day").textContent = `${sim.idx - sim.startIdx} / ${PLAY}`;
  $("#st-price").textContent = num(price());
  $("#st-cash").textContent = eur(sim.cash);
  $("#st-pos").textContent = sim.shares ? `${sim.shares} @ ${num(sim.avg)}` : "aucune";
  $("#st-equity").textContent = eur(eq);
  $("#st-perf").textContent = pct(perf);
  const sp = $("#stat-perf");
  sp.classList.toggle("is-up", perf >= 0.005); sp.classList.toggle("is-down", perf <= -0.005);
  drawChart();
}

function finish() {
  stopAuto();
  if (!sim || sim.done) return;
  if (sim.shares > 0) { sell(sim.shares, price(), "Clôture de fin de partie : vente"); sim.equity[sim.equity.length - 1] = equityNow(); }
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
  if (n > 0 && !sim.usedStop) tips.push("Tu n'as jamais utilisé de stop-loss. Définis ta perte maximale avant d'entrer (voir la leçon 7).");
  if (mdd > 15) tips.push(`Ton capital a connu une baisse maximale de ${num(mdd, 1)} %. Réduis la taille de tes positions pour mieux supporter les creux.`);
  if (n >= 3 && wins / n < 0.4 && ret > 0) tips.push("Peu de trades gagnants mais un résultat positif : tes gains sont plus gros que tes pertes, c'est le bon réflexe.");
  if (n >= 3 && wins / n >= 0.5 && ret < 0) tips.push("Tu as souvent raison mais tu perds de l'argent : tes pertes sont plus grandes que tes gains. Coupe plus vite les positions perdantes.");
  if (ret < bh - 3) tips.push(`Tu as fait moins bien qu'un simple « acheter et conserver » (${pct(bh)}). Sur un marché haussier, c'est souvent difficile à battre.`);
  if (ret > bh + 3) tips.push(`Tu as battu l'achat-conservation (${pct(bh)}). Rejoue d'autres scénarios pour vérifier que ce n'est pas dû à la chance.`);
  if (!tips.length) tips.push("Résultat sans point faible évident. Rejoue d'autres scénarios pour valider ta méthode.");
  const cell = (k, v, c = "") => `<div class="stat ${c}"><span class="k">${k}</span><span class="v">${v}</span></div>`;
  const box = $("#sim-result");
  box.classList.remove("hidden");
  box.innerHTML = `<h2 class="title-l">Fin de partie</h2>
    <p class="muted">Le scénario était : <strong>${SCENARIOS[sim.key].name}</strong>.</p>
    <div class="result-grid glass">
      ${cell("Capital final", eur(eq))}
      ${cell("Performance", pct(ret), ret >= 0 ? "is-up" : "is-down")}
      ${cell("Acheter &amp; conserver", pct(bh), bh >= 0 ? "is-up" : "is-down")}
      ${cell("Baisse max (drawdown)", num(mdd, 1) + " %")}
      ${cell("Trades clôturés", n + (n ? ` (${wins} gagnants)` : ""))}
      ${cell("Frais payés", eur(sim.fees))}
    </div>
    <div class="glass chart-card"><p class="caption">Évolution de ton capital</p><canvas id="equity" role="img" aria-label="Courbe d'évolution du capital"></canvas></div>
    <div class="keep"><span class="k">Ce que tu peux améliorer</span><ul class="tips">${tips.map(t => `<li>${t}</li>`).join("")}</ul></div>
    <div class="actions"><button class="btn btn-primary" id="sim-again" type="button">Rejouer</button></div>`;
  $("#sim-again").onclick = () => { $("#sim-game").classList.add("hidden"); box.classList.add("hidden"); $("#sim-setup").classList.remove("hidden"); sim = null; window.scrollTo(0, 0); };
  const best = store.get("simBest", null);
  if (best == null || ret > best) store.set("simBest", ret);
  drawEquity();
  box.scrollIntoView({ block: "start", behavior: "smooth" });
}

/* ---------- Canvas ---------- */
function setupCanvas(cv) {
  const dpr = window.devicePixelRatio || 1;
  const W = cv.clientWidth, H = cv.clientHeight;
  if (!W || !H) return null;
  cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  const g = cv.getContext("2d");
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, W, H);
  g.font = '500 11px "Inter", system-ui, sans-serif';
  return { g, W, H };
}

const visibleCount = () => ($("#chart").clientWidth < 560 ? 50 : 80);

function drawChart() {
  if (!sim || $("#sim-game").classList.contains("hidden")) return;
  const cv = $("#chart");
  const ctx = setupCanvas(cv);
  if (!ctx) return;
  const { g, W, H } = ctx;
  const C = { up: css("--up"), down: css("--down"), grid: css("--c-grid"), muted: css("--muted"), text: css("--text"), accent: css("--accent"), ink: css("--accent-ink"), s20: css("--c-sma20"), s50: css("--c-sma50"), rsi: css("--c-rsi") };

  const showRsi = ind.rsi;
  const padR = 58, padL = 6;
  const priceH = showRsi ? H * 0.72 : H - 18;
  const rsiTop = priceH + 16, rsiH = H - rsiTop - 6;

  const N = visibleCount();
  const end = sim.idx, start = Math.max(0, end - N + 1);
  const vis = sim.candles.slice(start, end + 1);
  const step = (W - padL - padR) / N;
  const xOf = i => padL + (i - start) * step + step / 2;

  let lo = Infinity, hi = -Infinity;
  const consider = v => { if (v != null) { lo = Math.min(lo, v); hi = Math.max(hi, v); } };
  vis.forEach(c => { consider(c.l); consider(c.h); });
  for (let i = start; i <= end; i++) { if (ind.sma20) consider(sim.sma20[i]); if (ind.sma50) consider(sim.sma50[i]); }
  if (sim.shares) { consider(sim.avg); consider(sim.stop); consider(sim.target); }
  const mg = (hi - lo) * 0.08 || 1; lo -= mg; hi += mg;
  const yOf = v => 12 + (hi - v) / (hi - lo) * (priceH - 24);

  // grille et axe des prix
  g.lineWidth = 1; g.textBaseline = "alphabetic";
  for (let k = 0; k <= 5; k++) {
    const v = lo + (hi - lo) * k / 5, y = yOf(v);
    g.strokeStyle = C.grid; g.beginPath(); g.moveTo(padL, y); g.lineTo(W - padR, y); g.stroke();
    g.fillStyle = C.muted; g.textAlign = "left"; g.fillText(num(v), W - padR + 6, y + 4);
  }

  // bougies : hausse = creuse, baisse = pleine
  const bw = Math.max(3, step * 0.62);
  vis.forEach((c, k) => {
    const i = start + k, x = Math.round(xOf(i)) + 0.5, up = c.c >= c.o;
    g.strokeStyle = g.fillStyle = up ? C.up : C.down;
    g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(x, yOf(c.h)); g.lineTo(x, yOf(c.l)); g.stroke();
    const y1 = yOf(Math.max(c.o, c.c)), y2 = yOf(Math.min(c.o, c.c)), hh = Math.max(1.5, y2 - y1);
    if (up) { g.lineWidth = 1.6; g.strokeRect(x - bw / 2, y1 + 0.8, bw, Math.max(1, hh - 1.6)); }
    else g.fillRect(x - bw / 2, y1, bw, hh);
  });
  g.lineWidth = 1;

  // moyennes mobiles
  const line = (arr, color) => {
    g.strokeStyle = color; g.lineWidth = 2; g.lineJoin = "round"; g.beginPath(); let on = false;
    for (let i = start; i <= end; i++) { if (arr[i] == null) continue; const x = xOf(i), y = yOf(arr[i]); on ? g.lineTo(x, y) : g.moveTo(x, y); on = true; }
    g.stroke(); g.lineWidth = 1;
  };
  if (ind.sma20) line(sim.sma20, C.s20);
  if (ind.sma50) line(sim.sma50, C.s50);

  // repères d'achat / vente
  sim.marks.forEach(m => {
    if (m.i < start || m.i > end) return;
    const c = sim.candles[m.i], x = xOf(m.i);
    g.fillStyle = m.t === "buy" ? C.up : C.down;
    g.beginPath();
    if (m.t === "buy") { const y = yOf(c.l) + 8; g.moveTo(x, y - 6); g.lineTo(x - 5, y + 3); g.lineTo(x + 5, y + 3); }
    else { const y = yOf(c.h) - 8; g.moveTo(x, y + 6); g.lineTo(x - 5, y - 3); g.lineTo(x + 5, y - 3); }
    g.closePath(); g.fill();
  });

  // niveaux de position
  const level = (v, color, label) => {
    if (v == null) return;
    const y = yOf(v);
    g.strokeStyle = color; g.lineWidth = 1.2; g.setLineDash([5, 4]); g.beginPath(); g.moveTo(padL, y); g.lineTo(W - padR, y); g.stroke(); g.setLineDash([]);
    g.fillStyle = color; g.textAlign = "left"; g.fillText(label, W - padR + 6, y - 4);
  };
  if (sim.shares) { level(sim.avg, C.text, "PRU"); level(sim.stop, C.down, "Stop"); level(sim.target, C.up, "Obj."); }

  // prix courant
  const cy = yOf(price());
  g.fillStyle = C.accent; g.beginPath(); g.roundRect(W - padR + 2, cy - 10, padR - 2, 20, 8); g.fill();
  g.fillStyle = C.ink; g.textAlign = "left"; g.font = '600 11px "Inter", system-ui, sans-serif'; g.fillText(num(price()), W - padR + 7, cy + 4);
  g.font = '500 11px "Inter", system-ui, sans-serif';

  // RSI
  if (showRsi) {
    const ry = v => rsiTop + (100 - v) / 100 * rsiH;
    g.fillStyle = C.rsi; g.textAlign = "left"; g.fillText("RSI 14", padL + 2, rsiTop - 4);
    [30, 50, 70].forEach(v => {
      g.strokeStyle = C.grid; g.beginPath(); g.moveTo(padL, ry(v)); g.lineTo(W - padR, ry(v)); g.stroke();
      g.fillStyle = C.muted; g.fillText(String(v), W - padR + 6, ry(v) + 4);
    });
    g.strokeStyle = C.rsi; g.lineWidth = 2; g.beginPath(); let on = false;
    for (let i = start; i <= end; i++) { const v = sim.rsi[i]; if (v == null) continue; const x = xOf(i), y = ry(v); on ? g.lineTo(x, y) : g.moveTo(x, y); on = true; }
    g.stroke(); g.lineWidth = 1;
  }

  // réticule
  if (sim.hover != null && sim.hover >= start && sim.hover <= end) {
    const x = xOf(sim.hover);
    g.strokeStyle = C.muted; g.globalAlpha = .6; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); g.setLineDash([]); g.globalAlpha = 1;
  }
}

function drawEquity() {
  const cv = $("#equity");
  if (!cv || !sim || !sim.done) return;
  const ctx = setupCanvas(cv);
  if (!ctx) return;
  const { g, W, H } = ctx;
  const accent = css("--accent"), grid = css("--c-grid"), muted = css("--muted");
  const eq = sim.equity, padR = 62, padT = 10, padB = 18;
  let lo = Math.min(...eq, sim.startCash), hi = Math.max(...eq, sim.startCash);
  const m = (hi - lo) * 0.1 || 50; lo -= m; hi += m;
  const x = i => 4 + i / (eq.length - 1) * (W - padR - 8), y = v => padT + (hi - v) / (hi - lo) * (H - padT - padB);
  g.strokeStyle = grid; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(0, y(sim.startCash)); g.lineTo(W - padR, y(sim.startCash)); g.stroke(); g.setLineDash([]);
  g.fillStyle = muted; g.fillText(eur(sim.startCash).replace(/ | /g, " "), W - padR + 6, y(sim.startCash) + 4);
  const path = () => { g.beginPath(); eq.forEach((v, i) => i ? g.lineTo(x(i), y(v)) : g.moveTo(x(i), y(v))); };
  const grad = g.createLinearGradient(0, 0, 0, H); grad.addColorStop(0, accent + "55"); grad.addColorStop(1, accent + "00");
  path(); g.lineTo(x(eq.length - 1), H - padB); g.lineTo(x(0), H - padB); g.closePath(); g.fillStyle = grad; g.fill();
  path(); g.strokeStyle = accent; g.lineWidth = 2.2; g.lineJoin = "round"; g.stroke();
  const last = eq[eq.length - 1];
  g.fillStyle = accent; g.beginPath(); g.arc(x(eq.length - 1), y(last), 4, 0, Math.PI * 2); g.fill();
  g.fillStyle = css("--text"); g.font = '600 11px "Inter", system-ui, sans-serif'; g.fillText(eur(last).replace(/ | /g, " "), W - padR + 6, y(last) + 4);
}

function onHover(e) {
  if (!sim) return;
  const cv = $("#chart"), rect = cv.getBoundingClientRect();
  const x = e.clientX - rect.left, padR = 58, padL = 6, N = visibleCount();
  const step = (rect.width - padL - padR) / N;
  const start = Math.max(0, sim.idx - N + 1);
  const i = start + Math.floor((x - padL) / step);
  if (i < start || i > sim.idx) clearHover();
  else {
    sim.hover = i; const c = sim.candles[i];
    $("#ohlc").textContent = `J${i - sim.startIdx} · O ${num(c.o)} · H ${num(c.h)} · B ${num(c.l)} · C ${num(c.c)}`;
    drawChart();
  }
}
function clearHover() { if (sim) { sim.hover = null; $("#ohlc").textContent = ""; drawChart(); } }

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

$$("[data-ind]").forEach(b => b.addEventListener("click", () => {
  const k = b.dataset.ind;
  ind[k] = !ind[k];
  b.classList.toggle("on", ind[k]);
  b.setAttribute("aria-pressed", String(ind[k]));
  drawChart();
}));
const chart = $("#chart");
chart.addEventListener("pointermove", onHover);
chart.addEventListener("pointerdown", onHover);
chart.addEventListener("pointerleave", e => { if (e.pointerType === "mouse") clearHover(); });
window.addEventListener("resize", () => { drawChart(); drawEquity(); });

/* ---------- Installation (PWA) ---------- */
let installEvt = null;
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEvt = e; $("#install-btn").classList.remove("hidden"); });
$("#install-btn").addEventListener("click", async () => {
  if (!installEvt) return;
  installEvt.prompt();
  await installEvt.userChoice.catch(() => {});
  installEvt = null; $("#install-btn").classList.add("hidden");
});
window.addEventListener("appinstalled", () => $("#install-btn").classList.add("hidden"));
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}

/* ---------- Initialisation ---------- */
renderLessons();
newQuiz();
renderGlossary();
calcRisk();
applyTheme();
route();
