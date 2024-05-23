import { areNotNumbers } from "./utils";

interface Result {
    periodLength: number;
    trainingDays: number;
    target: number;
    average: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
}

interface ExercisesHours {
    dailyExerHours: number[];
    target: number;
  }

const parseArguments = (dailyExercisesArgs: string[], targetArg: string): ExercisesHours => {
    if(!areNotNumbers(dailyExercisesArgs.concat(targetArg))) {
        const target: number = Number(targetArg);
        const dailyExerHours: number[] = dailyExercisesArgs.map(hours => Number(hours));
        return { dailyExerHours, target };
    }

    throw new Error('malformatted parameters');
};

const calculateExercises = (dailyExerHours: number[], target: number): Result => {
    const periodLength: number = dailyExerHours.length;
    const trainingDaysHours: number[] = dailyExerHours.filter(number => number !== 0);
    const trainingDays: number = trainingDaysHours.length;
    const hoursSum: number = trainingDaysHours.reduce((acc, curVal) => acc + curVal, 0);
    const average: number = hoursSum/periodLength;
    let success: boolean = true;
    if(average < target)
        success = false;
    const ratioAverageTarget: number = average/target;
    let rating: number = 1;
    let ratingDescription: string = 'You did not work at all...';

    if (ratioAverageTarget >= 1) {
        rating = 3;
        ratingDescription = 'You accomplished your meta!';
    }

    if (0.5 <= ratioAverageTarget && ratioAverageTarget < 1) {
        rating = 2;
        ratingDescription ='you almost reach the meta, but it was not enough';
    }

    return {
        periodLength: periodLength,
        trainingDays: trainingDays,
        target: target,
        average: average,
        success: success,
        rating: rating,
        ratingDescription: ratingDescription
    };
};

export const exerciseCalculator = (dailyExercises: string[], targetArg: string): Result | { error:string } => {
    try {
        const { dailyExerHours, target } = parseArguments(dailyExercises, targetArg);
        return calculateExercises(dailyExerHours, target);
    } catch (error: unknown) {
        let errorMessage = 'Something went wrong: ';
        if (error instanceof Error) {
        errorMessage += error.message;
        }
        return({ error: errorMessage });
    }
};