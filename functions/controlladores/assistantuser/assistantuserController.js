const { Router } = require("express")
const { getAllUserAssistanByEventS, createManyUserAssistantS } = require("../../services/assistantuser/assistantuserService")
const router= Router()

router.get("/getalluserassistanbyevent", getAllUserAssistanByEventS)
router.post("/createmanyassistanusers", createManyUserAssistantS)

module.exports= router