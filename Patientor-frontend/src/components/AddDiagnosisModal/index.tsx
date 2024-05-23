import { Dialog, DialogTitle, DialogContent, Divider, Alert } from '@mui/material';

import AddDiagnosisForm from "./AddDiagnosisForm";
import { Diagnosis } from "../../types";

interface Props {
    modalOpen: boolean;
    onClose: () => void;
    onSubmit: (values: Diagnosis) => void;
    error?: string;
}

const AddDiagnosisModal = ({ modalOpen, onClose, onSubmit, error }: Props) => (
    <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
        <DialogTitle>Add a new diagnosis</DialogTitle>
        <Divider />
        <DialogContent>
            {error && <Alert severity="error">{error}</Alert>}
            <AddDiagnosisForm onSubmit={onSubmit} onCancel={onClose} />
        </DialogContent>
    </Dialog>
);

export default AddDiagnosisModal;