import express from "express"
import type { Request, Response } from "express";
import connectDB from "./src/config/mongodb.js";
const app = express();

app.get("/login", (req: Request, res: Response) => {
    res.send("login route");
    console.log("login route was running");
});
connectDB();
app.listen(8080, () =>{
    console.log("app is running");
}
);

console.log("end of t");