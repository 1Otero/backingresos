const { createAllUsersR, getUserByUserIdR, updateManyUsersR, getAllUsersByEventIdR, getUserByEmail, updateUserR }= require("./../../repositorys/user/userRepository")
const eventI= require("./../../models/event/eventI")
const { request, response }= require("express")
const { Workbook }= require("exceljs")
const { readFileXlsxWithUsersR }= require("./../../repositorys/upfile/upfileRepository")
const { token } = require("morgan")
const { createAllAssistantUsersR, getCountAssistantUserByEventIdR } = require("../../repositorys/assistantuser/assistantuserRepository")
const { createEventR, geteventbytokenR } = require("../../repositorys/event/eventRepository")
const panelEventI = require("../../models/panelevent/paneleventI")
const { createPanelEventR, getPanelEventByTokenR } = require("../../repositorys/panelevent/paneleventRepository")
const { sendManyMailUserAssistantTokenR } = require("../../repositorys/email/emailRepository")
async function getReadXlsx(buffer=Buffer, isWithToken=Boolean, limiteArchivos=Number){
 let workbook= new Workbook()
 let meWorkbook= await workbook.xlsx.load(buffer)
 let meWorkSheet= await meWorkbook.getWorksheet(1)
 let rowsInfo= []
 let titles;
 let countRows= meWorkSheet.rowCount
 if(countRows < (limiteArchivos + 2)){
    meWorkSheet.eachRow((r, nr) => {
        //let celsInfo= []
        let data= {}
        if(nr == 1){
          titles= r.values.slice(1)
        }else{ 
          r.eachCell((c, n) => {
              let key= titles[n - 1]
              //celsInfo.push({cell: n,[key]: c.value})
              data[key]= c.value
              if(!c.value.text){
                  data[key]= c.value
              }else{
                  data[key]= c.value.text
              }
          }) 
          //rowsInfo.push({Row: (nr - 1), celsInfo})
          //rowsInfo.push({ Row:(nr - 1), data })
          data["token"]= isWithToken==true?(Math.floor((Math.random() + 1) * 9999)):null
          data["status"]= 1
          data["createDate"]= new Date()
          rowsInfo.push(data)
        }
       })
    return {limite: false , rowsInfo, countRows}   
 }else{
    return {limite: true, rowsInfo, countRows}
 }
 //return {titles, rowsInfo}
 
}
module.exports= {
    readFileXlsxWithUsersS: async (req=request, res=response) => {
     let info= readFileXlsxWithUsersR(["lol","fff"])   
     let meFile= req?.files
     if(!meFile){
      return res.json({rowsInfo: null, message: "Debe subir una base de datos para poder realizar el registro de ingresos", metokenevent: null, newToken: false}).status(203)
     }
     let data= meFile.file.data
     let mebody= req.body
     let limiteArchivos= 15
     //let tokenEvent= Math.floor((Math.random() + 1) * 9999)
     //Se debe validar si existe o no el token para evento de registros con usuario ya existentes -> en caso de que no exist llega en false y se debe crear la relacion y el token
     //En caso de que si exista se debe validar si no a pasado el limite de 13 usuarios para asi poder guardar mas usuarios o modificar los existentes o en cambio retornar error
     //Se debe validar si se necesita token para validar los usuarios -> recordar crear relacion en base de datos
     console.log("body: ")
     console.log(mebody)
     let metoken= mebody.tokenevent
     let isWithToken= mebody.isWithToken=="true"?true:false
     let existToken= mebody.tokeneventexist
     let needTokenAssistant= isWithToken
     let hoursEndEvent= new Date()
     hoursEndEvent.setHours(hoursEndEvent.getHours() + 12)
     if(existToken=="true"){
      let panelEventInfo= await getPanelEventByTokenR(metoken)
      isWithToken= panelEventInfo.needTokenAssistant
     }
     let body= await getReadXlsx(data, isWithToken, limiteArchivos)
     //return res.json({titles: body.titles, rowsInfo: body.rowsInfo});
     if(!body.limite){
        if(existToken=="true"){
          let updatedInfo= false
          let listExistUsers=[];
          let listNewAssistantUsers=[];
          let listCreateUsers=[];
          let eventId= "3243dkfslfjkdsld" //Aqui se debe validar un evento con uno real en base al token existente
          //Va a validar el evento y procede actualizar los datos y crear los usuarios que no existen, enlaza los usuarios con la tabla intermedia que relaciona con un evento
          let event= await geteventbytokenR(metoken)
          if(!event || event.length == 0){
            return res.json({rowsInfo: null, message: "El token no es valido o ese evento no se debe usar", metokenevent: null, newToken: false}).status(203)
          }
          let meEventId= event[0].meevent[0].eventId
          needTokenAssistant= event[0].needTokenAssistant
          //se va a recorrer el body para poder validar
          //Se va a consultar en user si existe el user -> en caso de que si se agrega a una lista de listExist - y si no en listCreate
          // body.rowsInfo.forEach(async (i, n) => {
          //   console.log("i: ")
          //   console.log(i)
          //   //const meUser= await getUserByUserIdR(i.userId);
          //   const meUser= await getUserByEmail(i.email);
          //   console.log("meUserService: ")
          //   console.log(meUser)
          //   if(meUser==null){
          //    listCreateUsers.push(i);
          //    console.log("melistCreateUsers: ")
          //    console.log(listCreateUsers)
          //    return;
          //   }
          //   meUser.name= i.name!=null?i.name:meUser.name
          //   meUser.email= i.email!=null?i.email:meUser.email
          //   meUser.edad= i.edad!=null?i.edad:meUser.edad
          //   meUser.phone= i.phone!=null?i.phone:meUser.phone
          //   listExistUsers.push(meUser);  
          // })
          let bodyInfo= body.rowsInfo;
          let countExistUsers= await getCountAssistantUserByEventIdR(meEventId)
          let countUsersToCreate= 0;
          //let countTotalRows= body.countRows + countExistUsers
          for(let i= 0; i < bodyInfo.length; i++){
           let info= bodyInfo[i]
           //const meUser= await getUserByUserIdR(i.userId);
           const meUser= await getUserByEmail(info.email);
           if(meUser==null){
            listCreateUsers.push(info);
            countUsersToCreate+= 1;
            let countTotalRows= countExistUsers + countUsersToCreate
            let numEspacionRowsSave= (limiteArchivos - countExistUsers)
            numEspacionRowsSave= numEspacionRowsSave < 0? 0: numEspacionRowsSave 
            if(countTotalRows > limiteArchivos){
             return res.json({rowsInfo: null, message: `la cantidad de usuarios agregar debe ser menor a ${numEspacionRowsSave}, porque ya tiene ${countExistUsers} usuarios en su base de datos y 
             esta intentando agregar ${countUsersToCreate} o mas usuarios fuera de los que se estan modificando y el limite de esta version free es de ${limiteArchivos} usuarios`, 
             metokenevent: null, newToken: false}).status(203)
            }
            continue;
           }
           meUser.name= info.name!=null?info.name:meUser.name
           meUser.email= info.email!=null?info.email:meUser.email
           meUser.edad= info.edad!=null?info.edad:meUser.edad
           meUser.phone= info.phone!=null?info.phone:meUser.phone
           let updatedUser= await updateUserR(meUser)
           updatedInfo= true
           //listExistUsers.push(meUser);
          }
          //let updatedInfo= false
          if(listCreateUsers.length > 0){
            const allUsers= await createAllUsersR(listCreateUsers);
            let listNewAssistantUsers= allUsers.map((u, n) => {
              return { userId: u.userId, eventId: meEventId, createDate: new  Date(), status: 1}
            })
            //
            //Debo empezar guardar los datos que tienen la relacion en assistantuser
            //
            //return res.json({ rowsInfo: body.rowsInfo, message: "usuarios agregados y modificados correctamente", metokenevent: metoken, newToken: false, infoupdated: true })  
            let createdAllAssistantUsers= await createAllAssistantUsersR(listNewAssistantUsers)
            let sendedEmailInfo= await sendManyMailUserAssistantTokenR(listCreateUsers)
          }
          //
          //Aqui se va a llamar al nuevo metodo que se va a crear que es para actualizar una lista de usuarios con un id especifico -> se va a consultar con correo o numero de documento
          //
          //Se deben modificar los datos en la base de datos directamente
          // if(listExistUsers.length > 0){
          //   updatedInfo= true
          //   //Aqui pasa a modificarse en la tabla user -> se va a mandar la listaExistUser, que debe tener todo el json con la informacion de usuario y su userId
          //   let updatedManyUsers= await updateManyUsersR(listExistUsers)
          //   console.log("updatedManyUsers: ")
          //   console.log(updatedManyUsers)
          // }
          //return res.json({ rowsInfo: {modificados: listExistUsers, agregados: listCreateUsers}, message: "usuarios agregados y modificados correctamente", metokenevent: metoken, newToken: false, infoupdated: updatedInfo}); 
          let userInfoBody= await getAllUsersByEventIdR(meEventId)
          //return res.json({ rowsInfo: body.rowsInfo, message: "usuarios agregados y modificados correctamente", metokenevent: metoken, newToken: false, infoupdated: updatedInfo}); 
          return res.json({ rowsInfo: userInfoBody, message: "usuarios agregados y modificados correctamente", metokenevent: metoken, newToken: false, infoupdated: updatedInfo, needTokenAssistant}); 
        }
         let tokenEvent= Math.floor((Math.random() + 1) * 9999)
         let newTokenEvent= existToken=="false"?true:false
         //Aqui debo crear el evento
         let newEvent= new eventI(null, new String(new Date()).concat("ingreoso"), "ingreosxlsx", new Date(), tokenEvent, 1)
         let createdEvent= await createEventR(newEvent)
         let meEventId= createdEvent.eventId
         //Debo crear la relacion de panelEvent y agregar eventId con token de event
         let eventEndHour= new Date()
         eventEndHour.setHours(eventEndHour.getHours() + 24)
         let panelEvent= new panelEventI(null, meEventId, tokenEvent, new Date(), 1, eventEndHour, isWithToken)
         let createdPanelEvent= await createPanelEventR(panelEvent)
         //recuerda relacionar tanto userId, eventId -> para validar por eventId -> en base al token que se trae de panelEvent
         const allCreatedUsers= await createAllUsersR(body.rowsInfo)
         //Despues de crear los usuarios voy a poder agregar los id de los user en la tabla y tambien relaciona con la tabla event con el eventId
         let listNewAssistantUsers= allCreatedUsers.map(u => {
          return { userId: u.userId, eventId: meEventId, createDate: new  Date(), status: 1}
         })
         let newListAssistantUsers= await createAllAssistantUsersR(listNewAssistantUsers)
         let sendedEmailInfo= await sendManyMailUserAssistantTokenR(allCreatedUsers)
         //return res.json({rowsInfo: body.rowsInfo, message: "usuarios agregados correctamente", metokenevent: tokenEvent, newToken: newTokenEvent, infoupdated: false}).status(200)       
         return res.json({rowsInfo: allCreatedUsers, message: "usuarios agregados correctamente", metokenevent: tokenEvent, newToken: newTokenEvent, infoupdated: false, needTokenAssistant}).status(200)       
     }else{
        return res.json({rowsInfo: null, message: `la cantidad de usuarios debe ser menor a ${limiteArchivos}`, metokenevent: null, newToken: false}).status(203)
     }
    }
}