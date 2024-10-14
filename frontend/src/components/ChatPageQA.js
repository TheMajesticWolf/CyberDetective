import React, { useState, useEffect, useRef } from 'react'
import useLogout from '../hooks/useLogout'
import LeftPanel from './LeftPanel'
import Title from './Title'
import RenderOutput from './RenderOutput'
import axiosInstance from '../api/axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useChat from '../hooks/useChat'


const ChatPageQA = () => {

	const chatType = "question-answer"

	const [userQuestion, setUserQuestion] = useState("")
	
	
	const [neighbors, setNeighbors] = useState(3)
	const [responseItems, setResponseItems] = useState([])

	const { chatIds, setChatIds, currentChatId, setCurrentChatId, createNewChat, deleteChat, isAuthenticated, fetchChatIds } = useChat(chatType);

	const dummy = useRef(null)
	const scrollToBottom = () => {
		dummy.current?.scrollIntoView({ behavior: "smooth" });
	}

	const [isInputDisabled, setIsInputDisabled] = useState(false)

	const validNeighbors = [1, 3, 5]


	
	useEffect(() => {

		let fetchDataFromServer = async () => {


			let jsonData = await fetchChatIds();

			
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
				// console.log(newCurrentChatIdx, currentChatId)
				// setCurrentChatId(newCurrentChatIdx)

				// console.log(newCurrentChatIdx, currentChatId)

				let response = await axiosInstance.get(`/api/db/fetch-chat/${currentChatId}`, {})

				let jsonData = response.data

				isAuthenticated(jsonData)
				// console.log("HERE")
				setResponseItems(jsonData?.response?.conversations)
				console.log(jsonData?.response?.conversations)

			}
		}

		fetchDataFromServer()

	}, [chatIds, currentChatId])

	useEffect(() => {
		scrollToBottom();
	}, [responseItems])

	const sendDataToServer = async () => {

		if(/help/.test(userQuestion)) {
			
			let helpObject = {
				return_format: "help_text",
				userQuestion: "help",
				output: "dummy"
			}
			setResponseItems(prev => [...prev, helpObject])
			return
		}


		let data = {
			userQuestion: userQuestion,
			neighbors: neighbors
		}

		let url = "/api/fetch/rag-based-qa"
		

		let response = await axiosInstance.post(url, data, {
			headers: {
				"Content-Type": "application/json"
			}
		})

		let jsonData = response.data

		isAuthenticated(jsonData)

		setResponseItems(prev => [...prev, jsonData?.response])
		
		setIsInputDisabled(true)

		response = await axiosInstance.post(`/api/db/update-chat/${currentChatId}`, {
				"newConversationObj": jsonData["response"]
			},
			{}
		)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (!userQuestion) {
			// alert("Enter valid data")
			toast("Please enter valid data", {
				type: "error",
				type: "warning",
				hideProgressBar: true,
				autoClose: 2000
			})
			return
		}
		
		setUserQuestion("")
		setIsInputDisabled(true)
		await sendDataToServer()
		setIsInputDisabled(false)

	}




	return (
		<div className="overall-container">

			<LeftPanel setResponseItems={setResponseItems} createNewChat={createNewChat} currentChatId={currentChatId} chatIds={chatIds} setCurrentChatId={setCurrentChatId}  isChatPage={true} deleteChat={deleteChat}/>

			<div className="center-panel-container">
				<Title subtitle={"Test subtitle"} />

				<div className="response-box futuristic-border">

					<RenderOutput frontendList={responseItems} />

					<div ref={dummy} className="loading-box" style={{ display: (isInputDisabled == true ? "block" : "none") }}>
						<p>Loading...</p>
					</div>
					<div ref={dummy}></div>


				</div>

				<div className="input-box futuristic-border">

					<form onSubmit={handleSubmit}>

						<div className="input-box-row">
							<input type="text" name="" id="" placeholder="Enter your text" disabled={isInputDisabled} value={userQuestion} onChange={(e) => setUserQuestion(e.target.value)} />
							{/* <textarea name="" id="" placeholder="Enter your text" value={userQuestion} onChange={(e) => setUserQuestion(e.target.value)} /> */}

							<select name="" id="" value={neighbors} onChange={(e) => setNeighbors(e.target.value)}>
								{
									validNeighbors.map((neighbor, idx) => (
										<option value={`${neighbor}`}>Nearest {neighbor} neighbor(s)</option>

									))
								}
								
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

export default ChatPageQA