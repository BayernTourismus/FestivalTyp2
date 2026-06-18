import { resultOrder, type BayernTypeId, type Question } from "../data/quiz";

export type ScoreMap = Record<BayernTypeId, number>;

const initialScores = (): ScoreMap => ({
  "franken": 0,
  "oberbayern": 0,
  "ostbayern": 0,
  "allgaeu-bayerisch-schwaben": 0,
});

const pickRandomWinner = (scores: ScoreMap): BayernTypeId => {
  const highScore = Math.max(...Object.values(scores));
  const winners = resultOrder.filter((id) => scores[id] === highScore);
  return winners[Math.floor(Math.random() * winners.length)];
};

export const evaluateQuiz = (selectedAnswers: number[], questions: Question[]) => {
  const scores = initialScores();

  questions.forEach((question, questionIndex) => {
    const answerIndex = selectedAnswers[questionIndex];
    const answer = question.answers[answerIndex];

    if (answer) {
      scores[answer.resultId] += 1;
    }
  });

  const winnerId = pickRandomWinner(scores);

  return {
    resultId: winnerId,
    scores,
  };
};
