import * as yup from 'yup';

export const RegisterSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password cannot be more than 32 characters')
    .required('Password is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  role: yup.string().required('role is required'),
});

export const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password cannot be more than 32 characters')
    .required('Password is required'),
});

export const verifyUserSchema = yup.object().shape({
  isVerified: yup.boolean(),
});
