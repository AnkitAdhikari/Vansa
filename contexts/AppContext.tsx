import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  uid: string;
  email: string;
  name?: string;
  avatar?: string;
  currentGroup?: string; // groupId
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  currentGroup: string | null;
  setCurrentGroup: (groupId: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentGroup, setCurrentGroup] = useState<string | null>(null);

  return (
    <AppContext.Provider value={{ user, setUser, currentGroup, setCurrentGroup }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};