export type BayernTypeId = "franken" | "oberbayern" | "ostbayern" | "allgaeu-bayerisch-schwaben";

export type QuizLanguage = "de";

export type ResultMeta = {
  id: BayernTypeId;
  title: string;
  region: string;
  vibe: string;
  description: string;
  cta: string;
  guideLabel: string;
  guideUrl: string;
  color: string;
  accent: string;
  backdrop: string;
  imageSrc: string;
};

export type Answer = {
  option: "A" | "B" | "C" | "D";
  label: string;
  resultId: BayernTypeId;
};

export type Question = {
  id: string;
  prompt: string;
  answers: Answer[];
};

export type QuizCopy = {
  headerEyebrow: string;
  headerTitle: string;
  reset: string;
  attractEyebrow: string;
  attractTitle: string;
  attractButton: string;
  startEyebrow: string;
  startTitle: string;
  startDescription: string;
  startTagline: string;
  startButton: string;
  questionLabel: string;
  back: string;
  answerHint: string;
  calculating: string;
  resultEyebrow: string;
  resultVibeLabel: string;
  scanCopy: string;
  qrAriaLabel: string;
  homeButton: string;
};

export type QuizContent = {
  copy: QuizCopy;
  questions: Question[];
  results: Record<BayernTypeId, ResultMeta>;
};

export const defaultLanguage: QuizLanguage = "de";

export const languageLabels: Record<QuizLanguage, string> = {
  de: "Deutsch",
};

export const resultOrder: BayernTypeId[] = ["franken", "oberbayern", "ostbayern", "allgaeu-bayerisch-schwaben"];

const resultStyles: Record<BayernTypeId, Pick<ResultMeta, "color" | "accent" | "backdrop" | "guideUrl" | "imageSrc">> = {
  "franken": {
    guideUrl: "https://erlebe.bayern/guide/franken/",
    color: "#9e092f",
    accent: "#ffce44",
    imageSrc: "/result-bg/1.png",
    backdrop:
      "linear-gradient(135deg, rgba(158, 9, 47, 0.58), rgba(255, 206, 68, 0.18)), radial-gradient(circle at 74% 16%, rgba(255, 206, 68, 0.34), transparent 31%)",
  },
  "oberbayern": {
    guideUrl: "https://erlebe.bayern/guide/oberbayern/",
    color: "#001f47",
    accent: "#21b5ea",
    imageSrc: "/result-bg/2.png",
    backdrop:
      "linear-gradient(135deg, rgba(0, 31, 71, 0.6), rgba(255, 206, 68, 0.14)), radial-gradient(circle at 78% 18%, rgba(33, 181, 234, 0.3), transparent 28%)",
  },
  "ostbayern": {
    guideUrl: "https://erlebe.bayern/guide/ostbayern/",
    color: "#007a62",
    accent: "#a0c96d",
    imageSrc: "/result-bg/3.png",
    backdrop:
      "linear-gradient(135deg, rgba(0, 122, 98, 0.56), rgba(33, 181, 234, 0.16)), radial-gradient(circle at 78% 18%, rgba(160, 201, 109, 0.34), transparent 30%)",
  },
  "allgaeu-bayerisch-schwaben": {
    guideUrl: "https://erlebe.bayern/guide/allgaeu-bayerisch-schwaben/",
    color: "#6a7f1d",
    accent: "#ffce44",
    imageSrc: "/result-bg/4.png",
    backdrop:
      "linear-gradient(135deg, rgba(160, 201, 109, 0.56), rgba(255, 206, 68, 0.28)), radial-gradient(circle at 78% 18%, rgba(255, 206, 68, 0.3), transparent 29%)",
  },
};

const withStyle = (
  result: Omit<ResultMeta, "color" | "accent" | "backdrop" | "guideUrl" | "imageSrc"> & Partial<Pick<ResultMeta, "guideUrl">>,
): ResultMeta => ({
  ...resultStyles[result.id],
  ...result,
});

export const quizContent: Record<QuizLanguage, QuizContent> = {
  de: {
    copy: {
      headerEyebrow: "Bayern gehört erlebt",
      headerTitle: "Welcher Bayern-Typ bist du?",
      reset: "Neu starten",
      attractEyebrow: "Bayern gehört erlebt",
      attractTitle: "Welcher Bayern-Typ bist du?",
      attractButton: "Tippen zum Starten",
      startEyebrow: "Bayern-Kampagne",
      startTitle: "Dein Bayern-Moment beginnt hier.",
      startDescription: "Erlebe Bayern in 60 Sekunden und finde heraus, welcher Bayern-Typ in dir steckt.",
      startTagline: "Bayern gehört erlebt.",
      startButton: "Quiz starten",
      questionLabel: "Frage",
      back: "Zurück",
      answerHint: "Antwort antippen, die nächste Frage kommt automatisch.",
      calculating: "Dein Bayern-Typ wird ermittelt...",
      resultEyebrow: "Bayern gehört erlebt",
      resultVibeLabel: "Dein Vibe",
      scanCopy: "Scannen und deinen Bayern-Typ erleben!",
      qrAriaLabel: "QR-Code",
      homeButton: "Zur Startseite",
    },
    questions: [
      {
        id: "festival-spot",
        prompt: "Dein perfekter Festival-Spot sieht so aus …",
        answers: [
          {
            option: "A",
            label: "Bühne zwischen historischen Mauern oder Weinbergen",
            resultId: "franken",
          },
          {
            option: "B",
            label: "Vor der Bühne mit Seepanorama",
            resultId: "oberbayern",
          },
          {
            option: "C",
            label: "Lichtung im Wald oder am Fluss",
            resultId: "ostbayern",
          },
          {
            option: "D",
            label: "Open-Air vor Alpenkulisse",
            resultId: "allgaeu-bayerisch-schwaben",
          },
        ],
      },
      {
        id: "festival-role",
        prompt: "Wenn du mit deiner Crew auf dem Festival unterwegs bist – welche Rolle übernimmst du?",
        answers: [
          {
            option: "A",
            label: "Der/Die Organisator:in: Du hast das Line-up studiert und kennst die ästhetischsten Bühnen",
            resultId: "franken",
          },
          {
            option: "B",
            label: "Der/Die Stimmungsmacher:in: Du bringst alle zusammen und startest den Gesang",
            resultId: "oberbayern",
          },
          {
            option: "C",
            label: "Der/Die Entspannte: Du sorgst dafür, dass alle zwischendurch mal runterkommen",
            resultId: "ostbayern",
          },
          {
            option: "D",
            label: "Die treibende Kraft: Du ziehst durch, wenn andere schon schlappmachen",
            resultId: "allgaeu-bayerisch-schwaben",
          },
        ],
      },
      {
        id: "music-sound",
        prompt: "Welcher Sound bringt dich sofort in Bewegung?",
        answers: [
          {
            option: "A",
            label: "Indie, Jazz, kreative Crossover-Sounds",
            resultId: "franken",
          },
          {
            option: "B",
            label: "Brass, Pop, oder 90s Throwbacks",
            resultId: "oberbayern",
          },
          {
            option: "C",
            label: "Deep & Atmospheric",
            resultId: "ostbayern",
          },
          {
            option: "D",
            label: "Electro, Rock, treibende Beats",
            resultId: "allgaeu-bayerisch-schwaben",
          },
        ],
      },
      {
        id: "dancing-meaning",
        prompt: "Tanzen bedeutet für dich …",
        answers: [
          {
            option: "A",
            label: "Lebensgefühl – du saugst die Kultur des Ortes auf",
            resultId: "franken",
          },
          {
            option: "B",
            label: "Gemeinschaft – Arm in Arm mit Freunden mitsingen",
            resultId: "oberbayern",
          },
          {
            option: "C",
            label: "Freiheit – barfuß im Gras, einfach im Moment treiben lassen",
            resultId: "ostbayern",
          },
          {
            option: "D",
            label: "Power – Bass im Bauch, springen, schwitzen, alles geben",
            resultId: "allgaeu-bayerisch-schwaben",
          },
        ],
      },
      {
        id: "festival-afterglow",
        prompt: "Der Festival-Afterglow: Dein perfekter Urlaubs-Moment nach dem Festival…",
        answers: [
          {
            option: "A",
            label: "Altstadt-Flair genießen, Streetfood probieren und mit einem Glas Wein anstoßen",
            resultId: "franken",
          },
          {
            option: "B",
            label: "Morgens ab in den See, nachmittags auf die Alm und abends in den Biergarten",
            resultId: "oberbayern",
          },
          {
            option: "C",
            label: "Raus aus dem Trubel: Yoga im Grünen oder Spaziergang im Wald",
            resultId: "ostbayern",
          },
          {
            option: "D",
            label: "Früh raus, auf den Gipfel hiken, Paragliding oder Bike-Trail",
            resultId: "allgaeu-bayerisch-schwaben",
          },
        ],
      },
    ],
    results: {
      "franken": withStyle({
        id: "franken",
        title: "Der Kultur-Genießer",
        region: "Franken",
        vibe: "Stilvoll. Intensiv. Charakterstark.",
        description:
          "Du feierst am liebsten da, wo Geschichte auf moderne Beats trifft. Zwischen Weinbergen, historischen Mauern und kreativen Bühnen fühlst du dich zuhause. Für dich ist Musik mehr als Sound – sie ist echte Atmosphäre. Genau dieses Gefühl erwartet dich in Franken! Hier verbindet sich Indie- und Jazz-Kultur mit urbanem Altstadt-Flair und regionaler Kulinarik. Tagsüber durch charmante Gassen schlendern, abends mit einem Glas Silvaner bei einem Open-Air im Schlossgraben tanzen. Entdecke ein Bayern, das kreativ, genussvoll und einzigartig ist. Dein Bayern klingt nach Charakter.",
        cta: "Jetzt Franken entdecken",
        guideLabel: "Reiseinspiration zur Urlaubsregion",
      }),
      "oberbayern": withStyle({
        id: "oberbayern",
        title: "Der Panorama-Performer",
        region: "Oberbayern",
        vibe: "Emotional. Gesellig. Grenzenlos.",
        description:
          "Du liebst große Gefühle – am liebsten mit See- oder Bergblick. Musik ist für dich Gemeinschaft: mitsingen, mittanzen, mitfühlen. In Oberbayern findest du genau diese Energie. Hier trifft moderne Brass-Musik auf DJ-Beats, und gelebte Tradition wird zur fetten Party. Erst Gipfelglück oder Stand-Up-Paddling auf dem See, danach mit der Crew in den Biergarten oder aufs nächste große Open-Air. Dein Bayern feiert das Leben, die Freundschaft und die perfekte Kulisse.",
        cta: "Jetzt Oberbayern erleben",
        guideLabel: "Reiseinspiration zur Urlaubsregion",
      }),
      "ostbayern": withStyle({
        id: "ostbayern",
        title: "Der Natur-Freigeist",
        region: "Ostbayern",
        vibe: "Echt. Geerdet. Frei.",
        description:
          "Du feierst am liebsten unter freiem Himmel – wo Musik und Natur eins werden. Ostbayern ist genau dein Ding: Wälder, Flüsse, echte Begegnungen. Kleine Bühnen, große Emotionen. Zwischen dem Nationalpark Bayerischer Wald und wilden Flusslandschaften gibt es kleine, entschleunigte Festivals und kulturelle Geheimtipps zu entdecken. Tagsüber radelst du durch tiefe Wälder, abends sitzt du bei Akustik-Sounds und guten Gesprächen unterm Sternenhimmel. Dein Bayern ist ein Ort zum Durchatmen.",
        cta: "Jetzt Ostbayern erleben",
        guideLabel: "Reiseinspiration zur Urlaubsregion",
      }),
      "allgaeu-bayerisch-schwaben": withStyle({
        id: "allgaeu-bayerisch-schwaben",
        title: "Der Gipfel-Stürmer",
        region: "Allgäu / Bayerisch-Schwaben",
        vibe: "Laut. Organisiert. Energiegeladen.",
        description:
          "Du brauchst treibende Beats im Bauch und den perfekten Flow! Langes Rumstehen ist nichts für dich – du navigierst clever durchs Leben und bleibst immer in Bewegung. Willkommen im Allgäu und Bayerisch Schwaben! Hier verschmelzen Outdoor-Action, Rad- und Flusslandschaften und junge Event-Kultur. Ob Extremsport-Festival oder Open-Airs im Tal – hier pusht dich die Natur ans Limit. Dein Bayern ist sportlich, smart und voller Drive!",
        cta: "Jetzt Allgäu/Bayerisch-Schwaben erleben",
        guideLabel: "Reiseinspiration zur Urlaubsregion",
      }),
    },
  },
};
