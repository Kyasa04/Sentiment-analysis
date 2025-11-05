import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string } | null;
  login: (email: string, password: string) => Promise<{success: boolean; error?: string}>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const navigate = useNavigate();

  // Check authentication status on mount and ensure test account exists
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userEmail = localStorage.getItem('userEmail');
    
    // Add test account if it doesn't exist
    const storedUsers = localStorage.getItem('registeredUsers');
    const users = storedUsers ? JSON.parse(storedUsers) : {};
    if (!users['test@example.com']) {
      users['test@example.com'] = 'test123';
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      console.log('Test account created: test@example.com / test123');
    }
    
    if (authToken && userEmail) {
      setIsAuthenticated(true);
      setUser({ email: userEmail });
    }
  }, []);

  const login = async (email: string, password: string): Promise<{success: boolean; error?: string}> => {
    // Input validation
    if (!email) {
      return { success: false, error: 'Email is required' };
    }
    if (!password) {
      return { success: false, error: 'Password is required' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    // Check if user exists in localStorage
    const storedUsers = localStorage.getItem('registeredUsers');
    const users = storedUsers ? JSON.parse(storedUsers) : {};
    
    if (!users[email]) {
      return { success: false, error: 'User not found. Please sign up first or use test account (test@example.com / test123)' };
    }
    
    // Check if password matches
    if (users[email] !== password) {
      return { success: false, error: 'Invalid password' };
    }
    
    // Login successful
    const token = `demo-token-${Date.now()}`;
    localStorage.setItem('authToken', token);
    localStorage.setItem('userEmail', email);
    
    setIsAuthenticated(true);
    setUser({ email });
    return { success: true };
  };

  const signup = async (email: string, password: string): Promise<boolean> => {
    // TODO: Replace with actual backend authentication
    // For demo purposes, store user in localStorage
    if (email && password.length >= 6) {
      const storedUsers = localStorage.getItem('registeredUsers');
      const users = storedUsers ? JSON.parse(storedUsers) : {};
      
      // Check if user already exists
      if (users[email]) {
        return false;
      }
      
      // Register new user
      users[email] = password;
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      
      // Auto-login after signup
      const token = `demo-token-${Date.now()}`;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userEmail', email);
      
      setIsAuthenticated(true);
      setUser({ email });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
