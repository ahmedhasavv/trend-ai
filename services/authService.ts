import { User } from '../types';

const USERS_DB_KEY = 'trendai-users-db';
const SESSION_KEY = 'trendai-user-session';

// Helper to get all users from localStorage
const getUsers = (): Record<string, { id: string, email: string, passwordHash: string }> => {
    try {
        const users = localStorage.getItem(USERS_DB_KEY);
        return users ? JSON.parse(users) : {};
    } catch (e) {
        console.error("Could not parse user database from localStorage", e);
        return {};
    }
}

// Helper to save all users to localStorage
const saveUsers = (users: Record<string, any>) => {
    try {
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    } catch(e) {
        console.error("Could not save user database to localStorage", e);
    }
}

export const login = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const allUsers = getUsers();
      const userRecord = allUsers[email];
      if (userRecord && userRecord.passwordHash === password) { // Mock password check
        const user: User = { id: userRecord.id, email: userRecord.email };
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error('Invalid email or password.'));
      }
    }, 500);
  });
};

export const signUp = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const allUsers = getUsers();
      if (allUsers[email]) {
        return reject(new Error('A user with this email already exists.'));
      }
      
      const newId = `user-${Date.now()}`;
      const newUserRecord = { id: newId, email, passwordHash: password }; // Store mock "hashed" password
      allUsers[email] = newUserRecord;
      saveUsers(allUsers);

      const userForSession: User = { id: newId, email };
      localStorage.setItem(SESSION_KEY, JSON.stringify(userForSession));
      resolve(userForSession);
    }, 500);
  });
};

export const logout = async (): Promise<void> => {
  return new Promise(resolve => {
    localStorage.removeItem(SESSION_KEY);
    resolve();
  });
};

export const onAuthStateChanged = (callback: (user: User | null) => void): (() => void) => {
  const checkUser = () => {
    try {
      const storedUser = localStorage.getItem(SESSION_KEY);
      callback(storedUser ? JSON.parse(storedUser) : null);
    } catch (error) {
      console.error("Failed to parse user session from localStorage", error);
      callback(null);
    }
  };

  // Initial check
  checkUser();

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === SESSION_KEY) {
      checkUser();
    }
  };
  
  window.addEventListener('storage', handleStorageChange);

  // Return an unsubscribe function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};
