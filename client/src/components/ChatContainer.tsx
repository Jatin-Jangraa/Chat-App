// import React from 'react'

import { useEffect, useRef, useState } from "react"
import assets from "../assets/assets"
import { Time } from "../Utils/Date"
import { useChat } from "../Context/Chat.context"
import { useAuth } from "../Context/AuthContect"
import { TiTick } from "react-icons/ti";
import Loader from "./Loader"





const ChatContainer = () => {

  const scrollend = useRef<HTMLDivElement | null>(null)

  const {selecteduser , setselecteduser,loading , messages, sendmessage , getmessages} = useChat()
  console.log(messages);

    useEffect(() => {
  return () => {
    setselecteduser(null);
  };
}, []);
  
  const {user , onlineusers} = useAuth()

  const [inputmessage , setinputmessage] =  useState<string>("")
  const [image, setimage] = useState<any> (null)
 



  const handleSendMessage = async (e: React.FormEvent) => {

    e.preventDefault();

    const formdata = new FormData();

    formdata.append("text" , inputmessage.trim())
    if(image){
      formdata.append("image" , image)
    }

    await sendmessage(formdata)
    setinputmessage("")
    setimage(null)
  }


 

  useEffect(() => {
    if(selecteduser){
      getmessages(selecteduser._id)
    } 
  }, [selecteduser])

  useEffect(() => {
    if (scrollend.current && messages) {
      scrollend.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])


  return selecteduser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">

      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img src={selecteduser.avatar ? selecteduser.avatar : assets.avatar_icon} alt="" className="w-8 rounded-full" />
        <p className="flex-1 text-lg text-white flex items-center gap-2">{selecteduser.name}
          {onlineusers.includes(selecteduser._id) ? <span className="w-2 h-2 rounded-full bg-green-500"></span> : null}
        </p>
        <img onClick={() => setselecteduser(null)} src={assets.arrow_icon} alt="" className="md:hidden max-w-7" />
        <img src={assets.help_icon} alt="" className="max-md:hidden max-w-5" />
      </div>

      {/* chat area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages?.map((msg:any, index:any) => (
          <div key={index}
           className={`flex items-end gap-2 justify-end ${msg.senderId !== user?._id && "flex-row-reverse"}`}
           >
            {msg.image ? (
              <img onClick={()=>{ window.open(msg.image, "_blank", "noopener,noreferrer");}} src={msg.image} className="cursor-pointer max-w-57.5 border border-gray-700 rounded-lg overflow-hidden mb-8" />
            ) : <p className={`p-2 max-w-50 md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === user?._id ? "rounded-br-none" : "rounded-bl-none"}`}>{msg.text}</p>}
            <div className="text-center text-xs">
              {<img  src={msg.senderId === user?._id ? user?.avatar || assets.avatar_icon : selecteduser.avatar ||  assets.avatar_icon} alt="" className="w-7 rounded-full" />}
              {<p className="text-gray-500">{Time(msg.createdAt)}</p>}
            </div>
          </div>
        ))}
        <div ref={scrollend}>

        </div>
      </div>

      {/* bottom */}

      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400" type="text" placeholder="Type a Message..." value={inputmessage} onKeyDown={(e) => e.key === "Enter" ? "" : null} onChange={(e) => setinputmessage(e.target.value)}/>
          <input  type="file" name="" onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{{setimage(e.target.files![0])} }}  id="image" accept="image/png , image/jpg" hidden />
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="" className="w-5 mr-2 cursor-pointer" />
          </label>
         {image && <label className="text-white"><TiTick/></label>}
        </div>
        {!loading ?
      <img  src={assets.send_button} onClick={handleSendMessage} alt=""  className="w-7 cursor-pointer"/>
     : <div className="h-full w-auto p-2 items-center justify-center bg-purple-900 rounded-full">
         <div className=" inset-0 z-50 flex items-center justify-center bg-purple-900">
      <div
        className="h-4 w-4 animate-spin rounded-full border-4 border-purple-900 border-t-blue-500"
        role="status"
        aria-label="Loading"
      />
    </div>
      </div>}
      </div>

    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} className="max-w-16" alt="" />
      <p className="text-lg font-medium text-white">Chatty Anywhere</p>
    </div>
  )
}

export default ChatContainer