import { apiFetch } from './api';
import { updateUserDetailsInLocalStorage } from './authService'; // Import the new function

export interface User {
  _id: string;
  name: string;
  email?: string; // Optional, as not always populated
  // Add other user fields if needed and they are populated in different contexts
}

export const updateUserProfile = async (userData: any | FormData) => {
  const options: RequestInit = {
    method: 'PUT',
  };

  if (userData instanceof FormData) {
    options.body = userData;
    // When FormData is used, browser sets Content-Type to multipart/form-data automatically.
    // Manually setting it to application/json would break the upload.
    // If other headers are needed, merge them carefully.
  } else {
    options.headers = {
      'Content-Type': 'application/json',
    };
    options.body = JSON.stringify(userData);
  }

  const response = await apiFetch('/users/update', options);
  // If the update was successful and the backend returns the updated user,
  // update the local storage with the new user details.
  if (response.success && response.data) {
    updateUserDetailsInLocalStorage(response.data);
  }
  return response;
};

export const getCurrentUser = async () => {
  return await apiFetch('/users/me', {
    method: 'GET',
  });
};
