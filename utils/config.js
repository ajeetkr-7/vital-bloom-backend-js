import dotenv from 'dotenv';
dotenv.config();


const CONFIG = {
  PORT: process.env.PORT || 8081,
  MONGOOSE_URI: process.env.MONGOOSE_URI,
  BCRYPT_ROUNDS: Number(process.env.BCRYPT_ROUNDS),
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '1m',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  MULTER_MEDIA_DESTINATION: process.env.MULTER_MEDIA_DESTINATION,
  IS_PRODUCTION: process.env.NODE_ENV == 'production' ? true : false,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
};


export default CONFIG;
