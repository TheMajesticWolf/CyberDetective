import { useContext } from 'react'
import axiosInstance from '../api/axios'
import { useNavigate } from 'react-router'
import { AuthContext } from '../context/AuthProvider'


const useLogout = () => {

	const navigate = useNavigate()
	const { authContext, setAuthContext } = useContext(AuthContext)
	const handleLogout = async () => {

		let response = await axiosInstance.post("/api/auth/logout", {

		})

		let jsonData = response.data

		if (jsonData.success) {
			localStorage.clear()
			setAuthContext({ isloggedin: false })
			navigate("/", { replace: true })
			alert("Logged out successfully")
		}

	}


	return (
		handleLogout
	)
}

export default useLogout