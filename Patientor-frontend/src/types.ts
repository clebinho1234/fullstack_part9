export interface Diagnosis {
    code: string;
    name: string;
    latin?: string;
}

export enum Gender {
    Male = "male",
    Female = "female",
    Other = "other"
}

export enum HealthCheckRating {
    Healthy = 0,
    LowRisk = 1,
    HighRisk = 2,
    CriticalRisk = 3
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

export interface HealthCheckEntry extends BaseEntry {
    healthCheckRating: HealthCheckRating;
    type: "HealthCheck";
}

export interface OccupationalHealthcareEntry extends BaseEntry {
    employerName: string;
    sickLeave?: SickLeave;
    type: 'OccupationalHealthcare';
}

export interface HospitalEntry  extends BaseEntry {
    discharge: Discharge;
    type: 'Hospital';
}

export type Entry =
    | HospitalEntry
    | OccupationalHealthcareEntry
    | HealthCheckEntry;

type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
export type EntryWithoutId = UnionOmit<Entry, 'id'>;

export interface Patient {
    id: string;
    name: string;
    occupation: string;
    gender: Gender;
    ssn?: string;
    dateOfBirth?: string;
    entries: Entry[];
}

export type PatientFormValues = Omit<Patient, "id" | "entries">;