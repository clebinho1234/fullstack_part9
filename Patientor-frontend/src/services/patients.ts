import axios from "axios";
import { EntryWithoutId, Patient, PatientFormValues } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
    const { data } = await axios.get<Patient[]>(
        `${apiBaseUrl}/patients`
    );

    return data;
};

const getPatient = async (id: string) => {
    const { data } = await axios.get<Patient>(
        `${apiBaseUrl}/patients/${id}`
    );

    return data;
};

const create = async (object: PatientFormValues) => {
    const { data } = await axios.post<Patient>(
        `${apiBaseUrl}/patients`,
        object
    );

    return data;
};

const createEntry = async (newEntryData: EntryWithoutId, patientId: string) => {
    const { data } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/entry`,
        { newEntryData, patientId }
    );

    return data;
};

export default {
    getAll, create, getPatient, createEntry
};

