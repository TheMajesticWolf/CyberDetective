import './App.css';
import {BrowserRouter as Router, Routes, Route, Outlet, BrowserRouter} from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import HomePage from './components/HomePage';
import PrivateRoutes from './components/PrivateRoutes';

function App() {
	return (

		<Router>

			<Routes>

				<Route path="/" element={<Login />}></Route>
				<Route path="/login" element={<Login />}></Route>
				<Route path="/signup" element={<Signup />}></Route>

				<Route element={<PrivateRoutes />}>
					<Route path="/chat" element={<HomePage />}></Route>
				</Route>


			</Routes>

		</Router>

		
	);
}

export default App;
