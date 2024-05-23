import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { Diagnosis, EntryWithoutId, SickLeave } from "../../../types";

interface Props {
    handleSubmit: (values: EntryWithoutId) => void;
    onCancel: React.Dispatch<React.SetStateAction<string>>;
}

const OccupationalEntry = ({ handleSubmit, onCancel }: Props) => {
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [specialist, setSpecialist] = useState('');
    const [sickLeave, setSickLeave] = useState<SickLeave>();
    const [employerName, setEmployerName] = useState('');
    const [diagnosisCode, setDiagnosisCode] = useState('');

    const addEntry = (event: SyntheticEvent) => {
        event.preventDefault();
        const diagnosisCodes: Array<Diagnosis['code']> = diagnosisCode !== '' ? diagnosisCode.replace(/\s+/g, "").split(',') : [];
        handleSubmit({
            description,
            date,
            specialist,
            sickLeave,
            employerName,
            diagnosisCodes,
            type: "OccupationalHealthcare",
        });
        setDescription('');
        setDate('');
        setSpecialist('');
        setDiagnosisCode('');
        setEmployerName('');
        setSickLeave({startDate: '', endDate: ''});
    };

    const handleStartDate = (startDate: string) => {
        const newSickLeave = {
            startDate: startDate,
            endDate: sickLeave?.endDate ? sickLeave?.endDate : '',
        };
        setSickLeave(newSickLeave);
    };

    const handleEndDate = (endDate: string) => {
        const newSickLeave = {
            startDate: sickLeave?.startDate ? sickLeave?.startDate : '',
            endDate: endDate
        };
        setSickLeave(newSickLeave);
    };

    return (
        <Container component="div" sx={{ border: '1px dashed', padding: '15px', borderRadius: '5px', mt: 2 }}>
            <Typography variant="h6"><b>Add Occupational Entry:</b></Typography>
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
                <Typography variant="body1">Sick Leave(optional):</Typography>
                <TextField
                    label="Start Date"
                    placeholder="YYYY-MM-DD"
                    fullWidth
                    value={sickLeave?.startDate}
                    onChange={({ target }) => handleStartDate(target.value)}
                />
                <TextField
                    label="End Date"
                    placeholder="YYYY-MM-DD"
                    fullWidth
                    value={sickLeave?.endDate}
                    onChange={({ target }) => handleEndDate(target.value)}
                />
                <TextField
                    label="EmployerName"
                    required
                    fullWidth
                    value={employerName}
                    onChange={({ target }) => setEmployerName(target.value)}
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

export default OccupationalEntry;