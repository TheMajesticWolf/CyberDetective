import React, { useState, useEffect, useRef } from 'react'
import useLogout from '../hooks/useLogout'
import LeftPanel from './LeftPanel'
import Title from './Title'
import RenderOutput from './RenderOutput'
import axiosInstance from '../api/axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useChat from '../hooks/useChat'


const DBPreview = () => {

	const chatType = "named-entity-recognition"

	const [count, setCount] = useState(10)

	const [analysisType, setAnalysisType] = useState("ner-rfc")
	const [responseItems, setResponseItems] = useState([])

	const { chatIds, setChatIds, currentChatId, setCurrentChatId, createNewChat, deleteChat, isAuthenticated, fetchChatIds } = useChat(chatType);

	const dummy = useRef(null)
	const scrollToBottom = () => {
		dummy.current?.scrollIntoView({ behavior: "smooth" });
	}

	const [isInputDisabled, setIsInputDisabled] = useState(false)



	useEffect(() => {
		scrollToBottom();
	}, [responseItems])

	useEffect(() => {
		sendDataToServer()
	}, [])

	const sendDataToServer = async () => {

		let url = `/api/fetch/db-preview/${count}`

		let response = await axiosInstance.get(url, {
			headers: {
				"Content-Type": "application/json"
			}
		})

		let jsonData = response.data

		isAuthenticated(jsonData)

		setResponseItems(prev => [...prev, jsonData?.response])



	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (!count) {
			// alert("Enter valid data")
			toast("Please enter valid data", {
				type: "error",
				type: "warning",
				hideProgressBar: true,
				autoClose: 2000
			})
			return
		}

		setCount("")
		setIsInputDisabled(true)
		await sendDataToServer()
		setIsInputDisabled(false)

	}



	return (
		<div className="overall-container">

			<LeftPanel setResponseItems={setResponseItems} createNewChat={createNewChat} currentChatId={currentChatId} chatIds={chatIds} setCurrentChatId={setCurrentChatId} isChatPage={true} deleteChat={deleteChat} />

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
							<input type="number" min={1} max={50} placeholder="Enter number of rows" disabled={isInputDisabled} value={count} onChange={(e) => setCount(e.target.value)} />
							{/* <textarea name="" id="" placeholder="Enter your text" value={count} onChange={(e) => setCount(e.target.value)} /> */}

							{/* <select name="" id="" value={analysisType} onChange={(e) => setAnalysisType(e.target.value)}>
								<option value="ner-freq">NER - Frequency Based</option>
								<option value="ner-rfc">NER - Random Forest</option>
								<option value="ner-rfc-scrape">NER - Web Scrape</option>
							</select> */}

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

export default DBPreview