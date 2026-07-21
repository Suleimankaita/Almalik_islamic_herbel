import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors";
import path from "path"
import multer from "multer";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT=process.env.PORT||5000

app.use(cors());

// app.use(cookie_parser())

app.use(express.json())

app.use(express.urlencoded({extended:true}))

const storage=multer.diskStorage({
  destination:(req, file, cb)=>cb(null,path.join(__dirname,'Public','Img')),
  filename:(req, file, cb)=>cb(null,Date.now()+'_'+req.filename)
})

const upload=multer({storage:storage})

// app.use(express.static(path.join(__dirname,"Public")))

app.use((req,res,next)=>{
    console.log(req.method,req.url)
})


app.listen(PORT, () => {
  console.log("Server running on port 5000");
});