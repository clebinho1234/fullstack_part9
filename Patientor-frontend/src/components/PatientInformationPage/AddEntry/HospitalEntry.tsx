import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { Diagnosis, Discharge, EntryWithoutId } from "../../../types";

interface Props {
    handleSubmit: (values: EntryWithoutId) => void;
    onCancel: React.Dispatch<React.SetStateAction<string>>;
}

const HospitalEntry = ({ handleSubmit, onCancel }: Props) => {
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [specialist, setSpecialist] = useState('');
    const [discharge, setDischarge] = useState<Discharge>({date: '', criteria: ''});
    const [diagnosisCode, setDiagnosisCode] = useState('');

    const addEntry = (event: SyntheticEvent) => {
        event.preventDefault();
        const diagnosisCodes: Array<Diagnosis['code']> = diagnosisCode !== '' ? diagnosisCode.replace(/\s+/g, "").split(',') : [];
        handleSubmit({
            description,
            date,
            specialist,
            discharge,
            diagnosisCodes,
            type: "Hospital",
        });
        setDescription('');
        setDate('');
        setSpecialist('');
        setDiagnosisCode('');
        setDischarge({date: '', criteria: ''});
    };

    const handleDischargeDate = (date: string) => {
        const newDischarge = {
            date: date,
            criteria: discharge.criteria,
        };
        setDischarge(newDischarge);
    };

    const handleCriteria = (criteria: string) => {
        const newDischarge = {
            date: discharge.date,
            criteria: criteria
        };
        setDischarge(newDischarge);
    };

    return (
        <Container component="div" sx={{ border: '1px dashed', padding: '15px', borderRadius: '5px', mt: 2 }}>
            <Typography variant="h6"><b>Add Hospital Entry:</b></Typography>
            <Box component="form" onSubmit={addEntry} noValidate autoComplete="off">
                <TextField
                    required
                    label="Description"
                    fullWidth
                    value={description}
                    onChange={({ target }) => setDescription(target.value)}
                />
                <TextField
                    required
                    label="Date"
                    placeholder="YYYY-MM-DD"
                    fullWidth
                    value={date}
                    onChange={({ target }) => setDate(target.value)}
                />
                <TextField
                    required
                    label="Specialist"
                    fullWidth
                    value={specialist}
                    onChange={({ target }) => setSpecialist(target.value)}
                />
                <Typography variant="body1">Discharge:</Typography>
                <TextField
                    required
                    label="Discharge Date"
                    placeholder="YYYY-MM-DD"
                    fullWidth
                    value={discharge.date}
                    onChange={({ target }) => handleDischargeDate(target.value)}
                />
                <TextField
                    required
                    label="Criteria"
                    fullWidth
                    value={discharge.criteria}
                    onChange={({ target }) => handleCriteria(target.value)}
                />
                <TextField
                    label="Diagnosis Code"
                    fullWidth
                    value={diagnosisCode}
                    onChange={({ target }) => setDiagnosisCode(target.value)}
                />
                <Box
                    display="flex"
                    justifyContent="space-between"
                    mt={2}
                >
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => onCancel('')}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained">
                        Add
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default HospitalEntry;