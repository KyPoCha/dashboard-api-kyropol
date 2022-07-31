import express, {Request,Response,NextFunction} from "express";

import {userRouter} from "./users/users.js";

const port = 8000;
const app = express();

app.use((req: Request,res: Response, next: NextFunction)=>{
    console.log("Time:", Date.now());
    next();
});

app.get('/hello',(req : Request,res)=>{
    throw new Error("Error!!!!!");
});

app.use('/users',userRouter);
app.use((err: Error, req: Request, res: Response, next: NextFunction)=>{
   console.log(err.message);
   res.status(401).send(err.message);
});

app.listen(port, ()=>{
   console.log(`Server is loaded on https://localhost:${port}`);
});