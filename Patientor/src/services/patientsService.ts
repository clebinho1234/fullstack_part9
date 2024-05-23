import { v1 as uuid } from 'uuid';

import patients from '../../data/patients';

import { NonSensitivePatientData, Patient, NewPatientData, EntryWithoutId } from '../types';

const getPatients = (): Patient[] => {
  return patients;
};

const getNonSensitiveData = (): NonSensitivePatientData[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
    }));
  };

const addPatient = (patientData: NewPatientData): Patient => {
    const newPatient = {
        id: uuid(),
        ...patientData
    };
    
    patients.push(newPatient);
    return newPatient;
};

const findPatient = (id: string): Patient => {
    const patient = patients.find(patient => patient.id === id);
    if(patient)
        return patient;
    throw Error('Patient not find');
};

const addEntry = (newEntryData: EntryWithoutId, patientId: string): Patient => {
    const newEntry = {
        id: uuid(),
        ...newEntryData,
    };

    const patient: Patient = findPatient(patientId);

    const updatedPatient: Patient = {
        ...patient,
        entries: patient.entries.concat(newEntry)
    };

    updateEntries(updatedPatient);
    return updatedPatient;
};

const updateEntries = (updatedPatient: Patient) => {
    let index = -1;
    patients.map((patient, currentIndex) => {
        if( patient.id === updatedPatient.id) index = currentIndex;
    });
    if(index !== -1)
        patients[index] = updatedPatient;
    
    return patients;
};

export default {
    getPatients,
    addPatient,
    getNonSensitiveData,
    findPatient,
    addEntry,
    updateEntries
};