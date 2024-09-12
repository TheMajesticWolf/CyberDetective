import './App.css';
import {BrowserRouter as Router, Routes, Route, Outlet, BrowserRouter} from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
	return (

		<Router>

			<Routes>

				<Route path="/login" element={<Login />}></Route>
				<Route path="/signup" element={<Signup />}></Route>

			</Routes>

		</Router>

		
	);
}

export default App;
