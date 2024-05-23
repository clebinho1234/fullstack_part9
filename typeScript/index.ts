import express from 'express';
import qs from 'qs';
import { bmiCalculator } from './bmiCalculator';
import { exerciseCalculator } from './exerciseCalculator';
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack');
});

app.get('/bmi', (req, res) => {
    const queryString = qs.stringify(req.query);

    const parsedQuery = qs.parse(queryString);

    const queryArray: string[] = Object.values(parsedQuery).filter((value): value is string => typeof value === 'string');
    
    const bmiValues = bmiCalculator(queryArray);

    res.json(bmiValues);
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const dailyExercises: string[] = req.body.daily_exercises;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const target: string = req.body.target;

  if ( !dailyExercises ) {
    return res.status(400).send({ error: 'parameters missing'});
  }
  if ( !target ) {
    return res.status(400).send({ error: 'parameters missing'});
  }

  const result = exerciseCalculator(dailyExercises, target);
  return res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});