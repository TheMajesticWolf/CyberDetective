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

						{(object["return_format"] == "help_text") && <>


							<div className="response-output">
								<p><b><u>User</u></b></p>
								<p>Help</p>
							</div>

							<div className="response-output">

								<ul style={{ listStylePosition: "inside", textAlign: "justify" }}>
									<li>This project is designed to assist cybersecurity experts in investigating and attributing cyber-attacks.</li>
									<li>Cyber-attack attribution helps identify the attacker and allows experts to implement effective countermeasures.</li>
									<li>Legal actions and attacker-oriented countermeasures can be pursued based on the investigation results provided by this tool.</li>
									<li>The web-based application integrates a Question-Answering (QA) model that aids in providing information about cyber-attacks.</li>
									<li>The QA model uses Retrieval Augmented Generation (RAG) techniques along with a Large Language Model (LLM).</li>
									<li>Users can query either a curated knowledge base (KB) containing information about cyber-attack or use custom docs.</li>
									<li>The frontend of the tool offers Named Entity Recognition (NER) features along with RAG based QA.</li>
								</ul>

								<hr />

								<p style={{textAlign: "center"}}>Here are the available entities</p>


								<div className="ner-table-container response-output">

									<div className="ner-table">

										<table>
											<thead>
												<tr>
													<th>Tag</th>
													<th>Description</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>NIL</td>
													<td>No information</td>
												</tr>
												<tr>
													<td>O</td>
													<td>Outside entity</td>
												</tr>
												<tr>
													<td>ATTACK_PATTERN</td>
													<td>Methods of attack</td>
												</tr>
												<tr>
													<td>ATTACK_MOTIVATION</td>
													<td>Reason for attack</td>
												</tr>
												<tr>
													<td>MALWARE</td>
													<td>Malicious software</td>
												</tr>
												<tr>
													<td>OBSERVED_DATA</td>
													<td>Detected info</td>
												</tr>
												<tr>
													<td>MALWARE_ANALYSIS</td>
													<td>Malware investigation</td>
												</tr>
												<tr>
													<td>COURSE_OF_ACTION</td>
													<td>Response strategy</td>
												</tr>
												<tr>
													<td>VULNERABILITY</td>
													<td>Weakness in system</td>
												</tr>
												<tr>
													<td>IMPACT</td>
													<td>Damage caused</td>
												</tr>
												<tr>
													<td>VICTIM_IDENTITY</td>
													<td>Target details</td>
												</tr>
												<tr>
													<td>GENERAL_IDENTITY</td>
													<td>Generic entity</td>
												</tr>
												<tr>
													<td>THREAT_ACTOR</td>
													<td>Attacker entity</td>
												</tr>
												<tr>
													<td>GENERAL_TOOL</td>
													<td>Common tools</td>
												</tr>
												<tr>
													<td>INDICATOR</td>
													<td>Signs of compromise</td>
												</tr>
												<tr>
													<td>CAMPAIGN</td>
													<td>Organized attack</td>
												</tr>
												<tr>
													<td>INFRASTRUCTURE</td>
													<td>Systems in use</td>
												</tr>
												<tr>
													<td>ATTACK_RESOURCE_LEVEL</td>
													<td>Attacker's resources</td>
												</tr>
												<tr>
													<td>LOCATION</td>
													<td>Attack location</td>
												</tr>
												<tr>
													<td>INTRUSION_SET</td>
													<td>Related attacks</td>
												</tr>
												<tr>
													<td>ATTACK_SOPHISTICATION_LEVEL</td>
													<td>Attack complexity</td>
												</tr>
												<tr>
													<td>ATTACK_TOOL</td>
													<td>Tools used</td>
												</tr>
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