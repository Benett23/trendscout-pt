// Données de la couche « jeu » : personnages, rangs, badges, scènes de dialogue.
// Les illustrations sont dans assets/personnages/<personnage>-<expression>.svg

const CHARS = {
  malik: { name: "Malik", role: "Ton mentor", trait: "Calme et bienveillant, il te guide pas à pas.", color: "--ch-malik" },
  fomo: { name: "Fomo", role: "Le copain impulsif", trait: "Toujours pressé, il a peur de rater la prochaine hausse.", color: "--ch-fomo" },
  conseiller: { name: "Le Conseiller", role: "L'arnaque en costume", trait: "Il promet des gains garantis. Méfie-toi.", color: "--ch-conseiller" },
  revanche: { name: "Revanche", role: "Veut se refaire", trait: "Après une perte, il veut tout rattraper d'un coup.", color: "--ch-revanche" },
  patience: { name: "Patience", role: "L'investisseuse sereine", trait: "Elle pense long terme : le modèle à suivre.", color: "--ch-patience" }
};

const RANKS = [
  { n: "Curieux", xp: 0 },
  { n: "Apprenti", xp: 120 },
  { n: "Analyste", xp: 350 },
  { n: "Investisseur", xp: 650 }
];

// Les badges récompensent la méthode, jamais les gains.
const BADGES = [
  { id: "first-lesson", title: "Premier pas", hint: "Valide ta première leçon", icon: "book" },
  { id: "n1", title: "Niveau 1 validé", hint: "Réussis l'examen du niveau 1", icon: "award" },
  { id: "n2", title: "Niveau 2 validé", hint: "Réussis l'examen du niveau 2", icon: "award" },
  { id: "n3", title: "Niveau 3 validé", hint: "Réussis l'examen du niveau 3", icon: "award" },
  { id: "n4", title: "Niveau 4 validé", hint: "Réussis l'examen du niveau 4", icon: "award" },
  { id: "first-stop", title: "Premier stop", hint: "Pose un stop-loss dans le simulateur", icon: "stop" },
  { id: "first-game", title: "Première partie", hint: "Termine une partie du simulateur", icon: "chart" },
  { id: "streak3", title: "Série de 3 jours", hint: "Apprends 3 jours de suite", icon: "flame" },
  { id: "streak7", title: "Série de 7 jours", hint: "Apprends 7 jours de suite", icon: "flame" },
  { id: "sc-diversifier", title: "Pas tous les œufs", hint: "Scène « Tout sur une seule action ? » sans erreur", icon: "shield" },
  { id: "sc-hausse", title: "Sang-froid", hint: "Scène « Ça monte, ça monte ! » sans erreur", icon: "clock" },
  { id: "sc-garanti", title: "Zéro rumeur", hint: "Scène « Gains garantis » sans erreur", icon: "shield" },
  { id: "sc-revanche", title: "Pas de revanche", hint: "Scène « Je veux me refaire » sans erreur", icon: "shield" },
  { id: "sc-signal", title: "Esprit critique", hint: "Scène « Le signal parfait » sans erreur", icon: "star" },
  { id: "sc-frais", title: "Œil sur les frais", hint: "Scène « Les frais invisibles » sans erreur", icon: "star" }
];

// Chaque scène suit une leçon (requires). Étapes : « line » (réplique) ou « choice » (décision).
// Qualité d'une option : good (bon réflexe) · ok (acceptable) · bad (à éviter).
const SCENES = [
  {
    id: "diversifier", level: 0, requires: "produits", xp: 30, cast: ["fomo", "patience", "malik"],
    title: "Tout sur une seule action ?",
    context: "Fomo vient d'entendre parler d'une petite entreprise qui « va exploser ».",
    steps: [
      { t: "line", who: "fomo", expr: "excite", text: "Tu as vu TechBulle ? +40 % en un mois ! Je vais mettre toutes mes économies dessus." },
      { t: "choice", prompt: "Que lui réponds-tu ?", options: [
        { text: "Fonce, ça ne peut que monter.", q: "bad", reply: [{ who: "malik", expr: "inquiet", text: "Rien « ne peut que monter ». Une seule entreprise peut chuter de moitié en une journée, et c'est tout son capital qui trinque." }] },
        { text: "Mets-en une petite partie seulement, pas tout.", q: "good", reply: [{ who: "patience", expr: "souriante", text: "Bon réflexe. La part d'une seule entreprise doit rester petite : si elle déçoit, le reste du portefeuille amortit." }] },
        { text: "Regarde plutôt un ETF large : des centaines d'entreprises d'un coup.", q: "good", reply: [{ who: "patience", expr: "encourageante", text: "Oui. Un ETF diversifie d'un coup, avec peu de frais. Il ne supprime pas le risque de marché, mais celui d'une seule entreprise." }] }
      ] },
      { t: "line", who: "fomo", expr: "presse", text: "Mais si je rate la hausse, je vais m'en vouloir !" },
      { t: "choice", prompt: "Et face à la peur de rater ?", options: [
        { text: "Tu peux entrer progressivement, par petites parts.", q: "good", reply: [{ who: "malik", expr: "content", text: "Étaler ses achats dans le temps évite de tout décider sur un seul jour." }] },
        { text: "C'est vrai, dépêche-toi avant que ça monte encore.", q: "bad", reply: [{ who: "malik", expr: "inquiet", text: "La peur de rater une hausse (le FOMO) pousse à acheter au plus haut. Un bon plan ne se décide pas sous la pression." }] },
        { text: "Il y aura d'autres occasions. Mieux vaut un plan qu'un coup de tête.", q: "good", reply: [{ who: "patience", expr: "sereine", text: "Le marché ouvre tous les jours. Aucune occasion ne mérite de risquer plus que ce que tu peux te permettre de perdre." }] }
      ] }
    ],
    takeaway: "Ne mets pas tous tes œufs dans le même panier : la diversification te protège de l'erreur que tu n'as pas vue venir."
  },
  {
    id: "hausse", level: 1, requires: "psycho", xp: 30, cast: ["fomo", "malik"],
    title: "Ça monte, ça monte !",
    context: "Un titre a gagné 15 % aujourd'hui et tout le monde en parle. Fomo veut entrer tout de suite.",
    steps: [
      { t: "line", who: "fomo", expr: "excite", text: "Le titre vient de prendre 15 % et tout le monde en parle sur les réseaux. J'entre maintenant !" },
      { t: "choice", prompt: "Avant qu'il achète, tu lui demandes…", options: [
        { text: "Quel est ton plan : prix d'entrée, stop, objectif ?", q: "good", reply: [{ who: "malik", expr: "content", text: "La bonne question. Sans plan écrit avant d'entrer, on décide sous l'émotion." }] },
        { text: "Combien de personnes en parlent ?", q: "bad", reply: [{ who: "malik", expr: "reflechi", text: "Que tout le monde en parle ne dit rien de la valeur de l'entreprise, ni du risque que tu prends." }] },
        { text: "Prends vite, avant que ça monte encore.", q: "bad", reply: [{ who: "malik", expr: "inquiet", text: "C'est le FOMO : acheter parce qu'on a peur de rater, souvent après une grosse hausse." }] }
      ] },
      { t: "line", who: "fomo", expr: "neutre", text: "D'accord… j'ai 5 000 € de côté. J'en mets combien ?" },
      { t: "choice", prompt: "Tu lui conseilles…", options: [
        { text: "Définis d'abord ta perte maximale (1 à 2 % du capital), puis calcule la quantité.", q: "good", reply: [{ who: "malik", expr: "fier", text: "C'est la règle de la taille de position : c'est le risque accepté qui décide de la quantité, pas l'envie." }] },
        { text: "Tout, pour que le gain soit gros.", q: "bad", reply: [{ who: "malik", expr: "inquiet", text: "Plus la mise est grosse, plus une erreur coûte cher. Un gros gain possible ne vaut pas une ruine possible." }] },
        { text: "La moitié, sans stop, on verra bien.", q: "bad", reply: [{ who: "malik", expr: "inquiet", text: "Sans stop, tu ne sais pas jusqu'où peut aller la perte. Elle se décide avant d'entrer, pas pendant." }] }
      ] }
    ],
    takeaway: "Un plan avant d'entrer (prix, stop, objectif, taille) vaut mieux que la peur de rater."
  },
  {
    id: "garanti", level: 1, requires: "psycho", xp: 30, cast: ["conseiller", "malik"],
    title: "Gains garantis",
    context: "Un inconnu te contacte pour te proposer un « placement exclusif ».",
    steps: [
      { t: "line", who: "conseiller", expr: "sourire", text: "Bonjour ! Mon programme exclusif rapporte 8 % par mois, garanti. Places limitées : il faut décider aujourd'hui." },
      { t: "choice", prompt: "Tu réponds…", options: [
        { text: "Garanti ? Aucun placement sérieux ne garantit de tels gains.", q: "good", reply: [{ who: "malik", expr: "content", text: "Exactement. Un rendement très élevé et garanti est le signal d'alerte numéro un." }] },
        { text: "Intéressant, envoie-moi les détails de paiement.", q: "bad", reply: [{ who: "malik", expr: "inquiet", text: "Ne transmets jamais d'argent ni d'informations bancaires à quelqu'un qui te contacte pour une promesse de gains." }] },
        { text: "Je vérifie d'abord qu'il est enregistré auprès du régulateur (en France, l'AMF).", q: "good", reply: [{ who: "malik", expr: "fier", text: "Très bon réflexe : on vérifie l'identité et l'agrément dans les registres officiels avant tout." }] }
      ] },
      { t: "line", who: "conseiller", expr: "insistant", text: "Ne réfléchis pas trop, mes autres clients ont déjà doublé leur mise. Il ne reste que 2 places !" },
      { t: "choice", prompt: "Face à cette pression…", options: [
        { text: "L'urgence est une technique de manipulation. Je m'en vais.", q: "good", reply: [{ who: "conseiller", expr: "demasque", text: "… Tu es plus malin que la moyenne." }, { who: "malik", expr: "content", text: "Quand on te presse de décider vite, c'est justement le moment de ralentir." }] },
        { text: "D'accord, je mets 500 € pour tester.", q: "bad", reply: [{ who: "malik", expr: "inquiet", text: "Tester une arnaque avec 500 €, c'est déjà 500 € perdus. Et ça ouvre la porte à des demandes plus grosses." }] },
        { text: "J'en parle à un proche et je compare avec d'autres sources.", q: "good", reply: [{ who: "malik", expr: "content", text: "Prendre du recul et demander un second avis : c'est la meilleure protection." }] }
      ] }
    ],
    takeaway: "Gains garantis, urgence, pression, paiement inhabituel : ce sont les signaux classiques d'une arnaque."
  },
  {
    id: "revanche", level: 1, requires: "risque", xp: 30, cast: ["revanche", "malik"],
    title: "Je veux me refaire",
    context: "Revanche a perdu 800 € hier et veut tout rattraper aujourd'hui.",
    steps: [
      { t: "line", who: "revanche", expr: "abattu", text: "J'ai perdu 800 € hier sur un seul trade. Aujourd'hui je double ma mise pour me refaire." },
      { t: "choice", prompt: "Tu lui réponds…", options: [
        { text: "Fais une pause et analyse ce qui s'est passé avant de retrader.", q: "good", reply: [{ who: "revanche", expr: "apaise", text: "… Tu as raison. Je trade avec la colère, pas avec un plan." }] },
        { text: "Bonne idée, double la mise, tu récupéreras vite.", q: "bad", reply: [{ who: "malik", expr: "inquiet", text: "C'est le revenge trading. Augmenter le risque pour récupérer une perte est l'une des premières causes de ruine." }] },
        { text: "Reprends avec ta taille habituelle et respecte ton stop.", q: "good", reply: [{ who: "malik", expr: "content", text: "Revenir à la taille normale, c'est la discipline qui protège le capital." }] }
      ] },
      { t: "line", who: "revanche", expr: "enerve", text: "Mais je ne peux pas laisser cette perte comme ça !" },
      { t: "choice", prompt: "Tu lui dis…", options: [
        { text: "La perte est faite. Ce qui compte, c'est la prochaine décision.", q: "good", reply: [{ who: "malik", expr: "reflechi", text: "On ne rattrape pas une perte, on gère le trade suivant. Perdre 50 % exige +100 % pour revenir à zéro : mieux vaut ne pas creuser." }] },
        { text: "Prends un trade plus risqué avec un gros gain potentiel.", q: "bad", reply: [{ who: "malik", expr: "inquiet", text: "Un trade plus risqué pour compenser peut transformer une perte en catastrophe." }] },
        { text: "Retire ton stop, il t'empêche de remonter.", q: "bad", reply: [{ who: "malik", expr: "inquiet", text: "Retirer son stop, c'est retirer son filet de sécurité au pire moment." }] }
      ] }
    ],
    takeaway: "Après une perte, on ne cherche pas à la récupérer : on revient au plan et à la taille habituelle."
  },
  {
    id: "signal", level: 2, requires: "technique", xp: 30, cast: ["fomo", "patience", "malik"],
    title: "Le signal parfait",
    context: "Fomo a trouvé un indicateur « infaillible ».",
    steps: [
      { t: "line", who: "fomo", expr: "excite", text: "Le RSI est à 25, c'est survendu ! C'est forcément le moment d'acheter, non ?" },
      { t: "choice", prompt: "Tu réponds…", options: [
        { text: "Un RSI bas peut rester bas longtemps : ce n'est pas un signal à lui seul.", q: "good", reply: [{ who: "patience", expr: "reflechie", text: "Oui. Un indicateur décrit une situation, il ne garantit pas le rebond." }] },
        { text: "Oui, c'est garanti de remonter.", q: "bad", reply: [{ who: "malik", expr: "inquiet", text: "Aucun indicateur ne garantit un rebond. Dans une forte tendance baissière, un RSI peut rester bas très longtemps." }] },
        { text: "Regardons aussi la tendance et un niveau de support avant.", q: "good", reply: [{ who: "malik", expr: "content", text: "Croiser plusieurs éléments (tendance, support, plan de risque) limite les faux signaux." }] }
      ] },
      { t: "line", who: "fomo", expr: "presse", text: "Et si en plus les moyennes mobiles se croisent ?" },
      { t: "choice", prompt: "Tu lui expliques…", options: [
        { text: "En marché latéral, les croisements donnent beaucoup de faux signaux.", q: "good", reply: [{ who: "patience", expr: "encourageante", text: "Exactement : sans tendance, les moyennes se croisent sans qu'un mouvement durable suive." }] },
        { text: "Deux signaux, c'est une certitude.", q: "bad", reply: [{ who: "malik", expr: "inquiet", text: "Deux signaux fragiles ne font pas une certitude. Il n'y a pas de certitude en bourse." }] },
        { text: "Teste d'abord dans le simulateur, sur plusieurs scénarios.", q: "good", reply: [{ who: "malik", expr: "fier", text: "Tester sur des données fictives avant de risquer quoi que ce soit : c'est exactement la bonne démarche." }] }
      ] }
    ],
    takeaway: "Un indicateur aide à construire un plan, il ne prédit pas l'avenir."
  },
  {
    id: "frais", level: 3, requires: "etf", xp: 30, cast: ["conseiller", "patience", "malik"],
    title: "Les frais invisibles",
    context: "Le Conseiller te présente son « fonds maison ».",
    steps: [
      { t: "line", who: "conseiller", expr: "sourire", text: "Notre fonds maison est géré par des experts. Seulement 2,5 % de frais par an, ça vaut largement le coup !" },
      { t: "choice", prompt: "Tu réponds…", options: [
        { text: "Et un ETF comparable à 0,20 % ? Sur 20 ans, l'écart est énorme.", q: "good", reply: [{ who: "patience", expr: "souriante", text: "Les frais sont certains, les gains ne le sont pas. Sur de longues durées, quelques points d'écart pèsent lourd." }] },
        { text: "Des experts battent toujours le marché, donc c'est justifié.", q: "bad", reply: [{ who: "malik", expr: "reflechi", text: "Peu de fonds gérés activement battent durablement leur indice une fois les frais déduits. Regarde les résultats sur longue période." }] },
        { text: "Je compare l'indice suivi, les frais, la taille et l'éligibilité avant tout.", q: "good", reply: [{ who: "malik", expr: "fier", text: "Ce sont exactement les critères de choix d'un ETF." }] }
      ] },
      { t: "line", who: "conseiller", expr: "clin-d-oeil", text: "Avec nous, pas besoin de comprendre. Fais-nous confiance." },
      { t: "choice", prompt: "Tu réponds…", options: [
        { text: "Je n'investis pas dans ce que je ne comprends pas.", q: "good", reply: [{ who: "patience", expr: "sereine", text: "Si tu ne peux pas expliquer le produit simplement, ne l'achète pas." }] },
        { text: "D'accord, je signe.", q: "bad", reply: [{ who: "malik", expr: "inquiet", text: "Ne signe jamais sans avoir lu le document d'informations clés (DIC) et connu les frais." }] },
        { text: "Envoie-moi le document d'informations clés, je le lis d'abord.", q: "good", reply: [{ who: "malik", expr: "content", text: "Le document d'informations clés indique les frais, le risque et la durée conseillée : lis-le avant d'acheter." }] }
      ] }
    ],
    takeaway: "Compare toujours les frais et l'indice suivi, et lis le document d'informations clés avant d'investir."
  }
];
