import { User, onAuthStateChanged, signOut } from "firebase/auth";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "../utils/firebase";

interface AuthContextType {
  currentUser: User | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    currentUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
