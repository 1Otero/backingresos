const nodemailer= require("nodemailer")
const { configInit, configExt }= require("./../email/envEmail")

async function initTransport(){
    let transport= await nodemailer.createTransport(configInit)
    try{
     return {status: true, d: transport}
    }catch(error){
     console.log("error init transporter: ")
     console.log(error)
     return {status: false}
    }
}
module.exports= {
    sendManyMailUserAssistantTokenR: async (listTextSendEmaills=[]) => {
        let transportSendEmails= await initTransport()
        let noSendedEmails= []
        let sendedEmails= []
        if(!transportSendEmails.status){
          console.log("no se logro la conexion a smtp")
        }
        //return sendedEmails
        let countEmails= listTextSendEmaills.length
        if(countEmails < 1){
         console.log("no se encuentra una lista de usuarios con correo para enviar")
         return {status: false, listTextSendEmaills}
        }
        let meTransport= transportSendEmails.d
        for(let i=0; i<countEmails; i++){
            try{
              configExt.to= listTextSendEmaills[i].email
              configExt.text= `Sr. ${listTextSendEmaills[i].name} your token for entry to event is ${listTextSendEmaills[i].token}`
              configExt.subject= "Evento tuPrueba"
              await meTransport.sendMail(configExt)
              sendedEmails.push(listTextSendEmaills[i])
              console.log("sended mail!....")
            }
            catch(err){
                noSendedEmails.push(listTextSendEmaills[i])
                console.log("err sended email: ")
                console.log(err)
            }
        }
        meTransport.close()
        return {status: true, sendedEmails, noSendedEmails}
    }
}