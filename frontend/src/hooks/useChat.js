import { useState } from 'react';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import useLogout from './useLogout';

const useChat = (chatType) => {

	const [chatIds, setChatIds] = useState([])
	const [currentChatId, setCurrentChatId] = useState("")

	const logout = useLogout()


	const isAuthenticated = (jsonData) => {

		if (jsonData?.response?.authenticationFailed == true) {
			logout()
		}

	}

	const createNewChat = async () => {
		const data = {
			chatType: chatType,
			title: prompt("Enter a title: ")
		}

		try {
			const response = await axiosInstance.post("/api/db/create-new-chat", data, {
				headers: {
					"Content-Type": "application/json",
				},
				
				params: {
					chatType: chatType
				}
			})

			const jsonData = response.data
			isAuthenticated(jsonData)

			setChatIds((prev) => [...prev, { _id: jsonData.response._id, title: jsonData.response.title }])
			setCurrentChatId(jsonData.response._id)
		}
		
		catch (error) {
			console.error("Error creating new chat", error)
		}
	}

	const deleteChat = async () => {
		
		if (chatIds.length === 1) {
			toast("You need to have at least one chat", {
				type: "error",
				autoClose: 2000,
				hideProgressBar: true,
			})
			return
		}

		try {
			await axiosInstance.delete(`/api/db/delete-chat/${currentChatId}`)

			const response = await axiosInstance.get(`/api/db/fetch-chat-ids`, {params: {chatType: chatType}})
			const jsonData = response.data
			isAuthenticated(jsonData)

			setChatIds(jsonData.response)
			setCurrentChatId(jsonData.response[jsonData.response.length - 1]?._id)
		}
		
		catch (error) {
			console.error("Error deleting chat", error)
		}
	}

	const fetchChatIds = async () => {
		let response = await axiosInstance.get("/api/db/fetch-chat-ids", {
			params: {
				chatType: chatType
			}
		})

		let jsonData = response?.data
		console.log(jsonData)
		isAuthenticated(jsonData)

		return jsonData

	}

	return {
		chatIds,
		setChatIds,
		currentChatId,
		setCurrentChatId,
		createNewChat,
		deleteChat,
		isAuthenticated,
		fetchChatIds
	}
}

export default useChat
