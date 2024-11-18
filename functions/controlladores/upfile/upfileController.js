const { readFileXlsxWithUsersS }= require("../../services/upfile/upfileService")
const { Router }= require("express")
const router= Router()

router.post("/readxlsxwithusers", readFileXlsxWithUsersS)

module.exports= router;