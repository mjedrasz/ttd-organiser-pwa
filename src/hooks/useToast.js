import { useState } from 'react';

export const useToast = () => {

    const [toast, setToast] = useState({ message: '', variant: 'info', open: false });

    const hideToast = () => {
        setToast({ message: '', variant: 'info', open: false })
    };

    const showToast = (message, variant) => {
        setToast({message, variant, open: true });
    };

    return [{
        message: toast.message,
        open: toast.open,
        onClose: hideToast,
        variant: toast.variant
    }, showToast, hideToast];
};