# TrendScout – Apprendre la bourse

Application web pédagogique en français, sans dépendance ni étape de build. Elle fonctionne sur **ordinateur et mobile**, peut s'**installer comme une vraie application** et marche **hors ligne** une fois chargée. Design « Verre » (clair et sombre, police Inter embarquée).

## Contenu
- **Parcours** : 4 niveaux (Les bases · Passer des ordres sans se ruiner · Analyser un marché · Investir sur la durée), 10 leçons et un examen de 6 questions à la fin de chaque niveau. Verrouillage souple : l'étape suivante se débloque quand la précédente est validée, avec un bouton « Je connais déjà ». Validation à environ deux tiers de bonnes réponses.
- **Quiz en direct** : chaque question s'affiche seule, la bonne réponse et l'explication apparaissent dès que tu réponds.
- **Aventure** : 6 scènes de dialogue avec Malik (le mentor), Fomo, Le Conseiller, Revanche et Patience, liées aux leçons (diversification, FOMO, arnaques, revenge trading, indicateurs, frais). Profil avec rang, XP, série de jours et 15 badges. On récompense la méthode, jamais les gains.
- **Pratique** : simulateur avec 10 000 € virtuels sur un marché fictif. Chandeliers (hausse creuse, baisse pleine), SMA 20/50, RSI 14, ordres, stop-loss et objectif (gaps gérés), frais 0,1 %, repères d'achat/vente, journal, bilan avec courbe de capital et conseils, et Malik qui commente la partie (stop-loss, risque).
- **Révisions** : quiz au hasard sur ce qui a été étudié, et reprise des questions ratées.
- **Outils** : calculateur de taille de position avec schéma, glossaire de 42 termes.

**Site en ligne** : https://benett23.github.io/trendscout-pt/

Les données sont **fictives** ; l'outil ne constitue pas un conseil en investissement.

## Lancer en local (Visual Studio Code)
1. Ouvre le dossier dans VS Code, installe l'extension recommandée **Live Server**.
2. Clic droit sur `index.html` → *Open with Live Server*.

Sans VS Code : `python3 -m http.server 8080` dans le dossier, puis `http://localhost:8080`.
(Ouvrir `index.html` directement fonctionne, mais l'installation et le mode hors ligne demandent `http://` ou `https://`.)

## Installer comme application
- **Ordinateur (Chrome / Edge)** : bouton « Installer l'app » dans la barre latérale, ou l'icône d'installation dans la barre d'adresse.
- **Android (Chrome)** : menu ⋮ → *Installer l'application*.
- **iPhone / iPad (Safari)** : Partager → *Sur l'écran d'accueil*.

Pour y accéder depuis un téléphone, l'application doit être servie en HTTPS (hébergement statique gratuit : GitHub Pages, Netlify, Vercel…).

## Publier sur GitHub Pages
Le workflow `.github/workflows/pages.yml` publie l'application à chaque envoi sur la branche principale (seuls les fichiers de l'application sont publiés).

Activation (une seule fois) : dépôt → **Settings → Pages → Build and deployment → Source : GitHub Actions**. Le site est ensuite disponible sur `https://<ton-compte>.github.io/trendscout-pt/`. Le suivi du déploiement est dans l'onglet **Actions**.

## Structure
| Fichier | Rôle |
|---|---|
| `tokens.css` | Tokens et composants du design « Verre » (fourni, non modifié) |
| `app.css` | Mise en page responsive et glue par-dessus les tokens |
| `index.html` | Structure, icônes, navigation (barre latérale / barre d'onglets) |
| `app.js` | Logique : thème, navigation, parcours, quiz, simulateur, calculateur |
| `jeu-tokens.css`, `jeu-data.js`, `jeu.js` | Couche jeu : tokens, personnages/scènes/badges, XP et page Aventure |
| `main.js` | Démarrage |
| `assets/personnages/` | 28 illustrations SVG des personnages |
| `data.js` | Contenu pédagogique (leçons, questions, glossaire) |
| `sw.js`, `manifest.webmanifest`, `icons/` | Installation et mode hors ligne |
| `fonts/` | Inter (latin et latin étendu) |
| `BRIEF_DESIGN.md` | Brief de design transmis à Claude Design |

Changer les couleurs ou les matières : modifier `tokens.css` uniquement ; le graphique relit les variables CSS (`--up`, `--down`, `--c-sma20`, …).
