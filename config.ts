import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  NGROK_AUTHTOKEN: process.env.NGROK_AUTHTOKEN,
  USER_SIIGO_CORPRECAM: process.env.USER_SIIGO_CORPRECAM || "",
  PASSWORD_SIIGO_CORPRECAM: process.env.PASSWORD_SIIGO_CORPRECAM || "",
  USER_SIIGO_RECICLEMOS: process.env.USER_SIIGO_RECICLEMOS || "",
  PASSWORD_SIIGO_RECICLEMOS: process.env.PASSWORD_SIIGO_RECICLEMOS || "",
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
  DB_PORT: Number(process.env.DB_PORT),
};
