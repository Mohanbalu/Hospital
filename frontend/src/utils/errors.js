export const getErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }

  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'Something went wrong. Please try again.'
  );
};

export const isValidationError = (error) => Boolean(error?.response?.status === 400 || error?.response?.status === 422);
