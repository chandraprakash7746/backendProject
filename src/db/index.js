
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`); // mongoose hme ek return object deta hai jise hum ek variable me bhi store kr skte hai
        
        console.log(`\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`) // connection and host kahase aaye and inhe yeha likhne ka kya mtlv hai

    }catch(error){
        console.error("MongoDB connection Error : ",error);
        // throw error;
        process.exit(1); // process kya hai ? kya yea node.js se aaya he
    }
}

export default connectDB;