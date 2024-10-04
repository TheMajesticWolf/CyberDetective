const express = require('express')
const { spawn } = require('child_process')
const { authenticateToken } = require('../authorisation/authorisationUtilities')
const axios = require('axios').default

const router = express.Router()

router.use(authenticateToken)

const executeScript = (script, userObj) => {
	return new Promise((resolve, reject) => {

		let pythonExecutable = "/home/aditya/Desktop/Aditya/Tranberg USB/USB Drive/Aditya new/Aditya/CSM A/III Year/I Semester/PS_Cyber_Detective/venv/bin/python"
		let pythonFile = script
		let pythonOutput = ""

		const pythonProcess = spawn(pythonExecutable, [pythonFile], {
			stdio: ["pipe", "pipe", "inherit"]
		})

		pythonProcess.stdin.write(JSON.stringify(userObj))
		pythonProcess.stdin.end()

		pythonProcess.stdout.on("data", (data) => {
			pythonOutput += data
		})

		pythonProcess.on("close", async (code) => {


			pythonOutput = JSON.parse(pythonOutput)
			resolve(pythonOutput)
		})

		pythonProcess.on("close", (code) => {
			if (code != 0) {
				reject(`Execution failed with code: ${code}`)
			}
		})
	})
}


router.post("/perform-ner", async (req, res) => {
	let userObj = {
		userQuestion: req.body.userQuestion,
		analysisType: req.body.analysisType,
	}

	// let pythonOutput = await executeScript("./Python_Scripts/ner.py", userObj)
	
	let response = await axios.post(`${process.env.FLASK_URL}/perform-ner`, userObj)
	
	let pythonOutput = response.data

	res.status(200).json({ success: true, response: pythonOutput })


})


module.exports = router
