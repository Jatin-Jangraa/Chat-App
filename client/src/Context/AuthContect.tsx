import React, { createContext, useEffect, useState } from "react"
import api from "../Api/Axios"
import { io } from "socket.io-client"






 export interface IUser  {
    _id? : string,
    name:  string,
  username:  string, 
  password:  string,
  about:  string,
  avatar :string,
}

   interface IAuthContext {
    user :IUser | null,
    login : (data :  any) => any,
    logout : ()=>Promise<void>,
    loading : boolean,
    restoreuser : ()=>void,
    socket : any,
    onlineusers : string[],
}


const AuthContext = createContext<IAuthContext>({}as IAuthContext)


export const AuthProvider =  ({children}: {children : React.ReactNode}) => {

  const [user , setuser] =  React.useState<IUser | null>(null)
  const [loading , setloading] = React.useState<boolean>(true)
  const [onlineusers , setonlineusers] = useState([])
  
  const [socket , setsocket] = useState<any>(null)
  
  console.log(onlineusers,socket);



  useEffect(() => {
    restoreuser()
  }, [])





  const login = async (data : any) => {
              
              try {
               setloading(true)  
               const res = await api.post("/api/user/signin",data)
               setuser(res.data.user)
               setloading(false)
               return user
              
             } catch (error) {
               setloading(false)
               const message = (error as any).response?.data?.message || "Login failed"
               alert(message)
             }    
             }   
             
            

  const restoreuser = async () => {
    try {
      setloading(true)
      const res = await api.get("/api/user/getme")
      console.log(res.data);
      setuser(res.data)
      connectSocket(res.data)
      setloading(false)
    } catch (error) {
      setloading(false)
      setuser(null)
    }

}



  const logout = async () => {
    try {
      setloading(true)
      await api.get("/api/user/logout")
      setuser(null)
      setloading(false)
    }
    catch (error) {
      setloading(false)
      const message = (error as any).response?.data?.message || "Logout failed"
      alert(message)
    }
  }



  const connectSocket = async (userdata:any)=>{

    if(!userdata || socket?.connected) return ;

    const newsocket : any = io("http://localhost:4000/",{
      query : {
        userId  : userdata._id
      }
    })

    newsocket.connect();
    setsocket(newsocket)

    newsocket.on("getOnlineUsers",(userIds:any) =>{
      setonlineusers(userIds)
    })

  }


  return (
    <AuthContext.Provider value={{user,login,logout,loading,restoreuser,socket,onlineusers}}>
      {children}
    </AuthContext.Provider>
  )


}

export const useAuth = () => React.useContext(AuthContext)


































// import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
// import axios from 'axios'
// import toast from 'react-hot-toast'
// import {io} from 'socket.io-client'



// const backendurl = import.meta.env.Vite_Backend
// axios.defaults.baseURL = "http://localhost:4000/"


// export const AuthContext = createContext<any>(null)

// export const AuthProvider = ({children}:any) =>{

//   const [token,setToken] = useState(localStorage.getItem("token"))
//   const [authuser , setauthuser] = useState(null)
//   const [onlineusers , setonlineusers] = useState([])
//   const [socket , setsocket] = useState<any>(null)


//   const CheckAuth =async ()  =>{
//     try {
//       const {data} = await axios.get("/api/auth/check")
//       console.log(data);
      

//       if(data) {
//         setauthuser(data.user)
//         connectSocket(data.user)
//       }



//     } catch (error) {
//       toast.error
//     }
//   }




//   const login = async (state:any,userinfo:any) =>{

//     console.log(userinfo.userinfo);
    

//     try {
      
//       const  {data} = await axios.post(`/api/auth/${state}`,userinfo.userinfo)
//       console.log(data);
      
//       // setauthuser(data.user)
//       // connectSocket(data.user)
//       // axios.defaults.headers.common["token"] = data.token
//       // setToken(data.token)
//       // localStorage.setItem("token",data.token)
//       // toast.success("Logined")
//     } catch (error) {
//       toast.error
//     }

//   }


//   const logout = async () =>{
//     localStorage.removeItem("token")
//     setToken(null)
//     setauthuser(null)
//     setonlineusers([])
//     axios.defaults.headers.common["token"] = null
//     toast.success("Logout")
//     socket.disconnect()
//    }


//    const updataProfile  = async (body:any) =>{
//     try {
//       const {data} = await axios.put("/update",body)
//       if(data){
//         setauthuser(data.user)
//         toast.success("Profile Updated Successfully")
//       }
//     } catch (error) {
      
//     }
//    }


//   const connectSocket = async (userdata:any)=>{

//     if(!userdata || socket?.connected) return ;

//     const newSocket =  io(backendurl,{
//       query : {
//         userI  : userdata._id 
//       }
//     })

//     newSocket.connect();
//     setsocket(newSocket)

//     newSocket.on("getOnlineUsers",(userIds) =>{
//       setonlineusers(userIds)
//     })

//   }

  
//   useEffect(() => {
  
//     if(token){
//       axios.defaults.headers.common["token"] = token
//     }

//     CheckAuth()
  
//   }, [])
  
 

//   const value = {
//     axios,
//     authuser,
//     onlineusers,
//     socket,
//     login,
//     logout,
//     updataProfile,
//   }


//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )

// }





