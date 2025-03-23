import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const { PORT, DB_URI } = process.env;

const databaseConnection = async () => {
    try {
        await mongoose.connect(DB_URI);
        return mongoose.connection.readyState;
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export default databaseConnection;