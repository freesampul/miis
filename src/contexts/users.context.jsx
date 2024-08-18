import { createContext, useState, useEffect } from 'react';
import { createUserDocumentFromAuth, onAuthStateChangedListener, retrieveProfileImage } from '../utils/firebase/firebase.utils';

export const UserContext = createContext({
  currentUser: null,
  setCurrentUser: () => null,
  profileImageUrl: '',
  setProfileImageUrl: () => null,
});

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  
  const value = { currentUser, setCurrentUser, profileImageUrl, setProfileImageUrl };

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async (user) => {
      if (user) {
        try {
          await createUserDocumentFromAuth(user);
          const imageUrl = await retrieveProfileImage(user);
          setProfileImageUrl(imageUrl || '');
        } catch (error) {
          console.error("Error handling user state change:", error);
        }
      }
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
