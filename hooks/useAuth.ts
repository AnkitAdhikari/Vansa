import { useState, useEffect } from 'react';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/firebaseConfig';
import { useAppContext, User } from '@/contexts/AppContext';

export const useAuth = () => {
  const { user, setUser, setCurrentGroup } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const appUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
          avatar: firebaseUser.photoURL || '',
        };
        // Ensure user document exists in Firestore
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || '',
          avatar: firebaseUser.photoURL || '',
        }, { merge: true });
        // Fetch currentGroup from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        let currentGroupId = null;
        if (userDoc.exists()) {
          const data = userDoc.data();
          currentGroupId = data.currentGroup || null;
          setCurrentGroup(currentGroupId);
        }
        // Update appUser with currentGroup
        appUser.currentGroup = currentGroupId;
        setUser(appUser);
      } else {
        setUser(null);
        setCurrentGroup(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [setUser, setCurrentGroup]);

  const signUp = async (email: string, password: string) => {
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      setCurrentGroup(null);
      await signOut(auth);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    login,
    logout,
  };
};