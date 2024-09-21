import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './style.css'
import { axiosLoginInstance } from '../api/axios'
import { AuthContext } from '../context/AuthProvider'



const Login = () => {

	const navigate = useNavigate()

	const {authContext, setAuthContext} = useContext(AuthContext)


	let sendDataToServer = async () => {
		try {
			let response = await axiosLoginInstance.post("/api/auth/login",
				formData,
				{
					headers: {
						"Content-Type": "application/json"
					}
				}
			)

			let jsonData = response.data

			if (jsonData?.success) {
				setAuthContext({
					isloggedin: true
				})
				navigate("/chat")
				
				localStorage.setItem("isloggedin", JSON.stringify(true));
				localStorage.setItem("username", formData["username"]);
			}

		}

		catch (error) {
			console.log(error)
			localStorage.clear()
			alert(error?.response?.data?.message)
		}
	}

	const [formData, setFormData] = useState({
		username: "",
		password: ""
	})

	let clearForm = () => {

		setFormData({
			username: "",
			password: ""
		})

	}

	let handleInputChange = (e) => {

		const { name, value } = e.target

		setFormData((prev) => ({
			...prev,
			[name]: value
		}))
	}



	let handleSubmit = (e) => {
		e.preventDefault()

		console.log(formData)

		clearForm()

		sendDataToServer()
	}


	return (
		<div className="login-container">

			<form onSubmit={handleSubmit} className="my-form">

				<div className="auth-box">
					<label htmlFor="username">Username</label>
					<input id="username" placeholder="Enter your username" type="text" onChange={handleInputChange} name="username" value={formData["username"]} />
				</div>

				<div className="auth-box">
					<label htmlFor="password">Password</label>
					<input id="password" placeholder="Enter your password" type="password" onChange={handleInputChange} name="password" value={formData["password"]} />
				</div>


				<div className="auth-box">
					<button type="submit">Login</button>
				</div>


				<div className="link-box auth-box">
					<Link to="/signup">New user? Signup</Link>
				</div>


			</form>
		</div>
	)
}

export default Login