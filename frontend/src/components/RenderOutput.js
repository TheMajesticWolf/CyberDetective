import React from 'react'
import { Link } from 'react-router-dom'


const RenderOutput = ({ frontendList }) => {

	return (

		<>

			{
				frontendList && frontendList.map((object, idx) => (

					<div className="response-item" key={idx}>

						{(object["return_format"] == "string") && <>


							<div className="response-output">
								<p><b><u>User</u></b></p>
								<p>{object["question"]}</p>
							</div>
							<div className="response-output">
								<p><b><u>CricketLLM</u></b></p>
								<p>{object["output"]}</p>

							</div>

						</>
						}

					</div>




				))
			}


		</>

	)







}

export default RenderOutput