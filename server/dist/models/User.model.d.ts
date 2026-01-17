export interface IUser extends Document {
    _id: string;
    name: string;
    username: string;
    password: string;
    about: string;
    avatar: string;
}
export declare const User: import("mongoose").Model<IUser, {}, {}, {}, import("mongoose").Document<unknown, {}, IUser, {}, import("mongoose").DefaultSchemaOptions> & IUser & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
//# sourceMappingURL=User.model.d.ts.map