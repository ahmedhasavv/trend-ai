import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { User, AuthContextType } from './types';
import * as authService from './services/authService';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import GalleryPage from './pages/GalleryPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './contexts/AuthContext';


const AppLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const loggedInUser = await authService.login(email, pass);
    setUser(loggedInUser);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const signUp = async (email: string, pass: string) => {
    const newUser = await authService.signUp(email, pass);
    setUser(newUser);
  };
  
  const authContextValue: AuthContextType = { user, loading, login, logout, signUp };

  if (loading) {
      return (
          <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
              Loading Application...
          </div>
      );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="editor" element={<EditorPage />} />
            <Route path="editor/:trendId" element={<EditorPage />} />
            <Route path="gallery" element={
              <ProtectedRoute>
                <GalleryPage />
              </ProtectedRoute>
            } />
             <Route path="profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;