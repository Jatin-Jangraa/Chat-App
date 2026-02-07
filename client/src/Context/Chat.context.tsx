import React, {
  createContext,
  useEffect,
  useCallback,
  useState,
  useRef,
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

interface ChatContextType {
  messages: IMessage[];
  loading :boolean ;
  setmessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  chatusers: any[];
  setchatusers: React.Dispatch<React.SetStateAction<any[]>>;
  selecteduser: any;
  setselecteduser: React.Dispatch<React.SetStateAction<any>>;
  unseenMessages: Record<string, number>;
  setunseenMessages: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
  getusers: () => void;
  getmessages: (userId: string) => void;
  sendmessage: (formdata: FormData) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setmessages] = useState<IMessage[]>([]);
  const [chatusers, setchatusers] = useState<any[]>([]);
  const [selecteduser, setselecteduser] = useState<any>(null);
  const [loading,setloading] = useState<boolean>(false)
  const [unseenMessages, setunseenMessages] = useState<Record<string, number>>(
    {}
  );

  const { socket } = useAuth();
  const token = localStorage.getItem("accessToken");

  // 🔊 Notification sound (persisted)
  const notificationSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    notificationSound.current = new Audio("/sound.mp3");
  }, []);

  // 🔔 Request notification permission once
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // 🔔 Desktop notification + sound
  const showDesktopNotification = (message: IMessage) => {
    if (Notification.permission !== "granted") return;

    // play sound always
    notificationSound.current?.play().catch(() => {});

    // show popup only if tab is hidden
    if (document.hidden) {
      new Notification("New Message", {
        body: message.text || "You received a message",
        icon: "/chat.png",
      });
    }
  };

  // 📌 Get chat users
  const getusers = async () => {
    try {
      const res = await api.get("/api/message/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setchatusers(res.data.allusers);
      setunseenMessages(res.data.unseenmessages || {});
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to load users");
    }
  };

  // 📌 Get messages with a user
  const getmessages = async (userId: string) => {
    try {
      const res = await api.get(`/api/message/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setmessages(res.data);

      // clear unseen count
      setunseenMessages(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to load messages");
    }
  };

  // 📤 Send message
  const sendmessage = async (formdata: FormData) => {
    if (!selecteduser) return;

    try {
      setloading(true)
      const res = await api.post(
        `/api/message/send/${selecteduser._id}`,
        formdata,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setmessages(prev => [...prev, res.data]);
      setloading(false)
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to send message");
      setloading(false)
    }
  };

  // 🔥 Socket listener (clean & stable)
  const subscribeToNewMessages = useCallback(() => {
    if (!socket) return;

    socket.off("newMessage");

    socket.on("newMessage", async (newMessage: IMessage) => {
      // chat is open
      if (selecteduser && newMessage.senderId === selecteduser._id) {
        newMessage.seen = true;
        setmessages(prev => [...prev, newMessage]);

        // mark seen
        try {
          await api.put(
            `/api/message/mark/${newMessage._id}`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } catch {}
      } else {
        // background message
        showDesktopNotification(newMessage);

        setunseenMessages(prev => ({
          ...prev,
          [newMessage.senderId]:
            (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    });
  }, [socket, selecteduser, token]);

  useEffect(() => {
    subscribeToNewMessages();
    return () => {
      socket?.off("newMessage");
    };
  }, [subscribeToNewMessages, socket]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        loading,
        setmessages,
        chatusers,
        setchatusers,
        selecteduser,
        setselecteduser,
        unseenMessages,
        setunseenMessages,
        getusers,
        getmessages,
        sendmessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = React.useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};
