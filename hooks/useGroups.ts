import { useState, useEffect } from 'react';
import { collection, doc, addDoc, updateDoc, getDoc, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAppContext } from '@/contexts/AppContext';

export interface Group {
  id: string;
  name: string;
  description?: string;
  inviteCode: string;
  members: string[]; // uids
  createdBy: string;
  createdAt: Date;
}

export const useGroups = () => {
  const { user, setUser, currentGroup: contextCurrentGroup, setCurrentGroup } = useAppContext();
  const [currentGroup, setCurrentGroupState] = useState<Group | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate a random 6-character invite code
  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Create a new group
  const createGroup = async (name: string, description?: string) => {
    if (!user) return;
    setError(null);
    setLoading(true);
    try {
      const inviteCode = generateInviteCode();
      const groupData = {
        name,
        description: description || '',
        inviteCode,
        members: [user.uid],
        createdBy: user.uid,
        createdAt: new Date(),
      };
      const docRef = await addDoc(collection(db, 'groups'), groupData);
      const newGroup = { id: docRef.id, ...groupData };
      setCurrentGroup(newGroup.id);
      // Update user doc with currentGroup
      await updateDoc(doc(db, 'users', user.uid), { currentGroup: newGroup.id });
      // Update local user state
      setUser({ ...user, currentGroup: newGroup.id });
      setLoading(false);
      return newGroup;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Join a group via invite code
  const joinGroup = async (inviteCode: string) => {
    if (!user) return;
    setError(null);
    setLoading(true);
    try {
      const q = query(collection(db, 'groups'), where('inviteCode', '==', inviteCode));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error('Invalid invite code');
      }
      const groupDoc = querySnapshot.docs[0];
      const groupData = groupDoc.data() as Omit<Group, 'id'>;
      const group = { id: groupDoc.id, ...groupData };
      if (group.members.includes(user.uid)) {
        throw new Error('Already a member of this group');
      }
      // Add user to members
      await updateDoc(doc(db, 'groups', group.id), {
        members: [...group.members, user.uid],
      });
      setCurrentGroup(group.id);
      // Update user doc
      await updateDoc(doc(db, 'users', user.uid), { currentGroup: group.id });
      // Update local user state
      setUser({ ...user, currentGroup: group.id });
      setLoading(false);
      return group;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Leave current group
  const leaveGroup = async () => {
    if (!user || !currentGroup) return;
    setError(null);
    setLoading(true);
    try {
      const groupRef = doc(db, 'groups', currentGroup.id);
      const updatedMembers = currentGroup.members.filter(uid => uid !== user.uid);
      await updateDoc(groupRef, { members: updatedMembers });
      setCurrentGroup(null);
      // Update user doc
      await updateDoc(doc(db, 'users', user.uid), { currentGroup: null });
      // Update local user state
      setUser({ ...user, currentGroup: undefined });
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Sync with context currentGroup
  useEffect(() => {
    setCurrentGroup(contextCurrentGroup);
  }, [contextCurrentGroup]);

  // Fetch current group if user has one
  useEffect(() => {
    if (user?.currentGroup) {
      const unsubscribe = onSnapshot(doc(db, 'groups', user.currentGroup), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as Omit<Group, 'id'>;
          setCurrentGroupState({ id: docSnap.id, ...data });
        } else {
          setCurrentGroupState(null);
        }
      });
      return unsubscribe;
    } else {
      setCurrentGroupState(null);
    }
  }, [user?.currentGroup]);

  return {
    currentGroup,
    loading,
    error,
    createGroup,
    joinGroup,
    leaveGroup,
  };
};