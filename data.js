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
      <h4>Ordre au marché</h4>
      <p>Exécuté tout de suite au meilleur prix disponible. Rapide, mais le prix obtenu peut différer de celui affiché (<em>slippage</em>), surtout sur les titres peu échangés.</p>
      <h4>Ordre à cours limité</h4>
      <p>Tu fixes le prix maximum d'achat (ou minimum de vente). Tu contrôles le prix, mais l'ordre peut ne jamais être exécuté.</p>
      <h4>Ordre stop (stop-loss)</h4>
      <p>Se déclenche si le prix touche un seuil défavorable, pour <strong>limiter la perte</strong>. Exemple : tu achètes à 100 €, tu places un stop à 95 € : si le cours tombe à 95 €, tu sors avec ~5 % de perte au lieu de subir une chute plus grande.</p>
      <h4>Objectif (take-profit)</h4>
      <p>Ordre de vente à un prix cible pour sécuriser le gain.</p>
      <div class="keep warn"><span class="k">Attention</span><p>Attention aux <em>gaps</em> : si le titre ouvre bien en dessous de ton stop (mauvaise nouvelle pendant la nuit), tu sors au prix d'ouverture, donc plus bas que prévu. Le simulateur reproduit ce cas.</p></div>`,
    quiz: [
      { q: "Quel ordre te garantit un prix maximum à l'achat ?", o: ["Ordre au marché", "Ordre à cours limité", "Ordre stop", "Aucun"], a: 1, e: "Avec un ordre limité, tu ne paies jamais plus que ton prix, mais il peut ne pas être exécuté." },
      { q: "À quoi sert un stop-loss ?", o: ["À augmenter les gains", "À limiter la perte maximale sur une position", "À éviter les frais", "À acheter moins cher"], a: 1, e: "Le stop sort automatiquement de la position quand le cours atteint un seuil défini." },
      { q: "Un titre ouvre à 90 € alors que ton stop est à 95 €. À quel prix sors-tu ?", o: ["95 €", "Environ 90 € (prix d'ouverture)", "100 €", "Tu ne sors pas"], a: 1, e: "En cas de gap, le stop est exécuté au premier prix disponible, ici l'ouverture à 90 €." }
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
  }
];

// Parcours : 4 niveaux, chacun terminé par un examen de 6 questions nouvelles.
// L'ordre des leçons suit la progression conseillée (la gestion du risque passe avant l'analyse).
const MODULES = [
  {
    id: "n1", short: "Les bases", title: "Les bases", goal: "Comprendre ce qu'est la bourse, les principaux produits et lire un graphique.",
    lessons: ["bourse", "produits", "graphique"],
    exam: [
      { q: "Une entreprise cotée émet des actions principalement pour…", o: ["Rembourser ses actionnaires", "Lever des capitaux sans emprunter", "Réduire ses impôts", "Fixer le prix de ses produits"], a: 1, e: "En vendant des parts de son capital, l'entreprise obtient des fonds sans avoir à les rembourser comme une dette." },
      { q: "Quelle est la différence entre un dividende et une plus-value ?", o: ["Le dividende vient de la revente, la plus-value du bénéfice", "Le dividende est versé par l'entreprise, la plus-value vient d'une revente à un prix plus élevé", "Il n'y a aucune différence", "La plus-value est toujours garantie"], a: 1, e: "Le dividende est une part des bénéfices distribuée. La plus-value est le gain réalisé en revendant plus cher qu'à l'achat." },
      { q: "Pourquoi un ETF large est-il moins risqué qu'une seule action ?", o: ["Il est garanti par l'État", "Il répartit l'investissement sur de nombreuses entreprises", "Il ne baisse jamais", "Il est géré par des experts qui battent toujours le marché"], a: 1, e: "La diversification réduit l'impact d'une mauvaise performance isolée. Elle ne supprime pas le risque de marché." },
      { q: "Sur un chandelier, une très longue mèche haute indique que…", o: ["Le volume était nul", "Le prix est monté haut puis a été repoussé vers le bas", "L'entreprise a versé un dividende", "Le marché était fermé"], a: 1, e: "Les acheteurs ont poussé le prix vers le haut, mais les vendeurs ont repris la main avant la clôture." },
      { q: "Une obligation rapporte en général…", o: ["Des dividendes variables", "Des intérêts (coupons) fixés à l'avance", "Une part des bénéfices", "Rien, sauf si le prix monte"], a: 1, e: "L'émetteur verse un coupon et rembourse le capital à l'échéance, sauf défaut." },
      { q: "Pourquoi un débutant a-t-il intérêt à regarder le graphique journalier plutôt que celui à la minute ?", o: ["Les frais disparaissent", "Il y a moins de bruit aléatoire et moins de décisions impulsives", "Les prix sont garantis", "C'est obligatoire"], a: 1, e: "Sur de courtes échelles, le hasard domine et on est tenté de trader trop souvent." }
    ]
  },
  {
    id: "n2", short: "Les ordres", title: "Passer des ordres sans se ruiner", goal: "Acheter, vendre, limiter ses pertes et garder la tête froide.",
    lessons: ["ordres", "risque", "psycho"],
    exam: [
      { q: "Tu veux acheter à 40 € maximum, quitte à ne pas être exécuté. Quel ordre utilises-tu ?", o: ["Au marché", "À cours limité", "Stop", "Aucun"], a: 1, e: "L'ordre à cours limité garantit que tu ne paies pas plus que ton prix, mais il peut ne jamais être exécuté." },
      { q: "Capital 5 000 €, risque 2 % par trade. Quelle perte maximale acceptes-tu sur ce trade ?", o: ["10 €", "50 €", "100 €", "500 €"], a: 2, e: "2 % de 5 000 € = 100 €." },
      { q: "Entrée 20 €, stop 18 €, perte maximale 60 €. Combien de titres peux-tu prendre ?", o: ["15", "30", "60", "120"], a: 1, e: "Risque par titre = 2 €. 60 / 2 = 30 titres." },
      { q: "Un trade a un ratio gain/risque de 1:2. Si tu risques 50 €, le gain visé est de…", o: ["25 €", "50 €", "100 €", "200 €"], a: 2, e: "Un ratio de 1:2 signifie que le gain visé vaut 2 fois le risque : 2 x 50 € = 100 €." },
      { q: "Tu viens de perdre sur un trade et tu doubles la mise sur le suivant pour te refaire. C'est…", o: ["Une bonne gestion du risque", "Du revenge trading", "De la diversification", "Un ordre limité"], a: 1, e: "Augmenter le risque pour récupérer une perte est une des causes principales de ruine." },
      { q: "Comment limiter l'impact d'un gap défavorable (ouverture bien en dessous de ton stop) ?", o: ["Ne jamais placer de stop", "Réduire la taille de la position", "Acheter davantage", "Ignorer les annonces"], a: 1, e: "Un gap peut sauter ton stop. Une position plus petite limite la perte réelle." }
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
    lessons: ["etf", "fiscalite"],
    exam: [
      { q: "Deux ETF suivent le même indice : l'un a 0,20 % de frais par an, l'autre 0,60 %. Lequel est préférable, toutes choses égales ?", o: ["Celui à 0,60 %", "Celui à 0,20 %", "Aucun écart", "Celui au nom le plus long"], a: 1, e: "À performance égale, des frais plus faibles laissent plus de rendement à l'investisseur, année après année." },
      { q: "Un ETF à distribution…", o: ["Réinvestit les dividendes", "Verse les dividendes aux porteurs", "Garantit un revenu fixe", "Est interdit dans un PEA"], a: 1, e: "À distribution, les dividendes te sont versés ; à capitalisation, ils sont réinvestis." },
      { q: "Pour être éligible au PEA, un ETF doit notamment être investi à…", o: ["100 % en obligations", "Au moins 75 % en actions européennes", "Au moins 50 % en cryptomonnaies", "Aucune condition"], a: 1, e: "C'est une condition d'éligibilité. Vérifie toujours la fiche du fonds." },
      { q: "Que mesure l'encours d'un ETF ?", o: ["Son rendement annuel", "Le montant total qu'il gère", "Son nombre de lignes", "Ses frais"], a: 1, e: "L'encours est la somme des actifs gérés par le fonds. Un fonds très petit risque d'être fermé." },
      { q: "Pourquoi les frais annuels comptent-ils sur le long terme ?", o: ["Ils sont remboursés", "Ils sont prélevés chaque année et s'accumulent, ce qui réduit le rendement", "Ils augmentent le rendement", "Ils sont fixes pour toujours"], a: 1, e: "Les gains sont incertains, les frais sont certains. Avec les intérêts composés, l'écart grandit avec le temps." },
      { q: "Un portefeuille investi dans un seul ETF « monde » est…", o: ["Sans aucun risque", "Très diversifié, mais exposé aux baisses du marché", "Garanti par l'indice", "Réservé aux professionnels"], a: 1, e: "La diversification réduit le risque propre à une entreprise, pas le risque de marché." }
    ]
  }
];

const GLOSSARY = [
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
