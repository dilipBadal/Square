import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./App.css"
import { extendTheme } from '@chakra-ui/react';
import Profile from "./components/userProfile/Profile"
import HomePage from './components/homepage/HomePage';
import FindFriends from './components/findFriends/findFriends';
import { ChakraBaseProvider } from '@chakra-ui/react'
import ResetPassword from './components/reset';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Auth from "./components/login/Auth"
import { useState } from 'react';


const theme = extendTheme({
  colors: {
    light: {
      primary: '#007bff',
      secondary: '#6c757d',
      accent: '#adb5bd',
      text: '#212529',
      background: '#f8f9fa',
      // Other light mode colors
    },
    dark: {
      primary: '#1e293b',
      secondary: '#3d4859',
      accent: '#718096',
      text: '#f7fafc',
      background: '#1a202c',
      // Other dark mode colors
    },
  },
});

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <ChakraBaseProvider theme={theme}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/login" element={<Auth isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}/>}/>
          <Route path="/homepage" element={<HomePage isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}/>
          <Route path="/profile" element={<Profile isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}/>
          <Route path='/findFriends' element={<FindFriends isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}/>
          <Route path='/resetPassword' element={<ResetPassword isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}/>
        </Routes>
      </BrowserRouter>
    </ChakraBaseProvider>
  )
}

export default App

