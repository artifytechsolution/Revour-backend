import { ValidationError } from 'yup';

interface ValidationErrors {
  [key: string]: string;
}

/**
 * Centralized error handling for Yup validation errors.
 * @param {ValidationError} err - Yup validation error object.
 * @returns {ValidationErrors} - Formatted error object containing error messages for each field.
 */
export const handleYupError = (err: ValidationError): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (err.inner && err.inner.length > 0) {
    err.inner.forEach((error) => {
      if (error.path) {
        errors[error.path] = error.message;
      }
    });
  } else if (err.path) {
    errors[err.path] = err.message;
  }

  return errors;
};
