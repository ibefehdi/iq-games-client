import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from './utils/ThemeContext';

import './App.css'
import LoginPage from './pages/LoginPage';
import GamesPage from './pages/Games';
import UserProfile from './pages/UserProfile';
import Navbar from './components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    const storedUsername = sessionStorage.getItem('username');
    if (token && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <ThemeProvider>
      <Router>
        {isAuthenticated && <Navbar username={username} />}
        <Routes>
          <Route
            path="/login"
            element={
              <LoginPage
                setIsAuthenticated={setIsAuthenticated}
                setUsername={setUsername}
              />
            }
          />          <Route path="/games" element={
            <ProtectedRoute>
              <GamesPage />
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
  )
}

export default App