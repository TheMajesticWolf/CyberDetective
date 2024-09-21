const express = require('express')
const { authenticateToken } = require('../authorisation/authorisationUtilities')
const Chats = require('../db_schemas/Chats')


let router = express.Router()

router.use(authenticateToken)

/*
The data in Mongo is stored as follows

1. There are 2 schemas - Users, Chats
2. The "Users" schema is for storing login related info
3. The "Chats" schema is used for storing the chats
4. Every Chat object has the following keys: ["user_id", "title", "conversations"]
5. Whenever a user clicks on new chat, a new "Chat" obejct is created whose "user_id" key contains the value of the user_id of the user who requested the new chat.
6. Every "Chat" consists of a list of conversations
7. Every item in the conversation list is an object with the mandatory keys: ["question", "output", "return_format"] (may include additional keys)
8. In the frontend, a user has the ability to view every "conversation" from his/her available conversations, individually and can navigate between them
9. Whenever a user asks a question, the conversation object {"question": "", "output": "", "return_format": ""} gets appended to the current conversation list

*/

router.post("/create-new-chat", async (req, res) => {

	let user_id = req.user_id

	console.log(user_id)



	let newChat = new Chats({
		"title": "Default",
		"user_id": user_id,
		"conversations": [

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