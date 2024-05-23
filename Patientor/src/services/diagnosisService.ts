import diagnoses from '../../data/diagnoses';

import { Diagnosis, Entry } from '../types';
import patientsService from './patientsService';

const getDiagnoses = (): Diagnosis[] => {
    return diagnoses;
};

const addDiagnosis = (diagnosis: Diagnosis, patientId:string, entryId: string): Diagnosis => {
    const patient = patientsService.findPatient(patientId);
    
    const updatedEntries: Entry[] = patient.entries.map(entry => {
        return entry.id === entryId 
        ? {...entry, diagnosisCodes: (entry.diagnosisCodes ?? []).concat(diagnosis.code)}
        : entry;
    });

    const updatedPatient = {...patient, entries: updatedEntries};
    patientsService.updateEntries(updatedPatient);
    
    diagnoses.push(diagnosis);
    
    return diagnosis;
};

export default {
    getDiagnoses,
    addDiagnosis
};