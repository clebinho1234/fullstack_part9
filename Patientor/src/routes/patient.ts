import express from 'express';

import patientsService from '../services/patientsService';

import { toNewEntryData, toNewPatientData } from '../utils';
import { EntryWithoutId, NewPatientData } from '../types';

const router = express.Router();

router.get('/', (_req, res) => {
    res.send(patientsService.getNonSensitiveData());
});

router.get('/:id', (req, res) => {
    const patient = patientsService.findPatient(req.params.id);
    res.send(patient);
});

router.post('/', (req, res) => {
    try {
        const NewPatientData: NewPatientData = toNewPatientData(req.body);
    
        const addedEntry = patientsService.addPatient(NewPatientData);
        res.json(addedEntry);
    } catch (error: unknown) {
        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
          errorMessage += ' Error: ' + error.message;
        }
        res.status(400).send(errorMessage);
    }
});

router.post('/', (req, res) => {
    try {
        const NewPatientData: NewPatientData = toNewPatientData(req.body);
    
        const addedEntry = patientsService.addPatient(NewPatientData);
        res.json(addedEntry);
    } catch (error: unknown) {
        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
          errorMessage += ' Error: ' + error.message;
        }
        res.status(400).send(errorMessage);
    }
});

router.post('/entry', (req, res) => {
    try {
        const { newEntryData, patientId }: { newEntryData: EntryWithoutId; patientId: string } = toNewEntryData(req.body);
    
        const addedEntry = patientsService.addEntry(newEntryData, patientId);
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