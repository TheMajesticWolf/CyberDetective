import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './style.css'


const Login = () => {

	let sendDataToServer = async () => {

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
		
		const {name, value} = e.target
		
		setFormData((prev) => ({
			...prev,
			[name]: value
		}))
	}

	
		
	let handleSubmit = (e) => {
		e.preventDefault()

		console.log(formData)

		clearForm()
	}


	return (
		<div className="login-container">

			<form onSubmit={handleSubmit} className="my-form">

				<div className="auth-box">
					<label htmlFor="username">Username</label>
					<input id="username" placeholder="Enter your username" type="text" onChange={handleInputChange} name="username" value={formData["username"]}/>
				</div>

				<div className="auth-box">
					<label htmlFor="password">Password</label>
					<input id="password" placeholder="Enter your password" type="password" onChange={handleInputChange} name="password" value={formData["password"]}/>
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