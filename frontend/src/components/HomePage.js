import React, { useState, useEffect } from 'react'
import useLogout from '../hooks/useLogout'
import LeftPanel from './LeftPanel'
import Title from './Title'
import RenderOutput from './RenderOutput'
import axiosInstance from '../api/axios'



const HomePage = () => {

	const [userQuestion, setUserQuestion] = useState("")
	const [analysisType, setAnalysisType] = useState("ner")

	const [responseItems, setResponseItems] = useState([])

	const [currentChatIndex, setCurrentChatId] = useState("")
	const [chatIds, setChatIds] = useState([])

	const logout = useLogout()

	const isAuthenticated = (jsonData) => {

		if (jsonData?.response?.authenticationFailed == true) {
			logout()
		}

	}

	
	useEffect(() => {

		let fetchDataFromServer = async () => {


			let response = await axiosInstance.get("/api/db/fetch-chat-ids", {})



			let jsonData = response?.data
			console.log(jsonData)
			isAuthenticated(jsonData)



			// console.log(jsonData["response"])
			// If a user logs in for the first time, automatically create a "Default" chat
			if (jsonData["response"].length == 0) {
				await createNewChat();
				return
			}

			setChatIds(jsonData?.response)
			setCurrentChatId(jsonData?.response[jsonData?.response.length - 1]?._id)
		}

		fetchDataFromServer()

	}, [])

	useEffect(() => {

		let fetchDataFromServer = async () => {
			if (chatIds[0]) {
				// console.log(chatIds)

				// let newCurrentChatIdx = chatIds[chatIds.length - 1]["_id"]
				// console.log(newCurrentChatIdx, currentChatIndex)
				// setCurrentChatId(newCurrentChatIdx)

				// console.log(newCurrentChatIdx, currentChatIndex)

				let response = await axiosInstance.get(`/api/db/fetch-chat/${currentChatIndex}`, {
					// headers: {
					// 	"Authorization": `Bearer ${localStorage.getItem("accessToken")}`
					// }
				})

				let jsonData = response.data

				isAuthenticated(jsonData)
				// console.log("HERE")
				setResponseItems(jsonData?.response?.conversations)
				console.log(jsonData?.response?.conversations)

			}
		}

		fetchDataFromServer()

	}, [chatIds, currentChatIndex])


	const sendDataToServer = async () => {
		let data = {
			userQuestion: userQuestion,
			analysisType: analysisType
		}

		let url = ""

		if(analysisType === "ner") {
			url = "/api/fetch/perform-ner"
		}
		else {
			return
		}

		let response = await axiosInstance.post(url, data, {
			headers: {
				"Content-Type": "application/json"
			}
		})

		let jsonData = response.data

		isAuthenticated(jsonData)

		setResponseItems(prev => [...prev, jsonData?.response])

		response = await axiosInstance.post(`/api/db/update-chat/${currentChatIndex}`, {
				"newConversationObj": jsonData["response"]
			},
			{}
		)
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		if (!userQuestion) {
			alert("Enter valid data")
			return
		}

		sendDataToServer()

	}

	const createNewChat = async () => {
		let data = {
			userQuestion: userQuestion,
			analysisType: analysisType
		}


		let response = await axiosInstance.post("/api/db/create-new-chat", data, {
			headers: {
				"Content-Type": "application/json"
			}
		})

		let jsonData = response.data

		isAuthenticated(jsonData)
		
		setChatIds(prev => [...prev, { _id: jsonData["response"]["_id"], title: jsonData["response"]["title"] }])

		setCurrentChatId(jsonData["response"]["_id"])

	}

	let deleteChat = async () => {

		if (chatIds.length == 1) {
			alert("You need to have atleast one chat")
			return
		}

		let response = await axiosInstance.delete(`/api/db/delete-chat/${currentChatIndex}`, {
			// headers: {
			// 	"Authorization": `Bearer ${localStorage.getItem("accessToken")}`
			// }
		})

		let jsonData = await response.data

		isAuthenticated(jsonData)


		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		response = await axiosInstance.get(`/api/db/fetch-chat-ids`, {
			// headers: {
			// 	"Authorization": `Bearer ${localStorage.getItem("accessToken")}`
			// }
		})
		jsonData = response.data
		isAuthenticated(jsonData)

		setChatIds(jsonData?.response)
		setCurrentChatId(jsonData?.response[jsonData?.response?.length - 1]?._id)





	}


	return (
		<div className="overall-container">

			<LeftPanel setResponseItems={setResponseItems} createNewChat={createNewChat} currentChatIndex={currentChatIndex} chatIds={chatIds} setCurrentChatId={setCurrentChatId}  isChatPage={true} deleteChat={deleteChat}/>

			<div className="center-panel-container">
				<Title subtitle={"Test subtitle"} />

				<div className="response-box">

					<RenderOutput frontendList={responseItems} />


				</div>

				<div className="input-box">

					<form onSubmit={handleSubmit}>

						<div className="input-box-row">
							<input type="text" name="" id="" placeholder="Enter your text" value={userQuestion} onChange={(e) => setUserQuestion(e.target.value)} />

							<select name="" id="" value={analysisType} onChange={(e) => setAnalysisType(e.target.value)}>
								<option value="ner">Named Entity Recognition</option>
								<option value="rag_qa">RAG Based QA</option>
							</select>

						</div>

						{/*
							<div className="input-box-row">
								<select name="" id="">
									<option value="">Named Entity Recognition</option>
									<option value="">RAG Based QA</option>
								</select>
							</div>


							<div className="input-box-row">
								<input type="text" name="" id="" placeholder="Enter your text" />
							</div>
						*/}

					</form>
				</div>

			</div>



		</div>
	)
}

export default HomePage