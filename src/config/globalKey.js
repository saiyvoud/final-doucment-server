import dotenv from "dotenv";
dotenv.config();

const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const SECRET_KEY = process.env.SECRET_KEY
const SECRET_KEY_REFRESH = process.env.SECRET_KEY_REFRESH
const PORT = process.env.PORT || 8000

export {
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  SECRET_KEY,SECRET_KEY_REFRESH,PORT
};