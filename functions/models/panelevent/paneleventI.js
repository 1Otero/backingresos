module.exports= class panelEventI{
 constructor(panelEventId,eventId,tokenEvent,createEvent,status,endEvent,needTokenAssistant){
    this._panelEventId=panelEventId;
    this.eventId=eventId;
    this.tokenEvent=tokenEvent;
    this.createEvent=createEvent;
    this.status=status;
    this.endEvent=endEvent;
    this.needTokenAssistant=needTokenAssistant;
 }
}