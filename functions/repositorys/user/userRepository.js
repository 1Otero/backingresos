const { default: mongoose } = require("mongoose")
const UserM= require("./../../models/user/userM")
const UserI= require("./../../models/user/UserI")
const paneleventM = require("../../models/panelevent/paneleventM")
const userM = require("./../../models/user/userM")
const assistantuserM = require("../../models/assistanuser/assistantuserM")
module.exports= {
    getAllUsersByEventIdR: async (eventId=String) => {
     let users= await UserM.find()
     .catch(err => {
        console.log("error allUsers: ")
        console.log(err)
     })
     return users;
    },
    getUserByUserIdR: async (userId=String) => {
     let user= await UserM.findOne({
        userId: new mongoose.Types.ObjectId(userId)
     })
     .catch(err => {
        console.log("error allUsers: ")
        console.log(err)
        return null;
     })
     return user
    },
    createAllUsersR: async (listUsers=new Array(UserI)) => {
     let infoCreated= await UserM.insertMany(listUsers)
     .catch(err => {
       console.log("error manyUsers: ")
       console.log(err)
     })
     return infoCreated;
    },
    updateUserR: async (user=UserI) => {
     let updateUser= await UserM.updateOne({
      userId: new mongoose.Types.ObjectId(user.userId)
     }, { $set: user})
     .catch(err => {
      console.log("error updateUser: ")
      console.log(err)
     })
     return updateUser
    },
    updateManyUsersR: async (listUsers= new Array(UserI)) => {
     let infoUpdated= await UserM.updateMany(listUsers)
     .catch(err => {
      console.log("error updateManyUsers: ")
      console.log(err)
     })
     return infoUpdated;
    },
    getUserByEmail: async (email=String) => {
     let user= await UserM.findOne({ email: email })
     .catch(err => {
      console.log("err getUserByEmail: ")
      console.log(err)
      return null
     })
     return user
    },
    getAllUsersByTokenEventR: async (token=String) => {
     let infoAggregate= await paneleventM.aggregate([{
      $match: { tokenEvent: token }
     },{
      $lookup: {
         from: 'assistantusers',
         foreignField: 'eventId',
         localField: 'eventId',
         as: 'meassistantuser'
      }
     },{
      $lookup: {
         from: 'users',
         foreignField: 'userId',
         localField: 'meassistantuser.userId',
         as: 'meusers'
      }
     }
   //   ,{
   //      $project: {
   //         panelEventId: 1,
   //         isWithToken: 1,
   //         listUsersByTokenEvent: {
   //            $map: {
   //               input: "$meusers",
   //               as: 'u',
   //               in: {
   //                  userId: '$$u.userId',
   //                  name: '$$u.name',
   //                  email: "$$u.email",
   //                  edad: "$$u.edad",
   //                  token: "$$u.token",
   //                  status: '$$u.status',
   //                  createDate: "$$u.createDate",
   //                  entryDate: "$$u.entryDate",
   //                  exitDate: "$$u.exitDate",
   //                  phone: "$$u.phone"
   //               }
   //            }
   //         }
   //      }
   //     }
     // {
     //    $replaceRoot: {
     //       newRoot: '$meusers'
     //    }
     // }
    ,{
      $project: {
         listUsersByTokenEvent: '$meusers',
         needTokenAssistant: 1  
      }
    }  
   ])
     //let listMeusers= infoAggregate
     let listMeusers= infoAggregate[0]
     return listMeusers;
    },
    getTestAssistantUserR: async (token=String) => {
      let infoTest= await paneleventM.aggregate([{
         $match: {
            tokenEvent: token 
         }
      },{
         $lookup: {
            from: 'assistantusers',
            foreignField: 'eventId',
            localField: 'eventId',
            as: 'meassistantusers'
         }
      }
      // ,{
      //    $unwind: '$meassistantusers'
      // }
      ,{
         $lookup: {
            from: 'users',
            foreignField: 'userId',
            localField: 'meassistantusers.userId',
            as: 'meusers'
         }
      },{
         $project: {
            meassistantusers: 1,
            tokenEvent: 1,
            meusers: 1
         }
      }])       
      return infoTest
    },
    getUserByTokenEventAndEmailSetStatusAndExitDateR: async (tokenevent=String, status=Number, emailCompare=String, exitDate=Date) => {
     let updateStatusExit= await paneleventM.aggregate([{
      $match: {
         tokenEvent: tokenevent
      }
     },{
      $lookup: {
       from: 'assistantusers',
       foreignField: 'eventId',
       localField: 'eventId',
       as: 'meassistantuser'
      }
     },{
      $unwind: '$meassistantuser'
     },{
      $lookup: {
         from: 'users',
         foreignField: 'userId',
         localField: 'meassistantuser.userId',
         as: 'meuser'
      }
     },{
      $unwind: '$meuser'
     },{
      $match: {
         $expr: {
            $eq: ["$meuser.email", emailCompare]
         }
      }
     },{
      $set: {
         "meuser.status": status,
         "meuser.exitDate": exitDate.toString()
      }
     }])
     return updateStatusExit;
    },
    getUserByTokeneventAndEmailSetStatusAndEntrydateR: async (tokenevent=String, status=Number, emailCompare=String, entryDate=Date) => {
     let updateUser= await paneleventM.aggregate([{
      $match: { tokenEvent: tokenevent }
     },{
      $lookup: {
         from: 'assistantusers',
         foreignField: 'eventId',
         localField: 'eventId',
         as: 'meassistantuser'
      }
     },{
      $unwind: '$meassistantuser'
     },{
      $lookup: {
         from: 'users',
         foreignField: 'userId',
         localField: 'meassistantuser.userId',
         as: 'meuser'
      }
     },{
      $unwind: "$meuser"
     },{
      $match: {
         $expr: {
           $eq: ["$meuser.email", emailCompare]
         }
      }
     },{
      $set: {
         //"meuser.status": status,
         "meuser.entryDate": entryDate.toString()
         //"meuser.entryDate": entryDate
      }
      }//,{
   //    $project: {
   //       meuser: "$meuser"
   //    }
   //   }
   ,{
      $replaceRoot: {
         newRoot: '$meuser'
      }
   }])
     .catch(err => {
      console.log("err aggregate userUpdateStatusEntryByEmail")
      console.log(err)
      return [{
         meuser: null
      }]
     })
     //updateUser.status= status
     return updateUser
    },
    getAssistantByTokenEventAndEmailAndTokenAssistantSetStatusAndEntryR: async (tokenAssistant=String, tokenevent=String, status=Number, emailCompare=String, entryDate=Date) => {
      let updatedAssistant= await paneleventM.aggregate([{
         $match: tokenevent
      },{
         $lookup: {
            from: 'assistantusers',
            foreignField: 'eventId',
            localField: 'eventId',
            as: 'meassistant'
         }
      },{
        $unwind: '$meassistant'
      },{
         $lookup: {
            from: 'users',
            foreignField: 'userId',
            localField: 'meassistant.userId',
            as: 'meuser'
         }
      },{
         $unwind: '$meuser'
      },{
         $match: {
            $expr: {
              $eq: ["$meuser.email", emailCompare, "$meuser.token", tokenAssistant]
            }
         }
      }
      ,{
         $set: {
            //"meuser.status": status,
            'meuser.entryDate': entryDate.toString()
         }
      }
      ,{
         $replaceRoot: {
            newRoot: '$meuser'
         }
      }])
      return updatedAssistant
    },
    getUserEventByEventTokenAndEventAssistantTokenAndEmailR: async (tokenevent=String, tokenAssistant=String, emailCompare=String) =>{
      let userByTokenAssistantAndEmail= await paneleventM.aggregate([{
         $match: {
            tokenEvent: tokenevent
         }
      },
      {
        $lookup: {
         from: 'assistantusers',
         foreignField: 'eventId',
         localField: 'eventId',
         as: 'meassistantusers'
        }   
      },{
         $lookup: {
            from: 'users',
            foreignField: 'userId',
            localField: 'meassistantusers.userId',
            as: 'meusers'
         }
      },{
         $unwind: '$meusers'
      },{
         $match: {
            $and: [
               {
                  $expr: {
                     $eq: ["$meusers.email", emailCompare]
                  }
               },{
                  $expr: {
                     $eq: ["$meusers.token", tokenAssistant]
                  }
               }
            ]
         }
      },{
         $replaceRoot: {
            newRoot: '$meusers'
         }
      }])
      .catch(err => {
         console.log("err getUser by email and tokenAssistant")
         console.log(err)
         return null
      })
      return userByTokenAssistantAndEmail;
    },
    getUserByTokeneventAndEmailSetStatusR: async (tokenevent=String, status=Number, emailCompare=String) => {
      let updateUser= await paneleventM.aggregate([{
         $match: { tokenEvent: tokenevent }
        },{
         $lookup: {
            from: 'assistantusers',
            foreignField: 'eventId',
            localField: 'eventId',
            as: 'meassistantuser'
         }
        },{
         $unwind: '$meassistantuser'
        },{
         $lookup: {
            from: 'users',
            foreignField: "userId",
            localField: 'meassistantuser.userId',
            as: 'meuser'
         }
        },{
         $unwind: '$meuser'
        },{
         $match: {
          $expr: { $eq: ["$meuser.email", emailCompare]}
         }
        } //,{
      //    $set: { 
      //       "meuser.status": status
      //     }
      //   }
      //   ,{
      //    $project: {
      //       meuser: "$meuser"
      //    }
      //   }
      ,{
         $replaceRoot: {
            newRoot: '$meuser'
         }
      }])
      .catch(err => {
         console.log("err getUser by email")
         console.log(err)
         return null
      })
        return updateUser
    },
    updateUserStatusBytokeneventAndUserIdR: async (updateUser=UserI) => {
     let infoUserUpdate= updateUser
     let updatedUser= await userM.updateOne({ userId: infoUserUpdate.userId }, infoUserUpdate)
     return updatedUser
    },
    getAllUsersByEventIdR: async (eventId=String) => {
     let userUpdate= await assistantuserM.aggregate([{
      $match: { 
         eventId: new mongoose.Types.ObjectId(eventId)
      }
     },{
      $lookup: {
         from: 'users',
         foreignField: 'userId',
         localField: 'userId',
         as: 'meuser'
      }
     },{
      $unwind: '$meuser'
     },{
      // $project: {
      //    _id: 0,
      //    //meuser: "$meuser"
      //    ...Object.keys("$meuser")
      // }
      $replaceRoot: {
         newRoot: "$meuser"
      }
     }])
     .catch(err => {
      console.log("err aggregate get user by eventId:")
      console.log(err)
      return [{
         meuser: null
      }]
     })
     return userUpdate
    }
}