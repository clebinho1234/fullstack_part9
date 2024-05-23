import axios from "axios";
import { Diagnosis } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
    const { data } = await axios.get<Diagnosis[]>(
        `${apiBaseUrl}/diagnoses`
    );

    return data;
};

const create = async (diagnosis: Diagnosis, patientId: string, entryId: string) => {
    const { data } = await axios.post<Diagnosis>(
        `${apiBaseUrl}/diagnoses`,
        { diagnosis, patientId, entryId }
    );

    return data;
};

export default {
    getAll, create
};