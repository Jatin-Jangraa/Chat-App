import type { Response } from "express";
import type { AuthRequest } from "../middlewares/Auth.Middleware.js";
export declare const listofusers: (req: AuthRequest, res: Response) => Promise<void>;
export declare const messaagesofuser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const markmessgeasSeen: (req: any, res: Response) => Promise<void>;
export declare const sendMessage: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=Message.controller.d.ts.map