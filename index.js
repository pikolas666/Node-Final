import express from 'express';
const app = express();
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
app.use(express.json());
import cors from "cors";
import userRoute from "./routes/user.js";
import ticketRoute from "./routes/ticket.js";
app.use(cors());
app.use("/users", userRoute);
app.use("/tickets", ticketRoute);

mongoose
 
  .connect(process.env.DB_CONNECTION)
  .then(() => console.log("Connected to DB!"))
  .catch((err) => {
    console.log("ERROR:", err);
  });
  

  app.use((req, res) => {
    return res.status(404).json({ response: "Endpoint not exist" });
  });


app.listen(process.env.PORT, () => {

    console.log(`App started on port ${process.env.PORT}`);
  });