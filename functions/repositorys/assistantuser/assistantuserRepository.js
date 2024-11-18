const mongoose= require("mongoose")
const assistantuserM = require("./../../models/assistanuser/assistantuserM")
const assistantuserI = require("../../models/assistanuser/assistantusesI")

module.exports= {
    getAllUserAssistanByEventR: async (eventToken=String) => {
     let assistantuser= await assistantuserM.find()
     .catch(err => {
      console.log("err: ")   
      console.log(err)      
     })
     return assistantuser
    },
    createAllAssistantUsersR: async (listAssistantUsers= new Array(assistantuserI)) => {
     let assistantUser= await assistantuserM.insertMany(listAssistantUsers)
     .catch(err => {
      console.log("err create all assistantUser: ")   
      console.log(err)      
     })
     return assistantUser 
    },
    getCountAssistantUserByEventIdR: async (eventId=String) => {
     let assistantUser= await assistantuserM.countDocuments({ eventId: new mongoose.Types.ObjectId(eventId) })
     .catch(err => {
      console.log("err countAssistantUserByEventId: ")   
      console.log(err)      
     })
     return assistantUser
    }
}