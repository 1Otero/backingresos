const { Router }= require("express")
const { getAllUsersByEventS, getAllUsersByTokenEventS, updateStatusUserByTokenEventAndEmailS, getAllUsersByEventIdS, getAllAssistantUserTestR }= require("./../../services/user/userService")
const router= Router()

router.get("/allusersbyevent", getAllUsersByEventS)
router.get("/getallusersbytokenevent/:tokenEvent", getAllUsersByTokenEventS)
router.put("/updatestatususerbytokeneventandemail", updateStatusUserByTokenEventAndEmailS)
router.get("/getallusersbyeventid/:eventId", getAllUsersByEventIdS)
router.get("/test/assistantuser/:tokenEvent", getAllAssistantUserTestR)

module.exports= router