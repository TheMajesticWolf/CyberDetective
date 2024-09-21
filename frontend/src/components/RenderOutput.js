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

						{(object["return_format"] == "ner_list") && <>


							<div className="response-output">
								<p><b><u>User</u></b></p>
								<p>{object["question"]}</p>
							</div>

							<div className="response-output">
								<div className="ner-table-container response-output">

									<div className="ner-table">

										<table>

											<thead>
												<tr>
													<th>Token</th>
													<th>Tag</th>
												</tr>
											</thead>
											
											<tbody>
												{object["output"].map((ele, innerIdx) => (
													<tr>
														<td>{ele[0]}</td>
														<td>{ele[1]}</td>
													</tr>
												))}
											</tbody>
										</table>


									</div>
								</div>
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