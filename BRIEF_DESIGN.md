# TrendScout – Brief de design complet

Document à transmettre à Claude Design. Il décrit le produit, chaque écran, chaque composant, les états, les contraintes techniques et ce qui est libre ou figé.

---

## 1. Le produit en bref

**TrendScout** est une application web pédagogique, en français, pour apprendre la bourse et le trading **sans risque**. Elle combine :
1. des **leçons** courtes avec mini-quiz,
2. un **simulateur de trading** sur un marché fictif (10 000 € virtuels),
3. un **quiz** libre,
4. un **calculateur** de taille de position,
5. un **glossaire**.

- **Public** : débutants complets, francophones, adultes, souvent sur mobile. Peu ou pas de connaissances financières.
- **Objectif de l'utilisateur** : comprendre, s'entraîner, faire des erreurs sans perdre d'argent réel, puis progresser.
- **Ton** : pédagogue, direct, rassurant, jamais « vendeur ». Tutoiement. Pas de promesse de gains.
- **Mention obligatoire en permanence** : « Outil pédagogique : données fictives, aucun conseil en investissement. Investir comporte un risque de perte en capital. »
- **Ce que le produit n'est pas** : un terminal de trading professionnel, une appli de courtage, un site de signaux. Le design ne doit pas donner une impression de casino ni d'argent facile.

### Intention de design suggérée (libre à toi de la remplacer)
Un outil d'apprentissage sérieux mais accueillant, entre une appli éducative (type Duolingo, en moins ludique) et une plateforme financière lisible. Priorité à la **clarté des chiffres et du graphique**, puis à la **motivation** (progression visible). Éviter le look « crypto néon » et les clichés de finance (taureaux, billets, flèches vertes partout).

---

## 2. État actuel (point de départ à améliorer)

- Thème **sombre uniquement**, bleu nuit (`#0f1420` fond, `#171e2e` panneaux), accent bleu `#5b8cff`.
- Vert `#26a69a` = hausse / achat, rouge `#ef5350` = baisse / vente, orange `#f5a623` = avertissement.
- Police système (`system-ui`), 16 px, aucune police de caractère choisie.
- Navigation en haut : 5 onglets textuels. Contenu centré, largeur max 980 px.
- Cartes aux coins arrondis 12 px, bordures fines, boutons pleins de couleur.
- Emoji 📈 comme seul logo.
- Fonctionnel mais **générique** : pas d'identité, pas d'illustrations, hiérarchie visuelle faible, peu de gamification.

**Ce qui est demandé** : une vraie identité visuelle et une refonte de l'interface, en conservant toutes les fonctionnalités.

---

## 3. Ce qui est figé et ce qui est libre

### Figé (fonctionnel)
- Les 5 sections et leurs fonctions (voir §5).
- Le sens des couleurs de marché : **hausse = positif, baisse = négatif**, avec une signalisation qui ne repose pas que sur la couleur (forme, signe + / −, icône) pour l'accessibilité daltonisme.
- La mention « données fictives » toujours visible.
- Le graphique en **chandeliers japonais** avec moyennes mobiles et RSI (standard du domaine).
- Tous les textes de leçons, quiz et glossaire (contenu pédagogique) : on peut les mettre en forme, pas en changer le fond.

### Libre
- Identité : nom stylisé, logo, palette, typographies, iconographie, illustrations, formes, ombres, animations.
- Thème clair et sombre (les deux sont souhaités, voir §9).
- Navigation (barre du haut, barre latérale, barre du bas sur mobile…).
- Mise en page de chaque écran, tant que les éléments listés au §5 existent.
- Gamification légère (badges, séries, niveaux) à condition de rester sobre et de ne pas pousser à trader plus.

---

## 4. Architecture de l'information

```
TrendScout
├─ Apprendre          (liste de 9 leçons → vue d'une leçon avec quiz)
├─ Simulateur         (réglages → partie en cours → bilan de fin)
├─ Quiz               (10 questions aléatoires → correction)
├─ Calculateur        (taille de position)
└─ Glossaire          (recherche)
```
Bandeau permanent : mention pédagogique/avertissement.

Parcours recommandé à mettre en avant (suggestion) : **Apprendre → Simulateur → Quiz**, le calculateur et le glossaire étant des outils d'appoint.

---

## 5. Spécification écran par écran

### 5.1 Apprendre

**Liste des leçons**
- Barre de progression globale + texte « X / 9 leçons validées ».
- 9 cartes de leçon. Chaque carte : niveau (Débutant / Intermédiaire / Essentiel), titre, état (« À faire » ou « ✔ Validée (3/3) »).
- Les leçons :
  1. Comment fonctionne la bourse ? (Débutant)
  2. Actions, ETF, obligations : les produits (Débutant)
  3. Lire un graphique en chandeliers (Débutant)
  4. Les types d'ordres (Débutant)
  5. Analyse technique : tendance, moyennes, RSI (Intermédiaire)
  6. Analyse fondamentale : valoriser une entreprise (Intermédiaire)
  7. Gestion du risque, la leçon la plus importante (Essentiel)
  8. Psychologie et pièges classiques (Essentiel)
  9. Enveloppes et frais, exemple France (Intermédiaire)
- États à dessiner : non commencée, validée, (suggestion) recommandée ensuite.

**Vue d'une leçon**
- Bouton retour vers la liste.
- Titre, puis contenu riche : paragraphes, sous-titres, listes à puces, encadré « À retenir » (note), bout de formule en code (ex. `Quantité = risque en € / (entrée − stop)`), mots en gras.
- Section « Vérifie tes connaissances » : 2 à 3 questions à choix unique (radio), bouton **Corriger**.
- Après correction : bonnes réponses en vert, erreur choisie en rouge, explication affichée sous chaque question, message de résultat (leçon validée si tout est juste, sinon invitation à relire et réessayer).
- Besoin : lisibilité de longue lecture (largeur de ligne ~65 caractères, interlignage généreux).

### 5.2 Simulateur (écran le plus important)

**a) Réglages avant partie**
- Explication courte (10 000 € virtuels, marché aléatoire, frais 0,1 % par ordre).
- Choix du scénario : *Mystère (recommandé)*, Tendance haussière, Tendance baissière, Marché latéral, Marché volatil.
- Bouton **Démarrer une partie**.

**b) Partie en cours**
1. **Bandeau de 6 indicateurs** : Jour (ex. `5 / 120`), Prix, Liquidités, Position (ex. `50 @ 85,91` ou « aucune »), Valeur totale, Performance (colorée, avec signe).
2. **Graphique** (zone dominante, ~60 % de la hauteur d'écran sur ordinateur) :
   - ~80 bougies visibles, mèches, corps vert/rouge.
   - Deux moyennes mobiles (SMA 20 orange, SMA 50 bleue), activables.
   - Panneau **RSI 14** sous le prix avec lignes 30 / 50 / 70, activable.
   - Axe des prix à droite, étiquette du **prix courant** en pastille.
   - Lignes en pointillés : **PRU** (prix de revient), **Stop**, **Objectif**, avec étiquettes.
   - Au survol : réticule vertical + ligne de lecture `J-14 O 86,37 H 86,54 B 86,08 C 86,19`.
   - Sur mobile : prévoir un équivalent tactile du survol (appui long ou glissement).
3. **Panneau d'ordres** :
   - Quantité, bouton **Max**, **Acheter** (vert), **Vendre** (rouge), **Tout vendre**.
   - Stop-loss (prix) et Objectif (prix), bouton **Appliquer**.
   - Contrôles de temps : **Jour suivant**, **+5 jours**, **Auto** (lecture automatique, devient **Pause**), **Terminer la partie** (demande une confirmation sur la page : « Confirmer la fin ? »).
   - Zone de message (succès, erreur, avertissement), ex. « Achat de 50 titres exécuté. », « Stop-loss déclenché à 84,10. ».
4. **Journal des opérations** : liste antichronologique, ex. `J5 – Ordre: achat de 50 à 85,91 (frais 4,30 €)`.

**c) Bilan de fin de partie**
- Scénario révélé (ex. « Tendance baissière »).
- 6 chiffres : Capital final, Performance, Acheter & conserver (comparaison), Baisse max (drawdown), Trades clôturés (et gagnants), Frais payés.
- Liste « Ce que tu peux améliorer » : 1 à 5 conseils personnalisés (surtrading, absence de stop-loss, drawdown élevé, comparaison avec acheter & conserver…).
- Bouton **Rejouer**.
- Opportunité de design : courbe de capital de la partie en miniature, à ajouter si pertinent (donnée disponible : valeur du capital à chaque jour).

### 5.3 Quiz
- Titre « Quiz : 10 questions aléatoires », meilleur score affiché.
- 10 questions, 2 à 4 options chacune, bouton **Corriger**.
- Après correction : couleurs bon/mauvais, explications, score `X/10` (vert si ≥ 7, orange sinon), bouton **Nouveau quiz**.

### 5.4 Calculateur de taille de position
- Champs : Capital (€), Risque par trade (%), Prix d'entrée, Stop-loss, Objectif (optionnel). Valeurs d'exemple : 10 000 / 1 / 50 / 48 / 56.
- Résultats en direct (8 cellules maximum) : Sens (achat ou vente à découvert), Perte max si stop touché, Risque par titre, Quantité à prendre, Montant engagé (et % du capital), Ratio gain/risque.
- Messages contextuels : stop trop éloigné (quantité 0), position supérieure au capital (levier nécessaire), ratio < 2, objectif incohérent.
- Opportunité de design : petit schéma visuel entrée / stop / objectif qui se met à jour.

### 5.5 Glossaire
- Champ de recherche (filtre en direct) + liste de 42 termes (terme en évidence, définition en dessous).
- Opportunité : index alphabétique, ou mise en avant des termes liés à la leçon en cours.

---

## 6. Contenu typographique à prévoir

- Titres de page, titres de leçon, sous-titres (h4 actuels), paragraphes, listes.
- Chiffres financiers nombreux : prévoir des **chiffres tabulaires** (alignés) et un format français (`1 234,56 €`, virgule décimale, espace insécable).
- Étiquettes en petites capitales / majuscules espacées pour les légendes.
- Code court (formules) dans une police à chasse fixe.
- Choisir **2 polices maximum** (une pour l'identité / titres, une très lisible pour le texte et les chiffres), disponibles sur Google Fonts (seule source de polices autorisée en production), avec des polices de secours.

---

## 7. Système de composants à concevoir

| Composant | Variantes / états |
|---|---|
| Bouton | principal, secondaire, achat (vert), vente (rouge), discret ; normal, survol, focus clavier, actif, désactivé |
| Champ numérique / texte | normal, focus, erreur, désactivé, avec libellé et aide |
| Menu déroulant | normal, ouvert |
| Case à cocher (indicateurs du graphique) | cochée, non cochée |
| Option de réponse (quiz) | neutre, survol, sélectionnée, correcte, incorrecte, désactivée |
| Carte de leçon | à faire, validée, survol, focus |
| Tuile de statistique | neutre, positive, négative |
| Encadré « À retenir » | note, avertissement |
| Message d'état | succès, erreur, avertissement, info |
| Barre de progression | 0 à 100 % |
| Navigation | actif, inactif, survol, focus, version mobile |
| Ligne de journal | achat, vente, stop, objectif |
| Graphique | bougies, moyennes, RSI, lignes de niveaux, réticule, infobulle |

---

## 8. Système de couleurs (à repenser)

Rôles à couvrir, avec leurs valeurs actuelles à titre indicatif :

| Rôle | Actuel |
|---|---|
| Fond de page | `#0f1420` |
| Surface (cartes) | `#171e2e` |
| Surface secondaire | `#1e2740` |
| Bordure | `#2a3452` |
| Texte | `#e6eaf5` |
| Texte atténué | `#8d98b5` |
| Accent / action principale | `#5b8cff` |
| Hausse / positif | `#26a69a` |
| Baisse / négatif | `#ef5350` |
| Avertissement | `#f5a623` |
| Moyenne SMA 20 | `#f5a623` |
| Moyenne SMA 50 | `#5b8cff` |
| RSI | `#b388ff` |

Contraintes :
- Contraste texte/fond conforme **WCAG AA** (4,5:1 pour le texte courant).
- Hausse/baisse **distinguables sans la couleur** (signe, icône, motif de bougie creuse/pleine).
- Les couleurs du graphique doivent rester lisibles en thème clair **et** sombre.
- L'accent ne doit pas être confondu avec le vert/rouge de marché.

---

## 9. Thèmes, responsive, accessibilité

- **Deux thèmes** (clair et sombre) suivant le réglage du système, avec jeux de couleurs complets pour chacun, graphique compris. Aujourd'hui seul le sombre existe.
- **Responsive** : ordinateur (≥ 1024 px), tablette, **mobile (~400 px) prioritaire**. Aucun défilement horizontal de la page. Sur mobile : le graphique garde une hauteur utile (~340 px), le panneau d'ordres reste accessible sans trop défiler (envisager une barre d'actions fixée en bas pour Acheter / Vendre / Jour suivant).
- **Accessibilité** : focus clavier visible partout, navigation entière au clavier, zones tactiles ≥ 44 px, `prefers-reduced-motion` respecté (animations coupées), libellés explicites sur les champs, couleur jamais seule porteuse d'information.
- **Animations** (sobres) : transition de la barre de progression, apparition des bougies, retour visuel sur achat/vente. Pas d'effets qui évoquent un jeu d'argent (pas de confettis sur un gain de trade, pas de clignotement des prix).

---

## 10. Contraintes techniques à connaître

- Application **HTML / CSS / JavaScript pur**, sans framework ni dépendance. Le graphique est dessiné dans un `<canvas>` (couleurs codées dans le JavaScript : `COL` dans `app.js`, à synchroniser avec la nouvelle palette).
- Si le design est livré comme page publiée sur claude.ai : scripts externes uniquement depuis cdnjs / jsdelivr / unpkg, polices uniquement via Google Fonts, pas de `alert()` / `confirm()`, pas d'impression, pas de téléchargement de fichier, images en `data:`.
- Les identifiants HTML (`#sim-start`, `#btn-buy`, `#chart`, `#qty`, etc.) et les classes utilisées par le JavaScript doivent être **conservés ou renommés ensemble**. Si le design est refait sur une autre structure, prévoir une correspondance claire.
- Persistance locale (navigateur) : progression des leçons, meilleur score au quiz, meilleure performance au simulateur. Aucun compte utilisateur aujourd'hui.

---

## 11. Données d'exemple pour maquetter

- Partie en cours : jour 5/120, prix 84,92, liquidités 5 700,35 €, position `50 @ 85,91`, valeur totale 9 946,45 €, performance −0,54 %.
- Bilan : capital final 8 957,29 €, performance −10,43 %, acheter & conserver −24,10 %, baisse max 11,5 %, 1 trade clôturé (0 gagnant), frais 7,56 €.
- Journal : `J0 – Début de partie : 10 000,00 € en liquidités.` / `J5 – Ordre: achat de 50 à 85,91 (frais 4,30 €)` / `J12 – Stop-loss déclenché: vente de 50 à 80,00 → résultat −298,00 €`.
- Calculateur (valeurs par défaut) : perte max 100,00 €, risque par titre 2,00, quantité 50, montant engagé 2 500,00 € (25,0 % du capital), ratio 1 : 3,00.
- Quiz : « Capital 10 000 €, risque 1 %, entrée 50 €, stop 48 €. Combien d'actions ? » → 20 / **50** / 100 / 200.

---

## 12. Livrables attendus de Claude Design

1. Identité : nom stylisé, logo, favicon, palette (clair + sombre), typographies, grille et espacements, icônes.
2. Maquettes des **5 sections**, y compris tous les états listés (§5 et §7), sur ordinateur **et** mobile.
3. Maquette du **graphique** en détail (chandeliers, moyennes, RSI, niveaux, infobulle) dans les deux thèmes.
4. Système de composants (§7) avec états.
5. Un guide court : règles d'usage des couleurs, de la typographie, du ton éditorial, des animations.
6. Si possible, un export directement réutilisable (tokens de couleurs et de typographie en variables CSS).

---

## 13. Pistes d'amélioration (propositions, à valider)

- Page d'accueil avec « Reprendre où tu en étais » et prochaine étape suggérée.
- Progression en niveaux (Débutant → Intermédiaire → Confirmé) débloquant des scénarios plus difficiles.
- Courbe de capital dans le bilan, avec marquage des achats/ventes sur le graphique.
- Glossaire contextuel : survol d'un terme dans une leçon pour voir sa définition.
- Historique des parties jouées et comparaison entre elles.
- Mode « replay commenté » : le bilan rejoue la partie en montrant où les décisions ont fait gagner ou perdre.

---

## 14. Contenu intégral de référence

Les textes complets des 10 leçons, des 29 questions de quiz et du glossaire sont dans le fichier `data.js` du dépôt `Benett23/trendscout-pt` (branche `claude/trading-learning-tool`). Le code de l'interface est dans `index.html`, `style.css` et `app.js`. La version publiée en ligne, utilisable comme référence visuelle de l'existant : https://claude.ai/artifact/QUtrkij5rHyKxFbY2Aav3K (privée, visible seulement depuis ton compte).
