const mongoose= require("mongoose");

const event= new mongoose.Schema({
    eventId: {type: mongoose.Schema.Types.ObjectId, required: true, unique: true, default: () => new mongoose.Types.ObjectId()},
    name: {type: String},
    description: {type:String},
    createDate: {type:Date},
    tokenEvent: {type:String, required:true, unique:true},
    status: {type:Boolean}
});
module.exports= mongoose.model("Event", event);