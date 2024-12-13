const express = require('express')
const { spawn } = require('child_process')
const { authenticateToken } = require('../authorisation/authorisationUtilities')
const axios = require('axios').default
const puppeteer = require('puppeteer-core')
const fs = require('fs')

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

	if(userObj["analysisType"].endsWith("scrape")) {
		let response = await axios.post(`http://localhost:6969/api/fetch/scraping`, {
			url: userObj["userQuestion"],
		}, {
			headers: {
				'Cookie': req.headers.cookie 						// Pass cookies from the incoming request so that the authentication does not fail
			}
		})
		
		let scrapedText = response.data?.scrapedText
		userObj["userQuestion"] = scrapedText
		userObj["analysisType"] = "ner-rfc"
		
	}
	
	let response = await axios.post(`${process.env.FLASK_URL}/perform-ner`, userObj)
	
	let pythonOutput = response.data

	res.status(200).json({ success: true, response: pythonOutput })


})



router.post("/rag-based-qa", async (req, res) => {
	let userObj = {
		userQuestion: req.body.userQuestion,
		neighbors: req.body.neighbors,
	}

	console.log(userObj)

	// let pythonOutput = await executeScript("./Python_Scripts/ner.py", userObj)
	
	let response = await axios.post(`${process.env.FLASK_URL}/rag-based-qa`, userObj)
	
	let pythonOutput = response.data

	res.status(200).json({ success: true, response: pythonOutput })


})


router.post('/scraping', async (req, res) => {
    const url = req.body.url
    console.log(url)
    try {
        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium', // Path to Firefox binary
            headless: true,  // Set to false if you want to see the UI
            args: [
                '--incognito',
				"--no-sandbox"
            ]
        })
        const page = await browser.newPage()

        await page.goto(url, { waitUntil: 'networkidle2' })

        const textContent = await page.evaluate(() => {
            const unwantedTags = ['nav', 'footer', '.sidebar', '.navbar', '.menu']

            unwantedTags.forEach(tag => {
                const elements = document.querySelectorAll(tag)
                elements.forEach(el => el.remove()) 
            })

            return document.body.innerText

        })

        fs.writeFile('scrapedText.txt', textContent, (err) => {
            if (err) throw err
            console.log('Text has been saved to scrapedText.txt!')
        })

        await browser.close()
        res.status(200).send({ success: true, scrapedText: textContent })
    }
    catch (error) {
        res.status(404).send({ success: false, message: `Failed to Scrape: ${error}` })
    }
})


router.get("/db-preview/:count", async (req, res) => {

	// let fileData = fs.readFileSync("../")
	let userObj = {
		count: req.params.count
	}
	let response = await axios.get(`${process.env.FLASK_URL}/db-preview`, {
		params: userObj, 
		headers: {
			"Content-Type": "application/json"
		}
	})
	let jsonData = response.data

	res.status(200).json({success: true, response: jsonData})

})

module.exports = router
