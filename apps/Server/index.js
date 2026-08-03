import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import cookie_parser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./Routes/Login.js";
import { fileURLToPath } from "url";
import Reg from "./Routes/Registration.js"
import connected from "./Config/Connect.js";
import { option } from "./Config/Origin.js";
import Sales from "./Routes/Sales.js"
import UserSales from "./Routes/GetAllUserSale.js"
import GetAllUser from "./Routes/GetAllUser.js";
import Product from "./Routes/Product.js";
import fsp from "fs/promises"
import Refresh from "./Routes/Refresh.js"
import Logout from "./Routes/logout.js"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3500;

connected()

app.use(
  cors(option)
);

app.use(cookie_parser());

app.use(express.static(path.join(__dirname,"Public")))

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "Public", "Img")),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});

const upload = multer({ storage:storage });

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});


    
    app.get("/", (req, res) => {
      res.status(200).json({ status: "ok" });
    });


mongoose.connection.once('open',()=>{
console.log("MongoDB connected")
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
 
    app.use("/api/auth", authRoutes);
    
  
    app.use("/api/auth", Reg);
  
    app.use("/api/auth", Refresh);
  
    app.use("/api/auth/Logout", Logout);

    app.use("/api", GetAllUser);

    app.use("/api", Sales);
    
    app.use("/api", UserSales);

    app.use("/api/Product",upload.single('file'), Product);


  });

})