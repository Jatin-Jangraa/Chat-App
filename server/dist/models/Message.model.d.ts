import { Schema, Types } from 'mongoose';
export declare const Message: import("mongoose").Model<{
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    seen: boolean;
    text?: string | null;
    image?: string | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    seen: boolean;
    text?: string | null;
    image?: string | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    seen: boolean;
    text?: string | null;
    image?: string | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    seen: boolean;
    text?: string | null;
    image?: string | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    seen: boolean;
    text?: string | null;
    image?: string | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    seen: boolean;
    text?: string | null;
    image?: string | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: import("mongoose").SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: import("mongoose").SchemaDefinitionProperty<any, any, import("mongoose").Document<unknown, {}, {
        senderId: Types.ObjectId;
        receiverId: Types.ObjectId;
        seen: boolean;
        text?: string | null;
        image?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        senderId: Types.ObjectId;
        receiverId: Types.ObjectId;
        seen: boolean;
        text?: string | null;
        image?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    seen: boolean;
    text?: string | null;
    image?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    seen: boolean;
    text?: string | null;
    image?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Message.model.d.ts.map