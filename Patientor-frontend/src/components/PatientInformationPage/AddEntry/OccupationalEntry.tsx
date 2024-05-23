import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { Diagnosis, EntryWithoutId, SickLeave } from "../../../types";
import { currentDate, handleInputChange, handleText } from "../../utils";

interface Props {
    handleSubmit: (values: EntryWithoutId) => void;
    onCancel: React.Dispatch<React.SetStateAction<string>>;
    setError: React.Dispatch<React.SetStateAction<string>>;
}

const OccupationalEntry = ({ handleSubmit, onCancel, setError }: Props) => {
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [specialist, setSpecialist] = useState('');
    const [sickLeave, setSickLeave] = useState<SickLeave>();
    const [employerName, setEmployerName] = useState('');
    const [diagnosisCode, setDiagnosisCode] = useState('');

    const addEntry = (event: SyntheticEvent) => {
        event.preventDefault();
        const diagnosisCodes: Array<Diagnosis['code']> = diagnosisCode !== '' ? diagnosisCode.replace(/\s+/g, "").split(',') : [];

        for (const code of diagnosisCodes) {
            if (handleInputChange(code)) {
                setError(`Invalid diagnosis code: ${code}. Expected format: A12.3, B1.21, C12.21`);
                return;
            }
        }
        
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
                    type="Date"
                    label="Date"
                    value={date}
                    onChange={({ target }) => setDate(target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        inputProps: {
                        max: currentDate,
                        },
                    }}
                />
                <TextField
                    required
                    label="Specialist"
                    fullWidth
                    value={specialist}
                    onChange={({ target }) => handleText(target.value, setSpecialist)}
                />
                <Typography variant="body1">Sick Leave(optional):</Typography>
                <TextField
                    type="Date"
                    label="Start Date"
                    value={sickLeave?.startDate}
                    onChange={({ target }) => handleStartDate(target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        inputProps: {
                        max: currentDate,
                        },
                    }}
                />
                <TextField
                    type="Date"
                    label="End Date"
                    value={sickLeave?.endDate}
                    style={{ paddingBottom: '10px' }}
                    onChange={({ target }) => handleEndDate(target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        inputProps: {
                        max: currentDate,
                        },
                    }}
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