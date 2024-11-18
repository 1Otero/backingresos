const panelEventI = require("../../models/panelevent/paneleventI")
const paneleventM = require("../../models/panelevent/paneleventM")
module.exports= {
 createPanelEventR: async (eventPanel=panelEventI) => {
  let createPanelEvent= new paneleventM(eventPanel);
  let newPanelEvent= await createPanelEvent.save()
  .catch(err => {
    console.log("err create panel event ")
    console.log(err)  
    return null
  })
  return newPanelEvent;
 },
 getPanelEventByTokenR: async (token=String) => {
  let eventByToken= await paneleventM.findOne({ tokenEvent: token })
  .catch(err => {
    console.log("err get event by token")
    console.log(err) 
    return null 
  })
  return eventByToken
 }
}