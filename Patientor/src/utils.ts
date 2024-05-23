import { NewPatientData, Gender, Entry, Diagnosis, EntryWithoutId, HealthCheckRating, SickLeave, Discharge } from './types';

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const isNumber = (text: unknown): text is number => {
    return typeof text === 'number';
};

const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
    return Object.values(Gender).map(v => v.toString()).includes(param);
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
    return Object.values(HealthCheckRating).map(v => Number(v)).includes(param);
};

const isEntry = (entries: unknown[]): entries is Entry[] => {
    return entries.every(entry => entry instanceof Object && !(entry instanceof Array));
};

const isObject = (obj: unknown): obj is object => {
    return obj !== null && typeof obj === 'object';
};

const parseField = <T>(field: unknown, validator: (value: unknown) => value is T): T => {
    if (!validator(field)) {
        throw new Error('Incorrect or missing date: ' + field);
    }
    return field;
};

const parseSsn = (ssn: unknown): string => {
    if (!isString(ssn) || !/^[0-9]+-[A-Z0-9]+$/.test(ssn)) {
        throw new Error('Incorrect or missing ssn: ' + ssn);
    }
    return ssn;
};

const parseDate = (date: unknown): string => {
    if (!isString(date) || !isDate(date)) {
        throw new Error('Incorrect or missing date: ' + date);
    }
    return date;
};

const parseType = (type: unknown): string => {
    if (type === 'HealthCheck' || type === 'OccupationalHealthcare' || type === 'Hospital') {
        return type;
    }
    throw new Error('Incorrect or missing type: ' + type);
};

const parseGender = (gender: unknown): Gender => {
    if (!isString(gender) || !isGender(gender)) {
        throw new Error('Incorrect or missing gender: ' + gender);
    }
    return gender;
};

const parseHealthCheckRating = (healthCheckRating: unknown): HealthCheckRating => {
    if (!isNumber(healthCheckRating) || !isHealthCheckRating(healthCheckRating)) {
        throw new Error('Incorrect or missing healthCheck Rating: ' + healthCheckRating);
    }
    return healthCheckRating;
};

const parseEntries = (occupation: unknown[]): Entry[] => {
    if (!isEntry(occupation)) {
      throw new Error('Incorrect or missing entries');
    }
  
    return occupation;
};


export const toNewPatientData = (data: unknown): NewPatientData => {
    const object = parseField(data, isObject);
    
    if ('name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object)  {
        const newPatient: NewPatientData = {
            name: parseField(object.name, isString),
            dateOfBirth: parseDate(object.dateOfBirth),
            ssn: parseSsn(object.ssn),
            gender: parseGender(object.gender),
            occupation: parseField(object.occupation, isString),
            entries: 'entries' in object && Array.isArray(object.entries) ? parseEntries(object.entries) : [],
        };
    
        return newPatient;
    }
    
    throw new Error('Incorrect data: some fields are missing');
};

const parseDiagnosisCode = (object: unknown): Array<Diagnosis['code']> => {
    if(!object || typeof object !== 'object' || !('diagnosisCode' in object)) {
        return [] as Array<Diagnosis['code']>;
    }

    return object as Array<Diagnosis['code']>;
};

const parseBaseEntry = (entry: object): EntryWithoutId => {
    if('date' in entry && 'specialist' in entry && 'description' in entry){
        const NewEntry = {
            date: parseDate(entry.date),
            specialist: parseField(entry.specialist, isString),
            diagnosisCodes: parseDiagnosisCode(entry),
            description: parseField(entry.description, isString),
        };
        return NewEntry;
    }
    throw new Error('Incorrect or missing entry');
};

const parseHealthCheckEntry = (entry: object): EntryWithoutId => {
    if('healthCheckRating' in entry) {
        const healthCheckEntry = {
            ...parseBaseEntry(entry),
            healthCheckRating: parseHealthCheckRating(entry.healthCheckRating),
            type: "HealthCheck",
        };
        return healthCheckEntry;
    }
    throw new Error('Missing healthCheck Rating');
};

const parseSickLeave = (data: unknown): SickLeave => {
    const sickLeave = parseField(data, isObject);
    if('startDate' in sickLeave && 'endDate' in sickLeave){
        const newSickLeave = {
            startDate: parseDate(sickLeave.startDate),
            endDate: parseDate(sickLeave.endDate),
        };
        return newSickLeave;
    }
    throw new Error('Incorrect sickLeave');
};

const parseOccupationalHealthcareEntry = (entry: object): EntryWithoutId => {
    if('employerName' in entry) {
        const occupationalHealthcareEntry = {
            ...parseBaseEntry(entry),
            employerName: parseField(entry.employerName, isString),
            sickLeave: 'sickLeave' in entry ? parseSickLeave(entry.sickLeave) : undefined,
            type: "OccupationalHealthcare",
        };
        return occupationalHealthcareEntry;
    }
    throw new Error('Incorrect or missing Health Check Rating');
};

const parseDischarge = (data: unknown): Discharge => {
    const discharge = parseField(data, isObject);
    if('date' in discharge && 'criteria' in discharge){
        const newDischarge = {
            date: parseDate(discharge.date),
            criteria: parseField(discharge.criteria, isString),
        };
        return newDischarge;
    }
    throw new Error('Incorrect discharge');
};

const parseHospitalEntry = (entry: object): EntryWithoutId => {
    if('discharge' in entry) {
        const healthCheckEntry = {
            ...parseBaseEntry(entry),
            discharge: parseDischarge(entry.discharge),
            type: "Hospital",
        };
        return healthCheckEntry;
    }
    throw new Error('Incorrect or missing Health Check Rating');
};

const parseEntry = (data: unknown): EntryWithoutId => {
    const entry = parseField(data, isObject);

    if ('date' in entry && 'specialist' in entry && 'description' in entry && 'type' in entry)  {
        switch(parseType(entry.type)) {
            case 'HealthCheck':
                return parseHealthCheckEntry(entry);
            case 'OccupationalHealthcare':
                return parseOccupationalHealthcareEntry(entry);
            case 'Hospital':
                return parseHospitalEntry(entry);
            default:
                throw new Error('Incorrect data: some fields are missing');
        }
    }
    else {
        throw new Error('Incorrect or missing entry');
    }
};

export const toNewEntryData = (data: unknown): { newEntryData: EntryWithoutId, patientId: string } => {
    const object = parseField(data, isObject);

    if ('newEntryData' in object && 'patientId' in object)  {
        const newDiagnosisData = {
            newEntryData: parseEntry(object.newEntryData),
            patientId: parseField(object.patientId, isString),
        };
    
        return newDiagnosisData;
    }

    throw new Error('Incorrect data: some fields are missing');
};

const parseCode = (code: unknown): string => {
    if (!isString(code) || !/^[A-Z][0-9]+.[0-9]+$/.test(code)) {
        throw new Error('Incorrect or missing code: ' + code);
    }
    return code;
};

const parseDiagnosis = (data: unknown): Diagnosis => {
    const diagnosis = parseField(data, isObject);

    if ('code' in diagnosis && 'name' in diagnosis)  {
        const NewDiagnosis: Diagnosis = {
            code: parseCode(diagnosis.code),
            name: parseField(diagnosis.name, isString),
            latin: 'latin' in diagnosis ? parseField(diagnosis.latin, isString) : undefined,
        };
    
        return NewDiagnosis;
    }
    else {
        throw new Error('Incorrect or missing diagnosis');
    }
};

export const toNewDiagnosis = (data: unknown): { diagnosis: Diagnosis, patientId: string, entryId: string } => {
    const object = parseField(data, isObject);

    if ('diagnosis' in object && 'patientId' in object && 'entryId' in object)  {
        const newDiagnosisData = {
            diagnosis: parseDiagnosis(object.diagnosis),
            patientId: parseField(object.patientId, isString),
            entryId: parseField(object.entryId, isString),
        };
    
        return newDiagnosisData;
    }
    
    throw new Error('Incorrect data: some fields are missing');
};