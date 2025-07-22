import dotenv from 'dotenv';
dotenv.config();

// eslint-disable-next-line no-undef
const MONGODB_URI = process.env.MONGODB_URI;
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3003;

export default {
    MONGODB_URI,
    PORT
};