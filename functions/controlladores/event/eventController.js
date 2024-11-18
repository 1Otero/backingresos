const { geteventbytokenS, geteventbyeventidS, getAllEventsS }= require("./../../services/event/eventService")
const { Router }= require("express")
let router= Router()

router.get("/geteventbytoken", geteventbytokenS)
router.get("/geteventbyeventid", geteventbyeventidS)
router.get("/getallevents", getAllEventsS)

module.exports= router