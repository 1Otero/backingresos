module.exports= class assistantuserI {
    constructor(assistantuserId,eventId,userId,createDate,status){
        this._assistantuserId=assistantuserId;
        this.eventId=eventId;
        this.userId=userId;
        this.createDate=createDate;
        this.status=status;
    }
}