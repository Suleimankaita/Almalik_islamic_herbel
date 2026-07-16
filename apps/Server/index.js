import express from "express"
import cors from "cors";

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message: "Hello from Node!"
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});