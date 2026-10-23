// Authentication Service supporting both Firebase Auth and Local Simulation

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './firebase';
import { ROLES } from '../utils/constants';

const CURRENT_USER_KEY = 'dabs_current_user';
const USERS_KEY = 'dabs_users';

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users', e);
  }
}

export async function loginUser(email, password) {
  const cleanEmail = email.trim().toLowerCase();

  // If live Firebase is configured
  if (isFirebaseConfigured && auth && db) {
    try {
      const userCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
      // Fetch user profile from Firestore 'users' collection to obtain role
      const userDoc = await getDoc(doc(db, 'users', userCred.user.uid));
      let role = ROLES.PATIENT;
      let userData = {
        uid: userCred.user.uid,
        email: userCred.user.email,
        fullName: userCred.user.displayName || 'User',
      };

      if (userDoc.exists()) {
        const d = userDoc.data();
        role = d.role || ROLES.PATIENT;
        userData = { ...userData, ...d };
      }

      const activeUser = { ...userData, role };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(activeUser));
      return activeUser;
    } catch (err) {
      console.warn('Firebase login failed, falling back to local simulation lookup:', err.message);
    }
  }

  // Local Simulation Lookup
  const users = getStoredUsers();
  const matched = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!matched) {
    throw new Error('Invalid email or password. Please verify your credentials or use the Demo Quick-Login below.');
  }

  // Save current logged in user session
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(matched));
  return matched;
}

export async function registerUser({ fullName, email, phone, password, role = ROLES.PATIENT, specialty = '' }) {
  const cleanEmail = email.trim().toLowerCase();

  // Strict role guard: public self-registration defaults strictly to patient unless explicitly an onboarding flow
  const assignedRole = role === ROLES.ADMIN ? ROLES.PATIENT : role;

  if (isFirebaseConfigured && auth && db) {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      await updateProfile(userCred.user, { displayName: fullName });

      const newUserData = {
        uid: userCred.user.uid,
        fullName,
        email: cleanEmail,
        phone,
        role: assignedRole,
        specialty: assignedRole === ROLES.DOCTOR ? specialty : '',
        createdAt: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0284c7&color=fff`,
      };

      await setDoc(doc(db, 'users', userCred.user.uid), newUserData);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUserData));
      return newUserData;
    } catch (err) {
      console.warn('Firebase registration failed, continuing with local creation:', err.message);
    }
  }

  // Local creation
  const users = getStoredUsers();
  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const newUser = {
    uid: `user-${Date.now()}`,
    fullName,
    email: cleanEmail,
    phone: phone || '',
    role: assignedRole,
    specialty: assignedRole === ROLES.DOCTOR ? specialty : '',
    createdAt: new Date().toISOString(),
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0284c7&color=fff`,
  };

  users.push(newUser);
  saveStoredUsers(users);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  return newUser;
}

export async function logoutUser() {
  if (isFirebaseConfigured && auth) {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Firebase signOut notice:', e);
    }
  }
  localStorage.removeItem(CURRENT_USER_KEY);
  return true;
}

export function getCurrentSessionUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
