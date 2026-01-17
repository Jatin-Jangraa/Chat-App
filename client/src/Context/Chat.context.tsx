import React, { createContext,  useEffect } from "react";
import { useAuth } from "./AuthContect";
import api from "../Api/Axios";

export interface IMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  image?: string;
  seen: boolean;
  createdAt: string;
}



const ChatContext = createContext<any | null>(null);



export const ChatProvider = ({children}: {children: React.ReactNode}) => {  

    const [messages , setmessages] =React.useState<IMessage[]>([])
    const [chatusers , setchatusers] = React.useState<any[]>([])
    const [selecteduser , setselecteduser] = React.useState<any>(null)
    const [unseenMessages , setunseenMessages] = React.useState<any>({})


    const  {socket} = useAuth()


        const getusers = async () =>{
            try {
                
             const users = await api.get("/api/message/users")

             setchatusers(users.data.allusers)
                setunseenMessages(users.data.unseenmessages)

            } catch (error) {
                  const message = (error as any).response?.data?.message || " failed"
                  alert(message)
            }
        }



        const getmessages = async (userId : string) =>{

            try {
                
               const res =  await api.get(`/api/message/${userId}`)
               setmessages(res.data)

            } catch (error) {
                const message = (error as any).response?.data?.message || " failed"
                alert(message)
            }   

        }





        const sendmessage = async (formdata: FormData) =>{
            try {
                
                const res = await api.post(`/api/message/send/${selecteduser._id}`, formdata)
                if(res){
                    setmessages((prev) => [...prev , res.data])
                }

            } catch (error) {
                const message = (error as any).response?.data?.message || " failed"
                alert(message)
            }
      }


        // const subscribeToNewMessages = React.useCallback(() => {
        //     if (!socket) return;

        //     socket.on("newMessage", (newMessage: any) => {
        //         if(selecteduser && newMessage.senderId === selecteduser._id){
        //             newMessage.seen = true;
        //             setmessages((prev) => [...prev, newMessage]);
        //             api.put(`/api/message/mark/${newMessage._id}`);
        //         }else{
        //             setunseenMessages((prev: any) =>({
        //                 ...prev , [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1
        //         }));    
        //     }});
        // }, [socket]);   
        


        const subscribeToNewMessages = React.useCallback(() => {
  if (!socket) return;

  socket.on("newMessage", (newMessage: any) => {
    if (selecteduser && newMessage.senderId === selecteduser._id) {
      newMessage.seen = true;
      setmessages(prev => [...prev, newMessage]);
      api.put(`/api/message/mark/${newMessage._id}`);
    } else {
      setunseenMessages((prev : any) => ({
        ...prev,
        [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1
      }));
    }
  });
}, [socket, selecteduser]);



        const unscribeFromNewMessages = () => {
            if (socket) socket.off("newMessage");
        }

        // useEffect(() => {
        //     subscribeToNewMessages();
        //     return () => {
        //         unscribeFromNewMessages();
        //     };
        // }, [socket , selecteduser]);

        useEffect(() => {
        subscribeToNewMessages();
        return unscribeFromNewMessages;
        }, [subscribeToNewMessages]);

        return (
        <ChatContext.Provider value={{messages , setmessages , chatusers , setchatusers , getusers , getmessages , sendmessage , selecteduser , setselecteduser , unseenMessages , setunseenMessages}}>
            {children}
        </ChatContext.Provider>
    )
}   


export const useChat = () => React.useContext(ChatContext);