import { Box, Button, ButtonGroup, Container, Typography } from "@mui/material";
import { EntryWithoutId } from "../../../types";
import HealthCheckEntry from "./HealthCheckEntry";
import OccupationalEntry from "./OccupationalEntry";
import HospitalEntry from "./HospitalEntry";
import { useState } from "react";

interface Props {
    handleSubmit: (values: EntryWithoutId) => void;
    setError: React.Dispatch<React.SetStateAction<string>>;
}

const AddEntry = ({ handleSubmit, setError }: Props) => {
    const [selectedForm, setSelectedForm] = useState('');

    const renderForm = () => {
        switch (selectedForm) {
        case 'healthCheck':
            return <HealthCheckEntry handleSubmit={handleSubmit} onCancel={setSelectedForm} setError={setError} />;
        case 'occupational':
            return <OccupationalEntry handleSubmit={handleSubmit} onCancel={setSelectedForm} setError={setError} />;
        case 'hospital':
            return <HospitalEntry handleSubmit={handleSubmit} onCancel={setSelectedForm} setError={setError} />;
        default:
            return null;
        }
    };

    return (
        <Container component="div" sx={{ paddingTop: '5px' }}>
            <Typography variant="h5" gutterBottom>
                Add Entry
            </Typography>
            <ButtonGroup variant="contained" color="primary">
                <Button onClick={() => setSelectedForm('healthCheck')}>HealthCheck Entry</Button>
                <Button onClick={() => setSelectedForm('occupational')}>Occupational Entry</Button>
                <Button onClick={() => setSelectedForm('hospital')}>Hospital Entry</Button>
            </ButtonGroup>
            <Box>
                {renderForm()}
            </Box>
        </Container>
    );
};

export default AddEntry;