import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout, setMode } from './state/authSlice';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme';

import LoginPage from './pages/loginPage/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';


function App() {
  const dispatch = useDispatch();

  const mode = useSelector((state) => state.mode);
  const modeToSet = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  dispatch(setMode({ mode: modeToSet }));

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = useSelector((state) => state.tokenExpiration) > new Date().toISOString();
  if (!isAuth) dispatch(setLogout());


  return (
    <div className='app'>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/' element={isAuth ? <HomePage /> : <Navigate to='/login' />} />
            <Route path='/profile/:userId' element={isAuth ? <ProfilePage /> : <Navigate to='/login' />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
