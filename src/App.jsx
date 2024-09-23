import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './utils/ThemeContext';

import './App.css'
import LoginPage from './pages/LoginPage';

function App() {


  return (
    <ThemeProvider>

      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* Add other routes here */}
        </Routes>
      </Router>
    </ThemeProvider>

  )
}

export default App
