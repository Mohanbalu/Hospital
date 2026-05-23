export const getErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }

  const responseData = error?.response?.data || error?.data || error;
  if (typeof responseData?.message === 'string' && responseData.message.trim()) {
    return responseData.message;
  }

  if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
    return responseData.errors.filter(Boolean).join(', ');
  }

  if (responseData?.success === false && typeof responseData?.message === 'string') {
    return responseData.message;
  }

  return (
    error?.response?.data?.error ||
    error?.response?.data?.details ||
    error?.message ||
    'Something went wrong. Please try again.'
  );
};

export const isValidationError = (error) => Boolean(error?.response?.status === 400 || error?.response?.status === 422);

export const getFieldErrors = (error) => error?.response?.data?.errors || [];
