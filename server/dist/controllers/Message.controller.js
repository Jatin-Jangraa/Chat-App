import { User } from "../models/User.model.js";
import { Message } from "../models/Message.model.js";
import cloudinary from "../config/cloudinary.js";
import { io, userSocketMap } from "../index.js";
import mongoose, { Types } from "mongoose";
export const listofusers = async (req, res) => {
    try {
        const userId = req.user.userid;
        const allusers = await User.find({ _id: { $ne: userId } }).select("-password");
        const unseenmessages = {};
        const promises = allusers.map(async (user) => {
            const message = await Message.find({ senderId: user._id, receiverId: userId, seen: false });
            if (message.length > 0) {
                unseenmessages[user._id.toString()] = message.length;
            }
        });
        await Promise.all(promises);
        res.json({ allusers, unseenmessages });
    }
    catch (error) {
        res.json(error);
    }
};
export const messaagesofuser = async (req, res) => {
    try {
        const myId = new Types.ObjectId(req.user.userid);
        const selectedUserId = new Types.ObjectId(req.params.id);
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId },
            ]
        }).sort({ createdAt: 1 });
        await Message.updateMany({ senderId: selectedUserId, receiverId: myId }, { seen: true });
        res.json(messages);
    }
    catch (error) {
        res.json(error);
    }
};
export const markmessgeasSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });
        res.json({ message: "Updated" });
    }
    catch (error) {
        res.json(error);
    }
};
export const sendMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user.userid;
        let imageurl = "";
        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, { folder: 'profiles' });
            imageurl = uploadResult.secure_url;
        }
        const newMessage = await Message.create({
            senderId: new mongoose.Types.ObjectId(senderId),
            receiverId: new mongoose.Types.ObjectId(receiverId),
            text: text ?? "",
            image: imageurl ?? ""
        });
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.json(newMessage);
    }
    catch (error) {
        res.json(error);
    }
};
//# sourceMappingURL=Message.controller.js.map