const mongoose= require("mongoose")
module.exports= async function connect(){
    const connectMongoose= await mongoose.connect("mongodb://localhost:27017/tstingreso")
    const connetionM= await mongoose.connection
    connetionM.on("error", (err) => {
        console.log("error: ")
        console.log(err)
        return false
    })
    console.log("connected!")
    return true
}


