import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCHhUKA8EVgEzQirLUUnflF0i5LEJUZRRQ",
  authDomain: "doople-ca3b2.firebaseapp.com",
  projectId: "doople-ca3b2",
  storageBucket: "doople-ca3b2.appspot.com",
  messagingSenderId: "373135843629",
  appId: "1:373135843629:web:70606693d5f6c622f233a4",
  measurementId: "G-L5DRBTZVF2"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {
  const { uid, displayName, email } = userAuth;

  if (!displayName) {
    console.error("Display name is null or undefined");
    return;
  }

  // Check if the username (displayName) is already taken
  const usernameDocRef = doc(db, 'usernames', displayName);
  const usernameSnapshot = await getDoc(usernameDocRef);

  if (usernameSnapshot.exists()) {
    throw new Error('Username is already taken');
  }

  // If the username is unique, proceed to create the user document
  const userDocRef = doc(db, 'users', uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const createdAt = new Date();

    try {
      // Set the document in the 'users' collection
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation
      });

      // Set the document in the 'usernames' collection for uniqueness check
      await setDoc(usernameDocRef, { uid });

      console.log("User created:", displayName);
    } catch (error) {
      console.error('Error creating the user:', error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password, displayName) => {
  if (!email || !password) return;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    if (displayName) {
      await updateDisplayName(userCredential.user, displayName);
    }

    return userCredential;
  } catch (error) {
    console.error('Error creating the user', error.message);
    throw error;
  }
};

const updateDisplayName = async (user, displayName) => {
  try {
    await updateProfile(user, { displayName });
  } catch (error) {
    console.error('Error updating display name', error.message);
    throw error;
  }
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback);

export const doesUserExist = async (displayName) => {
  try {
    const userDocRef = doc(db, 'usernames', displayName);
    const userSnapshot = await getDoc(userDocRef);

    return userSnapshot.exists();
  } catch (error) {
    console.error('Error checking user existence', error);
    return false;
  }
};

export const getUserByUID = async (uid) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      return userSnapshot.data();
    } else {
      console.error('User not found');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving user by UID', error);
    return null;
  }
};

export const getUserByUsername = async (username) => {
  try {
    const usernameDocRef = doc(db, 'usernames', username);
    const usernameSnapshot = await getDoc(usernameDocRef);

    if (usernameSnapshot.exists()) {
      const uid = usernameSnapshot.data().uid;
      return await getUserByUID(uid);
    } else {
      console.error('Username not found');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving user by username', error);
    return null;
  }
};

export const uploadProfileImage = async (user, imageData) => {
  if (!user || !imageData) {
    console.error('Invalid user or image data.');
    return;
  }

  const storage = getStorage();
  const storageRef = ref(storage, `profileImages/${user.uid}/profilePicture.png`);

  try {
    await uploadString(storageRef, imageData, 'data_url');
    const downloadURL = await getDownloadURL(storageRef);

    await updateProfile(user, { photoURL: downloadURL });
    console.log(`Profile image updated to: ${downloadURL}`);
  } catch (error) {
    console.error('Error updating profile image:', error.message);
    throw new Error('Failed to update profile image.');
  }
};


export const retrieveProfileImage = async (user) => {
  if (!user || !user.uid) {
    console.error('Invalid user.');
    return null;
  }

  const storage = getStorage();
  const storageRef = ref(storage, `profileImages/${user.uid}/profilePicture.png`);

  try {
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error retrieving profile image:', error.message);
    return null;
  }
};
