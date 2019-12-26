import { useState } from 'react';

export const useSubmit = (submitFunction) => {

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      setSubmitting(true);
      await submitFunction();
    } finally {
      setSubmitting(false);
    }
  };
  return [handleSubmit, submitting, setSubmitting];
};