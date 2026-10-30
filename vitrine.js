"use strict";

/* Page d'accueil publique : thème, niveaux, test « Par où commencer », scène jouable, FAQ.
   Les niveaux et leçons viennent de data.js : la vitrine reste toujours d'accord avec l'application. */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, c = "", html) => { const e = document.createElement(tag); if (c) e.className = c; if (html != null) e.innerHTML = html; return e; };
const store = {
  get(k, d) { try { const v = localStorage.getItem("ts_" + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem("ts_" + k, JSON.stringify(v)); } catch { /* stockage indisponible */ } }
};
const asset = p => (window.ASSET_DATA && ASSET_DATA[p]) || p;   // images intégrées dans la version en une seule page
const avatar = (name, alt, size) => `<img class="g-av g-av-${size}" src="${asset(`assets/personnages/${name}.svg`)}" alt="${alt}" width="${size}" height="${size}">`;

/* ---------- Thème ---------- */
const MOON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>`;
const SUN = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`;
const dark = matchMedia("(prefers-color-scheme: dark)");
const small = matchMedia("(max-width: 760px)");
function resolveTheme() { const t = store.get("theme", null); return t === "light" || t === "dark" ? t : (dark.matches ? "dark" : "light"); }
function applyTheme() {
  const t = resolveTheme(), isDark = t === "dark";
  document.documentElement.setAttribute("data-theme", t);
  const b = $("#theme-btn");
  b.innerHTML = isDark ? SUN : MOON;
  b.setAttribute("aria-label", isDark ? "Passer au thème clair" : "Passer au thème sombre");
  const img = $("#chart-img"), m = small.matches;
  img.src = asset(`images/graphique${m ? "-mobile" : ""}-${isDark ? "sombre" : "clair"}.svg`);
  img.width = m ? 342 : 800; img.height = m ? 330 : 470;
}
$("#theme-btn").addEventListener("click", () => { store.set("theme", resolveTheme() === "dark" ? "light" : "dark"); applyTheme(); });
dark.addEventListener("change", () => { if (!store.get("theme", null)) applyTheme(); });
small.addEventListener("change", applyTheme);

/* ---------- Boutons « Commencer » : « Reprendre » si la personne a déjà de la progression ---------- */
const hasProgress = ["lessons", "exams", "skipped"].some(k => Object.keys(store.get(k, {}) || {}).length) || store.get("xp", 0) > 0;
if (hasProgress) $$(".cta-go").forEach(a => { a.textContent = "Reprendre"; });
$("#n-gloss").textContent = GLOSSARY.length;

/* ---------- Niveaux ---------- */
const LESSON = Object.fromEntries(LESSONS.map(l => [l.id, l]));
const cleanTitle = t => t.replace(/^\d+\.\s*/, "").replace(/\s*\(.*\)\s*$/, "");
// Le personnage qui « pose l'examen » de chaque niveau (illustration du design).
const BOSS = [
  { who: "Fomo", img: "fomo-presse", color: "--ch-fomo", line: "Ça a pris 20 %, on achète tout, non ?" },
  { who: "Le Conseiller", img: "conseiller-insistant", color: "--ch-conseiller", line: "30 % garantis, signe avant ce soir." },
  { who: "Revanche", img: "revanche-tendu", color: "--ch-revanche", line: "J’ai perdu 300 €, je double la mise." },
  { who: "Patience", img: "patience-sereine", color: "--ch-patience", line: "Montre-moi ton plan, pas ton envie." }
];
let lvl = 0;
function renderLevels() {
  const tabs = $("#lvl-tabs");
  tabs.innerHTML = "";
  MODULES.forEach((m, i) => {
    const b = el("button", i === lvl ? "btn btn-primary" : "btn");
    b.type = "button"; b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", String(i === lvl)); b.setAttribute("aria-controls", "lvl-panel");
    b.tabIndex = i === lvl ? 0 : -1;
    b.textContent = `${i + 1} · ${m.short}`;
    b.addEventListener("click", () => { lvl = i; renderLevels(); });
    b.addEventListener("keydown", e => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      e.preventDefault(); lvl = (i + d + MODULES.length) % MODULES.length; renderLevels();
      $$("button", tabs)[lvl].focus();
    });
    tabs.appendChild(b);
  });
  const m = MODULES[lvl], boss = BOSS[lvl];
  $("#lvl-n").textContent = `Niveau ${lvl + 1}`;
  $("#lvl-title").textContent = m.title;
  const list = $("#lvl-list");
  list.innerHTML = "";
  m.lessons.forEach(id => {
    const li = el("li", "opt", `<span class="dot"></span><span></span>`);
    li.lastChild.textContent = cleanTitle(LESSON[id].title);
    list.appendChild(li);
  });
  const img = $("#lvl-img");
  img.src = asset(`assets/personnages/${boss.img}.svg`); img.alt = boss.who;
  $("#lvl-who").textContent = boss.who; $("#lvl-who").style.color = `var(${boss.color})`;
  $("#lvl-line").textContent = `« ${boss.line} »`;
}

/* ---------- Par où commencer ? ---------- */
const QZ = [
  { q: "Tu sais ce qu’est une action ?", o: ["Pas vraiment", "En gros", "Oui, sans hésiter"] },
  { q: "Tu as déjà lu un graphique en chandeliers ?", o: ["Jamais", "Une ou deux fois", "Souvent"] },
  { q: "Un stop-loss, ça te parle ?", o: ["Pas du tout", "J’en ai entendu parler", "J’en pose toujours"] }
];
let qa = [];
function renderQuiz() {
  const host = $("#qz");
  host.innerHTML = "";
  if (qa.length < QZ.length) {
    const q = QZ[qa.length];
    const step = el("div", "qz-step", `<span class="caption" style="font-size: 14px">Question ${qa.length + 1} sur ${QZ.length}</span>
      <div class="bar"><span style="width:${100 * qa.length / QZ.length}%"></span></div><p class="qz-q"></p><div class="qz-opts" role="group" aria-label="Réponses"></div>`);
    $(".qz-q", step).textContent = q.q;
    q.o.forEach((t, k) => {
      const b = el("button", "opt"); b.type = "button"; b.textContent = t;
      b.addEventListener("click", () => { qa.push(k); renderQuiz(); });
      $(".qz-opts", step).appendChild(b);
    });
    host.appendChild(step);
    return;
  }
  const pts = qa.reduce((a, b) => a + b, 0);
  const res = pts <= 2
    ? { lvl: `Niveau 1 · ${MODULES[0].title}`, txt: "On part de zéro, et c’est très bien : la première leçon explique ce qu’est une action, sans jargon.", img: "malik-encourageant", alt: "Malik, encourageant" }
    : pts <= 4
      ? { lvl: `Niveau 1 · ${MODULES[0].title}, en accéléré`, txt: "Tu as déjà des repères. Les premières leçons iront vite, et tu pourras passer l’examen du niveau 1 plus tôt.", img: "malik-content", alt: "Malik, content" }
      : { lvl: `Niveau 2 · ${MODULES[1].title}`, txt: "Tu connais les bases. Valide le petit examen du niveau 1 et tu passes directement à la suite.", img: "malik-fier", alt: "Malik, fier" };
  store.set("placement", { points: pts, niveau: pts <= 4 ? 1 : 2 });
  const box = el("div", "qz-res", `<div class="row-top">${avatar(res.img, res.alt, 64)}<p class="g-bubble mentor" style="margin: 0; font-size: 16px"><span class="who" style="color: var(--ch-malik)">Malik</span><strong style="display: block; font-size: 18px; margin-bottom: 4px"></strong><span class="txt"></span></p></div><div class="l-stack qz-actions"></div>`);
  $("strong", box).textContent = res.lvl; $(".txt", box).textContent = res.txt;
  const go = el("a", "btn btn-primary l-cta cta-go", hasProgress ? "Reprendre" : "Commencer"); go.href = "app.html#home";
  const again = el("button", "btn btn-plain", "Refaire le test"); again.type = "button";
  again.addEventListener("click", () => { qa = []; renderQuiz(); });
  $(".qz-actions", box).append(go, again);
  host.appendChild(box);
}

/* ---------- Scène jouable ---------- */
const CHOICES = [
  { t: "J’achète tout", head: "Ouille. Tu achètes au plus haut, sans plan ni stop.", img: "malik-inquiet", alt: "Malik, inquiet" },
  { t: "Je vérifie d’abord pourquoi ça monte", head: "Bon réflexe : une hausse a parfois une raison… et parfois juste une rumeur.", img: "malik-content", alt: "Malik, content" },
  { t: "J’attends mon plan", head: "Exactement. Ce n’est pas la hausse qui compte, c’est ton plan.", img: "malik-fier", alt: "Malik, fier" }
];
let pick = null;
function renderScene() {
  const box = $("#scene-choices");
  box.innerHTML = "";
  CHOICES.forEach((c, i) => {
    const b = el("button", pick === null ? "g-choice" : pick === i ? "g-choice is-chosen" : "g-choice is-dim", `<span class="k">${i + 1}</span><span></span>`);
    b.type = "button"; b.lastChild.textContent = c.t;
    b.addEventListener("click", () => { pick = i; renderScene(); $("#scene-reply .btn")?.focus({ preventScroll: true }); });
    box.appendChild(b);
  });
  $("#scene-hint").classList.toggle("hidden", pick !== null);
  const rep = $("#scene-reply");
  rep.innerHTML = "";
  if (pick !== null) {
    const c = CHOICES[pick];
    const row = el("div", "scene-reply", `${avatar(c.img, c.alt, 64)}<div class="scene-reply-col"><p class="g-bubble mentor"><span class="who" style="color: var(--ch-malik)">Malik</span><span class="txt"></span></p><button class="btn btn-plain btn-sm" type="button" style="align-self: flex-start">Rejouer</button></div>`);
    $(".txt", row).textContent = c.head;
    $(".btn", row).addEventListener("click", () => { pick = null; renderScene(); });
    rep.appendChild(row);
  }
}

/* ---------- FAQ ---------- */
const FAQ = [
  ["C’est gratuit ?", "Oui, entièrement. Pas d’abonnement, pas de version payante : tu ouvres la page et tu commences."],
  ["Faut-il créer un compte ?", "Non, il n’y a rien à créer : tu ouvres la page et tu commences. Ta progression est gardée sur ton appareil et aucune donnée personnelle n’est collectée. Pour l’instant, elle ne passe pas d’un appareil à l’autre."],
  ["Je risque de l’argent ?", "Non. Tout est fictif : les 10 000 € du simulateur, les cours, les entreprises. Il n’y a aucun moyen de déposer ou de retirer de l’argent réel."],
  ["Il faut des connaissances ?", "Aucune. Le niveau 1 part de zéro : ce qu’est une action, comment se forme un prix, comment lire un graphique. Malik t’explique chaque mot nouveau."],
  ["Ça marche sur iPhone ?", "Oui, dans Safari comme sur Android ou un ordinateur. Tu peux l’ajouter à ton écran d’accueil (Partager, puis « Sur l’écran d’accueil ») et t’en servir hors ligne."],
  ["Est-ce un conseil en investissement ?", "Non. TrendScout est un outil pédagogique : il ne recommande aucun produit, aucune action, aucun placement. Avant d’investir pour de vrai, renseigne-toi auprès de sources officielles comme l’AMF."]
];
let faq = 0;
function renderFaq() {
  const chips = $("#faq-chips");
  chips.innerHTML = "";
  FAQ.forEach(([q], i) => {
    const b = el("button", i === faq ? "btn btn-primary" : "btn btn-plain");
    b.type = "button"; b.setAttribute("aria-pressed", String(i === faq)); b.textContent = q;
    b.addEventListener("click", () => { faq = i; renderFaq(); });
    chips.appendChild(b);
  });
  $("#faq-q").textContent = FAQ[faq][0];
  $("#faq-a").textContent = FAQ[faq][1];
}

/* ---------- Démarrage ---------- */
applyTheme();
renderLevels();
renderQuiz();
renderScene();
renderFaq();
