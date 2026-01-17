import type { NextFunction, Request, Response } from 'express';
export interface AuthRequest extends Request {
    user?: any;
}
export declare const Protect: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=Auth.Middleware.d.ts.map