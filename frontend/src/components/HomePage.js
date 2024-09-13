import React from 'react'
import useLogout from '../hooks/useLogout'

const HomePage = () => {

	const logout = useLogout()

	const isAuthenticated = (jsonData) => {

		if (jsonData?.response?.authenticationFailed == true) {
			logout()
		}

	}

	return (
		<div>
			<div style={{fontSize: "52px", color: "white"}}>
				<p>Hello world: {localStorage.getItem("username")}</p>
				<button type="button" onClick={logout}>Logout</button>
			</div>
		</div>
	)
}

export default HomePage