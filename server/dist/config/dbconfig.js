import mongoose from 'mongoose';
export const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI ?? "");
        console.log("MongoDB connected Successfully");
    }
    catch (error) {
        console.error(`Error : ${error}`);
    }
};
//# sourceMappingURL=dbconfig.js.map