const mongoose= require("mongoose")
let panelEvent= new mongoose.Schema({
 panelEventId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, default: () => new mongoose.Types.ObjectId()},
 eventId: { type: mongoose.Schema.Types.ObjectId, required: true },
 tokenEvent: { type: String },
 createEvent: { Date },
 status: { type: Number},
 endEvent: { type: Date},
 needTokenAssistant: { type: Boolean, default: false}
})
module.exports= mongoose.model("panelevent", panelEvent)