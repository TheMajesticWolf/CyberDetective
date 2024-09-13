import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './style.css'
import { axiosLoginInstance } from '../api/axios'
import { AuthContext } from '../context/AuthProvider';


const Signup = () => {

	const navigate = useNavigate()

	const { authContext, setAuthContext } = useContext(AuthContext)



	let sendDataToServer = async () => {

		try {
			let response = await axiosLoginInstance.post("/api/auth/signup",
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
				localStorage.setItem("isloggedin", true)
				localStorage.setItem("username", formData["username"])
				navigate("/chat")
			}

		}

		catch (error) {
			alert(error?.response?.data?.message)
		}


	}

	const [formData, setFormData] = useState({
		username: "",
		password: "",
		email: "",
	})

	let clearForm = () => {

		setFormData({
			username: "",
			password: "",
			email: ""
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
					<input id="username" placeholder="Enter your username" type="text" name="username" onChange={handleInputChange} value={formData["username"]} />
				</div>

				<div className="auth-box">
					<label htmlFor="password">Password</label>
					<input id="password" placeholder="Enter your password" type="password" name="password" onChange={handleInputChange} value={formData["password"]} />
				</div>

				<div className="auth-box">
					<label htmlFor="email">Email</label>
					<input id="email" placeholder="Enter your email" type="email" name="email" onChange={handleInputChange} value={formData["email"]} />
				</div>


				<div className="auth-box">
					<button type="submit">Signup</button>
				</div>


				<div className="link-box auth-box">
					<Link to="/login">Already registered? Login</Link>
				</div>


			</form>
		</div>
	)
}

export default Signup