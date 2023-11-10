import express from "express";
import { 
REGISTER_USER,
LOGIN,
GET_NEW_JWT_TOKEN,
GET_ALL_USERS,
GET_USER_BY_ID,
BUY_TICKET,
GET_ALL_USERS_WITH_TICKETS,
GET_USER_BY_ID_WITH_TICKETS } from "../controllers/user.js";
import validation from "../middleware/validation.js";
import auth from "../middleware/auth.js"
import {userRegistrationSchema} from "../validation/userSchema.js";
const router = express.Router();

router.get("/usersWithTicketInfo", auth, GET_ALL_USERS_WITH_TICKETS);
router.get("/", auth, GET_ALL_USERS);
router.get("/:id", auth, GET_USER_BY_ID);
router.get("/userByIdwithTicketInfo/:id", auth,  GET_USER_BY_ID_WITH_TICKETS);
router.put("/buyTicket/:id", auth, BUY_TICKET);
router.post("/signUp", validation(userRegistrationSchema), REGISTER_USER);
router.post("/login", LOGIN);
router.post("/getNewToken", GET_NEW_JWT_TOKEN);

export default router;