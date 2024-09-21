const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const { spawn } = require('child_process')
const path = require('path')
const dotenv = require('dotenv')

// const { v4: uuidv4 } = require('uuid');

// const Users = require('./db_schemas/Users')
// const Chats = require('./db_schemas/Chats')

// const chatRoutes = require("./routes/chatRoutes")
const authRoutes = require("./routes/authRoutes")
const fetchRoutes = require("./routes/fetchRoutes")
const dbRoutes = require("./routes/databaseRoutes")
// const buildPath = path.join(__dirname, "../frontend", "build")

dotenv.config()


const app = express()

const PORT = process.env.PORT || 6969

mongoose.connect(process.env.MONGO_URI)
	.then(() => {

		app.listen(PORT, () => {
			console.log(`Server listening on port: ${PORT}`)
			console.log(`Mongo connection established`)
		})
	})
	.catch((err) => {
		console.log(`Error connecting to mongo: ${err}`)
	})

// app.use(express.static(buildPath))

app.use(express.json())
app.use(cors({
	origin: ["http://localhost:3000"],
	credentials: true
}))
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/fetch", fetchRoutes)
app.use("/api/db", dbRoutes)


app.get("/", (req, res) => {
	res.send("HELLO WORLD")
})
