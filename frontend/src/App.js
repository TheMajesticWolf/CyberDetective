import './App.css';
import {BrowserRouter as Router, Routes, Route, Outlet, BrowserRouter} from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import NERPage from './components/NERPage';
import PrivateRoutes from './components/PrivateRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatPageQA from './components/ChatPageQA';

function App() {
	return (

		<Router>

			<Routes>

				<Route path="/" element={<Login />}></Route>
				<Route path="/login" element={<Login />}></Route>
				<Route path="/signup" element={<Signup />}></Route>

				<Route element={<PrivateRoutes />}>
					<Route path="/named-entity-recognition" element={<NERPage />}></Route>
					<Route path="/rag-based-qa" element={<ChatPageQA />}></Route>
				</Route>


			</Routes>
		<ToastContainer theme="dark" position="top-center"/>
		</Router>

		
	);
}

export default App;
