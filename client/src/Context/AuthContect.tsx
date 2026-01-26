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
               localStorage.setItem("accessToken",res.data.accessToken)
              //  connectSocket(res.data.user)
               setloading(false)
              //  return user
              restoreuser()
              
             } catch (error) {
               setloading(false)
               const message = (error as any).response?.data?.message || "Login failed"
               alert(message)
             }    
             }   
             
            

  const restoreuser = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      setloading(true)
      const res = await api.get("/api/user/getme",{
        headers:{
          Authorization : `Bearer ${token}`
        }
      })
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
      localStorage.removeItem("accessToken")
      // await api.get("/api/user/logout")
      socket?.disconnect()
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

    const newsocket : any = io(`${import.meta.env.VITE_BACKEND_SERVER}`,{
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







