import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useLogout from '../hooks/useLogout'


const LeftPanel = ({ chatIds, currentChatId, setCurrentChatId, setResponseItems, deleteChat, createNewChat, isChatPage }) => {

	const navigate = useNavigate()
	const logout = useLogout()
	const location = useLocation()


	let handleSettingChat = (idx) => {
		// console.log("Idx = ", idx, setResponseItems(currentChatId))

		setCurrentChatId(prev => idx)
	}



	return (

		<div className="left-panel-container futuristic-border">

			<div className="navigation-menu">

				<div className="navigation-box">
					<button className={`navigation-box-button ${location.pathname === "/rag-based-qa" ? 'active' : ''}`} type="button" onClick={() => navigate("/rag-based-qa")}>Chat </button>
				</div>

				<div className="navigation-box">
					<button className={`navigation-box-button ${location.pathname === "/named-entity-recognition" ? 'active' : ''}`} type="button" onClick={() => navigate("/named-entity-recognition")}>NER </button>
				</div>

				<div className="navigation-box">
					<button className={`navigation-box-button ${location.pathname === "/db-preview" ? 'active' : ''}`} type="button" onClick={() => navigate("/db-preview")}>DB Preview </button>
				</div>



				{(isChatPage == true) && <div className="navigation-box">
					<button className="navigation-box-button" type="button" onClick={(e) => { createNewChat(); handleSettingChat(currentChatId) }}><b>New Chat</b> + </button>
				</div>}

				{(isChatPage == true) && <div className="navigation-box">
					<button className="navigation-box-button" type="button" onClick={deleteChat}><b>Delete Chat</b> - </button>
				</div>}

				<div className="navigation-box">
					<button className="navigation-box-button" type="button" onClick={(e) => setResponseItems([])}><b>Temporary clear</b></button>
				</div>

				<div className="navigation-box">
					<button className="navigation-box-button" type="button" onClick={(e) => { localStorage.clear(); logout() }}><b>{localStorage.getItem("username")}</b> - Logout</button>
				</div>

			</div>

			<hr />



			{isChatPage && <div className="previous-chats-menu">



				{Array.isArray(chatIds) && chatIds.length != 0 && chatIds.map((obj, idx) => (
					<div className="previous-chat-box" key={idx}>
						{obj["_id"] == currentChatId ? <button onClick={(e) => handleSettingChat(obj["_id"])} style={{ "fontSize": "30px", color: "lime", textDecoration: "underline", fontWeight: "bold" }}>{obj["title"]}</button> :
							<button onClick={(e) => handleSettingChat(obj["_id"])} style={{ "fontSize": "30px", color: "grey" }}>{obj["title"]}</button>}
						<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="50" viewBox="0,0,256,256">
							<g fill="#ffffff" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{ mixBlendMode: 'normal' }}>
								<g transform="scale(5.12,5.12)">
									<path d="M43.125,2c-1.24609,0 -2.48828,0.48828 -3.4375,1.4375l-0.8125,0.8125l6.875,6.875c-0.00391,0.00391 0.8125,-0.8125 0.8125,-0.8125c1.90234,-1.90234 1.89844,-4.97656 0,-6.875c-0.95312,-0.94922 -2.19141,-1.4375 -3.4375,-1.4375zM37.34375,6.03125c-0.22656,0.03125 -0.4375,0.14453 -0.59375,0.3125l-32.4375,32.46875c-0.12891,0.11719 -0.22656,0.26953 -0.28125,0.4375l-2,7.5c-0.08984,0.34375 0.01172,0.70703 0.26172,0.95703c0.25,0.25 0.61328,0.35156 0.95703,0.26172l7.5,-2c0.16797,-0.05469 0.32031,-0.15234 0.4375,-0.28125l32.46875,-32.4375c0.39844,-0.38672 0.40234,-1.02344 0.01563,-1.42187c-0.38672,-0.39844 -1.02344,-0.40234 -1.42187,-0.01562l-32.28125,32.28125l-4.0625,-4.0625l32.28125,-32.28125c0.30078,-0.28906 0.39063,-0.73828 0.22266,-1.12109c-0.16797,-0.38281 -0.55469,-0.62109 -0.97266,-0.59766c-0.03125,0 -0.0625,0 -0.09375,0z"></path>
								</g>
							</g>
						</svg>
					</div>


				))}


			</div>}

		</div>
	)
}

export default LeftPanel