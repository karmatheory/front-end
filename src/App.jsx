import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'reactstrap';
import { gapi } from 'gapi-script';
import './assets/css/kt.scss';
import Header from './components/header';
import Login from './pages/login';
import { clientId } from './utils/constants';
import LandingPage from './pages/landingPage';
import { useDispatch, useSelector } from 'react-redux';
import _get from 'lodash/get';
import { load } from 'react-cookies';
import { setSession } from './services/session/action';
import Maps from './components/maps';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
	const { isSignedIn } = useSelector(({ sessionReducer }) => {
		return {
			isSignedIn: _get(sessionReducer, 'session.id_token', false)
		};
	});
	const dispatch = useDispatch();
	useEffect(() => {
		gapi.load('client:auth2', start);
		if (load('session')) {
			dispatch(setSession(load('session')));
		}
	}, []);

	const start = () => {
		gapi.client.init({
			clientId,
			scope: ''
		});
	};

	const renderSection = () => {
		if (isSignedIn) {
			return (
				<React.Fragment>
					<Header />
					<Container>
						<Routes>
							<Route exact path="/" element={<Maps />} />
							<Route path="*" element={<Navigate to={'/'} replace />} />
						</Routes>
					</Container>
				</React.Fragment>
			);
		} else {
			return (
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/" element={<LandingPage />} />
					<Route path="*" element={<Navigate to={'/'} replace />} />
				</Routes>
			);
		}
	};
	return <div className="mt-5">{renderSection()}</div>;
};

export default App;
