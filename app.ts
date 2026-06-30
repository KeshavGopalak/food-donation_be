import express from "express"
import type { Request, Response } from "express";
const app = express();
app.get("/", (req: Request, res: Response) => {
    res.send("backend started");
    console.log("app was running");
});

app.listen(8080, () =>{
    console.log("app is running");
}
);
console.log("end of the file");