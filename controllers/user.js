import { ObjectId } from 'mongodb';
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import UserSchema from '../models/user.js';
import TicketSchema from '../models/ticket.js';

const REGISTER_USER = async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const capitalizedName = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1);

    const user = new UserSchema({
      name: capitalizedName,
      email: req.body.email,
      password: hash,
      bought_tickets: [],
      money_balance: req.body.money_balance,
    });

    user.id = user._id;

    const response = await user.save();

    return res
      .status(200)
      .json({ status: "User registered", response: response });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "Something went wrong" });
  }
};


  
const LOGIN = async (req, res) => {
  try {
    const user = await UserSchema.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "Bad email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordMatch) {
      return res.status(404).json({ message: "Bad email or password" });
    }

    const accessToken = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h", algorithm: "HS256" }
    );

    const refreshToken = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "24h", algorithm: "HS256" }
    );

    return res.status(200).json({ token: accessToken, refreshToken });
  } catch (error) {
    console.error("Error in LOGIN:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const GET_NEW_JWT_TOKEN = async (req, res) => {
  try {
    const refreshToken = req.headers.authorization;

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Log in again" });
      }

        const accessToken = jwt.sign(
        { email: decoded.email, userId: decoded.userId },
        process.env.JWT_SECRET,
        { expiresIn: "2h", algorithm: "HS256" }
      );

      return res.status(200).json({ token: accessToken, refreshToken });
    });
  } catch (error) {
    console.error("Error in GET_NEW_JWT_TOKEN:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const GET_ALL_USERS = async (req, res) => {
  try {
    const users = await UserSchema.find().sort({ name: 1 }); 
    return res.status(201).json(users);
  } catch (err) {
    console.log("ERROR: ", err);
    res.status(500).json({ response: "something went wrong" });
  }
}

const GET_USER_BY_ID = async (req, res) => {
  try {
    const user = await UserSchema.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ response: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("ERROR: ", error);
    res.status(500).json({ response: "Something went wrong" });
  }
};

const BUY_TICKET = async (req, res) => {
  try {
    const user = await UserSchema.findById(req.body.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const ticket = await TicketSchema.findOne({ id: req.params.id });
 
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const ticketPrice = ticket.ticket_price;

    if (user.money_balance < ticketPrice) {
      return res.status(400).json({ message: "Not enough money in balance" });
    }

    user.money_balance -= ticketPrice;
    await user.save();

    await UserSchema.updateOne(
      { id: user.id }, 
      { $push: { bought_tickets: req.params.id } } 
    );

    res.status(200).json({ message: "Ticket has been added" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const GET_ALL_USERS_WITH_TICKETS = async(req, res)=>{
  try {
    const users = await UserSchema.aggregate([
      {
        $lookup: {
          from: "tickets",
          localField: "bought_tickets",
          foreignField: "id",
          as: "ticket_info",
        },
      }
    ]);

    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "something went wrong" });
  }
}

const GET_USER_BY_ID_WITH_TICKETS = async (req, res) => {
  try {
    const userId = req.params.id; 
    console.log(userId)

    const users = await UserSchema.aggregate([
      {
        $lookup: {
          from: "tickets",
          localField: "bought_tickets",
          foreignField: "id",
          as: "ticket_info",
        },
      },
      {
        $match: { id: userId },
      },
    ]);

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(users[0]); 
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


  export { 
  REGISTER_USER,
  LOGIN,
  GET_NEW_JWT_TOKEN,
  GET_ALL_USERS,
  GET_USER_BY_ID,
  BUY_TICKET, GET_ALL_USERS_WITH_TICKETS,
  GET_USER_BY_ID_WITH_TICKETS };