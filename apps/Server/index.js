import express from "express"
import cors from "cors";
import path from "path"
const app = express();
const PORT=process.env.PORT||5000
app.use(cors());

// app.use(cookie_parser())

app.use(express.json())

app.use(express.urlencoded({extended:true}))

// app.use(express.static(path.join(__dirname,"Public")))

app.use((req,res,next)=>{
    console.log(req.method,req.url)
})


app.listen(PORT, () => {
  console.log("Server running on port 5000");
});