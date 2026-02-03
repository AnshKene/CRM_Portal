export const USERS_KEY = "crm_users";
export const SESSION_KEY = "crm_session";

const readStorage = (key, fallback) => {
  if (typeof window === "undefined") {
    return fallback;
  }
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error("Failed to read storage", error);
    return fallback;
  }
};

const writeStorage = (key, value) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getStoredUsers = () => readStorage(USERS_KEY, []);

export const saveUser = (newUser) => {
  const users = getStoredUsers();
  const updatedUsers = [...users, newUser];
  writeStorage(USERS_KEY, updatedUsers);
  return updatedUsers;
};

export const findUserByEmail = (email) => {
  const users = getStoredUsers();
  return users.find((user) => user.email === email.toLowerCase());
};

export const authenticateUser = ({ email, password }) => {
  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    return null;
  }
  return user;
};

export const setSession = (user) => {
  const session = {
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    loggedInAt: new Date().toISOString(),
  };
  writeStorage(SESSION_KEY, session);
  return session;
};

export const getSession = () => readStorage(SESSION_KEY, null);

export const clearSession = () => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(SESSION_KEY);
};
