const { request, response }= require("express")
const { getAllEventsR } = require("./../../repositorys/event/eventRepository")

module.exports= {
    geteventbytokenS: (req=request, res=response) => {

     return res.json({fff: "refff"})
    },
    geteventbyeventidS: (req=request, res=response) => {
     return res.json({lol: "relol"})
    },
    getAllEventsS: async (req=request, res=response) => {
     let allEvents= await getAllEventsR()   
     return res.json({ allEvents })    
    }
}