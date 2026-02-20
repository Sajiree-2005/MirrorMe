import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  anonymousName: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const anonymousNames = [
  'CalmOcean', 'GentleBreeze', 'SoftMountain', 'TranquilRiver', 'QuietMeadow',
  'PeacefulSky', 'SereneMoon', 'StillWater', 'WarmSunrise', 'DawnHorizon',
  'CrystalDew', 'MildWillow', 'SoftEcho', 'WhisperPine', 'TenderCloud',
];

const generateAnonymousName = () => {
  return anonymousNames[Math.floor(Math.random() * anonymousNames.length)] + Math.floor(Math.random() * 999);
};

const generateAvatar = (name: string) => {
  const colors = ['4f46e5', '7c3aed', '2563eb', '0891b2', '059669'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return `https://ui-avatars.com/api/?name=${name}&background=${color}&color=fff&rounded=true&size=128`;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('mirrorme_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, _password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const name = generateAnonymousName();
    const u = { id: Date.now().toString(), anonymousName: name, email, avatar: generateAvatar(name) };
    setUser(u);
    localStorage.setItem('mirrorme_user', JSON.stringify(u));
    setIsLoading(false);
  };

  const register = async (email: string, _password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    const name = generateAnonymousName();
    const u = { id: Date.now().toString(), anonymousName: name, email, avatar: generateAvatar(name) };
    setUser(u);
    localStorage.setItem('mirrorme_user', JSON.stringify(u));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mirrorme_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
