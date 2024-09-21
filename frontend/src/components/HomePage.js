import React, { useState } from 'react'
import useLogout from '../hooks/useLogout'
import LeftPanel from './LeftPanel'
import Title from './Title'
import RenderOutput from './RenderOutput'
import axiosInstance from '../api/axios'



const HomePage = () => {

	const [userQuestion, setUserQuestion] = useState("")
	const [analysisType, setAnalysisType] = useState("ner")

	const [responseItems, setResponseItems] = useState([])

	const logout = useLogout()

	const isAuthenticated = (jsonData) => {

		if (jsonData?.response?.authenticationFailed == true) {
			logout()
		}

	}

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
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		if (!userQuestion) {
			alert("Enter valid data")
			return
		}

		sendDataToServer()

	}


	return (
		<div className="overall-container">

			<LeftPanel setResponseItems={setResponseItems}/>

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