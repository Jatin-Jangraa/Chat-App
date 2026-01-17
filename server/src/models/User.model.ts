import {model,Schema} from 'mongoose'


export interface IUser extends Document {
  _id : string,
  name:  string,
  username:  string, 
  password:  string,
  about:  string,
  avatar : string
}



const schema = new Schema<IUser> ({
    name : {type :String ,required :true},
    username : {type : String , required : true , unique : true},
    password : { type :String  , required : true},
    avatar : {type :String },
    about  :{ type :String , default : "Hello"}
},
{timestamps : true})


export const User = model<IUser>("User",schema)