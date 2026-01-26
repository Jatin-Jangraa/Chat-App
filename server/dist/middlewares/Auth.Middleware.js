import jwt from 'jsonwebtoken';
export const Protect = async (req, res, next) => {
    try {
        //  let token = req.cookies?.accessToken;
        const authheader = req.headers.authorization;
        if (!authheader && !authheader?.startsWith("Bearer")) {
            return res.sendStatus(401);
        }
        const token = authheader.split(' ')[1];
        // if (!token && req.headers.authorization) {
        //   token = req.headers.authorization.split(" ")[1];
        // }
        if (!token)
            return res.sendStatus(401);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.sendStatus(401);
    }
};
//# sourceMappingURL=Auth.Middleware.js.map