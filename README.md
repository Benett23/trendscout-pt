# TrendScout – Apprendre la bourse

Application web pédagogique en français, sans dépendance ni étape de build. Elle fonctionne sur **ordinateur et mobile**, peut s'**installer comme une vraie application** et marche **hors ligne** une fois chargée. Design « Verre » (clair et sombre, police Inter embarquée).

## Contenu
- **Apprendre** : 10 leçons avec mini-quiz et progression sauvegardée.
- **Simulateur** : 10 000 € virtuels sur un marché fictif. Chandeliers (hausse creuse, baisse pleine), SMA 20/50, RSI 14, ordres, stop-loss et objectif (gaps gérés), frais 0,1 %, repères d'achat/vente, journal, bilan avec courbe de capital et conseils.
- **Quiz** : 10 questions aléatoires. **Calculateur** : taille de position avec schéma. **Glossaire** : 42 termes.

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
| `app.js` | Logique : thème, navigation, leçons, quiz, simulateur, calculateur |
| `data.js` | Contenu pédagogique (leçons, questions, glossaire) |
| `sw.js`, `manifest.webmanifest`, `icons/` | Installation et mode hors ligne |
| `fonts/` | Inter (latin et latin étendu) |
| `BRIEF_DESIGN.md` | Brief de design transmis à Claude Design |

Changer les couleurs ou les matières : modifier `tokens.css` uniquement ; le graphique relit les variables CSS (`--up`, `--down`, `--c-sma20`, …).
