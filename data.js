// Contenu pédagogique : leçons, quiz et glossaire.
// Chaque question : { q, o: [options], a: index de la bonne réponse, e: explication }

const LESSONS = [
  {
    id: "bourse",
    title: "1. Comment fonctionne la bourse ?",
    level: "Débutant",
    html: `
      <p>Une <strong>bourse</strong> est un marché organisé où des acheteurs et des vendeurs échangent des titres financiers (actions, obligations, ETF…). Le prix se forme par la rencontre de l'<strong>offre</strong> et de la <strong>demande</strong>.</p>
      <h4>Pourquoi les entreprises cotent en bourse</h4>
      <p>Pour lever de l'argent sans emprunter : elles vendent des parts de leur capital (les <em>actions</em>). L'acheteur devient <strong>actionnaire</strong> : il possède une petite fraction de l'entreprise.</p>
      <h4>Comment un actionnaire gagne de l'argent</h4>
      <ul>
        <li><strong>Plus-value</strong> : tu revends plus cher que tu n'as acheté.</li>
        <li><strong>Dividendes</strong> : l'entreprise redistribue une partie de ses bénéfices.</li>
      </ul>
      <h4>Le carnet d'ordres</h4>
      <p>Chaque titre a un carnet d'ordres : à gauche les acheteurs (prix <em>bid</em>), à droite les vendeurs (prix <em>ask</em>). L'écart entre les deux s'appelle le <strong>spread</strong>. Une transaction a lieu quand un acheteur et un vendeur s'accordent sur un prix.</p>
      <div class="keep"><span class="k">À retenir</span><p>En bourse, il n'y a pas de gain garanti. Le prix monte parce que plus de gens veulent acheter que vendre, et inversement.</p></div>`,
    quiz: [
      { q: "Qu'est-ce qu'une action ?", o: ["Un prêt fait à une entreprise", "Une part du capital d'une entreprise", "Une assurance contre les pertes", "Un contrat à durée limitée"], a: 1, e: "Une action représente une fraction de propriété de l'entreprise. Un prêt, c'est une obligation." },
      { q: "Qu'est-ce que le spread ?", o: ["L'écart entre le prix d'achat (ask) et de vente (bid)", "Le dividende annuel", "La commission du courtier", "La variation sur une journée"], a: 0, e: "Le spread est la différence entre le meilleur prix vendeur et le meilleur prix acheteur." },
      { q: "Qu'est-ce qui fait varier le prix d'une action au quotidien ?", o: ["Une décision quotidienne de l'État", "L'offre et la demande", "Le courtier", "Le prix est fixé une fois par an"], a: 1, e: "Le prix résulte de la confrontation des ordres d'achat et de vente." }
    ]
  },
  {
    id: "produits",
    title: "2. Actions, ETF, obligations : les produits",
    level: "Débutant",
    html: `
      <h4>Actions</h4>
      <p>Potentiel de gain élevé, mais risque de perte réelle. Le cours d'une seule entreprise peut chuter fortement (voire à zéro).</p>
      <h4>ETF (trackers)</h4>
      <p>Un <strong>ETF</strong> est un fonds coté qui réplique un indice (ex. : le CAC 40, le S&amp;P 500, le MSCI World). En un seul achat, tu détiens des centaines d'entreprises : c'est la <strong>diversification</strong> instantanée, avec des frais faibles.</p>
      <h4>Obligations</h4>
      <p>Tu prêtes de l'argent à un État ou une entreprise, qui te verse des intérêts (le <em>coupon</em>) et te rembourse à l'échéance. Moins risqué en général, rendement plus faible.</p>
      <h4>Produits à éviter en début de parcours</h4>
      <ul>
        <li><strong>CFD, options, turbos, futures</strong> : ils utilisent le <em>levier</em>. Tu peux perdre plus vite que ce que tu imagines.</li>
        <li><strong>Cryptos et micro-capitalisations</strong> : très volatils.</li>
      </ul>
      <div class="keep"><span class="k">À retenir</span><p>Règle simple : pour apprendre, commence par comprendre les actions et les ETF. Le reste viendra plus tard.</p></div>`,
    quiz: [
      { q: "Quel est le principal avantage d'un ETF indiciel ?", o: ["Il garantit le capital", "Il diversifie sur de nombreuses entreprises avec peu de frais", "Il rapporte toujours plus qu'une action", "Il est exempt de risque"], a: 1, e: "Un ETF réplique un indice : tu es exposé à beaucoup de sociétés d'un coup, avec des frais faibles. Il reste soumis au risque de marché." },
      { q: "Une obligation, c'est…", o: ["Une part de propriété", "Un prêt rémunéré par des intérêts", "Un type de dividende", "Un ordre de bourse"], a: 1, e: "Tu prêtes à l'émetteur, qui te verse un coupon et te rembourse à l'échéance (sauf défaut)." },
      { q: "Pourquoi éviter le levier quand on débute ?", o: ["Il est interdit", "Il amplifie aussi bien les gains que les pertes", "Il n'amplifie que les gains", "Il supprime les frais"], a: 1, e: "Le levier multiplie les gains ET les pertes ; un petit mouvement contraire peut effacer ton capital." }
    ]
  },
  {
    id: "graphique",
    title: "3. Lire un graphique en chandeliers",
    level: "Débutant",
    html: `
      <p>Un <strong>chandelier japonais</strong> résume une période (une journée, une heure…) avec 4 prix :</p>
      <ul>
        <li><strong>Open</strong> (ouverture) et <strong>Close</strong> (clôture) : le « corps » du chandelier.</li>
        <li><strong>High</strong> (plus haut) et <strong>Low</strong> (plus bas) : les « mèches ».</li>
      </ul>
      <p>Chandelier <strong class="up">haussier</strong> (vert, <em>creux</em>) : clôture &gt; ouverture. Chandelier <strong class="down">baissier</strong> (rouge, <em>plein</em>) : clôture &lt; ouverture. La forme (creux ou plein) permet de les distinguer même sans les couleurs.</p>
      <h4>Ce que racontent les mèches</h4>
      <p>Une longue mèche haute = les acheteurs ont poussé, mais les vendeurs ont repris la main (rejet du haut). Une longue mèche basse = rebond après une baisse.</p>
      <h4>Les échelles de temps</h4>
      <p>Le graphique journalier donne une vision de moyen terme. Plus l'unité de temps est courte, plus il y a de « bruit » (mouvements aléatoires sans signification). Un débutant a tout intérêt à travailler sur des échelles <strong>journalières ou hebdomadaires</strong>.</p>
      <div class="keep"><span class="k">À essayer</span><p>Dans l'onglet <em>Pratique</em>, survole le graphique pour voir O/H/L/C de chaque bougie.</p></div>`,
    quiz: [
      { q: "Un chandelier haussier signifie que…", o: ["La clôture est supérieure à l'ouverture", "La clôture est inférieure à l'ouverture", "Le volume est élevé", "Le plus haut égale l'ouverture"], a: 0, e: "Haussier = le prix a fini plus haut qu'il n'a commencé la période." },
      { q: "Que représentent les mèches ?", o: ["Les dividendes", "Les extrêmes (plus haut / plus bas) atteints pendant la période", "Le volume échangé", "Les frais"], a: 1, e: "Les mèches montrent jusqu'où le prix est allé avant de revenir vers le corps." },
      { q: "Pourquoi les très petites échelles de temps sont-elles plus difficiles pour un débutant ?", o: ["Il y a davantage de bruit aléatoire", "Elles sont interdites", "Les frais disparaissent", "Les prix sont plus faciles à prédire"], a: 0, e: "Sur des échelles courtes, le hasard domine et les frais se cumulent vite." }
    ]
  },
  {
    id: "ordres",
    title: "4. Les types d'ordres",
    level: "Débutant",
    html: `
      <p>Un ordre, c'est une instruction à ton intermédiaire : acheter ou vendre, combien, et à quelles conditions. Chaque type d'ordre répond à une priorité : <strong>contrôler le prix</strong> ou être <strong>sûr d'être exécuté</strong>.</p>
      <h4>Le carnet d'ordres</h4>
      <p>Les ordres des acheteurs et des vendeurs sont rassemblés dans un <strong>carnet d'ordres</strong> : pour chaque prix, il affiche les quantités proposées. Une transaction a lieu quand un acheteur et un vendeur s'accordent. Plus un titre est échangé (<em>liquide</em>), plus c'est facile d'acheter et de vendre sans faire bouger le prix.</p>
      <h4>Ordre au marché</h4>
      <p>Exécuté tout de suite, en consommant les prix disponibles dans le carnet jusqu'à la quantité demandée. Tu es sûr d'être exécuté, mais tu ne contrôles pas le prix : sur un titre peu échangé ou quand le marché s'agite, le prix obtenu peut s'écarter du prix affiché (<em>slippage</em>).</p>
      <h4>Ordre à cours limité</h4>
      <p>Tu fixes le prix maximum d'achat (ou minimum de vente). Tu contrôles le prix, mais l'ordre peut ne jamais être exécuté, ou seulement en partie.</p>
      <h4>Ordre à la meilleure limite</h4>
      <p>Tu n'indiques pas de prix : l'ordre prend automatiquement le meilleur prix en tête du carnet à ce moment-là. C'est rapide sur les titres très liquides. Si la quantité disponible à ce prix est trop faible, le reste de ton ordre attend, comme un ordre limité.</p>
      <h4>Ordre à seuil de déclenchement (stop)</h4>
      <p>Tu fixes un seuil. Quand le prix le touche, un <strong>ordre au marché</strong> se déclenche. C'est l'outil du <strong>stop-loss</strong> : il sert à <strong>limiter la perte</strong>. Exemple : tu achètes à 100 €, tu places un stop à 95 € : si le cours tombe à 95 €, tu sors avec environ 5 % de perte au lieu de subir une chute plus grande.</p>
      <h4>Ordre à plage de déclenchement (stop-limit)</h4>
      <p>Quand le seuil est touché, c'est un <strong>ordre à cours limité</strong> qui se déclenche. Le prix de sortie est encadré, mais si le cours saute au-delà de ta limite, l'ordre peut ne pas être exécuté du tout.</p>
      <h4>Objectif (take-profit)</h4>
      <p>Ordre de vente à un prix cible pour sécuriser un gain.</p>
      <div class="table-wrap"><table>
        <thead><tr><th>Ordre</th><th>Tu maîtrises</th><th>Risque principal</th></tr></thead>
        <tbody>
          <tr><td>Au marché</td><td>L'exécution</td><td>Prix obtenu différent de celui attendu</td></tr>
          <tr><td>À cours limité</td><td>Le prix</td><td>Pas ou peu exécuté</td></tr>
          <tr><td>À la meilleure limite</td><td>La rapidité</td><td>Une partie de l'ordre reste en attente</td></tr>
          <tr><td>Stop (seuil)</td><td>La sortie</td><td>Sortie à un prix plus bas que le seuil si le marché saute</td></tr>
          <tr><td>Stop-limit (plage)</td><td>Le prix de sortie</td><td>Aucune exécution si le cours saute la plage</td></tr>
        </tbody>
      </table></div>
      <h4>Après l'exécution</h4>
      <p>Une fois ton ordre exécuté, la propriété des titres n'est pas transférée à la seconde : c'est le <strong>règlement-livraison</strong>, souvent deux jours ouvrés plus tard en Europe (les délais peuvent évoluer). Ton intermédiaire t'envoie un <strong>avis d'opéré</strong> : sens, titre, quantité, cours, frais. Relis-le : en cas d'erreur, il existe un délai pour contester.</p>
      <div class="keep warn"><span class="k">Attention</span><p>Attention aux <em>gaps</em> : si le titre ouvre bien en dessous de ton stop (mauvaise nouvelle pendant la nuit), tu sors au prix d'ouverture, donc plus bas que prévu. Le simulateur reproduit ce cas.</p></div>`,
    quiz: [
      { q: "Quel ordre te garantit un prix maximum à l'achat ?", o: ["Ordre au marché", "Ordre à cours limité", "Ordre stop", "Aucun"], a: 1, e: "Avec un ordre limité, tu ne paies jamais plus que ton prix, mais il peut ne pas être exécuté." },
      { q: "À quoi sert un stop-loss ?", o: ["À augmenter les gains", "À limiter la perte maximale sur une position", "À éviter les frais", "À acheter moins cher"], a: 1, e: "Le stop sort automatiquement de la position quand le cours atteint un seuil défini." },
      { q: "Un titre ouvre à 90 € alors que ton stop est à 95 €. À quel prix sors-tu ?", o: ["95 €", "Environ 90 € (prix d'ouverture)", "100 €", "Tu ne sors pas"], a: 1, e: "En cas de gap, le stop est exécuté au premier prix disponible, ici l'ouverture à 90 €." },
      { q: "Quand le seuil d'un ordre stop-limit est touché, que se passe-t-il ?", o: ["Un ordre au marché part immédiatement", "Un ordre à cours limité se déclenche, avec un risque de non-exécution si le cours saute", "L'ordre est annulé", "Tu es sûr de sortir au prix du seuil"], a: 1, e: "Le prix de sortie est encadré, mais si le cours franchit ta limite d'un coup, l'ordre peut ne pas être exécuté." },
      { q: "L'ordre au marché garantit…", o: ["Le prix", "L'exécution, pas le prix", "Un gain", "L'absence de frais"], a: 1, e: "Il s'exécute tout de suite, mais le prix obtenu peut différer de celui affiché (slippage)." }
    ]
  },
  {
    id: "technique",
    title: "5. Analyse technique : tendance, moyennes, RSI",
    level: "Intermédiaire",
    html: `
      <p>L'<strong>analyse technique</strong> étudie le graphique pour repérer des tendances et des zones de prix. Elle ne prédit pas l'avenir : elle aide à construire un <em>plan</em> avec des niveaux clairs.</p>
      <h4>Tendance</h4>
      <ul>
        <li><strong>Haussière</strong> : une suite de sommets et de creux de plus en plus hauts.</li>
        <li><strong>Baissière</strong> : sommets et creux de plus en plus bas.</li>
        <li><strong>Latérale</strong> : le prix oscille entre un support et une résistance.</li>
      </ul>
      <h4>Support et résistance</h4>
      <p>Un <strong>support</strong> est un niveau où le prix a déjà rebondi plusieurs fois ; une <strong>résistance</strong> est un niveau où il a déjà butté. Quand un niveau est cassé, il change souvent de rôle.</p>
      <h4>Moyennes mobiles (SMA)</h4>
      <p>La moyenne des N derniers cours : elle lisse le bruit. Prix au-dessus de la SMA 50 = tendance plutôt haussière. Le croisement SMA 20 / SMA 50 est un signal classique… mais en marché latéral il produit beaucoup de faux signaux.</p>
      <h4>RSI (14)</h4>
      <p>Indicateur entre 0 et 100 mesurant la force récente du mouvement. Au-dessus de 70 : « suracheté » ; sous 30 : « survendu ». Dans une forte tendance, le RSI peut rester longtemps en zone extrême : ce n'est pas un signal de retournement automatique.</p>
      <div class="keep"><span class="k">À retenir</span><p>Aucun indicateur ne fonctionne dans tous les marchés. Teste-les dans le simulateur sur les différents scénarios.</p></div>`,
    quiz: [
      { q: "Une tendance haussière se reconnaît par…", o: ["Des sommets et creux de plus en plus bas", "Des sommets et creux de plus en plus hauts", "Un prix qui oscille sans direction", "Un volume faible"], a: 1, e: "Sommets et creux ascendants = tendance haussière." },
      { q: "Un RSI à 80 signifie automatiquement qu'il faut vendre.", o: ["Vrai", "Faux : en forte tendance il peut rester élevé longtemps"], a: 1, e: "Le RSI indique une force relative, pas un retournement certain." },
      { q: "Pourquoi un croisement de moyennes mobiles est-il peu fiable en marché latéral ?", o: ["Les moyennes ne se croisent jamais", "Il génère de nombreux faux signaux", "Les frais sont supprimés", "Il est interdit"], a: 1, e: "Quand le prix oscille sans tendance, les moyennes se croisent souvent sans qu'un mouvement durable s'ensuive." }
    ]
  },
  {
    id: "fondamentale",
    title: "6. Analyse fondamentale : valoriser une entreprise",
    level: "Intermédiaire",
    html: `
      <p>L'<strong>analyse fondamentale</strong> cherche à estimer la valeur d'une entreprise à partir de ses résultats, de son secteur et de ses perspectives.</p>
      <h4>Indicateurs clés</h4>
      <ul>
        <li><strong>Chiffre d'affaires</strong> : ses ventes. Croissance ?</li>
        <li><strong>Résultat net / BPA</strong> : bénéfice (par action).</li>
        <li><strong>PER</strong> (Price Earnings Ratio) = cours / bénéfice par action. Un PER de 20 : tu paies 20 € pour 1 € de bénéfice annuel. À comparer avec le secteur et la croissance.</li>
        <li><strong>Dette</strong> : une dette élevée fragilise l'entreprise si les taux montent ou si l'activité ralentit.</li>
        <li><strong>Rendement du dividende</strong> = dividende / cours.</li>
      </ul>
      <h4>Le piège du « pas cher »</h4>
      <p>Un PER bas peut signaler une aubaine… ou une entreprise en déclin. Un PER élevé peut refléter une forte croissance… ou une bulle. Un seul ratio ne suffit jamais.</p>
      <div class="keep"><span class="k">À surveiller</span><p>Les publications de résultats provoquent souvent de gros mouvements (gaps). Surveille le calendrier des résultats des titres que tu détiens.</p></div>`,
    quiz: [
      { q: "Une action cote 60 € et le BPA est de 3 €. Quel est le PER ?", o: ["5", "20", "180", "0,05"], a: 1, e: "PER = 60 / 3 = 20." },
      { q: "Un PER très bas est toujours une bonne affaire.", o: ["Vrai", "Faux : cela peut refléter une entreprise en difficulté"], a: 1, e: "Le marché peut anticiper un déclin des bénéfices." },
      { q: "Le rendement du dividende se calcule…", o: ["Dividende / cours", "Cours / dividende", "Bénéfice / chiffre d'affaires", "Dividende x PER"], a: 0, e: "Rendement = dividende annuel par action / cours de l'action." }
    ]
  },
  {
    id: "risque",
    title: "7. Gestion du risque (la leçon la plus importante)",
    level: "Essentiel",
    html: `
      <p>Les traders durables ne sont pas ceux qui ont le plus souvent raison, mais ceux qui <strong>contrôlent leurs pertes</strong>.</p>
      <h4>Règle des 1–2 %</h4>
      <p>Ne risque jamais plus de 1 à 2 % de ton capital sur un seul trade. Avec 10 000 € et 1 % de risque, tu acceptes de perdre au maximum 100 € si ton stop est touché.</p>
      <h4>Taille de position</h4>
      <p><code>Quantité = risque en € / (prix d'entrée − stop)</code></p>
      <p>Exemple : risque 100 €, entrée 50 €, stop 48 € → 100 / 2 = <strong>50 actions</strong>. Utilise le calculateur (onglet <em>Outils</em>).</p>
      <h4>Ratio gain/risque (R/R)</h4>
      <p>Vise des trades où le gain potentiel est au moins 2 fois le risque. Avec un R/R de 2, tu peux te tromper une fois sur deux et rester gagnant (avant frais).</p>
      <h4>L'asymétrie des pertes</h4>
      <p>Perdre 50 % exige un gain de <strong>+100 %</strong> pour revenir à l'équilibre. Les grosses pertes sont presque impossibles à rattraper.</p>
      <h4>Diversification</h4>
      <p>Ne mets pas tous tes œufs dans le même panier : plusieurs entreprises, secteurs, ou mieux, un ETF large.</p>`,
    quiz: [
      { q: "Capital 10 000 €, risque 1 %, entrée 50 €, stop 48 €. Combien d'actions ?", o: ["20", "50", "100", "200"], a: 1, e: "Risque = 100 €. Risque par action = 2 €. 100 / 2 = 50 actions." },
      { q: "Après une perte de 50 %, quel gain faut-il pour revenir à l'équilibre ?", o: ["+50 %", "+75 %", "+100 %", "+150 %"], a: 2, e: "100 → 50, puis 50 x 2 = 100. Il faut +100 %." },
      { q: "Avec un R/R de 3 et un taux de réussite de 40 %, avant frais, la stratégie est…", o: ["Perdante", "Gagnante", "Neutre", "Impossible à dire"], a: 1, e: "Espérance par trade = 0,4 x 3R − 0,6 x 1R = +0,6R : gagnante en théorie." }
    ]
  },
  {
    id: "psycho",
    title: "8. Psychologie et pièges classiques",
    level: "Essentiel",
    html: `
      <p>La plupart des erreurs viennent des émotions, pas d'un manque de connaissances.</p>
      <ul>
        <li><strong>FOMO</strong> (peur de rater) : acheter après une grosse hausse parce que « tout le monde en parle ».</li>
        <li><strong>Aversion à la perte</strong> : garder une position perdante en espérant un retour, tout en vendant trop tôt les gagnantes.</li>
        <li><strong>Surtrading</strong> : multiplier les opérations ; les frais grignotent la performance.</li>
        <li><strong>Revenge trading</strong> : prendre plus de risque pour « se refaire » après une perte.</li>
        <li><strong>Excès de confiance</strong> : après quelques gains, augmenter la taille sans raison.</li>
      </ul>
      <h4>Les antidotes</h4>
      <ul>
        <li>Un <strong>plan écrit</strong> avant d'entrer : entrée, stop, objectif, taille.</li>
        <li>Un <strong>journal de trading</strong> : note le pourquoi de chaque décision.</li>
        <li>Des règles de risque fixes que tu ne modifies pas en cours de route.</li>
      </ul>
      <div class="keep warn"><span class="k">Attention</span><p>Méfie-toi de toute promesse de « gains garantis », de signaux payants ou de « conseillers » qui te contactent en privé : ce sont des signaux d'arnaque classiques.</p></div>`,
    quiz: [
      { q: "Que désigne le FOMO ?", o: ["Un indicateur technique", "La peur de rater une opportunité qui pousse à acheter trop tard", "Un type d'ordre", "Un impôt"], a: 1, e: "Fear Of Missing Out : décision émotionnelle, souvent au plus mauvais moment." },
      { q: "Après une perte, tu doubles ta mise pour te refaire. C'est…", o: ["Du money management", "Du revenge trading, très dangereux", "De la diversification", "Une bonne pratique"], a: 1, e: "Augmenter le risque pour récupérer une perte est une des causes principales de ruine." },
      { q: "Quel est le meilleur moyen de progresser en continu ?", o: ["Éviter de noter ses erreurs", "Tenir un journal de trading", "Suivre des signaux payants", "Changer de stratégie à chaque perte"], a: 1, e: "Le journal te permet d'analyser objectivement ce qui marche ou non." }
    ]
  },
  {
    id: "fiscalite",
    title: "9. Enveloppes et frais (exemple France)",
    level: "Intermédiaire",
    html: `
      <p>Selon ton pays, les règles diffèrent. À titre d'exemple pour la <strong>France</strong> :</p>
      <ul>
        <li><strong>PEA</strong> : enveloppe pour actions et ETF européens, avantage fiscal après 5 ans de détention (hors prélèvements sociaux), plafond de versements (150 000 € pour le PEA classique). Il n'y a en général pas de minimum pour l'ouvrir. Il existe aussi le <strong>PEA-PME</strong> (petites et moyennes entreprises) et le <strong>PEA Jeune</strong> (18 à 25 ans, rattaché au foyer fiscal des parents, plafond plus bas).</li>
        <li><strong>ETF éligible au PEA</strong> : il doit être investi à au moins 75 % en actions européennes. Un ETF « monde » est donc parfois éligible grâce à un montage particulier : vérifie toujours l'éligibilité dans la fiche du fonds.</li>
        <li><strong>Compte-titres ordinaire (CTO)</strong> : sans plafond, accès à tous les marchés, flat tax sur les gains.</li>
        <li><strong>Assurance-vie</strong> : support long terme avec fonds en euros et unités de compte.</li>
      </ul>
      <h4>Les frais qui comptent</h4>
      <ul>
        <li>Frais de courtage (par ordre).</li>
        <li>Frais de gestion annuels des ETF/fonds (TER).</li>
        <li>Frais de change et spread.</li>
      </ul>
      <p>Sur du long terme, quelques dixièmes de pourcent de frais annuels font une grande différence à cause des intérêts composés.</p>
      <div class="keep warn"><span class="k">Bon à savoir</span><p>Cette leçon est une information générale, pas un conseil fiscal. Vérifie toujours les règles actuelles de ton pays auprès d'une source officielle.</p></div>`,
    quiz: [
      { q: "Pourquoi les frais sont-ils importants même s'ils paraissent faibles ?", o: ["Ils n'ont aucun effet", "Ils s'accumulent et réduisent le rendement sur la durée", "Ils augmentent les gains", "Ils sont remboursés"], a: 1, e: "Les frais sont certains, les gains non. Sur des années, leur effet cumulé est important." },
      { q: "Un PEA est destiné en priorité à…", o: ["Des actions et ETF éligibles (Europe)", "Des cryptomonnaies", "Des CFD", "Des devises"], a: 0, e: "Le PEA permet d'investir sur des actions/ETF européens éligibles." }
    ]
  },
  {
    id: "etf",
    title: "10. ETF : comment bien les choisir",
    level: "Intermédiaire",
    html: `
      <p>Un ETF indiciel est un moyen simple de s'exposer à tout un marché. Mais tous les ETF ne se valent pas : voici les critères à vérifier avant d'en acheter un.</p>
      <h4>1. L'indice suivi (le critère n°1)</h4>
      <p>L'ETF reproduit un indice. C'est lui qui détermine ce que tu possèdes : le <strong>MSCI World</strong> (grandes entreprises de pays développés), le <strong>S&amp;P 500</strong> (500 grandes entreprises américaines), le <strong>CAC 40</strong> (40 grandes entreprises françaises)… Un indice large donne plus de diversification qu'un indice concentré sur un pays ou un secteur.</p>
      <h4>2. Les frais</h4>
      <p>Les frais de gestion annuels (<strong>TER</strong>, ou frais courants) d'un ETF se situent souvent entre 0,05 % et 0,50 % par an, contre environ 1 % à 2,5 % pour un fonds géré activement. Sur 20 ans, cet écart pèse lourd à cause des intérêts composés.</p>
      <h4>3. La réplication</h4>
      <p>Réplication <strong>physique</strong> : le fonds achète réellement les titres de l'indice. Réplication <strong>synthétique</strong> : il utilise un contrat (swap) avec une banque pour reproduire la performance. Les deux existent ; vérifie laquelle est utilisée et pourquoi.</p>
      <h4>4. La taille (l'encours)</h4>
      <p>Un fonds très petit risque d'être fermé et sera moins liquide. Regarde l'<strong>encours</strong> (les sommes gérées) et le volume d'échange.</p>
      <h4>5. L'éligibilité à ton enveloppe</h4>
      <p>Si tu investis via un PEA, l'ETF doit y être éligible. Les ETF à <strong>distribution</strong> versent les dividendes ; ceux à <strong>capitalisation</strong> les réinvestissent automatiquement.</p>
      <h4>Les limites à connaître</h4>
      <ul>
        <li>Un ETF n'élimine pas le risque : si le marché baisse de 30 %, l'ETF baisse aussi.</li>
        <li>Un ETF « monde » est diversifié, mais pondéré par la taille des entreprises, avec une forte part d'entreprises américaines.</li>
        <li>Les performances passées ne garantissent rien.</li>
      </ul>
      <div class="keep"><span class="k">À retenir</span><p>Compare toujours : indice suivi, frais, méthode de réplication, taille du fonds, éligibilité à ton enveloppe. Les chiffres changent : vérifie-les sur la fiche officielle du fonds (DICI / document d'informations clés).</p></div>`,
    quiz: [
      { q: "Quel est le critère le plus important pour choisir un ETF ?", o: ["La couleur du logo de l'émetteur", "L'indice qu'il réplique", "Le nombre de ses publicités", "Son prix unitaire"], a: 1, e: "L'indice détermine ce que tu détiens réellement : c'est le premier critère, avant les frais et la taille." },
      { q: "Que mesure le TER d'un ETF ?", o: ["Ses frais de gestion annuels", "Son rendement garanti", "Le nombre de titres détenus", "Sa liquidité"], a: 0, e: "Le TER (Total Expense Ratio) correspond aux frais courants annuels, prélevés dans la valeur du fonds." },
      { q: "Un ETF à capitalisation…", o: ["Verse les dividendes sur ton compte", "Réinvestit automatiquement les dividendes", "Garantit le capital", "N'est jamais éligible au PEA"], a: 1, e: "À capitalisation, les dividendes sont réinvestis dans le fonds ; à distribution, ils te sont versés." }
    ]
  },
  {
    id: "trader",
    title: "Investisseur ou trader ?",
    level: "Débutant",
    html: `
      <p>On peut être présent sur les marchés de deux manières très différentes. Ce ne sont pas les mêmes métiers : les confondre pousse à prendre des décisions émotionnelles.</p>
      <div class="table-wrap"><table>
        <thead><tr><th></th><th>Investir (long terme)</th><th>Trader (court terme)</th></tr></thead>
        <tbody>
          <tr><td>Horizon</td><td>Plusieurs années</td><td>De quelques minutes à quelques semaines</td></tr>
          <tr><td>Méthode</td><td>Analyse des entreprises, diversification, souvent des ETF</td><td>Analyse des graphiques, étude des flux d'ordres</td></tr>
          <tr><td>Nombre d'opérations</td><td>Peu</td><td>Beaucoup</td></tr>
          <tr><td>Frais</td><td>Faibles, car peu d'opérations</td><td>S'accumulent vite</td></tr>
          <tr><td>Risque</td><td>Lissé par la durée et la diversification</td><td>Pertes rapides, surtout avec du levier</td></tr>
          <tr><td>Enveloppes (France)</td><td>PEA, assurance-vie, PER</td><td>Souvent le compte-titres ordinaire (CTO)</td></tr>
        </tbody>
      </table></div>
      <h4>Les frais de friction</h4>
      <p>Chaque opération a un coût : les <strong>frais de courtage</strong>, l'<strong>écart entre le prix d'achat et de vente</strong> (le <em>spread</em>) et le <strong>glissement de cours</strong> (<em>slippage</em>). Pris un par un, ils paraissent petits. Mais plus tu opères, plus ils s'additionnent et rognent ton rendement : <code>rendement net = rendement brut − frais − écarts</code>.</p>
      <p>Dans le simulateur, chaque ordre coûte 0,1 %. Cinquante allers-retours complets coûtent donc environ 10 % du capital engagé, avant même de parler de gain ou de perte.</p>
      <h4>Qui est fait pour quoi ?</h4>
      <p>Aucune approche n'est « meilleure » : elles répondent à des objectifs différents. Le simulateur de TrendScout te permet de pratiquer le court terme sans risque ; les niveaux 4 et suivants t'apprennent les bases de l'investissement durable.</p>
      <div class="keep warn"><span class="k">Attention</span><p>Le trading actif, surtout avec de l'effet de levier (CFD, Forex, options), peut faire perdre un capital très vite. Quand on débute, mieux vaut s'entraîner en simulation avant de risquer un euro.</p></div>`,
    quiz: [
      { q: "Quel est l'horizon habituel de l'investissement patrimonial ?", o: ["Quelques minutes", "Quelques jours", "Plusieurs années", "Une seule séance"], a: 2, e: "L'investisseur de long terme laisse le temps lisser les variations et limite le nombre d'opérations." },
      { q: "Que désigne le « slippage » ?", o: ["L'écart entre le prix attendu et le prix réellement obtenu", "Le dividende versé", "Une enveloppe fiscale", "La commission du courtier"], a: 0, e: "Il survient surtout avec un ordre au marché, sur un titre peu échangé ou quand le marché bouge vite." },
      { q: "Pourquoi faire beaucoup d'opérations réduit-il le rendement net ?", o: ["Les frais, écarts et glissements s'accumulent", "Les impôts disparaissent", "Le marché devient moins liquide", "Les dividendes augmentent"], a: 0, e: "Chaque opération coûte quelque chose : à force de répétition, ces coûts pèsent lourd." }
    ]
  },
  {
    id: "arnaques",
    title: "Vérifier avant de faire confiance",
    level: "Essentiel",
    html: `
      <p>Les arnaques financières visent surtout les débutants. Elles se reconnaissent à quelques signaux, et on peut les <strong>vérifier</strong> en quelques minutes.</p>
      <h4>Les signaux d'alerte</h4>
      <ul>
        <li>Des gains « garantis » ou « sans risque », surtout très élevés.</li>
        <li>Une <strong>urgence</strong> artificielle : « il reste 2 places », « offre valable ce soir ».</li>
        <li>Un contact que tu n'as pas demandé (réseaux sociaux, messagerie, appel).</li>
        <li>Un paiement inhabituel (virement vers l'étranger, cryptomonnaies, cartes prépayées).</li>
      </ul>
      <h4>La méthode : 4 réflexes</h4>
      <ul>
        <li><strong>1. Qui est-ce ?</strong> Vérifie que l'intermédiaire figure sur une <strong>liste blanche officielle</strong>. En France : <strong>REGAFI</strong> (banques et entreprises d'investissement), <strong>ORIAS</strong> (conseillers en investissements financiers, courtiers), <strong>GECO</strong> (fonds et sociétés de gestion, base de l'AMF).</li>
        <li><strong>2. Est-il signalé ?</strong> Consulte les <strong>listes noires</strong> et les signalements (l'AMF en publie, et propose l'outil <em>AMF Protect Épargne</em>).</li>
        <li><strong>3. Demande confirmation.</strong> En France, le service <em>Épargne Info Service</em> de l'AMF répond aux particuliers (vérifie le numéro sur le site officiel).</li>
        <li><strong>4. Prends ton temps.</strong> Parles-en à un proche. Une vraie opportunité n'expire pas dans l'heure.</li>
      </ul>
      <div class="keep"><span class="k">Règle d'or</span><p>Figurer sur une liste blanche est une condition <strong>nécessaire</strong> (et ne dit rien de la qualité du produit). Ne <em>pas</em> figurer sur une liste noire ne prouve <strong>rien</strong> : de nouveaux sites frauduleux apparaissent chaque jour.</p></div>
      <h4>Les influenceurs</h4>
      <p>En France, une loi de 2023 encadre l'influence commerciale et interdit de promouvoir certains produits très spéculatifs (contrats à effet de levier comme les CFD, Forex, options) ou des services sur crypto-actifs non enregistrés. Si un influenceur t'en vante un « sans risque », c'est un signal d'alerte de plus.</p>
      <div class="keep warn"><span class="k">À savoir</span><p>Ces exemples sont français. Dans un autre pays, cherche le régulateur local et ses registres officiels.</p></div>`,
    quiz: [
      { q: "Quelle vérification est la plus importante avant de transférer de l'argent à un intermédiaire ?", o: ["Qu'il a beaucoup d'abonnés", "Qu'il figure sur une liste blanche officielle (ex. REGAFI, ORIAS)", "Qu'il répond vite", "Qu'il offre un bonus"], a: 1, e: "L'agrément sur un registre officiel est la condition de base. Le reste (abonnés, rapidité, bonus) ne prouve rien." },
      { q: "Un site n'apparaît sur aucune liste noire. Que peut-on en conclure ?", o: ["Qu'il est sûr", "Rien de certain : de nouveaux sites frauduleux apparaissent chaque jour", "Qu'il est agréé", "Qu'il est gratuit"], a: 1, e: "L'absence de liste noire est nécessaire mais insuffisante. C'est la présence sur une liste blanche qui compte." },
      { q: "Un influenceur te vante un produit à levier « sans risque ». Tu…", o: ["Investis vite", "Te méfies : promesse irréaliste et produit très spéculatif", "Partages le lien", "Envoies un acompte"], a: 1, e: "« Sans risque » et fortes promesses de gains sont des signaux d'alerte, surtout pour des produits à effet de levier." }
    ]
  },
  {
    id: "budget",
    title: "Ton budget avant la bourse",
    level: "Essentiel",
    html: `
      <p>Avant de placer le moindre euro, il faut une base solide. Sinon, la première mauvaise surprise te force à vendre au pire moment.</p>
      <h4>Épargner, ce n'est pas investir</h4>
      <ul>
        <li><strong>Épargner</strong> : mettre de côté sur des supports <strong>sécurisés et disponibles</strong>, pour les imprévus.</li>
        <li><strong>Investir</strong> : placer sur des actifs de long terme, en acceptant des variations et un risque de perte, pour viser un rendement supérieur à l'inflation.</li>
      </ul>
      <h4>Un repère : la règle 50-30-20</h4>
      <ul>
        <li><strong>50 %</strong> de tes revenus nets pour les besoins (logement, nourriture, factures).</li>
        <li><strong>30 %</strong> pour les envies et les loisirs.</li>
        <li><strong>20 %</strong> pour l'épargne et l'investissement.</li>
      </ul>
      <p>C'est un <em>repère</em>, pas une loi : adapte les pourcentages à ta situation.</p>
      <h4>L'épargne de précaution</h4>
      <p>C'est ta réserve pour les imprévus (panne, perte d'emploi, frais de santé). Un repère courant : l'équivalent de <strong>3 mois de revenus</strong>, sur un support sécurisé et disponible, par exemple un livret réglementé.</p>
      <div class="keep"><span class="k">À retenir</span><p>L'argent dont tu peux avoir besoin bientôt n'a pas sa place sur des supports qui varient fortement. Constitue d'abord ta réserve.</p></div>`,
    quiz: [
      { q: "Dans la règle 50-30-20, que représentent les 20 % ?", o: ["Les loisirs", "L'épargne et l'investissement", "Le loyer", "Les impôts"], a: 1, e: "50 % pour les besoins, 30 % pour les envies, 20 % pour l'épargne et l'investissement." },
      { q: "À quoi sert l'épargne de précaution ?", o: ["Viser un gros gain en bourse", "Faire face aux imprévus, sur un support sécurisé et disponible", "Payer les frais de courtage", "Acheter des actions en direct"], a: 1, e: "C'est une réserve : elle doit rester disponible et protégée des variations de marché." },
      { q: "Quelle différence entre épargner et investir ?", o: ["Il n'y en a aucune", "Épargner = sécurité et disponibilité ; investir = long terme, avec variations et risque de perte", "Investir est garanti", "Épargner est risqué"], a: 1, e: "Épargner protège pour les imprévus ; investir accepte le risque pour viser davantage sur la durée." }
    ]
  },
  {
    id: "composes",
    title: "Les intérêts composés et l'investissement régulier",
    level: "Intermédiaire",
    html: `
      <h4>Intérêts simples ou composés ?</h4>
      <p>Avec des <strong>intérêts simples</strong>, seuls tes euros de départ rapportent. Avec des <strong>intérêts composés</strong>, les intérêts déjà gagnés rapportent à leur tour : c'est « les intérêts sur les intérêts ».</p>
      <ul>
        <li>Simples : <code>V = V0 × (1 + n × r)</code></li>
        <li>Composés : <code>V = V0 × (1 + r)<sup>n</sup></code></li>
      </ul>
      <h4>Un exemple (hypothèse pédagogique)</h4>
      <p>10 000 € placés à <strong>5 % par an</strong> (un taux choisi pour l'exemple, ni une prévision ni une promesse) :</p>
      <div class="table-wrap"><table>
        <thead><tr><th>Durée</th><th>Gain en intérêts simples</th><th>Gain en intérêts composés</th></tr></thead>
        <tbody>
          <tr><td>10 ans</td><td>5 000 €</td><td>6 289 €</td></tr>
          <tr><td>20 ans</td><td>10 000 €</td><td>16 533 €</td></tr>
          <tr><td>30 ans</td><td>15 000 €</td><td>33 219 €</td></tr>
        </tbody>
      </table></div>
      <p>Le temps est le moteur : sur 30 ans, <strong>la moitié des gains</strong> vient des 10 dernières années.</p>
      <h4>L'investissement régulier</h4>
      <p>Plutôt que de placer une grosse somme un jour précis, on peut verser <strong>la même somme chaque mois</strong> : c'est l'<em>investissement programmé</em> (<em>DCA</em>, <em>dollar-cost averaging</em>). Tu évites de décider « au bon moment » et tu lisses ton prix d'achat moyen. Attention : cela ne protège pas d'une baisse durable du marché.</p>
      <h4>Ce qui rogne le résultat</h4>
      <p>Les <strong>frais</strong> (surtout répétés chaque année) et l'<strong>inflation</strong> (qui réduit le pouvoir d'achat) diminuent ce que tu gardes vraiment. Teste l'effet dans <em>Outils → Intérêts composés</em>.</p>
      <div class="keep warn"><span class="k">Attention</span><p>Ces calculs illustrent un mécanisme. Ils ne disent pas ce que tu obtiendras : les marchés montent et descendent, et un taux régulier n'existe pas en bourse.</p></div>`,
    quiz: [
      { q: "Avec des intérêts composés, les intérêts…", o: ["Sont calculés uniquement sur le capital de départ", "Sont aussi calculés sur les intérêts déjà gagnés", "Sont toujours garantis", "Disparaissent après 10 ans"], a: 1, e: "C'est le principe : les intérêts gagnés rapportent à leur tour, ce qui accélère la croissance avec le temps." },
      { q: "À 5 % par an (hypothèse), 10 000 € placés 30 ans en intérêts composés produisent un gain proche de…", o: ["5 000 €", "15 000 €", "33 000 €", "50 000 €"], a: 2, e: "10 000 x 1,05^30 ≈ 43 219 €, soit environ 33 200 € de gain. En intérêts simples, ce serait 15 000 €." },
      { q: "L'investissement programmé (DCA), c'est…", o: ["Tout acheter le même jour", "Verser régulièrement la même somme, quel que soit le cours", "Vendre à chaque baisse", "Un produit garanti"], a: 1, e: "On verse un montant régulier : on lisse le prix d'achat moyen, sans garantie contre une baisse durable." }
    ]
  },
  {
    id: "echelle",
    title: "Rendement, risque et horizon",
    level: "Intermédiaire",
    html: `
      <p>Un principe simple, valable partout : <strong>plus un placement peut rapporter, plus il peut aussi faire perdre</strong>. Un rendement très élevé sans risque n'existe pas.</p>
      <h4>L'échelle du risque (du plus prudent au plus exposé)</h4>
      <ul>
        <li><strong>Livrets réglementés</strong> : sécurisés et disponibles, rendement limité.</li>
        <li><strong>Fonds en euros</strong> (assurance-vie) : capital garanti en totalité ou en grande partie par l'assureur, rendement limité.</li>
        <li><strong>SCPI</strong> (immobilier indirect) : revenus locatifs, mais valeur qui peut baisser et revente parfois difficile.</li>
        <li><strong>Unités de compte, ETF, actions</strong> : non garantis. Le capital peut être perdu en partie ou en totalité.</li>
      </ul>
      <h4>L'horizon de placement</h4>
      <p>C'est la durée pendant laquelle tu peux laisser ton argent investi sans en avoir besoin. L'argent dont tu auras besoin dans 6 mois n'a rien à faire sur des actions. Plus l'horizon est long, plus les variations ont le temps de se lisser (sans garantie).</p>
      <h4>Ton profil d'investisseur</h4>
      <p>Il dépend de ta situation, de tes objectifs, de ton horizon et de ta tolérance au risque. Une bonne question : « Comment réagirais-je si mon portefeuille perdait 20 % ? » Si la réponse est « je vendrais tout », le niveau de risque est trop élevé pour toi.</p>
      <div class="keep"><span class="k">À retenir</span><p>Ce cadre aide à réfléchir, il ne remplace pas un conseil personnalisé. Pose-toi toujours trois questions : pour quoi ? pour combien de temps ? combien de baisse puis-je supporter ?</p></div>`,
    quiz: [
      { q: "Un placement promet un rendement très élevé « sans aucun risque ». C'est…", o: ["Une bonne affaire", "Très suspect : rendement élevé et risque faible vont rarement ensemble", "Garanti par l'État", "Réservé aux professionnels"], a: 1, e: "Plus le rendement possible est élevé, plus le risque l'est aussi. Une promesse contraire est un signal d'alerte." },
      { q: "Lequel est généralement le plus exposé au risque de perte en capital ?", o: ["Un livret réglementé", "Un fonds en euros", "Des actions individuelles", "L'épargne de précaution"], a: 2, e: "Les actions ne sont pas garanties et peuvent perdre une grande partie de leur valeur." },
      { q: "Tu auras besoin d'une somme dans 6 mois. Le plus cohérent pour elle est…", o: ["Des actions pour viser un gros gain", "Un support sécurisé et disponible", "Un produit à levier", "Un CFD"], a: 1, e: "Quand l'horizon est court, on privilégie la sécurité et la disponibilité plutôt que le risque." }
    ]
  }
];

// Parcours : 4 niveaux, chacun terminé par un examen de 6 questions nouvelles.
// L'ordre des leçons suit la progression conseillée (la gestion du risque passe avant l'analyse).
const MODULES = [
  {
    id: "n1", short: "Les bases", title: "Les bases", goal: "Comprendre ce qu'est la bourse, les principaux produits et lire un graphique.",
    lessons: ["bourse", "trader", "produits", "graphique"],
    exam: [
      { q: "Une entreprise cotée émet des actions principalement pour…", o: ["Rembourser ses actionnaires", "Lever des capitaux sans emprunter", "Réduire ses impôts", "Fixer le prix de ses produits"], a: 1, e: "En vendant des parts de son capital, l'entreprise obtient des fonds sans avoir à les rembourser comme une dette." },
      { q: "Quelle est la différence entre un dividende et une plus-value ?", o: ["Le dividende vient de la revente, la plus-value du bénéfice", "Le dividende est versé par l'entreprise, la plus-value vient d'une revente à un prix plus élevé", "Il n'y a aucune différence", "La plus-value est toujours garantie"], a: 1, e: "Le dividende est une part des bénéfices distribuée. La plus-value est le gain réalisé en revendant plus cher qu'à l'achat." },
      { q: "Pourquoi un ETF large est-il moins risqué qu'une seule action ?", o: ["Il est garanti par l'État", "Il répartit l'investissement sur de nombreuses entreprises", "Il ne baisse jamais", "Il est géré par des experts qui battent toujours le marché"], a: 1, e: "La diversification réduit l'impact d'une mauvaise performance isolée. Elle ne supprime pas le risque de marché." },
      { q: "Sur un chandelier, une très longue mèche haute indique que…", o: ["Le volume était nul", "Le prix est monté haut puis a été repoussé vers le bas", "L'entreprise a versé un dividende", "Le marché était fermé"], a: 1, e: "Les acheteurs ont poussé le prix vers le haut, mais les vendeurs ont repris la main avant la clôture." },
      { q: "Une obligation rapporte en général…", o: ["Des dividendes variables", "Des intérêts (coupons) fixés à l'avance", "Une part des bénéfices", "Rien, sauf si le prix monte"], a: 1, e: "L'émetteur verse un coupon et rembourse le capital à l'échéance, sauf défaut." },
      { q: "Pourquoi un débutant a-t-il intérêt à regarder le graphique journalier plutôt que celui à la minute ?", o: ["Les frais disparaissent", "Il y a moins de bruit aléatoire et moins de décisions impulsives", "Les prix sont garantis", "C'est obligatoire"], a: 1, e: "Sur de courtes échelles, le hasard domine et on est tenté de trader trop souvent." },
      { q: "Quelle approche vise surtout à profiter de la croissance des entreprises sur plusieurs années ?", o: ["Le day trading", "L'investissement patrimonial de long terme", "Le trading à la minute", "La vente à découvert"], a: 1, e: "L'investisseur de long terme mise sur la durée, la diversification et un faible nombre d'opérations." },
      { q: "Chaque opération coûte (frais, écart achat/vente, glissement). Que se passe-t-il si tu en fais énormément ?", o: ["Rien, ces coûts sont remboursés", "Ces coûts s'accumulent et réduisent le rendement net", "Le rendement augmente mécaniquement", "Les coûts n'existent qu'à la vente"], a: 1, e: "Les frais de friction s'additionnent : plus on opère, plus ils pèsent sur le résultat final." }
    ]
  },
  {
    id: "n2", short: "Les ordres", title: "Passer des ordres sans se ruiner", goal: "Acheter, vendre, limiter ses pertes et garder la tête froide.",
    lessons: ["ordres", "risque", "psycho", "arnaques"],
    exam: [
      { q: "Tu veux acheter à 40 € maximum, quitte à ne pas être exécuté. Quel ordre utilises-tu ?", o: ["Au marché", "À cours limité", "Stop", "Aucun"], a: 1, e: "L'ordre à cours limité garantit que tu ne paies pas plus que ton prix, mais il peut ne jamais être exécuté." },
      { q: "Capital 5 000 €, risque 2 % par trade. Quelle perte maximale acceptes-tu sur ce trade ?", o: ["10 €", "50 €", "100 €", "500 €"], a: 2, e: "2 % de 5 000 € = 100 €." },
      { q: "Entrée 20 €, stop 18 €, perte maximale 60 €. Combien de titres peux-tu prendre ?", o: ["15", "30", "60", "120"], a: 1, e: "Risque par titre = 2 €. 60 / 2 = 30 titres." },
      { q: "Un trade a un ratio gain/risque de 1:2. Si tu risques 50 €, le gain visé est de…", o: ["25 €", "50 €", "100 €", "200 €"], a: 2, e: "Un ratio de 1:2 signifie que le gain visé vaut 2 fois le risque : 2 x 50 € = 100 €." },
      { q: "Tu viens de perdre sur un trade et tu doubles la mise sur le suivant pour te refaire. C'est…", o: ["Une bonne gestion du risque", "Du revenge trading", "De la diversification", "Un ordre limité"], a: 1, e: "Augmenter le risque pour récupérer une perte est une des causes principales de ruine." },
      { q: "Comment limiter l'impact d'un gap défavorable (ouverture bien en dessous de ton stop) ?", o: ["Ne jamais placer de stop", "Réduire la taille de la position", "Acheter davantage", "Ignorer les annonces"], a: 1, e: "Un gap peut sauter ton stop. Une position plus petite limite la perte réelle." },
      { q: "Un ordre stop-limit présente surtout le risque…", o: ["D'être exécuté à n'importe quel prix", "De ne pas être exécuté si le cours saute au-delà de la plage fixée", "De ne jamais se déclencher", "De coûter plus cher en frais"], a: 1, e: "Le prix est encadré, mais si le cours franchit ta limite d'un coup, l'ordre peut rester sans exécution." },
      { q: "Avant de confier de l'argent à un intermédiaire, tu vérifies d'abord…", o: ["Son nombre d'abonnés", "Sa présence sur un registre officiel (REGAFI, ORIAS…)", "La couleur de son site", "Ses promesses de rendement"], a: 1, e: "L'agrément sur une liste blanche officielle est la première vérification. Les promesses ne prouvent rien." }
    ]
  },
  {
    id: "n3", short: "Analyser", title: "Analyser un marché", goal: "Repérer une tendance, utiliser les indicateurs et évaluer une entreprise.",
    lessons: ["technique", "fondamentale"],
    exam: [
      { q: "Le prix casse une résistance et la dépasse. Que devient souvent ce niveau ?", o: ["Il disparaît", "Un support", "Une moyenne mobile", "Un dividende"], a: 1, e: "Un niveau cassé change souvent de rôle : l'ancienne résistance devient un support." },
      { q: "La SMA 20 passe au-dessus de la SMA 50. Ce signal est…", o: ["Une garantie de hausse", "Un signal haussier classique, mais fragile en marché latéral", "Un signal de vente certain", "Sans rapport avec la tendance"], a: 1, e: "Il peut annoncer une hausse, mais il produit beaucoup de faux signaux quand le marché oscille sans direction." },
      { q: "Un RSI à 25 signifie…", o: ["Que le prix va forcément monter", "Que le titre est en zone « survendue », sans garantie de rebond", "Que l'entreprise est en faillite", "Que le volume est faible"], a: 1, e: "Le RSI mesure la force récente du mouvement. Une zone extrême n'est pas un signal de retournement automatique." },
      { q: "Une entreprise affiche un PER de 8 dans un secteur où la moyenne est 20. Que peut-on dire ?", o: ["Qu'elle est forcément sous-évaluée", "Qu'elle est peut-être bon marché, ou en difficulté : il faut chercher pourquoi", "Qu'elle est trop chère", "Que son dividende est élevé"], a: 1, e: "Un PER bas peut être une aubaine ou le signe d'un déclin attendu des bénéfices." },
      { q: "Pourquoi compare-t-on le PER d'une entreprise à celui de son secteur ?", o: ["Les secteurs ont des niveaux de valorisation différents", "Pour calculer le dividende", "Pour connaître l'encours", "Parce que c'est obligatoire"], a: 0, e: "Un PER de 25 est courant dans certains secteurs de croissance et élevé dans d'autres." },
      { q: "En tendance baissière, un trader prudent…", o: ["Achète à chaque petite hausse sans stop", "Évite de lutter contre la tendance et réduit son risque", "Double sa position", "N'utilise jamais d'indicateurs"], a: 1, e: "Aller contre la tendance expose à des pertes répétées : mieux vaut réduire la taille ou rester à l'écart." }
    ]
  },
  {
    id: "n4", short: "La durée", title: "Investir sur la durée", goal: "Choisir ses ETF, comprendre les enveloppes et maîtriser les frais.",
    lessons: ["budget", "composes", "echelle", "etf", "fiscalite"],
    exam: [
      { q: "Deux ETF suivent le même indice : l'un a 0,20 % de frais par an, l'autre 0,60 %. Lequel est préférable, toutes choses égales ?", o: ["Celui à 0,60 %", "Celui à 0,20 %", "Aucun écart", "Celui au nom le plus long"], a: 1, e: "À performance égale, des frais plus faibles laissent plus de rendement à l'investisseur, année après année." },
      { q: "Un ETF à distribution…", o: ["Réinvestit les dividendes", "Verse les dividendes aux porteurs", "Garantit un revenu fixe", "Est interdit dans un PEA"], a: 1, e: "À distribution, les dividendes te sont versés ; à capitalisation, ils sont réinvestis." },
      { q: "Pour être éligible au PEA, un ETF doit notamment être investi à…", o: ["100 % en obligations", "Au moins 75 % en actions européennes", "Au moins 50 % en cryptomonnaies", "Aucune condition"], a: 1, e: "C'est une condition d'éligibilité. Vérifie toujours la fiche du fonds." },
      { q: "Que mesure l'encours d'un ETF ?", o: ["Son rendement annuel", "Le montant total qu'il gère", "Son nombre de lignes", "Ses frais"], a: 1, e: "L'encours est la somme des actifs gérés par le fonds. Un fonds très petit risque d'être fermé." },
      { q: "Pourquoi les frais annuels comptent-ils sur le long terme ?", o: ["Ils sont remboursés", "Ils sont prélevés chaque année et s'accumulent, ce qui réduit le rendement", "Ils augmentent le rendement", "Ils sont fixes pour toujours"], a: 1, e: "Les gains sont incertains, les frais sont certains. Avec les intérêts composés, l'écart grandit avec le temps." },
      { q: "Un portefeuille investi dans un seul ETF « monde » est…", o: ["Sans aucun risque", "Très diversifié, mais exposé aux baisses du marché", "Garanti par l'indice", "Réservé aux professionnels"], a: 1, e: "La diversification réduit le risque propre à une entreprise, pas le risque de marché." },
      { q: "Pourquoi l'horizon de placement est-il important ?", o: ["Il garantit le rendement", "L'argent dont tu as besoin bientôt n'a pas sa place sur des supports qui varient fortement", "Il supprime les frais", "Il est imposé par la loi"], a: 1, e: "Plus l'horizon est court, plus la sécurité et la disponibilité priment sur la recherche de rendement." },
      { q: "Les intérêts composés produisent une croissance…", o: ["Linéaire", "De plus en plus rapide avec le temps", "Nulle", "Négative"], a: 1, e: "Comme les intérêts rapportent à leur tour, la courbe s'accélère : c'est l'effet « boule de neige »." }
    ]
  }
];

const GLOSSARY = [
  ["Assurance-vie", "Enveloppe d'épargne française polyvalente, avec des fonds en euros (capital garanti) et des unités de compte (non garanties)."],
  ["Avis d'opéré", "Document envoyé par ton intermédiaire après un ordre : sens, titre, quantité, cours, horodatage et frais."],
  ["CTO", "Compte-titres ordinaire : compte sans plafond permettant d'accéder à de nombreux marchés. Souvent utilisé pour le trading."],
  ["Day trading", "Acheter et vendre dans la même journée, pour profiter de petits mouvements de prix."],
  ["DCA (investissement programmé)", "Verser la même somme à intervalles réguliers, quel que soit le cours (dollar-cost averaging)."],
  ["DIC", "Document d'informations clés : fiche standardisée qui résume les objectifs, les risques et les coûts d'un produit."],
  ["Épargne de précaution", "Réserve disponible pour les imprévus, sur un support sécurisé. Repère courant : environ 3 mois de revenus."],
  ["Fonds en euros", "Support d'assurance-vie dont le capital est garanti en totalité ou en grande partie par l'assureur."],
  ["Frais de friction (fee drag)", "Érosion de la performance causée par les frais, les écarts achat/vente et les glissements cumulés."],
  ["GECO", "Base de données de l'AMF pour vérifier les fonds et les sociétés de gestion agréés (France)."],
  ["Horizon de placement", "Durée pendant laquelle tu peux laisser ton argent investi sans en avoir besoin."],
  ["Inflation", "Hausse générale des prix : l'argent qui dort perd peu à peu du pouvoir d'achat."],
  ["Intérêts composés", "Intérêts calculés aussi sur les intérêts déjà gagnés : la croissance s'accélère avec le temps."],
  ["Liste blanche", "Registre officiel des acteurs autorisés (REGAFI, ORIAS, GECO…). En faire partie est nécessaire, pas suffisant."],
  ["Liste noire", "Liste de sites ou d'acteurs signalés pour exercice illégal ou usurpation. Ne pas y figurer ne prouve rien."],
  ["Meilleure limite", "Ordre sans prix affiché : il prend automatiquement le meilleur prix en tête du carnet à cet instant."],
  ["ORIAS", "Registre français des intermédiaires en banque, assurance et finance, dont les conseillers en investissements financiers."],
  ["Ordre à plage de déclenchement (stop-limit)", "Quand un seuil est franchi, un ordre à cours limité se déclenche : prix encadré, mais risque de non-exécution."],
  ["Ordre à seuil de déclenchement (stop)", "Quand le prix franchit un seuil, un ordre au marché se déclenche. C'est l'outil du stop-loss."],
  ["PER", "Plan d'épargne retraite : enveloppe française pour préparer la retraite."],
  ["Profil d'investisseur", "Ta situation, tes objectifs, ton horizon et ta tolérance au risque : ce qui détermine le niveau de risque adapté."],
  ["Règle 50-30-20", "Repère budgétaire : 50 % pour les besoins, 30 % pour les envies, 20 % pour l'épargne et l'investissement."],
  ["REGAFI", "Registre officiel des agréments des établissements bancaires et d'investissement en France."],
  ["Règlement-livraison", "Délai entre l'exécution d'un ordre et le transfert effectif des titres et de l'argent (souvent 2 jours ouvrés en Europe)."],
  ["SCPI", "Société civile de placement immobilier : immobilier indirect, avec revenus locatifs et risque de perte de valeur ou de revente difficile."],
  ["Slippage (glissement de cours)", "Écart entre le prix attendu d'un ordre et le prix réellement obtenu."],
  ["Swing trading", "Prendre des positions de quelques jours à quelques semaines pour profiter d'un mouvement."],
  ["Unités de compte (UC)", "Supports d'assurance-vie investis en fonds, ETF ou actions : non garantis, avec un risque de perte en capital."],
  ["Action", "Titre représentant une part du capital d'une entreprise."],
  ["Ask", "Meilleur prix auquel un vendeur accepte de vendre."],
  ["Bid", "Meilleur prix auquel un acheteur accepte d'acheter."],
  ["Bull market", "Marché haussier : tendance générale à la hausse."],
  ["Bear market", "Marché baissier : tendance générale à la baisse (souvent −20 % ou plus depuis le sommet)."],
  ["BPA", "Bénéfice par action : résultat net divisé par le nombre d'actions."],
  ["Capitalisation boursière", "Cours de l'action x nombre d'actions : valeur de l'entreprise en bourse."],
  ["CFD", "Contrat sur la différence, produit à effet de levier très risqué pour les débutants."],
  ["Chandelier", "Représentation d'une période avec ouverture, plus haut, plus bas et clôture."],
  ["Courtier (broker)", "Intermédiaire qui passe tes ordres en bourse."],
  ["Diversification", "Répartir ses investissements pour réduire le risque lié à un seul actif."],
  ["Dividende", "Part des bénéfices versée aux actionnaires."],
  ["Drawdown", "Baisse entre un sommet et un creux de ton capital ou d'un actif."],
  ["ETF", "Fonds coté qui réplique un indice ou un panier d'actifs."],
  ["FOMO", "Fear Of Missing Out : peur de rater une hausse."],
  ["Gap", "Écart de prix entre la clôture d'une séance et l'ouverture suivante."],
  ["Indice", "Panier de titres mesurant un marché (CAC 40, S&P 500…)."],
  ["Levier", "Mécanisme qui multiplie l'exposition (et donc gains et pertes)."],
  ["Liquidité", "Facilité à acheter/vendre sans faire bouger le prix."],
  ["Obligation", "Titre de créance : prêt rémunéré à un État ou une entreprise."],
  ["Ordre au marché", "Ordre exécuté immédiatement au meilleur prix disponible."],
  ["Ordre limité", "Ordre exécuté seulement au prix fixé ou mieux."],
  ["PER", "Cours / bénéfice par action. Mesure combien tu paies pour 1 € de bénéfice."],
  ["Plus-value", "Gain réalisé lors de la revente à un prix supérieur à l'achat."],
  ["Position", "Quantité d'un titre que tu détiens (ou vends à découvert)."],
  ["R/R (risque/rendement)", "Rapport entre le gain potentiel et la perte potentielle d'un trade."],
  ["Résistance", "Niveau de prix où la hausse a tendance à s'arrêter."],
  ["RSI", "Relative Strength Index : indicateur de momentum entre 0 et 100."],
  ["SMA", "Simple Moving Average : moyenne mobile simple des N derniers cours."],
  ["Spread", "Écart entre le prix d'achat et de vente."],
  ["Stop-loss", "Ordre qui ferme une position si le prix atteint un seuil de perte défini."],
  ["Support", "Niveau de prix où la baisse a tendance à s'arrêter."],
  ["Take-profit", "Ordre de vente à un prix cible pour encaisser un gain."],
  ["Encours", "Montant total des sommes gérées par un fonds ou un ETF."],
  ["MSCI World", "Indice regroupant de grandes entreprises de pays développés, très utilisé comme référence pour un ETF « monde »."],
  ["PEA", "Plan d'épargne en actions (France) : enveloppe pour actions et ETF européens avec avantage fiscal après 5 ans."],
  ["Réplication", "Méthode utilisée par un ETF pour reproduire son indice : physique (achat des titres) ou synthétique (via un swap)."],
  ["S&P 500", "Indice des 500 grandes entreprises cotées aux États-Unis."],
  ["TER (frais courants)", "Frais de gestion annuels d'un fonds ou d'un ETF, exprimés en pourcentage de l'encours."],
  ["Tendance", "Direction générale du prix (haussière, baissière, latérale)."],
  ["Volatilité", "Ampleur des variations de prix d'un actif."],
  ["Volume", "Nombre de titres échangés sur une période."]
];

// Ressources indépendantes de TrendScout (sites officiels et pédagogiques). Aucun lien d'affiliation.
const RESOURCES = [
  { group: "Apprendre, gratuitement", items: [
    { title: "MOOC « Comment gérer efficacement son épargne et ses placements ? »", org: "AMF et INC, sur FUN-MOOC", what: "3 modules : le rôle et le profil de l'investisseur, les placements financiers, le fonctionnement pratique et la prévention des arnaques. Gratuit, avec attestation de suivi.", url: "https://www.fun-mooc.fr", site: "fun-mooc.fr" },
    { title: "Espace Épargnants et « Mon épargne clé en main »", org: "AMF (avec l'INC)", what: "Fiches pratiques et guides sur les actions, les obligations, le PEA, l'assurance-vie, les frais, le rendement et les arnaques.", url: "https://www.amf-france.org", site: "amf-france.org" },
    { title: "Mes questions d'argent", org: "Banque de France", what: "Budget, épargne, frais, fiscalité, calcul des rendements nets. Des synthèses neutres.", url: "https://www.mesquestionsdargent.fr", site: "mesquestionsdargent.fr" },
    { title: "La finance pour tous", org: "Site pédagogique indépendant", what: "Articles, vidéos, quiz sur le risque et calculateur d'épargne : rendement, risque, horizon, règle 50-30-20.", url: "https://www.lafinancepourtous.com", site: "lafinancepourtous.com" },
    { title: "Wikifin", org: "FSMA (Belgique)", what: "Éducation financière en français, simulateurs et informations neutres. Attention : cadre réglementaire belge.", url: "https://www.wikifin.be", site: "wikifin.be" },
    { title: "L'Investisseur intelligent", org: "Benjamin Graham (livre)", what: "Un classique de l'investissement de long terme et de la gestion du risque. Souvent disponible en bibliothèque.", url: "", site: "" }
  ] },
  { group: "Vérifier avant d'investir (France)", items: [
    { title: "REGAFI", org: "ACPR / Banque de France", what: "Registre des agréments : vérifie qu'une banque ou une entreprise d'investissement est autorisée.", url: "https://www.regafi.fr", site: "regafi.fr" },
    { title: "ORIAS", org: "Registre officiel", what: "Vérifie l'immatriculation d'un conseiller en investissements financiers, d'un courtier ou d'un intermédiaire.", url: "https://www.orias.fr", site: "orias.fr" },
    { title: "GECO", org: "AMF", what: "Vérifie l'agrément d'un fonds ou d'une société de gestion.", url: "https://geco.amf-france.org", site: "geco.amf-france.org" },
    { title: "AMF Protect Épargne et Épargne Info Service", org: "AMF", what: "Liste noire et outil pour signaler ou vérifier un site, et service d'information pour lever un doute avant d'investir. Les coordonnées sont sur le site de l'AMF.", url: "https://www.amf-france.org", site: "amf-france.org" }
  ] },
  { group: "Te protéger", items: [
    { title: "Garantie des dépôts et des titres", org: "FGDR", what: "Ce qui est protégé (comptes, livrets, titres) si ton établissement est défaillant, et comment être indemnisé.", url: "https://www.garantiedesdepots.fr", site: "garantiedesdepots.fr" },
    { title: "Kit de survie contre les arnaques", org: "Banque de France (Mes questions d'argent)", what: "Contacts et outils pour reconnaître une arnaque et savoir quoi faire.", url: "https://www.mesquestionsdargent.fr", site: "mesquestionsdargent.fr" }
  ] },
  { group: "Aller plus loin", items: [
    { title: "Certification AMF Généraliste", org: "AMF, via des organismes agréés", what: "Examen de 120 questions (2 heures, seuil de 80 %) pour les professionnels ou les passionnés qui veulent valider leurs connaissances.", url: "", site: "" }
  ] }
];

// Feuille de route en 5 étapes (inspirée des guides des régulateurs). Ce n'est pas un conseil en investissement.
const ROADMAP = [
  { n: 1, title: "Poser les bases", txt: "Passe tes dépenses au crible avec la règle 50-30-20, constitue une épargne de précaution, comprends l'inflation et les intérêts composés.", where: "Niveau 4 : « Ton budget avant la bourse », « Les intérêts composés », et l'outil Intérêts composés.", to: "#learn" },
  { n: 2, title: "Connaître les produits et les enveloppes", txt: "Comprends actions, ETF, obligations, PEA, assurance-vie, PER, et apprends à lire un document d'informations clés.", where: "Niveaux 1 et 4 : produits, ETF, enveloppes, rendement et risque. Le MOOC AMF/INC complète très bien.", to: "#learn" },
  { n: 3, title: "T'entraîner en simulation", txt: "Pratique plusieurs semaines en environnement fictif : passer des ordres, poser un stop, supporter les variations sans risquer un euro.", where: "Le simulateur et l'Aventure.", to: "#sim" },
  { n: 4, title: "Aller vers le réel, progressivement", txt: "Si un jour tu choisis d'investir pour de vrai : vérifie l'intermédiaire sur les registres officiels, compare les frais, investis régulièrement. Beaucoup de ressources déconseillent le levier et les produits complexes au début.", where: "Niveau 2 : « Vérifier avant de faire confiance ».", to: "#learn" },
  { n: 5, title: "Continuer à te former", txt: "Lis, suis des formations gratuites, garde un esprit critique face aux contenus commerciaux (les académies de courtiers servent aussi à recruter des clients).", where: "La liste de ressources ci-dessus.", to: "#resources" }
];
