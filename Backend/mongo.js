import mongoose from "mongoose";
dotenv.config();
import dotenv from 'dotenv';

// eslint-disable-next-line no-undef
const mongoUrl = process.env.MONGODB_URI;
mongoose.connect(mongoUrl);

export default mongoose;