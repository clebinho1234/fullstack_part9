import express from 'express';

import diagnosisService from '../services/diagnosisService';
import { Diagnosis } from '../types';
import { toNewDiagnosis } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
    res.send(diagnosisService.getDiagnoses());
});

router.post('/', (req, res) => {
    try {
        const { diagnosis, patientId, entryId }: { diagnosis: Diagnosis; patientId: string; entryId: string } = toNewDiagnosis(req.body);
    
        const addedEntry = diagnosisService.addDiagnosis(diagnosis, patientId, entryId);
        res.json(addedEntry);
    } catch (error: unknown) {
        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
          errorMessage += ' Error: ' + error.message;
        }
        res.status(400).send(errorMessage);
    }
});

export default router;