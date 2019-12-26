import { useState, useCallback, useEffect } from 'react';
import { isRequired, isEmail, isMinLength, isMaxLength } from 'calidators';

const isEmpty = ({ message }) => value => value && value.length > 0 ? null : message;


const validators = { isRequired, isEmail, isMinLength, isMaxLength, isEmpty };

const validateField = (fieldValue = '', validationRules) => {

    const config = (validationRules, validatorName) => {
        const config = validationRules[validatorName];
        if (typeof config === 'string') {
            return { message: config };
        } else {
            return config;
        }
    }

    for (const validatorName in validationRules) {

        let validatorConfig = config(validationRules, validatorName);

        const configuredValidator = validators[validatorName](validatorConfig);
        const errorMessage = configuredValidator(fieldValue);

        if (errorMessage) {
            return errorMessage;
        }
    }
    return null;
};

export const useFormInput = ({
    name,
    defaultValue = '',
    validation = {},
    values,
    setValues,
    handleError,
    validate,
    setValidate,
}) => {
    const inputValue = values[name] || defaultValue;

    const [value, setValue] = useState(inputValue);
    const [isValid, setIsValid] = useState(true);
    const [isTouched, setIsTouched] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [validationRules] = useState(validation);
    const [error, setError] = useState('');

    const handleValidation = useCallback(() => {
        const error = validateField(value, validationRules);
        const isValid = error === null;
        setIsValid(isValid);
        setError(error);
        handleError(name, isValid);
    }, [setIsValid, validationRules, name, value, handleError]);

    // watch for external parent data changes
    useEffect(() => {
        if (value !== inputValue) {
            setValue(inputValue);
            setIsTouched(false);
            setIsFocused(false);
        }
    }, [inputValue, value, setValue, setIsFocused, setIsTouched]);

    // validate on value change
    useEffect(() => {
        handleValidation();
    }, [handleValidation, name]);

    // rewrite self and parent's value
    const handleChange = useCallback(({ target }) => {
        const { value, checked, type } = target;
        const newValue = type === 'checkbox' ? checked : value;

        const data = { ...values, [name]: newValue };

        setValue(newValue);
        setValues(data);
    }, [setValue, values, setValues, name]);

    const handleFocus = useCallback(() => {
        setIsTouched(true);
        setIsFocused(true);
        if (validate) {
            handleValidation();
        }
        setValidate(true);

    }, [setIsTouched, setIsFocused, handleValidation, setValidate, validate]);

    const handleBlur = useCallback(() => {
        if (validate) {
            setIsFocused(false);
        }
    }, [setIsFocused, validate]);

    const showError = !isValid && isTouched && !isFocused;
    const errorMessage = (showError && error) || '';
    return {
        value,
        name,
        onChange: handleChange,
        onFocus: handleFocus,
        onBlur: handleBlur,
        error: showError,
        helperText: errorMessage
    };
};

export const useForm = (initialValues) => {
    const [values, setValues] = useState(initialValues || {});
    const [mounted, setMounted] = useState(false);
    const [errors, setErrors] = useState([]);
    const [validate, setValidate] = useState(true);

    const handleError = useCallback((name, isValid) => {
        const index = errors.findIndex(error => error === name);
        if (!isValid) {
            if (index < 0) {
                setErrors(errors.concat(name));
            }
        } else {
            if (index > -1) {
                setErrors([
                    ...errors.slice(0, index),
                    ...errors.slice(index + 1)
                ]);
            };
        }
    }, [errors]);

    const useInput = (name, defaultValue, validation) => useFormInput({
        name,
        defaultValue,
        validation,
        values,
        setValues,
        handleError,
        validate,
        setValidate,
    });

    const preventValidation = () => setValidate(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return {
        values,
        setValues,
        useInput,
        errors,
        setErrors,
        isValid: mounted && !errors.length,
        preventValidation,
    };
};