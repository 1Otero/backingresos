const { getAllUsersByTokenEventR, updateUserStatusBytokeneventAndUserIdR, getUserByTokeneventAndEmailSetStatusR, getUserByTokeneventAndEmailSetStatusAndEntrydateR, 
   getAllUsersByEventIdR, getAssistantByTokenEventAndEmailAndTokenAssistantSetStatusAndEntryR, getTestAssistantUserR, 
   getUserEventByEventTokenAndEventAssistantTokenAndEmailR } = require("./../../repositorys/user/userRepository")
const { request, response } = require("express")
module.exports= {
    getAllUsersByEventS: async (req=request, res=response) => {
     return res.json({fff: "refff"})  
    },
    getAllUsersByTokenEventS: async (req=request, res=response) => {
     let tokenEvent= req.params?.tokenEvent
     if(!tokenEvent || tokenEvent==null){
      return res.json({status: 500, description: "debe enviar un paramentro valido para buscar correctamente"})  
     } 
     let listUsersByTokenEvent= await getAllUsersByTokenEventR(tokenEvent)
     //Aqui se debe validar si este evento tiene o no token para los userAssistant
     //return res.json({listUsersByTokenEvent, existTokenUserAssistant: false})
     return res.json(listUsersByTokenEvent)
    },
    updateStatusUserByTokenEventAndEmailS: async (req=request, res=response) => {
     //
     //
     //Aqui debemos validar a la tabla panelEvent para poder confirmar si el usuario requiere o no de un token -> no se puede confiar del front
     //Se debe validar panelEvent por tokenEvent
     //
     // 
     let { email, tokenevent, status, isWithTokenAssistant, tokenAssistant }=req.body  
     //Recordar que status tiene tanto si ingreso, salio o si esta en estado bloqueado, asi que se debe validar mejor eso  
     let infoUpdateUser= []
     //let infoUpdateUser= await getUserByTokeneventAndEmailSetStatusR(tokenevent, status, email)
     //let infoUpdateUser= await getUserByTokeneventAndEmailSetStatusAndEntrydateR(tokenevent, status, email, new Date())
     if(!isWithTokenAssistant){
      infoUpdateUser= await getUserByTokeneventAndEmailSetStatusR(tokenevent, status, email)
     }else{
      if(!tokenAssistant){
         return res.json({ updated: false, description: 'Debe colocar el token suministrado para este evento', typeStatus: 0, info: null})
      }
      infoUpdateUser= await getUserEventByEventTokenAndEventAssistantTokenAndEmailR(tokenevent, tokenAssistant, email)
     }
     if(!infoUpdateUser || infoUpdateUser.length < 1){
      return res.json({ updated: false, description: `Algo salio mal en la consulta a la base de datos, debe validar el correo electronico suministrado ${isWithTokenAssistant?", junto con su token enviado"
         :""}`, typeStatus: 0, info: null})
     }
     //let updateUser= infoUpdateUser[0]?.meuser
     let updateUser= infoUpdateUser[0]
     //let updateUser= infoUpdateUser
     if(!updateUser){
      return res.json({ updated: false, description: 'El usuario no se encontro en la base de datos, debe validar el correo electronico suministrado', typeStatus: 0, info: updateUser})
     }
     else if(updateUser.status == 4){
        return res.json({ updated: false, description: "Este usuario esta bloqueado", typeStatus: 3, info: updateUser})
     }
     if(status == 2){ //Si 2 es entrada y si es 3 debe ser salida
      //Aqui se debe validar si el usuario ya tiene status en 2 -> en caso que si sea asi debe retornar un mensaje que diga, este usuario ya ingreso
      if(updateUser.status == 2){
         return res.json({ updated: false, description: `El usuario ${updateUser.name} ya ingreso ${updateUser?.entryDate.toString()}, debe dar salida antes`, typeStatus: 2, info: updateUser})
      }
      if(isWithTokenAssistant){
         if(!tokenAssistant){
            return res.json({ updated: false, description: `No se dio ingreso correctamente al usuario ${updateUser.name} porque el token no se envio`, typeStatus: 0, info: updateUser})
         }
         //let assistantUpdate= getAssistantByTokenEventAndEmailAndTokenAssistantSetStatusAndEntryR(tokenAssistant, tokenevent, status, email, new Date())
         if(updateUser.token!=tokenAssistant){
            //Aqui se debe modificar el dato
            return res.json({ updated: false, description: `No se dio ingreso correctamente al usuario ${updateUser.name} porque el token no es correcto ${updateUser.token}`, typeStatus: 0, info: updateUser})
         }
      }
      updateUser.status= status
      updateUser.entryDate= new Date()
      let updatedUser= await updateUserStatusBytokeneventAndUserIdR(updateUser) 
      let stringTokenInfo= isWithTokenAssistant?`con el token: ${tokenAssistant}`:`no se uso token`
      return res.json({ updated: true, description: `Se dio ingreso correctamente al usuario ${updateUser.name} ${stringTokenInfo}`, typeStatus: 2, info: updateUser})
     }
     //Aqui se va a pasar a salida
     if(updateUser.status == 3){
        return res.json({ updated: false, description: `El usuario ${updateUser.name} ya realizo salida ${updateUser?.exitDate.toString()}, debe dar ingreso antes`, typeStatus: 0, info: updateUser})
     }
     updateUser.status= status
     updateUser.exitDate= new Date()
     let updatedUser= await updateUserStatusBytokeneventAndUserIdR(updateUser) 
     return res.json({ updated: true, description: `Se dio salida correctamente al usuario ${updateUser.name}`, typeStatus: 3, info: updateUser})
     //updateUser.status= status
     //let updatedUser= await updateUserStatusBytokeneventAndUserIdR(updateUser) 
     //return res.json({ updateUser })
     //return res.json({ updated: true, description: `Se dio ingreso correctamente al usuario ${updateUser.name}`, typeStatus: 1, info: updateUser})
    },
    getAllUsersByEventIdS: async (req=request, res=response) => {
     let eventId= req.params?.eventId
     let allUsers= await getAllUsersByEventIdR(eventId)
     return res.json({ allUsers })
    },
    getAllAssistantUserTestR: async (req=request, res=response) => {
      let { tokenEvent } =req.params
      if(!tokenEvent){
       return res.json({message: "tokenEvent it is necesary for next step", status: 500 })   
      }
      let assistant= await getTestAssistantUserR(tokenEvent)
      return res.json({ data: assistant, status: 200 })
    }
}
