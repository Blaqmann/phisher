// src/utils/firebaseErrors.js
const firebaseErrorMessages = {
    'auth/email-already-in-use': 'This email is already in use.',
    'auth/invalid-email': 'The email address is not valid.',
    'auth/operation-not-allowed': 'This operation is not allowed. Please contact support.',
    'auth/weak-password': 'The password is too weak. Please choose a stronger password.',
    'auth/user-disabled': 'This user has been disabled. Please contact support.',
    'auth/user-not-found': 'User not found. Please check your email and password.',
    'auth/wrong-password': 'The password is incorrect. Please try again.',
    'auth/network-request-failed': 'Request failed, please try again later.',
    'auth/too-many-requests': 'Too many requests. Please try again later.',
    'auth/requires-recent-login': 'Please log in again to perform this action.',
    // Add more error codes and messages as needed
};

export const getFirebaseErrorMessage = (errorCode) => {
    return firebaseErrorMessages[errorCode] || 'An unexpected error occurred. Please try again later.';
};
