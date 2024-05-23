import { Box, Button, List, ListItem, Typography } from "@mui/material";
import AddDiagnosisModal from "../AddDiagnosisModal";
import { Diagnosis, Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry, Patient, HealthCheckRating } from "../../types";
import { useState } from "react";
import diagnosesService from "../../services/diagnoses";
import axios from "axios";
import { Work, MedicalServices, LocalHospital, Favorite } from '@mui/icons-material';

interface Props {
    currentEntry: Entry;
    patient: Patient;
    handleData: (newPatient: Patient, newDiagnosis: Diagnosis) => void;
    diagnoses: Diagnosis[];
    setError: React.Dispatch<React.SetStateAction<string>>;
    error: string | undefined;
}

interface HospitalProps {
    currentEntry: HospitalEntry;
    diagnoses: Diagnosis[];
}

interface HealthcareProps {
    currentEntry: HealthCheckEntry;
    diagnoses: Diagnosis[];
}

interface OccupationalProps {
    currentEntry: OccupationalHealthcareEntry;
    diagnoses: Diagnosis[];
}

const assertNever = (value: never): never => {
    throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
};

const HospitalEntryDetails = ({ currentEntry, diagnoses }: HospitalProps) => {
    return(
        <>
            <Typography variant="h6">
                <b>{currentEntry.date} <LocalHospital style={{ verticalAlign: -4 }} /></b>
            </Typography>
            <Typography paragraph> {currentEntry.description} </Typography>
            {currentEntry.diagnosisCodes && (
                <>
                    <Typography><b>Diagnoses:</b></Typography>
                    <List style={{ paddingTop: 0 }}>
                        {currentEntry.diagnosisCodes.map(d => (
                            diagnoses.map(diagnosis => diagnosis.code === d
                                ? (
                                    <ListItem key={diagnosis.code} style={{ paddingBottom: 0 }}>
                                        <Typography><strong>{diagnosis.code}</strong> {diagnosis.name}</Typography>
                                    </ListItem>
                                )
                                : null
                            )
                        ))}
                    </List>
                </>
            )}
            <Typography><b>Discharge:</b></Typography>
            <Typography paragraph>{currentEntry.discharge.date} - {currentEntry.discharge.criteria}</Typography>
            <Typography paragraph>diagnosed by <b>{currentEntry.specialist}</b></Typography>
        </>
    );
};

const HealthCheckEntryDetails = ({ currentEntry, diagnoses }: HealthcareProps) => {
    const getHealthRating = (rating: HealthCheckRating) => {
        switch (rating) {
            case HealthCheckRating.Healthy:
                return (
                    <Typography paragraph>
                        Health Rating: <Favorite style={{ color: 'green', verticalAlign: 'middle' }} /> (Healthy)
                    </Typography>
                );
            case HealthCheckRating.LowRisk:
                return (
                    <Typography paragraph>
                        Health Rating: <Favorite style={{ color: '#FFEA00', verticalAlign: 'middle' }}/> (Low Risk)
                    </Typography>
                );
            case HealthCheckRating.HighRisk:
                return (
                    <Typography paragraph>
                        Health Rating: <Favorite style={{ color: 'orange', verticalAlign: 'middle' }}/> (High Risk)
                    </Typography>
                );
            case HealthCheckRating.CriticalRisk:
                return (
                    <Typography paragraph>
                        Health Rating: <Favorite style={{ color: 'red', verticalAlign: 'middle' }}/> Critical Risk
                    </Typography>
                );
            default:
                return assertNever(rating);
        }
    };

    return(
        <>
            <Typography variant="h6">
                <b>{currentEntry.date} <MedicalServices style={{ verticalAlign: -2 }} /></b>
            </Typography>
            <Typography> {currentEntry.description} </Typography>
            {getHealthRating(currentEntry.healthCheckRating)}
            {currentEntry.diagnosisCodes && (
                <>
                    <Typography><b>Diagnoses:</b></Typography>
                    <List style={{ paddingTop: 0 }}>
                        {currentEntry.diagnosisCodes.map(d => (
                            diagnoses.map(diagnosis => diagnosis.code === d
                                ? (
                                    <ListItem key={diagnosis.code} style={{ paddingBottom: 0 }}>
                                        <Typography><strong>{diagnosis.code}</strong> {diagnosis.name}</Typography>
                                    </ListItem>
                                )
                                : null
                            )
                        ))}
                    </List>
                </>
            )}
            <Typography paragraph>diagnose by <b>{currentEntry.specialist}</b></Typography>
        </>
    );
};

const OccupationalHealthcareEntryDetails = ({ currentEntry, diagnoses }: OccupationalProps) => {
    return(
        <>
            <Typography variant="h6">
                <b>{currentEntry.date}</b> <Work style={{ verticalAlign: -3 }} /> {currentEntry.employerName}
            </Typography>
            <Typography paragraph> {currentEntry.description} </Typography>
            {currentEntry.diagnosisCodes && currentEntry.diagnosisCodes.length !== 0  && (
                <>
                    <Typography><b>Diagnoses:</b></Typography>
                    <List style={{ paddingTop: 0 }}>
                        {currentEntry.diagnosisCodes.map(d => (
                            diagnoses.map(diagnosis => diagnosis.code === d
                                ? (
                                    <ListItem key={diagnosis.code} style={{ paddingBottom: 0 }}>
                                        <Typography><strong>{diagnosis.code}</strong> {diagnosis.name}</Typography>
                                    </ListItem>
                                )
                                : null
                            )
                        ))}
                    </List>
                </>
            )}
            {currentEntry.sickLeave && (
                <>
                    <Typography style={{ marginTop: "10px" }}><b>Sick Leave:</b></Typography>
                    <Typography>Start date: {currentEntry.sickLeave.startDate}</Typography>
                    <Typography paragraph>End date: {currentEntry.sickLeave.endDate}</Typography>
                </>
            )}
            <Typography paragraph>diagnose by <b>{currentEntry.specialist}</b></Typography>
        </>
    );
};

const PatientEntry = ({ currentEntry, patient, handleData, diagnoses, setError, error }: Props) => {
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = (): void => setModalOpen(true);

    const closeModal = (): void => {
        setModalOpen(false);
        setError('');
    };

    const submitNewDiagnosis = async (values: Diagnosis) => {
        try {
            const newDiagnosis = await diagnosesService.create(values, patient.id, currentEntry.id);
            const newEntries = patient.entries.map(entry => entry.id === currentEntry.id 
                ? {...entry, diagnosisCodes: (entry.diagnosisCodes ?? []).concat(newDiagnosis.code)}
                : entry
            );

            const newPatient = {
                ...patient,
                entries: newEntries,
            };

            handleData(newPatient, newDiagnosis);
            setModalOpen(false);
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

    const renderSwitch = (currentEntry: Entry) => {
        switch(currentEntry.type) {
          case 'Hospital':
                return <HospitalEntryDetails currentEntry={currentEntry} diagnoses={diagnoses} />;
            case "HealthCheck":
                return <HealthCheckEntryDetails currentEntry={currentEntry} diagnoses={diagnoses} />;
            case "OccupationalHealthcare":
                return <OccupationalHealthcareEntryDetails currentEntry={currentEntry} diagnoses={diagnoses} />;
            default:
                assertNever(currentEntry);
        }
    };

    return (
            <Box key={currentEntry.id} sx={{ border: '1px solid', padding: '10px', borderRadius: '15px' }}>
                {renderSwitch(currentEntry)}
                <AddDiagnosisModal
                    modalOpen={modalOpen} 
                    onSubmit={submitNewDiagnosis}
                    error={error}
                    onClose={closeModal}
                />
                <Button variant="contained" onClick={openModal}>
                    Add New Diagnosis
                </Button>
            </Box>
    );
};

export default PatientEntry;