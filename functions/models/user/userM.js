const mongoose= require("mongoose")

const user= new mongoose.Schema({ 
 userId: {type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId(), unique: true, required: true},   
 name: {type: String},
 email: {type: String},
 edad: {type: Number},
 token: {type: String},
 status: {type: Number},
 createDate: {type: Date},
 entryDate: { type: Date },
 exitDate: { type: Date },
 phone: {type: String}
 })
 module.exports= mongoose.model("User", user)

