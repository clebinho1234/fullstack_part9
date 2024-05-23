import { areNotNumbers } from "./utils";

interface BmiValues {
    height: number;
    weight: number;
}

interface bmiResults {
    weight: number;
    height: number;
    bmi: string;
}

const parseArguments = (args: string[]): BmiValues => {
    if (args.length < 2) throw new Error('Not enough arguments');
    if (args.length > 2) throw new Error('Too many arguments');

    if (!areNotNumbers(args)) {
        return {
            height: Number(args[0]),
            weight: Number(args[1])
          };
    }

    throw new Error('Provided values were not numbers!');
};

const calculateBmi = (height: number, weight: number): bmiResults => {
    if (height === 0) throw new Error('Can\'t divide by 0!');

    const bmi: number = weight/(height/100)**2;

    let result = 'Underweight (Severe thinness)';

    if (bmi >= 40)
        result = 'Obese (Class III)';

    if (35 <= bmi && bmi < 40)
        result = 'Obese (Class II)';

    if (30 <= bmi && bmi < 35)
        result = 'Obese (Class I)';

    if (25 <= bmi && bmi < 30)
        result = 'Overweight (Pre-obese)';

    if (18.5 <= bmi && bmi < 25)
        result = 'Normal (Healthy weight)';

    if (17 <= bmi && bmi < 18.5)
        result = 'Underweight (Mild thinness)';

    if (16 <= bmi && bmi < 17)
        result = 'Underweight (Moderate thinness)';

    return {
        weight: weight,
        height: height,
        bmi: result
    };
};

export const bmiCalculator = (args: string[]): bmiResults | { error:string } => {
    try {
        const { height, weight } = parseArguments(args);
        return calculateBmi(height, weight);
    } catch (error: unknown) {
        let errorMessage = 'Something went wrong: ';
        if (error instanceof Error) {
        errorMessage += error.message;
        }
        return { error: errorMessage };
    }
};