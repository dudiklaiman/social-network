import React, { createContext, useState, useContext } from 'react';

import { Dialog, DialogTitle, DialogActions, Button, Typography } from '@mui/material';

const ErrorContext = createContext();
export const useError = () => useContext(ErrorContext);


export const ErrorProvider = ({ children }) => {
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const showErrorDialog = (message) => {
        setErrorMessage(message);
        setIsErrorDialogOpen(true);
    };

    const hideErrorDialog = () => {
        setIsErrorDialogOpen(false);
        setTimeout(() => { setErrorMessage("") }, 300);
    };

    return (
        <ErrorContext.Provider value={{ showErrorDialog, hideErrorDialog }}>
            {children}
            <Dialog open={isErrorDialogOpen} onClose={hideErrorDialog}>
                <DialogTitle>
                    <Typography fontWeight="500">{errorMessage}</Typography>
                </DialogTitle>
                <DialogActions>
                    <Button onClick={hideErrorDialog} sx={{ color: 'grey' }}>Close</Button>
                </DialogActions>
            </Dialog>
        </ErrorContext.Provider>
    );
};
