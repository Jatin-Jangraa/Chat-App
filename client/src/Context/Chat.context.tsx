import React, {
  createContext,
  useEffect,
  useCallback,
  useState,
} from "react";
import api from "../Api/Axios";
import { useAuth } from "./AuthContect";

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

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setmessages] = useState<IMessage[]>([]);
  const [chatusers, setchatusers] = useState<any[]>([]);
  const [selecteduser, setselecteduser] = useState<any>(null);
  const [unseenMessages, setunseenMessages] = useState<any>({});

  const { socket } = useAuth();
  const token = localStorage.getItem("accessToken");

  // 🔊 Notification sound
  const notificationSound = new Audio("/sound.mp3");

  // 🔔 Desktop notification + sound + open chat
  const showDesktopNotification = (message: IMessage) => {
    if (
      Notification.permission === "granted" &&
      document.hidden
    ) {
      // 🔊 Play sound
      notificationSound.currentTime = 0;
      notificationSound.play().catch(() => {});

      new Notification("New Message", {
        body: message.text || "You received a message",
        icon: "/chat.png",
      });

     
    }
  };

  const getusers = async () => {
    try {
      const users = await api.get("/api/message/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setchatusers(users.data.allusers);
      setunseenMessages(users.data.unseenmessages);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed");
    }
  };

  const getmessages = async (userId: string) => {
    try {
      const res = await api.get(`/api/message/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setmessages(res.data);

      setunseenMessages((prev: any) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed");
    }
  };

  const sendmessage = async (formdata: FormData) => {
    try {
      const res = await api.post(
        `/api/message/send/${selecteduser._id}`,
        formdata,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res) setmessages(prev => [...prev, res.data]);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed");
    }
  };

  // 🔥 Socket listener
  const subscribeToNewMessages = useCallback(() => {
    if (!socket) return;

    socket.on("newMessage", (newMessage: IMessage) => {
      // Chat already open
      if (selecteduser && newMessage.senderId === selecteduser._id) {
        newMessage.seen = true;
        setmessages(prev => [...prev, newMessage]);
        api.put(`/api/message/mark/${newMessage._id}`);
      } 
      // Background → notify
      else {
        showDesktopNotification(newMessage);

        setunseenMessages((prev: any) => ({
          ...prev,
          [newMessage.senderId]:
            (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    });
  }, [socket, selecteduser]);

  const unsubscribeFromNewMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToNewMessages();
    return unsubscribeFromNewMessages;
  }, [subscribeToNewMessages]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        setmessages,
        chatusers,
        setchatusers,
        getusers,
        getmessages,
        sendmessage,
        selecteduser,
        setselecteduser,
        unseenMessages,
        setunseenMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => React.useContext(ChatContext);
