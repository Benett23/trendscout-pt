"use strict";

/* Couche « jeu » : XP, rang, série, badges, mentor, scènes de dialogue, page Aventure.
   Principe : on récompense la méthode (plan, stop, patience, esprit critique), jamais les gains. */

const charSrc = (who, expr) => (window.ASSET_DATA && ASSET_DATA[who + "-" + expr]) || `assets/personnages/${who}-${expr}.svg`;
const avatar = (who, expr, size = 48) => `<img class="g-av g-av-${size}" src="${charSrc(who, expr)}" alt="" width="${size}" height="${size}" decoding="async">`;

const Game = (() => {
  const XP_QUESTION = 5, XP_LESSON = 20, XP_EXAM = 60;
  const fmtDay = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");

  // Reprise des anciens progrès : les leçons et examens déjà validés comptent comme de l'XP.
  if (store.get("xp", null) === null) {
    store.set("xp", XP_LESSON * Object.keys(store.get("lessons", {})).length + XP_EXAM * Object.keys(store.get("exams", {})).length);
  }

  const xp = () => store.get("xp", 0);
  const rankOf = v => RANKS.reduce((r, k, i) => (v >= k.xp ? i : r), 0);

  /* ---- Récompenses (toasts sobres, sans confettis) ---- */
  function reward(text, opts = {}) {
    const z = $("#reward-zone");
    const t = el("div", "g-reward");
    t.setAttribute("role", "status");
    t.innerHTML = (opts.icon ? `<span class="g-mini">${ic(opts.icon, 18, "ico")}</span>` : avatar("malik", opts.expr || "content", 40)) + "<span></span>";
    t.lastChild.textContent = text;
    z.appendChild(t);
    setTimeout(() => t.remove(), 5200);
  }

  function addXp(n) {
    if (!n) return;
    const before = rankOf(xp());
    store.set("xp", xp() + n);
    const after = rankOf(xp());
    if (after > before) reward(`Nouveau rang : ${RANKS[after].n} !`, { expr: "fier" });
  }

  /* ---- Série de jours ---- */
  function touchDay() {
    const d = fmtDay(new Date()), days = store.get("days", []);
    if (!days.includes(d)) { days.push(d); store.set("days", days.slice(-60)); checkBadges(); }
  }
  function streak() {
    const set = new Set(store.get("days", []));
    const d = new Date();
    if (!set.has(fmtDay(d))) d.setDate(d.getDate() - 1);
    let n = 0;
    while (set.has(fmtDay(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function week() {
    const set = new Set(store.get("days", [])), out = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      out.push({ label: ["D", "L", "M", "M", "J", "V", "S"][d.getDay()], on: set.has(fmtDay(d)), today: i === 0 });
    }
    return out;
  }

  /* ---- Événements ponctuels du simulateur ---- */
  function event(name) {
    const f = store.get("flags", {});
    if (f[name]) return;
    f[name] = true; store.set("flags", f);
    const gain = { stop: 15, game: 25 }[name] || 0;
    if (gain) {
      addXp(gain);
      reward(name === "stop" ? `Premier stop-loss posé : +${gain} XP` : `Première partie terminée : +${gain} XP`, { expr: "fier" });
    }
    touchDay(); checkBadges();
  }

  /* ---- Badges ---- */
  function checkBadges(silent) {
    const have = store.get("badges", {});
    const lessons = store.get("lessons", {}), exams = store.get("exams", {}), scenes = store.get("scenes", {}), flags = store.get("flags", {});
    const tests = {
      "first-lesson": () => Object.keys(lessons).length > 0,
      n1: () => !!exams.n1, n2: () => !!exams.n2, n3: () => !!exams.n3, n4: () => !!exams.n4,
      "first-stop": () => !!flags.stop, "first-game": () => !!flags.game,
      streak3: () => streak() >= 3, streak7: () => streak() >= 7
    };
    SCENES.forEach(s => { tests["sc-" + s.id] = () => !!(scenes[s.id] && scenes[s.id].perfect); });
    const fresh = [];
    BADGES.forEach(b => { if (!have[b.id] && tests[b.id] && tests[b.id]()) { have[b.id] = fmtDay(new Date()); fresh.push(b); } });
    if (fresh.length || silent) { store.set("badges", have); if (!silent) fresh.forEach(b => reward("Badge obtenu : " + b.title, { icon: b.icon })); }
  }

  /* ---- Questions ---- */
  function awardQuestion(id) {
    touchDay();
    const s = new Set(store.get("xpq", []));
    if (s.has(id)) return 0;
    s.add(id); store.set("xpq", [...s]);
    addXp(XP_QUESTION);
    return XP_QUESTION;
  }
  function stepValidated(isLesson) {
    const gain = isLesson ? XP_LESSON : XP_EXAM;
    addXp(gain);
    reward(`${isLesson ? "Leçon validée" : "Niveau validé"} : +${gain} XP`, { expr: "fier" });
    touchDay(); checkBadges();
    return gain;
  }

  /* ---- Briques d'interface ---- */
  // Une réplique : avatar + bulle (le mentor a une teinte violette).
  function line(who, expr, text, opts = {}) {
    const row = el("div", "g-line" + (opts.you ? " you" : ""));
    if (opts.you) {
      row.innerHTML = `<div class="g-bubble you"><span class="who">Toi</span><p></p></div>`;
    } else {
      const ch = CHARS[who];
      row.innerHTML = `${avatar(who, expr, 48)}<div class="g-bubble${who === "malik" ? " mentor" : ""}"><span class="who" style="color:var(${ch.color})"></span><p></p></div>`;
      $(".who", row).textContent = ch.name + (opts.label ? " · " + opts.label : "");
    }
    $("p", row).textContent = text;
    return row;
  }

  function strip() {
    const v = xp(), r = rankOf(v), cur = RANKS[r], nx = RANKS[r + 1], st = streak();
    const p = nx ? Math.round(100 * (v - cur.xp) / (nx.xp - cur.xp)) : 100;
    return `<div class="g-strip">
      <span class="g-rank"><span class="lvl">${r + 1}</span>${cur.n}</span>
      <div class="strip-xp">
        <div class="g-xp" role="progressbar" aria-label="Expérience" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p}"><span style="width:${p}%"></span></div>
        <span class="caption">${v} XP${nx ? ` · encore ${nx.xp - v} pour « ${nx.n} »` : " · rang maximum"}</span>
      </div>
      <span class="g-streak">${ic("flame", 16, "ico")}${st} jour${st > 1 ? "s" : ""}</span>
    </div>`;
  }

  function greeting(nextTitle, doneCount) {
    const st = streak();
    if (!nextTitle) return { expr: "fier", text: "Parcours terminé, bravo ! Passe par l'Aventure pour t'entraîner face aux pièges classiques." };
    if (!doneCount) return { expr: "content", text: "Salut, moi c'est Malik ! Je te guide pas à pas. Commence par la première leçon : ça prend 2 minutes." };
    if (st >= 2) return { expr: "content", text: `${st} jours de suite, bravo ! Prochaine étape : ${nextTitle}.` };
    return { expr: "content", text: `Content de te revoir ! Prochaine étape : ${nextTitle}.` };
  }

  if (store.get("badges", null) === null) checkBadges(true);

  return { xp, rankOf, addXp, reward, touchDay, streak, week, event, checkBadges, awardQuestion, stepValidated, line, strip, greeting };
})();

/* ================= Page Aventure ================= */
const sceneState = sc => {
  const lesson = STEPS.find(s => s.kind === "lesson" && s.id === sc.requires);
  const res = store.get("scenes", {})[sc.id];
  if (res) return { st: "done", res };
  return { st: stepDone(lesson) ? "open" : "locked", res: null, lesson };
};
const metChars = () => {
  const met = new Set(["malik"]), sc = store.get("scenes", {});
  SCENES.forEach(s => { if (sc[s.id]) s.cast.forEach(c => met.add(c)); });
  return met;
};

function renderAdventure() {
  const home = $("#adv-home");
  home.innerHTML = "";

  // Profil
  const prof = el("section", "glass-thick panel adv-profile");
  prof.innerHTML = `<div class="adv-prof-top">${avatar("malik", "content", 96)}<div class="adv-prof-txt"><h2 class="title-l">Ton aventure</h2><p class="muted">Des scènes pour reconnaître les pièges, avec Malik pour t'expliquer.</p></div></div>
    ${Game.strip()}
    <div class="adv-week"><span class="caption">Cette semaine</span><div class="g-days" aria-label="Jours d'activité"></div></div>`;
  Game.week().forEach(d => {
    const s = el("span", d.on ? "on" : d.today ? "today" : "");
    s.textContent = d.label;
    $(".g-days", prof).appendChild(s);
  });
  home.appendChild(prof);

  // Chapitres
  const done = store.get("scenes", {});
  MODULES.forEach((m, mi) => {
    const scenes = SCENES.filter(s => s.level === mi);
    if (!scenes.length) return;
    const sec = el("section", "glass module");
    sec.innerHTML = `<header class="mod-head"><div class="mod-top"><span class="pill">Chapitre ${mi + 1}</span></div><h3 class="title-m"></h3><p class="muted goal"></p></header><ol class="steps"></ol>`;
    $(".title-m", sec).textContent = m.title;
    $(".goal", sec).textContent = scenes.length === 1 ? "1 scène" : scenes.length + " scènes";
    scenes.forEach(sc => {
      const { st, res, lesson } = sceneState(sc);
      const li = el("li", "step-row scene-row " + st);
      const main = el("button", "step-main",
        `<span class="step-av">${sceneAvatar(sc)}</span>` +
        `<span class="step-txt"><strong></strong><span class="caption"></span></span><span class="badge ${st === "done" ? "ok" : st === "open" ? "accent" : ""}"></span>`);
      main.type = "button";
      $("strong", main).textContent = sc.title;
      $(".caption", main).textContent = st === "locked" ? `Débloque-la en validant la leçon « ${lesson ? LESSON[lesson.id].title : ""} »` : sc.context;
      $(".badge", main).textContent = st === "done" ? (res.perfect ? "Sans erreur" : `${res.good}/${res.total}`) : st === "open" ? `À jouer · +${sc.xp} XP` : "Verrouillée";
      if (st === "locked") main.disabled = true; else main.addEventListener("click", () => playScene(sc));
      li.appendChild(main);
      $(".steps", sec).appendChild(li);
    });
    home.appendChild(sec);
  });

  // Personnages
  const met = metChars();
  const cs = el("section", "glass-thick panel");
  cs.innerHTML = `<h3 class="title-m">Les personnages</h3><div class="chars-grid"></div>`;
  Object.entries(CHARS).forEach(([id, c]) => {
    const seen = met.has(id);
    const card = el("div", "char-card" + (seen ? "" : " unmet"),
      `<img src="${charSrc(id, "pose")}" alt="${seen ? c.name + ", " + c.role : "Personnage à rencontrer"}" width="90" height="180" decoding="async"><strong></strong><span class="caption role"></span><span class="caption trait"></span>`);
    $("strong", card).textContent = seen ? c.name : "???";
    if (seen) $("strong", card).style.color = `var(${c.color})`;
    $(".role", card).textContent = seen ? c.role : "À rencontrer dans une scène";
    $(".trait", card).textContent = seen ? c.trait : "";
    $(".chars-grid", cs).appendChild(card);
  });
  home.appendChild(cs);

  // Badges
  const have = store.get("badges", {});
  const bs = el("section", "glass-thick panel");
  bs.innerHTML = `<h3 class="title-m">Badges <span class="caption">${Object.keys(have).length} / ${BADGES.length}</span></h3><div class="badges-grid"></div>`;
  BADGES.forEach(b => {
    const on = !!have[b.id];
    const d = el("div", "g-badge" + (on ? "" : " locked"), `<span class="medal">${ic(on ? b.icon : "lock", 30, "ico")}</span><span class="t"></span><span class="sub"></span>`);
    $(".t", d).textContent = b.title;
    $(".sub", d).textContent = on ? "Obtenu" : b.hint;
    $(".badges-grid", bs).appendChild(d);
  });
  home.appendChild(bs);
}

// Avatar d'une carte de scène : le personnage principal (hors mentor) dans l'expression de sa première réplique.
function sceneAvatar(sc, size = 48) {
  const who = sc.cast.find(c => c !== "malik") || "malik";
  const l = sc.steps.find(x => x.t === "line" && x.who === who);
  return avatar(who, l ? l.expr : "neutre", size);
}

/* ---- Lecture d'une scène ---- */
const QUALITY = {
  good: { label: "Bon réflexe", icon: "check", cls: "q-good" },
  ok: { label: "Acceptable", icon: "info", cls: "q-ok" },
  bad: { label: "À éviter", icon: "warn", cls: "q-bad" }
};

function playScene(sc) {
  if (location.hash !== "#adventure") { history.replaceState(null, "", "#adventure"); route(); }
  $("#adv-home").classList.add("hidden");
  const view = $("#adv-scene");
  view.classList.remove("hidden");
  view.innerHTML = `<button class="btn btn-plain btn-sm" id="scene-back" type="button">← Retour à l'Aventure</button>
    <div class="scene-head"><span class="pill">Scène</span><h2 class="title-l"></h2><p class="muted"></p></div>
    <div class="scene-log" aria-live="polite"></div><div class="scene-ctl"></div>`;
  $("h2", view).textContent = sc.title;
  $(".scene-head .muted", view).textContent = sc.context;
  $("#scene-back").onclick = closeScene;
  const log = $(".scene-log", view), ctl = $(".scene-ctl", view);
  let i = 0, good = 0, total = 0;

  const add = node => { log.appendChild(node); node.scrollIntoView({ block: "nearest", behavior: "smooth" }); };
  const goOn = (label, fn) => { ctl.innerHTML = ""; addBtn(ctl, "btn btn-primary", label, fn).focus({ preventScroll: true }); };

  function next() {
    ctl.innerHTML = "";
    if (i >= sc.steps.length) return end();
    const st = sc.steps[i++];
    if (st.t === "line") {
      add(Game.line(st.who, st.expr, st.text));
      goOn("Continuer →", next);
    } else {
      showChoice(st);
    }
  }

  function showChoice(st) {
    const box = el("div", "choice-box");
    box.innerHTML = `<p class="q-title"></p><div class="choices"></div>`;
    $(".q-title", box).textContent = st.prompt;
    shuffle(st.options).forEach((o, k) => {
      const b = el("button", "g-choice", `<span class="k">${k + 1}</span><span class="t"></span>`);
      b.type = "button"; $(".t", b).textContent = o.text;
      b.addEventListener("click", () => choose(o, b, box));
      $(".choices", box).appendChild(b);
    });
    ctl.appendChild(box);
    box.scrollIntoView({ block: "nearest", behavior: "smooth" });
    $(".g-choice", box).focus({ preventScroll: true });
  }

  function choose(o, btn, box) {
    $$(".g-choice", box).forEach(b => { b.disabled = true; b.classList.add(b === btn ? "is-chosen" : "is-dim"); });
    total++; if (o.q === "good") good++;
    Game.touchDay();
    ctl.innerHTML = "";
    const you = Game.line("", "", o.text, { you: true });
    const q = QUALITY[o.q];
    $(".g-bubble", you).appendChild(el("span", "q-chip " + q.cls, `${ic(q.icon, 14, "ico")}${q.label}`));
    add(you);
    o.reply.forEach(r => add(Game.line(r.who, r.expr, r.text)));
    goOn("Continuer →", next);
  }

  function end() {
    const perfect = good === total;
    const saved = store.get("scenes", {});
    const first = !saved[sc.id];
    const prev = saved[sc.id];
    saved[sc.id] = { good: Math.max(good, prev ? prev.good : 0), total, perfect: perfect || !!(prev && prev.perfect) };
    store.set("scenes", saved);
    const expr = perfect ? "fier" : good >= total / 2 ? "content" : "encourageant";
    const msg = perfect ? "Sans faute ! " : good >= total / 2 ? "Bien joué. " : "Pas grave, c'est fait pour s'entraîner. ";
    const row = Game.line("malik", expr, msg + sc.takeaway, { label: "À retenir" });
    add(row);
    ctl.innerHTML = "";
    const sum = el("div", "scene-sum");
    sum.innerHTML = `<span class="g-xp-pill">${first ? "+" + sc.xp + " XP" : "Déjà terminée"}</span><span class="caption">${good} / ${total} bons réflexes</span>`;
    ctl.appendChild(sum);
    const acts = el("div", "actions"); ctl.appendChild(acts);
    addBtn(acts, "btn btn-primary", "Retour à l'Aventure", closeScene);
    if (!perfect) addBtn(acts, "btn btn-plain", "Rejouer pour viser le sans-faute", () => playScene(sc));
    if (first) { Game.addXp(sc.xp); Game.reward(`Scène terminée : +${sc.xp} XP`, { expr }); }
    Game.touchDay(); Game.checkBadges();
  }

  next();
  window.scrollTo(0, 0);
}

function closeScene() {
  $("#adv-scene").classList.add("hidden");
  $("#adv-home").classList.remove("hidden");
  renderAdventure();
  window.scrollTo(0, 0);
}
