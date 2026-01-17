import express from 'express';
import { getMe, logout, signin, signup, updateProfile } from '../controllers/User.controller.js';
import { upload } from '../middlewares/Upload.js';
import { Protect } from '../middlewares/Auth.Middleware.js';
export const userroute = express.Router();
userroute.post('/signup', upload.single('avatar'), signup);
userroute.post('/signin', upload.none(), signin);
userroute.get('/logout', logout);
userroute.get("/getme", Protect, getMe);
userroute.post("/update", Protect, upload.single('avatar'), updateProfile);
userroute.get('/test', (req, res) => {
    res.json({ message: 'User route is working' });
});
//# sourceMappingURL=User.js.map