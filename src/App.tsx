import { type CSSProperties, useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { defaultLanguage, quizContent, type BayernTypeId, type QuizLanguage } from "./data/quiz";
import { evaluateQuiz } from "./lib/scoring";

const STORAGE_KEY = "festivaltyp-state-v2";
const ANALYTICS_KEY = "festivaltyp-analytics-v1";
const CAMPAIGN_IMAGE_SRC = "/start.png";
const CAMPAIGN_VIDEO_SRC = "/bayern-gehoert-erlebt.mp4";
const IDLE_TIMEOUT_MS = 120_000;
const RESULT_TIMEOUT_MS = 120_000;
const ANSWER_FEEDBACK_MS = 220;
const CALCULATION_DELAY_MS = 1_700;

type Screen = "attract" | "start" | "quiz" | "calculating" | "result";

type AppState = {
  screen: Screen;
  language: QuizLanguage;
  currentQuestion: number;
  selectedAnswers: number[];
  resultId: BayernTypeId | null;
};

type AnalyticsState = {
  starts: number;
  abandonments: number;
  completions: number;
  resultDistribution: Record<BayernTypeId, number>;
};

const initialState: AppState = {
  screen: "attract",
  language: defaultLanguage,
  currentQuestion: 0,
  selectedAnswers: [],
  resultId: null,
};

const initialAnalytics = (): AnalyticsState => ({
  starts: 0,
  abandonments: 0,
  completions: 0,
  resultDistribution: {
    "franken": 0,
    "oberbayern": 0,
    "ostbayern": 0,
    "allgaeu-bayerisch-schwaben": 0,
  },
});

const readJson = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const readStoredState = (): AppState => {
  const parsed = readJson<Partial<AppState>>(STORAGE_KEY, initialState);
  const language: QuizLanguage = parsed.language && parsed.language in quizContent ? parsed.language : defaultLanguage;
  const content = quizContent[language];
  const totalQuestions = content.questions.length;
  const screen: Screen =
    ["attract", "start", "quiz", "calculating", "result"].includes(parsed.screen ?? "") ? (parsed.screen as Screen) : "attract";

  return {
    screen,
    language,
    currentQuestion: Math.min(Math.max(parsed.currentQuestion ?? 0, 0), totalQuestions - 1),
    selectedAnswers: Array.isArray(parsed.selectedAnswers) ? parsed.selectedAnswers.slice(0, totalQuestions) : [],
    resultId: parsed.resultId && parsed.resultId in content.results ? parsed.resultId : null,
  };
};

const readAnalytics = () => readJson<AnalyticsState>(ANALYTICS_KEY, initialAnalytics());

const persistAnalytics = (updater: (current: AnalyticsState) => AnalyticsState) => {
  if (typeof window === "undefined") {
    return;
  }

  const next = updater(readAnalytics());
  window.localStorage.setItem(ANALYTICS_KEY, JSON.stringify(next));
};

const recordStart = () => {
  persistAnalytics((current) => ({ ...current, starts: current.starts + 1 }));
};

const recordAbandonment = () => {
  persistAnalytics((current) => ({ ...current, abandonments: current.abandonments + 1 }));
};

const recordCompletion = (resultId: BayernTypeId) => {
  persistAnalytics((current) => ({
    ...current,
    completions: current.completions + 1,
    resultDistribution: {
      ...current.resultDistribution,
      [resultId]: current.resultDistribution[resultId] + 1,
    },
  }));
};

export default function App() {
  const [state, setState] = useState<AppState>(readStoredState);
  const [activeAnswerIndex, setActiveAnswerIndex] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== "undefined" ? navigator.onLine : true));
  const answerTimerRef = useRef<number | undefined>();
  const content = quizContent[state.language];
  const { copy, questions, results } = content;
  const totalQuestions = questions.length;

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const handleConnectionChange = () => setIsOnline(navigator.onLine);

    window.addEventListener("online", handleConnectionChange);
    window.addEventListener("offline", handleConnectionChange);

    return () => {
      window.removeEventListener("online", handleConnectionChange);
      window.removeEventListener("offline", handleConnectionChange);
    };
  }, []);

  useEffect(() => {
    if (state.screen === "attract") {
      return undefined;
    }

    let timeoutId: number | undefined;

    const resetOnIdle = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(
        () => {
          if (state.screen !== "result" && state.selectedAnswers.length > 0) {
            recordAbandonment();
          }
          setActiveAnswerIndex(null);
          setState({ ...initialState, language: state.language });
        },
        state.screen === "result" ? RESULT_TIMEOUT_MS : IDLE_TIMEOUT_MS,
      );
    };

    const events: Array<keyof WindowEventMap> = ["pointerdown", "pointermove", "keydown", "touchstart"];

    events.forEach((eventName) => window.addEventListener(eventName, resetOnIdle, { passive: true }));
    resetOnIdle();

    return () => {
      window.clearTimeout(timeoutId);
      events.forEach((eventName) => window.removeEventListener(eventName, resetOnIdle));
    };
  }, [state.screen, state.selectedAnswers.length]);

  useEffect(() => {
    if (state.screen !== "calculating" || state.resultId || state.selectedAnswers.length !== totalQuestions) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      const evaluation = evaluateQuiz(state.selectedAnswers, questions);
      recordCompletion(evaluation.resultId);
      setState((current) => ({ ...current, screen: "result", resultId: evaluation.resultId }));
    }, CALCULATION_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [questions, state.resultId, state.screen, state.selectedAnswers, totalQuestions]);

  useEffect(() => {
    return () => window.clearTimeout(answerTimerRef.current);
  }, []);

  const currentQuestion = questions[state.currentQuestion];
  const result = state.resultId ? results[state.resultId] : null;
  const progress = Math.round((state.currentQuestion / totalQuestions) * 100);
  const frameStyle = (
    result && state.screen === "result"
      ? {
          "--frame-primary": result.color,
          "--frame-secondary": result.accent,
          "--frame-surface": "rgba(255, 255, 255, 0.9)",
          "--frame-ink": result.color,
        }
      : {
          "--frame-primary": "#001f47",
          "--frame-secondary": "#008ecf",
          "--frame-surface": "rgba(255, 255, 255, 0.9)",
          "--frame-ink": "#001f47",
        }
  ) as CSSProperties;

  const goToStart = () => {
    setState({ ...initialState, language: state.language, screen: "start" });
  };

  const startQuiz = () => {
    recordStart();
    setActiveAnswerIndex(null);
    setState({
      screen: "quiz",
      language: state.language,
      currentQuestion: 0,
      selectedAnswers: [],
      resultId: null,
    });
  };

  const resetToAttract = () => {
    window.clearTimeout(answerTimerRef.current);
    setActiveAnswerIndex(null);
    setState({ ...initialState, language: state.language });
  };

  const chooseAnswer = (answerIndex: number) => {
    if (activeAnswerIndex !== null) {
      return;
    }

    setActiveAnswerIndex(answerIndex);
    window.clearTimeout(answerTimerRef.current);

    answerTimerRef.current = window.setTimeout(() => {
      const nextAnswers = [...state.selectedAnswers];
      nextAnswers[state.currentQuestion] = answerIndex;
      const nextQuestion = state.currentQuestion + 1;

      setActiveAnswerIndex(null);
      setState({
        screen: nextQuestion >= totalQuestions ? "calculating" : "quiz",
        language: state.language,
        currentQuestion: Math.min(nextQuestion, totalQuestions - 1),
        selectedAnswers: nextAnswers,
        resultId: null,
      });
    }, ANSWER_FEEDBACK_MS);
  };

  const goBack = () => {
    if (state.currentQuestion === 0) {
      setState({ ...initialState, language: state.language, screen: "start" });
      return;
    }

    setActiveAnswerIndex(null);
    setState((current) => ({
      screen: "quiz",
      language: current.language,
      currentQuestion: current.currentQuestion - 1,
      selectedAnswers: current.selectedAnswers.slice(0, -1),
      resultId: null,
    }));
  };

  return (
    <main className="app-shell">
      <section className={`experience-frame screen-${state.screen}`} style={frameStyle}>
        {state.screen !== "attract" ?
          <header className="app-header">
            <div className="brand-block">
              <p className="eyebrow">{copy.headerEyebrow}</p>
              <h1>{copy.headerTitle}</h1>
            </div>
            <div className="header-actions">
              <button className="ghost-button" onClick={resetToAttract} type="button">
                {copy.reset}
              </button>
            </div>
          </header>
        : null}

        {state.screen === "attract" ?
          <button className="attract-screen" onClick={goToStart} type="button">
            <img className="campaign-video campaign-video-fallback" src={CAMPAIGN_IMAGE_SRC} alt="" aria-hidden="true" />
            <video className="campaign-video" autoPlay loop muted playsInline poster={CAMPAIGN_IMAGE_SRC} aria-hidden="true">
              <source src={CAMPAIGN_VIDEO_SRC} type="video/mp4" />
            </video>
            <div className="attract-copy">
              <p className="eyebrow">{copy.attractEyebrow}</p>
              <h2>{copy.attractTitle}</h2>
              <span className="pulse-button">{copy.attractButton}</span>
            </div>
          </button>
        : null}

        {state.screen === "start" ?
          <section className="start-screen">
            <div className="start-copy">
              <p className="eyebrow">{copy.startEyebrow}</p>
              <h2>{copy.startTitle}</h2>
              <p>{copy.startDescription}</p>
              <strong>{copy.startTagline}</strong>
            </div>
            <button className="primary-button start-button" onClick={startQuiz} type="button">
              {copy.startButton}
            </button>
          </section>
        : null}

        {state.screen === "quiz" && currentQuestion ?
          <section className="question-screen">
            <div className="question-header-panel">
              <div className="question-topline">
                <span>
                  {copy.questionLabel} {state.currentQuestion + 1}/{totalQuestions}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="progress-bar" aria-hidden="true">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <h2>{currentQuestion.prompt}</h2>
              <div className="footer-row">
                <button className="secondary-button" onClick={goBack} type="button">
                  {copy.back}
                </button>
                <p>{copy.answerHint}</p>
              </div>
            </div>

            <div className="answers-grid">
              {currentQuestion.answers.map((answer, answerIndex) => (
                <button
                  className={`answer-card${activeAnswerIndex === answerIndex ? " is-selected" : ""}`}
                  disabled={activeAnswerIndex !== null}
                  key={answer.option}
                  onClick={() => chooseAnswer(answerIndex)}
                  type="button"
                >
                  <span className="answer-index">{answer.option}</span>
                  <strong>{answer.label}</strong>
                </button>
              ))}
            </div>
          </section>
        : null}

        {state.screen === "calculating" ?
          <section className="calculation-screen" aria-live="polite">
            <div className="spinner" aria-hidden="true" />
            <h2>{copy.calculating}</h2>
          </section>
        : null}

        {state.screen === "result" && result ?
          <section className="result-screen" style={{ backgroundImage: `${result.backdrop}, url(${result.imageSrc})` }}>
            <article className="result-copy">
              <p className="eyebrow">{copy.resultEyebrow}</p>
              <h2>
                {result.region.split(/\s*\/\s*/).map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <>
                        {" /"}
                        <br />
                      </>
                    )}
                  </span>
                ))}
              </h2>
              <h3>{result.title}</h3>
              <p className="result-vibe">
                {copy.resultVibeLabel}: {result.vibe}
              </p>
              <p>{result.description}</p>
            </article>

            <aside className="qr-panel">
              <p className="scan-copy">{copy.scanCopy}</p>
              <QRCodeSVG
                aria-label={`${copy.qrAriaLabel}: ${result.guideLabel}`}
                includeMargin
                level="M"
                size={240}
                value={result.guideUrl}
              />
              <h3 className="qr-result-region">
                {result.region.split(/\s*\/\s*/).map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <>
                        {" /"}
                        <br />
                      </>
                    )}
                  </span>
                ))}
              </h3>
              <p>{result.guideLabel}</p>
              {!isOnline ? <p className="offline-note">Offline-Modus: Der Guide-Link öffnet sich wieder, sobald das Gerät online ist.</p> : null}
              <a className="primary-button" href={result.guideUrl} rel="noreferrer" target="_blank">
                {result.cta.split(/\s*\/\s*/).map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <>
                        {" /"}
                        <br />
                      </>
                    )}
                  </span>
                ))}
              </a>
            </aside>
          </section>
        : null}
      </section>
    </main>
  );
}
