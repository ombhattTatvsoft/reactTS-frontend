const userDataKey = "user_data";

type user = null | { id : string, email: string, role : string };

export const getUserData = () => {
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
