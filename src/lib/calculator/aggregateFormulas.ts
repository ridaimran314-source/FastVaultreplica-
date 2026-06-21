import type { ProgramType } from "@/lib/types";

export interface AggregateInputs {
  matricPercent: number;
  fscPercent: number;
  entryTestPercent: number;
  programType: ProgramType;
}

export function calculateAggregate({
  matricPercent,
  fscPercent,
  entryTestPercent,
  programType,
}: AggregateInputs): number {
  if (programType === "engineering") {
    return (
      matricPercent * 0.17 + fscPercent * 0.5 + entryTestPercent * 0.33
    );
  }
  return matricPercent * 0.1 + fscPercent * 0.4 + entryTestPercent * 0.5;
}

export function calculateNuTestScore(
  correct: number,
  wrong: number,
  totalQuestions: number
): { rawScore: number; percentage: number } {
  const rawScore = correct - wrong * 0.25;
  const percentage = totalQuestions > 0 ? (rawScore / totalQuestions) * 100 : 0;
  return { rawScore, percentage: Math.max(0, percentage) };
}

export function satToPercentage(satScore: number): number {
  return (satScore / 1600) * 100;
}

export function calculateNatAggregate(
  matricPercent: number,
  fscPercent: number,
  natMarks: number,
  programType: ProgramType
): number {
  return calculateAggregate({
    matricPercent,
    fscPercent,
    entryTestPercent: natMarks,
    programType,
  });
}

export function calculateNuAggregate(
  matricPercent: number,
  fscPercent: number,
  correct: number,
  wrong: number,
  totalQuestions: number,
  programType: ProgramType
): { nuScore: number; nuPercent: number; aggregate: number } {
  const { rawScore, percentage } = calculateNuTestScore(
    correct,
    wrong,
    totalQuestions
  );
  const aggregate = calculateAggregate({
    matricPercent,
    fscPercent,
    entryTestPercent: percentage,
    programType,
  });
  return { nuScore: rawScore, nuPercent: percentage, aggregate };
}

export function calculateSatAggregate(
  matricPercent: number,
  fscPercent: number,
  satScore: number,
  programType: ProgramType
): number {
  const entryTestPercent = satToPercentage(satScore);
  return calculateAggregate({
    matricPercent,
    fscPercent,
    entryTestPercent,
    programType,
  });
}
