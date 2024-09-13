const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()


const createAuthToken = (userObject) => {
	return jwt.sign({
		username: userObject["username"],
		user_id: userObject["user_id"]
	}, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: 5
	})

}

const createRefreshToken = (userObject) => {
	return jwt.sign({
		username: userObject["username"],
		user_id: userObject["user_id"]
	}, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: 60 * 10
	})

}


const authenticateToken = (req, res, next) => {
	// let accessToken = req.headers["authorization"] && req.headers["authorization"].split(" ")[1]
	let accessToken = req.cookies["accessToken"]

	// console.log("Here: ", accessToken)

	jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, userObj) => {
		if (err) {
			res.status(403).send({ success: false, response: { authenticationFailed: true, message: "Not authorized. DO NOT TRY TO BYPASS SINCE ITS IMPOSSIBLE 😂😂😂" } })
			return
		}

		if (userObj) {
			req.user_id = userObj["user_id"]
			next()
		}




	})
}

module.exports = {
	createAuthToken: createAuthToken,
	authenticateToken: authenticateToken,
	createRefreshToken: createRefreshToken
}