import { Alert } from "@mui/material";

interface NotifyProps {
    errorMessage: string;
}

const Notify = ({ errorMessage }: NotifyProps) => {
    if ( errorMessage === '' ) {
        return null;
    }
    return (
        <Alert severity="error" style={{ marginTop: '8px' }}>
            {errorMessage}
        </Alert>
    );
};
  
export default Notify;