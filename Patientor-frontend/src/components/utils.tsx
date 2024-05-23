export const handleText = (value: string, setChange: React.Dispatch<React.SetStateAction<string>>) => {
    if (/^[A-Za-z ]+$/.test(value) || value === '') {
        setChange(value);
    }
};

export const handleInputChange = (value: string) => {
    if (/^[A-Z][0-9]+\.[0-9]+$/.test(value) || value === '') {
       return false;
    }
    return true;
};

export const currentDate: string = new Date().toISOString().split('T')[0];