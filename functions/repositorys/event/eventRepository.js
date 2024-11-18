const { default: mongoose } = require("mongoose")
const eventM= require("./../../models/event/eventM")
const eventI= require("./../../models/event/eventI")
const paneleventM = require("../../models/panelevent/paneleventM")
module.exports= {
    geteventbytokenR: async (token=String) => {
     let eventAndPanelEvent= await paneleventM.aggregate([{
      $match: {
        tokenEvent: token
      }
     },{
      $lookup: {
        from: 'events',
        foreignField: 'eventId',
        localField: 'eventId',
        as: "meevent"
      }
     },{
      $project: {
        meevent: 1,
        needTokenAssistant: 1
      }
     }])
     return eventAndPanelEvent
    },
    geteventbyeventidS: async (eventId=String) => {
     let event= eventM.aggregate([{
        $match: { 
            eventId: new mongoose.Schema.ObjectId(eventId)
         }
     }])
     return event
    },
    createEventR: async (meEvent=eventI) => {
      let newEvent= new eventM(meEvent)
      let meNewEvent= await newEvent.save()
      return meNewEvent
    },
    getAllEventsR: async () => {
      let allEvents= await eventM.find()
      return allEvents
    }
}