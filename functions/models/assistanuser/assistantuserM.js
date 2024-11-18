const mongoose= require("mongoose")

const assistantuser= new mongoose.Schema({
  assistantuserId: {type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId(), required: true, unique: true},
  eventId: {type: mongoose.Schema.Types.ObjectId},
  userId: {type: mongoose.Schema.Types.ObjectId},
  createDate: {type: Date},
  status: {type: Number}
})
module.exports= mongoose.model("assistantUser", assistantuser);