import type { user } from "../features/auth/authSlice";

const userDataKey = "user_data";

export const getUserData = () : user => {
  const data = localStorage.getItem(userDataKey);
  return data ? JSON.parse(data) : null;
};

export const setUserData = (userData : user) => { 
  localStorage.setItem(userDataKey, JSON.stringify(userData));
};

export const removeUserData = () => {
  localStorage.removeItem(userDataKey);
};

export default {
  getUserData,
  setUserData,
  removeUserData,
};
