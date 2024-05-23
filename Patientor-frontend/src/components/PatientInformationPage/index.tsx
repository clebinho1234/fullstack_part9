import { useParams } from "react-router-dom";

import patientsService from "../../services/patients";
import { useEffect, useState } from "react";
import { Diagnosis, EntryWithoutId, Patient } from "../../types";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import PatientEntry from "./PatientEntry";
import { Typography } from "@mui/material";
import AddEntry from "./AddEntry";
import axios from "axios";
import Notify from "../Notify";

interface Props {
    diagnoses : Diagnosis[]
    setDiagnoses: React.Dispatch<React.SetStateAction<Diagnosis[]>>
    patients : Patient[]
    setPatients: React.Dispatch<React.SetStateAction<Patient[]>>
}

const PatientInformation = ({ diagnoses, setDiagnoses, patients, setPatients }: Props) => {
    const [patient, setPatient] = useState<Patient>();
    const [error, setError] = useState<string>('');
    
    const params = useParams();
    const id = params.id;

    useEffect(() => {
        const fetchPatientData = async () => {
            if(!id) return null;
            const patient = await patientsService.getPatient(id);
            setPatient(patient);
        };
        void fetchPatientData();
    }, [id]);

    useEffect(() => {
        if (error) {
          const timer = setTimeout(() => {
            setError('');
          }, 3000); 
    
          return () => clearTimeout(timer);
        }
    }, [error]);

    if (!patient) {
        return <div>Loading...</div>;
    }

    const handleSubmit = async (values: EntryWithoutId) => {
        try {
            const newPatient = await patientsService.createEntry(values, patient.id);

            setPatient(newPatient);
        } catch (e: unknown) {
            if (axios.isAxiosError(e)) {
                if (e?.response?.data && typeof e?.response?.data === "string") {
                    const message = e.response.data.replace('Something went wrong. Error: ', '');
                    console.error(message);
                    setError(message);
                } else {
                    setError("Unrecognized axios error");
                }
            } else {
                console.error("Unknown error", e);
                setError("Unknown error");
            }
        }
    };

    const handleData = (newPatient: Patient, newDiagnosis: Diagnosis) => {
        const updatedPatients: Patient[] = patients.map(p => 
            p.id !== newPatient.id ? p : newPatient
        );

        setPatients(updatedPatients);
        setPatient(newPatient);
        setDiagnoses(diagnoses.concat(newDiagnosis));
    };

    return (
        <div>
            <Notify errorMessage={error} />
            <Typography variant="h4" style={{ marginBottom: "0.5em", marginTop: "0.5em" }}>
                {patient.gender === 'female' ? (
                    <>
                        {patient.name} <FemaleIcon />
                    </>
                ) : patient.gender === 'male' ? (
                    <>
                        {patient.name} <MaleIcon />
                    </>
                ) : (
                    <>{patient.name}</>
                )}
            </Typography>
            <Typography variant="body1">ssn: {patient.ssn}</Typography>
            <Typography variant="body1">occupation: {patient.occupation}</Typography>
            <AddEntry handleSubmit={handleSubmit} setError={setError} />
            <Typography variant="h5" style={{ marginBottom: "0.5em", marginTop: "0.5em"}}><b>entries</b></Typography>
            {patient.entries.map(entry => (
                <div key={entry.id} style={{ marginBottom: '1em' }}>
                    <PatientEntry 
                        currentEntry={entry}
                        patient={patient}
                        handleData={handleData}
                        diagnoses={diagnoses}
                        setError={setError}
                        error={error}
                    />
                </div>
            ))}
        </div>
    );
};

export default PatientInformation;