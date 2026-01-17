import { model, Schema } from 'mongoose';
const schema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    about: { type: String, default: "Hello" }
}, { timestamps: true });
export const User = model("User", schema);
//# sourceMappingURL=User.model.js.map