import { SyntheticEvent, useState } from "react";
import { Diagnosis } from "../../types";
import { Button, Grid, TextField } from "@mui/material";

interface Props {
    onCancel: () => void;
    onSubmit: (values: Diagnosis) => void;
}

const AddDiagnosisForm = ({ onSubmit, onCancel }: Props) => {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [latin, setLatin] = useState('');

    const addDiagnosis = (event: SyntheticEvent) => {
        event.preventDefault();
        onSubmit({
            code,
            name,
            latin,
        });
    };

    const handleText = (value: string, setChange: React.Dispatch<React.SetStateAction<string>>) => {
        if (/^[A-Za-z]+$/.test(value) || value === '') {
            setChange(value);
        }
    };

    return (
        <div>
            <form onSubmit={addDiagnosis}>
                <TextField
                        required
                        label="Code"
                        fullWidth
                        value={code}
                        onChange={({ target }) => setCode(target.value)}
                />
                <TextField
                        required
                        label="Name"
                        fullWidth
                        value={name}
                        onChange={({ target }) => handleText(target.value, setName)}
                />
                <TextField
                        label="Latin"
                        fullWidth
                        value={latin}
                        onChange={({ target }) => handleText(target.value, setLatin)}
                />

                <Grid>
                    <Grid item>
                        <Button
                                color="secondary"
                                variant="contained"
                                style={{ float: "left" }}
                                type="button"
                                onClick={onCancel}
                        >
                                Cancel
                        </Button>
                    </Grid>
                    <Grid item>
                            <Button
                                    style={{
                                        float: "right",
                                    }}
                                    type="submit"
                                    variant="contained"
                            >
                                    Add
                            </Button>
                        </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default AddDiagnosisForm;