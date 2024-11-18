class UserI{
 constructor(_userId=String, name=String, email=String, edad=Number, token=String, status=String, createDate= new Date(), phone=String, entryDate= Date, exitDate=Date){
    this._userId= _userId;
    this.name= name;
    this.email= email; 
    this.edad= edad;
    this.token= token;
    this.status= status;
    this.createDate= createDate;
    this.entryDate= entryDate;
    this.exitDate= exitDate;
    this.phone= phone;
 }
}