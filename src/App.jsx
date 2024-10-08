import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from './utils/ThemeContext';

import './App.css'
import LoginPage from './pages/LoginPage';
import GamesPage from './pages/Games';
import UserProfile from './pages/UserProfile';
import Navbar from './components/Navbar';
import axios from 'axios';
import Trivia from './pages/Trivia';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = sessionStorage.getItem('accessToken');
      if (token) {
        try {
          // Verify token with the server
          const response = await axios.get('http://localhost:7001/api/v1/users/verify', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.valid) {
            setIsAuthenticated(true);
            setUsername(sessionStorage.getItem('username'));
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('username');
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return (
      <>
        <Navbar username={username} />
        {children}
      </>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={
            <LoginPage
              setIsAuthenticated={setIsAuthenticated}
              setUsername={setUsername}
            />
          } />
          <Route path="/games" element={
            <ProtectedRoute>
              <GamesPage />
            </ProtectedRoute>
          } />
           <Route path="/games/trivia" element={
            <ProtectedRoute>
              <Trivia />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/games" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
