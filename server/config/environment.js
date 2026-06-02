import dotenv from "dotenv";
dotenv.config();

if (!process.env.PORT) {
  console.warn("Warning: .env not loaded or missing variables");
}
