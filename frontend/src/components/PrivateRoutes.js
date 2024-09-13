import React, { useContext, useLayoutEffect } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthProvider';
import axiosInstance from '../api/axios';


const PrivateRoutes = () => {

	const {authContext, setAuthContext} = useContext(AuthContext)

	let auth = true;

	useLayoutEffect(() => {


		let fetchDataFromServer = async () => {
			let response = await axiosInstance.post("/api/auth/check-auth", {}, {})
			let jsonData = response.data

			if(jsonData["success"] == false && jsonData?.response?.authenticationFailed == true) {
				// isAuthValid = false;
				setAuthContext({isloggedin: false})
				// window.location.href = "/"
			}
			
			
		}
		
		fetchDataFromServer();
	}, [])

	return (

		(authContext?.isloggedin == true) ? <Outlet /> : <Navigate to={"/"} />

	)
}

export default PrivateRoutes