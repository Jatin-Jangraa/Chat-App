import { model, Schema, Types } from 'mongoose';
const messagemodel = new Schema({
    senderId: { type: Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Types.ObjectId, ref: "User", required: true },
    text: { type: String },
    image: { type: String },
    seen: { type: Boolean, default: false }
}, { timestamps: true });
export const Message = model("Message", messagemodel);
//# sourceMappingURL=Message.model.js.map