export enum Gender {
    Male = 'male',
    Female = 'female',
    Other = 'other'
}

export enum HealthCheckRating {
    "Healthy" = 0,
    "LowRisk" = 1,
    "HighRisk" = 2,
    "CriticalRisk" = 3
}
  

export interface Diagnosis {
    code: string;
    name: string;
    latin?: string;
}

export interface Discharge {
    date: string;
    criteria: string;
}

export interface SickLeave {
    startDate: string;
    endDate: string;
}

interface BaseEntry {
    id: string;
    date: string;
    specialist: string;
    diagnosisCodes?: Array<Diagnosis['code']>;
    description: string;
}

interface HealthCheckEntry extends BaseEntry {
    healthCheckRating: HealthCheckRating;
    type: "HealthCheck";
}

interface OccupationalHealthcareEntry extends BaseEntry {
    employerName: string;
    sickLeave?: SickLeave;
    type: 'OccupationalHealthcare';
}

interface HospitalEntry  extends BaseEntry {
    discharge: Discharge;
    type: 'Hospital';
}

export type Entry =
    | HospitalEntry
    | OccupationalHealthcareEntry
    | HealthCheckEntry
    | BaseEntry;

type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
export type EntryWithoutId = UnionOmit<Entry, 'id'>;

export interface Patient {
    id: string;
    name: string;
    dateOfBirth: string;
    ssn: string;
    gender: Gender;
    occupation: string;
    entries: Entry[];
}

export type NonSensitivePatientData = Omit<Patient, 'ssn' | 'entries'>;

export type NewPatientData = Omit<Patient, 'id'>;