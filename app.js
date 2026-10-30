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
  const meta = $("#meta-theme");
  if (meta) meta.setAttribute("content", css("--bg"));
  $$(".theme-btn").forEach(b => {
    b.innerHTML = ic(t === "dark" ? "sun" : "moon") + (t === "dark" ? "Thème clair" : "Thème sombre");
    b.setAttribute("aria-label", t === "dark" ? "Passer au thème clair" : "Passer au thème sombre");
  });
  if (typeof drawChart === "function") { drawChart(); drawEquity(); }
}
$$(".theme-btn").forEach(b => b.addEventListener("click", () => { store.set("theme", resolveTheme() === "dark" ? "light" : "dark"); applyTheme(); }));
mq.addEventListener("change", () => { if (!store.get("theme", null)) applyTheme(); });

/* ---------- Navigation ---------- */
const TABS = ["home", "adventure", "learn", "sim", "review", "tools"];
const ALIAS = { quiz: "review", risk: "tools", compound: "tools", gloss: "tools", resources: "tools" };
const TOOL_OF = { risk: "calc", compound: "compound", gloss: "gloss", resources: "res" };   // adresse -> outil
const HASH_OF = { calc: "risk", compound: "compound", gloss: "gloss", res: "resources" };   // outil -> adresse
const TOOL_TITLE = { risk: "Calculateur", compound: "Intérêts composés", gloss: "Glossaire", resources: "Ressources" };
let reviewBusy = false;
function route() {
  const h = location.hash.slice(1) || "home";
  if (TOOL_OF[h]) setTool(TOOL_OF[h]);
  let t = ALIAS[h] || h;
  if (!TABS.includes(t)) t = "home";
  const cur = h === "review" ? "quiz" : h;   // nom affiché dans l'adresse
  $$(".tab").forEach(x => x.classList.toggle("active", x.id === "tab-" + t));
  $$("[data-tab]").forEach(a => {
    // barre latérale : on compare l'adresse exacte ; barre d'onglets : on compare l'écran
    const on = a.classList.contains("nav-link") ? a.dataset.hash === cur : a.dataset.tab === t;
    a.classList.toggle("is-active", on);
    if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  });
  document.title = (TOOL_TITLE[h] || $("#tab-" + t).dataset.title) + " – TrendScout";
  window.scrollTo(0, 0);
  clearTimeout(toastTimer); $$(".toast", $("#toast-zone")).forEach(x => x.remove());
  if (t === "home") renderHome();
  if (t === "learn" && $("#step-view").classList.contains("hidden")) renderPath();
  if (t === "review" && !reviewBusy) renderReview();
  if (t === "adventure" && $("#adv-scene").classList.contains("hidden")) renderAdventure();
  if (t === "sim") { drawChart(); drawEquity(); }
  updateNavBadges();
}
window.addEventListener("hashchange", route);

function setTool(k) {
  $$("[data-tool]").forEach(b => { const on = b.dataset.tool === k; b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); });
  ["calc", "compound", "gloss", "res"].forEach(n => $("#tool-" + n).classList.toggle("hidden", n !== k));
  if (k === "res") renderResources();
  if (k === "compound") calcCompound();
}
// Sur mobile, la bascule change aussi l'adresse (pour que la page affichée corresponde au lien).
$$("[data-tool]").forEach(b => b.addEventListener("click", () => { location.hash = HASH_OF[b.dataset.tool]; }));

// Petits repères dans la navigation : leçons validées et partie en cours.
function updateNavBadges() {
  const lessons = STEPS.filter(s => s.kind === "lesson");
  $("#nav-learn-count").textContent = `${lessons.filter(stepDone).length}/${lessons.length}`;
  $("#nav-sim-dot").classList.toggle("hidden", !(typeof sim !== "undefined" && sim && !sim.done));
}

// Le design compact (boutons 42 px, cartes resserrées) s'active sur la mise en page mobile.
const mobileMq = matchMedia("(max-width: 899px)");
const syncMobileRoot = () => $("#app").classList.toggle("m-root", mobileMq.matches);
mobileMq.addEventListener("change", () => { syncMobileRoot(); drawChart(); drawEquity(); });

/* ---------- Toast ---------- */
let toastTimer = null;
function toast(text, kind = "info") {
  const z = $("#toast-zone");
  $$(".toast", z).forEach(x => x.remove());   // les récompenses du jeu restent affichées
  const t = el("div", "toast " + kind);
  t.innerHTML = `<span class="ic">${ic(kind === "ok" ? "check" : kind === "err" ? "x" : kind === "warn" ? "warn" : "info", 16, "ico")}</span><span></span>`;
  t.lastChild.textContent = text;
  z.appendChild(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { z.innerHTML = ""; }, 3800);
}

/* ---------- Quiz avec correction en direct ---------- */
// Chaque question s'affiche seule : dès que tu réponds, tu vois si c'est juste et l'explication.
let qzSeq = 0;
function prepQuestions(qs) {
  return qs.map(q => { const idx = shuffle(q.o.map((_, i) => i)); return { id: q.id, q: q.q, o: idx.map(i => q.o[i]), a: idx.indexOf(q.a), e: q.e }; });
}
function noteResult(id, ok) {
  const m = new Set(store.get("missed", []));
  if (ok) m.delete(id); else m.add(id);
  store.set("missed", [...m]);
}
function addBtn(parent, cls, label, fn) { const b = el("button", cls, label); b.type = "button"; b.addEventListener("click", fn); parent.appendChild(b); return b; }

function runQuiz(host, questions, onFinish) {
  const qs = prepQuestions(questions);
  const uid = "qz-title-" + (++qzSeq);
  let i = 0, score = 0;
  const missed = [];

  function show() {
    const q = qs[i];
    host.innerHTML = "";
    const head = el("div", "qz-head", `<span class="caption">Question ${i + 1} sur ${qs.length}</span><div class="bar"><span style="width:${100 * i / qs.length}%"></span></div>`);
    const title = el("p", "q-title"); title.id = uid; title.tabIndex = -1; title.textContent = q.q;
    const opts = el("div", "opts"); opts.setAttribute("role", "group"); opts.setAttribute("aria-labelledby", uid);
    const fb = el("div", "qz-fb"); fb.setAttribute("aria-live", "polite");
    let answered = false;
    const btns = q.o.map((text, oi) => {
      const b = el("button", "opt", `<span class="dot"></span><span class="txt"></span><span class="tag"></span>`);
      b.type = "button"; $(".txt", b).textContent = text;
      b.addEventListener("click", () => answer(oi));
      opts.appendChild(b);
      return b;
    });

    function answer(oi) {
      if (answered) return;
      answered = true;
      const ok = oi === q.a;
      btns.forEach((b, k) => {
        b.classList.add("is-disabled"); b.setAttribute("aria-disabled", "true");
        if (k === q.a) { b.classList.add("is-correct"); $(".tag", b).innerHTML = ic("check", 16) + "Bonne réponse"; }
        else if (k === oi) { b.classList.add("is-wrong"); $(".tag", b).innerHTML = ic("x", 16) + "Ta réponse"; }
      });
      if (ok) score++; else missed.push(q);
      noteResult(q.id, ok);
      const gained = ok ? Game.awardQuestion(q.id) : (Game.touchDay(), 0);
      fb.className = "qz-fb";
      fb.innerHTML = "";
      const row = Game.line("malik", ok ? "content" : "encourageant", (ok ? "" : `La bonne réponse : ${q.o[q.a]}. `) + q.e, { label: ok ? "Bien joué" : "Pas tout à fait" });
      const foot = el("div", "bub-foot");
      if (gained) foot.appendChild(el("span", "g-xp-pill", `+${gained} XP`));
      const nb = addBtn(foot, "btn btn-primary", i < qs.length - 1 ? "Question suivante →" : "Voir mon résultat", () => { i++; if (i < qs.length) show(); else finish(); });
      $(".g-bubble", row).appendChild(foot);
      fb.appendChild(row);
      nb.focus({ preventScroll: true });
      fb.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    host.append(head, title, opts, fb);
    if (i > 0) host.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function finish() {
    host.innerHTML = "";
    const sum = el("div", "qz-sum", `<p class="score">${score} / ${qs.length}</p><div class="bar"><span style="width:${100 * score / qs.length}%"></span></div>`);
    host.appendChild(sum);
    if (missed.length) {
      const l = el("div", "qz-missed", `<h4>À revoir</h4><ul></ul>`);
      missed.forEach(q => {
        const li = el("li", "", `<strong></strong><span class="caption"></span>`);
        $("strong", li).textContent = q.q; $(".caption", li).textContent = "Bonne réponse : " + q.o[q.a];
        $("ul", l).appendChild(li);
      });
      host.appendChild(l);
    }
    onFinish(score, qs.length, host);
  }
  show();
}

/* ---------- Accueil de l'application ---------- */
function renderHome() {
  const done = STEPS.filter(stepDone).length;
  const lessons = STEPS.filter(s => s.kind === "lesson");
  const nx = STEPS.find(s => !stepDone(s));
  const g = Game.greeting(nx && stepTitle(nx), done);
  $("#home-kicker").textContent = nx
    ? `Niveau ${nx.mi + 1} · ${nx.mod.title} · ${lessons.filter(stepDone).length} leçons sur ${lessons.length}`
    : "Parcours terminé";
  $("#home-title").textContent = done ? "Reprends où tu en étais." : "Bienvenue. On commence ?";
  $("#resume-av").innerHTML = avatar("malik", done ? "encourageant" : "content", 64);
  $("#resume-badge").textContent = nx ? (done ? "Prochaine étape" : "On commence ici") : "Bravo";
  const btn = $("#resume-btn");
  if (nx) {
    const isLesson = nx.kind === "lesson";
    $("#resume-title").textContent = isLesson ? `Leçon ${lessonNo(nx.id)} · ${stepTitle(nx)}` : stepTitle(nx);
    $("#resume-desc").textContent = isLesson
      ? `Environ ${readMin(LESSON[nx.id].html)} minutes de lecture, puis ${LESSON[nx.id].quiz.length} questions corrigées en direct.`
      : `${nx.mod.exam.length} questions pour valider le niveau ${nx.mi + 1}.`;
    const steps = STEPS.filter(s => s.mod === nx.mod);
    $("#resume-bar").style.width = Math.round(100 * steps.filter(stepDone).length / steps.length) + "%";
    btn.textContent = done ? "Reprendre" : "Commencer";
    btn.onclick = () => openStep(nx);
  } else {
    $("#resume-title").textContent = "Tu as terminé tout le parcours";
    $("#resume-desc").textContent = g.text;
    $("#resume-bar").style.width = "100%";
    btn.textContent = "Revoir la première leçon";
    btn.onclick = () => openStep(STEPS[0]);
  }
}

/* ---------- Parcours ---------- */
const PASS_RATIO = 0.65; // environ deux tiers de bonnes réponses
const needed = total => Math.ceil(PASS_RATIO * total - 1e-9);
const passes = (s, t) => s >= needed(t);

const LESSON = Object.fromEntries(LESSONS.map(l => [l.id, l]));
LESSONS.forEach(l => { l.title = l.title.replace(/^\d+\.\s*/, ""); l.quiz.forEach((q, i) => { q.id = l.id + "-" + i; }); });
MODULES.forEach(m => m.exam.forEach((q, i) => { q.id = m.id + "-ex-" + i; }));
const ALL_Q = [...LESSONS.flatMap(l => l.quiz), ...MODULES.flatMap(m => m.exam)];

// Les étapes, dans l'ordre du parcours : leçons du niveau puis examen.
const STEPS = [];
MODULES.forEach((m, mi) => {
  m.lessons.forEach(id => STEPS.push({ kind: "lesson", id, mod: m, mi }));
  STEPS.push({ kind: "exam", id: m.id, mod: m, mi });
});
const lessonNo = id => STEPS.filter(s => s.kind === "lesson").findIndex(s => s.id === id) + 1;
const stepTitle = s => s.kind === "lesson" ? LESSON[s.id].title : `Examen du niveau ${s.mi + 1}`;
const stepKey = s => s.kind + ":" + s.id;
const questionsOf = s => s.kind === "lesson" ? LESSON[s.id].quiz : s.mod.exam;
const readMin = html => Math.max(2, Math.round(html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 170));

const stepResult = s => (s.kind === "lesson" ? store.get("lessons", {}) : store.get("exams", {}))[s.id];
const stepSkipped = s => !!store.get("skipped", {})[stepKey(s)];
const stepDone = s => !!stepResult(s) || stepSkipped(s);
// "done" : terminée · "open" : à faire · "locked" : l'étape précédente n'est pas terminée
function stepStatus(s) {
  if (stepDone(s)) return "done";
  const i = STEPS.indexOf(s);
  return i === 0 || stepDone(STEPS[i - 1]) ? "open" : "locked";
}

function renderPath() {
  const done = STEPS.filter(stepDone).length, total = STEPS.length, p = Math.round(100 * done / total);
  $("#learn-bar").style.width = p + "%";
  $("#learn-barwrap").setAttribute("aria-valuenow", p);
  $("#learn-progress").textContent = `${done} / ${total} étapes validées`;
  const box = $("#modules");
  box.innerHTML = "";
  MODULES.forEach((m, mi) => {
    const steps = STEPS.filter(s => s.mod === m);
    const d = steps.filter(stepDone).length;
    const validated = stepDone(steps[steps.length - 1]);
    const sec = el("section", "glass module",
      `<header class="mod-head">
        <div class="mod-top"><span class="pill">Niveau ${mi + 1}</span>${validated ? `<span class="badge ok">${ic("award", 14)}Niveau validé</span>` : ""}</div>
        <h3 class="title-m"></h3><p class="muted goal"></p>
        <div class="mod-prog"><div class="bar"><span style="width:${100 * d / steps.length}%"></span></div><span class="caption">${d} / ${steps.length}</span></div>
      </header><ol class="steps"></ol>`);
    $(".title-m", sec).textContent = m.title;
    $(".goal", sec).textContent = m.goal;
    steps.forEach(s => $(".steps", sec).appendChild(stepRow(s)));
    box.appendChild(sec);
  });
}

function stepRow(s) {
  const st = stepStatus(s), li = el("li", "step-row " + st);
  const isLesson = s.kind === "lesson", res = stepResult(s), skipped = stepSkipped(s) && !res;
  const meta = isLesson
    ? `Leçon ${lessonNo(s.id)} · ≈ ${readMin(LESSON[s.id].html)} min · ${LESSON[s.id].quiz.length} questions`
    : `Examen · ${s.mod.exam.length} questions`;
  const state = st === "done" ? (skipped ? "Passée" : `Validée ${res.score}/${res.total}`) : st === "open" ? "À faire" : "Verrouillée";
  const main = el("button", "step-main",
    `<span class="step-ic ${st}">${ic(st === "done" ? "check" : st === "open" ? "play" : "lock", 16, "ico")}</span>` +
    `<span class="step-txt"><strong></strong><span class="caption"></span></span><span class="badge ${st === "done" ? "ok" : st === "open" ? "accent" : ""}"></span>`);
  main.type = "button";
  $("strong", main).textContent = stepTitle(s);
  $(".caption", main).textContent = st === "locked" ? "Termine l'étape précédente pour la débloquer" : meta;
  $(".badge", main).textContent = state;
  if (st === "locked") main.disabled = true; else main.addEventListener("click", () => openStep(s));
  li.appendChild(main);
  if (st === "open") {
    addBtn(li, "btn btn-plain btn-sm skip", isLesson ? "Je connais déjà" : "Je connais ce niveau", () => {
      const o = store.get("skipped", {}); o[stepKey(s)] = true; store.set("skipped", o);
      toast("Étape passée.", "info");
      renderPath();
    });
  }
  return li;
}

function openStep(s) {
  if (stepStatus(s) === "locked") return;
  if (location.hash !== "#learn") { history.replaceState(null, "", "#learn"); route(); }
  const isLesson = s.kind === "lesson", qs = questionsOf(s);
  $("#path-view").classList.add("hidden");
  const view = $("#step-view");
  view.classList.remove("hidden");
  view.innerHTML = `<button class="btn btn-plain btn-sm" id="step-back" type="button">← Retour au parcours</button>
    <div class="step-kicker"><span class="pill">Niveau ${s.mi + 1} · ${isLesson ? "Leçon " + lessonNo(s.id) : "Examen"}</span></div>
    <h2 class="title-l"></h2>` +
    (isLesson
      ? `<p class="caption">≈ ${readMin(LESSON[s.id].html)} min de lecture · ${qs.length} questions</p><div class="prose">${LESSON[s.id].html}</div><div class="divider"></div>
         <h3 class="title-m">Vérifie tes connaissances</h3><p class="muted">Tu vois la bonne réponse et l'explication dès que tu réponds.</p>`
      : `<p class="muted">${qs.length} questions sur ce niveau, jamais vues dans les leçons. Il faut au moins ${needed(qs.length)} bonnes réponses pour valider. Tu vois la correction après chaque réponse.</p>`) +
    `<div id="quiz-host"></div>`;
  $("h2", view).textContent = isLesson ? LESSON[s.id].title : `Examen : niveau ${s.mi + 1}, ${s.mod.title}`;
  $("#step-back").onclick = closeStep;
  runQuiz($("#quiz-host"), isLesson ? qs : shuffle(qs), (score, total, host) => finishStep(s, score, total, host));
  window.scrollTo(0, 0);
}

function finishStep(s, score, total, host) {
  const ok = passes(score, total), isLesson = s.kind === "lesson";
  let gain = 0;
  if (ok) {
    const key = isLesson ? "lessons" : "exams", o = store.get(key, {}), prev = o[s.id];
    if (!prev || score > prev.score) o[s.id] = { score, total };
    store.set(key, o);
    if (!prev) gain = Game.stepValidated(isLesson);
    else Game.checkBadges();
  } else Game.touchDay();
  const next = STEPS[STEPS.indexOf(s) + 1];
  const text = ok
    ? `${score} / ${total} bonnes réponses. ${isLesson ? "Tu peux passer à la suite." : "Bravo, tu as terminé ce niveau."}`
    : `${score} / ${total}. Il faut au moins ${needed(total)} bonnes réponses. ${isLesson ? "Relis la leçon puis réessaie." : "Relis les leçons de ce niveau puis réessaie."}`;
  const label = ok ? (isLesson ? "Leçon validée" : "Niveau " + (s.mi + 1) + " validé") : "Pas encore";
  const res = Game.line("malik", ok ? (score === total ? "fier" : "content") : "encourageant", text, { label });
  res.setAttribute("role", "status");
  const foot = el("div", "bub-foot");
  if (gain) foot.appendChild(el("span", "g-xp-pill", `+${gain} XP`));
  if (ok) {
    if (next) addBtn(foot, "btn btn-primary", `Suite : ${stepTitle(next)} →`, () => openStep(next));
    addBtn(foot, next ? "btn btn-plain" : "btn btn-primary", "Retour au parcours", closeStep);
  } else {
    addBtn(foot, "btn btn-primary", "Réessayer", () => openStep(s));
    addBtn(foot, "btn btn-plain", "Retour au parcours", closeStep);
  }
  $(".g-bubble", res).appendChild(foot);
  host.appendChild(res);
  res.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

function closeStep() {
  $("#step-view").classList.add("hidden");
  $("#path-view").classList.remove("hidden");
  renderPath();
  window.scrollTo(0, 0);
}

/* ---------- Révisions ---------- */
function reviewPool() { const out = []; STEPS.forEach(s => { if (stepDone(s)) out.push(...questionsOf(s)); }); return out; }

function renderReview() {
  const box = $("#review-box"), pool = reviewPool();
  const missedIds = store.get("missed", []), missedQs = ALL_Q.filter(q => missedIds.includes(q.id));
  const best = store.get("reviewBest", null);
  box.innerHTML = `<h2 class="title-l">Quiz</h2>`;
  if (!pool.length) {
    const k = el("div", "keep", `<span class="k">Bientôt disponible</span><p>Valide ta première leçon pour débloquer le quiz de révision : tu pourras rejouer des questions au hasard et retravailler tes erreurs.</p><div class="actions"></div>`);
    const a = el("a", "btn btn-primary", "Aller au parcours"); a.href = "#learn";
    $(".actions", k).appendChild(a);
    box.appendChild(k);
    return;
  }
  box.appendChild(el("p", "muted", "Tu vois la bonne réponse et l'explication dès que tu réponds. Les questions portent uniquement sur ce que tu as déjà étudié."));
  const modes = el("div", "rev-modes");
  const n = Math.min(10, pool.length);
  const c1 = el("button", "glass rev-card", `<span class="title-m">Quiz de révision</span><span class="caption">${n} questions au hasard${best != null ? ` · meilleur score : ${best} %` : ""}</span>`);
  c1.type = "button"; c1.addEventListener("click", () => startReview(shuffle(pool).slice(0, n), "random"));
  const c2 = el("button", "glass rev-card", `<span class="title-m">Revoir mes erreurs</span><span class="caption">${missedQs.length ? missedQs.length + " question" + (missedQs.length > 1 ? "s" : "") + " à retravailler" : "Aucune erreur à revoir pour le moment"}</span>`);
  c2.type = "button"; c2.disabled = !missedQs.length;
  c2.addEventListener("click", () => startReview(shuffle(missedQs).slice(0, 10), "errors"));
  modes.append(c1, c2);
  box.appendChild(modes);
}

function startReview(qs, kind) {
  reviewBusy = true;
  const box = $("#review-box");
  box.innerHTML = `<button class="btn btn-plain btn-sm" id="rev-back" type="button">← Quiz</button><h2 class="title-l"></h2><div id="rev-host"></div>`;
  $("h2", box).textContent = kind === "errors" ? "Revoir mes erreurs" : "Quiz de révision";
  $("#rev-back").onclick = () => { reviewBusy = false; renderReview(); };
  runQuiz($("#rev-host"), qs, (score, total, host) => {
    const p = Math.round(100 * score / total);
    if (kind === "random") { const b = store.get("reviewBest", null); if (b == null || p > b) store.set("reviewBest", p); }
    const res = el("div", p >= 65 ? "keep" : "keep warn", `<span class="k">Résultat</span><p>${score} / ${total}. ${p >= 65 ? "Très bien, tu maîtrises ces notions." : "Continue à t'entraîner : relis les leçons concernées puis réessaie."}</p><div class="actions"></div>`);
    res.setAttribute("role", "status");
    const acts = $(".actions", res);
    addBtn(acts, "btn btn-primary", "Rejouer", () => { reviewBusy = false; renderReview(); });
    host.appendChild(res);
    res.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });
}


/* ---------- Intérêts composés ---------- */
const eur0 = n => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
// Simule mois par mois : versements en fin de mois, taux annuel net converti en taux mensuel équivalent.
function simulateCompound(v0, pmt, netRate, years) {
  const m = Math.pow(1 + netRate, 1 / 12) - 1, pts = [{ y: 0, v: v0, c: v0, s: v0 }];
  let bal = v0, paid = v0;
  for (let k = 1; k <= years * 12; k++) {
    bal = bal * (1 + m) + pmt; paid += pmt;
    if (k % 12 === 0) {
      // intérêts simples : seul le capital et chaque versement rapportent, sans réinvestissement
      const simple = v0 * (1 + netRate * k / 12) + pmt * (k + netRate * k * (k - 1) / 24);
      pts.push({ y: k / 12, v: bal, c: paid, s: simple });
    }
  }
  return pts;
}

function compoundChart(pts) {
  const W = 360, H = 190, L = 8, R = 8, T = 10, B = 24, maxV = Math.max(...pts.map(p => Math.max(p.v, p.s, p.c))) || 1;
  const x = y => L + (W - L - R) * y / pts[pts.length - 1].y, yy = v => T + (H - T - B) * (1 - v / maxV);
  const path = key => pts.map((p, i) => (i ? "L" : "M") + x(p.y).toFixed(1) + " " + yy(p[key]).toFixed(1)).join(" ");
  const area = "M" + pts.map(p => x(p.y).toFixed(1) + " " + yy(p.v).toFixed(1)).join(" L") + " L" + pts.map(p => x(p.y).toFixed(1) + " " + yy(p.c).toFixed(1)).reverse().join(" L") + " Z";
  const last = pts[pts.length - 1];
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Courbes sur ${last.y} ans : total versé ${eur0(last.c)}, intérêts simples ${eur0(last.s)}, intérêts composés ${eur0(last.v)}">
    <path d="${area}" style="fill:var(--accent);opacity:.12"/>
    <line x1="${L}" x2="${W - R}" y1="${H - B}" y2="${H - B}" style="stroke:var(--c-grid);stroke-width:1"/>
    <path d="${path("c")}" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-dasharray:5 4"/>
    <path d="${path("s")}" style="fill:none;stroke:var(--c-sma20);stroke-width:2.2"/>
    <path d="${path("v")}" style="fill:none;stroke:var(--accent);stroke-width:2.6"/>
    <text x="${L}" y="${H - 6}" style="fill:var(--muted);font-size:11px">0</text>
    <text x="${W - R}" y="${H - 6}" text-anchor="end" style="fill:var(--muted);font-size:11px">${last.y} ans</text>
    <text x="${W - R}" y="${T + 11}" text-anchor="end" style="fill:var(--accent);font-size:12px;font-weight:700">${eur0(last.v)}</text></svg>`;
}

function calcCompound() {
  const v0 = +$("#c-init").value, pmt = +$("#c-pmt").value, rate = +$("#c-rate").value / 100, fees = +$("#c-fees").value / 100, years = Math.floor(+$("#c-years").value);
  const out = $("#c-out"), warn = $("#c-warn");
  const bad = !(v0 >= 0 && pmt >= 0 && fees >= 0 && rate > -0.5 && rate < 0.5 && years >= 1 && years <= 60) || (v0 === 0 && pmt === 0);
  warn.classList.toggle("hidden", !bad);
  if (bad) {
    $("p", warn).textContent = "Renseigne des montants positifs, un taux entre −50 % et 50 %, et une durée de 1 à 60 ans.";
    out.innerHTML = ""; $("#c-chart").innerHTML = ""; return;
  }
  const net = rate - fees;
  const pts = simulateCompound(v0, pmt, net, years), last = pts[pts.length - 1];
  const noFees = simulateCompound(v0, pmt, rate, years)[years].v;
  const cell = (k, v, c = "") => `<div class="stat ${c}"><span class="k">${k}</span><span class="v">${v}</span></div>`;
  out.innerHTML =
    cell("Total versé", eur0(last.c)) +
    cell("Valeur avec intérêts composés", eur0(last.v)) +
    cell("Intérêts gagnés", eur0(last.v - last.c), last.v >= last.c ? "is-up" : "is-down") +
    cell("Valeur avec intérêts simples", eur0(last.s)) +
    cell("Écart dû à la composition", eur0(last.v - last.s)) +
    cell("Ce que les frais ont coûté", eur0(noFees - last.v), fees > 0 ? "is-down" : "");
  $("#c-chart").innerHTML = compoundChart(pts);
}
$$("#tool-compound input").forEach(i => i.addEventListener("input", calcCompound));

/* ---------- Ressources et feuille de route ---------- */
function renderResources() {
  const rm = $("#roadmap");
  if (rm.childElementCount) return;   // déjà affiché
  ROADMAP.forEach(r => {
    const li = el("li", "rm-item", `<span class="rm-n"></span><div class="rm-txt"><strong></strong><p></p><span class="caption"></span></div>`);
    $(".rm-n", li).textContent = r.n; $("strong", li).textContent = r.title; $("p", li).textContent = r.txt; $(".caption", li).textContent = "Dans TrendScout : " + r.where;
    rm.appendChild(li);
  });
  const box = $("#res-list");
  RESOURCES.forEach(g => {
    const sec = el("section", "res-group", `<h3 class="title-m"></h3><div class="res-grid"></div>`);
    $("h3", sec).textContent = g.group;
    g.items.forEach(it => {
      const card = el("article", "res-card", `<strong class="res-t"></strong><span class="caption res-org"></span><p class="res-what"></p>`);
      $(".res-t", card).textContent = it.title; $(".res-org", card).textContent = it.org; $(".res-what", card).textContent = it.what;
      if (it.url) {
        const a = el("a", "link res-link"); a.href = it.url; a.target = "_blank"; a.rel = "noopener noreferrer";
        a.textContent = `Ouvrir ${it.site} ↗`; a.setAttribute("aria-label", `Ouvrir ${it.site} (nouvel onglet)`);
        card.appendChild(a);
      }
      $(".res-grid", sec).appendChild(card);
    });
    box.appendChild(sec);
  });
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
$$("#tool-calc input").forEach(i => i.addEventListener("input", calcRisk));

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
  $("#stop").value = ""; $("#target").value = ""; coachKey = "";
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
  if (s != null) { sim.usedStop = true; Game.event("stop"); }
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
  coachSim();
  updateNavBadges();
  drawChart();
}

function finish() {
  stopAuto();
  if (!sim || sim.done) return;
  if (sim.shares > 0) { sell(sim.shares, price(), "Clôture de fin de partie : vente"); sim.equity[sim.equity.length - 1] = equityNow(); }
  sim.done = true;
  refresh();
  updateNavBadges();
  showResult();
  Game.event("game");
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
  if (n > 0 && !sim.usedStop) tips.push("Tu n'as jamais utilisé de stop-loss. Définis ta perte maximale avant d'entrer (voir la leçon « Gestion du risque »).");
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


// Le mentor commente la partie : conseil contextuel, jamais un jugement sur les gains.
let coachKey = "";
function coachSim() {
  const box = $("#sim-coach");
  let m = null;
  if (!sim || sim.done) m = null;
  else if (sim.shares && sim.stop == null) m = { k: "nostop", expr: "inquiet", text: "Tu as une position sans stop-loss. Pose-en un : tu sauras exactement combien tu peux perdre au maximum." };
  else if (sim.shares && sim.stop != null) {
    const risk = Math.max(0, (sim.avg - sim.stop) * sim.shares), share = 100 * risk / equityNow();
    m = share > 2
      ? { k: "big" + Math.round(share), expr: "inquiet", text: `Si ton stop est touché, tu perds environ ${eur(risk)}, soit ${num(share, 1)} % de ton capital. La règle courante est de rester sous 2 %.` }
      : { k: "ok" + Math.round(risk), expr: "content", text: `Bien vu : si ton stop est touché, tu perds environ ${eur(risk)} (${num(share, 1)} % de ton capital).` };
  } else if (sim.idx === sim.startIdx && !sim.closed.length) m = { k: "start", expr: "neutre", text: "Observe d'abord le graphique : tendance, moyennes, RSI. Tu peux avancer de quelques jours avant d'acheter." };
  const key = m ? m.k : "";
  if (key === coachKey) return;
  coachKey = key;
  box.replaceChildren();
  if (m) box.appendChild(Game.line("malik", m.expr, m.text, { label: "Conseil" }));
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
