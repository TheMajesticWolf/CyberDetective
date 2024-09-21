const express = require('express')
const { authenticateToken } = require('../authorisation/authorisationUtilities')
const Chats = require('../db_schemas/Chats')


let router = express.Router()

router.use(authenticateToken)

router.post("/create-new-chat", async (req, res) => {

	let user_id = req.user_id

	console.log(user_id)



	let newChat = new Chats({
		"title": "Default",
		"user_id": user_id,
		"conversations": [

			// 	{ question: "Q1", output: "A1", response_format: "string", "conversation_id": "conv1",},
			// 	{ question: "Q2", output: "A2", response_format: "string", "conversation_id": "conv2",},
			// 	{ question: "Q3", output: "A3", response_format: "string", "conversation_id": "conv3",}
		]
	})

	let out = await newChat.save()

	res.status(201).send({ success: true, response: out })	


})


// Deletes the chat with given chat_id
router.delete("/delete-chat/:chat_id", async (req, res) => {
	let { chat_id } = req.params
	let user_id = req.user_id

	let chatObj = req.body.chatObj

	let chatToUpdate = await Chats.deleteOne({ user_id: user_id, _id: chat_id })

	// let out = await chatToUpdate.save()

	if (chatToUpdate["deletedCount"] == 0) {
		res.status(500).send({ success: false, message: "Failed to delete chat" })
		return
	}

	res.status(200).send({ success: true, response: chatToUpdate })
})


// Fetches all the chat_ids of a given user
router.get("/fetch-chat-ids", async (req, res) => {
	// let { user_id } = req.params
	let user_id = req.user_id



	let out = await Chats.find({ user_id: user_id }).select(["_id", "title"])


	res.status(200).send({ success: true, response: out })
})

// Fetches all the conversations of a chat given the chat_id
router.get("/fetch-chat/:chat_id", async (req, res) => {
	let { chat_id } = req.params
	let user_id = req.user_id


	// let out = await Chats.aggregate([
	// { $match: { _id: new mongoose.Types.ObjectId(chat_id) } },
	// { $unwind: "$conversations" },
	// { $project: { "conversations": 1, _id: 0 } }
	//   ])

	let out = await Chats.findOne({user_id: user_id, _id: chat_id})


	res.status(200).send({ success: true, response: out })
})


// Adds a new conversation to a chat with given chat_id
router.post("/update-chat/:chat_id", async (req, res) => {

	let { chat_id } = req.params
	let user_id = req.user_id

	let newConversationObj = req.body.newConversationObj

	let chatToUpdate = await Chats.findOne({ user_id: user_id, _id: chat_id })


	chatToUpdate["conversations"].push(newConversationObj);

	let out = await chatToUpdate.save()

	res.status(201).send({ success: true, response: out })

})




module.exports = router