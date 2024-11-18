const cors= require("cors");
const morgan= require("morgan");
const express= require("express");
const expressFileUpload= require("express-fileupload");
const upfileController= require("./controlladores/upfile/upfileController");
const userController= require("./controlladores/user/userController")
const eventController= require("./controlladores/event/eventController")
const serverlesshttp= require("serverless-http")
const conn= require("./utils/db/db")()

const app= express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors("*"))
app.use(morgan("dev"))
app.use(expressFileUpload())
app.use("/upfile", upfileController)
app.use("/user", userController)
app.use("/event", eventController)

app.set("port", 8082)
app.listen(app.get("port"), () => {
 console.log(`running on port ${app.get("port")}`)
})

module.exports.handler= serverlesshttp(app)
