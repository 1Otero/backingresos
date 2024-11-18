const { request, response } = require("express")
const { getAllUserAssistanByEventR, createAllAssistantUsersR } = require("../../repositorys/assistantuser/assistantuserRepository")

module.exports= {
    getAllUserAssistanByEventS: async (req=request, res=response) => {
     let infoUser= await getAllUserAssistanByEventR("reredsfsf1212adw12")
     return res.json({lol: "relol"})
    },
    createManyUserAssistantS: async (req=request, res=response) => {
     let createdAssistantUsers= await createAllAssistantUsersR()   
     return res.json({fff: "refff", newassistantUsers: createdAssistantUsers})
    }
}