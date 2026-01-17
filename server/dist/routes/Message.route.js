import express, {} from 'express';
import { listofusers, markmessgeasSeen, messaagesofuser, sendMessage } from '../controllers/Message.controller.js';
import { Protect } from '../middlewares/Auth.Middleware.js';
import { upload } from '../middlewares/Upload.js';
const msgrouter = express.Router();
msgrouter.get("/users", Protect, listofusers);
msgrouter.get("/:id", Protect, messaagesofuser);
msgrouter.put("/mark/:id", Protect, markmessgeasSeen);
msgrouter.post("/send/:id", upload.single("image"), Protect, sendMessage);
export default msgrouter;
//# sourceMappingURL=Message.route.js.map