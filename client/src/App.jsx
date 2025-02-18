import { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';
import NotFoundPage404 from './pages/NotFoundPage404';
import { setLogout, setMode } from './state/authSlice';
import { ErrorProvider } from './context/ErrorContext';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme';


function App() {
	const dispatch = useDispatch();

	const isAuth = useSelector((state) => state.tokenExpiration) > new Date().toISOString();

	useEffect(() => {
		const modeToSet = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		dispatch(setMode({ mode: modeToSet }));
	}, [dispatch]);

	useEffect(() => {
		if (!isAuth) {
			dispatch(setLogout());
		}
	}, [isAuth, dispatch]);


	const mode = useSelector((state) => state.mode);
	const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

	return (
		<div className='app'>
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<ErrorProvider>
						<Routes>
							<Route path='/login' element={<LoginPage />} />
							<Route path='/' element={isAuth ? <HomePage /> : <Navigate to='/login' />} />
							<Route path='/profile/:userId' element={isAuth ? <ProfilePage /> : <Navigate to='/login' />} />
							<Route path='/editprofile' element={isAuth ? <ProfileEditPage /> : <Navigate to='/login' />} />
							<Route path='/*' element={isAuth ? <NotFoundPage404 /> : <Navigate to='/login' />} />
						</Routes>
					</ErrorProvider>
				</ThemeProvider>
			</BrowserRouter>
		</div>
	)
}

export default App
