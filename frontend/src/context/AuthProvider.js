import React, { createContext, useState, useEffect, useLayoutEffect } from 'react'
import axiosInstance from '../api/axios'


export const AuthContext = createContext({})

const AuthProvider = ({ children }) => {

	const [authContext, setAuthContext] = useState({
		isloggedin: JSON.parse(localStorage.getItem("isloggedin")) || false
	})

	useEffect(() => {
        localStorage.setItem('isloggedin', JSON.stringify(authContext.isloggedin));
    }, [authContext]);

	
	useLayoutEffect(() => {


		let fetchDataFromServer = async () => {
			let response = await axiosInstance.post("/api/auth/check-auth", {}, {})
			let jsonData = response.data

			if(jsonData["success"] == false && jsonData?.response?.authenticationFailed == true) {
				// isAuthValid = false;
				setAuthContext({isloggedin: false})
				// window.location.href = "/"
			}
			
			
			setAuthContext({isloggedin: true})
		}
		
		fetchDataFromServer();
	}, [])


	return (
		<AuthContext.Provider value={{authContext, setAuthContext}}> 
			{children}
		</AuthContext.Provider>
	)

}

export default AuthProvider