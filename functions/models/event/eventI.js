module.exports= class event {
    constructor(eventId,name,description,createDate,tokenEvent,status){
        this._eventId=eventId; 
        this.name=name; 
        this.description=description;
        this.createDate=createDate; 
        this.tokenEvent=tokenEvent; 
        this.status=status;     
    }
}