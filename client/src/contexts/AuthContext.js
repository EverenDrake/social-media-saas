import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [session, setSession] = useState(null);

  // Check if user is logged in on app load
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setSubscription(data.subscription);
      } else {
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Login error:', data.message);
        toast.error(data.message || 'Login failed');
        return { success: false, message: data.message };
      }

      localStorage.setItem('authToken', data.token);
      setUser(data.user);
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
      return { success: false, message: error.message };
    }
  };

const signUp = async (email, password, username) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Registration error:', data.message);
        toast.error(data.message || 'Registration failed');
        return { success: false, message: data.message };
      }
      
      // Store the token and user data
      localStorage.setItem('authToken', data.token);
      setUser(data.user);
      toast.success('Registration successful!');
      
      // Load user subscription data
      await loadUser();
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed');
      return { success: false, message: error.message };
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('authToken');
      setUser(null);
      setSubscription(null);
      setSession(null);
      toast.success('Successfully signed out!');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Sign out failed');
    }
  };




  const updateSubscription = (newSubscription) => {
    setSubscription(newSubscription);
  };

  const value = {
    user,
    loading,
    subscription,
    session,
    signIn,
    signUp,
    signOut,
    updateSubscription,
    loadUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
