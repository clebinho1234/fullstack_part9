import { Box, Button, Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { Diagnosis, EntryWithoutId, HealthCheckRating } from "../../../types";
import { currentDate, handleInputChange, handleText } from "../../../utils";

interface Props {
    handleSubmit: (values: EntryWithoutId) => void;
    onCancel: React.Dispatch<React.SetStateAction<string>>;
    setError: React.Dispatch<React.SetStateAction<string>>;
}

interface HealthCheckRatingOption {
    value: HealthCheckRating;
    label: string;
}

const healthCheckRatingOptions: HealthCheckRatingOption[] = [
    { value: HealthCheckRating.Healthy, label: "Healthy" },
    { value: HealthCheckRating.LowRisk, label: "Low Risk" },
    { value: HealthCheckRating.HighRisk, label: "High Risk" },
    { value: HealthCheckRating.CriticalRisk, label: "Critical Risk" }
];

const HealthCheckEntry = ({ handleSubmit, onCancel, setError }: Props) => {
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [specialist, setSpecialist] = useState('');
    const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);
    const [diagnosisCode, setDiagnosisCode] = useState('');

    const onHealthCheckRatingChange = (event: SelectChangeEvent<HealthCheckRating>) => {
        const value = event.target.value as HealthCheckRating;
        setHealthCheckRating(value);
    };

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
            healthCheckRating,
            diagnosisCodes,
            type: "HealthCheck",
        });
        setDescription('');
        setDate('');
        setSpecialist('');
        setDiagnosisCode('');
    };

    return (
        <Container component="div" sx={{ border: '1px dashed', padding: '15px', borderRadius: '5px', mt: 2 }}>
            <Typography variant="h6"><b>Add Healthcheck Entry:</b></Typography>
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
                <FormControl fullWidth>
                    <InputLabel id="health-check-rating-label">HealthCheckRating</InputLabel>
                    <Select
                        labelId="health-check-rating-label"
                        id="health-check-rating"
                        value={healthCheckRating}
                        onChange={onHealthCheckRatingChange}
                        label="HealthCheckRating"
                    >
                        {healthCheckRatingOptions.map(option => (
                        <MenuItem
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </MenuItem>
                        ))}
                    </Select>
                </FormControl>
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

export default HealthCheckEntry;